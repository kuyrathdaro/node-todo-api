FROM node:lts-alpine as builder

WORKDIR /usr/app

COPY package*.json .
COPY tsconfig.json .
COPY src ./src

RUN npm install
RUN npm install --location=global tsc-alias
RUN npm run build

FROM node:lts-alpine as production

WORKDIR /usr/app

COPY package*.json .
COPY .env .
RUN npm ci install --only=production
RUN npm install --location=global pm2

COPY --from=builder /usr/app/dist .

EXPOSE 3000

CMD [ "pm2-runtime", "app.js"]