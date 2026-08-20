FROM node:22-alpine AS build

WORKDIR /app

COPY package.json yarn.lock ./

RUN sed -i 's#https://registry.yarnpkg.com/#https://registry.npmjs.org/#g' yarn.lock \
    && yarn config set registry https://registry.npmjs.org \
    && yarn install --frozen-lockfile --network-timeout 600000

COPY . .

ARG VITE_API_BASE_URL
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL

RUN yarn build


FROM nginxinc/nginx-unprivileged:1.27-alpine AS runtime

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 8080

CMD ["nginx", "-g", "daemon off;"]
