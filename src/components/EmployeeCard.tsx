import React from 'react';
import { Clock, Coffee, CheckCircle2, AlertCircle } from 'lucide-react';
import { Employee, Task } from '../types';
import { formatTime, getTimeElapsed } from '../utils/timeUtils';

interface EmployeeCardProps {
  employee: Employee;
  tasks: Task[];
  onBreak?: boolean;
}

export default function EmployeeCard({ employee, tasks, onBreak }: EmployeeCardProps) {
  const completedTasks = tasks.filter(task => task.status === 'completed').length;
  const pendingTasks = tasks.filter(task => task.status !== 'completed').length;

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-white/20 p-6 hover:shadow-xl transition-all duration-300">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center">
          <div className="relative">
            <img
              src={employee.avatar}
              alt={employee.name}
              className="w-12 h-12 rounded-xl object-cover"
            />
            <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${
              onBreak ? 'bg-orange-500' : employee.isLoggedIn ? 'bg-green-500' : 'bg-gray-400'
            }`} />
          </div>
          <div className="ml-3">
            <h3 className="font-semibold text-gray-900">{employee.name}</h3>
            <p className="text-sm text-gray-500">{employee.department}</p>
          </div>
        </div>
        <div className={`px-3 py-1 rounded-full text-xs font-medium ${
          onBreak 
            ? 'bg-orange-100 text-orange-700'
            : employee.isLoggedIn 
              ? 'bg-green-100 text-green-700'
              : 'bg-gray-100 text-gray-700'
        }`}>
          {onBreak ? 'On Break' : employee.isLoggedIn ? 'Active' : 'Offline'}
        </div>
      </div>

      {employee.loginTime && (
        <div className="space-y-3">
          <div className="flex items-center text-sm text-gray-600">
            <Clock className="w-4 h-4 mr-2" />
            <span>Clocked in: {formatTime(employee.loginTime)}</span>
            <span className="ml-auto font-medium">
              {getTimeElapsed(employee.loginTime)}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="flex items-center">
              <CheckCircle2 className="w-4 h-4 text-green-500 mr-2" />
              <span className="text-sm text-gray-600">
                {completedTasks} completed
              </span>
            </div>
            <div className="flex items-center">
              <AlertCircle className="w-4 h-4 text-orange-500 mr-2" />
              <span className="text-sm text-gray-600">
                {pendingTasks} pending
              </span>
            </div>
          </div>

          {onBreak && (
            <div className="flex items-center text-sm text-orange-600 bg-orange-50 rounded-lg p-2">
              <Coffee className="w-4 h-4 mr-2" />
              <span>Currently on break</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}