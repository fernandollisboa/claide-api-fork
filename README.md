# ClAIDe

## Running the application

Here we provide three ways to deploy this application, with Docker, localy as dev and as prod.

## Generating the SSL certificates

The example below shows how to create a self-signed certificate. In a production environment, you should always use certificates signed by a [Certificate Authority (CA)](https://www.SSL.com/faqs/what-is-a-certificate-authority/).

#### Generate CA files CA-cert.crt and CA-key.key. This allows the signing of the keys:

```bash
openssl genrsa -out CA-key.key
openssl req -new -x509 -key CA-key.key -out CA-cert.crt
```

#### Create the client public certificate (client.crt) and private key (client.key):

```bash
openssl genrsa -out client.key
openssl req -new -key client.key -out client_reqout.txt
openssl x509 -req -in client_reqout.txt -days 3650 -sha256 -CAcreateserial -CA CA-cert.crt -CAkey CA-key.key -out client.crt
```

### Run with Docker

First of all create and fill `.env` file as shown in `.env.example`. After that you have to check if the port setting in the `docker-compose.yml` file is acording with your `.env`. Now, you have to run the following command:

```bash
docker build .
npm run docker:build
```

Once both applications are up (the clAIDe and the database). You need to apply the migrations on the database with the following command:

```bash
docker exec <NAME_OF_YOUR_CLAIDE_CONTAINER>  npx prisma migrate deploy
```

### Run as dev

To run locally with the dev enviroment you first need to create and fill the `.env.dev`file as shown in `.env.example` . Once you have set your environment variables, If you didnt had installed all the dependencies, it's time to do that with the following command:

```bash
npm i
```

Now you need to generate and run the Prisma migrations with the following command:

```bash
npx prisma migrate dev
```

At this moment all you have to do is run with this command

```bash
npm run dev
```

### Run as prod locally:

To run locally with the dev enviroment you first need to create and fill the `.env.prod` file as shown in `.env.example` . Once you have set your environment variables, If you didnt had installed all the dependencies, it's time to do that with the following command:

```bash
npm i
```

Now you need to generate and run the Prisma migrations and generate the prod files with the following command:

```bash
npm run build
```

Once eveerything is configured, you just need to run the following command:

```bash
npm start
```

## Running the tests

If you didnt had installed all the dependencies, first you will need to do that with the following command:

```bash
npm i
```

Once you have the dependencies installed, all you have to do is run the test with one of the two following commands:

```bash
npm run test

or

npm run test:dev
```

rebuilder docker prisma: docker-compose build ou docker-compose up -build
