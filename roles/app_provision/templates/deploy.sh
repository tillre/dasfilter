#!/bin/bash

set -e

cd {{ deploy_home }}
source env_setup
cd {{ app_dir }}
git pull
npm update
gulp update-plugin-packages
gulp build

forever stopall
forever start index.js