# Use a lightweight Linux base image
FROM ubuntu:latest


RUN rm /bin/sh && ln -s /bin/bash /bin/sh

# Set environment variables for non-interactive installation
ENV DEBIAN_FRONTEND=noninteractive

# Update package lists and install MongoDB, Node.js, and dependencies
RUN apt-get update 
RUN apt-get -y install gnupg curl
RUN curl -fsSL https://www.mongodb.org/static/pgp/server-8.0.asc | gpg -o /usr/share/keyrings/mongodb-server-8.0.gpg --dearmor
RUN echo "deb [ arch=amd64,arm64 signed-by=/usr/share/keyrings/mongodb-server-8.0.gpg ] https://repo.mongodb.org/apt/ubuntu noble/mongodb-org/8.0 multiverse" | tee /etc/apt/sources.list.d/mongodb-org-8.0.list
RUN apt-get update  && apt-get install -y mongodb-org

ENV NVM_DIR=/usr/local/nvm
ENV NODE_VERSION=22.11.0

RUN mkdir $NVM_DIR
RUN curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.1/install.sh | bash
RUN source $NVM_DIR/nvm.sh  &&  nvm install 22 && nvm use 22 

ENV NODE_PATH=$NVM_DIR/v$NODE_VERSION/lib/node_modules
ENV PATH=$NVM_DIR/versions/node/v$NODE_VERSION/bin:$PATH

RUN node -v 
RUN npm -v

# Create directories for MongoDB and Node.js app
RUN mkdir -p /data/db /usr/dist

# Set the working directory for the Node.js app
WORKDIR /usr/dist

# Copy package.json and package-lock.json for dependency installation
COPY package*.json ./

# Install Node.js dependencies
RUN npm install --production
RUN npm install pm2 -g

# Copy the application source code
COPY ./dist /usr/dist

# Expose application and MongoDB ports
EXPOSE 3000

# Command to run MongoDB and Node.js app
CMD mongod --bind_ip_all & pm2-runtime index.js
