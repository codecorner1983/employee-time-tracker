import React, { useState } from 'react';
import { LogIn, Users, Clock, ArrowRight } from 'lucide-react';
import { Employee } from '../types';
import GoogleSignIn from './GoogleSignIn';

interface LoginProps {
  onLogin: (employee: Employee) => void;
}

const mockEmployees: Omit<Employee, 'isLoggedIn' | 'totalWorkTime' | 'totalBreakTime'>[] = [
  {
    id: '1',
    name: 'Sarah Johnson',
    email: 'sarah.johnson@company.com',
    department: 'Engineering',
    avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?w=150&h=150&fit=crop&crop=face'
  },
  {
    id: '2',
    name: 'Michael Chen',
    email: 'michael.chen@company.com',
    department: 'Design',
    avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?w=150&h=150&fit=crop&crop=face'
  },
  {
    id: '3',
    name: 'Emily Rodriguez',
    email: 'emily.rodriguez@company.com',
    department: 'Marketing',
    avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?w=150&h=150&fit=crop&crop=face'
  },
  {
    id: '4',
    name: 'David Park',
    email: 'david.park@company.com',
    department: 'Sales',
    avatar: 'https://images.pexels.com/photos/2379005/pexels-photo-2379005.jpeg?w=150&h=150&fit=crop&crop=face'
  }
];

export default function Login({ onLogin }: LoginProps) {
  const [selectedEmployee, setSelectedEmployee] = useState<string>('');
  const [loginMethod, setLoginMethod] = useState<'google' | 'manual'>('google');

  const handleManualLogin = () => {
    const employee = mockEmployees.find(emp => emp.id === selectedEmployee);
    if (employee) {
      onLogin({
        ...employee,
        isLoggedIn: true,
        loginTime: new Date(),
        totalWorkTime: 0,
        totalBreakTime: 0,
        isGoogleAuth: false
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl border border-white/20 p-8">
          <div className="text-center mb-8">
            <div className="mx-auto w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center mb-4">
              <Clock className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">TimeTracker Pro</h1>
            <p className="text-gray-600">Employee Time & Task Management</p>
          </div>

          <div className="space-y-6">
            {/* Login Method Toggle */}
            <div className="flex bg-gray-100 rounded-xl p-1">
              <button
                onClick={() => setLoginMethod('google')}
                className={`flex-1 py-2 px-4 rounded-lg font-medium transition-all duration-200 ${
                  loginMethod === 'google'
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Google Account
              </button>
              <button
                onClick={() => setLoginMethod('manual')}
                className={`flex-1 py-2 px-4 rounded-lg font-medium transition-all duration-200 ${
                  loginMethod === 'manual'
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Demo Login
              </button>
            </div>

            {loginMethod === 'google' ? (
              <div className="space-y-4">
                <div className="text-center">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Sign in with Google
                  </h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Use your company Google account to access the time tracker
                  </p>
                </div>
                
                <GoogleSignIn onLogin={onLogin} />
                
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <ArrowRight className="w-5 h-5 text-blue-600 mt-0.5" />
                    </div>
                    <div className="ml-3">
                      <h4 className="text-sm font-medium text-blue-900">
                        Setup Required
                      </h4>
                      <p className="text-sm text-blue-700 mt-1">
                        To enable Google Sign-In, add your Google Client ID to the environment variables.
                        Create a <code className="bg-blue-100 px-1 rounded">.env</code> file with:
                      </p>
                      <code className="block bg-blue-100 text-blue-800 text-xs mt-2 p-2 rounded">
                        VITE_GOOGLE_CLIENT_ID=your-google-client-id
                      </code>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Select Demo Employee
                  </label>
                  <div className="space-y-2">
                    {mockEmployees.map((employee) => (
                      <label
                        key={employee.id}
                        className={`flex items-center p-3 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
                          selectedEmployee === employee.id
                            ? 'border-blue-500 bg-blue-50 shadow-md'
                            : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        <input
                          type="radio"
                          name="employee"
                          value={employee.id}
                          checked={selectedEmployee === employee.id}
                          onChange={(e) => setSelectedEmployee(e.target.value)}
                          className="sr-only"
                        />
                        <img
                          src={employee.avatar}
                          alt={employee.name}
                          className="w-10 h-10 rounded-full object-cover mr-3"
                        />
                        <div className="flex-1">
                          <div className="font-medium text-gray-900">{employee.name}</div>
                          <div className="text-sm text-gray-500">{employee.department}</div>
                        </div>
                        <Users className="w-4 h-4 text-gray-400" />
                      </label>
                    ))}
                  </div>
                </div>

                <button
                  onClick={handleManualLogin}
                  disabled={!selectedEmployee}
                  className={`w-full py-3 px-4 rounded-xl font-medium transition-all duration-200 flex items-center justify-center ${
                    selectedEmployee
                      ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 shadow-lg hover:shadow-xl'
                      : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  <LogIn className="w-5 h-5 mr-2" />
                  Clock In
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}