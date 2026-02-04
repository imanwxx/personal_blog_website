import fs from 'fs';
import path from 'path';

const DATA_DIR = path.join(process.cwd(), 'data');
const CAROUSEL_CONFIG_FILE = path.join(DATA_DIR, 'carousel-config.json');
const PUBLIC_IMAGES_DIR = path.join(process.cwd(), 'public', 'images');

export interface CarouselItem {
  id: string;
  src: string;
  alt: string;
  title: string;
}

// 确保数据目录存在
function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

// 确保图片目录存在
function ensureImagesDir() {
  if (!fs.existsSync(PUBLIC_IMAGES_DIR)) {
    fs.mkdirSync(PUBLIC_IMAGES_DIR, { recursive: true });
  }
}

// 读取轮播图配置（同步，用于服务端组件）
export function readCarouselConfigSync(): CarouselItem[] {
  ensureDataDir();
  if (!fs.existsSync(CAROUSEL_CONFIG_FILE)) {
    // 初始化默认配置
    const defaultConfig: CarouselItem[] = [
      {
        id: '1',
        src: '/images/space.svg',
        alt: '太空探索',
        title: '探索宇宙的无限可能'
      },
      {
        id: '2',
        src: '/images/ai.svg',
        alt: '人工智能',
        title: '智能时代的未来'
      },
      {
        id: '3',
        src: '/images/robot.svg',
        alt: '机器人技术',
        title: '智能机器人的进化'
      }
    ];
    writeCarouselConfig(defaultConfig);
    return defaultConfig;
  }

  try {
    const data = fs.readFileSync(CAROUSEL_CONFIG_FILE, 'utf8');
    return JSON.parse(data);
  } catch {
    return [];
  }
}

// 写入轮播图配置
function writeCarouselConfig(items: CarouselItem[]) {
  ensureDataDir();
  fs.writeFileSync(CAROUSEL_CONFIG_FILE, JSON.stringify(items, null, 2));
}

// 获取所有轮播图（异步，用于API）
export async function getAllCarouselItems(): Promise<CarouselItem[]> {
  return readCarouselConfigSync();
}

// 添加轮播图
export async function addCarouselItem(item: Omit<CarouselItem, 'id'>): Promise<CarouselItem> {
  const items = readCarouselConfigSync();
  const newItem: CarouselItem = {
    ...item,
    id: Date.now().toString()
  };
  items.push(newItem);
  writeCarouselConfig(items);
  return newItem;
}

// 更新轮播图
export async function updateCarouselItem(id: string, updates: Partial<CarouselItem>): Promise<CarouselItem | null> {
  const items = readCarouselConfigSync();
  const index = items.findIndex(item => item.id === id);
  if (index === -1) return null;

  items[index] = {
    ...items[index],
    ...updates
  };
  writeCarouselConfig(items);
  return items[index];
}

// 删除轮播图
export async function deleteCarouselItem(id: string): Promise<boolean> {
  const items = readCarouselConfigSync();
  const filtered = items.filter(item => item.id !== id);
  if (filtered.length === items.length) return false;
  writeCarouselConfig(filtered);
  return true;
}

// 保存上传的图片
export async function saveCarouselImage(filename: string, buffer: Buffer): Promise<string> {
  ensureImagesDir();
  const filepath = path.join(PUBLIC_IMAGES_DIR, filename);
  fs.writeFileSync(filepath, buffer);
  return `/images/${filename}`;
}

// 删除图片文件
export async function deleteCarouselImage(filepath: string): Promise<boolean> {
  try {
    const fullPath = path.join(process.cwd(), 'public', filepath);
    if (fs.existsSync(fullPath)) {
      fs.unlinkSync(fullPath);
      return true;
    }
    return false;
  } catch {
    return false;
  }
}

