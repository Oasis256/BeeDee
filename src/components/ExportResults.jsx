import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Download, FileText, FileSpreadsheet, FileJson, Share2, Mail, MessageCircle, Copy, Check } from 'lucide-react'
import apiService from '../utils/api'

const ExportResults = ({ results }) => {
  const [exportFormat, setExportFormat] = useState('pdf')
  const [exporting, setExporting] = useState(false)
  const [shareMethod, setShareMethod] = useState('link')
  const [copied, setCopied] = useState(false)
  const [shareUrl, setShareUrl] = useState('')

  const exportFormats = [
    { key: 'pdf', label: 'PDF Report', icon: <FileText className="w-4 h-4" />, description: 'Professional report with charts' },
    { key: 'csv', label: 'CSV Data', icon: <FileSpreadsheet className="w-4 h-4" />, description: 'Raw data for analysis' },
    { key: 'json', label: 'JSON Export', icon: <FileJson className="w-4 h-4" />, description: 'Structured data format' }
  ]

  const shareMethods = [
    { key: 'link', label: 'Share Link', icon: <Share2 className="w-4 h-4" />, description: 'Generate shareable URL' },
    { key: 'email', label: 'Email', icon: <Mail className="w-4 h-4" />, description: 'Send via email' },
    { key: 'social', label: 'Social Media', icon: <MessageCircle className="w-4 h-4" />, description: 'Share on platforms' }
  ]

  const generateExportData = () => {
    const exportData = {
      timestamp: new Date().toISOString(),
      participants: results.map(result => ({
        id: result.id,
        name: result.testName || result.id,
        emoji: result.selectedEmoji,
        results: result.results
      })),
      summary: {
        totalParticipants: results.length,
        averageScores: calculateAverageScores(),
        topRoles: getTopRoles(),
        compatibilityScore: calculateCompatibilityScore()
      }
    }

    return exportData
  }

  const calculateAverageScores = () => {
    const roleScores = {}
    const roleCounts = {}

    results.forEach(result => {
      result.results.forEach(role => {
        if (!roleScores[role.role]) {
          roleScores[role.role] = 0
          roleCounts[role.role] = 0
        }
        roleScores[role.role] += role.percentage
        roleCounts[role.role] += 1
      })
    })

    const averages = {}
    Object.keys(roleScores).forEach(role => {
      averages[role] = Math.round(roleScores[role] / roleCounts[role])
    })

    return averages
  }

  const getTopRoles = () => {
    const averages = calculateAverageScores()
    return Object.entries(averages)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([role, score]) => ({ role, score }))
  }

  const calculateCompatibilityScore = () => {
    if (results.length < 2) return null

    const sharedInterests = []
    const allRoles = new Set()
    
    results.forEach(result => {
      result.results.forEach(r => allRoles.add(r.role))
    })

    allRoles.forEach(role => {
      const scores = results.map(result => {
        const roleResult = result.results.find(r => r.role === role)
        return roleResult ? roleResult.percentage : 0
      })
      
      const avgScore = scores.reduce((a, b) => a + b, 0) / scores.length
      if (avgScore >= 50) {
        sharedInterests.push({ role, averageScore: Math.round(avgScore) })
      }
    })

    const totalCompatibility = sharedInterests.reduce((sum, interest) => sum + interest.averageScore, 0)
    return Math.round(totalCompatibility / Math.max(sharedInterests.length, 1))
  }

  const exportToPDF = async () => {
    setExporting(true)
    try {
      const exportData = generateExportData()
      
      // Create PDF content (simplified - in real app, use a PDF library)
      const pdfContent = `
        BDSM Compatibility Report
        Generated: ${new Date().toLocaleDateString()}
        
        Participants: ${results.length}
        ${results.map(r => `${r.selectedEmoji} ${r.testName || r.id}`).join(', ')}
        
        Top Roles:
        ${getTopRoles().map(r => `${r.role}: ${r.score}%`).join('\n')}
        
        Compatibility Score: ${calculateCompatibilityScore()}%
        
        Detailed Results:
        ${results.map(result => `
          ${result.selectedEmoji} ${result.testName || result.id}
          ${result.results.slice(0, 5).map(r => `  ${r.role}: ${r.percentage}%`).join('\n')}
        `).join('\n')}
      `

      // Create and download file
      const blob = new Blob([pdfContent], { type: 'text/plain' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `bdsm-compatibility-${Date.now()}.txt`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)

      // Save export to database
      const testIds = results.map(r => r.id)
      await apiService.saveExport(testIds, 'pdf', `bdsm-compatibility-${Date.now()}.txt`)
      
    } catch (error) {
      console.error('Error exporting PDF:', error)
    } finally {
      setExporting(false)
    }
  }

  const exportToCSV = async () => {
    setExporting(true)
    try {
      const exportData = generateExportData()
      
      // Create CSV content
      const headers = ['Participant', 'Emoji', 'Role', 'Percentage']
      const rows = []
      
      results.forEach(result => {
        result.results.forEach(role => {
          rows.push([
            result.testName || result.id,
            result.selectedEmoji,
            role.role,
            role.percentage
          ])
        })
      })

      const csvContent = [
        headers.join(','),
        ...rows.map(row => row.join(','))
      ].join('\n')

      // Create and download file
      const blob = new Blob([csvContent], { type: 'text/csv' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `bdsm-compatibility-${Date.now()}.csv`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)

      // Save export to database
      const testIds = results.map(r => r.id)
      await apiService.saveExport(testIds, 'csv', `bdsm-compatibility-${Date.now()}.csv`)
      
    } catch (error) {
      console.error('Error exporting CSV:', error)
    } finally {
      setExporting(false)
    }
  }

  const exportToJSON = async () => {
    setExporting(true)
    try {
      const exportData = generateExportData()
      
      // Create and download file
      const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `bdsm-compatibility-${Date.now()}.json`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)

      // Save export to database
      const testIds = results.map(r => r.id)
      await apiService.saveExport(testIds, 'json', `bdsm-compatibility-${Date.now()}.json`)
      
    } catch (error) {
      console.error('Error exporting JSON:', error)
    } finally {
      setExporting(false)
    }
  }

  const handleExport = async () => {
    switch (exportFormat) {
      case 'pdf':
        await exportToPDF()
        break
      case 'csv':
        await exportToCSV()
        break
      case 'json':
        await exportToJSON()
        break
      default:
        break
    }
  }

  const generateShareLink = async () => {
    try {
      const exportData = generateExportData()
      const encodedData = btoa(JSON.stringify(exportData))
      const shareUrl = `${window.location.origin}?share=${encodedData}`
      setShareUrl(shareUrl)
      
      // Save share to database
      const testIds = results.map(r => r.id)
      await apiService.saveShare(testIds, 'link', shareUrl)
      
    } catch (error) {
      console.error('Error generating share link:', error)
    }
  }

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      console.error('Error copying to clipboard:', error)
    }
  }

  const handleShare = async () => {
    switch (shareMethod) {
      case 'link':
        await generateShareLink()
        break
      case 'email':
        const subject = encodeURIComponent('BDSM Compatibility Results')
        const body = encodeURIComponent(`Check out our compatibility results: ${window.location.href}`)
        window.open(`mailto:?subject=${subject}&body=${body}`)
        break
      case 'social':
        const text = encodeURIComponent('Check out our BDSM compatibility results!')
        const url = encodeURIComponent(window.location.href)
        window.open(`https://twitter.com/intent/tweet?text=${text}&url=${url}`)
        break
      default:
        break
    }
  }

  return (
    <div className="space-y-6">
      {/* Export Section */}
      <div className="glass-effect rounded-2xl p-6">
        <div className="flex items-center gap-2 mb-6">
          <Download className="w-6 h-6 text-purple-300" />
          <h2 className="text-2xl font-bold text-white">Export Results</h2>
        </div>

        {/* Format Selection */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-purple-200 mb-3">Choose Export Format</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {exportFormats.map(({ key, label, icon, description }) => (
              <button
                key={key}
                onClick={() => setExportFormat(key)}
                className={`p-4 rounded-lg border-2 transition-all ${
                  exportFormat === key
                    ? 'border-purple-400 bg-purple-500/20 text-white'
                    : 'border-purple-300/30 bg-white/5 text-purple-200 hover:bg-white/10'
                }`}
              >
                <div className="flex items-center gap-2 mb-2">
                  {icon}
                  <span className="font-medium">{label}</span>
                </div>
                <p className="text-sm opacity-80">{description}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Export Button */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleExport}
          disabled={exporting}
          className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold py-4 px-8 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {exporting ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              Exporting...
            </>
          ) : (
            <>
              <Download className="w-5 h-5" />
              Export {exportFormat.toUpperCase()}
            </>
          )}
        </motion.button>
      </div>

      {/* Share Section */}
      <div className="glass-effect rounded-2xl p-6">
        <div className="flex items-center gap-2 mb-6">
          <Share2 className="w-6 h-6 text-purple-300" />
          <h2 className="text-2xl font-bold text-white">Share Results</h2>
        </div>

        {/* Share Method Selection */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-purple-200 mb-3">Choose Share Method</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {shareMethods.map(({ key, label, icon, description }) => (
              <button
                key={key}
                onClick={() => setShareMethod(key)}
                className={`p-4 rounded-lg border-2 transition-all ${
                  shareMethod === key
                    ? 'border-purple-400 bg-purple-500/20 text-white'
                    : 'border-purple-300/30 bg-white/5 text-purple-200 hover:bg-white/10'
                }`}
              >
                <div className="flex items-center gap-2 mb-2">
                  {icon}
                  <span className="font-medium">{label}</span>
                </div>
                <p className="text-sm opacity-80">{description}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Share Link Display */}
        {shareMethod === 'link' && shareUrl && (
          <div className="mb-4">
            <label className="block text-purple-200 font-medium mb-2">Share Link</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={shareUrl}
                readOnly
                className="flex-1 px-4 py-2 bg-white/10 border border-purple-300/30 rounded-lg text-white text-sm"
              />
              <button
                onClick={copyToClipboard}
                className="px-4 py-2 bg-purple-500/20 hover:bg-purple-500/30 text-purple-200 rounded-lg transition-colors flex items-center gap-2"
              >
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                {copied ? 'Copied!' : 'Copy'}
              </button>
            </div>
          </div>
        )}

        {/* Share Button */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleShare}
          className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-bold py-4 px-8 rounded-lg transition-all duration-200 flex items-center justify-center gap-2"
        >
          <Share2 className="w-5 h-5" />
          Share via {shareMethod.charAt(0).toUpperCase() + shareMethod.slice(1)}
        </motion.button>
      </div>

      {/* Summary Section */}
      <div className="glass-effect rounded-2xl p-6">
        <h3 className="text-lg font-semibold text-purple-200 mb-4">Export Summary</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-purple-500/20 rounded-lg">
            <div className="text-2xl font-bold text-white">{results.length}</div>
            <div className="text-purple-200 text-sm">Participants</div>
          </div>
          <div className="text-center p-4 bg-green-500/20 rounded-lg">
            <div className="text-2xl font-bold text-white">{calculateCompatibilityScore() || 'N/A'}%</div>
            <div className="text-green-200 text-sm">Compatibility</div>
          </div>
          <div className="text-center p-4 bg-blue-500/20 rounded-lg">
            <div className="text-2xl font-bold text-white">{getTopRoles().length}</div>
            <div className="text-blue-200 text-sm">Top Roles</div>
          </div>
          <div className="text-center p-4 bg-yellow-500/20 rounded-lg">
            <div className="text-2xl font-bold text-white">{new Date().toLocaleDateString()}</div>
            <div className="text-yellow-200 text-sm">Generated</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ExportResults
