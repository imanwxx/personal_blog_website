# 个人博客部署指南

## 部署步骤

### 1. 上传项目文件到服务器

将以下文件上传到服务器 `/root/personal_blog` 目录：
- `.next/` - 构建输出目录
- `public/` - 静态资源目录
- `posts/` - 文章目录
- `package.json`
- `package-lock.json`
- `next.config.ts`
- `Dockerfile`
- `docker-compose.yml`
- `deploy.sh`

### 2. 在服务器上执行部署

```bash
cd /root/personal_blog
chmod +x deploy.sh
./deploy.sh
```

### 3. 手动部署（备选）

如果脚本执行失败，可以手动执行：

```bash
# 进入项目目录
cd /root/personal_blog

# 停止旧容器
docker stop personal_blog 2>/dev/null || true
docker rm personal_blog 2>/dev/null || true

# 构建镜像
docker build -t personal_blog:latest .

# 启动容器
docker run -d \
  --name personal_blog \
  --restart unless-stopped \
  -p 3000:3000 \
  -v /root/personal_blog_data:/app/data \
  personal_blog:latest

# 查看日志
docker logs -f personal_blog
```

## 更新内容

本次迭代优化包含以下内容：

### ✅ SEO优化
- 新增 sitemap.xml 自动生成
- 新增 robots.txt 配置
- 新增 RSS 订阅功能 (/rss.xml)
- 添加结构化数据 (JSON-LD)
- 优化页面 metadata

### ✅ 性能优化
- 图片优化配置 (WebP/AVIF格式)
- 代码分割和懒加载
- 静态资源缓存策略
- 安全响应头配置

### ✅ 首页重构
- 添加统计数据展示 (文章数、分类数、标签数、精选数)
- 精选文章专区
- 最新文章列表
- 快捷导航链接

### ✅ 搜索增强
- 搜索历史记录
- 热门搜索标签
- 热门标签云
- 搜索结果高亮

### ✅ 阅读量统计
- 文章阅读量统计 API
- 阅读量显示组件
- 去重统计（基于 session）

### ✅ 分享功能
- 微信分享（二维码）
- 微博分享
- Twitter 分享
- 邮件分享
- 复制链接

### ✅ 时间线里程碑
- 里程碑标记组件
- 支持多种类型（成就、教育、工作、项目）

### ✅ 项目动态管理
- 项目数据改为 JSON 存储
- 项目管理 API (/api/projects)
- 后台项目管理页面

### ✅ 随笔动态管理
- 随笔数据改为 JSON 存储
- 随笔管理 API (/api/essays)
- 后台随笔管理页面
- 点赞功能

### ✅ 管理后台扩展
- 新增项目管理入口
- 新增随笔管理入口
- 快捷导航卡片

## 访问地址

- 网站: http://49.232.232.252:3000
- RSS: http://49.232.232.252:3000/rss.xml
- Sitemap: http://49.232.232.252:3000/sitemap.xml

## 数据持久化

数据存储在 `/root/personal_blog_data` 目录：
- `projects.json` - 项目数据
- `essays.json` - 随笔数据
- `views.json` - 阅读量统计

## 管理员登录

访问 http://49.232.232.252:3000/admin/login
- 用户名: admin
- 密码: （请查看 .env.local 文件中的 ADMIN_PASSWORD）
