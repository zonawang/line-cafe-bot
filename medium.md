# 不是修修補補，而是從零開始：我第一次用 Codex 打造全新的 LINE Bot，一天內踩過 webhook、tunnel 與 Cloud Run 的實戰記錄

今天這篇，想記錄一個對我自己來說很有代表性的第一次。

過去我比較常用 Google Antigravity 這類工具，幫我加速既有專案裡的某個功能、某段流程，或是把卡住的小地方往前推一把。那種感覺比較像是：我手上已經有一個差不多成形的東西，AI 幫我把它修得更快、更順。

但今天不太一樣。

今天是我第一次用 Codex，從零開始打造一個全新的 LINE Bot。

不是改現成專案，不是補一個小功能，也不是在既有架構上微調，而是真的從空的 repository 出發，一步一步把一個新的 side project 搭起來，直到它可以真正接上我的 LINE channel、真的回我訊息。

而且這次我刻意只做今天該做的內容，不偷跑未來功能。

這個新專案的主題，是「附近適合工作的咖啡廳搜尋助手」。但今天我給自己的範圍非常明確：

- 建立 TypeScript + Express + LINE SDK 基本架構
- 接好 `POST /webhook`
- 做好 `GET /health`
- 完成 LINE webhook signature verification
- 做出 Day 1 的 `Message action`
- 把 repo 推上 GitHub
- 把 bot 真的接上 LINE channel
- 最後部署到 Cloud Run，讓 webhook 穩定運作

如果只看這份清單，可能會覺得今天只是把「基本功」做完而已。

但實際做下去才發現，真正花時間的從來不是那幾行表面上的功能，而是你要把一整串環境、權限、認證、連線、部署與 webhook 通道上的坑，一個一個排掉。

而這也是今天我對 Codex 最有感的地方。

它不是只幫我生程式碼，而是真的陪我把整條路走完。

## 我今天不是叫 AI 幫我「寫一個 LINE Bot」，而是請它先當一個有分寸的資深工程師

今天一開始，我沒有直接對 Codex 說：「幫我做一個 LINE Bot」。

我反而是先把規則講得很細。

像是：

- 先檢查 repo，如果是空的就初始化
- 先建立 TypeScript + Express + LINE SDK 的基本骨架
- webhook route 不要塞業務邏輯
- route 只負責驗證 LINE webhook、判斷 event type、dispatch 給 handler
- message / action / service 要拆模組
- `.env.example`、`.gitignore`、README 都要有
- 這一輪先不要寫 Day 1 功能以外的東西

這件事其實很關鍵。

因為很多人對 AI coding assistant 的期待，還停留在「你幫我把功能寫出來」。

但我今天真正想測的，是：如果我把需求像對人類工程師一樣講清楚，Codex 能不能真的照順序施工，而不是一興奮就把未來十天的功能都寫進同一個檔案裡。

結果它真的做到了。

它先幫我把 repo 初始化，建好我要的結構，像是：

- `src/app.ts`
- `src/routes/webhook.ts`
- `src/handlers/`
- `src/actions/`
- `src/messages/`
- `src/services/`
- `src/types/`
- `src/utils/`

這一步看起來很基礎，但其實已經決定了這個專案之後會不會越長越亂。

而今天讓我很安心的一點是，Codex 不只是「有把檔案建出來」，而是有理解我想要的是一個可以慢慢往 Day 2、Day 3、Day 4 繼續長的學習型專案，不是一個只求現在能跑的 demo。

## 第一個坑：typecheck 全綠，server 一跑卻直接炸掉

骨架搭完後，下一步很自然就是：

- 安裝依賴
- 跑 `typecheck`
- 跑 `build`

這些都過了。

表面上看起來很順。

結果真正把 server 跑起來時，卻出現了最典型、也最讓人頭痛的一種錯：

TypeScript 沒報錯，
build 也成功，
但 runtime 直接炸掉。

問題最後查出來，是 `@line/bot-sdk` 的 import 寫法在目前輸出格式下不相容。也就是說，從靜態檢查角度看不出來，但實際執行時就是不行。

這種錯最麻煩的地方在於，它會讓人一瞬間懷疑很多事：

- 是不是環境變數沒設？
- 是不是 Node 版本不對？
- 是不是 build 出來的東西壞了？
- 還是 webhook route 有問題？

但 Codex 在這裡做的事，不是模糊地告訴我「你可以檢查 import」，而是直接去看實際的錯誤堆疊，然後把原本的 default import 改成比較穩的 named imports，讓 middleware 和 messaging client 都回到正確的載入方式。

修完之後，server 才真的能成功啟動。

這一段讓我很有感。

因為很多時候，寫程式最花時間的從來不是「不知道要寫什麼」，而是這種你明明看起來都做對了，卻還是會在啟動那一刻出事的灰色地帶。

