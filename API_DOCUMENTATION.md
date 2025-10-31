# 區塊鏈智能合約 API 文檔

## 📋 概述

這是一套用於與 SafeHarvest 智能合約系統互動的後端 API。所有 admin 操作需要私鑰簽名，請確保 `.env` 中配置了 `ADMIN_PRIVATE_KEY`。

---

## 🔧 環境設定

在 `.env` 中添加以下配置：

```env
# Blockchain
RPC_URL=http://localhost:8545
TWDT_ADDRESS=0xYourTWDTAddress
BANK_FACTORY_ADDRESS=0xYourBankFactoryAddress
ADMIN_PRIVATE_KEY=0xYourAdminPrivateKey
```

---

## 💰 TWDT 代幣 API

### 1. 鑄造代幣

**POST** `/api/contract/twdt/mint`

**Description**: Admin 鑄造 TWDT 代幣給指定地址

**Request Body**:
```json
{
  "to": "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb",
  "amount": 1000
}
```

**Response**:
```json
{
  "ok": true,
  "txHash": "0x..."
}
```

**Example**:
```bash
curl -X POST http://localhost:3000/api/contract/twdt/mint \
  -H "Content-Type: application/json" \
  -d '{"to": "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb", "amount": 1000}'
```

---

### 2. 查詢餘額

**GET** `/api/contract/twdt/balance?address=0x...`

**Description**: 查詢指定地址的 TWDT 餘額

**Query Parameters**:
- `address` (required): 地址

**Response**:
```json
{
  "ok": true,
  "balance": "1000000000",
  "balanceFormatted": "1000"
}
```

**Example**:
```bash
curl "http://localhost:3000/api/contract/twdt/balance?address=0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb"
```

---

## 🏭 BankFactory API

### 1. 存入資金

**POST** `/api/contract/bank/deposit`

**Description**: 將 TWDT 存入工廠合約

**Request Body**:
```json
{
  "amount": 9000
}
```

**Response**:
```json
{
  "ok": true,
  "txHash": "0x..."
}
```

**Example**:
```bash
curl -X POST http://localhost:3000/api/contract/bank/deposit \
  -H "Content-Type: application/json" \
  -d '{"amount": 9000}'
```

**Note**: 需要先在 TWDT 合約 approve 工廠地址

---

### 2. 建立專案

**POST** `/api/contract/bank/createProject`

**Description**: 建立新的 SafeHarvest NFT 專案

**Request Body**:
```json
{
  "name": "枋山愛文芒果",
  "symbol": "MNG",
  "farmer": "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb",
  "totalNFTs": 150,
  "nftPrice": 100,
  "buildCost": 15000,
  "annualIncome": 3000,
  "investorShare": 50,
  "interestRate": 10,
  "premiumRate": 5
}
```

**Parameters**:
- `name` (string): 專案名稱
- `symbol` (string): NFT 代號
- `farmer` (address): 農夫地址
- `totalNFTs` (number): NFT 總數
- `nftPrice` (number): 每份 NFT 價格（TWDT）
- `buildCost` (number): 建造成本（TWDT）
- `annualIncome` (number): 年度收益（TWDT）
- `investorShare` (number): 投資人分潤比例 (%)
- `interestRate` (number): 利率 (%)
- `premiumRate` (number): 溢酬率 (%)

**Response**:
```json
{
  "ok": true,
  "txHash": "0x..."
}
```

**Example**:
```bash
curl -X POST http://localhost:3000/api/contract/bank/createProject \
  -H "Content-Type: application/json" \
  -d '{
    "name": "枋山愛文芒果",
    "symbol": "MNG",
    "farmer": "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb",
    "totalNFTs": 150,
    "nftPrice": 100,
    "buildCost": 15000,
    "annualIncome": 3000,
    "investorShare": 50,
    "interestRate": 10,
    "premiumRate": 5
  }'
```

**Note**: 
- 需要工廠有足夠餘額（`totalNFTs × nftPrice × 3`）
- 部署成功後會自動轉入資金到專案合約

---

### 3. 設定專案狀態

**POST** `/api/contract/bank/setStatus`

**Description**: 設定專案狀態

**Request Body**:
```json
{
  "project": "0xProjectAddress",
  "status": 2
}
```

**Status Codes**:
- `1`: 正常運作
- `2`: 僅允許提領收益
- `3`: 全面停止

**Response**:
```json
{
  "ok": true,
  "txHash": "0x..."
}
```

**Example**:
```bash
curl -X POST http://localhost:3000/api/contract/bank/setStatus \
  -H "Content-Type: application/json" \
  -d '{"project": "0xProjectAddress", "status": 2}'
```

---

## 🎨 SafeHarvestNFT 專案 API

### 1. 年度結算

**POST** `/api/contract/project/calculator`

**Description**: 觸發年度收益結算，分配分紅給投資人

**Request Body**:
```json
{
  "projectAddress": "0xProjectAddress"
}
```

