# 第 2 天：把 ADK Graph 放進 LINE Bot，先從隔離的小沙盒開始（60–90 分鐘）

今天要從「畫流程」走到「讓 ADK 執行流程」，但先不接 LINE，也不碰正式 webhook。這不是多繞一步，而是先確認 Node.js 版本、套件和 Graph 寫法都站得住，再接回既有服務。

## 學習目標

完成今天後，你可以：

- 說出 LINE webhook adapter 和 ADK workflow 的工作差異。
- 知道 ADK TypeScript 2.x 的最低 Node.js 需求。
- 讀懂 `Workflow`、`node()`、`edges` 和 `START` 的最小組合。
- 在本機執行不需要模型 API key 的 function-only graph。

## 概念：櫃台和內場不要混在一起

把 LINE webhook 想成餐廳櫃台：它負責收單、確認送單來源、把訂單送進內場，最後把餐點交還顧客。ADK Graph Workflow 則像內場工作動線，負責決定先做什麼、接著做什麼、遇到不同條件往哪個工作站走。

套回 bot：

- `src/routes/webhook.ts` 驗證 LINE signature，接收事件。
- handlers 判斷這是哪一種 LINE event。
- ADK workflow 逐步承接「怎麼處理使用者需求」。
- `replyMessageService` 將最後結果送回 LINE。

因此，第一步不需要拿掉 webhook 或把 LINE SDK 包進 agent。先保持櫃台穩定，獨立試跑內場流程。等我們確認輸入與輸出格式後，再在後續階段接起來。

Google ADK TypeScript 官方目前要求 Node.js 20.19 以上；這個 repo 的 production 專案目前只宣告 Node.js 20 以上。為了不在還沒檢查部署環境前就改 production 的版本限制，我把 Day 2 放在獨立教學資料夾，讓 sandbox 明確要求 Node 20.19。 [ADK TypeScript 官方安裝說明](https://github.com/google/adk-js#installation)

## 跟著做：執行兩站式 Graph

開啟 `examples/adk-graph-workflow/day-02`：

1. 執行 `npm install`。這會在 sandbox 裡安裝 `@google/adk` 和 CLI，並產生這個範例自己的 lockfile；root app 的依賴保持不動。
2. 執行 `npm run run`，在互動提示中輸入 `quiet cafe with outlets`。
3. 打開 `agent.ts`，看兩個 function node：
   - `normalizeCafeRequest` 去掉前後空白。
   - `explainNextStep` 根據文字產生下一步說明。
4. 找到 `edges` 裡的順序：`START → normalizeCafeRequest → explainNextStep`。

ADK 官方的 TypeScript Graph 範例也以 `Workflow`、`node(function)` 和 `edges` 組出依序執行的節點；function node 可以先用一般 TypeScript 函式處理資料，不必先呼叫 LLM。[ADK TypeScript Graph workflow 範例](https://github.com/google/adk-js/blob/main/samples/workflows/routes/function_node/agent.ts)

第一個 node 回傳的字串會變成下一個 node 的輸入。今天雖然只有兩站，已經是可執行的 graph：ADK 知道從哪裡開始、要走哪個節點、完成後交給誰。

## 自己動手：改變第二站的結果

把 `explainNextStep` 改成兩種回覆：

- 輸入是空字串時，詢問使用者分享位置。
- 有條件文字時，回覆「下一步會先確認位置，再搜尋咖啡廳」。

用三種輸入在 CLI 手動操作：空白、`找安靜咖啡廳`、`quiet cafe with outlets`。今天先手動看輸出；不需要 API key，也不用新增正式 LINE 行為。

## 驗收標準

- 能說明 webhook 是櫃台、workflow 是內場動線。
- 知道 Node 20.19 是 ADK TypeScript 的安裝需求。
- 能在圖中指出起點、兩個節點和執行順序。
- 範例依照輸入得到預期的說明文字。
- production webhook、root dependency 和 LINE reply 行為都未在這個階段改動。

## 演講講稿重點

「我們先把 ADK workflow 做成一個獨立內場：它只接收文字、跑兩個 function node、回傳結果。LINE webhook 保留驗簽和 HTTP 服務，之後再透過明確的 input/output contract 呼叫 workflow。先隔離，是為了能分別確認每一層的責任和版本需求。」

## 常見誤解

- **今天已經把 bot 改成 ADK 了：**還沒有；我們先做可執行 sandbox，下一步才把 LINE 輸入整理成 workflow contract。
- **workflow 節點都要呼叫 Gemini：**不用。這兩個節點只有普通程式碼，也能構成 ADK graph。
- **正式 app 現在必須升級 Node 版本：**不用急著改。先在獨立 sandbox 驗證，再決定整合時如何更新 production 與部署環境。
- **加了 ADK 就可刪掉 webhook handler：**不對。HTTP 驗簽、LINE event parsing 和對話流程是不同責任，接下來會逐步接合而不是混成一層。
