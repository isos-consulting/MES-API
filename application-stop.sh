#!/bin/bash 
echo "/root/node_modules/.bin/pm2 start --name iso-server yarn -- start"
/root/node_modules/.bin/pm2 kill