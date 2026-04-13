// User types
export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'user';
  createdAt: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (email: string, password: string, name: string) => Promise<boolean>;
  logout: () => void;
}

// Revit Family types
export interface RevitFamily {
  id: string;
  name: string;
  description: string;
  category: string;
  tags: string[];
  fileName: string;
  filePath: string; // Путь к файлу для скачивания (например: "/families/door.rfa")
  fileSize: string;
  version: string;
  rating: number;
  ratingCount: number;
  userRatings: Record<string, number>; // userId -> rating
  downloads: number;
  thumbnail?: string;
  createdAt: string;
  updatedAt: string;
}

// Article types
export interface Article {
  id: string;
  title: string;
  content: string;
  summary: string;
  category: string;
  tags: string[];
  fileName?: string;
  createdAt: string;
  updatedAt: string;
}

// Video types
export interface Video {
  id: string;
  title: string;
  description: string;
  fileName: string;
  thumbnail?: string;
  duration?: string;
  category: string;
  tags: string[];
  createdAt: string;
}

// Filter types
export interface FamilyFilters {
  category: string; // 'all' или конкретная категория
  tags: string[];
  search: string;
  sortBy: 'name' | 'rating' | 'downloads' | 'date';
  sortOrder: 'asc' | 'desc';
}

// Form types
export interface FamilyFormData {
  name: string;
  description: string;
  category: string;
  tags: string;
  version: string;
}

export interface ArticleFormData {
  title: string;
  content: string;
  summary: string;
  category: string;
  tags: string;
}

export interface VideoFormData {
  title: string;
  description: string;
  category: string;
  tags: string;
}
