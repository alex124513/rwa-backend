# 前端工程師整合指南

## 📋 給前端工程師

你好，我是後端工程師。已建立新的 API 給你前端「建立新計劃」頁面使用。

---

## 🔗 API 資訊

**端點**: `POST /api/projects/submit`  
**Base URL**: `http://localhost:3000` (本地) / `https://your-vercel-url.vercel.app` (Vercel)  
**Content-Type**: `application/json`

---

## 📝 請求格式

### Request Body 範例

```json
{
  "projectName": "枋山愛文芒果抗颱網室A廠",
  "cropType": "芒果",
  "location": "屏東縣枋山鄉",
  "area": 2.5,
  "description": "本專案採用抗颱網室技術...",
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
}
```

### 欄位對應你的前端表單

| 後端欄位 | 前端表單 | 類型 | 必填 |
|---------|---------|------|-----|
| `projectName` | `formData.projectName` | string | ✅ |
| `cropType` | `formData.cropType` | string | ✅ |
| `location` | `formData.location` | string | ✅ |
| `area` | `formData.area` | number | ⭕ |
| `description` | `formData.description` | string | ✅ |
| `startDate` | `formData.startDate` | string | ✅ |
| `endDate` | `formData.endDate` | string | ✅ |
| `expectedYield` | `formData.expectedYield` | number | ⭕ |
| `unitPrice` | `formData.unitPrice` | number | ⭕ |
| `hasInsurance` | `formData.hasInsurance` | boolean | ⭕ |
| `insuranceCompany` | 從表單取得 | string | ⭕ |
| `sustainability` | `formData.sustainability` | string | ⭕ |
| `coverImage` | `imagePreview.value` | string | ⭕ |
| `initCost` | `calculatorParams.initCost` | number | ⭕ |
| `annualIncome` | `calculatorParams.annualIncome` | number | ⭕ |
| `investorPercent` | `calculatorParams.investorPercent` | number | ⭕ |
| `interest` | `calculatorParams.interest` | number | ⭕ |
| `premium` | `calculatorParams.premium` | number | ⭕ |
| `farmer_id` | 從用戶 session 取得 | string | ⭕ |

---

## ✅ 成功回應

**HTTP Status**: `200`  
**Response Body**:

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

**HTTP Status**: `400`  
**Response Body**:

```json
{
  "error": "Missing required fields"
}
```

### 伺服器錯誤

**HTTP Status**: `500`  
**Response Body**:

```json
{
  "error": "server error"
}
```

---

## 💻 Nuxt/Vue 整合範例

### 在 `project-submit.vue` 中修改

```typescript
const handleSubmit = async () => {
  // 驗證必填欄位
  if (!formData.projectName || !formData.cropType || !formData.location || 
      !formData.description || !formData.startDate || !formData.endDate) {
    alert('請填寫所有必填欄位');
    return;
  }

  try {
    // 準備圖片（base64 或 URL）
    const coverImage = imagePreview.value || '';
    
    // 數字轉換函數
    const toNum = (v: string | number): number => {
      const n = typeof v === 'number' ? v : Number(v);
      return isNaN(n) ? 0 : n;
    };

    // 準備請求資料
    const payload = {
      // 基本資訊
      projectName: formData.projectName,
      cropType: formData.cropType,
      location: formData.location,
      area: toNum(formData.area),
      description: formData.description,
      startDate: formData.startDate,
      endDate: formData.endDate,
      expectedYield: toNum(formData.expectedYield),
      unitPrice: toNum(formData.unitPrice),
      
      // 保險與永續性
      hasInsurance: formData.hasInsurance,
      insuranceCompany: '',  // TODO: 從表單取得或留空
      sustainability: formData.sustainability || '',
      
      // 封面圖片
      coverImage: coverImage,
      
      // 投資假設參數
      initCost: toNum(calculatorParams.initCost),
      annualIncome: toNum(calculatorParams.annualIncome),
      investorPercent: toNum(calculatorParams.investorPercent),
      interest: toNum(calculatorParams.interest),
      premium: toNum(calculatorParams.premium),
      
      // 農夫 ID（從 session 或 store 取得）
      farmer_id: 'farmer001'  // TODO: 替換為實際用戶 ID
    };

    console.log('提交表單數據:', payload);
    console.log('上傳的圖片:', imageFile.value);
    console.log('計算器參數:', calculatorParams);

    // 調用 API
    const response = await fetch('/api/projects/submit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload)
    });

    const result = await response.json();

    if (result.ok) {
      // 成功提示
      showSuccessModal.value = true;
      console.log('提交成功，專案 ID:', result.projectId);
    } else {
      alert('提交失敗：' + (result.error || '未知錯誤'));
    }
  } catch (error) {
    console.error('提交錯誤:', error);
    alert('發生錯誤，請稍後再試');
  }
};
```

---

## 📸 圖片處理

### 選項 1：直接傳 Base64

```typescript
const coverImage = imagePreview.value; // 已經是 base64
```

### 選項 2：先上傳到圖床，再傳 URL

```typescript
// 如果先上傳到 S3/Cloudinary 等
const coverImageUrl = await uploadToImageHost(imageFile.value);
const payload = {
  // ...
  coverImage: coverImageUrl,
};
```

**建議**: 暫時先用 base64，之後可改成圖床 URL。

---

## 🔔 注意事項

1. **資料不會立即上鏈**: 提交後先存入資料庫，等待 Admin 審核
2. **狀態**: `admin_agree: false`，前端可顯示「待審核」
3. **數字欄位**: 確保傳送數字而非字串
4. **日期格式**: `YYYY-MM-DD`（例如 `2025-02-01`）
5. **圖片大小**: Base64 圖片會變大，建議限制檔案大小

---

## 🧪 測試步驟

### 本地測試

```bash
# 1. 啟動後端（終端 1）
cd rwa-backend
npm run dev

# 2. 啟動前端（終端 2）
cd rwa-frontend
pnpm dev

# 3. 打開瀏覽器
# 訪問: http://localhost:3000/farmer/project-submit
# 填寫表單並提交
```

### 使用測試腳本

```bash
# 後端目錄
cd rwa-backend
./test-api.sh
```

---

## 📞 遇到問題？

1. **CORS 錯誤**: 確認前端與後端在同一域或設定正確 CORS
2. **404 錯誤**: 確認 `/api/projects/submit` 路徑正確
3. **500 錯誤**: 檢查後端控制台日誌
4. **欄位錯誤**: 確認數字欄位為 number

---

## 📚 相關文件

- 完整 API 文檔: `PROJECT_SUBMISSION_API.md`
- 使用範例: `API_USAGE_EXAMPLE.md`
- 測試資料: `test-project-submit.json`

---

## ✅ 檢查清單

整合前請確認：

- [ ] API 端點正確
- [ ] Content-Type 設定
- [ ] 數字欄位正確轉型
- [ ] 圖片處理邏輯
- [ ] 錯誤處理
- [ ] 成功提示
- [ ] 日誌記錄

---

**聯絡人**: 後端團隊  
**狀態**: ✅ Ready for Integration

