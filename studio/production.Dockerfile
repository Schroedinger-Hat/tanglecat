FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

ENV PORT 3333
EXPOSE 3333

CMD ["npm", "start", "--", "--host", "0.0.0.0"] 