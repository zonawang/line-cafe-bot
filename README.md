# line-cafe-bot

A LINE Messaging API side project for building a nearby cafe search assistant focused on places suitable for working. The current implementation covers the backend foundation plus a small Day 1 practice flow:

- TypeScript + Express project structure
- LINE webhook endpoint
- LINE webhook signature verification
- health check endpoint
- event parsing and event-type logging
- Day 1 `Message action` practice flow

## Tech Stack

- Node.js
- TypeScript
- Express
- LINE Messaging API
- `@line/bot-sdk`
- `dotenv`

## Project Structure

```text
src/
  app.ts
  server.ts
  routes/
    webhook.ts
  handlers/
    webhookEventDispatcher.ts
    messageHandler.ts
    textMessageHandler.ts
    locationHandler.ts
    postbackHandler.ts
  actions/
    index.ts
    day1MessageActions.ts
  messages/
    index.ts
    day1Messages.ts
  services/
    lineClient.ts
    replyMessageService.ts
  types/
    line.ts
  utils/
    env.ts
    logger.ts
```

## Installation

1. Create the project environment file.

```bash
cp .env.example .env
```

2. Fill in `.env` with your LINE channel credentials.

```env
PORT=3000
LINE_CHANNEL_SECRET=your_line_channel_secret
LINE_CHANNEL_ACCESS_TOKEN=your_line_channel_access_token
```

3. Install dependencies.

```bash
npm install
```

## LINE Developer Console Setup

1. Go to the LINE Developers Console.
2. Create or select a Messaging API channel.
3. Copy the following values into your local `.env`:
   - `Channel secret` -> `LINE_CHANNEL_SECRET`
   - `Channel access token` -> `LINE_CHANNEL_ACCESS_TOKEN`
4. Enable the Messaging API for the channel if it is not enabled yet.
5. Under the Messaging API settings page, prepare a webhook URL that points to:

```text
https://<your-public-host>/webhook
```

## Start the Local Server

Development mode:

```bash
npm run dev
```

Build and run compiled output:

```bash
npm run build
npm start
```

Health check:

```bash
curl http://localhost:3000/health
```

Expected response:

```json
{ "status": "ok" }
```

## Test Webhook Locally with ngrok

1. Start the local server:

```bash
npm run dev
```

2. Start a tunnel:

```bash
ngrok http 3000
```

3. Copy the HTTPS forwarding URL from ngrok.
4. In the LINE Developers Console, set the webhook URL to:

```text
https://<ngrok-id>.ngrok-free.app/webhook
```

5. Turn on **Use webhook** in the Messaging API settings.
6. Use the **Verify** button in the LINE Developers Console.

If the webhook is connected successfully:

- the verify request should return success in the console
- your local server should log that the webhook signature was verified
- your local server should log the received LINE event type

## Alternative Tunnel Options

You can also use other tunnel tools, for example:

```bash
cloudflared tunnel --url http://localhost:3000
```

If you use another tunnel provider, the webhook path is still:

```text
https://<public-host>/webhook
```

## Deploy to Cloud Run

If you want a stable public webhook URL, deploy this app to Cloud Run instead of relying on a temporary tunnel.

1. Make sure `gcloud` is authenticated and your target project is selected.

```bash
gcloud auth login
gcloud config set project <your-gcp-project-id>
```

2. Create a deployment-only env file.

Do **not** commit this file.

```yaml
LINE_CHANNEL_SECRET: your_line_channel_secret
LINE_CHANNEL_ACCESS_TOKEN: your_line_channel_access_token
```

Example filename:

```text
cloud-run-env.yaml
```

3. Deploy the service from source.

```bash
gcloud run deploy line-cafe-bot \
  --source . \
  --region asia-east1 \
  --allow-unauthenticated \
  --env-vars-file cloud-run-env.yaml
```

Notes:

- Cloud Run provides `PORT` automatically, so you do not need to set it in `cloud-run-env.yaml`.
- If you prefer another region, replace `asia-east1` with your target region.

4. After deployment, copy the Cloud Run service URL.

Example:

```text
https://line-cafe-bot-xxxxx-uc.a.run.app
```

5. Set the LINE webhook URL to:

```text
https://<your-cloud-run-url>/webhook
```

6. In LINE Developers Console:

- turn on **Use webhook**
- click **Verify**

7. Verify the deployed health check:

```bash
curl https://<your-cloud-run-url>/health
```

Expected response:

```json
{"status":"ok"}
```

If you update the bot later, run the same `gcloud run deploy` command again to roll out a new revision.

## Day 1: Message Action

Current Day 1 behavior is intentionally small and only focuses on `Message action`.

1. Send one of these trigger texts to the bot:
   - `開始`
   - `menu`
   - `help`
   - `顯示咖啡廳條件選單`
2. The bot replies with quick reply buttons backed by `Message action`.
3. When you tap a button, LINE sends a predefined text message back to the bot.
4. The bot confirms which condition it received, but it does **not** search for cafes yet.

## Current Scope

Implemented in this step:

- `POST /webhook`
- LINE signature verification via `@line/bot-sdk` middleware
- event parsing
- event type logging
- `GET /health`
- Day 1 `Message action` practice flow

Not implemented yet:

- location search logic
- Flex Message response building
- Google Places integration
- database integration
