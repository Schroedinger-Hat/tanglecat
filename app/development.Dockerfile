FROM node:20-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

# Build the Next.js app
RUN npm run build

EXPOSE 3000

# Use dev command for development
CMD ["npm", "run", "dev"] 
