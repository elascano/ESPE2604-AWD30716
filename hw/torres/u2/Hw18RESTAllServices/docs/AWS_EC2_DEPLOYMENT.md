# AWS EC2 Deployment Guide

This guide documents the expected path to deploy `Hw18RESTAllServices` from local development to an AWS instance.

## 1. Create The EC2 Instance

- Service: EC2.
- Recommended OS: Ubuntu Server LTS.
- Instance type for class demo: `t2.micro` or `t3.micro`.
- Security group inbound rules:
  - SSH: port `22`, only your IP.
  - HTTP: port `80`, anywhere.
  - App test port: `3016`, only your IP or temporarily anywhere for evidence.

## 2. Connect To The Instance

```bash
ssh -i your-key.pem ubuntu@YOUR_EC2_PUBLIC_IP
```

## 3. Install Runtime Packages

```bash
sudo apt update
sudo apt install -y nodejs npm git nginx
sudo npm install -g pm2
```

Check versions:

```bash
node -v
npm -v
pm2 -v
```

## 4. Upload Or Clone The Project

Option A, clone from GitHub:

```bash
git clone YOUR_REPOSITORY_URL
cd YOUR_REPOSITORY/Hw18RESTAllServices
```

Option B, upload with SCP:

```bash
scp -i your-key.pem -r Hw18RESTAllServices ubuntu@YOUR_EC2_PUBLIC_IP:/home/ubuntu/
cd /home/ubuntu/Hw18RESTAllServices
```

## 5. Configure Environment Variables

Create `.env` or export environment variables in PM2:

```bash
export PORT=3016
export MONGODB_URI='mongodb+srv://oop:oop@cluster0.9knxc.mongodb.net/oop?appName=Cluster0'
```

Important: if MongoDB Atlas blocks the EC2 IP, ask the professor to whitelist the AWS public IP or add it in the Atlas network access rules.

## 6. Install Dependencies And Start

```bash
npm install
pm2 start index.js --name hw18-rest-all-services
pm2 save
pm2 startup
```

Check logs:

```bash
pm2 logs hw18-rest-all-services
```

## 7. Optional Nginx Reverse Proxy

Create `/etc/nginx/sites-available/hw18`:

```nginx
server {
    listen 80;
    server_name YOUR_EC2_PUBLIC_IP;

    location / {
        proxy_pass http://127.0.0.1:3016;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

Enable it:

```bash
sudo ln -s /etc/nginx/sites-available/hw18 /etc/nginx/sites-enabled/hw18
sudo nginx -t
sudo systemctl restart nginx
```

## 8. Evidence Checklist

Capture screenshots of:

- EC2 instance running.
- Security group inbound rules.
- SSH terminal with `node -v`, `npm -v`, and `pm2 status`.
- Browser URL: `http://YOUR_EC2_PUBLIC_IP/`.
- Browser URL: `http://YOUR_EC2_PUBLIC_IP/api/health`.
- CRUD actions: add, edit, delete customer.
