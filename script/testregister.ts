const fetch = require('node-fetch');

async function testRegister() {
  const res = await fetch('http://localhost:3000/api/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      account: 'testuser1',
      password: '123456',
      role: 'user',
      userID: 'user001',
      isKYC: false,
      web3Address: '0xABCDEF1234567890',
    })
  });
  const data = await res.json();
  console.log('註冊結果:', data);
}

testRegister();
