# ---------- deps ----------
FROM node:22-alpine AS deps
WORKDIR /app

RUN corepack enable

COPY package.json yarn.lock ./
# If Yarn Berry (v3/v4), also include:
# COPY .yarnrc.yml ./
# COPY .yarn/ .yarn/

# Pin yarn version for reproducible builds (optional but recommended)
# RUN corepack prepare yarn@4.5.1 --activate
RUN yarn install --frozen-lockfile

# ---------- build ----------
FROM node:22-alpine AS build
WORKDIR /app
RUN corepack enable
# RUN corepack prepare yarn@4.5.1 --activate

COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN yarn build

# ---------- runtime ----------
FROM node:22-alpine AS runtime
WORKDIR /app
ENV NODE_ENV=production

RUN corepack enable
# RUN corepack prepare yarn@4.5.1 --activate

COPY package.json yarn.lock ./
# If Yarn Berry:
# COPY .yarnrc.yml ./
# COPY .yarn/ .yarn/

RUN yarn install --frozen-lockfile

COPY --from=build /app/dist ./dist

EXPOSE 3001
CMD ["node", "dist/main.js"]
