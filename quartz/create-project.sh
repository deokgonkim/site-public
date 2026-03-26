#!/bin/bash

if [ -z "$1" ]; then
    echo "./create-project.sh project-name"
    exit 1
fi

npx degit jackyzha0/quartz $1

