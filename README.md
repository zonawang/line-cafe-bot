# line-cafe-bot

這是一個使用 LINE Messaging API 製作的 side project，目標是打造「附近適合工作的咖啡廳搜尋助手」。目前版本先完成後端基礎架構，以及一個精簡的 Day 1 練習流程：

- TypeScript + Express 專案骨架
- LINE webhook endpoint
- LINE webhook signature verification
- health check endpoint
- event parsing 與 event type logging
- Day 1 `Message action` 練習流程

## 技術棧

- Node.js
- TypeScript
- Express
- LINE Messaging API
- `@line/bot-sdk`
- `dotenv`

## 專案結構

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

## 安裝

1. 建立專案環境變數檔案。

```bash
cp .env.example .env
```

2. 在 `.env` 中填入你的 LINE channel credentials。

```env
PORT=3000
LINE_CHANNEL_SECRET=your_line_channel_secret
LINE_CHANNEL_ACCESS_TOKEN=your_line_channel_access_token
```

3. 安裝依賴。

```bash
npm install
```

## LINE Developer Console 設定

1. 前往 LINE Developers Console。
2. 建立新的 Messaging API channel，或選擇既有 channel。
3. 將以下資訊填入本機 `.env`：
   - `Channel secret` -> `LINE_CHANNEL_SECRET`
   - `Channel access token` -> `LINE_CHANNEL_ACCESS_TOKEN`
4. 如果這個 channel 尚未啟用 Messaging API，先完成啟用。
5. 在 Messaging API 設定頁準備 webhook URL，格式如下：

```text
https://<your-public-host>/webhook
```

## 啟動本機 Server

開發模式：

```bash
npm run dev
```

編譯後啟動：

```bash
npm run build
npm start
```

health check：

```bash
curl http://localhost:3000/health
```

預期回應：

```json
{ "status": "ok" }
```

## 使用 ngrok 在本機測試 Webhook

1. 啟動本機 server：

```bash
npm run dev
```

2. 啟動 tunnel：

```bash
ngrok http 3000
```

3. 複製 ngrok 提供的 HTTPS forwarding URL。
4. 在 LINE Developers Console 中將 webhook URL 設成：

```text
https://<ngrok-id>.ngrok-free.app/webhook
```

5. 在 Messaging API 設定中打開 **Use webhook**。
6. 按下 LINE Developers Console 裡的 **Verify**。

如果 webhook 連線成功，你應該會看到：

- Console 中的 verify 顯示成功
- 本機 server log 出 webhook signature 已通過驗證
- 本機 server log 出收到的 LINE event type

## 其他 Tunnel 選項

你也可以改用其他 tunnel 工具，例如：

```bash
cloudflared tunnel --url http://localhost:3000
```

如果你使用其他 tunnel provider，webhook path 仍然是：

```text
https://<public-host>/webhook
```

## 部署到 Cloud Run

如果你需要穩定的公開 webhook URL，建議把這個 app 部署到 Cloud Run，而不是依賴暫時性的 tunnel。

1. 先確認 `gcloud` 已登入，且已選好目標 GCP project。

```bash
gcloud auth login
gcloud config set project <your-gcp-project-id>
```

2. 建立只給部署使用的 env 檔案。

這個檔案 **不要** commit 進 git。

```yaml
LINE_CHANNEL_SECRET: your_line_channel_secret
LINE_CHANNEL_ACCESS_TOKEN: your_line_channel_access_token
```

範例檔名：

```text
cloud-run-env.yaml
```

3. 從 source 直接部署 service。

```bash
gcloud run deploy line-cafe-bot \
  --source . \
  --region asia-east1 \
  --allow-unauthenticated \
  --env-vars-file cloud-run-env.yaml
```

補充：

- Cloud Run 會自動提供 `PORT`，所以不需要在 `cloud-run-env.yaml` 中設定它。
- 如果你想部署到其他地區，請把 `asia-east1` 換成你的目標 region。

4. 部署完成後，複製 Cloud Run service URL。

範例：

```text
https://line-cafe-bot-xxxxx-uc.a.run.app
```

5. 將 LINE webhook URL 設成：

```text
https://<your-cloud-run-url>/webhook
```

6. 在 LINE Developers Console 中：

- 打開 **Use webhook**
- 點擊 **Verify**

7. 驗證部署後的 health check：

```bash
curl https://<your-cloud-run-url>/health
```

預期回應：

```json
{"status":"ok"}
```

之後如果你更新 bot，只要再執行一次相同的 `gcloud run deploy` 指令，就會發佈新的 revision。

## Day 1：Message Action

目前 Day 1 的行為刻意保持很小，只專注在 `Message action`。

1. 傳以下任一 trigger text 給 bot：
   - `開始`
   - `menu`
   - `help`
   - `顯示咖啡廳條件選單`
2. bot 會回一組使用 `Message action` 的 quick reply buttons。
3. 當你點擊按鈕時，LINE 會自動送出預先定義好的文字訊息給 bot。
4. bot 會回覆它收到哪一個條件，但目前 **不會** 真的開始搜尋咖啡廳。

## 目前範圍

這一版已完成：

- `POST /webhook`
- 使用 `@line/bot-sdk` middleware 做 LINE signature verification
- event parsing
- event type logging
- `GET /health`
- Day 1 `Message action` 練習流程

尚未實作：

- location search logic
- Flex Message response building
- Google Places integration
- database integration
