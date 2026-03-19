import type { Experience } from '@/types';

const experience: Experience[] = [
  {
    company: 'Salesforce',
    role: 'AI Engineer',
    period: '2024 – Present',
    description:
      'Building AgentForce step by step at Einstein Studio.',
    techStack: ['PyTorch', 'CUDA', 'LLMs'],
  },
  {
    company: 'CoreAI',
    role: 'Technical Cofounder',
    period: '2024',
    description:
      'Multi-model systems with Llama 8B and Phi 2.7B. Achieved 35% model size reduction and 70% inference speed improvement through fine-tuning.',
    techStack: ['PyTorch', 'LLMs', 'ONNX'],
  },
  {
    company: 'Qualcomm',
    role: 'Systems Engineer Intern',
    period: '2024',
    description:
      'Reinforcement learning and Bayesian optimization for ADAS resource allocation.',
    techStack: ['Python', 'Reinforcement Learning', 'Bayesian Optimization'],
  },
  {
    company: 'Microsoft',
    role: 'Software Development Engineer',
    period: '2020 – 2023',
    description:
      'Built ML features: Picture to Tasks (78% accuracy), Discover Feed (20% engagement increase), Autosuggest Tasks, Autocategorize Tasks (35% manual effort reduction).',
    techStack: ['Azure ML', 'ReactJS', 'Spring Boot', 'Kafka'],
  },
  {
    company: 'Nvidia',
    role: 'Software Development Intern',
    period: '2020',
    description:
      'Enhanced HDMI I2C graphics driver functions and GPU power performance testing utilities.',
    techStack: ['C', 'CUDA', 'GPU Drivers'],
  },
];

export default experience;
