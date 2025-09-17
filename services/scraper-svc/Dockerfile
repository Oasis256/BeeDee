FROM node:20-alpine
WORKDIR /app
RUN apk add --no-cache \
    chromium \
    nss \
    freetype \
    freetype-dev \
    harfbuzz \
    ca-certificates \
    ttf-freefont
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser
COPY package*.json ./
RUN npm ci --prefer-offline --no-audit --loglevel=error --no-fund
COPY . .
EXPOSE 80
CMD ["node", "src/index.js"]
