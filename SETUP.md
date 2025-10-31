# 後端設定說明

## 📋 環境變數設定

需要建立 `.env.local` 檔案來設定 MongoDB 連接：

```bash
# 在 rwa-backend 目錄下建立
touch .env.local
```

在 `.env.local` 中加入以下內容：

```env
MONGODB_URI=mongodb://localhost:27017
MONGODB_DB=greenfi
```

## 🔧 設定步驟

### 1. 安裝 MongoDB（如果尚未安裝）

**MacOS (使用 Homebrew)**:
```bash
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community
```

**Windows**: 下載並安裝 MongoDB Community Edition
[https://www.mongodb.com/try/download/community](https://www.mongodb.com/try/download/community)

**Linux**: 
```bash
# Ubuntu/Debian
sudo apt-get install -y mongodb

# 啟動服務
sudo systemctl start mongodb
sudo systemctl enable mongodb
```

### 2. 建立環境變數檔

```bash
cd rwa-backend
cat > .env.local << EOF
MONGODB_URI=mongodb://localhost:27017
MONGODB_DB=greenfi
EOF
```

### 3. 重啟後端伺服器

```bash
# 停止現有服務（Ctrl+C）
# 重新啟動
npm run dev
```

### 4. 執行種子資料

```bash
curl -X POST http://localhost:3000/api/seed
```

## ✅ 驗證安裝

執行以下命令檢查資料是否成功插入：

```bash
curl http://localhost:3000/api/getProjects
```

應該會看到 3 個專案的資料。

## 🐳 或使用 Docker（可選）

如果不想安裝 MongoDB，可以使用 Docker：

```bash
# 啟動 MongoDB Docker 容器
docker run -d -p 27017:27017 --name mongodb mongo:latest

# 建立環境變數檔
cat > .env.local << EOF
MONGODB_URI=mongodb://localhost:27017
MONGODB_DB=greenfi
EOF

# 重啟後端
npm run dev
```

## 📝 MongoDB Atlas（雲端選項）

也可以使用 MongoDB Atlas：

```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/?retryWrites=true&w=majority
MONGODB_DB=greenfi
```

