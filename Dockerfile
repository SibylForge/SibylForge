FROM node:18.18.2-alpine AS builder
WORKDIR /builder

COPY src src
COPY nest-cli.json .
COPY tsconfig*.json .
COPY package*.json .
COPY yarn*.lock .

RUN yarn install
RUN yarn build

FROM node:18.18.2-alpine
WORKDIR /app
EXPOSE 8080

COPY --from=builder /builder/node_modules /app/node_modules
COPY --from=builder /builder/dist /app
COPY --from=builder /builder/.env /app/.env

CMD ["node", "main.js"]
