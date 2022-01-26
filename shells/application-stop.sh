#!/bin/bash 
id=$(/root/node_modules/.bin/pm2 id iso-server)
if [ "$id" != "[]" ] 
then
  /root/node_modules/.bin/pm2 delete iso-server
fi