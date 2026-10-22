# Google ADK Graph Workflow：10 天學習與實作路線

**目標：**在 10 次、每次約 60–90 分鐘的學習中，用 Google ADK TypeScript Graph Workflow 漸進改造 LINE Cafe Bot，最後完成可向初學者展示的 demo 和演講大綱。

原本 20 天把不少相鄰概念切得太細。這個版本把每次學習安排成一個完整成果：理解一組概念、在 repo 動手、說得出設計理由。能幫助完成 Graph Workflow demo 的內容列為必要；不是達成演講目標所需的進階功能則先延後。

## 必要範圍

- Graph 基礎：node、edge、route，以及輸入如何流過節點。
- ADK workflow 和 LINE webhook 的責任邊界。
- 一般程式、LLM agent、tool 各自適合處理什麼。
- 條件路由、基本 session/state、錯誤與 fallback。
- LINE 整合、基本品質驗收、安全與成本。
- 一個可靠的 demo，以及演講時能解釋的架構圖。

## 10 天課程

建議每天約 60–90 分鐘：15 分鐘理解概念、30–45 分鐘跟著改 code、15–20 分鐘獨立練習與回顧。若遇到套件安裝或 API 憑證等環境問題，當天可先完成 mock 版本和設計，不需要為了上課先購買服務。

| 天 | 主題 | Repo 實作 / 當日成果 |
|---|---|---|
| 1 | Graph Workflow 是什麼 + 走讀現有 bot | 追蹤 webhook → handler → LINE reply，畫現況圖與目標圖；列出有位置、缺位置、無結果三種路徑。 |
| 2 | ADK TypeScript 與架構邊界 | 確認 Node/ADK 版本和設定方式；新增 ADK workflow 的最小骨架，保留 LINE webhook 驗簽與 HTTP route。 |
| 3 | 節點與資料流 | 定義 LINE event 到 workflow 的輸入/輸出型別；用 deterministic mock 節點走完一次線性流程。 |
| 4 | 條件路由與 fallback | 實作 help、缺位置、有效位置、無效位置、找到/找不到店家的分支。 |
| 5 | Function、tool 和 LLM agent | 以一般程式做驗證與格式化；把 mock 搜尋包成受限 tool；只在需要理解自然語言偏好時引入 agent。 |
| 6 | Session/state 與錯誤處理 | 說明哪些資料要跨訊息保存；加入必要的 timeout/error/fallback，避免多輪狀態洩漏。 |
| 7 | 接回 LINE 與追蹤執行 | 把 workflow output 交給現有 reply service；走讀一筆請求，說明如何找出錯誤節點。 |
| 8 | 品質、安全與成本 | 用手動案例驗收主要路徑；確認 log 不記秘密或不必要的個資，列出模型/API 呼叫界線。 |
| 9 | 部署與可靠 demo | 利用 repo 既有 Cloud Run 說明，整理設定、health check、演示前檢查及失敗備案。 |
| 10 | 演講整合與彩排 | 產出一張架構圖、5–10 分鐘 demo 腳本、核心術語表、FAQ 與演講大綱。 |

## 先延後的選修內容

以下內容有價值，但不必阻塞初學者理解 Graph Workflow 或完成演講 demo：

- 多個分支同時執行（parallel / fan-out）和 Join。
- Multi-agent 協作、動態 workflow。
- 真正的 Google Places API、地圖資料費用與 quota。
- 資料庫型 session、跨部署的持久化。
- 完整 tracing/evaluation 平台與生產環境的進階監控。

有時間時，可以在第 10 天的「下一步」投影片介紹，不必塞進核心實作。

## 分階段驗收

- **Phase A，Day 1–3：**能說明目前程式怎麼處理訊息，並完成一條最小 ADK graph。
- **Phase B，Day 4–6：**graph 能依情境分流，搜尋使用 mock tool，錯誤有可預期回覆。
- **Phase C，Day 7–9：**LINE 回覆仍然工作，能手動驗收主要案例，並說清楚部署及安全界線。
- **Phase D，Day 10：**能用架構圖和 demo 向初學者解釋一次完整請求。

每一天的 code 修改都會放在獨立分支的 draft PR 供審閱，不直接改 main。ADK API、版本與執行環境需求，依當時 Google 官方 TypeScript 文件確認。
