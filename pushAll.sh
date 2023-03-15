(cd user-api && docker build -t mohammaddocker/tm-user-api . && docker push mohammaddocker/tm-user-api)
(cd auth-api && docker build -t mohammaddocker/tm-auth-api . && docker push mohammaddocker/tm-auth-api)
(cd task-api && docker build -t mohammaddocker/tm-task-api . && docker push mohammaddocker/tm-task-api)