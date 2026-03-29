FROM node:22-alpine

RUN corepack enable

WORKDIR /sanity

COPY package.json pnpm-lock.yaml ./

RUN pnpm install --frozen-lockfile

COPY . .

# Build the Sanity Studio
RUN pnpm run build