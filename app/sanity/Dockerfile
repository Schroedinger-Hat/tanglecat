FROM node:20-alpine

WORKDIR /sanity

COPY package*.json ./

RUN npm install

COPY . .

# Build the Sanity Studio
RUN  npm run build

# CMD ["npm", "run", "dev"] 