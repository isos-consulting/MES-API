#!/bin/bash 
aws s3 cp s3://s3-isos-environment/iso.env /var/iso-server/.env
cd /var/iso-server
/root/node_modules/.bin/pm2 start --name iso-server yarn -- start