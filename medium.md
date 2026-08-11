# 我第一次用 Codex 從零做 LINE Bot：不只寫出 Message action，還把 webhook 和部署一路打通

今天想記錄一個我自己很有感的第一次：

我第一次用 Codex，從空的專案資料夾開始，做一個全新的 LINE Bot。

這不是修舊功能，也不是幫既有專案補一個小需求，而是真的從零開始，把一個「附近適合工作的咖啡廳搜尋助手」架起來。

但我今天沒有想一次把整個產品做完。我給自己的範圍很明確，只做 Day 1：

- 建立 TypeScript + Express + LINE SDK 的基本架構
- 接好 `POST /webhook`
- 做好 `GET /health`
- 完成 LINE webhook 驗證
- 做出 Day 1 的 `Message action`
- 把程式碼推上 GitHub
- 接上自己的 LINE channel
- 部署到 Cloud Run

如果你是第一次接觸 LINE Bot，這串清單看起來可能有點多。但今天做完之後，我反而更確定一件事：對初學者來說，最重要的不是功能做得多快，而是先把第一天的基本功做完整。

## 我沒有先叫 AI 生功能，而是先把施工規則講清楚

今天一開始，我沒有直接跟 Codex 說「幫我做一個 LINE Bot」。

我先把幾個原則講清楚：

- 只做 Day 1，不偷跑後面的功能
- `webhook` route 只負責接 LINE event、驗證、dispatch
- 不要把所有邏輯塞在同一個檔案裡
- message、action、service 要拆開
- `.env.example`、README、`.gitignore` 都要補齊

這件事比我原本想像中更重要。

因為很多第一次做 bot 的專案，一開始確實會「動」，但往往也從第一天就開始變亂。等到你要加 location、postback、Flex Message 或搜尋服務時，才發現整包都纏在一起。

這次 Codex 幫我先搭好的，不只是程式能跑的骨架，而是一個還有未來的結構。像是：

- `src/routes/webhook.ts`
- `src/handlers/textMessageHandler.ts`
- `src/actions/day1MessageActions.ts`
- `src/messages/day1Messages.ts`
- `src/services/replyMessageService.ts`

這個拆法很實際。

`webhook.ts` 不碰業務邏輯，只負責接事件和分派；文字訊息交給 handler；按鈕內容放在 action / message module；回覆訊息則集中在 service。這樣的好處不是「看起來比較專業」，而是之後你真的比較加得動功能。

## Day 1 的功能很小，但它其實是第一個技術里程碑

今天真正做出的互動很簡單：

1. 使用者傳 `開始`
2. bot 回一組快速回覆按鈕
3. 使用者點按鈕
4. LINE 自動送出指定文字
5. bot 回一句確認訊息

這就是 LINE Messaging API 裡很常見的 `Message action`。

它看起來只是個按鈕，但其實很適合當第一個里程碑。因為只要這個流程有通，你就等於一次確認了幾件事：

- webhook 有真的收到事件
- 文字訊息有被正確解析
- bot 有成功呼叫 reply API
- 按鈕有正確觸發指定文字
- 目前的模組拆分沒有把流程搞亂

對初學者來說，這種「小但完整」的功能比一開始衝大功能更有意義。你不是只做出一顆按鈕，而是先把整條鏈路跑通。

## 第一個坑很典型：typecheck 和 build 都過了，程式還是不能跑

今天第一個真正卡住我的地方，不是商業邏輯，而是 runtime。

骨架建完後，型別檢查是綠的，編譯也成功。照理說應該很穩了，結果 server 一跑起來還是爆掉。最後查到的原因，是 `@line/bot-sdk` 的匯入寫法在這個專案設定下不夠穩。

這件事很值得記下來，因為它就是新手很容易忽略的地方：

會 typecheck，不代表真的能執行。
會 build，也不代表部署後一定正常。

Codex 在這裡幫我做得最好的地方，不是丟一堆可能原因，而是沿著實際錯誤往下查，最後把匯入方式調整成比較穩的寫法，讓 server 真的啟動起來。

這也提醒我，很多時候真正重要的驗證，不是看終端機一片綠，而是你真的把程式跑起來一次。

## 真正花時間的，不是寫按鈕，而是把整條通道打通

功能寫出來後，我原本以為差不多了，結果後面才是今天最像實戰的部分。

第一個是 GitHub。功能做完，不代表就能順利 push。git identity、SSH key、遠端認證，這些都不是產品的一部分，但你又一個都跳不掉。

第二個是 webhook 通道。這裡其實才是今天最大的坑。

如果你在本機開發 LINE Bot，就一定會遇到一個很現實的問題：
你的 server 在電腦裡跑得再好，LINE 也不一定打得到。

所以你需要一個公開網址，暫時把本機 server 暴露到外網。這就是很多人會用的 tunnel。

問題是，今天最不穩的剛好就是這條通道。

表面上你看到的是：

- webhook test 有時候過、有時候不過
- `開始` 剛剛還有回，下一次卻沒反應
- 公開網址能開，但 LINE 不一定接受
- 有些時候甚至直接回 `503`

但背後真正要排查的是一整條鏈路：

- LINE 有沒有真的把 event 送出來
- webhook URL 有沒有填對
- `Use webhook` 有沒有打開
- `/health` 有沒有正常
- reply API 有沒有真的送成功
- tunnel 本身是不是已經不穩了

這也是今天我最有感的一點：真正麻煩的，常常不是程式碼本身，而是你要同時面對好幾層系統問題。

## 最後讓整件事穩下來的，不是再猜，而是直接上 Cloud Run

今天後來一個很關鍵的決定，是不要再跟臨時 tunnel 糾纏，直接把服務部署到 Cloud Run。

如果用白話的方式講，Cloud Run 就是把你的程式放到雲端，給它一個固定、公開、比較穩定的網址。對 LINE Bot 來說，這件事非常重要，因為 webhook 只要不穩，前面的功能做得再對，使用者體感還是會像壞掉一樣。

換到 Cloud Run 之後，情況就很明顯地改善了：

- webhook URL 固定下來
- `/health` 可以穩定測
- LINE Console 裡的 webhook 狀態比較穩
- bot 的回應也終於變得一致

當我再傳一次 `開始`，bot 真的正常回訊息的那一刻，我最強烈的感覺不是「按鈕終於動了」，而是：

這個專案終於不是一個只存在於 localhost 的實驗，而是一個可以繼續往 Day 2 走下去的產品雛形。

## 我對 Codex 最大的改觀，不是它寫得快，而是它真的能一起把事做完

如果今天 Codex 只是幫我生一個範例，我大概不會特別記錄。

但這次它比較像一個真的能一起做事的工程夥伴：幫我搭專案骨架、補基礎文件、抓 runtime 問題、確認 webhook 狀態、陪我排 tunnel 問題，最後一路推到部署完成。

它沒有幫我跳過學習；它幫我跨過的，是那些最容易讓人中途放棄的摩擦。

這也是我今天最想記下來的一句話：

開始做一個 LINE Bot，最難的通常不是功能本身，而是把第一天順利做完。

## 如果你也想直接看今天這版實作

今天這篇提到的內容，包含 LINE webhook、Day 1 的 `Message action`、專案基礎架構，以及 Cloud Run 部署設定，現在都已整理並開源在這個 repo。

👉 本期內容 GitHub：
https://github.com/zonawang/line-cafe-bot

👉 更多過往相關專案整理紀錄：
https://github.com/zonawang/zona-ai-learning-lab

如果你對實作細節有任何想法或問題，也歡迎直接到 GitHub 開 issue 一起交流。
