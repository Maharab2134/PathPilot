export interface User {
  _id?: string; // Mongo-style id
  id?: string; // optional client id
  name: string;
  email: string;
  role: "user" | "admin" | "moderator";
  status?: "active" | "inactive";
  avatarUrl?: string;
  createdAt: string;
}

export interface Category {
  _id: string;
  name: string;
  description: string;
  active: boolean;
  createdAt: string;
}

export interface Question {
  _id: string;
  categoryId: string;
  text: string;
  options: string[];
  correctIndex?: number;
  difficulty: "easy" | "medium" | "hard";
  explanation?: string;
  createdAt: string;
}

export interface Attempt {
  _id: string;
  userId: string;
  categoryId: string | Category;
  score: number;
  total: number;
  percentage: number;
  detail: AttemptDetail[];
  createdAt: string;
}

export interface AttemptDetail {
  questionId: string | Question;
  selectedIndex: number;
  correct: boolean;
}

export interface CareerInfo {
  _id: string;
  categoryId: string | Category;
  title: string;
  description: string;
  skills: string[];
  learningPath: string[];
  youtubeLinks: string[];
  bookLinks: string[];
  courseLinks: string[];
  minScore: number;
  createdAt: string;
}

export interface QuizSubmission {
  categoryId: string;
  answers: Array<{
    questionId: string;
    selectedIndex: number;
  }>;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
}

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  errors?: Array<{ msg: string; param: string }>;
}

export interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  pages: number;
}
