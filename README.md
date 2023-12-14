<p align="center">
  <a href="http://nestjs.com/" target="blank" style="margin-right: 50px;"><img src="https://nestjs.com/img/logo-small.svg" width="150" alt="Nest Logo" /></a>
  <a href="https://graphql.org" target="blank" style="margin-right: 50px;"><img src="https://graphql.org/img/logo.svg" width="150" alt="Graphql Logo" /></a>
  <a href="https://www.docker.com/" target="blank" style="margin-right: 50px;"><img src="https://gist.githubusercontent.com/mrcodedev/8f9c3cc5698f98adecfaebd797b5714e/raw/5574cd201ebf8b1b128fc20043cc9ade37cf4baa/image-docker.png" width="200" alt="Graphql Logo" /></a>
  <a href="https://www.postgresql.org/" target="blank" style="margin-right: 50px;"><img src="https://wiki.postgresql.org/images/a/a4/PostgreSQL_logo.3colors.svg" width="140" alt="Graphql Logo" /></a>
</p>

## Instructions

1. Clone the project
2. If it's necessary to install the required packages. I use the following commands on Fedora Linux:
```
  sudo dnf install nodejs
  sudo npm install -g @nestjs/cli
  sudo npm install -g yarn
```
3. Execute the following commands after cloning the project:
```
yarn install
```
4. Copy the ```.env.template``` and rename it to ```.env``` and follow the instructions
5. Start the Docker container (Docker Desktop) with the following command:
```
docker-compose up -d
```
6. Start the Nest backend using the following command:

```
yarn start:dev
```
7. Access the site by visiting the following URL in your web browser:
```
http://localhost:3000/graphql
```

7. Execute the __"mutation"__ to fill out the Database.
8. You can test the app with the follow queries: 
```
<!-- Operation -->
mutation Signin($signinInput: SigninInput!) {
  signin(signinInput: $signinInput) {
    token
  }
}

<!-- Variables -->
{
  "signinInput": {
    "email": "var@gmail.com",
    "password": "123456"
  }
}
```
After that, use the token in Headers to access all the functions.
```
Authorization: Bearer <your token>
```