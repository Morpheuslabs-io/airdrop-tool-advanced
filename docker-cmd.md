# KYC Web App Dockerization

## Build Docker image

`docker build -t midotrinh/kyc-web:latest .`

## Push Docker image

`docker push midotrinh/kyc-web:latest`

## Deploy app 

`docker-compose -f docker-compose.yml up -d`

Deployed URL: http://localhost:80
