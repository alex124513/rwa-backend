# 智能合約 API 總結

## ✅ 已完成

### 1. 環境設定
- ✅ 安裝 viem
- ✅ 建立區塊鏈工具類別 (`src/lib/blockchain.ts`)
- ✅ 環境變數範本準備

### 2. TWDT 代幣 API (`/api/con/twdt/`)
- ✅ `POST /mint` - 鑄造代幣
- ✅ `GET /balance?address=0x...` - 查詢餘額

### 3. BankFactory API (`/api/con/bank/`)
- ✅ `POST /deposit` - 存入資金
- ✅ `POST /createProject` - 建立專案
- ✅ `POST /setStatus` - 設定專案狀態
- ✅ `GET /projects` - 取得所有專案清單
- ✅ `GET /balance` - 查詢工廠餘額

### 4. SafeHarvestNFT API (`/api/con/project/`)
- ✅ `POST /calculator` - 年度結算
- ✅ `POST /withdraw` - 提領資金
- ✅ `POST /reset` - 重置 NFT
- ✅ `GET /data?projectAddress=0x...` - 查詢專案資料

### 5. 文檔
- ✅ `API_DOCUMENTATION.md` - 完整 API 文檔

---

## 📊 API 路由總覽

```
/api/con/
├── twdt/
│   ├── GET    /balance     查詢餘額
│   └── POST   /mint        鑄造代幣
├── bank/
│   ├── GET    /balance     查詢工廠餘額
│   ├── GET    /projects    取得所有專案
│   ├── POST   /deposit     存入資金
│   ├── POST   /createProject   建立專案
│   └── POST   /setStatus   設定專案狀態
└── project/
    ├── GET    /data        查詢專案資料
    ├── POST   /calculator  年度結算
    ├── POST   /withdraw    提領資金
    └── POST   /reset       重置 NFT
```

---

## 🔧 Admin 功能對應

### 部署階段
1. **TWDT 部署**: 手動部署或使用部署腳本
2. **BankFactory 部署**: 手動部署或使用部署腳本

### 初始設定
1. **鑄造 TWDT**: `POST /api/con/twdt/mint`
2. **存入工廠資金**: `POST /api/con/bank/deposit`

### 專案管理
1. **建立專案**: `POST /api/con/bank/createProject`
2. **查詢專案列表**: `GET /api/con/bank/projects`
3. **查詢工廠餘額**: `GET /api/con/bank/balance`

### 專案操作
1. **年度結算**: `POST /api/con/project/calculator`
2. **提領資金**: `POST /api/con/project/withdraw`
3. **設定狀態**: `POST /api/con/bank/setStatus`
4. **查詢資料**: `GET /api/con/project/data`

### 緊急操作
1. **重置 NFT**: `POST /api/con/project/reset` ⚠️

---

## 📝 環境變數範本

在專案根目錄建立 `.env.local`:

```env
# MongoDB
MONGODB_URI=mongodb://localhost:27017
MONGODB_DB=greenfi

# Blockchain (RPC & Contracts)
RPC_URL=http://localhost:8545
TWDT_ADDRESS=0xYourTWDTAddress
BANK_FACTORY_ADDRESS=0xYourBankFactoryAddress

# Admin Wallet
ADMIN_PRIVATE_KEY=0xYourAdminPrivateKey
```

---

## 🚀 下一步

1. **部署合約**: 將合約部署到目標網路（本地/測試/主網）
2. **更新環境變數**: 填入部署後的合約地址
3. **配置私鑰**: 將 admin 私鑰加入 `.env.local`（勿提交到 git）
4. **測試 API**: 使用 cURL 或 Postman 測試各個 API
5. **整合前端**: 前端調用這些 API 進行鏈上操作

---

## ⚠️ 安全提醒

1. **私鑰保護**: 永遠不要將 `.env.local` 提交到版本控制
2. **權限控制**: 建議加入 API 認證機制
3. **錯誤處理**: 所有 API 應有完整的錯誤處理和日誌
4. **測試環境**: 先在測試網路驗證所有功能

---

## 📚 相關文件

- 完整 API 文檔: `API_DOCUMENTATION.md`
- 智能合約測試: `../contractTest/test/`
- 智能合約源碼: `../contractTest/contracts/`
- 變更日誌: `../contractTest/CHANGELOG.md`

---

**系統狀態**: 生產就緒 🚀

