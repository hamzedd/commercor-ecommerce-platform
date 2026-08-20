# ---------- deps ----------
FROM node:22-alpine AS deps

WORKDIR /app

RUN apk add --no-cache libc6-compat

COPY package.json ./
COPY yarn.lock* pnpm-lock.yaml* package-lock.json* ./

RUN \
  if [ -f yarn.lock ]; then \
    sed -i 's#https://registry.yarnpkg.com/#https://registry.npmjs.org/#g' yarn.lock && \
    yarn config set registry https://registry.npmjs.org && \
    yarn install --frozen-lockfile --network-timeout 600000; \
  elif [ -f pnpm-lock.yaml ]; then \
    corepack enable && pnpm install --frozen-lockfile; \
  else \
    npm ci; \
  fi

# ---------- build ----------
FROM node:22-alpine AS builder

WORKDIR /app

ENV NODE_ENV=production

RUN apk add --no-cache libc6-compat

COPY --from=deps /app/node_modules ./node_modules
COPY . .

ARG NEXT_PUBLIC_API_BASE_URL
ARG NEXT_PUBLIC_SSR_API_BASE_URL
ARG NEXT_PUBLIC_FILES_BASE_URL

ENV NEXT_PUBLIC_API_BASE_URL=$NEXT_PUBLIC_API_BASE_URL
ENV NEXT_PUBLIC_SSR_API_BASE_URL=$NEXT_PUBLIC_SSR_API_BASE_URL
ENV NEXT_PUBLIC_FILES_BASE_URL=$NEXT_PUBLIC_FILES_BASE_URL

RUN \
  if [ -f yarn.lock ]; then yarn build; \
  elif [ -f pnpm-lock.yaml ]; then corepack enable && pnpm build; \
  else npm run build; \
  fi

# ---------- runtime ----------
FROM node:22-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production

RUN addgroup -g 1001 -S nodejs && adduser -S nextjs -u 1001

COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

USER nextjs

ENV HOSTNAME=0.0.0.0
ENV PORT=8080

EXPOSE 8080

CMD ["node", "server.js"]

