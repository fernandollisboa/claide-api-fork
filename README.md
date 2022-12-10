# cLaIdeApi

### Run with docker

First of all create and fill `.env.prod` file as shown in `.env.example`. After that all you have to do is run the following command:

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
