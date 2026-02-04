# 轮播图配置说明

## 如何修改首页轮播图

1. 将您的图片文件放入 `public/images/` 目录
2. 编辑 `data/carousel-config.ts` 文件修改轮播图配置

## 支持的图片格式
- JPG
- PNG
- WebP
- GIF

## 配置示例

```typescript
export const carouselItems: CarouselItem[] = [
  {
    id: '1',
    src: '/images/your-image-1.jpg',
    alt: '图片描述',
    title: '轮播标题'
  },
  {
    id: '2',
    src: '/images/your-image-2.jpg',
    alt: '图片描述',
    title: '轮播标题'
  },
  // 添加更多轮播图...
];
```

## 推荐图片尺寸
- 宽度: 1920px 或以上
- 高度: 400px 或以上
- 建议 16:9 或 3:1 的比例

## 注意事项
- 图片路径必须以 `/images/` 开头
- 图片文件名不要包含特殊字符
- 建议使用 WebP 格式以获得更好的加载性能
