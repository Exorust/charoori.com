import type { Project } from '@/types';

const projects: Project[] = [
  {
    name: 'TorchLeet',
    description:
      'Leetcode for PyTorch — a collection of hands-on exercises to learn PyTorch by solving problems. 1,958+ stars.',
    techStack: ['PyTorch', 'Python', 'Jupyter'],
    repoUrl: 'https://github.com/Exorust/TorchLeet',
    liveUrl: undefined,
    status: 'active',
  },
  {
    name: 'Adkit-MCP',
    description:
      'A lightweight ad-engine for MCP (Model Context Protocol).',
    techStack: ['Python', 'MCP'],
    repoUrl: 'https://github.com/Exorust/Adkit-MCP',
    liveUrl: 'https://www.adkitmcp.com/',
    status: 'active',
  },
  {
    name: 'LLM-Cookbook',
    description:
      'A cookbook to start building with LLMs. Practical notebooks covering fine-tuning, RAG, and prompt engineering. 112+ stars.',
    techStack: ['Python', 'LLMs', 'Jupyter'],
    repoUrl: 'https://github.com/Exorust/LLM-Cookbook',
    liveUrl: undefined,
    status: 'active',
  },
];

export default projects;
