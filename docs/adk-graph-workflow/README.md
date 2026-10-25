# Google ADK Graph Workflow 學習目錄

依序閱讀文章，每天安排約 60–90 分鐘。整體範圍見 [10 天課綱](roadmap.md)。

| 天 | 主題 | 文章 | 實作 |
|---|---|---|---|
| 1 | Graph 心智模型與 repo 走讀 | [第 1 天](day-01.md) | 畫現況與目標流程圖 |
| 2 | 架構界線與最小 Graph | [第 2 天](day-02.md) | [兩個 function nodes](../../examples/adk-graph-workflow/day-02/agent.ts) |
| 3 | 節點輸入、輸出與 mock 搜尋 | [第 3 天](day-03.md) | [四站式 Graph](../../examples/adk-graph-workflow/day-02/day03Agent.ts)、[共用資料模組](../../src/workflows/cafe) |

## 跑 Day 2 / Day 3 範例

先從 repo 根目錄進入 `examples/adk-graph-workflow/day-02`。使用 Node.js 20.19 以上，執行 `npm install` 安裝範例依賴。

- Day 2：`npm run run`
- Day 3：`npm run run:day3`

這些範例使用一般函式與假資料，不需要 Google/LINE 憑證。程式尚未接到正式 webhook。安裝、CLI 執行與課程手動驗收尚未由作者在此環境執行；請依各篇步驟在本機操作。
