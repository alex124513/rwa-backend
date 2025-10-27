import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI!;
const dbName = process.env.MONGODB_DB!;

async function getData() {
  const client = new MongoClient(uri);
  await client.connect();
  const db = client.db(dbName);
  const users = await db.collection('user').find().toArray();
  const projects = await db.collection('projects').find().toArray();
  await client.close();
  return { users: JSON.parse(JSON.stringify(users)), projects: JSON.parse(JSON.stringify(projects)) };
}

export default async function CheatPage() {
  const { users, projects } = await getData();
  return (
    <div style={{ padding: 32, maxWidth: 1300, margin: '0 auto' }}>
      <h2 style={{fontWeight:'bold',fontSize:24,margin:'16px 0', letterSpacing:1}}>Users List</h2>
      <Table data={users} />
      <br />
      <h2 style={{fontWeight:'bold',fontSize:24,margin:'16px 0', letterSpacing:1}}>Projects List</h2>
      <Table data={projects} />
      <style>{`
        .rwa-table-box {
          background: var(--table-bg, #fafcff);
          border-radius: 16px;
          box-shadow: 0 6px 32px rgba(30,50,80,.07);
          overflow-x: auto;
          margin-bottom: 24px;
        }
        .rwa-table {
          min-width:600px;
          width: 100%;
          border-collapse:collapse;
        }
        .rwa-table th, .rwa-table td {
          padding: 9px 16px;
          border-bottom: 1px solid #e4e6ef;
          text-align:left;
        }
        .rwa-table th {
          background: #222d4c;
          color: #fff;
          font-weight:bold;
          letter-spacing:1px;
        }
        .rwa-table tr:nth-child(even) {
          background: #eef1f7;
        }
        @media (prefers-color-scheme: dark) {
          .rwa-table-box {
            background: #1b2233;
          }
          .rwa-table th {
            background: #394b7a;
            color: #f6f6f8;
          }
          .rwa-table td {
            color: #dee1ea;
          }
          .rwa-table tr:nth-child(even) {
            background: #2c3956;
          }
          .rwa-table tr:nth-child(odd) {
            background: #232a3e;
          }
        }
        @media (max-width:800px) {
          .rwa-table-box{padding: 0;}
          .rwa-table{min-width:400px;font-size:14px;}
        }
      `}</style>
    </div>
  );
}

function getAllKeys(data:any[]): string[] {
  const set = new Set<string>();
  data.forEach(row => Object.keys(row).forEach(k => set.add(k)));
  return Array.from(set);
}

function Table({data}:{data:any[]}) {
  if(data.length === 0) return <div className="rwa-table-box"><i>無資料</i></div>
  const allKeys = getAllKeys(data);
  return (
    <div className="rwa-table-box">
      <table className="rwa-table">
        <thead>
          <tr>
            {allKeys.map(key => <th key={key}>{key}</th>)}
          </tr>
        </thead>
        <tbody>
          {data.map((row,i) => (
            <tr key={i}>
              {allKeys.map((key,ii) => (<td key={ii}>{
                key in row ? (typeof row[key] === 'object' ? JSON.stringify(row[key]) : String(row[key])) : <span style={{color:'#aaa'}}>(無此欄位)</span>
              }</td>))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
