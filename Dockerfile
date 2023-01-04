FROM node:18.12

WORKDIR /app

COPY ./package*.json ./
COPY prisma ./prisma/
COPY ./swagger ./swagger
COPY ./dist ./dist

RUN npm i

CMD ["npm", "run", "start"]