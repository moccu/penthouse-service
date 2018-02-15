# Penthouse Service

A service to create criticalpath css using [penthouse](https://github.com/pocketjoso/penthouse).

## Run service locally

Install all dependencies using `npm install`. Afterwards you can start the
service using:

```bash
npm run service
```

This will start a server at port `3000`.

## Running service with docker

Create a docker image of the penthouse-service using:

```bash
docker build -t penthouse-service .
```

Once the image is ready start the service using the following command.
(`<portnumber>` is the port which you want to use for the service):

```bash
docker run -p <portnumber>:3000 penthouse-service
```
