import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const DATA_DIR = path.join(process.cwd(), 'data');
const PROJECTS_FILE = path.join(DATA_DIR, 'projects.json');
const PROJECTS_CONTENT_DIR = path.join(process.cwd(), 'projects-content');

export interface Project {
  id: string;
  title: string;
  description: string;
  image: string;
  tags: string[];
  githubUrl?: string;
  demoUrl?: string;
  stars?: number;
  date: string;
  featured?: boolean;
  createdAt: string;
  updatedAt: string;
  content?: string;
}

// 确保数据目录存在
function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

// 确保项目内容目录存在
function ensureProjectsContentDir() {
  if (!fs.existsSync(PROJECTS_CONTENT_DIR)) {
    fs.mkdirSync(PROJECTS_CONTENT_DIR, { recursive: true });
  }
}

// 读取项目数据
function readProjectsData(): Project[] {
  ensureDataDir();
  if (!fs.existsSync(PROJECTS_FILE)) {
    // 初始化默认数据
    const defaultProjects: Project[] = [
      {
        id: '1',
        title: '个人博客系统',
        description: '基于 Next.js 和 Tailwind CSS 构建的现代化个人博客系统，支持 Markdown 文章、评论系统、管理员后台等功能。',
        image: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=800&h=400&fit=crop',
        tags: ['Next.js', 'TypeScript', 'Tailwind CSS', 'React'],
        githubUrl: 'https://github.com/imanwxx/personal_blog_website',
        stars: 42,
        date: '2026-01-15',
        featured: true,
        createdAt: '2026-01-15T00:00:00Z',
        updatedAt: '2026-01-15T00:00:00Z',
      },
      {
        id: '2',
        title: '机器人控制系统',
        description: '使用 ROS2 和 Python 开发的机器人控制系统，支持路径规划、SLAM 建图和自主导航功能。',
        image: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&h=400&fit=crop',
        tags: ['ROS2', 'Python', 'C++', 'SLAM'],
        githubUrl: 'https://github.com/imanwxx/robot-control',
        stars: 28,
        date: '2025-11-20',
        createdAt: '2025-11-20T00:00:00Z',
        updatedAt: '2025-11-20T00:00:00Z',
      },
      {
        id: '3',
        title: '强化学习仿真环境',
        description: '基于 Isaac Gym 和 PyTorch 的强化学习训练环境，用于四足机器人的运动控制学习。',
        image: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=800&h=400&fit=crop',
        tags: ['PyTorch', 'Isaac Gym', 'RL', 'MuJoCo'],
        githubUrl: 'https://github.com/imanwxx/rl-sim',
        stars: 35,
        date: '2025-09-10',
        featured: true,
        createdAt: '2025-09-10T00:00:00Z',
        updatedAt: '2025-09-10T00:00:00Z',
      },
      {
        id: '4',
        title: '3D CAD 设计工具',
        description: '基于 WebGL 的在线 3D CAD 设计工具，支持基础建模、装配和渲染功能。',
        image: 'https://images.unsplash.com/photo-1617791160505-6f00504e3519?w=800&h=400&fit=crop',
        tags: ['Three.js', 'WebGL', 'TypeScript', 'CAD'],
        demoUrl: 'https://cad-demo.example.com',
        date: '2025-07-05',
        createdAt: '2025-07-05T00:00:00Z',
        updatedAt: '2025-07-05T00:00:00Z',
      },
    ];
    writeProjectsData(defaultProjects);
    return defaultProjects;
  }
  
  try {
    const data = fs.readFileSync(PROJECTS_FILE, 'utf8');
    return JSON.parse(data);
  } catch {
    return [];
  }
}

// 写入项目数据
function writeProjectsData(projects: Project[]) {
  ensureDataDir();
  fs.writeFileSync(PROJECTS_FILE, JSON.stringify(projects, null, 2));
}

// 获取所有项目
export async function getAllProjects(): Promise<Project[]> {
  return readProjectsData();
}

// 获取精选项目
export async function getFeaturedProjects(): Promise<Project[]> {
  const projects = readProjectsData();
  return projects.filter(p => p.featured);
}

// 获取单个项目
export async function getProjectById(id: string): Promise<Project | null> {
  const projects = readProjectsData();
  return projects.find(p => p.id === id) || null;
}

// 创建项目
export async function createProject(project: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>): Promise<Project> {
  const projects = readProjectsData();
  const newProject: Project = {
    ...project,
    id: Date.now().toString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  projects.push(newProject);
  writeProjectsData(projects);
  return newProject;
}

// 更新项目
export async function updateProject(id: string, updates: Partial<Project>): Promise<Project | null> {
  const projects = readProjectsData();
  const index = projects.findIndex(p => p.id === id);
  if (index === -1) return null;
  
  projects[index] = {
    ...projects[index],
    ...updates,
    updatedAt: new Date().toISOString(),
  };
  writeProjectsData(projects);
  return projects[index];
}

// 删除项目
export async function deleteProject(id: string): Promise<boolean> {
  const projects = readProjectsData();
  const filtered = projects.filter(p => p.id !== id);
  if (filtered.length === projects.length) return false;
  writeProjectsData(filtered);
  return true;
}

// 获取所有标签
export async function getAllProjectTags(): Promise<string[]> {
  const projects = readProjectsData();
  const tags = new Set(projects.flatMap(p => p.tags));
  return Array.from(tags);
}

// 获取项目内容（Markdown）
export async function getProjectContent(projectId: string): Promise<string | null> {
  ensureProjectsContentDir();
  const contentPath = path.join(PROJECTS_CONTENT_DIR, `${projectId}.md`);

  if (!fs.existsSync(contentPath)) {
    return null;
  }

  try {
    const fileContents = fs.readFileSync(contentPath, 'utf8');
    const { content } = matter(fileContents);
    return content;
  } catch (error) {
    console.error(`Error reading project content for ${projectId}:`, error);
    return null;
  }
}

// 更新项目内容
export async function updateProjectContent(projectId: string, content: string): Promise<boolean> {
  ensureProjectsContentDir();
  const contentPath = path.join(PROJECTS_CONTENT_DIR, `${projectId}.md`);

  try {
    fs.writeFileSync(contentPath, content, 'utf8');
    return true;
  } catch (error) {
    console.error(`Error writing project content for ${projectId}:`, error);
    return false;
  }
}
