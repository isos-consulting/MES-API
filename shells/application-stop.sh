#!/bin/bash 
id=$(/root/node_modules/.bin/pm2 id ${DEPLOYMENT_GROUP_NAME})
if [ "$id" != "[]" ] 
then
  /root/node_modules/.bin/pm2 delete ${DEPLOYMENT_GROUP_NAME}
fi