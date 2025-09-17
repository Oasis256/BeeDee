FROM node:20-alpine
WORKDIR /app
COPY . .
RUN npm install @nestjs/core @nestjs/common reflect-metadata rxjs
EXPOSE 80
CMD ["node", "src/index.js"]
