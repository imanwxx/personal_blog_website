#!/bin/bash

# 个人博客部署脚本
# 在服务器上执行此脚本进行部署

echo "🚀 开始部署个人博客..."

# 停止旧容器
echo "📦 停止旧容器..."
docker stop personal_blog 2>/dev/null || true
docker rm personal_blog 2>/dev/null || true

# 构建新镜像
echo "🔨 构建Docker镜像..."
docker build -t personal_blog:latest .

# 启动新容器
echo "🚀 启动新容器..."
docker run -d \
  --name personal_blog \
  --restart unless-stopped \
  -p 3000:3000 \
  -v /root/personal_blog_data:/app/data \
  personal_blog:latest

# 检查状态
echo "✅ 检查部署状态..."
sleep 3
docker ps | grep personal_blog

echo "🎉 部署完成！"
echo "访问地址: http://49.232.232.252:3000"
