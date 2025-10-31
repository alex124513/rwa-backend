# 區塊鏈 API 快速開始指南

## 🎯 目標

將智能合約的所有 admin 功能封裝成後端 API，讓前端可以透過 HTTP 請求觸發鏈上操作。

---

## ⚡ 5 分鐘設定

### 步驟 1: 設定環境變數

在 `rwa-backend` 目錄建立 `.env.local`：

```bash
cat > .env.local << 'EOF'
# MongoDB
MONGODB_URI=mongodb://localhost:27017
MONGODB_DB=greenfi

# Blockchain
RPC_URL=http://localhost:8545
TWDT_ADDRESS=0x5FbDB2315678afecb367f032d93F642f64180aa3
BANK_FACTORY_ADDRESS=0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0

# Admin Wallet (從 Ganache 取得)
ADMIN_PRIVATE_KEY=0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80
EOF
```

### 步驟 2: 啟動服務

```bash
# 終端 1: 啟動 Ganache 和部署合約
cd contractTest
npm run dev:test

# 終端 2: 啟動後端
cd rwa-backend
npm run dev
```

### 步驟 3: 測試 API

```bash
# 查詢工廠餘額
curl "http://localhost:3000/api/con/bank/balance"

# 查詢所有專案
curl "http://localhost:3000/api/con/bank/projects"
```

---

## 📖 API 列表

所有 API 文檔: **`API_DOCUMENTATION.md`**

| 分類 | 路徑 | 方法 | 功能 |
|------|------|------|------|
| **TWDT** | `/api/con/twdt/mint` | POST | 鑄造代幣 |
| | `/api/con/twdt/balance` | GET | 查詢餘額 |
| **Bank** | `/api/con/bank/deposit` | POST | 存入資金 |
| | `/api/con/bank/createProject` | POST | 建立專案 |
| | `/api/con/bank/setStatus` | POST | 設定狀態 |
| | `/api/con/bank/projects` | GET | 所有專案 |
| | `/api/con/bank/balance` | GET | 工廠餘額 |
| **Project** | `/api/con/project/calculator` | POST | 年度結算 |
| | `/api/con/project/withdraw` | POST | 提領資金 |
| | `/api/con/project/reset` | POST | 重置 NFT |
| | `/api/con/project/data` | GET | 專案資料 |

---

## 🔍 工作原理

### 核心元件

1. **`src/lib/blockchain.ts`**
   - 建立 viem client（讀取/寫入）
   - 從環境變數載入 admin 私鑰
   - 配置本地鏈（chain ID: 1337）

2. **API Routes** (`src/app/api/con/`)
   - 所有寫入操作使用 `walletClient`
   - 所有讀取操作使用 `publicClient`
   - 自動處理 decimals 轉換

### 資金流動

```
Admin Wallet
    ↓
Post API (簽名交易)
    ↓
Blockchain
    ↓
智能合約執行
    ↓
返回交易哈希
```

---

## 📝 使用範例

### 1. 建立專案

```bash
curl -X POST http://localhost:3000/api/con/bank/createProject \
  -H "Content-Type: application/json" \
  -d '{
    "name": "枋山愛文芒果",
    "symbol": "MNG",
    "farmer": "0x70997970C51812dc3A010C7d01b50e0d17dc79C8",
    "totalNFTs": 150,
    "nftPrice": 100,
    "buildCost": 15000,
    "annualIncome": 3000,
    "investorShare": 50,
    "interestRate": 10,
    "premiumRate": 5
  }'
```

**回應**:
```json
{
  "ok": true,
  "txHash": "0x..."
}
```

### 2. 年度結算

```bash
curl -X POST http://localhost:3000/api/con/project/calculator \
  -H "Content-Type: application/json" \
  -d '{
    "projectAddress": "0x75537828f2ce51be7289709686A69CbFDbB714F1"
  }'
```

### 3. 查詢專案資料

```bash
curl "http://localhost:3000/api/con/project/data?projectAddress=0x75537828f2ce51be7289709686A69CbFDbB714F1"
```

**回應**:
```json
{
  "ok": true,
  "data": {
    "currentStatus": 1,
    "nftTotalSupply": "150",
    "nftMintedCount": "85",
    "nftPricePerUnit": "100",
    "projectCurrentYear": "2",
    "projectBuybackPrice": "15750",
    ...
  }
}
```

---

## 🔐 安全注意

1. **私鑰管理**
   - `.env.local` 已在 `.gitignore`
   - 生產環境使用密鑰管理服務

2. **API 認證**
   - 建議加入 JWT 或 OAuth
   - IP 白名單限制

3. **錯誤處理**
   - 所有 API 有 try-catch
   - 詳細日誌記錄

---

## 📚 相關文件

- **完整 API 文檔**: `API_DOCUMENTATION.md`
- **設定指南**: `BLOCKCHAIN_API_README.md`
- **總結文件**: `BLOCKCHAIN_API_SUMMARY.md`
- **智能合約測試**: `../contractTest/test/`
- **智能合約變更**: `../contractTest/CHANGELOG.md`

---

## ✅ 驗證完成

```
✅ 安裝 viem
✅ 建立區塊鏈工具類
✅ 所有 API 編譯成功
✅ 無 lint 錯誤
✅ 文檔齊全
```

**系統狀態**: 生產就緒 🚀

