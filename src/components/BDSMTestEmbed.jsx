import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ExternalLink, 
  CheckCircle, 
  AlertCircle, 
  Copy, 
  Download,
  RefreshCw,
  Eye,
  EyeOff,
  Settings,
  Heart,
  Shield,
  Zap,
  X
} from 'lucide-react';
import { bdsmTestQuestions, calculateBDSMResults, generateTestId } from '../utils/bdsmTestQuestions';
import apiService from '../utils/api';

const BDSMTestEmbed = ({ onTestComplete, onTestIdGenerated, beginnerMode = false }) => {
  const [testMode, setTestMode] = useState('custom'); // 'iframe', 'custom', 'hybrid'
  const [testId, setTestId] = useState('');
  const [isTestActive, setIsTestActive] = useState(false);
  const [testResults, setTestResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showSettings, setShowSettings] = useState(false);
  const [customQuestions, setCustomQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [showExplanations, setShowExplanations] = useState(true);
  const iframeRef = useRef(null);

  // Beginner-friendly explanations for BDSM concepts
  const getQuestionExplanation = (question) => {
    const explanations = {
      'dominance': 'This refers to taking control in a consensual way. Think of it like being the leader in a dance - you guide the movements, but both partners are participating willingly.',
      'submission': 'This means willingly giving control to your partner. It\'s about trust, letting go, and finding pleasure in following someone else\'s lead.',
      'sadism': 'This is about enjoying giving sensations (not necessarily pain). It\'s about control, power, and seeing your partner\'s reactions to what you do.',
      'masochism': 'This is about enjoying receiving sensations. It\'s about surrender, trust, and finding pleasure in the sensations your partner provides.',
      'switch': 'This means you enjoy both taking control and giving control. You can be dominant in some situations and submissive in others.',
      'vanilla': 'This refers to "regular" or "traditional" sexual activities without BDSM elements. There\'s nothing wrong with enjoying vanilla activities!',
      'bondage': 'This involves restraining someone (or being restrained) using ropes, cuffs, or other tools. It\'s about restriction and the feeling of being controlled.',
      'impact': 'This involves hitting or striking someone (or being hit) in a consensual way. It can range from light spanking to more intense play.',
      'roleplay': 'This involves acting out different roles or scenarios. It could be teacher/student, boss/employee, or any other dynamic that interests you.',
      'fetish': 'This is a strong attraction to a specific object, body part, or activity. It could be feet, leather, latex, or many other things.'
    }
    
    // Try to match based on question text
    const questionText = question.question.toLowerCase()
    for (const [key, explanation] of Object.entries(explanations)) {
      if (questionText.includes(key)) {
        return explanation
      }
    }
    
    return 'This question helps us understand your preferences and interests. There are no right or wrong answers - just be honest about what appeals to you.'
  }

  useEffect(() => {
    setCustomQuestions(bdsmTestQuestions);
  }, []);

  const handleIframeMessage = (event) => {
    // Listen for messages from the iframe (if BDSMtest.org supports it)
    if (event.origin !== 'https://bdsmtest.org') return;
    
    if (event.data.type === 'testComplete') {
      setTestId(event.data.testId);
      setTestResults(event.data.results);
      setIsTestActive(false);
      onTestComplete?.(event.data.results);
      onTestIdGenerated?.(event.data.testId);
    }
  };

  useEffect(() => {
    window.addEventListener('message', handleIframeMessage);
    return () => window.removeEventListener('message', handleIframeMessage);
  }, []);

  const startCustomTest = () => {
    setTestMode('custom');
    setIsTestActive(true);
    setCurrentQuestion(0);
    setAnswers({});
    setError('');
  };

  const handleAnswer = (questionId, value) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: value
    }));
    
    // Auto-advance to next question after a short delay
    setTimeout(() => {
      if (currentQuestion < customQuestions.length - 1) {
        setCurrentQuestion(prev => prev + 1);
      } else {
        completeCustomTest();
      }
    }, 300); // 300ms delay for visual feedback
  };

  const nextQuestion = () => {
    if (currentQuestion < customQuestions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    } else {
      completeCustomTest();
    }
  };

  const prevQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1);
    }
  };

  const completeCustomTest = async () => {
    setLoading(true);
    try {
      // Calculate results based on answers using the comprehensive algorithm
      const results = calculateBDSMResults(answers);
      const generatedTestId = generateTestId();
      
      // Save the test results to the database
      try {
        const profileName = `Custom Test ${new Date().toLocaleDateString()}`;
        await apiService.saveCustomTestResults(generatedTestId, results, profileName, '🧠');
        console.log('✅ Custom test results saved to database');
      } catch (dbError) {
        console.error('⚠️ Failed to save test results to database:', dbError);
        // Continue anyway - the test results are still available in the UI
      }
      
      setTestId(generatedTestId);
      setTestResults(results);
      setIsTestActive(false);
      
      onTestComplete?.(results);
      onTestIdGenerated?.(generatedTestId);
    } catch (error) {
      setError('Failed to complete test. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const copyTestId = async () => {
    try {
      await navigator.clipboard.writeText(testId);
    } catch (error) {
      console.error('Failed to copy test ID:', error);
    }
  };

  const resetTest = () => {
    setTestId('');
    setTestResults(null);
    setIsTestActive(false);
    setCurrentQuestion(0);
    setAnswers({});
    setError('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-pink-900 to-purple-800 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold text-white mb-4 flex items-center justify-center gap-3">
            <Heart className="w-10 h-10 text-pink-400" />
            BDSM Compatibility Test
          </h1>
          <p className="text-purple-200 text-lg max-w-2xl mx-auto">
            Discover your BDSM preferences and find compatible partners
          </p>
          
          {/* Beginner Mode Info */}
          {beginnerMode && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6 max-w-3xl mx-auto bg-green-500/20 border border-green-400/30 rounded-xl p-4"
            >
              <div className="flex items-center gap-2 mb-2">
                <Shield className="w-5 h-5 text-green-400" />
                <h3 className="text-green-200 font-semibold">Beginner-Friendly Test</h3>
              </div>
              <p className="text-green-100 text-sm">
                You're in beginner mode! This test includes helpful explanations for BDSM terms and concepts. 
                Take your time, and remember - there are no wrong answers. This is about discovering what you enjoy.
              </p>
            </motion.div>
          )}
        </motion.div>

        {/* Test Mode Selector */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white/10 backdrop-blur-sm rounded-xl p-6 mb-8 border border-white/20"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-white">Choose Test Mode</h2>
            <button
              onClick={() => setShowSettings(!showSettings)}
              className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
            >
              <Settings className="w-5 h-5 text-purple-300" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* iFrame Mode */}
            <button
              onClick={() => setTestMode('iframe')}
              className={`p-4 rounded-lg border-2 transition-all ${
                testMode === 'iframe'
                  ? 'border-pink-500 bg-pink-500/20'
                  : 'border-white/20 bg-white/5 hover:bg-white/10'
              }`}
            >
              <ExternalLink className="w-8 h-8 text-pink-400 mx-auto mb-2" />
              <h3 className="font-semibold text-white mb-1">Original Test</h3>
              <p className="text-sm text-purple-200">
                Link to official BDSMtest.org (may not embed)
              </p>
            </button>

            {/* Custom Mode */}
            <button
              onClick={() => setTestMode('custom')}
              className={`p-4 rounded-lg border-2 transition-all ${
                testMode === 'custom'
                  ? 'border-pink-500 bg-pink-500/20'
                  : 'border-white/20 bg-white/5 hover:bg-white/10'
              }`}
            >
              <Shield className="w-8 h-8 text-pink-400 mx-auto mb-2" />
              <h3 className="font-semibold text-white mb-1">Custom Test</h3>
              <p className="text-sm text-purple-200">
                Take our integrated test with instant results
              </p>
            </button>

            {/* Hybrid Mode */}
            <button
              onClick={() => setTestMode('hybrid')}
              className={`p-4 rounded-lg border-2 transition-all ${
                testMode === 'hybrid'
                  ? 'border-pink-500 bg-pink-500/20'
                  : 'border-white/20 bg-white/5 hover:bg-white/10'
              }`}
            >
              <Zap className="w-8 h-8 text-pink-400 mx-auto mb-2" />
              <h3 className="font-semibold text-white mb-1">Hybrid Mode</h3>
              <p className="text-sm text-purple-200">
                Best of both worlds with enhanced features
              </p>
            </button>
          </div>
        </motion.div>

        {/* Test Results Display */}
        {testResults && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/10 backdrop-blur-sm rounded-xl p-6 mb-8 border border-white/20"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                <CheckCircle className="w-6 h-6 text-green-400" />
                Test Complete!
              </h2>
              <div className="flex gap-2">
                <button
                  onClick={copyTestId}
                  className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
                  title="Copy Test ID"
                >
                  <Copy className="w-4 h-4 text-purple-300" />
                </button>
                <button
                  onClick={resetTest}
                  className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
                  title="Take Test Again"
                >
                  <RefreshCw className="w-4 h-4 text-purple-300" />
                </button>
              </div>
            </div>

            <div className="mb-4">
              <p className="text-purple-200">
                <strong>Test ID:</strong> <span className="text-white font-mono">{testId}</span>
              </p>
            </div>

            <div className="space-y-3">
              {testResults.slice(0, 5).map((result, index) => (
                <div key={result.role} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                  <span className="text-white font-medium">{result.role}</span>
                  <div className="flex items-center gap-3">
                    <div className="w-32 bg-gray-700 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${
                          result.color === 'green' ? 'bg-green-500' :
                          result.color === 'yellow' ? 'bg-yellow-500' :
                          result.color === 'orange' ? 'bg-orange-500' : 'bg-red-500'
                        }`}
                        style={{ width: `${result.percentage}%` }}
                      />
                    </div>
                    <span className="text-white font-semibold w-12 text-right">
                      {result.percentage}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Custom Test Mode - Start Button */}
        {testMode === 'custom' && !isTestActive && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20"
          >
            <div className="text-center mb-6">
              <h2 className="text-xl font-semibold text-white mb-2">
                Custom BDSM Test
              </h2>
              <p className="text-purple-200 mb-4">
                Take our integrated test with {bdsmTestQuestions.length} comprehensive questions
              </p>
              <div className="mb-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm text-purple-300">
                  <div>• Dominance/Submission</div>
                  <div>• Sadism/Masochism</div>
                  <div>• Bondage & Rope Play</div>
                  <div>• Brat/Brat Tamer</div>
                  <div>• Voyeur/Exhibitionist</div>
                  <div>• Daddy/Mommy/Little</div>
                  <div>• Pet Play</div>
                  <div>• And more...</div>
                </div>
              </div>
              <button
                onClick={startCustomTest}
                className="px-8 py-4 bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white rounded-lg font-medium transition-all text-lg"
              >
                Start Custom Test
              </button>
            </div>
          </motion.div>
        )}

        {/* Hybrid Test Mode - Start Button */}
        {testMode === 'hybrid' && !isTestActive && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20"
          >
            <div className="text-center mb-6">
              <h2 className="text-xl font-semibold text-white mb-2">
                Hybrid BDSM Test
              </h2>
              <p className="text-purple-200 mb-4">
                Best of both worlds - enhanced features with official test
              </p>
              <div className="space-y-3">
                <button
                  onClick={startCustomTest}
                  className="w-full px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white rounded-lg font-medium transition-all"
                >
                  Start Enhanced Custom Test
                </button>
                <div className="text-sm text-purple-300">or</div>
                <button
                  onClick={() => setIsTestActive(true)}
                  className="w-full px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-lg font-medium transition-all border border-white/20"
                >
                  Use Original Test
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* Test Interface */}
        <AnimatePresence>
          {isTestActive && testMode === 'custom' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20"
            >
              <div className="mb-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold text-white">
                    Question {currentQuestion + 1} of {customQuestions.length}
                  </h2>
                  <div className="w-32 bg-gray-700 rounded-full h-2">
                    <div
                      className="bg-pink-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${((currentQuestion + 1) / customQuestions.length) * 100}%` }}
                    />
                  </div>
                </div>

                <h3 className="text-lg text-white mb-2">
                  {customQuestions[currentQuestion]?.question}
                </h3>
                
                {/* Beginner Mode Explanation */}
                {beginnerMode && showExplanations && (
                  <div className="mb-4 p-3 bg-blue-500/20 border border-blue-400/30 rounded-lg">
                    <div className="flex items-start gap-2">
                      <Shield className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-blue-200 text-sm font-medium mb-1">💡 Beginner Tip:</p>
                        <p className="text-blue-100 text-sm">
                          {getQuestionExplanation(customQuestions[currentQuestion])}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
                
                <p className="text-sm text-purple-300 mb-6">
                  Click any answer to automatically continue to the next question
                </p>

                <div className="space-y-3">
                  {customQuestions[currentQuestion]?.options.map((option, index) => (
                    <button
                      key={index}
                      onClick={() => handleAnswer(customQuestions[currentQuestion].id, option.value)}
                      className={`w-full p-4 rounded-lg border-2 transition-all text-left group ${
                        answers[customQuestions[currentQuestion].id] === option.value
                          ? 'border-pink-500 bg-pink-500/20'
                          : 'border-white/20 bg-white/5 hover:bg-white/10 hover:border-pink-400/50'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-white">{option.text}</span>
                        <span className="text-xs text-purple-300 opacity-0 group-hover:opacity-100 transition-opacity">
                          Click to continue →
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex justify-between items-center">
                <button
                  onClick={prevQuestion}
                  disabled={currentQuestion === 0}
                  className="px-6 py-2 bg-white/10 hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
                >
                  ← Previous Question
                </button>
                
                {/* Beginner Mode Controls */}
                {beginnerMode && (
                  <button
                    onClick={() => setShowExplanations(!showExplanations)}
                    className={`px-4 py-2 rounded-lg transition-colors flex items-center gap-2 ${
                      showExplanations 
                        ? 'bg-blue-500/30 text-blue-200 border border-blue-400/50' 
                        : 'bg-white/10 text-purple-200 border border-purple-300/30 hover:bg-white/20'
                    }`}
                  >
                    <Shield className="w-4 h-4" />
                    {showExplanations ? 'Hide Tips' : 'Show Tips'}
                  </button>
                )}
              </div>
              
              {/* Beginner Safety Reminder */}
              {beginnerMode && (
                <div className="mt-4 p-3 bg-yellow-500/20 border border-yellow-400/30 rounded-lg">
                  <div className="flex items-center gap-2 mb-1">
                    <Shield className="w-4 h-4 text-yellow-400" />
                    <span className="text-yellow-200 font-medium text-sm">Safety Reminder</span>
                  </div>
                  <p className="text-yellow-100 text-xs">
                    Remember: BDSM is about consent, communication, and mutual pleasure. 
                    Only engage in activities that both partners are comfortable with and excited about.
                  </p>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* iFrame Mode */}
        {testMode === 'iframe' && !isTestActive && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20"
          >
            <div className="text-center mb-6">
              <h2 className="text-xl font-semibold text-white mb-2">
                Official BDSM Test
              </h2>
              <p className="text-purple-200 mb-4">
                Take the original test on BDSMtest.org
              </p>
              
              {/* Warning about iframe limitations */}
              <div className="mb-6 p-4 bg-yellow-500/20 border border-yellow-500/30 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <AlertCircle className="w-5 h-5 text-yellow-400" />
                  <span className="text-yellow-200 font-medium">Important Note</span>
                </div>
                <p className="text-yellow-200 text-sm">
                  BDSMtest.org may not load in an embedded window due to security restrictions. 
                  If the embedded test doesn't work, please use the "Open in New Tab" option below.
                </p>
              </div>
              
              <div className="space-y-3">
                <button
                  onClick={() => setIsTestActive(true)}
                  className="px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white rounded-lg font-medium transition-all"
                >
                  Try Embedded Test
                </button>
                <div className="text-sm text-purple-300">or</div>
                <a
                  href="https://bdsmtest.org"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-lg font-medium transition-all border border-white/20"
                >
                  <ExternalLink className="w-4 h-4" />
                  Open in New Tab (Recommended)
                </a>
                <div className="text-sm text-purple-300">or</div>
                <button
                  onClick={() => setTestMode('custom')}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white rounded-lg font-medium transition-all"
                >
                  <Shield className="w-4 h-4" />
                  Use Our Custom Test Instead
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* iFrame Display - Show immediate fallback */}
        {testMode === 'iframe' && isTestActive && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-white">Original BDSM Test</h2>
              <button
                onClick={() => setIsTestActive(false)}
                className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-purple-300" />
              </button>
            </div>
            
            <div className="text-center p-8">
              <div className="mb-6">
                <div className="w-20 h-20 bg-gradient-to-br from-pink-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Heart className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">Original BDSM Test</h3>
                <p className="text-purple-200 mb-6">
                  The original BDSM test from BDSMtest.org works best in a new tab due to security restrictions.
                </p>
              </div>
              
              <div className="space-y-4">
                <a
                  href="https://bdsmtest.org"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white rounded-lg font-medium transition-all text-lg shadow-lg hover:shadow-xl"
                >
                  <ExternalLink className="w-6 h-6" />
                  Open Original BDSM Test
                </a>
                
                <div className="text-sm text-purple-300">or</div>
                
                <button
                  onClick={() => {
                    setTestMode('custom');
                    setIsTestActive(false);
                  }}
                  className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-lg font-medium transition-all text-lg shadow-lg hover:shadow-xl"
                >
                  <Shield className="w-6 h-6" />
                  Use Our Custom Test
                </button>
              </div>
              
              <div className="mt-8 p-4 bg-blue-500/20 border border-blue-500/30 rounded-lg">
                <p className="text-blue-200 text-sm">
                  <strong>After taking the test:</strong> Copy your Test ID from BDSMtest.org and paste it in the main app to view your results.
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Error Display */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-500/20 border border-red-500/30 rounded-lg p-4 mb-6"
          >
            <div className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-red-400" />
              <span className="text-red-200">{error}</span>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default BDSMTestEmbed;
