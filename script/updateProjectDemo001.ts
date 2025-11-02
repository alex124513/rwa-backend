import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI!;
const dbName = process.env.MONGODB_DB!;

async function main() {
  const client = new MongoClient(uri);
  await client.connect();
  try {
    const db = client.db(dbName);
    const collection = db.collection("projects");
    // 用 as any 解決型別問題
    const filter = { _id: "demo001" as any };
    const update = {
      $set: {
        name: "藍莓計畫",
        symbol: "BBT",
        farmer: "0x1B25F9c810137650DA444815C3962e80aF8464b9",
        total_nft: 150,
        nft_price: 10,
        build_cost: 1150,
        annual_income: 150,
        investor_share: 20,
        interest_rate: 5,
        premium_rate: 1
      }
    };
    const result = await collection.updateOne(filter, update);
    if (result.matchedCount) {
      console.log("Project demo001 updated successfully.");
    } else {
      console.log("Project not found or update failed.");
    }
  } catch (e) {
    console.error("Update error:", e);
  } finally {
    await client.close();
  }
}
main();
