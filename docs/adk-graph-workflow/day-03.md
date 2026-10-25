# 第 3 天：讓資料走過 Graph——從 LINE 訊息到咖啡廳回覆

今天把第二天的「字串接字串」升級成有明確輸入、輸出的流程。預留 60–90 分鐘：15 分鐘理解資料契約，35 分鐘走讀與操作，20 分鐘改寫，最後用自己的話講一次。

## 學習目標

看懂每個 node 收什麼、交出什麼；把 LINE 訊息轉成 workflow 可用的資料；用固定假店家走完線性 graph，辨認程式資料與畫面文字的差異。

## 用點餐單理解資料契約

咖啡店裡，櫃台不能只喊「那個客人要一杯」。內場需要明確的品項、數量和備註。資料契約也是一張約定好欄位的單子，讓下一站知道能讀什麼。

新增的 `src/workflows/cafe/contracts.ts` 定義這幾張單：

| 階段 | 型別 | 主要內容 |
|---|---|---|
| 進入流程 | CafeWorkflowInput | 文字、可選位置 |
| 整理需求 | CafeSearchRequest | query、可選位置 |
| mock 搜尋 | CafeSearchResults | request、cafes、source |
| 產生回覆 | CafeWorkflowOutput | text、cafeIds、source |

位置是可選欄位，代表流程目前允許「尚未收到位置」。今天先傳資料，明天才根據位置分支。型別能幫編譯器檢查程式是否正確使用欄位；它不會自動驗證網路送進來的 JSON。

## 跟著做：追蹤四站式流程

在 repo 切到 `adk-graph-day02` 分支，進入 `examples/adk-graph-workflow/day-02`。第一次操作先執行 `npm install`，然後執行：

```bash
npm run run:day3
```

在 CLI 輸入「找安靜、有插座的咖啡廳」，接著打開 `day03Agent.ts`：

```text
START → mapLineInput → normalizeRequest → mockSearch → renderReply
```

第一站把 CLI 文字包成最小 LINE 文字事件，再交給 `lineInputAdapter.ts`；adapter 只取文字或座標，不把 reply token 帶進 graph。第二站去掉前後空白，形成搜尋需求。第三站回傳兩家虛構店家。第四站產生可讀的回覆。

mock 固定回傳同一組資料，尚未依位置或偏好篩選。畫面會明確標示「教學假資料」，不能把它當作真實附近搜尋。

## 為什麼有 output，還要 content？

ADK 的節點會產生事件。`output` 是下一站取得的資料；`content` 是給人看的內容。今天前三站只交出 structured output，最後一站同時給出 `CafeWorkflowOutput` 和畫面文字。中途沒有顯示文字，不代表節點沒執行。[Google 官方 node output 範例](https://github.com/google/adk-js/blob/main/samples/workflows/data_handling/node_output/agent.ts) [官方 user-facing messages 範例](https://github.com/google/adk-js/blob/main/samples/workflows/data_handling/user_message/agent.ts)

圖中的順序由 `edges` 定義，工作邏輯則放在可重用的純函式。後續把 LINE 接上來時，可以沿用資料契約與 mock pipeline，不需要讓搜尋邏輯依賴 HTTP request。

## 自己動手：加一個欄位，追一次影響

在 `DemoCafe` 加上 `hasWifi: boolean`，替兩家示範店填值，再修改 `formatCafeResults`，讓回覆顯示「有 Wi-Fi／無 Wi-Fi」。不要改 Graph 的順序。

接著把 mock 陣列暫時改成空陣列，觀察回覆，再還原。今天的 formatter 尚未為空結果寫友善分支；請記下缺口，留到第 4 天的路由實作。

## 驗收標準與演講重點

你應該能指出四站各自收到的型別，看到兩家假店家，並完成 Wi-Fi 欄位練習。說明一次資料如何從 LINE-like event 變成 output，以及為何 reply token 不需要進入搜尋資料。

演講可以說：「Graph 決定工作順序，資料契約決定交接格式。先讓假資料完整走過每一站，我們就能確認各層如何合作，再換成真實工具。」

常見誤解有三個：TypeScript 型別不是執行時驗證；CLI 包出的事件不是實際 LINE webhook；mock 出現店家不代表已完成真實搜尋。正式 webhook 尚未接上，今天也不需要模型或 Places 憑證。

> 交付狀態：程式依 Google 官方 TypeScript 範例比對撰寫；此環境尚未安裝依賴或執行 CLI，以上是你本機操作的預期結果，並非已通過的執行紀錄。