而 Codex 真正幫上的忙，就是把這種灰色地帶也一起接住。

## Day 1 我刻意做得很小，因為我想先把 Message action 練熟

等骨架穩了之後，我才讓 Codex 進入 Day 1。

而這次的 Day 1，我刻意非常克制。

我沒有讓它直接做完整咖啡廳搜尋流程，也沒有偷跑 Google Places API，更沒有急著做 Flex Message 搜尋結果卡片。

今天我只做一件事：

`Message action`

也就是：

1. 使用者傳 `開始`
2. bot 回一組 quick reply buttons
3. 使用者點按鈕後，LINE 自動送出預設文字
4. bot 再回一段確認訊息

這看起來很小，但它其實練到了很關鍵的基本功：

- webhook 有沒有真的收到事件
- `Message action` 有沒有真的把文字送回來
- event handler 有沒有正確 dispatch
- 回覆訊息的組裝邏輯有沒有獨立出去

我很喜歡 Codex 這次幫我拆的方式。

它沒有把所有邏輯塞進 `messageHandler.ts`，而是拆成幾個責任很清楚的模組：

- `actions/day1MessageActions.ts`
- `messages/day1Messages.ts`
- `handlers/textMessageHandler.ts`
- `services/replyMessageService.ts`

所以最後得到的不是「可以動的功能」，而是一個未來還能繼續擴充的結構。

這對我很重要。

因為我這個專案本來就不是要一口氣衝到成品，而是想把 LINE Messaging API 用 Day 1 到 Day 10 的方式，一步一步練起來。

而如果 Day 1 一開始就亂掉，後面只會更難收。

## 真正讓我卡住的，不是功能，而是把 repo 推上 GitHub

功能做完後，我下一個要求很自然：

把這個新專案推到 `zonawang/line-cafe-bot`。

結果這一步卡住的，不是 Git 指令本身，而是整個開發環境的認證狀態。

像是：

- 本機沒有可用的 GitHub HTTPS credential helper
- SSH key 雖然有，但沒對上 GitHub
- 一開始甚至連 git identity 都沒設定好

如果今天是我自己手動處理，我大概很快就會開始開十幾個分頁查「GitHub SSH 怎麼設」、「為什麼 push 一直失敗」、「怎麼看本機現在用的是哪把 key」。

但 Codex 這次很像一個真的會做環境收尾的工程師。

它一路幫我做了：

- 檢查遠端 repo 狀態
- 設定本機 git identity
- 建立新的 GitHub SSH key
- 補 `~/.ssh/config`
- 驗證 SSH 登入是否成功
- 切換 repo remote 到 SSH
- 最後完成 push

這也是我今天一個很大的感受：

真正讓 side project 卡住的，常常不是「功能不會寫」，而是這種工程環境上很碎、但你又非過不可的關卡。

而 Codex 在這裡很有價值，因為它不是只會講理論，它是真的會一路把這些小事接起來。

## 最大的坑其實不是程式，是 webhook 通道本身

原本我以為，程式碼寫完、推上 GitHub 之後，今天差不多就結束了。

但真正最有戲的部分，反而從這裡才開始。

因為我接下來想做的，是把這個 bot 真正接到我的 LINE channel，讓它不是只是本機上能跑，而是真的能在 LINE 裡回我訊息。

這時候第一個現實問題就是：

LINE 打不到你的 localhost。

所以你需要一條公開網址，把本機 server 暫時暴露出去。

也就是說，你要開始處理 tunnel。

而今天的 tunnel 歷程，幾乎就是一場完整的踩坑記錄：

- 本機 server 沒問題
- webhook endpoint 也沒問題
- 但 `localtunnel` 卡住
- `localhost.run` 一開始有通，後來卻開始回 `503`
- 換 `Cloudflare quick tunnel` 雖然能開網址，LINE 卻直接拒絕這個 endpoint

這一段真的很像在提醒我：

你以為自己在 debug 一個 LINE Bot，
但其實你是在 debug 一整條系統鏈路。

因為你得同時搞清楚：

- LINE 有沒有真的把 event 送出來
- webhook URL 對不對
- `Use webhook` 到底有沒有真的生效
- tunnel 本身是不是活著
- 公開網址是不是不穩
- 還是 reply API 根本沒送成功

今天如果沒有一個能幫我持續觀測這些狀態的代理人，我很可能會誤判成「是不是 Day 1 的程式有 bug」。

但 Codex 一路幫我看 log、看 webhook test、看 `/health`、看 event 有沒有進來，最後把問題收斂得很清楚：

不是 Day 1 handler 壞掉，
而是臨時 tunnel 根本不穩。

## 最後真正解決問題的方式，不是更會 debug，而是改走 Cloud Run

繞了一圈之後，我們最後做了一個很務實的決定：

