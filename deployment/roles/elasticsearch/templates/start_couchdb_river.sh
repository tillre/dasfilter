#!/bin/bash

set -e

curl -XPUT 'localhost:9200/_river/df/_meta' -d '{
    "type" : "couchdb",
    "couchdb" : {
        "host" : "{{ groups['db'][0] }}",
        "port" : 80,
        "user" : "{{ app_key }}",
        "password": "{{ app_secret }}",
        "db" : "df",
        "filter" : null,
        "script" : "ctx._type = ctx.doc.type_; if (!(ctx.doc.type_ == \"Article\" && ctx.doc.state == \"published\")) { ctx.ignore = true; }"
    },
    "index" : {
        "index" : "df",
        "bulk_size" : "100",
        "bulk_timeout" : "10ms"
    }
}'