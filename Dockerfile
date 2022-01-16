# FROM node:16.13.0

# FROM node:16.13.2 AS builder
# WORKDIR /app
# COPY ./package.json ./
# RUN npm install
# COPY . .
# RUN npm run build


# FROM node:16.13.2-alpine
# WORKDIR /app
# COPY --from=builder /app ./
# EXPOSE 3000
# CMD ["npm", "run", "start:prod"]
FROM node:16.13.2
 
# Create app directory
WORKDIR /usr/src/app
 
# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./
 
RUN npm install
# If you are building your code for production
# RUN npm ci --only=production
 
# Bundle app source
COPY . .
 
EXPOSE 3001
CMD ["npm", "run", "start:dev"]