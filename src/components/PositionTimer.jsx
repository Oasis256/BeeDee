import React, { useState, useEffect } from 'react'
import { Timer, Play, Pause, RotateCcw, X } from 'lucide-react'

const PositionTimer = ({ onClose }) => {
  const [time, setTime] = useState(0)
  const [isRunning, setIsRunning] = useState(false)
  const [targetTime, setTargetTime] = useState(300) // 5 minutes default

  useEffect(() => {
    let interval = null
    if (isRunning) {
      interval = setInterval(() => {
        setTime(time => time + 1)
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [isRunning])

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const toggleTimer = () => {
    setIsRunning(!isRunning)
  }

  const resetTimer = () => {
    setTime(0)
    setIsRunning(false)
  }

  const setQuickTime = (minutes) => {
    setTargetTime(minutes * 60)
    setTime(0)
    setIsRunning(false)
  }

  const progress = (time / targetTime) * 100

  return (
    <div className="fixed bottom-4 right-4 bg-white rounded-lg shadow-lg border border-gray-200 p-4 w-80 z-50">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Timer className="w-5 h-5 text-pink-500" />
          <h3 className="font-semibold text-gray-900">Position Timer</h3>
        </div>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Timer Display */}
      <div className="text-center mb-4">
        <div className="text-3xl font-bold text-gray-900 mb-2">
          {formatTime(time)}
        </div>
        <div className="text-sm text-gray-500">
          Target: {formatTime(targetTime)}
        </div>
        
        {/* Progress Bar */}
        <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
          <div 
            className="bg-pink-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${Math.min(progress, 100)}%` }}
          ></div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center gap-2 mb-4">
        <button
          onClick={toggleTimer}
          className={`p-2 rounded-full ${isRunning ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'} text-white transition-colors`}
        >
          {isRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
        </button>
        <button
          onClick={resetTimer}
          className="p-2 rounded-full bg-gray-500 hover:bg-gray-600 text-white transition-colors"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>

      {/* Quick Time Presets */}
      <div className="grid grid-cols-3 gap-2">
        <button
          onClick={() => setQuickTime(2)}
          className="px-3 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded transition-colors"
        >
          2 min
        </button>
        <button
          onClick={() => setQuickTime(5)}
          className="px-3 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded transition-colors"
        >
          5 min
        </button>
        <button
          onClick={() => setQuickTime(10)}
          className="px-3 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded transition-colors"
        >
          10 min
        </button>
      </div>
    </div>
  )
}

export default PositionTimer