不要再跟臨時 tunnel 糾纏了，直接部署到 Cloud Run。

這一刻我其實有一種鬆一口氣的感覺。

因為你只要一直留在本機 + 臨時 tunnel 的世界裡，就永遠會有一堆不屬於你功能本身的變數：

- 網址會換
- tunnel 可能斷
- 有些 provider LINE 不接受
- 有些看起來通了，但一下又 503

但一旦換成 Cloud Run：

- webhook URL 穩定
- LINE Console 裡的 `Use webhook` 可以維持 `active: true`
- `Verify` 可以穩定回 `200 OK`
- `/health` 也有正式網址可以測

最後 Codex 幫我把這個 bot 直接部署上 Cloud Run，然後把 LINE webhook 指到正式的 `run.app` 網址。

這一次，事情終於穩定了。

而我再傳一次 `開始`，bot 終於真的回了。

那一刻對我來說，重點不是「好耶，功能成功了」。

而是：

這個專案終於從「今天的實驗」，變成一個可以真的繼續往下做的東西。

## 今天我對 Codex 最大的改觀：它不是幫我省略思考，而是陪我把路走完

如果今天 Codex 只是幫我產生一個 LINE Bot 範例，我其實不會特別想寫這篇文章。

因為那種體驗還停留在「AI 很快」。

但今天讓我印象深刻的是，它實際上扮演了很多不同角色：

- 後端工程師：幫我搭 Node.js + TypeScript + Express + LINE SDK 骨架
- 除錯助手：幫我抓 runtime import 問題
- 測試助手：幫我跑 typecheck、build、smoke test
- DevOps 助手：幫我設定 GitHub SSH、push repo、部署 Cloud Run
- 系統觀測員：幫我判斷問題到底是在程式、平台、還是 tunnel

這和我過去比較常用 Google Antigravity 的情境很不一樣。

以前比較像是在既有脈絡上加速，
今天則更像是：

我第一次真的把 Codex 當成一個可以一起開新專案、一起扛完整交付流程的 AI 工程夥伴。

它不是幫我把學習拿走。

它也不是讓我什麼都不用懂。

反而比較像是，當我把需求、原則、範圍講清楚之後，它會幫我把那些原本很容易讓人半途放棄的摩擦，一個一個降下來。

而對 side project 來說，這件事比「省時間」還重要。

## 今天到底完成了什麼？

如果只算今天，不算今天之前的任何東西，我們實際完成的是：

- 從空 repo 建立新的 `line-cafe-bot`
- 接好 `POST /webhook` 與 `GET /health`
- 完成 LINE webhook signature verification
- 做出 Day 1 的 `Message action`
- 把 repo 推上 GitHub：`zonawang/line-cafe-bot`
- 把 README 改成中文，整理成教學筆記
- 把 bot 接上自己的 LINE channel
- 解掉 tunnel 不穩的問題
- 最後部署到 Cloud Run，讓 webhook 正式穩定運作

換句話說，今天不是只做了一個「按按鈕會回訊息」的小功能。

而是把一個全新的 LINE Bot side project，從零推到一個真的可以在 LINE 上互動、可以正式部署、而且有清楚結構可以繼續往 Day 2 走下去的狀態。

## 結語：AI 真正厲害的地方，不是替你把事情做完，而是陪你把坑走完

今天這輪實作，讓我最有感的不是「AI 好快」。

而是好的 AI coding agent，真的不只是順風局時很好用。

它真正有價值的時候，反而是你遇到那些最煩的真實問題：

- typecheck 全綠，但 runtime 爆炸
- webhook test 成功，聊天卻還是沒反應
- tunnel 一下能用一下不能用
- GitHub 認證卡住
- deploy 前每一步都像不同領域的問題

這些時候，Codex 不是只幫我回答問題，而是幫我一路把問題收斂、排除、驗證，直到真的打通。

而這也是我今天最想記下來的一句話：

Codex 不是幫我省掉了學習，
而是幫我把那些原本會讓人中途放棄的摩擦，降到我還願意繼續往前走的程度。

對一個正在一邊做 side project、一邊練 LINE Messaging API 的人來說，這真的差很多。

如果你最近也在想，要不要試著和 AI coding agent 一起做一個全新的專案，那我今天的答案會是：

可以，而且值得。

但前提不是把需求丟出去等它魔法般完成，
而是你要先想清楚：

- 今天只做什麼
- 不做什麼
- 驗收標準是什麼
- 哪裡是功能問題，哪裡是環境問題

當你把這些講清楚之後，Codex 才會真的從「會寫程式的工具」，變成「能一起把專案推進的人」。

而對我來說，今天最大的收穫就是：

過去我比較常用 Google Antigravity 在既有專案裡加速，
但今天，是我第一次用 Codex 從零打造一個全新的 LINE Bot。

而這個第一次，的確讓我很想繼續做下去。
