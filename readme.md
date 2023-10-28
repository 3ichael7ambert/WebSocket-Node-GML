chmod 600 ari-ec2.pem
ssh -i ari-ec2.pem ec2-user@54.242.0.175

>>> [ec2-user@ip-172-31-25-37 ~]$

scp -i ari-ec2.pem index.js ec2-user@54.242.0.175:~/WebSocket/

sudo yum install nodejs
cd ~/WebSocket



SERVER
node index.js




Keep Your Script Running:
If you want your script to run continuously even after you close the SSH session, you can use tools like pm2 to manage your Node.js processes.
Install pm2 globally if you haven't already.
Copy code
npm install -g pm2
Start your script with pm2.
sql
Copy code
pm2 start your-script.js
Save the process list so that it starts on system boot.
Copy code
pm2 save




I NEED TO COPY FULL DIRECTORY