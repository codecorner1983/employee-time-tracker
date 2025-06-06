export interface Employee {
  id: string;
  name: string;
  email: string;
  department: string;
  avatar: string;
  isLoggedIn: boolean;
  loginTime?: Date;
  logoutTime?: Date;
  totalWorkTime: number;
  totalBreakTime: number;
  googleId?: string;
  isGoogleAuth?: boolean;
}

export interface Task {
  id: string;
  employeeId: string;
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
  status: 'pending' | 'in-progress' | 'completed';
  createdAt: Date;
  completedAt?: Date;
  estimatedTime: number;
  actualTime?: number;
}

export interface BreakSession {
  id: string;
  employeeId: string;
  startTime: Date;
  endTime?: Date;
  type: 'short' | 'lunch' | 'other';
  duration?: number;
}

export interface TimeEntry {
  employeeId: string;
  date: string;
  clockIn: Date;
  clockOut?: Date;
  totalWork: number;
  totalBreak: number;
  tasks: Task[];
  breaks: BreakSession[];
}

export interface GoogleUser {
  sub: string;
  name: string;
  given_name: string;
  family_name: string;
  picture: string;
  email: string;
  email_verified: boolean;
  locale: string;
}

declare global {
  interface Window {
    google: {
      accounts: {
        id: {
          initialize: (config: any) => void;
          renderButton: (element: HTMLElement, config: any) => void;
          prompt: () => void;
          disableAutoSelect: () => void;
        };
      };
    };
  }
}