# line-cafe-bot

這是一個用 LINE Messaging API 練習後端開發的 side project，主題是「附近適合工作的咖啡廳搜尋助手」。

目前這個 repo 還在早期階段，先把最重要的骨架搭好，並完成 Day 1 的 `Message action` 練習。也就是說，你現在可以先學會：

1. 怎麼把 LINE webhook 接進自己的 Node.js / Express server
2. 怎麼驗證 LINE signature
3. 怎麼把 webhook route 保持乾淨，只做 dispatch
4. 怎麼用 `Message action` 做一個最小可運作的互動 flow

## 目前做到哪裡

這一版已完成：

- TypeScript + Express 專案骨架
- `POST /webhook`
- LINE webhook signature verification
- event parsing 與 event type logging
- `GET /health`
- Day 1 `Message action` 練習流程
- 可部署到 Cloud Run

這一版還沒做：

- location search logic
- Google Places integration
- Flex Message search result UI
- 收藏、換一批、回報錯誤等完整 flow
- database integration

## 技術棧

- Node.js
- TypeScript
- Express
- LINE Messaging API
- `@line/bot-sdk`
- `dotenv`

## 專案結構

這個專案刻意把責任拆開，避免所有邏輯都堆進 webhook route。

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

你可以用下面這個心智模型理解：

- `routes/webhook.ts`
  只負責接 LINE webhook、驗證 signature、把 event 丟給 handler。
- `handlers/`
  負責依照 event type 決定邏輯流程。
- `actions/`
  放 LINE action 定義，像這次 Day 1 的 `Message action`。
- `messages/`
  放回覆訊息的組裝邏輯。
- `services/`
  放 SDK client 或之後會接的外部服務。
- `types/`
  放 TypeScript 型別定義。
- `utils/`
  放環境變數、logger 這類共用工具。

## 如果你只是想先跑起來

照這四步就夠：

1. 建立 `.env`
2. 填入 LINE channel credentials
3. `npm install`
4. `npm run dev`

完整步驟如下。

## Step 1：建立環境變數

先建立專案用的環境變數檔：

```bash
cp .env.example .env
```

然後填入：

```env
PORT=3000
LINE_CHANNEL_SECRET=your_line_channel_secret
LINE_CHANNEL_ACCESS_TOKEN=your_line_channel_access_token
```

說明：

- `LINE_CHANNEL_SECRET` 來自 LINE Developers Console 的 `Channel secret`
- `LINE_CHANNEL_ACCESS_TOKEN` 來自 Messaging API channel 的 `Channel access token`
- 真正的 secret / token 不要 commit 進 git

## Step 2：安裝依賴並啟動本機 server

安裝依賴：

```bash
npm install
```

開發模式啟動：

```bash
npm run dev
```

如果你想測試編譯後版本：

```bash
npm run build
npm start
```

## Step 3：先驗證 server 本身有沒有活著

本機 health check：

```bash
curl http://localhost:3000/health
```

預期回應：

```json
{ "status": "ok" }
```

如果這一步不通，先不要急著碰 LINE Console。先把本機 server 跑通再說。

## Step 4：設定 LINE Developer Console

你需要一個 Messaging API channel。

在 LINE Developers Console 裡：

1. 建立新的 Messaging API channel，或選擇既有 channel
2. 取得這兩個值，填回本機 `.env`
   - `Channel secret`
   - `Channel access token`
3. 確認 Messaging API 功能已啟用
4. 先準備好 webhook URL，格式會是：

```text
https://<your-public-host>/webhook
```

## Step 5：在本機測 webhook

本機 server 本身不能直接被 LINE 打到，所以你需要一條公開 URL。

### 方案 A：使用 ngrok

1. 啟動本機 server：

```bash
npm run dev
```

2. 啟動 tunnel：

```bash
ngrok http 3000
```

3. 複製 ngrok 提供的 HTTPS URL
4. 到 LINE Developers Console，把 webhook URL 設成：

```text
https://<ngrok-id>.ngrok-free.app/webhook
```

5. 打開 **Use webhook**
6. 按 **Verify**

### 方案 B：其他 tunnel 工具

例如：

```bash
cloudflared tunnel --url http://localhost:3000
```

不管你換哪個 provider，真正給 LINE 的路徑都還是：

```text
https://<public-host>/webhook
```

## Step 6：怎麼判斷 webhook 真的接通

如果接通了，你通常會看到三種跡象：

1. LINE Developers Console 的 `Verify` 顯示成功
2. 本機 server log 出 webhook signature 驗證成功
3. 本機 server log 出收到的 LINE event type

如果 `Verify` 失敗，優先檢查：

1. webhook URL 有沒有填到 `/webhook`
2. 本機 server 有沒有真的在跑
3. tunnel URL 有沒有失效
4. `Use webhook` 有沒有真的打開

## Step 7：部署到 Cloud Run

如果你不想一直依賴暫時性的 tunnel，最實際的做法是直接部署到 Cloud Run。

### 7-1. 先確認 `gcloud` 設定

```bash
gcloud auth login
gcloud config set project <your-gcp-project-id>
```

### 7-2. 建立部署專用 env 檔

這個檔案不要 commit。

```yaml
LINE_CHANNEL_SECRET: your_line_channel_secret
LINE_CHANNEL_ACCESS_TOKEN: your_line_channel_access_token
```

範例檔名：

```text
cloud-run-env.yaml
```

### 7-3. 部署

```bash
gcloud run deploy line-cafe-bot \
  --source . \
  --region asia-east1 \
  --allow-unauthenticated \
  --env-vars-file cloud-run-env.yaml
```

補充：

- Cloud Run 會自動提供 `PORT`
- 所以 `cloud-run-env.yaml` 不需要放 `PORT`
- 如果你要用別的 region，把 `asia-east1` 換掉就好

### 7-4. 把 LINE webhook 指到 Cloud Run

部署完成後你會拿到一個 Cloud Run URL，例如：

```text
https://line-cafe-bot-xxxxx-uc.a.run.app
```

把 LINE webhook URL 設成：

```text
https://<your-cloud-run-url>/webhook
```

然後：

1. 打開 **Use webhook**
2. 按 **Verify**

### 7-5. 驗證部署結果

```bash
curl https://<your-cloud-run-url>/health
```

預期回應：

```json
{"status":"ok"}
```

之後如果你更新 bot，重新執行同一條 `gcloud run deploy` 指令就會發佈新 revision。

## Day 1：Message Action 現在可以怎麼玩

目前 Day 1 的目標很單純：確認你已經會用 `Message action` 做最小互動。

你可以傳以下任一訊息給 bot：

- `開始`
- `menu`
- `help`
- `顯示咖啡廳條件選單`

預期行為：

1. bot 回一組 quick reply buttons
2. 這些按鈕背後用的是 `Message action`
3. 你點下去後，LINE 會自動送出預設文字
4. bot 會回覆它收到哪個條件

這一步故意不接真實搜尋，因為目前目標只是把 Day 1 的互動機制練熟。

## Day 1 驗收標準

你可以用下面這個標準確認自己真的完成 Day 1：

1. 傳 `開始`，bot 有回 quick reply
2. 點任一按鈕，bot 有回確認訊息
3. server log 能看到 text message event
4. webhook route 本身沒有堆進業務邏輯


