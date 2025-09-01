import React, { useState, useEffect } from 'react'

const DebugApp = () => {
  const [status, setStatus] = useState('Initializing...')
  const [data, setData] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    const testApp = async () => {
      try {
        setStatus('Testing data loading...')
        
        // Test 1: Basic fetch
        const response = await fetch('/all-sex-positions.json')
        setStatus(`Response status: ${response.status}`)
        
        if (response.ok) {
          const jsonData = await response.json()
          setData(jsonData)
          setStatus(`✅ Loaded ${jsonData.length} categories`)
        } else {
          setError(`Failed to load: ${response.status}`)
          setStatus('❌ Failed to load data')
        }
      } catch (err) {
        setError(err.message)
        setStatus('❌ Error occurred')
      }
    }

    testApp()
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-pink-900 to-indigo-900 text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-center">Debug App</h1>
        
        <div className="bg-white/10 rounded-lg p-6 mb-6">
          <h2 className="text-2xl font-bold mb-4">Status</h2>
          <p className="text-xl">{status}</p>
        </div>

        {error && (
          <div className="bg-red-500/20 rounded-lg p-6 mb-6 border border-red-500">
            <h2 className="text-2xl font-bold mb-4 text-red-300">Error</h2>
            <p className="text-red-200">{error}</p>
          </div>
        )}

        {data && (
          <div className="bg-green-500/20 rounded-lg p-6 mb-6 border border-green-500">
            <h2 className="text-2xl font-bold mb-4 text-green-300">Data Loaded</h2>
            <p className="text-green-200">Categories: {data.length}</p>
            <p className="text-green-200">Total positions: {data.reduce((sum, cat) => sum + (cat.positions?.length || 0), 0)}</p>
          </div>
        )}

        <div className="bg-white/10 rounded-lg p-6">
          <h2 className="text-2xl font-bold mb-4">Test Actions</h2>
          <button 
            onClick={() => window.location.reload()} 
            className="px-4 py-2 bg-pink-500 hover:bg-pink-600 rounded-lg mr-4"
          >
            Reload Page
          </button>
          <button 
            onClick={() => window.location.href = '/'} 
            className="px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded-lg"
          >
            Go to Main App
          </button>
        </div>
      </div>
    </div>
  )
}

export default DebugApp
