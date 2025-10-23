export interface User {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  is_staff?: boolean;
}

export interface Post {
  id: number;
  title: string;
  content: string;
  media: string | null;
  video_url: string | null;
  media_type: 'image' | 'video' | null;
  author: User;
  created_at: string;
  updated_at: string;
  is_published: boolean;
  comments_count: number;
  comments?: Comment[];
}

export interface Comment {
  id: number;
  post: number;
  author: User;
  content: string;
  created_at: string;
  is_approved: boolean;
}

export interface Profile {
  id: number;
  user: User;
  bio: string;
  location: string;
  birth_date: string | null;
  avatar: string | null;
}

export interface SiteConfig {
  id: number;
  cv: string | null;
  updated_at: string;
}

export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export interface AuthResponse {
  user: User;
  access: string;
  refresh: string;
}

