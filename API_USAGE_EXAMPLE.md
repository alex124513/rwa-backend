# 專案提交 API 使用範例

## 🔗 API 端點

**URL**: `http://localhost:3000/api/projects/submit`  
**方法**: `POST`  
**Content-Type**: `application/json`

---

## 📋 完整 JSON 範例

```json
{
  "projectName": "枋山愛文芒果抗颱網室A廠",
  "cropType": "芒果",
  "location": "屏東縣枋山鄉",
  "area": 2.5,
  "description": "本專案採用抗颱網室技術，預計種植愛文芒果1000株，採用有機栽培方式，預計年產量10,000公斤。採用滴灌系統節水，使用有機肥料減少環境負擔。",
  "startDate": "2025-02-01",
  "endDate": "2025-06-30",
  "expectedYield": 10000,
  "unitPrice": 120,
  "hasInsurance": true,
  "insuranceCompany": "富邦產險",
  "sustainability": "採用減少農藥使用50%、節水灌溉技術、有機肥料等環境友善措施。預計每年減少碳排放量約5噸。",
  "coverImage": "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAYABgAAD...",
  
  "initCost": 1150,
  "annualIncome": 312,
  "investorPercent": 20,
  "interest": 5,
  "premium": 33,
  
  "farmer_id": "farmer001"
}
```

---

## 🌐 使用 cURL

```bash
curl -X POST http://localhost:3000/api/projects/submit \
  -H "Content-Type: application/json" \
  -d '{
    "projectName": "枋山愛文芒果抗颱網室A廠",
    "cropType": "芒果",
    "location": "屏東縣枋山鄉",
    "area": 2.5,
    "description": "本專案採用抗颱網室技術，預計種植愛文芒果1000株",
    "startDate": "2025-02-01",
    "endDate": "2025-06-30",
    "expectedYield": 10000,
    "unitPrice": 120,
    "hasInsurance": true,
    "insuranceCompany": "富邦產險",
    "sustainability": "採用減少農藥使用50%",
    "coverImage": "data:image/jpeg;base64,...",
    "initCost": 1150,
    "annualIncome": 312,
    "investorPercent": 20,
    "interest": 5,
    "premium": 33,
    "farmer_id": "farmer001"
  }'
```

---

## 💻 JavaScript/Fetch 範例

```javascript
const submitProject = async () => {
  try {
    const response = await fetch('http://localhost:3000/api/projects/submit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        projectName: "枋山愛文芒果抗颱網室A廠",
        cropType: "芒果",
        location: "屏東縣枋山鄉",
        area: 2.5,
        description: "本專案採用抗颱網室技術...",
        startDate: "2025-02-01",
        endDate: "2025-06-30",
        expectedYield: 10000,
        unitPrice: 120,
        hasInsurance: true,
        insuranceCompany: "富邦產險",
        sustainability: "採用減少農藥使用50%",
        coverImage: "data:image/jpeg;base64,...",
        initCost: 1150,
        annualIncome: 312,
        investorPercent: 20,
        interest: 5,
        premium: 33,
        farmer_id: "farmer001"
      })
    });
    
    const data = await response.json();
    console.log(data);
  } catch (error) {
    console.error(error);
  }
};
```

---

## ✅ 成功回應

```json
{
  "ok": true,
  "projectId": "68234a1b2c3d4e5f67890abc",
  "message": "專案已提交，等待審核"
}
```

---

## ❌ 錯誤回應

### 缺少必填欄位

```json
{
  "error": "Missing required fields"
}
```

**HTTP Status**: 400

---

## 📝 欄位說明

### 必填欄位

| 欄位 | 類型 | 說明 |
|------|------|------|
| `projectName` | string | 專案名稱 |
| `cropType` | string | 作物種類 |
| `location` | string | 農地位置 |
| `description` | string | 計劃描述 |
| `startDate` | string | 預計開始日期 (YYYY-MM-DD) |
| `endDate` | string | 預計結束日期 (YYYY-MM-DD) |

### 選填欄位

| 欄位 | 類型 | 預設值 | 說明 |
|------|------|--------|------|
| `area` | number | 0 | 種植面積（公頃） |
| `expectedYield` | number | 0 | 預估產量（kg/ha） |
| `unitPrice` | number | 0 | 單位價格（元/kg） |
| `hasInsurance` | boolean | false | 是否投保 |
| `insuranceCompany` | string | '' | 投保公司 |
| `sustainability` | string | '' | 永續性說明 |
| `coverImage` | string | '' | 封面圖片（base64） |

### 投資假設參數

