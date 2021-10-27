#!/bin/bash 
cd /var/iso-server
/root/node_modules/.bin/pm2 start --name iso-server yarn -- start