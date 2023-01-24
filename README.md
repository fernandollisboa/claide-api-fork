# ClAIDe

## Running the application

Here we provide three ways to deploy this application, with Docker, localy as dev and as prod.

### Run with Docker 

First of all create and fill `.env` file as shown in `.env.example`. After that you have to check if the port setting in the `docker-compose.yml` file is acording with your `.env`. Now, you have to run the following command:

```docker
docker compose up
```

Once both applications are up (the clAIDe and the database). You need to apply the migrations on the database with the following command:

```docker
docker exec <NAME_OF_YOUR_CLAIDE_CONTAINER>  npx prisma migrate deploy
```

### Run as dev

To run locally with the dev enviroment you first need to create and fill the `.env.dev`file as shown in `.env.example` . Once you have set your environment variables, If you didnt had installed all the dependencies, it's time to do that with the following command:

```npm
npm i
```

Now you need to generate and run the Prisma migrations with the following command:

```npm
npx prisma migrate dev
```

At this moment all you have to do is run with this command

```npm
npm run dev
```
 
### Run as prod locally:

To run locally with the dev enviroment you first need to create and fill the `.env.prod`file as shown in `.env.example` . Once you have set your environment variables, If you didnt had installed all the dependencies, it's time to do that with the following command:

```npm
npm i
```

Now you need to generate and run the Prisma migrations and generate the prod files with the following command:

```npm
npm run build
```

Once eveerything is configured, you just need to run the following command: 

```npm
npm start
```

## Running the tests 

If you didnt had installed all the dependencies, first you will need to do that with the following command:

```npm
npm i
```

Once you have the dependencies installed, all you have to do is run the test with one of the two following commands:

```npm
npm run test

or

npm run test:dev
```
