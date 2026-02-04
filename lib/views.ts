import fs from 'fs';
import path from 'path';

const DATA_DIR = path.join(process.cwd(), 'data');
const VIEWS_FILE = path.join(DATA_DIR, 'views.json');

interface ViewStats {
  slug: string;
  count: number;
  uniqueVisitors: string[];
  lastUpdated: string;
}

interface ViewsData {
  [slug: string]: ViewStats;
}

// 确保数据目录存在
function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

// 读取阅读量数据
function readViewsData(): ViewsData {
  ensureDataDir();
  if (!fs.existsSync(VIEWS_FILE)) {
    return {};
  }
  try {
    const data = fs.readFileSync(VIEWS_FILE, 'utf8');
    return JSON.parse(data);
  } catch {
    return {};
  }
}

// 写入阅读量数据
function writeViewsData(data: ViewsData) {
  ensureDataDir();
  fs.writeFileSync(VIEWS_FILE, JSON.stringify(data, null, 2));
}

// 生成访客ID（基于IP和User Agent的简单哈希）
export function generateVisitorId(ip: string, userAgent: string): string {
  const crypto = require('crypto');
  return crypto.createHash('md5').update(`${ip}-${userAgent}`).digest('hex').substring(0, 16);
}

// 增加阅读量
export async function incrementView(slug: string, visitorId: string): Promise<number> {
  const data = readViewsData();
  
  if (!data[slug]) {
    data[slug] = {
      slug,
      count: 0,
      uniqueVisitors: [],
      lastUpdated: new Date().toISOString(),
    };
  }
  
  // 检查是否是新访客
  if (!data[slug].uniqueVisitors.includes(visitorId)) {
    data[slug].uniqueVisitors.push(visitorId);
    data[slug].count += 1;
    data[slug].lastUpdated = new Date().toISOString();
    writeViewsData(data);
  }
  
  return data[slug].count;
}

// 获取阅读量
export async function getViewCount(slug: string): Promise<number> {
  const data = readViewsData();
  return data[slug]?.count || 0;
}

// 获取所有阅读量数据
export async function getAllViews(): Promise<ViewsData> {
  return readViewsData();
}

// 获取热门文章（按阅读量排序）
export async function getPopularPosts(limit: number = 10): Promise<{ slug: string; count: number }[]> {
  const data = readViewsData();
  return Object.values(data)
    .sort((a, b) => b.count - a.count)
    .slice(0, limit)
    .map(item => ({ slug: item.slug, count: item.count }));
}

// 获取总阅读量
export async function getTotalViews(): Promise<number> {
  const data = readViewsData();
  return Object.values(data).reduce((sum, item) => sum + item.count, 0);
}
