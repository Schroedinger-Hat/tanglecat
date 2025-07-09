FROM node:20-alpine

WORKDIR /sanity

COPY package*.json ./

RUN npm install

COPY . .

# Build the Sanity Studio
RUN  npm run build

# Populate with demo data
RUN npm run demo-data

CMD ["npm", "run", "dev"] 