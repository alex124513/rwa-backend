# MongoDB 資料匯入指南

## 📂 JSON 檔案位置

- `sample_projects_simple.json` - 標準 JSON 格式（推薦）
- `sample_projects.json` - MongoDB 格式（含 $date）

## 🚀 使用 MongoDB Compass（圖形界面）

1. 開啟 MongoDB Compass
2. 連接到資料庫：`mongodb://localhost:27017`
3. 選擇資料庫：`greenfi`
4. 選擇 collection：`projects`
5. 點擊 "ADD DATA" > "Import File"
6. 選擇 `sample_projects_simple.json`
7. 確認欄位對應正確
8. 點擊 "Import"

## 💻 使用 MongoDB Shell

```bash
# 進入 mongo shell
mongosh

# 切換資料庫
use greenfi

# 匯入資料（使用 mongoimport）
db.projects.insertMany([
  {
    "title": "枋山愛文芒果抗颱網室A廠",
    "farmer_id": "farmer001",
    "status_on_chain": "ACTIVE",
    "contract_address": "0x1234567890abcdef1234567890abcdef12345678",
    "coverImage": "https://media.discordapp.net/attachments/338606954379476992/1433369723965407253/1758540304940.jpg?ex=69047114&is=69031f94&hm=88201d22755339f4154133d822d2652f8a2e70b8a4c1b26a330f066ed99c01a9&=&format=webp&width=1120&height=1992",
    "description": "屏東枋山地區愛文芒果專案，採用抗颱風網室栽培技術，確保產量穩定。預計年產10公噸芒果，主要外銷日本市場。",
    "crop_name": "愛文芒果",
    "crop_type": "芒果",
    "location": "屏東枋山",
    "area": 1.5,
    "total_nft": 150,
    "nft_price": 10000,
    "funded_nft": 0,
    "minted_nft": 0,
    "build_cost": 1800,
    "annual_income": 450,
    "investor_share": 30,
    "interest_rate": 5,
    "premium_rate": 35,
    "insurance_company": "富邦產險",
    "insurance_policy_no": "INS-2024-M001",
    "insurance_coverage": 1800,
    "funding_status": "OPENING",
    "status_display": "開放中",
    "target_amount": 1500000,
    "funded_amount": 0,
    "funding_start_date": "2024-12-01T00:00:00.000Z",
    "funding_end_date": "2025-02-28T00:00:00.000Z",
    "created_at": "2024-12-20T00:00:00.000Z",
    "updated_at": "2024-12-20T00:00:00.000Z"
  },
  {
    "title": "台南有機蓬萊米契作計畫",
    "farmer_id": "farmer002",
    "status_on_chain": "ACTIVE",
    "contract_address": "0xabcdef1234567890abcdef1234567890abcdef12",
    "coverImage": "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=1120",
    "description": "台南後壁有機稻米專案，採用友善耕作方式，與契作農民合作，生產高品質有機蓬萊米。預計年產30公噸稻米。",
    "crop_name": "蓬萊米",
    "crop_type": "稻米",
    "location": "台南後壁",
    "area": 3.0,
    "total_nft": 200,
    "nft_price": 8000,
    "funded_nft": 85,
    "minted_nft": 85,
    "build_cost": 1200,
    "annual_income": 360,
    "investor_share": 25,
    "interest_rate": 6,
    "premium_rate": 30,
    "insurance_company": "國泰產險",
    "insurance_policy_no": "INS-2024-R001",
    "insurance_coverage": 1200,
    "funding_status": "OPENING",
    "status_display": "開放中",
    "target_amount": 1600000,
    "funded_amount": 680000,
    "funding_start_date": "2024-11-15T00:00:00.000Z",
    "funding_end_date": "2025-01-31T00:00:00.000Z",
    "created_at": "2024-11-15T00:00:00.000Z",
    "updated_at": "2024-12-20T00:00:00.000Z"
  },
  {
    "title": "雲林智能溫室番茄A區",
    "farmer_id": "farmer003",
    "status_on_chain": "PENDING",
    "contract_address": "0x9876543210fedcba9876543210fedcba98765432",
    "coverImage": "https://images.unsplash.com/photo-1592841200221-05a7f584ab85?w=1120",
    "description": "雲林口湖智能溫室番茄專案，採用荷蘭先進溫室技術，全自動化環控系統，產量與品質穩定。預計年產50公噸番茄。",
    "crop_name": "番茄",
    "crop_type": "番茄",
    "location": "雲林口湖",
    "area": 2.5,
    "total_nft": 180,
    "nft_price": 12000,
    "funded_nft": 0,
    "minted_nft": 0,
    "build_cost": 2100,
    "annual_income": 600,
    "investor_share": 35,
    "interest_rate": 7,
    "premium_rate": 40,
    "insurance_company": "新光產險",
    "insurance_policy_no": "INS-2024-T001",
    "insurance_coverage": 2100,
    "funding_status": "COMING_SOON",
    "status_display": "即將推出",
    "target_amount": 2160000,
    "funded_amount": 0,
    "funding_start_date": "2025-01-01T00:00:00.000Z",
    "funding_end_date": "2025-03-31T00:00:00.000Z",
    "created_at": "2024-12-15T00:00:00.000Z",
    "updated_at": "2024-12-15T00:00:00.000Z"
  }
])
```

## 📝 手動複製貼上

如果使用 MongoDB Atlas 或 Compass 網頁版，可以直接：

1. 開啟 `sample_projects_simple.json`
2. 複製 JSON 內容
3. 在 MongoDB Compass 的 "Documents" 標籤
4. 點擊 "INSERT DOCUMENT"
5. 貼上 JSON（會自動解析為多個文件）
6. 點擊 "INSERT"

## ✅ 驗證

插入後執行：

```bash
curl http://localhost:3000/api/getProjects
```

應該會看到 3 個專案的資料！

