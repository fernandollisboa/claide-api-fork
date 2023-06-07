FROM node:18.12

WORKDIR /app

COPY ./package*.json ./
COPY prisma ./prisma/
COPY ./swagger ./swagger
COPY ./src ./src

ENV DATABASE_URL=
ENV PORT=
ENV JWT_SECRET=
ENV JWT_EXPIRATION=
ENV LDAP_URL=
ENV LDAP_SEARCHBASE=
ENV LDAP_GROUP=
ENV TLS_ENABLE=
ENV CERT_PATH=
ENV KEY_PATH=

RUN npm i
RUN npm run build

CMD ["npm", "run", "start"]