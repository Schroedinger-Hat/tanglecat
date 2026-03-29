FROM node:22-alpine

RUN corepack enable

WORKDIR /app

COPY package.json pnpm-lock.yaml ./

RUN pnpm install

COPY . .

# Build the Next.js app
RUN pnpm run build

EXPOSE 3000

# Use dev command for development
CMD ["pnpm", "run", "dev"]
