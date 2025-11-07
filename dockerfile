# --- build stage ---
FROM node:22-alpine AS build
WORKDIR /app

# Copy package manager configuration
COPY package.json yarn.lock .yarnrc.yml ./

# enable corepack and install dependencies
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
