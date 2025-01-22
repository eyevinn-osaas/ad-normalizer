#!/bin/sh

if [ -z "$REDIS_URL" ]; then
  export REDIS_URL="redis://localhost:6379"
fi

echo "Using Redis URL: $REDIS_URL"
exec "$@"
