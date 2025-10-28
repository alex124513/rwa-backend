"use client";

import React, { useState } from "react";

type Params = {
  initCost: number;
  annualIncome: number;
  investorPercent: number; // 輸入%數
  interest: number; // 輸入%數
  premium: number; // 輸入%數
};

// 1. *** 已更新 annualIncome 預設值 ***
const defaultParams: Params = {
  initCost: 1150,
  annualIncome: 312,
  investorPercent: 20,
  interest: 5,
  premium: 33,
};

const parameterList = [
  { key: "initCost", name: "溫室建構費", unit: "萬" },
  { key: "annualIncome", name: "每年營業額", unit: "萬" },
  { key: "investorPercent", name: "投資人收益分成%", unit: "%" },
  { key: "interest", name: "利率%", unit: "%" },
  { key: "premium", name: "溢酬%", unit: "%" },
];
const tableHead = [
  "年", "投資人分成(萬)", "累積償還本金(萬)", "剩餘未償本金(萬)", "剩餘未償本金(萬)+利率", "買回價格(萬)", "當年買回總收益", "殖利率-不買回", "當年買回總報酬率"
];

// 2. *** 已修正 calculateData 函數 ***
function calculateData(params: Params) {
  const build_cost = params.initCost;
  const annual_income = params.annualIncome;
  const investor_share_rate = params.investorPercent / 100;
  const interest_rate = params.interest / 100;
  const premium_rate = params.premium / 100;
  const yearCount = 34; // 0~34

  // 根據Excel邏輯：投資人分成(萬) = 每年營業額 * 投資人收益分成% (四捨五入)
  const annual_payment = Math.round(annual_income * investor_share_rate);
  
  // 根據Excel邏輯：殖利率-不買回 = 投資人分成(萬) / 溫室建構費
  const yield_no_buyback_val = build_cost > 0 ? (annual_payment / build_cost) : 0;

  let data = [] as any[];
  let cumulative = 0; // 累積償還本金

  // 這兩個變數追踪 *前一年* 的精確(float)數據，用於計算 *下一年*
  let last_remaining_principal = build_cost; // 年初剩餘未償本金
  let last_rwi = build_cost * (1 + interest_rate); // 年初剩餘未償本金+利率

  for (let i = 0; i <= yearCount; i++) {
    
    let investor_income: number;
    let current_remaining_principal: number; // 當年剩餘未償本金 (精確)
    let current_rwi: number; // 當年剩餘未償本金+利率 (精確)
    let buyback_price: number; // 當年買回價格 (精確)
    let total_buyback_income: number | string; // 當年買回總收益
    let yield_no_buyback: string; // 殖利率-不買回
    let total_return_with_buyback: string; // 當年買回總報酬率

    if (i === 0) {
      // --- 第 0 年 (初始狀態) ---
      investor_income = 0;
      cumulative = 0;
      current_remaining_principal = last_remaining_principal; // 1150
      current_rwi = last_rwi; // 1150 * 1.05 = 1207.5
      buyback_price = current_remaining_principal * (1 + premium_rate); // 1150 * 1.33 = 1529.5
      
      total_buyback_income = '';
      yield_no_buyback = '';
      total_return_with_buyback = '';

    } else {
      // --- 第 1 年及之後 ---
      investor_income = annual_payment;
      cumulative += investor_income;
      
      // *** 核心邏輯修正 ***
      // 當年本金 = (前一年本金 + 前一年利息) - 當年支付
      current_remaining_principal = last_rwi - investor_income;
      
      // 確保本金不會變負數
      if (current_remaining_principal < 0) {
        current_remaining_principal = 0;
      }
      
      // 基於 *當年* 本金，計算新的利後本金和買回價
      current_rwi = current_remaining_principal * (1 + interest_rate);
      buyback_price = current_remaining_principal * (1 + premium_rate);

      // 計算總收益
      total_buyback_income = cumulative + buyback_price;
      
      // 計算總報酬率 (精確)
      const total_return_val = build_cost > 0 ? ((total_buyback_income / build_cost) - 1) : 0;

      // --- 格式化輸出 (遵循原始碼的四捨五入邏輯) ---
      
      // 總收益：四捨五入到整數
      total_buyback_income = Math.round(total_buyback_income);
      
      // 殖利率：(0.0539... -> 5.4%)
      yield_no_buyback = (Math.round(yield_no_buyback_val * 100 * 10) / 10) + '%'; 
      
      // 總報酬率：(0.378... -> 38%)
      total_return_with_buyback = Math.round(total_return_val * 100) + '%';
    }

    data.push({
      year: i,
      investor_income: investor_income,
      cumulative_principal: cumulative,
      // 僅在最後輸出時才四捨五入 (用於顯示)
      remaining_principal: Math.round(current_remaining_principal),
      remaining_with_interest: Math.round(current_rwi),
      buyback_price: Math.round(buyback_price),
      total_buyback_income: total_buyback_income,
      yield_no_buyback: yield_no_buyback,
      total_return_with_buyback: total_return_with_buyback,
    });

    // 儲存 *當前* 精確值，供 *下一次* 迴圈使用
    last_remaining_principal = current_remaining_principal;
    last_rwi = current_rwi;
  }

  return data;
}

