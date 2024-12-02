# Use the official Node.js image from Docker Hub
FROM node:18

# Set the working directory for your app
WORKDIR /usr/src/app

# Copy only package.json and package-lock.json first for dependency installation
COPY package*.json ./

# Install the app dependencies
RUN npm install --production

# Copy the rest of the application source code
COPY . .

# Ensure the app has the correct permissions
RUN chown -R node:node /usr/src/app

# Switch to a non-root user for better security
USER node

# Expose the port your app will run on (adjust if needed)
EXPOSE 5000

# Set the command to run the app
CMD ["npm", "start"]
