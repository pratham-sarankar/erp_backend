#!/bin/bash

# Set up SSH connection
ssh_host="ec2-65-2-116-3.ap-south-1.compute.amazonaws.com"
ssh_port="22"
ssh_user="ubuntu"
ssh_key="~/Documents/ssh/crm_keypair.pem"

# Set up local and remote paths
local_path="../*"
remote_path="/var/www/api.gyanishyogaschool.com"

rsync -avL -v --exclude 'node_modules'  --progress  -e "ssh -i $ssh_key" $local_path  $ssh_user@$ssh_host:$remote_path