# Use Node.js official image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy Prisma schema and generate Prisma client
COPY prisma ./prisma
RUN npx prisma generate

# Copy env file
COPY .env .env

COPY . .

# Copy all source files
COPY . .

# Build the Nest.js app
RUN npm run build

# Expose the port the app runs on
EXPOSE 3000

# Start the app
CMD ["npm", "start"]