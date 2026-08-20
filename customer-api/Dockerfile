FROM node:22-alpine AS build

WORKDIR /app

COPY package.json yarn.lock ./

RUN sed -i 's#https://registry.yarnpkg.com/#https://registry.npmjs.org/#g' yarn.lock \
    && yarn config set registry https://registry.npmjs.org \
    && yarn install --frozen-lockfile --network-timeout 600000

COPY . .
RUN yarn build


FROM node:22-alpine AS runtime

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3001

COPY package.json yarn.lock ./

RUN sed -i 's#https://registry.yarnpkg.com/#https://registry.npmjs.org/#g' yarn.lock \
    && yarn config set registry https://registry.npmjs.org \
    && yarn install --frozen-lockfile --production=true --network-timeout 600000 \
    && yarn cache clean

COPY --from=build --chown=node:node /app/dist ./dist

RUN find dist -name '*.map' -delete

USER node

EXPOSE 3001

CMD ["node", "dist/main.js"]
