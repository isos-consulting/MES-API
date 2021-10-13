#!/bin/bash 
cd /home/centos/iso-server
pm2 start --name iso-server yarn -- start