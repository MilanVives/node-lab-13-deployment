# Lab 13: Deployment

Deploy the Vivesbib API to a hosting platform and prove that it runs.

This lab continues where Lab 11 ended: the starter contains a working version of that lab. The autograder checks your code **and** calls your deployed app on the internet.

## Getting started

```bash
npm install
npm test
```

`npm test` runs the same checks as the autograder: R1 runs locally, R2 to R4 read `DEPLOY_URL.txt` and call your deployed app.

## Requirements

### R1: GET /health reports that the app is running
**2 points**

Add `src/routes/health.js` with `GET /` that responds `{ "status": "ok" }`, and register it in `src/app.js` with `app.use('/health', health)` **before** the notFound middleware. Hosting platforms use such a health check to see whether your app is up.

### R2: DEPLOY_URL.txt contains the URL of your deployed app
**2 points**

Deploy the app (see below) and replace the placeholder in `DEPLOY_URL.txt` with the base URL of your app, for example `https://vivesbib-yourname.onrender.com` (no path, no trailing slash).

### R3: The deployed app answers /health
**4 points**

`GET <your URL>/health` answers `{ "status": "ok" }`.

### R4: The deployed app serves the genres
**2 points**

`GET <your URL>/api/genres` answers a JSON array. This only works when your app can reach its database: use MongoDB Atlas.

## Deploying

Choose one track from the chapter (see the course, chapter 13):

- **Render** (easiest): New Web Service, connect this repository, build command `npm install`, start command `npm start`.
- **Linux VM** (Oracle Cloud / Azure / GCP): clone the repository, `npm install`, start it with PM2, optionally Nginx in front.

Set these environment variables on the host, never in the code:

| Variable | Value |
|---|---|
| `MONGODB_URI` | your MongoDB Atlas connection string |
| `vivesbib_jwtPrivateKey` | a long random secret |
| `NODE_ENV` | `production` |

The app listens on `process.env.PORT`, which platforms like Render set for you.

Free plans put the app to sleep after a while; the first request can take up to a minute. If R3 or R4 fail because the app could not be reached, open the URL in your browser and submit again.

## Submitting

Commit your work (including `DEPLOY_URL.txt`) and run `npm run submit`. Your score and feedback appear under **Releases** after a few minutes. You can submit as often as you like; the latest submission counts.
