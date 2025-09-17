FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --prefer-offline --no-audit --loglevel=error --no-fund
COPY . .
EXPOSE 80
CMD ["node", "src/index.js"]
