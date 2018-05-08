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
docker build -t moccu/penthouse-service:latest .
```

If you want to create a new release on Docker Hub, you need to tag and push the
previous built image:

```bash
docker tag moccu/penthouse-service:latest moccu/penthouse-service:<version>
docker push moccu/penthouse-service:<version>
```

Hint: remember to update the version in the package.json.

Once the image is ready start the service using the following command.
(`<portnumber>` is the port which you want to use for the service):

```bash
docker run -p <portnumber>:3000 penthouse-service
```

## Usage

Penthouse needs an URL and a CSS file to extract the critical css from. Pass
this data via GET-params to the service by requesting the endpoint as followed:
`http://localhost:3000/?url=<website-url>&css=<css-url>`.

For example:
`http://localhost:3000/?url=http://example.com/&css=http://example.com/css/styles.css`
