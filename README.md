# cLaIdeApi

### Run with Docker

First of all create and fill `.env.prod` file as shown in `.env.example`. After that you have to check if the port setting in the `docker-compose.yml` file is acording with your `.env.prod`. Now, all you have to do is run the following command:

```
docker compose up
```

### Run as dev locally:

- `npm i`
- create and fill `.env` file as shown in `.env.example`
- `npx prisma migrate dev`
- `npm run dev`

### Run as prod locally:

- `npm i`
- create and fill `.env.prod` file as shown in `.env.example`
- `npm run build`
- `npm start`

### Run test :

- `npm i`
- `npm run tesT`

### Run test as dev:

- `npm i`
- `npm run test:dev`

#### Generate and run migrations

1. `npx prisma migrate dev`
