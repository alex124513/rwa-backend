# 前端快速參考

## 🎯 「建立新計劃」頁面 API

### 端點
```
POST /api/projects/submit
```

### 請求範例

```javascript
const response = await fetch('/api/projects/submit', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    projectName: formData.projectName,
    cropType: formData.cropType,
    location: formData.location,
    area: Number(formData.area),
    description: formData.description,
    startDate: formData.startDate,
    endDate: formData.endDate,
    expectedYield: Number(formData.expectedYield),
    unitPrice: Number(formData.unitPrice),
    hasInsurance: formData.hasInsurance,
    sustainability: formData.sustainability || '',
    coverImage: imagePreview.value || '',
    
    initCost: Number(calculatorParams.initCost),
    annualIncome: Number(calculatorParams.annualIncome),
    investorPercent: Number(calculatorParams.investorPercent),
    interest: Number(calculatorParams.interest),
    premium: Number(calculatorParams.premium),
    
    farmer_id: 'farmer001'
  })
});

const result = await response.json();
// result.ok === true 表示成功
```

### 成功回應
```json
{ "ok": true, "projectId": "...", "message": "專案已提交，等待審核" }
```

詳細說明請參考: **`FRONTEND_INTEGRATION.md`**

