FROM node:9.5-slim

# Install headless chrome followed by instructions of puppeteer:
# https://github.com/GoogleChrome/puppeteer/blob/master/docs/troubleshooting.md

RUN apt-get update && apt-get install -yq libgconf-2-4

RUN apt-get update && apt-get install -y wget --no-install-recommends \
    && wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add - \
    && sh -c 'echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google.list' \
    && apt-get update \
    && apt-get install -y google-chrome-stable fonts-ipafont-gothic fonts-wqy-zenhei fonts-thai-tlwg fonts-kacst ttf-freefont \
      --no-install-recommends \
    && rm -rf /var/lib/apt/lists/* \
    && apt-get purge --auto-remove -y curl \
    && rm -rf /src/*.deb

# Setup penthouse service:

WORKDIR /app

COPY package.json /app
COPY package-lock.json /app
RUN npm install

COPY index.js /app
EXPOSE 3000

# Execute penthouse service:

CMD ["npm", "run", "service"]
