# Problem Resolution Steps - Hw18RESTAllServices

Student: Carlos Alexander Torres Pincay  
Course: ESPE2604-AWD30716  
Homework: Hw18RESTAllServices  
Date: 2026-06-08

## 1. Initial Problem

The homework had to extend HW17 Customer Table into a complete REST CRUD service:

- `GET`
- `POST`
- `PUT`
- `PATCH`
- `DELETE`

The service also had to use the professor's MongoDB database and later run from an AWS EC2 instance.

## 2. Reference Review

The reference service provided by classmates was:

```text
https://ws18computerstore-cdc7afgjctaxcmc3.eastus2-01.azurewebsites.net/
```

The observed pattern was:

- Customer dashboard in the browser.
- Total money spent section.
- Customer table.
- Add customer modal.
- Edit and delete row actions.
- REST endpoints under `/computerstore`.

The MongoDB connection used by classmates was detected as:

```text
mongodb+srv://oop:oop@cluster0.9knxc.mongodb.net/oop?appName=Cluster0
```

## 3. Local Project Creation

A new homework folder was created:

```text
hw/torres/u2/Hw18RESTAllServices
```

The project includes:

```text
index.js
package.json
models/customer.js
routes/customerRoutes.js
public/index.html
public/style.css
public/script.js
docs/AWS_EC2_DEPLOYMENT.md
```

## 4. REST Services Implemented

The final backend exposes:

```text
GET    /api/health
GET    /computerstore/customers
GET    /computerstore/customer/:id
GET    /computerstore/customers/totalSpent
POST   /computerstore/customer
PUT    /computerstore/customer/:id
PATCH  /computerstore/customer/:id
DELETE /computerstore/customer/:id
```

## 5. Dependency Issue

When running:

```powershell
npm start
```

Node returned:

```text
Error: Cannot find module 'express'
```

Cause:

- The project had `package.json`, but `node_modules` had not been installed.
- `npm install` was timing out on the local machine.

Temporary local fix:

- Reused compatible local dependencies already present in a classmate reference folder.
- This allowed local testing without waiting for the npm registry.

Permanent fix for AWS:

```bash
npm install
```

This is expected to work normally from the EC2 instance.

## 6. MongoDB Atlas Issue

The app was correctly pointing to the professor's MongoDB database, but locally the server returned:

```text
Could not connect to any servers in your MongoDB Atlas cluster.
One common reason is that you're trying to access the database from an IP that isn't whitelisted.
```

Meaning:

- The database URI was correct.
- The local public IP was blocked by MongoDB Atlas network access rules.

To keep the homework demonstrable in browser, demo mode was added:

- If MongoDB connects, the app uses the professor's database.
- If MongoDB is blocked, the app starts with in-memory demo data.

The health endpoint shows which mode is active:

```json
{
  "database": "connected"
}
```

or:

```json
{
  "database": "demo"
}
```

## 7. AWS EC2 Deployment

An AWS EC2 instance was created in the Ohio region:

```text
Public IPv4: 18.226.20.6
```

The security group was configured with:

```text
SSH  22    My IP
HTTP 80    0.0.0.0/0
TCP  3016  0.0.0.0/0
```

The app was uploaded as:

```text
Hw18RESTAllServices-deploy.zip
```

Main AWS setup commands:

```bash
sudo apt update
sudo apt install -y unzip curl
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
sudo apt install -y nodejs
sudo npm install -g pm2
```

App setup:

```bash
unzip -o Hw18RESTAllServices-deploy.zip -d Hw18RESTAllServices
cd Hw18RESTAllServices
npm install
```

Environment:

```bash
nano .env
```

Content:

```env
PORT=3016
MONGODB_URI=mongodb+srv://oop:oop@cluster0.9knxc.mongodb.net/oop?appName=Cluster0
```

Run with PM2:

```bash
pm2 start index.js --name hw18-rest-all-services
pm2 save
```

## 8. Port Change

The initial homework used port `3018`.

Carlos changed the port to `3016` because his class list number is 16.

Files updated:

```text
index.js
.env.example
README.md
docs/AWS_EC2_DEPLOYMENT.md
project evidence copies
```

AWS `.env` also had to be updated:

```env
PORT=3016
```

PM2 restart command:

```bash
pm2 restart hw18-rest-all-services --update-env
```

## 9. Final Verification URLs

Browser dashboard:

```text
http://18.226.20.6:3016/
```

Health endpoint:

```text
http://18.226.20.6:3016/api/health
```

Expected database evidence:

```json
{
  "database": "connected"
}
```

This confirms the service is running from AWS and using the professor's MongoDB database.

## 10. Evidence To Capture

Recommended screenshots:

- AWS EC2 instance running.
- Security group inbound rules showing port `3016`.
- Terminal with `pm2 status`.
- Browser dashboard at `http://18.226.20.6:3016/`.
- Browser health endpoint showing `"database":"connected"`.
- Add customer action.
- Edit customer action.
- Delete customer action.
