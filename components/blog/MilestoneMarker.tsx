'use client';

import { Flag, Award, GraduationCap, Briefcase, Rocket, Star } from 'lucide-react';

interface Milestone {
  id: string;
  date: string;
  title: string;
  description: string;
  type: 'achievement' | 'education' | 'work' | 'project' | 'milestone';
  icon?: string;
}

interface MilestoneMarkerProps {
  milestones: Milestone[];
}

const iconMap = {
  achievement: Award,
  education: GraduationCap,
  work: Briefcase,
  project: Rocket,
  milestone: Flag,
};

const colorMap = {
  achievement: 'from-yellow-500 to-orange-500',
  education: 'from-blue-500 to-cyan-500',
  work: 'from-purple-500 to-pink-500',
  project: 'from-green-500 to-teal-500',
  milestone: 'from-red-500 to-pink-500',
};

export default function MilestoneMarker({ milestones }: MilestoneMarkerProps) {
  // 按日期排序
  const sortedMilestones = [...milestones].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return (
    <div className="space-y-6">
      {sortedMilestones.map((milestone, index) => {
        const Icon = iconMap[milestone.type];
        const colors = colorMap[milestone.type];
        const date = new Date(milestone.date);
        const year = date.getFullYear();
        const month = date.toLocaleDateString('zh-CN', { month: 'short' });

        return (
          <div
            key={milestone.id}
            className="relative flex items-start gap-4 group"
          >
            {/* Timeline Line */}
            {index !== sortedMilestones.length - 1 && (
              <div className="absolute left-6 top-12 bottom-0 w-0.5 bg-gradient-to-b from-gray-600 to-transparent" />
            )}

            {/* Icon */}
            <div
              className={`relative z-10 flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-r ${colors} shadow-lg group-hover:scale-110 transition-transform`}
            >
              <Icon className="h-6 w-6 text-white" />
            </div>

            {/* Content */}
            <div className="flex-1 glass-effect rounded-2xl p-5 border border-gray-700/50 group-hover:border-gray-600 transition-colors">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h4 className="text-lg font-bold text-white group-hover:text-blue-400 transition-colors">
                    {milestone.title}
                  </h4>
                  <p className="text-gray-400 text-sm mt-1">{milestone.description}</p>
                </div>
                <div className="flex flex-col items-end text-right">
                  <span className="text-2xl font-bold text-white">{year}</span>
                  <span className="text-sm text-gray-500">{month}</span>
                </div>
              </div>
              
              {/* Type Badge */}
              <div className="mt-3">
                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r ${colors} text-white`}>
                  <Star className="h-3 w-3" />
                  {getTypeLabel(milestone.type)}
                </span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function getTypeLabel(type: Milestone['type']): string {
  const labels = {
    achievement: '成就',
    education: '教育',
    work: '工作',
    project: '项目',
    milestone: '里程碑',
  };
  return labels[type];
}

// 示例里程碑数据
export const sampleMilestones: Milestone[] = [
  {
    id: '1',
    date: '2024-06-01',
    title: '获得优秀毕业生称号',
    description: '以优异成绩完成学业，获得校级优秀毕业生荣誉称号',
    type: 'achievement',
  },
  {
    id: '2',
    date: '2024-01-15',
    title: '加入某科技公司',
    description: '担任机器人算法工程师，负责运动控制算法开发',
    type: 'work',
  },
  {
    id: '3',
    date: '2023-09-01',
    title: '研究生入学',
    description: '进入某大学攻读控制科学与工程硕士学位',
    type: 'education',
  },
  {
    id: '4',
    date: '2023-06-01',
    title: '本科毕业',
    description: '获得自动化专业学士学位，GPA 3.8/4.0',
    type: 'education',
  },
  {
    id: '5',
    date: '2022-10-01',
    title: '机器人竞赛一等奖',
    description: '参加全国大学生机器人竞赛，获得一等奖',
    type: 'achievement',
  },
];
