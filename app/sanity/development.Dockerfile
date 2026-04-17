FROM node:22-alpine

RUN corepack enable

WORKDIR /sanity

COPY package.json pnpm-lock.yaml ./

RUN pnpm install

COPY . .

# Build the Sanity Studio
RUN pnpm run build

# Populate with demo data
# RUN pnpm run demo-data

CMD ["pnpm", "run", "dev"]