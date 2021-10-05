FROM node:14.18-slim


ENV CONTAINER_COMMAND=npm \
	CONTAINER_USER=container

RUN set -ex \
	&& groupadd -r $CONTAINER_USER --gid=1111 \
	&& useradd -r -M -g $CONTAINER_USER -s /usr/sbin/nologin --uid=1111 $CONTAINER_USER

# Install headless chrome followed by instructions of puppeteer:
# https://github.com/GoogleChrome/puppeteer/blob/master/docs/troubleshooting.md

RUN apt-get update \
    && apt-get install -y wget gnupg libgconf-2-4 gosu \
    && wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add - \
    && sh -c 'echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google.list' \
    && apt-get update \
    && apt-get install -y google-chrome-stable fonts-ipafont-gothic fonts-wqy-zenhei fonts-thai-tlwg fonts-kacst fonts-freefont-ttf libxss1 libxtst6 \
      --no-install-recommends \
    && rm -rf /var/lib/apt/lists/*

# Setup penthouse service:

WORKDIR /app
COPY entrypoint.sh /app

COPY package.json /app
COPY package-lock.json /app
RUN npm install

COPY src /app/src
EXPOSE 3000

# Execute penthouse service:

ENTRYPOINT ["/app/entrypoint.sh"]
CMD ["npm", "run", "service"]
