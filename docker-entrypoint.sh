#!/bin/sh

if [ -z "$REDIS_URL" ]; then
  export REDIS_URL="redis://localhost:6379"
fi

if [ -z "$ROOT_URL" ]; then
  ROOT_URL="https://${OSC_HOSTNAME}"
fi

if [ -z "$CALLBACK_LISTENER_URL" ]; then
  export CALLBACK_LISTENER_URL="${ROOT_URL}/encoreCallback"
fi

export ROOT_URL
echo "Using Redis URL: $REDIS_URL"
echo "Using ROOT_URL: $ROOT_URL"
echo "Using CALLBACK_LISTENER_URL: $CALLBACK_LISTENER_URL"
exec "$@"
