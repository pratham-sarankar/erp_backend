# Set up SSH connection
ssh_host="ec2-65-2-116-3.ap-south-1.compute.amazonaws.com"
ssh_port="22"
ssh_user="ubuntu"
ssh_key="~/Documents/ssh/crm_keypair.pem"

ssh -i $ssh_key -p $ssh_port $ssh_user@$ssh_host
