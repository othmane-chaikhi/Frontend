// Mock data for when backend is not deployed
export const mockPosts = [
  {
    id: 1,
    title: "Welcome to My Portfolio",
    content: "This is a sample blog post to demonstrate the portfolio functionality. The backend is not yet deployed, so this is mock data.",
    excerpt: "This is a sample blog post to demonstrate the portfolio functionality.",
    media: null,
    media_url: "https://via.placeholder.com/800x600/4F46E5/FFFFFF?text=Blog+Post+Image",
    video_url: null,
    media_type: null,
    author: {
      id: 1,
      username: "othmane",
      email: "othmane@example.com",
      first_name: "Othmane",
      last_name: "Chaikhi"
    },
    created_at: "2024-01-15T10:00:00Z",
    updated_at: "2024-01-15T10:00:00Z",
    is_published: true,
    comments_count: 0,
    tags: ["portfolio", "demo"]
  },
  {
    id: 2,
    title: "Building a Full-Stack Application",
    content: "Learn how to build a complete full-stack application using Django and React. This tutorial covers everything from backend API development to frontend integration.",
    excerpt: "Learn how to build a complete full-stack application using Django and React.",
    media: null,
    media_url: "https://via.placeholder.com/800x600/10B981/FFFFFF?text=Full+Stack+Development",
    video_url: null,
    media_type: null,
    author: {
      id: 1,
      username: "othmane",
      email: "othmane@example.com",
      first_name: "Othmane",
      last_name: "Chaikhi"
    },
    created_at: "2024-01-10T14:30:00Z",
    updated_at: "2024-01-10T14:30:00Z",
    is_published: true,
    comments_count: 3,
    tags: ["django", "react", "tutorial"]
  },
  {
    id: 3,
    title: "Python Best Practices",
    content: "Discover the best practices for writing clean, maintainable Python code. From PEP 8 compliance to design patterns, this guide covers everything you need to know.",
    excerpt: "Discover the best practices for writing clean, maintainable Python code.",
    media: null,
    media_url: "https://via.placeholder.com/800x600/F59E0B/FFFFFF?text=Python+Best+Practices",
    video_url: null,
    media_type: null,
    author: {
      id: 1,
      username: "othmane",
      email: "othmane@example.com",
      first_name: "Othmane",
      last_name: "Chaikhi"
    },
    created_at: "2024-01-05T09:15:00Z",
    updated_at: "2024-01-05T09:15:00Z",
    is_published: true,
    comments_count: 7,
    tags: ["python", "best-practices", "coding"]
  }
];

export const mockSiteConfig = {
  id: 1,
  cv: "https://via.placeholder.com/800x1000/6366F1/FFFFFF?text=CV+Document",
  updated_at: "2024-01-15T10:00:00Z"
};

export const mockSkills = [
  { name: 'Python/Django', level: 90, icon: '🐍', color: 'from-blue-500 to-blue-600' },
  { name: 'JavaScript/React', level: 85, icon: '⚛️', color: 'from-yellow-500 to-yellow-600' },
  { name: 'Base de données', level: 80, icon: '🗄️', color: 'from-green-500 to-green-600' },
  { name: 'Java/Spring Boot', level: 75, icon: '☕', color: 'from-red-500 to-red-600' },
  { name: 'C/C++/C#/.NET Core', level: 75, icon: '⚙️', color: 'from-purple-500 to-purple-600' },
  { name: 'PHP', level: 75, icon: '🐘', color: 'from-indigo-500 to-indigo-600' }
];
