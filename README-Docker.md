# KYC Web App Dockerization

## Git repo

`git clone https://github.com/Morpheuslabs-io/airdrop-tool-advanced -b docker-service`

## Build Docker image

`docker build -t midotrinh/kyc-web:latest .`

## Push Docker image

`docker push midotrinh/kyc-web:latest`

## Config and Deploy app

Located in the sub-folder `deploy`

### Config

The config is specified in the file `deploy/.params` as follows

```
PORT='80'
EMAIL_WHITELIST=$(cat ./file/email-whitelist.txt)
COUNTRY_BLACKLIST=$(cat ./file/country-blacklist.txt)
WEB_APP_LOGO_URL='https://morpheuslabs.io/storage/2019/05/logo.png'
WEB_APP_TITLE='KYC Submission'

```

The params `EMAIL_WHITELIST` and `COUNTRY_BLACKLIST` are read from text files stored in the sub-folder `file`

### Deploy

```
./deploy-kyc-app.sh

```

The above cmd will fire up the Docker-based KYC service

Deployed URL: http://localhost:80
