export type Role = 'ADMIN' | 'LEARNER';
export type FormationLevel = 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
export type FormationStatus = 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
export type CompetenceLevel = 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | 'EXPERT';

export interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  role: Role;
  phone?: string;
  enabled: boolean;
  createdAt: string;
  updatedAt?: string;
}

export interface AuthResponse {
  token: string;
  type: string;
  userId: number;
  email: string;
  firstName: string;
  lastName: string;
  role: Role;
}

export interface Profil {
  id?: number;
  bio?: string;
  address?: string;
  dateOfBirth?: string;
  profilePicture?: string;
  userId: number;
  userFirstName: string;
  userLastName: string;
  userEmail: string;
}

export interface Competence {
  id: number;
  name: string;
  description?: string;
  level: CompetenceLevel;
  learnerId: number;
}

export interface Category {
  id: number;
  name: string;
  description?: string;
  createdAt?: string;
  formationCount?: number;
}

export interface Formation {
  id: number;
  title: string;
  description: string;
  objectives?: string;
  price: number;
  durationHours: number;
  level: FormationLevel;
  status: FormationStatus;
  createdAt: string;
  updatedAt?: string;
  category: Category;
  chapitreCount: number;
}

export interface Chapitre {
  id: number;
  title: string;
  description?: string;
  content?: string;
  chapterOrder: number;
  formationId: number;
  formationTitle?: string;
}

export interface DashboardStats {
  totalUsers: number;
  totalLearners: number;
  totalFormations: number;
  totalCategories: number;
  publishedFormations: number;
  draftFormations: number;
  archivedFormations: number;
}

export interface Page<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
}
