import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const postsDirectory = path.join(process.cwd(), 'posts');

export interface PostMetadata {
  title: string;
  date: string;
  excerpt: string;
  tags: string[];
  category: string;
  coverImage?: string;
  featured?: boolean;
}

export async function getPostSlugs() {
  const fileNames = fs.readdirSync(postsDirectory);
  return fileNames.map((name) => name.replace(/\.mdx?$/, ''));
}

export async function getPostBySlug(slug: string) {
  const realSlug = slug.replace(/\.mdx?$/, '');
  const fullPath = path.join(postsDirectory, `${realSlug}.md`);
  const fileContents = fs.readFileSync(fullPath, 'utf8');
  const { data, content } = matter(fileContents);

  return {
    slug: realSlug,
    title: data.title || 'Untitled',
    date: data.date || new Date().toISOString(),
    excerpt: data.excerpt || '',
    tags: Array.isArray(data.tags) ? data.tags : [],
    category: data.category || '未分类',
    coverImage: data.coverImage,
    featured: data.featured || false,
    content,
  } as PostMetadata & { content: string; slug: string };
}

export async function getAllPosts() {
  const slugs = await getPostSlugs();
  const posts = await Promise.all(slugs.map((slug) => getPostBySlug(slug)));
  return posts.sort((a, b) => {
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });
}

export async function getPostsByCategory(category: string) {
  const allPosts = await getAllPosts();
  return allPosts.filter((post) => post.category === category);
}

export async function getPostsByTag(tag: string) {
  const allPosts = await getAllPosts();
  return allPosts.filter((post) => post.tags.includes(tag));
}

export async function searchPosts(query: string) {
  const allPosts = await getAllPosts();
  const lowercaseQuery = query.toLowerCase();
  
  return allPosts.filter((post) => 
    post.title.toLowerCase().includes(lowercaseQuery) ||
    post.excerpt.toLowerCase().includes(lowercaseQuery) ||
    post.content.toLowerCase().includes(lowercaseQuery)
  );
}

export function getAllCategories(posts: any[]) {
  const categories = new Set(posts.map((post) => post.category));
  return Array.from(categories);
}

export function getAllTags(posts: any[]) {
  const tags = new Set(posts.flatMap((post) => post.tags));
  return Array.from(tags);
}

export async function getFeaturedPosts() {
  const allPosts = await getAllPosts();
  return allPosts.filter((post) => post.featured === true);
}

export async function getAllNonFeaturedPosts() {
  const allPosts = await getAllPosts();
  return allPosts.filter((post) => post.featured !== true);
}
