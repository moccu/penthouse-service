FROM node:14.18-slim

# Install headless chrome followed by instructions of puppeteer:
# https://github.com/GoogleChrome/puppeteer/blob/master/docs/troubleshooting.md

RUN apt-get update && apt-get install -yq libgconf-2-4

RUN apt-get update \
    && apt-get install -y wget gnupg \
    && wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add - \
    && sh -c 'echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google.list' \
    && apt-get update \
    && apt-get install -y google-chrome-stable fonts-ipafont-gothic fonts-wqy-zenhei fonts-thai-tlwg fonts-kacst fonts-freefont-ttf libxss1 \
      --no-install-recommends \
    && rm -rf /var/lib/apt/lists/*

# Setup penthouse service:

WORKDIR /app

COPY package.json /app
COPY package-lock.json /app
RUN npm install

COPY src /app/src
EXPOSE 3000

# Execute penthouse service:

CMD ["npm", "run", "service"]
