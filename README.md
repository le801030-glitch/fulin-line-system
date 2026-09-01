# 富林里民即時反映系統 Prototype

這是一個可直接開啟的前端原型，包含：

- 居民問題回報
- 7 大分類
- 自動產生案件編號
- 案件進度查詢
- 後台更新案件狀態
- LINE 官方帳號按鈕
- LIFF 登入預留
- 里務公告／福利補助／活動資訊入口

## 如何預覽

直接用瀏覽器開啟 `index.html`。

管理後台：
`admin.html`

> 目前案件資料使用瀏覽器 localStorage，因此只適合展示與測試。

## 連結官方 LINE

打開 `config.js`，修改：

```js
LINE_OFFICIAL_URL: "https://lin.ee/YOUR_LINE_LINK"
```

改成你的官方 LINE 加好友網址。

## 串接 LIFF

1. 到 LINE Developers 建立 Provider / Login Channel。
2. 建立 LIFF App。
3. 取得 LIFF ID。
4. 在 `config.js` 填入：

```js
LIFF_ID: "你的LIFF_ID"
```

之後從 LINE 開啟 LIFF 網址時，可取得登入者基本資料並預填名稱。

## 正式上線建議架構

前端：
- HTML/CSS/JavaScript 或 Next.js / Vue

後端：
- Node.js + Express / Next.js API

資料庫：
- Supabase / PostgreSQL / Firebase

圖片：
- Supabase Storage / Cloudinary

LINE：
- LINE Login + LIFF
- Messaging API Webhook
- Push Message / Reply Message

### 正式版流程

1. 里民從官方 LINE Rich Menu 點「我要反映問題」
2. 開啟 LIFF 網頁
3. 自動辨識 LINE 使用者
4. 填寫分類、地點、照片、說明
5. 後端建立案件
6. LINE 回傳案件編號
7. 後台更新案件狀態
8. 每次更新自動 Push LINE 通知里民
9. 里民可在 LINE 或網站查詢進度

## 建議案件狀態

- 已收到
- 確認中
- 已通報權責單位
- 處理中
- 待其他單位處理
- 已完成

## 重要

正式上線前，需要加上：
- 管理員登入
- 權限控制
- 個資告知與隱私政策
- 防垃圾訊息／Rate Limit
- 圖片上傳與檔案限制
- 資料庫備份
- HTTPS
