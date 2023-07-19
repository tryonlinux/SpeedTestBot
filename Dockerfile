# Use a Node.js base image
FROM node:lts

# Set the working directory in the container
WORKDIR /speedtestbot

# Fetch and install the Speedtest CLI for Linux
RUN apt-get install -y curl &&\
    curl -s https://packagecloud.io/install/repositories/ookla/speedtest-cli/script.deb.sh | bash &&\
    apt-get install -y speedtest &&\
    yarn global add typescript &&\
    speedtest --accept-license


# Copy the package.json and yarn.lock files to the working directory
COPY package.json yarn.lock ./

# Install dependencies
RUN yarn install

# Copy the rest of the application code to the working directory
COPY . .

# Build TypeScript code
RUN yarn build

# Start the application
CMD [ "yarn", "start" ]
