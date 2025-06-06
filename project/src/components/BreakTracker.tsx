import React, { useState } from 'react';
import { Coffee, Play, Pause, Clock } from 'lucide-react';
import { BreakSession } from '../types';
import { formatTime, formatDuration } from '../utils/timeUtils';

interface BreakTrackerProps {
  breaks: BreakSession[];
  onStartBreak: (type: 'short' | 'lunch' | 'other') => void;
  onEndBreak: () => void;
  isOnBreak: boolean;
  currentBreak?: BreakSession;
}

export default function BreakTracker({ 
  breaks, 
  onStartBreak, 
  onEndBreak, 
  isOnBreak, 
  currentBreak 
}: BreakTrackerProps) {
  const [selectedBreakType, setSelectedBreakType] = useState<'short' | 'lunch' | 'other'>('short');

  const totalBreakTime = breaks.reduce((total, breakSession) => {
    return total + (breakSession.duration || 0);
  }, 0);

  const getBreakTypeColor = (type: string) => {
    switch (type) {
      case 'lunch': return 'bg-green-100 text-green-700';
      case 'short': return 'bg-blue-100 text-blue-700';
      case 'other': return 'bg-purple-100 text-purple-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getBreakTypeName = (type: string) => {
    switch (type) {
      case 'lunch': return 'Lunch Break';
      case 'short': return 'Short Break';
      case 'other': return 'Other';
      default: return type;
    }
  };

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-white/20 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900 flex items-center">
          <Coffee className="w-5 h-5 mr-2" />
          Break Tracker
        </h2>
        <div className="text-sm text-gray-600">
          Total: {formatDuration(totalBreakTime)}
        </div>
      </div>

      {!isOnBreak ? (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Break Type
            </label>
            <select
              value={selectedBreakType}
              onChange={(e) => setSelectedBreakType(e.target.value as 'short' | 'lunch' | 'other')}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="short">Short Break (15 min)</option>
              <option value="lunch">Lunch Break (60 min)</option>
              <option value="other">Other</option>
            </select>
          </div>

          <button
            onClick={() => onStartBreak(selectedBreakType)}
            className="w-full flex items-center justify-center px-4 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-lg hover:from-emerald-700 hover:to-teal-700 transition-all duration-200"
          >
            <Play className="w-5 h-5 mr-2" />
            Start Break
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-orange-900">
                  {getBreakTypeName(currentBreak?.type || 'short')}
                </h3>
                <p className="text-sm text-orange-700">
                  Started at {currentBreak && formatTime(currentBreak.startTime)}
                </p>
              </div>
              <div className="text-right">
                <div className="text-lg font-semibold text-orange-900">
                  {currentBreak && formatDuration(Math.floor((Date.now() - currentBreak.startTime.getTime()) / (1000 * 60)))}
                </div>
                <div className="text-sm text-orange-700">elapsed</div>
              </div>
            </div>
          </div>

          <button
            onClick={onEndBreak}
            className="w-full flex items-center justify-center px-4 py-3 bg-gradient-to-r from-red-600 to-pink-600 text-white rounded-lg hover:from-red-700 hover:to-pink-700 transition-all duration-200"
          >
            <Pause className="w-5 h-5 mr-2" />
            End Break
          </button>
        </div>
      )}

      {breaks.length > 0 && (
        <div className="mt-6">
          <h3 className="text-sm font-medium text-gray-700 mb-3">Today's Breaks</h3>
          <div className="space-y-2 max-h-40 overflow-y-auto">
            {breaks.map((breakSession) => (
              <div
                key={breakSession.id}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center">
                  <Clock className="w-4 h-4 text-gray-400 mr-2" />
                  <div>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getBreakTypeColor(breakSession.type)}`}>
                      {getBreakTypeName(breakSession.type)}
                    </span>
                    <div className="text-xs text-gray-500 mt-1">
                      {formatTime(breakSession.startTime)}
                      {breakSession.endTime && ` - ${formatTime(breakSession.endTime)}`}
                    </div>
                  </div>
                </div>
                <div className="text-sm font-medium text-gray-900">
                  {breakSession.duration ? formatDuration(breakSession.duration) : 'Active'}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}