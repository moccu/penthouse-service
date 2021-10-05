#!/usr/bin/env sh
set -e

if [ "$1" = "$CONTAINER_COMMAND" ] && [ "$(id -u)" = '0' ]; then
    exec gosu "$CONTAINER_USER" "$@"
fi

exec "$@"
