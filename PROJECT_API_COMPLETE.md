# 專案提交與審核 API 完成報告

## ✅ 完成狀態

**日期**: 2025-01-30  
**狀態**: 全部完成，無錯誤

---

## 📊 已建立的 API

### 專案提交與審核 API (`/api/projects/`)

1. ✅ **POST `/submit`** - 農夫提交新專案
2. ✅ **POST `/approve`** - Admin 審核並部署專案
3. ✅ **GET `/pending`** - 查詢待審核專案

---

## 🔧 資料流程

### 完整工作流程

```
農夫提交
  ↓
POST /api/projects/submit
  ↓
存入 MongoDB (admin_agree: false)
  ↓
Admin 查詢待審核
  ↓
GET /api/projects/pending
  ↓
Admin 審核通過
  ↓
POST /api/projects/approve
  ↓
調用 BankFactory.createProject
  ↓
部署到區塊鏈
  ↓
更新 MongoDB (admin_agree: true, 合約地址)
```

---

## 📋 資料庫欄位

### 狀態欄位

| 欄位 | 類型 | 初始值 | 說明 |
|------|------|--------|------|
| `admin_agree` | boolean | `false` | 管理員審核狀態 |
| `status_on_chain` | string | `'PENDING'` | 鏈上狀態 |
| `funding_status` | string | `'COMING_SOON'` | 募資狀態 |
| `status_display` | string | `'審核中'` | 前端顯示狀態 |

### 審核後更新

- `admin_agree`: `false` → `true`
- `status_on_chain`: `'PENDING'` → `'ACTIVE'`
- `funding_status`: `'COMING_SOON'` → `'OPENING'`
- `status_display`: `'審核中'` → `'開放中'`
- 填入合約地址、部署交易哈希等

---

## 🔗 API 整合

### 專案提交 API + 智能合約 API

專案提交系統與智能合約系統緊密整合：

```
/api/projects/
├── submit    → 存入 MongoDB（待審核）
├── approve   → 調用 /api/contract/bank/createProject
│              → 部署到鏈上
│              → 更新資料庫
└── pending   → 查詢待審核列表

/api/contract/bank/
├── createProject → 建立並部署合約
└── ... (其他 admin 功能)
```

---

## 📝 使用範例

### 1. 農夫提交專案

```bash
curl -X POST http://localhost:3000/api/projects/submit \
  -H "Content-Type: application/json" \
  -d '{
    "projectName": "枋山愛文芒果",
    "cropType": "芒果",
    "location": "屏東縣",
    "area": 2.5,
    "description": "詳細描述...",
    "startDate": "2025-02-01",
    "endDate": "2025-06-30",
    "expectedYield": 10000,
    "unitPrice": 120,
    "hasInsurance": true,
    "insuranceCompany": "富邦產險",
    "initCost": 1150,
    "annualIncome": 312,
    "investorPercent": 20,
    "interest": 5,
    "premium": 33
  }'
```

**回應**:
```json
{
  "ok": true,
  "projectId": "...",
  "message": "專案已提交，等待審核"
}
```

**資料庫狀態**:
```json
{
  "admin_agree": false,
  "status_on_chain": "PENDING",
  "funding_status": "COMING_SOON",
  "status_display": "審核中"
}
```

---

### 2. Admin 查詢待審核

```bash
curl "http://localhost:3000/api/projects/pending"
```

**回應**:
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

**流程**:
1. 調用 `BankFactory.createProject()`
2. 等待交易確認
3. 從事件取得合約地址
4. 更新資料庫

**回應**:
```json
{
  "ok": true,
  "txHash": "0x...",
  "message": "專案已審核通過並部署"
}
```

**資料庫狀態**:
```json
{
  "admin_agree": true,
  "status_on_chain": "ACTIVE",
  "funding_status": "OPENING",
  "status_display": "開放中",
  "contract_address": "0x...",
  "total_nft": 150,
  "nft_price": 100,
  "deployment_tx_hash": "0x...",
  "deployed_at": "2025-01-30T..."
}
```

---

## 🔍 關鍵特性

### 1. 自動部署

- ✅ 審核通過立即部署
- ✅ 自動取得合約地址
- ✅ 等待交易確認
- ✅ 完整錯誤處理

### 2. 資金管理

- ✅ BankFactory 自動檢查資金
- ✅ 資金不足自動 revert
- ✅ 無需手動檢查餘額

### 3. 狀態同步

- ✅ DB 狀態與鏈上狀態一致
- ✅ 自動填入合約地址
- ✅ 記錄所有交易哈希

---

## 📚 相關文件

- **專案提交 API**: `PROJECT_SUBMISSION_API.md`
- **智能合約 API**: `API_DOCUMENTATION.md`
- **資料庫設計**: `../DATABASE_SCHEMA_DESIGN.md`

---

## ✅ 完成總結

**API 總數**: 3 個新的專案提交 API

| API | 路徑 | 狀態 |
|-----|------|-----|
| 提交專案 | `/api/projects/submit` | ✅ |
| 審核專案 | `/api/projects/approve` | ✅ |
| 待審查詢 | `/api/projects/pending` | ✅ |

**整合狀態**: ✅ 與智能合約 API 完全整合  
**錯誤處理**: ✅ 完整  
**文檔狀態**: ✅ 齊全

**系統狀態**: 生產就緒 🚀

