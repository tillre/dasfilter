#!/bin/bash

export NODE_ENV=development

export DF_DB_URL=http://admin:secret@couchdb:5984/df

export DF_ADMIN_USERNAME=admin
export DF_ADMIN_PASSWORD=secretsecret

export DF_APP_KEY=dasfilter
export DF_APP_SECRET=secret

export DF_COOKIE_PASS=CCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCC

export DF_STATIC_URL='http://localhost:4569/s3/df-dev'
export DF_S3_ENDPOINT='http://s3:4569'
export DF_S3_KEY='SOMEKEY',
export DF_S3_SECRET='SOMESECRET',
export DF_S3_BUCKET='df-dev'

# Make sure couchdb db exists
curl -XPUT ${DF_DB_URL}

./node_modules/.bin/gulp serve-dev
