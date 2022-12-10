FROM node:alpine

WORKDIR /app

COPY ./package*.json ./

COPY prisma ./prisma/

COPY ./swagger ./swagger

COPY ./src ./src

RUN npm install

COPY . .

CMD ["npm", "start"]
