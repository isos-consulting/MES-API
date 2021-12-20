#!/bin/bash 
source /etc/profile.d/codedeploy.sh
cd /var/${DEPLOYMENT_GROUP_NAME}
/root/node_modules/.bin/pm2 start --name ${DEPLOYMENT_GROUP_NAME} yarn -- start