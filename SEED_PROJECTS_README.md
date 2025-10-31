# 專案種子資料匯入說明

## 🎯 功能說明

此腳本會在資料庫中插入 3 個預設的農業投資專案範例資料。

## 📋 插入的專案

### 1. 枋山愛文芒果抗颱網室A廠
- **作物**: 愛文芒果
- **位置**: 屏東枋山
- **NFT 總量**: 150 個
- **狀態**: 開放中
- **保險**: 富邦產險

### 2. 台南有機蓬萊米契作計畫
- **作物**: 蓬萊米
- **位置**: 台南後壁
- **NFT 總量**: 200 個（已售 85）
- **狀態**: 開放中
- **保險**: 國泰產險

### 3. 雲林智能溫室番茄A區
- **作物**: 番茄
- **位置**: 雲林口湖
- **NFT 總量**: 180 個
- **狀態**: 即將推出
- **保險**: 新光產險

## 🚀 使用方法

### 方法 1：使用 API Route（推薦）

1. 啟動後端伺服器：
```bash
cd rwa-backend
npm run dev
```

2. 在另一個終端執行：
```bash
curl -X POST http://localhost:3000/api/seed
```

### 方法 2：使用 Node.js 腳本

1. 先確保已安裝依賴：
```bash
cd rwa-backend
npm install
```

2. 執行腳本：
```bash
node script/seedProjects.js
```

**注意**: 需要設定環境變數：
```bash
export MONGODB_URI="your_mongodb_uri"
export MONGODB_DB="your_database_name"
```

## ✅ 預期結果

執行成功後會返回：
```json
{
  "ok": true,
  "message": "成功插入 3 個專案",
  "projects": [...]
}
```

## ⚠️ 注意事項

1. **此腳本會清空現有的專案資料**，請謹慎使用
2. 確保 MongoDB 連接設定正確
3. 確保環境變數 `MONGODB_URI` 和 `MONGODB_DB` 已設定

## 📝 欄位說明

所有專案都包含完整的欄位：
- 基本資訊（title, description, coverImage）
- 農業資訊（crop_name, crop_type, location, area）
- NFT 資訊（total_nft, nft_price, funded_nft）
- 金融參數（build_cost, annual_income, investor_share, etc.）
- 保險資訊（insurance_company, insurance_policy_no）
- 募資狀態（funding_status, status_display）
- 鏈上資訊（contract_address, status_on_chain）

## 🔄 重新執行

如果需要重新匯入資料，直接再次執行即可（會自動清空舊資料）。

