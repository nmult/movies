# --- build stage ---
FROM node:22-alpine AS build
WORKDIR /app

# enable corepack
COPY package.json yarn.lock ./
RUN corepack enable
RUN yarn install --immutable

COPY . .
RUN yarn build

# --- run stage ---
FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

COPY --from=build /app/.output ./.output

EXPOSE 3000
CMD ["node", ".output/server/index.mjs"]
