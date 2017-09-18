#Use parent image 
FROM node:7.10.1-alpine

# Set the working directory
WORKDIR /usr/src/app

# Copy the current directory contents into the container at /app
ADD . /usr/src/app

#Copy the package.json for requirements install
COPY package.json .
COPY links.js .
COPY env-docker.js ./env.js						

#install using npm
RUN npm install

# Make port 80 available to the world outside this container
#EXPOSE 80

# Run start in copy of package.json when the container launches
CMD [ "npm", "start" ]