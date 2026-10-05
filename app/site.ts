// ponytail: one place to edit the copy. Everything on the landing page reads from here.
export const NAME = "Chandrahas Aroori";
export const SHORT = "charoori";
export const TAGLINE = "AI engineer. PyTorch and GPU kernels. San Francisco.";
export const EMAIL = "chandrahas.aroori@gmail.com";
export const LINKS = {
  x: "https://x.com/charoori_ai",
  github: "https://github.com/Exorust",
  linkedin: "https://www.linkedin.com/in/chandrahas-aroori/",
};

export const ABOUT = `I work on AI at Salesforce and care about what happens underneath it: the model, the kernel, the hardware.
Fundamentals matter. Domain expertise matters.
Before this I was at Microsoft and Nvidia, cofounded CoreAI, and wrote TorchLeet, a set of PyTorch exercises with about 2,000 stars on GitHub.
I also run The Kernel Dev, a builder-first AI community in San Francisco.`;

export const PROJECTS = [
  { name: "TorchLeet", url: "https://github.com/Exorust/TorchLeet", text: "Leetcode for PyTorch. Hands-on exercises to learn PyTorch by solving problems. About 2,000 stars." },
  { name: "The Kernel Dev", url: "https://thekernel.dev", text: "A curated community of AI builders and researchers in San Francisco. Small rooms, live demos, no slides." },
  { name: "AdKit-MCP", url: "https://github.com/Exorust/Adkit-MCP", text: "A lightweight ad engine for the Model Context Protocol." },
  { name: "LLM-Cookbook", url: "https://github.com/Exorust/LLM-Cookbook", text: "Practical notebooks for building with LLMs: fine-tuning, RAG and prompting." },
];

// Written from my own posts on X (@charoori_ai), 2024 to 2026. Edit freely.
export const MANIFESTO = [
  {
    word: "Truth",
    text: `What is life but the search for truth.

In a room full of posers, build the real product.
Say it in fewer words.

Don't play a part. Be genuine.`,
  },
  {
    word: "Depth",
    text: `Hard things feel hard. Don't stop.

When it breaks, pause, take a breath, and go deeper into the fundamentals until you can fix it yourself.

Read the book slowly. The summary gives you the information. It does not make you feel it.`,
  },
  {
    word: "Heart",
    text: `AI has not changed this: the world is still moved by the effort of one strong-willed human.

If AI takes the mundane, what is left is beauty and wonder.

Whatever comes, I will live passionately.`,
  },
];

// Copied from exorust.github.io (src/data/experience.ts). Newest first.
export const EXPERIENCE = [
  { company: "Salesforce", role: "AI Engineer", period: "2024 – Present", text: "Building AgentForce step by step at Einstein Studio.", stack: ["PyTorch", "CUDA", "LLMs"] },
  { company: "CoreAI", role: "Technical Cofounder", period: "2024", text: "Multi-model systems with Llama 8B and Phi 2.7B. Achieved 35% model size reduction and 70% inference speed improvement through fine-tuning.", stack: ["PyTorch", "LLMs", "ONNX"] },
  { company: "Qualcomm", role: "Systems Engineer Intern", period: "2024", text: "Reinforcement learning and Bayesian optimization for ADAS resource allocation.", stack: ["Python", "Reinforcement Learning", "Bayesian Optimization"] },
  { company: "Microsoft", role: "Software Development Engineer", period: "2020 – 2023", text: "Built ML features: Picture to Tasks (78% accuracy), Discover Feed (20% engagement increase), Autosuggest Tasks, Autocategorize Tasks (35% manual effort reduction).", stack: ["Azure ML", "ReactJS", "Spring Boot", "Kafka"] },
  { company: "Nvidia", role: "Software Development Intern", period: "2020", text: "Enhanced HDMI I2C graphics driver functions and GPU power performance testing utilities.", stack: ["C", "CUDA", "GPU Drivers"] },
];
