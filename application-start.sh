#!/bin/bash 
export PATH=$PATH:$HOME/node_modules/.bin/
pm2 kill

cd /var/iso-server
pm2 start --name iso-server yarn -- start