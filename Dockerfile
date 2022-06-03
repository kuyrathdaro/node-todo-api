FROM node:lts-alpine

WORKDIR /usr/src/app

COPY package*.json .

RUN npm install
RUN npm install -g pm2
RUN npm install -g tsc-alias

COPY . .

RUN npm run build

EXPOSE 3000
# CMD [ "pm2-runtime", "start", "ecosystem.config.js"]
CMD ["npm", "start"]