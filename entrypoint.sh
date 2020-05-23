#!/bin/sh

#bundle install > /dev/null 2>&1
gulp > /dev/stdout 2>&1

# This will exec the CMD from your Dockerfile, i.e. "npm start"
exec "$@"
