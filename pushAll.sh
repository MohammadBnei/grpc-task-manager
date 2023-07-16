(cd user-api && docker build -t mohammaddocker/tm-user-api . && docker push mohammaddocker/tm-user-api)
(cd auth-api && docker build -t mohammaddocker/tm-auth-api . && docker push mohammaddocker/tm-auth-api)
(cd car-api && docker build -t mohammaddocker/tm-car-api . && docker push mohammaddocker/tm-car-api)
(cd race-api && docker build -t mohammaddocker/tm-race-api . && docker push mohammaddocker/tm-race-api)