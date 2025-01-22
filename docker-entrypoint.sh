#!/bin/sh

if [ -z "$REDIS_URL" ]; then
  export REDIS_URL="redis://127.0.0.1:6379"
fi

echo "Using Redis URL: $REDIS_URL"
exec "$@"