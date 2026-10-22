# Google ADK Graph Workflow：20 天學習與實作路線

目標：以初學者能理解的方式，將目前的 LINE Cafe Bot 從簡單的事件 handler，逐步演進為 Google ADK TypeScript 2.0 Graph Workflow，並準備一場可現場展示的演講。

## 教學原則

- 沿用 repo 現有的 TypeScript / Node.js；採 Google ADK 的 TypeScript 套件。
- LINE webhook 繼續負責驗簽、接收事件與回覆 API；workflow 負責對話流程。
- 從 deterministic 節點與 mock 咖啡廳資料開始，再逐步加入 LLM agent 與外部工具。
- 每天只做一個可理解的小改動；每一階段都在此 draft PR 供審查，不直接改 main。
- 每日文章留在 `docs/adk-graph-workflow/`，方便後續整理成演講教材。
- ADK API、版本、Node.js 條件以當時 Google 官方文件為準。

## Phase 1：先建立心智模型（Day 1–4）

1. Graph Workflow 是什麼：節點、邊、條件路由。
2. 從 webhook 到 workflow：保留 HTTP adapter，讓職責清楚。
3. 節點的輸入與輸出：把 LINE event 轉為明確的 workflow input。
4. Context 與狀態：在節點間傳遞搜尋需求，不把所有資料混成一包。

## Phase 2：做出可理解的 Graph（Day 5–8）

5. 線性 workflow：建立最小流程並保留目前 bot 回覆行為。
6. 條件路由：區分 help、需要位置、可開始搜尋等情況。
7. 確定性邏輯與 LLM agent：先由程式做可靠判斷，說明何處才需要模型。
8. 建立第一個 LLM agent：加入模型設定與安全的本機憑證設定。

## Phase 3：把咖啡搜尋變成工具（Day 9–12）

9. Tool/function：以有型別的輸入輸出包裝 mock cafe search。
10. 驗證與 fallback：處理無效位置、缺資料和找不到店家。
11. Retry、timeout 與錯誤分支：讓外部服務失敗時有明確結果。
12. Debug graph：理解節點事件、輸出、路由與錯誤資訊。

## Phase 4：整合 LINE Cafe Bot（Day 13–16）

13. 建立可替換的 Places adapter，先維持 mock，並定義 API/費用邊界。
14. 排序與推薦：以明確規則處理距離、營業中和適合工作的條件。
15. 將 workflow output 交回 LINE reply adapter。
16. 多輪對話與 session：安全保存必要的搜尋條件。

## Phase 5：品質、部署與演講（Day 17–20）

17. 建立 evaluation 案例與人工驗收標準。
18. Observability、安全與成本控制。
19. Cloud Run 設定與可重複的 demo 流程。
20. 整合演講：系統圖、取捨、現場展示腳本與初學者常見問題。

## 分階段驗收

- Phase 1：能說明 webhook、workflow、node、edge、route 的差異。
- Phase 2：現有 LINE 互動能沿著明確 Graph 流程完成。
- Phase 3：搜尋由有型別的工具執行，錯誤有可預期的處理方式。
- Phase 4：LINE 收到 workflow 產生的回覆，多輪狀態有清楚邊界。
- Phase 5：能以範例展示成功、缺位置、找不到結果與服務失敗四種情境。

> 本路線不代表每個功能都已實作完成；每個 phase 會依 PR 中實際完成的內容更新。
