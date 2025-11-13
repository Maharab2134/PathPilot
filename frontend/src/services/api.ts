import axios from "axios";
import {
  User,
  Category,
  Question,
  Attempt,
  CareerInfo,
  QuizSubmission,
  AuthResponse,
  ApiResponse,
} from "@/types";

const API_BASE_URL =
  (import.meta as any).env?.VITE_API_URL || "http://localhost:5000/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem("refreshToken");
        if (refreshToken) {
          const response = await api.post("/auth/refresh-token", {
            refreshToken,
          });
          const { accessToken } = response.data.data;

          localStorage.setItem("accessToken", accessToken);
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;

          return api(originalRequest);
        }
      } catch (refreshError) {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export const authService = {
  async login(email: string, password: string): Promise<AuthResponse> {
    const response = await api.post<ApiResponse<AuthResponse>>("/auth/login", {
      email,
      password,
    });
    return response.data.data!;
  },

  async register(
    name: string,
    email: string,
    password: string
  ): Promise<AuthResponse> {
    const response = await api.post<ApiResponse<AuthResponse>>(
      "/auth/register",
      { name, email, password }
    );
    return response.data.data!;
  },

  async getProfile(): Promise<User> {
    const response = await api.get<ApiResponse<{ user: User }>>(
      "/auth/profile"
    );
    return response.data.data!.user;
  },

  async updateProfile(data: { name?: string; avatar?: File }): Promise<User> {
    const formData = new FormData();
    if (data.name) formData.append("name", data.name);
    if (data.avatar) formData.append("avatar", data.avatar);
    // Do not set the Content-Type header manually. Let the browser/axios
    // add the multipart boundary. Setting it explicitly can prevent the
    // boundary from being added and cause multer on the server to not see the file.
    const response = await api.put<ApiResponse<{ user: User }>>(
      "/auth/profile",
      formData
    );
    return response.data.data!.user;
  },
};

// Base category service (user-level)
const baseCategoryService = {
  async getAll(): Promise<Category[]> {
    const response = await api.get<ApiResponse<{ categories: Category[] }>>(
      "/categories"
    );
    return response.data.data!.categories;
  },

  async getById(id: string): Promise<Category> {
    const response = await api.get<ApiResponse<{ category: Category }>>(
      `/categories/${id}`
    );
    return response.data.data!.category;
  },
};

export const quizService = {
  async getRandomQuestions(categoryId: string): Promise<Question[]> {
    const response = await api.get<ApiResponse<{ questions: Question[] }>>(
      `/quiz/questions/random/${categoryId}`
    );
    return response.data.data!.questions;
  },

  async submitQuiz(submission: QuizSubmission): Promise<{
    attempt: Attempt;
    careerRecommendation: CareerInfo | null;
    passed: boolean;
  }> {
    const response = await api.post<ApiResponse>("/quiz/submit", submission);
    return response.data.data!;
  },

  async getLeaderboard(categoryId: string, limit: number = 10): Promise<any[]> {
    const response = await api.get<ApiResponse<{ leaderboard: any[] }>>(
      `/quiz/leaderboard/${categoryId}?limit=${limit}`
    );
    return response.data.data!.leaderboard;
  },

  async getUserAttempts(
    page: number = 1,
    limit: number = 10
  ): Promise<{
    attempts: Attempt[];
    pagination: any;
  }> {
    const response = await api.get<ApiResponse>(
      `/quiz/attempts?page=${page}&limit=${limit}`
    );
    return response.data.data!;
  },

  async getAttemptDetail(attemptId: string): Promise<Attempt> {
    const response = await api.get<ApiResponse<{ attempt: Attempt }>>(
      `/quiz/attempts/${attemptId}`
    );
    return response.data.data!.attempt;
  },
};

// Add to the existing careerService object
export const careerService = {
  async getByCategory(categoryId: string): Promise<CareerInfo> {
    const response = await api.get<ApiResponse<{ careerInfo: CareerInfo }>>(
      `/career/${categoryId}`
    );
    return response.data.data!.careerInfo;
  },

  async create(data: any): Promise<CareerInfo> {
    const response = await api.post<ApiResponse<{ careerInfo: CareerInfo }>>(
      "/career",
      data
    );
    return response.data.data!.careerInfo;
  },

  async update(id: string, data: any): Promise<CareerInfo> {
    const response = await api.put<ApiResponse<{ careerInfo: CareerInfo }>>(
      `/career/${id}`,
      data
    );
    return response.data.data!.careerInfo;
  },

  async delete(id: string): Promise<void> {
    await api.delete(`/career/${id}`);
  },
};

// Add category service methods for admin
// Extended category service (admin operations)
export const categoryService = {
  ...baseCategoryService,
  async create(data: any): Promise<Category> {
    const response = await api.post<ApiResponse<{ category: Category }>>(
      "/categories",
      data
    );
    return response.data.data!.category;
  },
  async update(id: string, data: any): Promise<Category> {
    const response = await api.put<ApiResponse<{ category: Category }>>(
      `/categories/${id}`,
      data
    );
    return response.data.data!.category;
  },
  async delete(id: string): Promise<void> {
    await api.delete(`/categories/${id}`);
  },
};

export default api;
