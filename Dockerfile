FROM node:17-alpine as builder

WORKDIR /app
ENV PATH /app/node_modules/.bin:$PATH
COPY package.json ./
COPY package-lock.json ./
COPY tsconfig.json ./
COPY tsconfig.node.json ./
COPY vite.config.ts ./
RUN npm install --force
RUN npm update --force
COPY . ./
EXPOSE 5173
CMD ["npm", "run", "dev"]