# Set base image to Node LTS (10.14.2 as of 2018-12-23)
FROM node:10.14.2

# Set working directory for application
WORKDIR /usr/src/app

# Copy WebApp files to container and install dependencies
COPY . /usr/src/app
RUN npm install

# Set default API port
EXPOSE 3000

# Start server in container
CMD ["npm", "start"]