export default function CalculatorPage() {
  // 將輸入用字串保存，避免輸入途中被轉成0導致跳動
  const [form, setForm] = useState<{[k in keyof Params]: string}>(
    {
      initCost: String(defaultParams.initCost),
      annualIncome: String(defaultParams.annualIncome),
      investorPercent: String(defaultParams.investorPercent),
      interest: String(defaultParams.interest),
      premium: String(defaultParams.premium),
    }
  );

  const toNum = (v: string): number => {
    const n = Number(v);
    return isNaN(n) ? 0 : n;
  };

  // 即時計算使用的數值參數
  const params: Params = {
    initCost: toNum(form.initCost),
    annualIncome: toNum(form.annualIncome),
    investorPercent: toNum(form.investorPercent),
    interest: toNum(form.interest),
    premium: toNum(form.premium),
  };

  const rows = calculateData(params);
  return (
    <div style={{padding:32,maxWidth:1300,margin:'0 auto',fontFamily:'system-ui,Segoe UI,sans-serif'}}>
      <h2 style={{fontWeight:700,fontSize:26,margin:'18px 0 24px',color:'#1c263c',letterSpacing:'1.5px'}}>專案投資計算表</h2>
      <div style={{marginBottom:32,background:'#f3f7fb',borderRadius:18,padding:'28px 28px', boxShadow:'0 4px 24px rgba(35,60,140,0.07)',border:'1.8px solid #e3e7ef', color:'#18203a'}}>
        <div style={{fontWeight:650,fontSize:17,marginBottom:16,letterSpacing:1.2,color:'#233c63'}}>投資假設參數（可調整）：</div>
        <div style={{display:'flex',flexWrap:'wrap',gap:26,borderTop:'1px solid #e3e9ef',paddingTop:15}}>
        {parameterList.map((p) => (
          <label key={p.key} style={{display:'flex',flexDirection:'column',minWidth:180,background:'#f8fbfd',borderRadius:13,padding:'16px 13px 11px',boxShadow:'0 1px 6px rgba(0,42,70,0.04)',fontWeight:500,border:'1.2px solid #e4ecf5',transition:'box-shadow 0.16s'}}>
            <span style={{color:'#4068a0',marginBottom:6,fontSize:15,letterSpacing:'1px'}}>{p.name}</span>
            <div style={{display:'flex',alignItems:'center'}}>
              <input
                type="number"
                step="any"
                value={form[p.key as keyof Params]}
                onChange={(e)=>{
                  const v = e.target.value; // 直接存字串
                  setForm(x => ({...x, [p.key]: v }));
                }}
                style={{
                  border:'1.7px solid #b7d5f7',borderRadius:7,padding:'5px 12px',marginRight:7,outline:'none',
                  width:110,background:'#fff',fontWeight:700,fontSize:16,boxShadow:'0 0.5px #e1effa',transition:'border 0.13s', color:'#25334a',textAlign:'right'
                }}
                onFocus={e=>e.target.style.border='2px solid #2157b3'}
                onBlur ={e=>e.target.style.border='1.7px solid #b7d5f7'}
              />
              <span style={{fontSize:14,color:'#315393',fontWeight:650}}>{p.unit}</span>
            </div>
          </label>
        ))}
        </div>
      </div>
      <div style={{fontWeight:650,marginBottom:10,fontSize:17,color:'#253f6c'}}>年度計算結果：</div>
      <div style={{overflowX:'auto',background:'#f6fafd',borderRadius:15,boxShadow:'0 2px 16px rgba(60,80,130,0.08)',border:'1.2px solid #e1e6ef',padding:0}}> 
        <table style={{minWidth:900,width:'100%',borderCollapse:'collapse',fontSize:15}}>
          <thead>
            <tr style={{borderBottom:'2.3px solid #d6e5fa'}}>
              {tableHead.map(head=>(<th style={{background:'#1b2e54',color:'#fff',padding:'13px 12px',fontWeight:'bold',fontSize:15,letterSpacing:1.2,borderRight:'1px solid #4368ad',textAlign:'center'}} key={head}>{head}</th>))}
            </tr>
          </thead>
          <tbody>
            {rows.map((r,idx)=>(
              <tr key={idx} style={{background:idx%2?'#f7faff':'#fff',borderBottom:'1.2px solid #e5eaf3'}}>
                <td style={{padding:'8px 10px',color:'#2d4463',fontWeight:650,textAlign:'center',fontVariantNumeric:'tabular-nums'}}>{r.year}</td>
                <td style={{padding:'8px 10px',color:'#295c84',fontWeight:600,textAlign:'right',fontVariantNumeric:'tabular-nums'}}>{r.investor_income}</td>
                <td style={{padding:'8px 10px',color:'#295c84',textAlign:'right',fontVariantNumeric:'tabular-nums'}}>{r.cumulative_principal}</td>
                <td style={{padding:'8px 10px',color:'#233c5f',textAlign:'right',fontVariantNumeric:'tabular-nums'}}>{r.remaining_principal}</td>
                <td style={{padding:'8px 10px',color:'#295c84',textAlign:'right',fontVariantNumeric:'tabular-nums'}}>{r.remaining_with_interest}</td>
                <td style={{padding:'8px 10px',color:'#2e92cb',background:'#ecf6fc',borderRadius:4,fontWeight:700,textAlign:'right',fontVariantNumeric:'tabular-nums'}}>{r.buyback_price}</td>
                <td style={{padding:'8px 10px',color:'#3a8753',background:'#e6f4ec',borderRadius:4,fontWeight:700,textAlign:'right',fontVariantNumeric:'tabular-nums'}}>{r.total_buyback_income}</td>
                <td style={{padding:'8px 10px',color:'#b48406',textAlign:'right',fontVariantNumeric:'tabular-nums'}}>{r.yield_no_buyback}</td>
                <td style={{padding:'8px 10px',color:'#d63c60',textAlign:'right',fontVariantNumeric:'tabular-nums'}}>{r.total_return_with_buyback}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}