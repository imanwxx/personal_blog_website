import fs from 'fs';
import path from 'path';

const DATA_DIR = path.join(process.cwd(), 'data');
const ESSAYS_FILE = path.join(DATA_DIR, 'essays.json');

export interface Essay {
  id: string;
  title: string;
  content: string;
  date: string;
  tags: string[];
  likes: number;
  comments: number;
  mood?: string;
  createdAt: string;
  updatedAt: string;
}

// 确保数据目录存在
function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

// 读取随笔数据
function readEssaysData(): Essay[] {
  ensureDataDir();
  if (!fs.existsSync(ESSAYS_FILE)) {
    // 初始化默认数据
    const defaultEssays: Essay[] = [
      {
        id: '1',
        title: '关于深度学习的思考',
        content: '最近在学习深度学习的过程中，有一些感悟想记录下来。神经网络就像是我们大脑的一个缩影，每一层都在提取不同层次的特征。从边缘检测到低级特征，再到高级语义特征，这种层次化的表示学习方式让我对智能有了新的理解。\n\n深度学习的魅力在于它的端到端学习能力。我们不再需要手动设计特征提取器，而是让网络自己学习最优的特征表示。这让我想到，也许智能的本质就是找到数据中的有效表示。\n\n当然，深度学习也有它的局限性。数据依赖、可解释性差、泛化能力有限等问题仍然困扰着我们。但正是这些挑战，让研究变得更有趣。',
        date: '2026-02-01',
        tags: ['深度学习', 'AI', '思考'],
        likes: 23,
        comments: 5,
        mood: '🤔',
        createdAt: '2026-02-01T00:00:00Z',
        updatedAt: '2026-02-01T00:00:00Z',
      },
      {
        id: '2',
        title: '周末的机器人实验',
        content: '这个周末花了整整两天时间在实验室调试机器人。虽然遇到了很多问题，但看到机器人终于能稳定行走的那一刻，所有的辛苦都值得了。\n\n这次主要解决了平衡控制的问题。通过调整PID参数，机器人的稳定性有了明显提升。还尝试了不同的步态规划算法，发现基于ZMP的方法在我们的平台上表现最好。\n\n下周计划加入视觉反馈，让机器人能够识别障碍物并自动避让。',
        date: '2026-01-25',
        tags: ['机器人', '实验', '周末'],
        likes: 45,
        comments: 12,
        mood: '🤖',
        createdAt: '2026-01-25T00:00:00Z',
        updatedAt: '2026-01-25T00:00:00Z',
      },
      {
        id: '3',
        title: '新项目的构想',
        content: '昨晚失眠，脑海中突然冒出一个新项目的想法。想要做一个结合强化学习和计算机视觉的智能系统，可以自动识别并操作物体。\n\n初步设想是这样的：使用YOLO进行物体检测，然后用强化学习训练一个抓取策略。状态空间包括图像特征和机械臂的关节角度，动作空间是关节速度或者末端执行器的位姿。\n\n奖励函数的设计是关键。需要平衡抓取成功率和操作效率。也许可以用课程学习的方法，从简单的物体开始，逐步增加难度。\n\n这个想法还需要进一步完善，但已经让我兴奋得睡不着了。',
        date: '2026-01-18',
        tags: ['项目', '创意', 'RL'],
        likes: 38,
        comments: 8,
        mood: '💡',
        createdAt: '2026-01-18T00:00:00Z',
        updatedAt: '2026-01-18T00:00:00Z',
      },
      {
        id: '4',
        title: '读《机器人学导论》有感',
        content: '终于读完了这本经典教材。书中对运动学和动力学的讲解非常清晰，特别是关于雅可比矩阵的部分，让我对机器人的控制有了更深的理解。\n\n雅可比矩阵描述了关节空间与操作空间之间的映射关系，是机器人控制的核心工具。通过雅可比，我们可以将末端的力/力矩映射到关节力矩，实现力控制。\n\n书中还介绍了很多实际的机器人系统，从工业机械臂到人形机器人，让我对这个领域的发展历史有了更全面的认识。\n\n强烈推荐给所有对机器人学感兴趣的同学！',
        date: '2026-01-10',
        tags: ['读书', '机器人学', '学习'],
        likes: 52,
        comments: 15,
        mood: '📚',
        createdAt: '2026-01-10T00:00:00Z',
        updatedAt: '2026-01-10T00:00:00Z',
      },
      {
        id: '5',
        title: '生活中的小确幸',
        content: '今天天气很好，下午在校园里散步，看到樱花开了。突然意识到，在忙碌的学习和研究之余，也要学会享受生活的美好。\n\n有时候我们会过于专注于目标，忽略了沿途的风景。科研固然重要，但生活的意义不仅仅在于发表论文和做出成果。\n\n和朋友聊天、看一部好电影、品尝美食、欣赏自然美景——这些看似平凡的事情，其实构成了生命中最珍贵的记忆。\n\n新的一年，希望能更好地平衡工作与生活，在追求梦想的同时，也不辜负每一个当下。',
        date: '2026-01-05',
        tags: ['生活', '感悟', '樱花'],
        likes: 67,
        comments: 20,
        mood: '🌸',
        createdAt: '2026-01-05T00:00:00Z',
        updatedAt: '2026-01-05T00:00:00Z',
      },
    ];
    writeEssaysData(defaultEssays);
    return defaultEssays;
  }
  
  try {
    const data = fs.readFileSync(ESSAYS_FILE, 'utf8');
    return JSON.parse(data);
  } catch {
    return [];
  }
}

// 写入随笔数据
function writeEssaysData(essays: Essay[]) {
  ensureDataDir();
  fs.writeFileSync(ESSAYS_FILE, JSON.stringify(essays, null, 2));
}

// 获取所有随笔
export async function getAllEssays(): Promise<Essay[]> {
  const essays = readEssaysData();
  return essays.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

// 获取单个随笔
export async function getEssayById(id: string): Promise<Essay | null> {
  const essays = readEssaysData();
  return essays.find(e => e.id === id) || null;
}

// 创建随笔
export async function createEssay(essay: Omit<Essay, 'id' | 'createdAt' | 'updatedAt' | 'likes' | 'comments'>): Promise<Essay> {
  const essays = readEssaysData();
  const newEssay: Essay = {
    ...essay,
    id: Date.now().toString(),
    likes: 0,
    comments: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  essays.push(newEssay);
  writeEssaysData(essays);
  return newEssay;
}

// 更新随笔
export async function updateEssay(id: string, updates: Partial<Essay>): Promise<Essay | null> {
  const essays = readEssaysData();
  const index = essays.findIndex(e => e.id === id);
  if (index === -1) return null;
  
  essays[index] = {
    ...essays[index],
    ...updates,
    updatedAt: new Date().toISOString(),
  };
  writeEssaysData(essays);
  return essays[index];
}

// 删除随笔
export async function deleteEssay(id: string): Promise<boolean> {
  const essays = readEssaysData();
  const filtered = essays.filter(e => e.id !== id);
  if (filtered.length === essays.length) return false;
  writeEssaysData(filtered);
  return true;
}

// 获取所有标签
export async function getAllEssayTags(): Promise<string[]> {
  const essays = readEssaysData();
  const tags = new Set(essays.flatMap(e => e.tags));
  return Array.from(tags);
}

// 点赞随笔
export async function likeEssay(id: string): Promise<number> {
  const essays = readEssaysData();
  const index = essays.findIndex(e => e.id === id);
  if (index === -1) return 0;
  
  essays[index].likes += 1;
  writeEssaysData(essays);
  return essays[index].likes;
}
