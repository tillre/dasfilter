#!/bin/bash
set -e

show_help() {
  echo """
  Commands
  start            : start node server
  start_dev        : start dev server
  eval             : eval shell command
  bash             : run bash
  """
}

case "$1" in
  "start" )
    ./start-prod.sh
  ;;
  "start_dev" )
    until curl -s "http://couchdb:5984" > /dev/null; do
      >&2 echo "Waiting for couchdb..."
      sleep 1
    done
    ./start-dev.sh
  ;;
  "eval" )
    eval "${@:2}"
  ;;
  "bash" )
    bash
  ;;
  * )
    show_help
  ;;
esac
