# 區塊鏈智能合約 API 設定指南

## 🚀 快速開始

### 1. 環境設定

在專案根目錄建立 `.env.local` 檔案：

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

### 2. 部署智能合約

使用 Hardhat 部署合約到本地網路（Ganache）：

```bash
cd contractTest
npm run dev:test  # 啟動 Ganache 和自動部署
```

部署後會顯示合約地址，更新到 `.env.local`

### 3. 取得 Admin 私鑰

從 Hardhat 的測試帳戶中取得：

```bash
# 在 contractTest 目錄執行
npx hardhat node
```

第一個帳戶的私鑰就是 admin 私鑰

### 4. 啟動後端服務

```bash
cd rwa-backend
npm run dev
```

---

## 📚 API 文檔

所有 API 文檔請參考：
- `API_DOCUMENTATION.md` - 完整 API 參考

---

## 🔗 已建立的 API

### TWDT API (`/api/con/twdt/`)
- ✅ `GET /balance` - 查詢餘額
- ✅ `POST /mint` - 鑄造代幣

### BankFactory API (`/api/con/bank/`)
- ✅ `GET /balance` - 查詢工廠餘額
- ✅ `GET /projects` - 取得所有專案
- ✅ `POST /deposit` - 存入資金
- ✅ `POST /createProject` - 建立專案
- ✅ `POST /setStatus` - 設定專案狀態

### SafeHarvestNFT API (`/api/con/project/`)
- ✅ `GET /data` - 查詢專案資料
- ✅ `POST /calculator` - 年度結算
- ✅ `POST /withdraw` - 提領資金
- ✅ `POST /reset` - 重置 NFT

---

## 🧪 測試範例

### 完整工作流程

```bash
# 1. 鑄造 TWDT 給 admin
curl -X POST http://localhost:3000/api/con/twdt/mint \
  -H "Content-Type: application/json" \
  -d '{"to": "0xAdminAddress", "amount": 100000}'

# 2. 存入資金到工廠
curl -X POST http://localhost:3000/api/con/bank/deposit \
  -H "Content-Type: application/json" \
  -d '{"amount": 45000}'

# 3. 建立專案
curl -X POST http://localhost:3000/api/con/bank/createProject \
  -H "Content-Type: application/json" \
  -d '{
    "name": "枋山愛文芒果",
    "symbol": "MNG",
    "farmer": "0xFarmerAddress",
    "totalNFTs": 150,
    "nftPrice": 100,
    "buildCost": 15000,
    "annualIncome": 3000,
    "investorShare": 50,
    "interestRate": 10,
    "premiumRate": 5
  }'

# 4. 年度結算
curl -X POST http://localhost:3000/api/con/project/calculator \
  -H "Content-Type: application/json" \
  -d '{"projectAddress": "0xProjectAddress"}'
```

---

## ⚠️ 注意事項

1. 本地網路（Ganache）chain ID: 1337
2. 所有金額使用 6 decimals 格式
3. 寫入操作需要等待交易確認
4. 建議加入 API 認證機制（未實現）

---

## 📞 測試支援

如有問題，請參考：
- 智能合約測試: `../contractTest/test/`
- 變更日誌: `../contractTest/CHANGELOG.md`
- 完整文檔: `API_DOCUMENTATION.md`

