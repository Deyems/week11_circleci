FROM alpine:3.10

RUN apk add --update nodejs yarn

RUN addgroup -S node && adduser -S node -G node

USER node

RUN mkdir /home/node/code
WORKDIR /home/node/code

COPY --chown=node:node yarn.lock package.json ./

COPY . .

RUN yarn

# RUN yarn tsc


EXPOSE 3000

CMD ["yarn", "start"]