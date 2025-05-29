# Use a modern Node.js LTS image
FROM node:18-slim

# Create app directory
WORKDIR /usr/src/app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install --production

# Copy source code
COPY . .

# Expose the port
EXPOSE 5555

# Start the app
CMD ["npm", "start"]

