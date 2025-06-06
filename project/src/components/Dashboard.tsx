import React, { useState, useEffect } from 'react';
import { LogOut, Users, BarChart3, Clock, Settings } from 'lucide-react';
import { Employee, Task, BreakSession, TimeEntry } from '../types';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { useGoogleAuth } from '../hooks/useGoogleAuth';
import { getTodayKey, calculateWorkTime, formatTime, formatDuration } from '../utils/timeUtils';
import EmployeeCard from './EmployeeCard';
import TaskManager from './TaskManager';
import BreakTracker from './BreakTracker';

interface DashboardProps {
  currentEmployee: Employee;
  onLogout: () => void;
}

export default function Dashboard({ currentEmployee, onLogout }: DashboardProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'tasks' | 'breaks'>('overview');
  const [allEmployees, setAllEmployees] = useLocalStorage<Employee[]>('employees', []);
  const [tasks, setTasks] = useLocalStorage<Task[]>('tasks', []);
  const [breaks, setBreaks] = useLocalStorage<BreakSession[]>('breaks', []);
  const [timeEntries, setTimeEntries] = useLocalStorage<TimeEntry[]>('timeEntries', []);
  const [isOnBreak, setIsOnBreak] = useState(false);
  const [currentBreak, setCurrentBreak] = useState<BreakSession | null>(null);
  
  const { signOut } = useGoogleAuth();

  const todayKey = getTodayKey();
  const currentTasks = tasks.filter(task => task.employeeId === currentEmployee.id);
  const currentBreaks = breaks.filter(breakSession => breakSession.employeeId === currentEmployee.id);

  useEffect(() => {
    // Update current employee in employees list
    setAllEmployees(prev => {
      const updated = prev.filter(emp => emp.id !== currentEmployee.id);
      return [...updated, currentEmployee];
    });

    // Check if there's an active break
    const activeBreak = breaks.find(
      b => b.employeeId === currentEmployee.id && !b.endTime
    );
    if (activeBreak) {
      setIsOnBreak(true);
      setCurrentBreak(activeBreak);
    }
  }, [currentEmployee, breaks]);

  const handleLogout = () => {
    // End any active break
    if (currentBreak) {
      handleEndBreak();
    }

    // Update time entry
    const now = new Date();
    const workTime = calculateWorkTime(currentEmployee.loginTime!, now);
    
    setTimeEntries(prev => {
      const existing = prev.find(entry => 
        entry.employeeId === currentEmployee.id && entry.date === todayKey
      );
      
      if (existing) {
        return prev.map(entry =>
          entry.employeeId === currentEmployee.id && entry.date === todayKey
            ? { ...entry, clockOut: now, totalWork: workTime }
            : entry
        );
      } else {
        return [...prev, {
          employeeId: currentEmployee.id,
          date: todayKey,
          clockIn: currentEmployee.loginTime!,
          clockOut: now,
          totalWork: workTime,
          totalBreak: currentBreaks.reduce((total, b) => total + (b.duration || 0), 0),
          tasks: currentTasks,
          breaks: currentBreaks
        }];
      }
    });

    // Sign out from Google if using Google auth
    if (currentEmployee.isGoogleAuth) {
      signOut();
    }

    onLogout();
  };

  const handleAddTask = (taskData: Omit<Task, 'id' | 'createdAt'>) => {
    const newTask: Task = {
      ...taskData,
      id: Date.now().toString(),
      employeeId: currentEmployee.id,
      createdAt: new Date()
    };
    setTasks(prev => [...prev, newTask]);
  };

  const handleUpdateTask = (taskId: string, updates: Partial<Task>) => {
    setTasks(prev =>
      prev.map(task =>
        task.id === taskId
          ? { ...task, ...updates, ...(updates.status === 'completed' ? { completedAt: new Date() } : {}) }
          : task
      )
    );
  };

  const handleDeleteTask = (taskId: string) => {
    setTasks(prev => prev.filter(task => task.id !== taskId));
  };

  const handleStartBreak = (type: 'short' | 'lunch' | 'other') => {
    const newBreak: BreakSession = {
      id: Date.now().toString(),
      employeeId: currentEmployee.id,
      startTime: new Date(),
      type
    };
    setBreaks(prev => [...prev, newBreak]);
    setCurrentBreak(newBreak);
    setIsOnBreak(true);
  };

  const handleEndBreak = () => {
    if (currentBreak) {
      const now = new Date();
      const duration = Math.floor((now.getTime() - currentBreak.startTime.getTime()) / (1000 * 60));
      
      setBreaks(prev =>
        prev.map(breakSession =>
          breakSession.id === currentBreak.id
            ? { ...breakSession, endTime: now, duration }
            : breakSession
        )
      );
      setCurrentBreak(null);
      setIsOnBreak(false);
    }
  };

  const workTime = currentEmployee.loginTime 
    ? Math.floor((Date.now() - currentEmployee.loginTime.getTime()) / (1000 * 60))
    : 0;

  const completedTasks = currentTasks.filter(task => task.status === 'completed').length;
  const totalBreakTime = currentBreaks.reduce((total, b) => total + (b.duration || 0), 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-lg border-b border-white/20 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <div className="flex items-center">
                <Clock className="w-8 h-8 text-blue-600 mr-3" />
                <h1 className="text-xl font-bold text-gray-900">TimeTracker Pro</h1>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <img
                  src={currentEmployee.avatar}
                  alt={currentEmployee.name}
                  className="w-8 h-8 rounded-full object-cover"
                />
                <span className="font-medium">{currentEmployee.name}</span>
                {currentEmployee.isGoogleAuth && (
                  <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
                    Google
                  </span>
                )}
                <span className="text-gray-400">•</span>
                <span>Since {formatTime(currentEmployee.loginTime!)}</span>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Clock Out
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-white/20 p-6">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-xl">
                <Clock className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">Work Time</p>
                <p className="text-2xl font-semibold text-gray-900">{formatDuration(workTime)}</p>
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-white/20 p-6">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-xl">
                <BarChart3 className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">Tasks Done</p>
                <p className="text-2xl font-semibold text-gray-900">{completedTasks}</p>
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-white/20 p-6">
            <div className="flex items-center">
              <div className="p-3 bg-orange-100 rounded-xl">
                <Settings className="w-6 h-6 text-orange-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">Break Time</p>
                <p className="text-2xl font-semibold text-gray-900">{formatDuration(totalBreakTime)}</p>
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-white/20 p-6">
            <div className="flex items-center">
              <div className="p-3 bg-purple-100 rounded-xl">
                <Users className="w-6 h-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">Status</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {isOnBreak ? 'On Break' : 'Active'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex space-x-1 bg-white/50 backdrop-blur-sm rounded-xl p-1 mb-6 border border-white/20">
          {[
            { id: 'overview', label: 'Overview', icon: Users },
            { id: 'tasks', label: 'Tasks', icon: BarChart3 },
            { id: 'breaks', label: 'Breaks', icon: Settings }
          ].map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
                  activeTab === tab.id
                    ? 'bg-white text-blue-600 shadow-md'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-white/50'
                }`}
              >
                <Icon className="w-4 h-4 mr-2" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Tab Content */}
        <div className="space-y-6">
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {allEmployees.map(employee => (
                <EmployeeCard
                  key={employee.id}
                  employee={employee}
                  tasks={tasks.filter(task => task.employeeId === employee.id)}
                  onBreak={breaks.some(b => b.employeeId === employee.id && !b.endTime)}
                />
              ))}
            </div>
          )}

          {activeTab === 'tasks' && (
            <TaskManager
              tasks={currentTasks}
              onAddTask={handleAddTask}
              onUpdateTask={handleUpdateTask}
              onDeleteTask={handleDeleteTask}
            />
          )}

          {activeTab === 'breaks' && (
            <BreakTracker
              breaks={currentBreaks}
              onStartBreak={handleStartBreak}
              onEndBreak={handleEndBreak}
              isOnBreak={isOnBreak}
              currentBreak={currentBreak}
            />
          )}
        </div>
      </div>
    </div>
  );
}