# ATProto Feed Generator

New repo

Runs with 

```
node -v
v18.20.3
npm -v
10.7.0
```

* [Installing Node](https://nodejs.org/en/download/package-manager)
* [Installing Yarn](https://classic.yarnpkg.com/lang/en/docs/install/#mac-stable)


* [Killing Port](https://stackoverflow.com/questions/4075287/node-express-eaddrinuse-address-already-in-use-how-can-i-stop-the-process)
* [Clearing Cache Yarn](https://stackoverflow.com/questions/55323656/error-command-failed-with-exit-code-1-when-i-try-to-run-yarn)
* [DNS Checker](https://dnschecker.org/all-dns-records-of-domain.php)
* [Inital Fork](https://github.com/bluesky-social/feed-generator)
* [Instructional Blog](https://luten.dev/bluesky-ttrpg-feed/)


```
# Go to web root
cd /var/www/html

# Run app from root to check for errors
yarn && yarn start

# Check status of app
sudo -u nodejs pm2 status

# Look for errors
sudo -u nodejs pm2 log

# Edit subscription page
vi src/subscription.ts

# Edit config 
vi scripts/publishFeedGen.ts

# Restart app if needed
sudo -u nodejs pm2 restart all

# make sure it starts (youll know if on bsky you see server error) 
sudo -u nodejs pm2 start musicscience 

# Publish Feed 
yarn publishFeed

```

