FROM node:20-alpine

WORKDIR /sanity

COPY package*.json ./

RUN npm install

COPY . .

# Build the Sanity Studio
RUN  npm run build

RUN npm run dev

# CMD ["npm", "run", "dev"] 