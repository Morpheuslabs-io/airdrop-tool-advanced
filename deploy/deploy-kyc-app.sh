#!/usr/bin/env bash

if [[ $# -eq 0 ]]
then
  echo 'Use the default .params file'
  PARAMS_FILE='.params'
else
  echo 'Use the provided .params file'
  PARAMS_FILE=${1}
fi

# Load params file
set -a; [ -f ${PARAMS_FILE} ] && . ${PARAMS_FILE}; set +a;

# Only for test
# echo ${EMAIL_WHITELIST}
# exit

# Pull latest img
docker pull midotrinh/kyc-web:latest

# Deploy
docker-compose -f docker-compose.yml up --force-recreate -d
