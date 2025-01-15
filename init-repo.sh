#!/bin/bash

usage() {
    echo "USAGE: $0 [-h] [-o] TEMPLATE"
    echo
    echo "  -h Print help"
    echo "  -o Init open source project"
    echo "  -b Select branch if running outside of templates repo"
}

main_repo=${MAIN_REPO:-git@github.com:Eyevinn/templates.git}
main_repo_branch=${MAIN_REPO_BRANCH:-main}

opensource=
template=
branch=main
while getopts "hob:" arg; do
  case $arg in
    h)
        usage
        exit 0
        ;;
    o)
        opensource=1
        ;;
    b)
        branch=${OPTARG}
  esac
done

shift $((OPTIND-1))

template=$1

if [ -z "$template" ]
then
    echo "TEMPLATE must be specified"
    usage
    exit 1
fi

template_type=${template%%-*}

if [ ! -d .git ]
then
    echo "No gitrepo detected."
    read -p "Do you want to clone from ${main_repo}? " -n 1 -r
    echo    # (optional) move to a new line
    if [[ ! $REPLY =~ ^[Yy]$ ]]
    then
        exit 1
    fi
    if [ "$(ls -A .)" ]
    then
        echo "Can only clone into empty folder. Clear current folder and try again"
        exit 1
    fi
    echo "Cloning branch ${branch} from ${main_repo}"
    git clone --branch ${branch} --depth 1 ${main_repo} .
    rm -rf .git
    git init .
    git add .
    git commit -m 'chore: first commit'
fi

shopt -s extglob
if [ ! -f "$(basename $0)" ]
then
    # This means we are in a gitrepo that is not based on the templates repo,
    # so we check out templates elsewhere
    if [ "$(ls -A .)" ]
    then
        read -p "Importing template may cause files to be overwritten, continue anyway? " -n 1 -r
        echo    # (optional) move to a new line
        if [[ ! $REPLY =~ ^[Yy]$ ]]
        then
            exit 1
        fi
    fi
    
    temp_template_dir=$(mktemp -d templatesXXX)
    git clone ${main_repo} --branch ${branch} ${temp_template_dir}
    rm -rf ${temp_template_dir}/.git
    rm ${temp_template_dir}/.gitignore
else
    is_template_repo=1
    temp_template_dir=temp
    mkdir ${temp_template_dir}
    mv !(${temp_template_dir}) ${temp_template_dir}
    rm .gitignore
fi

if [ ! -d "${temp_template_dir}/${template}" ]
then
    echo "Unknown template: ${template}"
    exit 1
fi


if [[ -z "$opensource" ]]
then
    cp ${temp_template_dir}/documents/readme-default.md README.md
else
    cp ${temp_template_dir}/documents/readme-opensource.md README.md
    cp ${temp_template_dir}/documents/CONTRIBUTING.md .
    cp ${temp_template_dir}/documents/LICENSE .
fi

shopt -s dotglob # Make wildcard match dot-files
if [ -d "${temp_template_dir}/${template_type}-default" ]
then
    cp -r "${temp_template_dir}/${template_type}-default"/* ./
fi

rm readme-*.md

cp -r ${temp_template_dir}/$template/* ./
rm -rf ${temp_template_dir}

git add .
if [ -n "$is_template_repo" ]
then
    git commit --amend --reset-author -m 'chore: first commit'
else
    git commit -m "chore: import template ${template}"
fi


