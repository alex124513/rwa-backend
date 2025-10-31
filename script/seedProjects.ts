import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017';
const dbName = process.env.MONGODB_DB || 'greenfi';

async function seedProjects() {
  const client = new MongoClient(uri);
  
  try {
    await client.connect();
    console.log('✅ 連接到 MongoDB');
    
    const db = client.db(dbName);
    const collection = db.collection('projects');
    
    // 清空現有專案
    await collection.deleteMany({});
    console.log('✅ 已清空現有專案');
    
    // 定義 3 個不同專案
    const projects = [
      {
        // 專案 1: 枋山愛文芒果
        title: '枋山愛文芒果抗颱網室A廠',
        farmer_id: 'farmer001',
        status_on_chain: 'ACTIVE',
        contract_address: '0x1234567890abcdef1234567890abcdef12345678',
        coverImage: 'https://media.discordapp.net/attachments/338606954379476992/1433369723965407253/1758540304940.jpg?ex=69047114&is=69031f94&hm=88201d22755339f4154133d822d2652f8a2e70b8a4c1b26a330f066ed99c01a9&=&format=webp&width=1120&height=1992',
        description: '屏東枋山地區愛文芒果專案，採用抗颱風網室栽培技術，確保產量穩定。預計年產10公噸芒果，主要外銷日本市場。',
        crop_name: '愛文芒果',
        crop_type: '芒果',
        location: '屏東枋山',
        area: 1.5,
        total_nft: 150,
        nft_price: 10000,
        funded_nft: 0,
        minted_nft: 0,
        build_cost: 1800,
        annual_income: 450,
        investor_share: 30,
        interest_rate: 5,
        premium_rate: 35,
        insurance_company: '富邦產險',
        insurance_policy_no: 'INS-2024-M001',
        insurance_coverage: 1800,
        funding_status: 'OPENING',
        status_display: '開放中',
        target_amount: 1500000,
        funded_amount: 0,
        funding_start_date: new Date('2024-12-01'),
        funding_end_date: new Date('2025-02-28'),
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        // 專案 2: 台南稻米
        title: '台南有機蓬萊米契作計畫',
        farmer_id: 'farmer002',
        status_on_chain: 'ACTIVE',
        contract_address: '0xabcdef1234567890abcdef1234567890abcdef12',
        coverImage: 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=1120',
        description: '台南後壁有機稻米專案，採用友善耕作方式，與契作農民合作，生產高品質有機蓬萊米。預計年產30公噸稻米。',
        crop_name: '蓬萊米',
        crop_type: '稻米',
        location: '台南後壁',
        area: 3.0,
        total_nft: 200,
        nft_price: 8000,
        funded_nft: 85,
        minted_nft: 85,
        build_cost: 1200,
        annual_income: 360,
        investor_share: 25,
        interest_rate: 6,
        premium_rate: 30,
        insurance_company: '國泰產險',
        insurance_policy_no: 'INS-2024-R001',
        insurance_coverage: 1200,
        funding_status: 'OPENING',
        status_display: '開放中',
        target_amount: 1600000,
        funded_amount: 680000,
        funding_start_date: new Date('2024-11-15'),
        funding_end_date: new Date('2025-01-31'),
        created_at: new Date('2024-11-15'),
        updated_at: new Date(),
      },
      {
        // 專案 3: 雲林番茄溫室
        title: '雲林智能溫室番茄A區',
        farmer_id: 'farmer003',
        status_on_chain: 'PENDING',
        contract_address: '0x9876543210fedcba9876543210fedcba98765432',
        coverImage: 'https://images.unsplash.com/photo-1592841200221-05a7f584ab85?w=1120',
        description: '雲林口湖智能溫室番茄專案，採用荷蘭先進溫室技術，全自動化環控系統，產量與品質穩定。預計年產50公噸番茄。',
        crop_name: '番茄',
        crop_type: '番茄',
        location: '雲林口湖',
        area: 2.5,
        total_nft: 180,
        nft_price: 12000,
        funded_nft: 0,
        minted_nft: 0,
        build_cost: 2100,
        annual_income: 600,
        investor_share: 35,
        interest_rate: 7,
        premium_rate: 40,
        insurance_company: '新光產險',
        insurance_policy_no: 'INS-2024-T001',
        insurance_coverage: 2100,
        funding_status: 'COMING_SOON',
        status_display: '即將推出',
        target_amount: 2160000,
        funded_amount: 0,
        funding_start_date: new Date('2025-01-01'),
        funding_end_date: new Date('2025-03-31'),
        created_at: new Date('2024-12-15'),
        updated_at: new Date('2024-12-15'),
      }
    ];
    
    // 插入專案
    const result = await collection.insertMany(projects);
    console.log(`✅ 成功插入 ${result.insertedCount} 個專案`);
    
    // 顯示所有專案
    const insertedProjects = await collection.find().toArray();
    console.log('\n📋 已插入的專案:');
    insertedProjects.forEach((project: any, index: number) => {
      console.log(`\n${index + 1}. ${project.title}`);
      console.log(`   作物: ${project.crop_name} (${project.crop_type})`);
      console.log(`   位置: ${project.location}`);
      console.log(`   NFT總量: ${project.total_nft}, 價格: ${project.nft_price} TWDT`);
      console.log(`   建造成本: ${project.build_cost} 萬元`);
      console.log(`   年度收益: ${project.annual_income} 萬元`);
      console.log(`   狀態: ${project.status_display} (${project.funding_status})`);
      console.log(`   合約: ${project.contract_address}`);
    });
    
  } catch (error) {
    console.error('❌ 錯誤:', error);
  } finally {
    await client.close();
    console.log('\n✅ 關閉連接');
  }
}

// 執行腳本
seedProjects();

