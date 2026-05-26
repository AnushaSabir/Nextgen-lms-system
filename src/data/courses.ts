export interface Course {
  id: string;
  title: string;
  slug: string;
  description: string;
  category: string;
  duration: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  lessons: number;
  price: number | 'Free';
  instructor: string;
  imageColor: string; // Used for UI placeholder since we don't have images
  iconName: string; // lucide icon name
  syllabus: { title: string; description: string }[];
}

export const courses: Course[] = [
  {
    id: 'c1',
    title: 'Modern Web Development Bootcamp',
    slug: 'modern-web-development',
    description: 'Master full-stack web development using React, Next.js, Node.js, and Tailwind CSS. Build production-ready SaaS applications from scratch.',
    category: 'Development',
    duration: '12 Weeks',
    level: 'Beginner',
    lessons: 48,
    price: 'Free',
    instructor: 'NextGen Experts',
    imageColor: 'from-secondary to-secondary-light',
    iconName: 'Code',
    syllabus: [
      { title: 'HTML, CSS & JavaScript Fundamentals', description: 'Learn the core building blocks of the web.' },
      { title: 'React & Front-end Frameworks', description: 'Build interactive UIs with modern React.' },
      { title: 'Next.js App Router & SSR', description: 'Master server-side rendering and routing.' },
      { title: 'Backend & Databases', description: 'Integrate APIs and databases seamlessly.' }
    ]
  },
  {
    id: 'c2',
    title: 'AI Automation Mastery',
    slug: 'ai-automation-mastery',
    description: 'Learn how to build powerful autonomous agents and automate business workflows using n8n, Make, and OpenAI.',
    category: 'Artificial Intelligence',
    duration: '8 Weeks',
    level: 'Intermediate',
    lessons: 32,
    price: 'Free',
    instructor: 'AI Automation Team',
    imageColor: 'from-primary to-primary-light',
    iconName: 'Bot',
    syllabus: [
      { title: 'Introduction to AI & Prompt Engineering', description: 'Write effective prompts to get the best from LLMs.' },
      { title: 'Workflow Automation Basics', description: 'Connect different apps without writing code.' },
      { title: 'Building Autonomous Agents', description: 'Create AI agents that can browse, research, and execute tasks.' },
      { title: 'Real-world Business Use Cases', description: 'Automate lead generation, customer support, and more.' }
    ]
  },
  {
    id: 'c3',
    title: 'Amazon Shopify E-Commerce Success',
    slug: 'amazon-shopify-ecommerce',
    description: 'Start and scale a profitable e-commerce business. Learn product research, sourcing, Shopify store setup, and Amazon FBA.',
    category: 'Business',
    duration: '10 Weeks',
    level: 'Beginner',
    lessons: 40,
    price: 'Free',
    instructor: 'E-commerce Gurus',
    imageColor: 'from-primary-dark to-primary',
    iconName: 'ShoppingBag',
    syllabus: [
      { title: 'E-commerce Fundamentals', description: 'Understand the landscape of online selling.' },
      { title: 'Product Hunting & Sourcing', description: 'Find winning products and reliable suppliers.' },
      { title: 'Setting up Shopify', description: 'Design a high-converting store.' },
      { title: 'Amazon FBA Mastery', description: 'Rank products and manage inventory on Amazon.' }
    ]
  },
  {
    id: 'c4',
    title: 'Generative AI Applications',
    slug: 'generative-ai-apps',
    description: 'Deep dive into building applications powered by Generative AI models. Learn embeddings, vector databases, and RAG.',
    category: 'Artificial Intelligence',
    duration: '10 Weeks',
    level: 'Advanced',
    lessons: 35,
    price: 'Free',
    instructor: 'NextGen AI Lab',
    imageColor: 'from-slate-800 to-secondary',
    iconName: 'Cpu',
    syllabus: [
      { title: 'LLM Architecture', description: 'How Large Language Models actually work.' },
      { title: 'Embeddings & Vector Search', description: 'Store and retrieve semantic data.' },
      { title: 'Retrieval-Augmented Generation (RAG)', description: 'Give your AI custom knowledge.' },
      { title: 'Deploying AI Apps', description: 'Take your AI applications to production.' }
    ]
  }
];

export function getCourseBySlug(slug: string): Course | undefined {
  return courses.find(c => c.slug === slug);
}

export function getCourseById(id: string): Course | undefined {
  return courses.find(c => c.id === id);
}
