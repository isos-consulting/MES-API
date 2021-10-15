#!/bin/bash 
cd /var/iso-server
pm2 start --name iso-server yarn -- start