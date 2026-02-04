# 首页轮播图配置指南

## 快速开始

轮播图已经配置完成并可以使用。当前使用的是占位 SVG 图片。

## 修改轮播图

### 方法一：替换图片文件（推荐）

1. 将您的图片文件放入 `public/images/` 目录
2. 确保图片文件名与配置匹配：
   - `/images/space.jpg` - 太空主题图片
   - `/images/ai.jpg` - AI主题图片
   - `/images/robot.jpg` - 机器人主题图片

3. 编辑 `data/carousel-config.ts`，将 `.svg` 改为 `.jpg`（或其他格式）：

```typescript
export const carouselItems: CarouselItem[] = [
  {
    id: '1',
    src: '/images/space.jpg',  // 改为您的图片格式
    alt: '太空探索',
    title: '探索宇宙的无限可能'
  },
  // ...
];
```

### 方法二：修改配置文件

编辑 `data/carousel-config.ts` 文件，完全自定义轮播图：

```typescript
export const carouselItems: CarouselItem[] = [
  {
    id: '1',
    src: '/images/your-custom-image-1.png',
    alt: '图片描述',
    title: '轮播标题1'
  },
  {
    id: '2',
    src: '/images/your-custom-image-2.jpg',
    alt: '图片描述',
    title: '轮播标题2'
  },
  // 可以添加更多轮播图...
];
```

## 支持的图片格式

- JPG / JPEG ✅
- PNG ✅
- WebP ✅（推荐，性能更好）
- SVG ✅（仅限矢量图）
- GIF ✅

## 推荐图片尺寸

- 宽度：1920px 或以上
- 高度：400px 或以上
- 比例：建议 16:9 或 3:1
- 文件大小：建议每张图片小于 500KB

## 添加更多轮播图

在 `data/carousel-config.ts` 中添加新的配置项：

```typescript
{
  id: '4',
  src: '/images/your-new-image.jpg',
  alt: '图片描述',
  title: '轮播标题'
}
```

## 删除轮播图

从 `data/carousel-config.ts` 中删除对应的配置项即可。

## 轮播图配置文件位置

```
data/carousel-config.ts
```

## 图片存储位置

```
public/images/
```

## 注意事项

1. 图片路径必须以 `/images/` 开头
2. 图片文件名不要包含特殊字符
3. 建议使用 WebP 格式以获得更好的加载性能
4. 如果图片很大，建议进行压缩优化
5. 确保图片有合适的版权许可

## 轮播图功能特性

- 自动轮播（5秒切换）
- 手动切换（左右箭头）
- 指示器（底部圆点）
- 平滑过渡动画
- 响应式设计

## 故障排查

### 图片不显示

1. 检查图片文件是否在 `public/images/` 目录
2. 检查文件名是否与配置一致（区分大小写）
3. 检查图片格式是否支持
4. 清除浏览器缓存

### 轮播图不动

1. 检查浏览器控制台是否有错误
2. 确认 JavaScript 是否启用
3. 尝试刷新页面

### 样式错乱

1. 检查图片尺寸是否符合推荐标准
2. 清除 `.next` 缓存文件夹
3. 重新构建项目

## 示例：从零开始添加新轮播图

1. 准备图片 `my-new-carousel.jpg` (1920x400px)
2. 复制到 `public/images/` 目录
3. 编辑 `data/carousel-config.ts`：

```typescript
{
  id: '4',
  src: '/images/my-new-carousel.jpg',
  alt: '我的新轮播图',
  title: '新轮播图标题'
}
```

4. 保存文件，刷新页面即可看到效果
