#!/bin/sh

#bundle install > /dev/null 2>&1
gulp > /var/log/gulp.log 2>&1

# This will exec the CMD from your Dockerfile, i.e. "npm start"
exec "$@"
