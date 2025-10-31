# 專案提交與審核 API 文檔

## 📋 概述

專案提交與審核流程的後端 API，處理農夫提交專案到審核後部署到鏈上的完整流程。

---

## 🔗 API 列表

### 1. 提交專案（農夫）

**POST** `/api/projects/submit`

**Description**: 農夫提交新專案進行審核

**Request Body**:
```json
{
  // 基本資訊
  "projectName": "枋山愛文芒果抗颱網室A廠",
  "cropType": "芒果",
  "location": "屏東縣枋山鄉",
  "area": 2.5,
  "description": "詳細描述...",
  "startDate": "2025-02-01",
  "endDate": "2025-06-30",
  "expectedYield": 10000,
  "unitPrice": 120,
  "hasInsurance": true,
  "insuranceCompany": "富邦產險",
  "sustainability": "採用減少農藥使用...",
  "coverImage": "data:image/jpeg;base64,...",
  
  // 投資假設參數
  "initCost": 1150,
  "annualIncome": 312,
  "investorPercent": 20,
  "interest": 5,
  "premium": 33,
  
  // 其他
  "farmer_id": "farmer001"
}
```

**Response**:
```json
{
  "ok": true,
  "projectId": "...",
  "message": "專案已提交，等待審核"
}
```

---

### 2. 審核專案（Admin）

**POST** `/api/projects/approve`

**Description**: Admin 審核並部署專案到鏈上

**Request Body**:
```json
{
  "projectId": "...",
  "action": "approve",  // or "reject"
  "adminNotes": "審核備註",
  
  // 審核通過時必需
  "totalNFTs": 150,
  "nftPrice": 100,
  "farmerAddress": "0x..."
}
```

**Response**:
```json
{
  "ok": true,
  "txHash": "0x...",
  "message": "專案已審核通過並部署"
}
```

---

### 3. 查詢待審核專案

**GET** `/api/projects/pending`

**Description**: 查詢所有待審核專案（admin_agree: false）

**Response**:
```json
{
  "ok": true,
  "projects": [
    {
      "_id": "...",
      "title": "枋山愛文芒果",
      "admin_agree": false,
      "status_display": "審核中",
      "created_at": "..."
    }
  ]
}
```

---

## 📊 資料庫欄位

### 基本欄位

| 欄位 | 類型 | 說明 |
|------|------|------|
| `title` | string | 專案名稱 |
| `description` | string | 簡述 |
| `crop_name` | string | 作物名稱 |
| `crop_type` | string | 作物種類 |
| `location` | string | 位置 |
| `area` | number | 種植面積（公頃） |
| `cover_image` | string | 封面圖片 |

### 時間欄位

| 欄位 | 類型 | 說明 |
|------|------|------|
| `start_date` | string | 開始日期 |
| `end_date` | string | 結束日期 |

### 產量與價格

| 欄位 | 類型 | 說明 |
|------|------|------|
| `expected_yield` | number | 預估產量（kg/ha） |
| `unit_price` | number | 單位價格（元/kg） |

### 保險資訊

| 欄位 | 類型 | 說明 |
|------|------|------|
| `has_insurance` | boolean | 是否投保 |
| `insurance_company` | string | 投保公司 |

### 永續性

| 欄位 | 類型 | 說明 |
|------|------|------|
| `sustainability` | string | 永續性說明 |

### 投資假設參數

| 欄位 | 類型 | 說明 |
|------|------|------|
| `build_cost` | number | 建造成本（萬） |
| `annual_income` | number | 年度收益（萬） |
| `investor_share` | number | 投資人分潤% |
| `interest_rate` | number | 利率% |
| `premium_rate` | number | 溢酬% |

### 狀態資訊

| 欄位 | 類型 | 說明 |
|------|------|------|
| `admin_agree` | boolean | 管理員審核（false=待審核） |
| `status_on_chain` | string | 鏈上狀態（PENDING/ACTIVE/INACTIVE） |
| `funding_status` | string | 募資狀態（COMING_SOON/OPENING/COMPLETED/CLOSED） |
| `status_display` | string | 前端顯示（審核中/開放中/已募資等） |

### 預設數值

| 欄位 | 類型 | 說明 |
|------|------|------|
| `total_nft` | number | NFT 總量（審核後填入） |
| `nft_price` | number | NFT 價格（審核後填入） |
| `funded_amount` | number | 已募資金額 |
| `funded_nft` | number | 已售 NFT 數量 |
| `minted_nft` | number | 已 mint 數量 |
| `target_amount` | number | 目標募資額 |

### 鏈上資訊（審核後填入）

| 欄位 | 類型 | 說明 |
|------|------|------|
| `contract_address` | string | 合約地址 |
| `factory_address` | string | 工廠合約地址 |
| `payment_token_address` | string | TWDT 代幣地址 |
| `farmer_address` | string | 農夫錢包地址 |
| `deployment_tx_hash` | string | 部署交易哈希 |

### 時間戳記

| 欄位 | 類型 | 說明 |
|------|------|------|
| `created_at` | Date | 建立時間 |
| `updated_at` | Date | 更新時間 |
| `deployed_at` | Date | 部署時間 |

---

## 🔄 工作流程

### 1. 農夫提交

```bash
curl -X POST http://localhost:3000/api/projects/submit \
  -H "Content-Type: application/json" \
  -d '{
    "projectName": "枋山愛文芒果",
    "cropType": "芒果",
    "location": "屏東縣",
    "area": 2.5,
    "description": "...",
    "startDate": "2025-02-01",
    "endDate": "2025-06-30",
    "hasInsurance": true,
    "insuranceCompany": "富邦產險",
    "initCost": 1150,
    "annualIncome": 312,
    "investorPercent": 20,
    "interest": 5,
    "premium": 33
  }'
```

**結果**:
- 資料存入 DB
- `admin_agree: false`
- `status_display: "審核中"`

---

### 2. Admin 查詢待審核專案

```bash
curl "http://localhost:3000/api/projects/pending"
```

---

### 3. Admin 審核通過

```bash
curl -X POST http://localhost:3000/api/projects/approve \
  -H "Content-Type: application/json" \
  -d '{
    "projectId": "...",
    "action": "approve",
    "totalNFTs": 150,
    "nftPrice": 100,
    "farmerAddress": "0x..."
  }'
```

**結果**:
- 調用 `BankFactory.createProject`
- 部署合約到鏈上
- 更新 DB：`admin_agree: true`, `status_display: "開放中"`
- 填入合約地址

---

### 4. Admin 拒絕

```bash
curl -X POST http://localhost:3000/api/projects/approve \
  -H "Content-Type: application/json" \
  -d '{
    "projectId": "...",
    "action": "reject",
    "adminNotes": "不符合條件"
  }'
```

**結果**:
- 更新 DB：`status_display: "已拒絕"`, `funding_status: "CLOSED"`

---

## 📝 注意事項

1. **圖片處理**: 前端傳送 base64，後端直接儲存
2. **審核流程**: 只有通過審核才會部署到鏈上
3. **資金檢查**: 部署前需要確保工廠有足夠資金
4. **地址驗證**: farmerAddress 必須是有效的以太坊地址
5. **Gas 費用**: Admin 需要 ETH 支付 gas

---

## 🔗 相關 API

- 智能合約 API: `BLOCKCHAIN_API_SUMMARY.md`
- 資料庫設計: `../DATABASE_SCHEMA_DESIGN.md`

---

**狀態**: ✅ 完成

