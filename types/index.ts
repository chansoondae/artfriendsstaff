export interface Opinion {
  id: string;
  content: string;
  nickname: string;
  temp_user_id: string;
  likes: number;
  created_at: string;
  is_liked?: boolean;
  comment_count?: number;
}

export interface Like {
  id: string;
  opinion_id: string;
  temp_user_id: string;
  created_at: string;
}

export interface Comment {
  id: string;
  opinion_id: string;
  content: string;
  nickname: string;
  temp_user_id: string;
  created_at: string;
}

export interface Stats {
  total: number;
}

export type SortBy = 'latest' | 'popular';