| 欄位 | 類型 | 預設值 | 說明 |
|------|------|--------|------|
| `initCost` | number | 0 | 溫室建構費（萬） |
| `annualIncome` | number | 0 | 每年營業額（萬） |
| `investorPercent` | number | 0 | 投資人收益分成% |
| `interest` | number | 0 | 利率% |
| `premium` | number | 0 | 溢酬% |

---

## 📊 資料庫對應

前端欄位 → 資料庫欄位映射:

| 前端 | 資料庫 |
|------|--------|
| `projectName` | `title` |
| `cropType` | `crop_name`, `crop_type` |
| `location` | `location` |
| `area` | `area` |
| `description` | `description` |
| `startDate` | `start_date` |
| `endDate` | `end_date` |
| `expectedYield` | `expected_yield` |
| `unitPrice` | `unit_price` |
| `hasInsurance` | `has_insurance` |
| `insuranceCompany` | `insurance_company` |
| `sustainability` | `sustainability` |
| `coverImage` | `cover_image` |
| `initCost` | `build_cost` |
| `annualIncome` | `annual_income` |
| `investorPercent` | `investor_share` |
| `interest` | `interest_rate` |
| `premium` | `premium_rate` |

---

## 🔍 前端整合範例

### Vue/Nuxt 範例

```typescript
const handleSubmit = async () => {
  try {
    // 將圖片轉為 base64
    let coverImage = '';
    if (imageFile.value) {
      coverImage = imagePreview.value || '';
    }

    const response = await fetch('/api/projects/submit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        projectName: formData.projectName,
        cropType: formData.cropType,
        location: formData.location,
        area: parseFloat(formData.area) || 0,
        description: formData.description,
        startDate: formData.startDate,
        endDate: formData.endDate,
        expectedYield: parseFloat(formData.expectedYield) || 0,
        unitPrice: parseFloat(formData.unitPrice) || 0,
        hasInsurance: formData.hasInsurance,
        insuranceCompany: formData.insuranceCompany || '',
        sustainability: formData.sustainability || '',
        coverImage: coverImage,
        initCost: parseFloat(calculatorParams.initCost) || 0,
        annualIncome: parseFloat(calculatorParams.annualIncome) || 0,
        investorPercent: parseFloat(calculatorParams.investorPercent) || 0,
        interest: parseFloat(calculatorParams.interest) || 0,
        premium: parseFloat(calculatorParams.premium) || 0,
        farmer_id: 'farmer001'  // 從用戶資料取得
      })
    });

    const result = await response.json();
    
    if (result.ok) {
      // 成功提示
      alert('專案已提交，等待審核！');
      // 導向成功頁面
      navigateTo('/farmer/projects');
    } else {
      alert('提交失敗：' + result.error);
    }
  } catch (error) {
    console.error('提交錯誤:', error);
    alert('發生錯誤，請稍後再試');
  }
};
```

---

## ⚠️ 注意事項

1. **圖片格式**: `coverImage` 必須是 base64 格式的完整 data URL
   - 格式: `data:image/jpeg;base64,...` 或 `data:image/png;base64,...`

2. **數字轉換**: 確保所有數字欄位正確轉換
   - `parseFloat()` 或 `Number()` 進行轉換
   - 避免字串格式的數字

3. **日期格式**: 使用 `YYYY-MM-DD` 格式

4. **必填驗證**: 前端也需要驗證必填欄位

5. **錯誤處理**: 適當處理 API 錯誤回應

---

## 📞 測試

在本地測試：

```bash
# 啟動後端服務
cd rwa-backend
npm run dev

# 測試 API（另一個終端）
curl -X POST http://localhost:3000/api/projects/submit \
  -H "Content-Type: application/json" \
  -d @test-data.json
```

**test-data.json**:
```json
{
  "projectName": "測試專案",
  "cropType": "芒果",
  "location": "測試地點",
  "area": 1.0,
  "description": "測試描述",
  "startDate": "2025-02-01",
  "endDate": "2025-06-30",
  "expectedYield": 5000,
  "unitPrice": 100,
  "hasInsurance": true,
  "insuranceCompany": "測試保險",
  "initCost": 1000,
  "annualIncome": 300,
  "investorPercent": 25,
  "interest": 5,
  "premium": 20,
  "farmer_id": "farmer001"
}
```

---

## 🔗 相關文檔

- **完整 API 文檔**: `PROJECT_SUBMISSION_API.md`
- **審核 API**: `PROJECT_SUBMISSION_API.md` (approve section)
- **數據庫設計**: `../DATABASE_SCHEMA_DESIGN.md`

---

**狀態**: ✅ Ready to Use

