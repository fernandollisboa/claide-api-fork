FROM node:alpine

WORKDIR /app

COPY ./package*.json ./

COPY prisma ./prisma/

COPY .env ./

RUN npm install

COPY . .

EXPOSE 4000

CMD ["npm", "start"]
