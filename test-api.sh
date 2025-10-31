#!/bin/bash

# 測試專案提交 API
echo "測試專案提交 API..."
echo ""

curl -X POST http://localhost:3000/api/projects/submit \
  -H "Content-Type: application/json" \
  -d @test-project-submit.json

echo ""
echo ""
echo "測試完成！"

