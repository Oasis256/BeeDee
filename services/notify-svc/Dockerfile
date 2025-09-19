FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install --prefer-offline --no-audit --loglevel=error --no-fund
RUN npm install -g ts-node typescript
COPY . .
EXPOSE 80
CMD ["ts-node", "src/index.ts"]