**Response**:
```json
{
  "ok": true,
  "txHash": "0x..."
}
```

**Example**:
```bash
curl -X POST http://localhost:3000/api/contract/project/calculator \
  -H "Content-Type: application/json" \
  -d '{"projectAddress": "0xProjectAddress"}'
```

**Note**: 
- 需要 NFT 全部售罄
- 合約狀態必須為 1（正常運作）

---

### 2. 提領專案資金

**POST** `/api/contract/project/withdraw`

**Description**: 從專案合約提領資金

**Request Body**:
```json
{
  "projectAddress": "0xProjectAddress",
  "to": "0xRecipientAddress",
  "amount": 1000
}
```

**Response**:
```json
{
  "ok": true,
  "txHash": "0x..."
}
```

**Example**:
```bash
curl -X POST http://localhost:3000/api/contract/project/withdraw \
  -H "Content-Type: application/json" \
  -d '{
    "projectAddress": "0xProjectAddress",
    "to": "0xRecipientAddress",
    "amount": 1000
  }'
```

**Note**: 
- 需要 NFT 全部售罄
- 合約狀態必須為 1（正常運作）

---

### 3. 重置 NFT

**POST** `/api/contract/project/reset`

**Description**: 清空所有 NFT 並重新開始（危險操作）

**Request Body**:
```json
{
  "projectAddress": "0xProjectAddress"
}
```

**Response**:
```json
{
  "ok": true,
  "txHash": "0x..."
}
```

**Example**:
```bash
curl -X POST http://localhost:3000/api/contract/project/reset \
  -H "Content-Type: application/json" \
  -d '{"projectAddress": "0xProjectAddress"}'
```

**⚠️ Warning**: 
- 會銷毀所有現有 NFT
- 清空 pendingRewards
- 僅用於測試或緊急情況

---

### 4. 查詢專案資料

**GET** `/api/contract/project/data?projectAddress=0x...`

**Description**: 查詢專案完整資料

**Query Parameters**:
- `projectAddress` (required): 專案合約地址

**Response**:
```json
{
  "ok": true,
  "data": {
    "currentStatus": 1,
    "projectOwner": "0x...",
    "projectFarmer": "0x...",
    "nftTotalSupply": "150",
    "nftMintedCount": "85",
    "nftPricePerUnit": "100",
    "projectBuildCost": "15000",
    "projectAnnualIncome": "3000",
    "projectInvestorShare": "50",
    "projectInterestRate": "10",
    "projectPremiumRate": "5",
    "projectCurrentYear": "2",
    "projectCumulativePrincipal": "3000",
    "projectRemainingPrincipal": "12000",
    "projectBuybackPrice": "15750",
    "projectBuybackActive": false,
    "projectPaymentToken": "0xTWDTAddress",
    "projectFactory": "0xFactoryAddress"
  }
}
```

**Example**:
```bash
curl "http://localhost:3000/api/contract/project/data?projectAddress=0xProjectAddress"
```

---

## 🔐 安全注意事項

1. **私鑰保護**: 
   - 永遠不要將私鑰提交到代碼倉庫
   - 使用環境變數管理私鑰
   - 生產環境使用加密儲存

2. **權限控制**:
   - 所有 API 應該有認證機制
   - 僅允許授權的 admin 調用
   - 建議加入 IP 白名單

3. **錯誤處理**:
   - 所有 API 返回詳細錯誤訊息
   - 記錄所有交易到日誌
   - 監控失敗的交易

---

## 📊 使用範例

### 完整流程：從建立專案到年度結算

```bash
# 1. 先存入資金到工廠
curl -X POST http://localhost:3000/api/contract/bank/deposit \
  -H "Content-Type: application/json" \
  -d '{"amount": 45000}'

# 2. 建立專案 (150 NFT × 100 TWDT × 3 = 45,000 TWDT)
curl -X POST http://localhost:3000/api/contract/bank/createProject \
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

# 3. 查詢專案資料
curl "http://localhost:3000/api/contract/project/data?projectAddress=0xDeployedProject"

# 4. 等待所有 NFT 賣出後，觸發年度結算
curl -X POST http://localhost:3000/api/contract/project/calculator \
  -H "Content-Type: application/json" \
  -d '{"projectAddress": "0xProjectAddress"}'

# 5. 查詢更新後的專案資料
curl "http://localhost:3000/api/contract/project/data?projectAddress=0xProjectAddress"
```

---

## 🔗 相關文件

- 智能合約測試: `contractTest/test/`
- 智能合約源碼: `contractTest/contracts/`
- 前端文檔: `rwa-frontend/`

---

## 📝 備註

- 所有金額使用 TWDT（6 decimals）
- API 自動處理 decimals 轉換
- 所有 write 操作返回交易哈希
- 查詢操作使用 public client（無 gas 費用）
- 寫入操作需要等待區塊確認

