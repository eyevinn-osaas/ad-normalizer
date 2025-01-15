# Eyevinn Templates

Welcome 👋
This is the repository containing all base templates for Eyevinn projects big and small, internal & external.

We use these templates to ensure that all our projects are built with the same tools and setup, and to make it easier for new developers to get started.

## Getting started

To create a new github repo based on a template, follow the steps below

1. Follow the instructions [here](https://docs.github.com/en/repositories/creating-and-managing-repositories/creating-a-repository-from-a-template) to use this template repository.
2. Clone the repository created in step 1.
3. From inside the new repository, run the `init-repo.sh` script with your preferred template as argument, ie `./init-repo.sh typescript-nodejs`. For open source projects run the script with the `-o` flag.
4. Start coding!

### Alternative workflow: Import template into existing gitrepo or empty directory
The `init-repo.sh` script can also be used to import a template into an existing gitrepo that is not based on the templates gitrepo, or to create a new gitrepo from a template in an empty directory. In the former case the template files will be added in a new commit, while in the latter case an initial commit containing the template files will be added.

To import a template, from inside the directory where the template files should be imported run
`PATH-TO-TEMPLATES-REPO/init-repo.sh TEMPLATE`

Note that if the directory is not empty the script may overwrite existing files.

### Importing template from a branch
The `-b` flag can be passed to the script to import a template from a branch of the templates repository.
