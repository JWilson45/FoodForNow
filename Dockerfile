FROM node:18.0.0

ENV NODE_ENV=production

RUN mkdir /app

WORKDIR /app

COPY package*.json ./

RUN npm config set unsafe-perm true

RUN npm install -g typescript
RUN npm install -g ts-node
USER node
RUN npm install

COPY --chown=node:node . .
RUN npm run build



FROM node:18.0.0

RUN mkdir /app
WORKDIR /app

COPY package*.json ./

USER node

RUN npm install --production
COPY --from=builder /app/build ./build

COPY --chown=node:node .env .
COPY --chown=node:node  /config ./config
COPY --chown=node:node  /public ./public

EXPOSE 2700
CMD [ "node", "build/server.js" ]
