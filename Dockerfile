#Our base image
FROM node:carbon

# Create app directory
WORKDIR usr/src/app

#Copy over and install app dependcies
COPY package*.json ./
RUN npm install

#copy over source files
COPY . .

#expose the port 
EXPOSE 5000

#CMD [ "npm", "start" ]