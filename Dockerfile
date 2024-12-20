# Use official Node.js as the base image
FROM node:18 AS build

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./ 

# Install dependencies
RUN npm install

# Copy the entire source code into the container
COPY . .

# Build the NestJS application from TypeScript to JavaScript
RUN npm run build

# Create the final image for running the application
FROM node:18

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy the dist directory and dependencies from the build stage into the final image
COPY --from=build /usr/src/app/dist /usr/src/app/dist
COPY --from=build /usr/src/app/node_modules /usr/src/app/node_modules
COPY --from=build /usr/src/app/package*.json /usr/src/app/

# Expose the port the application will run on (e.g., port 4000)
EXPOSE 4000

# Command to run the application when the container starts
CMD ["npm", "run", "start:prod"]

