#!/bin/bash 
sudo cd /home/centos/iso-server
sudo pm2 start --name iso-server yarn -- start