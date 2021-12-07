#!/bin/bash 
cd /var/${DEPLOYMENT_GROUP_NAME}
yarn install
yarn add tsc
yarn api-docs-all