# Use node base image with a specific version
FROM node:20-bullseye 

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and yarn.lock to container
COPY package.json yarn.lock ./

# Install dependencies
RUN yarn install

# Copy the rest of the application code to the container
COPY . .

# Build the Next.js application
RUN yarn build

# Expose the port Next.js is running on
EXPOSE 3000

# Start the Next.js application
CMD ["yarn", "start"]