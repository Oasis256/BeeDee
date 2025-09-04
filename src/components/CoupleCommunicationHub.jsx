import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  MessageCircle, 
  Heart, 
  Shield, 
  Calendar, 
  Plus, 
  Trash2, 
  CheckCircle, 
  AlertTriangle,
  Users,
  Star,
  BookOpen,
  Edit3,
  Volume2,
  VolumeX,
  Eye,
  EyeOff,
  X
} from 'lucide-react';
import apiService from '../utils/api';

const CoupleCommunicationHub = ({ coupleProfile, onProfileUpdate }) => {
  const [checkIns, setCheckIns] = useState([]);
  const [boundaries, setBoundaries] = useState([]);
  const [eroticStories, setEroticStories] = useState([]);
  const [selectedTab, setSelectedTab] = useState('checkins');
  const [showCheckInForm, setShowCheckInForm] = useState(false);
  const [showBoundaryForm, setShowBoundaryForm] = useState(false);
  const [showStoryForm, setShowStoryForm] = useState(false);
  const [editingStory, setEditingStory] = useState(null);
  const [isReading, setIsReading] = useState(false);
  const [currentReadingId, setCurrentReadingId] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  const [speechError, setSpeechError] = useState(null);
  const [showSpeechSettings, setShowSpeechSettings] = useState(false);
  const [speechSettings, setSpeechSettings] = useState(() => {
    // Load settings from localStorage
    const saved = localStorage.getItem('speechSettings');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return {
          rate: parsed.rate || 0.9,
          pitch: parsed.pitch || 1.0,
          volume: parsed.volume || 0.8,
          voice: null // Will be set when voices load
        };
      } catch (e) {
        console.error('Error loading speech settings:', e);
      }
    }
    return {
      rate: 0.9,
      pitch: 1.0,
      volume: 0.8,
      voice: null
    };
  });
  const [availableVoices, setAvailableVoices] = useState([]);
  const [immersionMode, setImmersionMode] = useState(false);

  const [checkInForm, setCheckInForm] = useState({
    date: new Date().toISOString().split('T')[0],
    mood: 'good',
    relationshipSatisfaction: 8,
    bdsmSatisfaction: 8,
    notes: ''
  });

  const [boundaryForm, setBoundaryForm] = useState({
    category: 'physical',
    description: '',
    hardLimit: false,
    softLimit: false,
    notes: ''
  });

  const [storyForm, setStoryForm] = useState({
    title: '',
    content: '',
    mood: 'romantic',
    tags: [],
    isPrivate: true
  });

  useEffect(() => {
    console.log('CoupleCommunicationHub received coupleProfile:', coupleProfile);
    if (coupleProfile?.id) {
      console.log('Loading data for couple profile ID:', coupleProfile.id);
      loadCheckIns();
      loadBoundaries();
      loadEroticStories();
    } else {
      console.log('No couple profile ID available');
    }
  }, [coupleProfile]);

  const loadCheckIns = async () => {
    if (!coupleProfile?.id) {
      console.log('No couple profile ID available for loading check-ins');
      return;
    }
    console.log('Loading check-ins for couple profile:', coupleProfile.id);
    try {
      const response = await apiService.getCheckIns(coupleProfile.id);
      console.log('Check-ins response:', response);
      if (response.success) {
        setCheckIns(response.checkIns || []);
        console.log('Loaded check-ins:', response.checkIns);
      }
    } catch (error) {
      console.error('Error loading check-ins:', error);
    }
  };

  const loadBoundaries = async () => {
    if (!coupleProfile?.id) return;
    try {
      const response = await apiService.getBoundaries(coupleProfile.id);
      if (response.success) {
        setBoundaries(response.boundaries || []);
      }
    } catch (error) {
      console.error('Error loading boundaries:', error);
    }
  };

  const loadEroticStories = async () => {
    if (!coupleProfile?.id) return;
    try {
      const response = await apiService.getEroticStories(coupleProfile.id);
      if (response.success) {
        setEroticStories(response.stories || []);
      }
    } catch (error) {
      console.error('Error loading erotic stories:', error);
    }
  };

  const handleCheckIn = async () => {
    if (!coupleProfile?.id) {
      console.log('No couple profile ID available for saving check-in');
      setSpeechError('Please select a couple profile first');
      setTimeout(() => setSpeechError(null), 5000);
      return;
    }
    
    console.log('Saving check-in for couple profile:', coupleProfile.id, checkInForm);
    
    try {
      const response = await apiService.createCheckIn(
        coupleProfile.id,
        checkInForm.date,
        checkInForm.mood,
        checkInForm.relationshipSatisfaction,
        checkInForm.bdsmSatisfaction,
        checkInForm.notes
      );
      
      console.log('Check-in save response:', response);
      
      if (response.success) {
        await loadCheckIns(); // Reload from database
        setCheckInForm({
          date: new Date().toISOString().split('T')[0],
          mood: 'good',
          relationshipSatisfaction: 8,
          bdsmSatisfaction: 8,
          notes: ''
        });
        setShowCheckInForm(false);
      }
    } catch (error) {
      console.error('Error creating check-in:', error);
      setSpeechError('Failed to save check-in. Please try again.');
      setTimeout(() => setSpeechError(null), 5000);
    }
  };

  const handleBoundary = async () => {
    if (!coupleProfile?.id) {
      setSpeechError('Please select a couple profile first');
      setTimeout(() => setSpeechError(null), 5000);
      return;
    }
    
    try {
      const response = await apiService.createBoundary(
        coupleProfile.id,
        boundaryForm.category,
        boundaryForm.description,
        boundaryForm.hardLimit,
        boundaryForm.softLimit,
        boundaryForm.notes
      );
      
      if (response.success) {
        await loadBoundaries(); // Reload from database
        setBoundaryForm({
          category: 'physical',
          description: '',
          hardLimit: false,
          softLimit: false,
          notes: ''
        });
        setShowBoundaryForm(false);
      }
    } catch (error) {
      console.error('Error creating boundary:', error);
      setSpeechError('Failed to save boundary. Please try again.');
      setTimeout(() => setSpeechError(null), 5000);
    }
  };

  const deleteItem = async (type, id) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      try {
        if (type === 'checkin') {
          await apiService.deleteCheckIn(id);
          await loadCheckIns(); // Reload from database
        } else if (type === 'boundary') {
          await apiService.deleteBoundary(id);
          await loadBoundaries(); // Reload from database
        } else if (type === 'story') {
          await apiService.deleteEroticStory(id);
          await loadEroticStories(); // Reload from database
        }
      } catch (error) {
        console.error('Error deleting item:', error);
        setSpeechError('Failed to delete item. Please try again.');
        setTimeout(() => setSpeechError(null), 5000);
      }
    }
  };

  const handleProfileUpdate = (updatedProfile) => {
    if (onProfileUpdate) {
      onProfileUpdate(updatedProfile);
    }
  };

  const getMoodIcon = (mood) => {
    switch (mood) {
      case 'excellent': return '😍';
      case 'good': return '😊';
      case 'okay': return '😐';
      case 'bad': return '😔';
      case 'terrible': return '😢';
      default: return '😊';
    }
  };

  const getMoodColor = (mood) => {
    switch (mood) {
      case 'excellent': return 'text-green-400';
      case 'good': return 'text-blue-400';
      case 'okay': return 'text-yellow-400';
      case 'bad': return 'text-orange-400';
      case 'terrible': return 'text-red-400';
      default: return 'text-blue-400';
    }
  };

  const getBoundaryColor = (boundary) => {
    if (boundary.hard_limit) return 'border-red-500/30 bg-red-500/10';
    if (boundary.soft_limit) return 'border-orange-500/30 bg-orange-500/10';
    return 'border-green-500/30 bg-green-500/10';
  };

  const getBoundaryIcon = (boundary) => {
    if (boundary.hard_limit) return <Shield className="w-5 h-5 text-red-400" />;
    if (boundary.soft_limit) return <AlertTriangle className="w-5 h-5 text-orange-400" />;
    return <CheckCircle className="w-5 h-5 text-green-400" />;
  };

  const handleStorySubmit = async () => {
    if (!coupleProfile?.id) {
      setSpeechError('Please select a couple profile first');
      setTimeout(() => setSpeechError(null), 5000);
      return;
    }
    
    try {
      if (editingStory) {
        // Update existing story
        const response = await apiService.updateEroticStory(
          editingStory.id,
          storyForm.title,
          storyForm.content,
          storyForm.mood,
          storyForm.tags,
          storyForm.isPrivate
        );
        
        if (response.success) {
          await loadEroticStories();
          setEditingStory(null);
        }
      } else {
        // Create new story
        const response = await apiService.createEroticStory(
          coupleProfile.id,
          coupleProfile.partner_ids[0], // Use first partner as author for now
          storyForm.title,
          storyForm.content,
          storyForm.mood,
          storyForm.tags,
          storyForm.isPrivate
        );
        
        if (response.success) {
          await loadEroticStories();
        }
      }
      
      // Reset form
      setStoryForm({
        title: '',
        content: '',
        mood: 'romantic',
        tags: [],
        isPrivate: true
      });
      setShowStoryForm(false);
    } catch (error) {
      console.error('Error saving story:', error);
      setSpeechError('Failed to save story. Please try again.');
      setTimeout(() => setSpeechError(null), 5000);
    }
  };

  const startEditingStory = (story) => {
    setEditingStory(story);
    setStoryForm({
      title: story.title,
      content: story.content,
      mood: story.mood,
      tags: story.tags || [],
      isPrivate: story.is_private
    });
    setShowStoryForm(true);
  };

  const cancelStoryEdit = () => {
    setEditingStory(null);
    setStoryForm({
      title: '',
      content: '',
      mood: 'romantic',
      tags: [],
      isPrivate: true
    });
    setShowStoryForm(false);
  };

  const addTag = (tag) => {
    if (tag && !storyForm.tags.includes(tag)) {
      setStoryForm({ ...storyForm, tags: [...storyForm.tags, tag] });
    }
  };

  const removeTag = (tagToRemove) => {
    setStoryForm({ ...storyForm, tags: storyForm.tags.filter(tag => tag !== tagToRemove) });
  };

  // Read Aloud Functions
  const speak = (text, id) => {
    // Check if speech synthesis is available
    if ('speechSynthesis' in window && window.speechSynthesis) {
      try {
        // Stop any current reading
        if (isReading) {
          window.speechSynthesis.cancel();
        }

        // Clear any previous errors
        setSpeechError(null);

        const utterance = new SpeechSynthesisUtterance(text);
        
        // Configure speech settings from user preferences
        utterance.rate = speechSettings.rate;
        utterance.pitch = speechSettings.pitch;
        utterance.volume = speechSettings.volume;
        
        // Use selected voice
        if (speechSettings.voice) {
          utterance.voice = speechSettings.voice;
        }
        
        // Start speaking immediately (mobile browsers often require immediate execution)
        window.speechSynthesis.speak(utterance);

        utterance.onstart = () => {
          setIsReading(true);
          setCurrentReadingId(id);
        };

        utterance.onend = () => {
          setIsReading(false);
          setCurrentReadingId(null);
        };

        utterance.onerror = (event) => {
          console.error('Speech synthesis error:', event);
          setIsReading(false);
          setCurrentReadingId(null);
          
          // Set error message for inline display
          if (event.error === 'not-allowed') {
            setSpeechError('Speech synthesis blocked. Please allow microphone access or try again.');
          } else if (event.error === 'network') {
            setSpeechError('Network error. Please check your connection and try again.');
          } else if (event.error === 'synthesis-failed') {
            setSpeechError('Speech synthesis failed. Please try again or use device TTS.');
          } else {
            setSpeechError('Error reading text aloud. Please try again.');
          }
          
          // Auto-clear error after 5 seconds
          setTimeout(() => setSpeechError(null), 5000);
        };

      } catch (error) {
        console.error('Speech synthesis error:', error);
        setSpeechError('Speech synthesis failed. Please try again or use device TTS.');
        setTimeout(() => setSpeechError(null), 5000);
      }
    } else {
      // Fallback for unsupported browsers
      showMobileFallback(text);
    }
  };

  const showMobileFallback = (text) => {
    // Create a modal with the text for mobile users
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4';
    modal.innerHTML = `
      <div class="bg-white rounded-lg p-6 max-w-md w-full max-h-96 overflow-y-auto">
        <h3 class="text-lg font-bold text-gray-800 mb-4">Text to Read</h3>
        <p class="text-gray-700 text-sm leading-relaxed mb-4">${text}</p>
        <div class="text-xs text-gray-500 mb-4">
          <p>💡 Mobile tip: Copy this text and use your device's built-in text-to-speech feature:</p>
          <p>• iOS: Select text → Speak</p>
          <p>• Android: Select text → Read aloud</p>
        </div>
        <div class="flex gap-2">
          <button onclick="navigator.clipboard.writeText('${text.replace(/'/g, "\\'")}').then(() => this.textContent = 'Copied!').catch(() => this.textContent = 'Failed')" class="flex-1 bg-blue-500 text-white py-2 rounded-lg">
            Copy Text
          </button>
          <button onclick="this.parentElement.parentElement.parentElement.remove()" class="flex-1 bg-pink-500 text-white py-2 rounded-lg">
            Close
          </button>
        </div>
      </div>
    `;
    document.body.appendChild(modal);
    
    // Auto-remove after 15 seconds
    setTimeout(() => {
      if (modal.parentElement) {
        modal.remove();
      }
    }, 15000);
  };

  const stopReading = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsReading(false);
      setCurrentReadingId(null);
    }
  };

  // Stop reading when component unmounts
  useEffect(() => {
    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  // Detect mobile device
  useEffect(() => {
    const checkMobile = () => {
      const userAgent = navigator.userAgent || navigator.userAgentData?.platform || navigator.vendor || window.opera;
      const isMobileDevice = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent.toLowerCase()) || 
                            window.innerWidth <= 768 || 
                            'ontouchstart' in window;
      setIsMobile(isMobileDevice);
    };
    
    checkMobile();
    
    // Also check on resize
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Load available voices
  useEffect(() => {
    const loadVoices = () => {
      if ('speechSynthesis' in window) {
        const voices = window.speechSynthesis.getVoices();
        setAvailableVoices(voices);
        
        // Set default voice if none selected
        if (!speechSettings.voice && voices.length > 0) {
          // Try to restore saved voice first
          const savedSettings = localStorage.getItem('speechSettings');
          let savedVoiceName = null;
          if (savedSettings) {
            try {
              const parsed = JSON.parse(savedSettings);
              savedVoiceName = parsed.voiceName;
            } catch (e) {
              console.error('Error parsing saved voice:', e);
            }
          }
          
          let selectedVoice = null;
          if (savedVoiceName) {
            selectedVoice = voices.find(voice => voice.name === savedVoiceName);
          }
          
          if (!selectedVoice) {
            // Fallback to preferred voice
            selectedVoice = voices.find(voice => 
              voice.name.includes('Google') || 
              voice.name.includes('Samantha') || 
              voice.name.includes('Alex') ||
              voice.name.includes('Microsoft') ||
              voice.name.includes('Siri') ||
              voice.name.includes('Cortana')
            ) || voices[0];
          }
          
          setSpeechSettings(prev => ({
            ...prev,
            voice: selectedVoice
          }));
        }
      }
    };

    // Load voices immediately if available
    loadVoices();
    
    // Also listen for voice changes
    if ('speechSynthesis' in window) {
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }

    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.onvoiceschanged = null;
      }
    };
  }, []);

  // Save speech settings to localStorage
  useEffect(() => {
    localStorage.setItem('speechSettings', JSON.stringify({
      rate: speechSettings.rate,
      pitch: speechSettings.pitch,
      volume: speechSettings.volume,
      voiceName: speechSettings.voice?.name
    }));
  }, [speechSettings]);

  // Handle Escape key for immersion mode
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape' && immersionMode) {
        setImmersionMode(false);
      }
    };

    if (immersionMode) {
      document.addEventListener('keydown', handleKeyDown);
      // Prevent body scroll when in immersion mode
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [immersionMode]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-indigo-900 text-white p-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4 flex items-center justify-center gap-3">
            <MessageCircle className="w-10 h-10 text-pink-400" />
            Couple Communication Hub
          </h1>
          <p className="text-purple-200 text-lg">
            Tools for regular check-ins and boundary setting
          </p>
          
          <div className="mt-4 flex gap-3 justify-center">
            <button
              onClick={() => setShowSpeechSettings(!showSpeechSettings)}
              className="bg-purple-500/20 hover:bg-purple-500/30 text-purple-200 px-4 py-2 rounded-lg border border-purple-500/30 transition-all flex items-center gap-2"
            >
              <Volume2 className="w-4 h-4" />
              Speech Settings
            </button>
            {eroticStories.length > 0 && (
              <button
                onClick={() => setImmersionMode(!immersionMode)}
                className={`px-4 py-2 rounded-lg border transition-all flex items-center gap-2 ${
                  immersionMode 
                    ? 'bg-pink-500/30 text-pink-200 border-pink-500/50' 
                    : 'bg-blue-500/20 hover:bg-blue-500/30 text-blue-200 border-blue-500/30'
                }`}
              >
                {immersionMode ? (
                  <>
                    <Eye className="w-4 h-4" />
                    Exit Immersion
                  </>
                ) : (
                  <>
                    <EyeOff className="w-4 h-4" />
                    Immersion Mode
                  </>
                )}
              </button>
            )}
          </div>
          
          {isReading && (
            <div className="mt-6 bg-pink-500/20 border border-pink-500/30 rounded-xl p-4 max-w-md mx-auto">
              <div className="flex items-center justify-center gap-3">
                <Volume2 className="w-5 h-5 text-pink-400 animate-pulse" />
                <div>
                  <h3 className="text-lg font-semibold text-white">
                    Reading Aloud
                  </h3>
                  <p className="text-sm text-pink-200">
                    Click the stop button to pause reading
                  </p>
                </div>
                <button
                  onClick={stopReading}
                  className="bg-pink-500 hover:bg-pink-600 text-white px-4 py-2 rounded-lg transition-all"
                >
                  Stop Reading
                </button>
              </div>
            </div>
          )}

          {speechError && (
            <div className="mt-4 bg-red-500/20 border border-red-500/30 rounded-xl p-4 max-w-md mx-auto">
              <div className="flex items-center gap-3">
                <VolumeX className="w-5 h-5 text-red-400" />
                <div className="flex-1">
                  <h3 className="text-sm font-semibold text-white">
                    Speech Error
                  </h3>
                  <p className="text-xs text-red-200">
                    {speechError}
                  </p>
                </div>
                <button
                  onClick={() => setSpeechError(null)}
                  className="text-red-400 hover:text-red-300"
                >
                  ×
                </button>
              </div>
            </div>
          )}

          {isMobile && (
            <div className="mt-4 bg-blue-500/20 border border-blue-500/30 rounded-xl p-4 max-w-md mx-auto">
              <div className="flex items-center gap-3">
                <Volume2 className="w-5 h-5 text-blue-400" />
                <div className="flex-1">
                  <h3 className="text-sm font-semibold text-white">
                    Mobile Read Aloud
                  </h3>
                  <p className="text-xs text-blue-200 mb-2">
                    If speech doesn't work, use your device's built-in text-to-speech: Select text → Speak/Read aloud
                  </p>
                  <button
                    onClick={() => speak('Hello! This is a test of the read aloud feature. If you can hear this, speech synthesis is working on your device.', 'mobile-test')}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-xs transition-all"
                  >
                    Test Speech
                  </button>
                </div>
              </div>
            </div>
          )}

          {showSpeechSettings && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6 max-w-2xl mx-auto"
            >
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Volume2 className="w-5 h-5 text-pink-400" />
                Speech Settings
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Voice Selection */}
                <div>
                  <label className="block text-sm font-medium text-purple-200 mb-2">Voice</label>
                  <select
                    value={speechSettings.voice?.name || ''}
                    onChange={(e) => {
                      const selectedVoice = availableVoices.find(voice => voice.name === e.target.value);
                      setSpeechSettings(prev => ({ ...prev, voice: selectedVoice }));
                    }}
                    className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-pink-500"
                    style={{ colorScheme: 'dark' }}
                  >
                    {availableVoices.map((voice, index) => (
                      <option key={index} value={voice.name} className="bg-purple-900 text-white">
                        {voice.name} ({voice.lang})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Speed/Rate */}
                <div>
                  <label className="block text-sm font-medium text-purple-200 mb-2">
                    Speed: {speechSettings.rate.toFixed(1)}x
                  </label>
                  <input
                    type="range"
                    min="0.5"
                    max="2.0"
                    step="0.1"
                    value={speechSettings.rate}
                    onChange={(e) => setSpeechSettings(prev => ({ ...prev, rate: parseFloat(e.target.value) }))}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-purple-300 mt-1">
                    <span>Slow</span>
                    <span>Fast</span>
                  </div>
                </div>

                {/* Pitch */}
                <div>
                  <label className="block text-sm font-medium text-purple-200 mb-2">
                    Pitch: {speechSettings.pitch.toFixed(1)}
                  </label>
                  <input
                    type="range"
                    min="0.5"
                    max="2.0"
                    step="0.1"
                    value={speechSettings.pitch}
                    onChange={(e) => setSpeechSettings(prev => ({ ...prev, pitch: parseFloat(e.target.value) }))}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-purple-300 mt-1">
                    <span>Low</span>
                    <span>High</span>
                  </div>
                </div>

                {/* Volume */}
                <div>
                  <label className="block text-sm font-medium text-purple-200 mb-2">
                    Volume: {Math.round(speechSettings.volume * 100)}%
                  </label>
                  <input
                    type="range"
                    min="0.1"
                    max="1.0"
                    step="0.1"
                    value={speechSettings.volume}
                    onChange={(e) => setSpeechSettings(prev => ({ ...prev, volume: parseFloat(e.target.value) }))}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-purple-300 mt-1">
                    <span>Quiet</span>
                    <span>Loud</span>
                  </div>
                </div>
              </div>

              {/* Test Button */}
              <div className="mt-6 text-center">
                <button
                  onClick={() => speak('This is a test of your speech settings. You can adjust the voice, speed, pitch, and volume to your preference.', 'settings-test')}
                  className="bg-pink-500 hover:bg-pink-600 text-white px-6 py-2 rounded-lg font-medium transition-all flex items-center gap-2 mx-auto"
                >
                  <Volume2 className="w-4 h-4" />
                  Test Settings
                </button>
              </div>

              {/* Preset Buttons */}
              <div className="mt-4 flex flex-wrap gap-2 justify-center">
                <button
                  onClick={() => setSpeechSettings({ rate: 0.8, pitch: 1.0, volume: 0.8, voice: speechSettings.voice })}
                  className="bg-blue-500/20 hover:bg-blue-500/30 text-blue-200 px-3 py-1 rounded text-sm border border-blue-500/30"
                >
                  Slow & Clear
                </button>
                <button
                  onClick={() => setSpeechSettings({ rate: 1.0, pitch: 1.0, volume: 0.8, voice: speechSettings.voice })}
                  className="bg-green-500/20 hover:bg-green-500/30 text-green-200 px-3 py-1 rounded text-sm border border-green-500/30"
                >
                  Normal
                </button>
                <button
                  onClick={() => setSpeechSettings({ rate: 1.2, pitch: 1.1, volume: 0.8, voice: speechSettings.voice })}
                  className="bg-orange-500/20 hover:bg-orange-500/30 text-orange-200 px-3 py-1 rounded text-sm border border-orange-500/30"
                >
                  Fast & Energetic
                </button>
                <button
                  onClick={() => setSpeechSettings({ rate: 0.9, pitch: 0.8, volume: 0.8, voice: speechSettings.voice })}
                  className="bg-purple-500/20 hover:bg-purple-500/30 text-purple-200 px-3 py-1 rounded text-sm border border-purple-500/30"
                >
                  Deep & Calm
                </button>
              </div>
            </motion.div>
          )}
        </div>

        {!coupleProfile && (
          <div className="glass-effect rounded-2xl p-6 max-w-md mx-auto mb-8">
            <div className="text-center">
              <Users className="w-12 h-12 text-purple-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-white mb-2">No Couple Profile Selected</h3>
              <p className="text-purple-200 mb-4">
                To use the communication hub, you need to create or select a couple profile first.
              </p>
              <div className="space-y-2 text-sm text-purple-300">
                <p>• Go to "Couple Profiles" tab to create a profile</p>
                <p>• Or select an existing profile</p>
                <p>• Then return here to use communication tools</p>
              </div>
            </div>
          </div>
        )}

        {coupleProfile && (
          <>
            <div className="mb-6">
              <div className="flex gap-2 overflow-x-auto pb-2">
                {[
                  { id: 'checkins', label: 'Check-ins', icon: Calendar, count: checkIns.length },
                  { id: 'boundaries', label: 'Boundaries', icon: Shield, count: boundaries.length },
                  { id: 'stories', label: 'Erotic Stories', icon: BookOpen, count: eroticStories.length }
                ].map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setSelectedTab(tab.id)}
                    className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors flex items-center gap-2 ${
                      selectedTab === tab.id
                        ? 'bg-pink-500 text-white'
                        : 'bg-white/10 text-purple-200 hover:bg-white/20'
                    }`}
                  >
                    <tab.icon className="w-4 h-4" />
                    {tab.label}
                    <span className="bg-white/20 px-2 py-1 rounded-full text-xs">
                      {tab.count}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <motion.div
              key={selectedTab}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
            >
              {selectedTab === 'checkins' && (
                <div>
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold">Relationship Check-ins</h2>
                    <button
                      onClick={() => setShowCheckInForm(true)}
                      className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2"
                    >
                      <Plus className="w-4 h-4" />
                      New Check-in
                    </button>
                  </div>

                  {showCheckInForm && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6 mb-8"
                    >
                      <h3 className="text-xl font-bold mb-4">Daily Check-in</h3>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <div>
                          <label className="block text-sm font-medium text-purple-200 mb-2">Date</label>
                          <input
                            type="date"
                            value={checkInForm.date}
                            onChange={(e) => setCheckInForm({...checkInForm, date: e.target.value})}
                            className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-pink-500"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-purple-200 mb-2">Mood</label>
                          <select
                            value={checkInForm.mood}
                            onChange={(e) => setCheckInForm({...checkInForm, mood: e.target.value})}
                            className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-pink-500"
                          >
                            <option value="excellent">Excellent 😍</option>
                            <option value="good">Good 😊</option>
                            <option value="okay">Okay 😐</option>
                            <option value="bad">Bad 😔</option>
                            <option value="terrible">Terrible 😢</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-purple-200 mb-2">
                            Relationship Satisfaction (1-10)
                          </label>
                          <input
                            type="range"
                            min="1"
                            max="10"
                            value={checkInForm.relationshipSatisfaction}
                            onChange={(e) => setCheckInForm({...checkInForm, relationshipSatisfaction: parseInt(e.target.value)})}
                            className="w-full"
                          />
                          <div className="text-center text-sm text-purple-200">
                            {checkInForm.relationshipSatisfaction}/10
                          </div>
                        </div>
                      </div>

                      <div className="mb-4">
                        <label className="block text-sm font-medium text-purple-200 mb-2">Notes</label>
                        <textarea
                          value={checkInForm.notes}
                          onChange={(e) => setCheckInForm({...checkInForm, notes: e.target.value})}
                          rows={3}
                          className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white placeholder-purple-200 focus:outline-none focus:ring-2 focus:ring-pink-500"
                          placeholder="How are you feeling about the relationship today?"
                        />
                      </div>

                      <div className="flex gap-4">
                        <button
                          onClick={handleCheckIn}
                          className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white px-6 py-2 rounded-lg font-medium transition-all"
                        >
                          Save Check-in
                        </button>
                        <button
                          onClick={() => setShowCheckInForm(false)}
                          className="bg-white/10 hover:bg-white/20 text-white px-6 py-2 rounded-lg font-medium transition-all"
                        >
                          Cancel
                        </button>
                      </div>
                    </motion.div>
                  )}

                  <div className="space-y-4">
                    {checkIns.length === 0 ? (
                      <div className="text-center py-12">
                        <Calendar className="w-16 h-16 mx-auto mb-4 text-purple-300" />
                        <h3 className="text-xl font-bold mb-2">No Check-ins Yet</h3>
                        <p className="text-purple-200 mb-4">
                          Start tracking your relationship health with daily check-ins
                        </p>
                        <button
                          onClick={() => setShowCheckInForm(true)}
                          className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white px-6 py-3 rounded-lg font-medium transition-all"
                        >
                          Start Your First Check-in
                        </button>
                      </div>
                    ) : (
                      checkIns.map((checkIn, index) => (
                        <motion.div
                          key={checkIn.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6"
                        >
                          <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-3">
                              <span className="text-2xl">{getMoodIcon(checkIn.mood)}</span>
                              <div>
                                <h4 className="text-lg font-semibold">
                                  {new Date(checkIn.date).toLocaleDateString()}
                                </h4>
                                <p className={`text-sm ${getMoodColor(checkIn.mood)} capitalize`}>
                                  {checkIn.mood} mood
                                </p>
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <button
                                onClick={() => {
                                  const textToRead = `Check-in for ${new Date(checkIn.date).toLocaleDateString()}. Mood: ${checkIn.mood}. Relationship satisfaction: ${checkIn.relationship_satisfaction} out of 10. BDSM satisfaction: ${checkIn.bdsm_satisfaction} out of 10. ${checkIn.notes ? `Notes: ${checkIn.notes}` : ''}`;
                                  speak(textToRead, `checkin-${checkIn.id}`);
                                }}
                                className={`p-2 transition-colors ${
                                  currentReadingId === `checkin-${checkIn.id}` 
                                    ? 'text-pink-400' 
                                    : 'text-blue-400 hover:text-blue-300'
                                }`}
                                title="Read aloud"
                              >
                                {currentReadingId === `checkin-${checkIn.id}` ? (
                                  <VolumeX className="w-4 h-4" />
                                ) : (
                                  <Volume2 className="w-4 h-4" />
                                )}
                              </button>
                              <button
                                onClick={() => deleteItem('checkin', checkIn.id)}
                                className="p-2 text-red-400 hover:text-red-300 transition-colors"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                            <div>
                              <span className="text-purple-200">Relationship:</span>
                              <span className="ml-2">{checkIn.relationship_satisfaction}/10</span>
                            </div>
                            <div>
                              <span className="text-purple-200">BDSM:</span>
                              <span className="ml-2">{checkIn.bdsm_satisfaction}/10</span>
                            </div>
                          </div>

                          {checkIn.notes && (
                            <div className="bg-white/5 rounded-lg p-3">
                              <p className="text-purple-200">{checkIn.notes}</p>
                            </div>
                          )}
                        </motion.div>
                      ))
                    )}
                  </div>
                </div>
              )}

              {selectedTab === 'boundaries' && (
                <div>
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold">Boundaries & Limits</h2>
                    <button
                      onClick={() => setShowBoundaryForm(true)}
                      className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2"
                    >
                      <Plus className="w-4 h-4" />
                      New Boundary
                    </button>
                  </div>

                  {showBoundaryForm && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6 mb-8"
                    >
                      <h3 className="text-xl font-bold mb-4">Set New Boundary</h3>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <label className="block text-sm font-medium text-purple-200 mb-2">Category</label>
                          <select
                            value={boundaryForm.category}
                            onChange={(e) => setBoundaryForm({...boundaryForm, category: e.target.value})}
                            className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-pink-500"
                          >
                            <option value="physical">Physical</option>
                            <option value="emotional">Emotional</option>
                            <option value="mental">Mental</option>
                            <option value="communication">Communication</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-purple-200 mb-2">Limit Type</label>
                          <div className="flex gap-4">
                            <label className="flex items-center gap-2">
                              <input
                                type="checkbox"
                                checked={boundaryForm.hardLimit}
                                onChange={(e) => setBoundaryForm({
                                  ...boundaryForm, 
                                  hardLimit: e.target.checked,
                                  softLimit: e.target.checked ? false : boundaryForm.softLimit
                                })}
                                className="rounded"
                              />
                              <span>Hard Limit</span>
                            </label>
                            <label className="flex items-center gap-2">
                              <input
                                type="checkbox"
                                checked={boundaryForm.softLimit}
                                onChange={(e) => setBoundaryForm({
                                  ...boundaryForm, 
                                  softLimit: e.target.checked,
                                  hardLimit: e.target.checked ? false : boundaryForm.hardLimit
                                })}
                                className="rounded"
                              />
                              <span>Soft Limit</span>
                            </label>
                          </div>
                        </div>
                      </div>

                      <div className="mb-4">
                        <label className="block text-sm font-medium text-purple-200 mb-2">Description</label>
                        <textarea
                          value={boundaryForm.description}
                          onChange={(e) => setBoundaryForm({...boundaryForm, description: e.target.value})}
                          rows={3}
                          className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white placeholder-purple-200 focus:outline-none focus:ring-2 focus:ring-pink-500"
                          placeholder="Describe the boundary or limit..."
                        />
                      </div>

                      <div className="mb-4">
                        <label className="block text-sm font-medium text-purple-200 mb-2">Notes</label>
                        <textarea
                          value={boundaryForm.notes}
                          onChange={(e) => setBoundaryForm({...boundaryForm, notes: e.target.value})}
                          rows={2}
                          className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white placeholder-purple-200 focus:outline-none focus:ring-2 focus:ring-pink-500"
                          placeholder="Additional notes or context..."
                        />
                      </div>

                      <div className="flex gap-4">
                        <button
                          onClick={handleBoundary}
                          className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white px-6 py-2 rounded-lg font-medium transition-all"
                        >
                          Set Boundary
                        </button>
                        <button
                          onClick={() => setShowBoundaryForm(false)}
                          className="bg-white/10 hover:bg-white/20 text-white px-6 py-2 rounded-lg font-medium transition-all"
                        >
                          Cancel
                        </button>
                      </div>
                    </motion.div>
                  )}

                  <div className="space-y-4">
                    {boundaries.length === 0 ? (
                      <div className="text-center py-12">
                        <Shield className="w-16 h-16 mx-auto mb-4 text-purple-300" />
                        <h3 className="text-xl font-bold mb-2">No Boundaries Set</h3>
                        <p className="text-purple-200 mb-4">
                          Establish clear boundaries to ensure safe and consensual BDSM experiences
                        </p>
                        <button
                          onClick={() => setShowBoundaryForm(true)}
                          className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white px-6 py-2 rounded-lg font-medium transition-all"
                        >
                          Set Your First Boundary
                        </button>
                      </div>
                    ) : (
                      boundaries.map((boundary, index) => (
                        <motion.div
                          key={boundary.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className={`border rounded-xl p-6 ${getBoundaryColor(boundary)}`}
                        >
                          <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-3">
                              {getBoundaryIcon(boundary)}
                              <div>
                                <h4 className="text-lg font-semibold capitalize">
                                  {boundary.category} Boundary
                                </h4>
                                <p className="text-sm text-purple-200">
                                  {new Date(boundary.created_at).toLocaleDateString()}
                                </p>
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <button
                                onClick={() => {
                                  const limitType = boundary.hard_limit ? 'hard limit' : boundary.soft_limit ? 'soft limit' : 'guideline';
                                  const textToRead = `${boundary.category} boundary set on ${new Date(boundary.created_at).toLocaleDateString()}. Type: ${limitType}. Description: ${boundary.description}. ${boundary.notes ? `Notes: ${boundary.notes}` : ''}`;
                                  speak(textToRead, `boundary-${boundary.id}`);
                                }}
                                className={`p-2 transition-colors ${
                                  currentReadingId === `boundary-${boundary.id}` 
                                    ? 'text-pink-400' 
                                    : 'text-blue-400 hover:text-blue-300'
                                }`}
                                title="Read aloud"
                              >
                                {currentReadingId === `boundary-${boundary.id}` ? (
                                  <VolumeX className="w-4 h-4" />
                                ) : (
                                  <Volume2 className="w-4 h-4" />
                                )}
                              </button>
                              <button
                                onClick={() => deleteItem('boundary', boundary.id)}
                                className="p-2 text-red-400 hover:text-red-300 transition-colors"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>

                          <p className="text-purple-200 mb-3">{boundary.description}</p>

                          {boundary.notes && (
                            <div className="bg-white/5 rounded-lg p-3 mb-3">
                              <p className="text-sm text-purple-200">{boundary.notes}</p>
                            </div>
                          )}

                          <div className="flex items-center gap-2 text-sm">
                            <span className="text-purple-200">Type:</span>
                            {boundary.hard_limit && <span className="text-red-400 font-medium">Hard Limit</span>}
                            {boundary.soft_limit && <span className="text-orange-400 font-medium">Soft Limit</span>}
                            {!boundary.hard_limit && !boundary.soft_limit && <span className="text-green-400 font-medium">Guideline</span>}
                          </div>
                        </motion.div>
                      ))
                    )}
                  </div>
                </div>
              )}

              {selectedTab === 'stories' && (
                <div>
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold">Erotic Stories</h2>
                    <button
                      onClick={() => setShowStoryForm(true)}
                      className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2"
                    >
                      <Plus className="w-4 h-4" />
                      New Story
                    </button>
                  </div>

                  {showStoryForm && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6 mb-8"
                    >
                      <h3 className="text-xl font-bold mb-4">
                        {editingStory ? 'Edit Story' : 'Write New Story'}
                      </h3>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <label className="block text-sm font-medium text-purple-200 mb-2">Title</label>
                          <input
                            type="text"
                            value={storyForm.title}
                            onChange={(e) => setStoryForm({...storyForm, title: e.target.value})}
                            className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-pink-500"
                            placeholder="Story title..."
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-purple-200 mb-2">Mood</label>
                          <select
                            value={storyForm.mood}
                            onChange={(e) => setStoryForm({...storyForm, mood: e.target.value})}
                            className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-pink-500"
                            style={{ colorScheme: 'dark' }}
                          >
                            <option value="romantic" className="bg-purple-900 text-white">Romantic 💕</option>
                            <option value="passionate" className="bg-purple-900 text-white">Passionate 🔥</option>
                            <option value="playful" className="bg-purple-900 text-white">Playful 😏</option>
                            <option value="intimate" className="bg-purple-900 text-white">Intimate 💋</option>
                            <option value="fantasy" className="bg-purple-900 text-white">Fantasy ✨</option>
                          </select>
                        </div>
                      </div>

                      <div className="mb-4">
                        <label className="block text-sm font-medium text-purple-200 mb-2">Content</label>
                        <textarea
                          value={storyForm.content}
                          onChange={(e) => setStoryForm({...storyForm, content: e.target.value})}
                          onPaste={(e) => {
                            // Prevent default paste to handle formatting
                            e.preventDefault();
                            const pastedText = e.clipboardData.getData('text/plain');
                            // Insert at cursor position
                            const textarea = e.target;
                            const start = textarea.selectionStart;
                            const end = textarea.selectionEnd;
                            const newContent = storyForm.content.substring(0, start) + pastedText + storyForm.content.substring(end);
                            setStoryForm({...storyForm, content: newContent});
                            
                            // Set cursor position after pasted text
                            setTimeout(() => {
                              textarea.setSelectionRange(start + pastedText.length, start + pastedText.length);
                              textarea.focus();
                            }, 0);
                          }}
                          rows={8}
                          className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-purple-200 focus:outline-none focus:ring-2 focus:ring-pink-500 font-mono text-sm leading-relaxed resize-y"
                          placeholder="Write your erotic story here...

Tips for better formatting:
• Use line breaks for paragraphs
• Add spaces after punctuation
• Use dashes for dialogue
• Keep sentences clear and readable"
                          style={{
                            fontFamily: 'ui-monospace, SFMono-Regular, "SF Mono", Consolas, "Liberation Mono", Menlo, monospace',
                            lineHeight: '1.6',
                            whiteSpace: 'pre-wrap',
                            wordWrap: 'break-word'
                          }}
                        />
                        <div className="mt-2 flex justify-between items-center text-xs text-purple-300">
                          <span className="text-pink-300">💡 Tip:</span> Use line breaks and proper spacing for better readability
                          <span className="text-purple-200">
                            {storyForm.content.length} characters
                          </span>
                        </div>
                      </div>

                      <div className="mb-4">
                        <label className="block text-sm font-medium text-purple-200 mb-2">Quick Formatting</label>
                        <div className="flex flex-wrap gap-2">
                          <button
                            type="button"
                            onClick={() => {
                              const textarea = document.querySelector('textarea[placeholder*="Tips for better formatting"]');
                              if (textarea) {
                                const start = textarea.selectionStart;
                                const end = textarea.selectionEnd;
                                const selectedText = storyForm.content.substring(start, end);
                                const newText = `"${selectedText}"`;
                                const newContent = storyForm.content.substring(0, start) + newText + storyForm.content.substring(end);
                                setStoryForm({...storyForm, content: newContent});
                              }
                            }}
                            className="bg-pink-500/20 hover:bg-pink-500/30 text-pink-200 px-3 py-1 rounded text-xs border border-pink-500/30"
                          >
                            Quote Text
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              const textarea = document.querySelector('textarea[placeholder*="Tips for better formatting"]');
                              if (textarea) {
                                const start = textarea.selectionStart;
                                const end = textarea.selectionEnd;
                                const selectedText = storyForm.content.substring(start, end);
                                const newText = `— ${selectedText}`;
                                const newContent = storyForm.content.substring(0, start) + newText + storyForm.content.substring(end);
                                setStoryForm({...storyForm, content: newContent});
                              }
                            }}
                            className="bg-purple-500/20 hover:bg-purple-500/30 text-purple-200 px-3 py-1 rounded text-xs border border-purple-500/30"
                          >
                            Add Dialogue
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              const textarea = document.querySelector('textarea[placeholder*="Tips for better formatting"]');
                              if (textarea) {
                                const start = textarea.selectionStart;
                                const newText = '\n\n';
                                const newContent = storyForm.content.substring(0, start) + newText + storyForm.content.substring(start);
                                setStoryForm({...storyForm, content: newContent});
                              }
                            }}
                            className="bg-blue-500/20 hover:bg-blue-500/30 text-blue-200 px-3 py-1 rounded text-xs border border-blue-500/30"
                          >
                            Add Paragraph
                          </button>
                        </div>
                      </div>

                      <div className="mb-4">
                        <label className="block text-sm font-medium text-purple-200 mb-2">Tags</label>
                        <div className="flex flex-wrap gap-2 mb-2">
                          {storyForm.tags.map((tag, index) => (
                            <span
                              key={index}
                              className="bg-pink-500/20 text-pink-200 px-2 py-1 rounded-full text-sm flex items-center gap-1"
                            >
                              {tag}
                              <button
                                type="button"
                                onClick={() => removeTag(tag)}
                                className="text-pink-300 hover:text-pink-100"
                              >
                                ×
                              </button>
                            </span>
                          ))}
                        </div>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            placeholder="Add tag..."
                            className="flex-1 bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-pink-500"
                            onKeyPress={(e) => {
                              if (e.key === 'Enter') {
                                e.preventDefault();
                                addTag(e.target.value.trim());
                                e.target.value = '';
                              }
                            }}
                          />
                          <button
                            type="button"
                            onClick={() => {
                              const input = document.querySelector('input[placeholder="Add tag..."]');
                              if (input && input.value.trim()) {
                                addTag(input.value.trim());
                                input.value = '';
                              }
                            }}
                            className="bg-pink-500 hover:bg-pink-600 text-white px-3 py-2 rounded-lg"
                          >
                            Add
                          </button>
                        </div>
                      </div>

                      <div className="mb-4">
                        <label className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={storyForm.isPrivate}
                            onChange={(e) => setStoryForm({...storyForm, isPrivate: e.target.checked})}
                            className="rounded"
                          />
                          <span className="text-purple-200">Private (only visible to couple)</span>
                        </label>
                      </div>

                      <div className="flex gap-4">
                        <button
                          onClick={handleStorySubmit}
                          className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white px-6 py-2 rounded-lg font-medium transition-all"
                        >
                          {editingStory ? 'Update Story' : 'Save Story'}
                        </button>
                        <button
                          onClick={() => {
                            if (storyForm.title && storyForm.content) {
                              const textToRead = `Story preview: ${storyForm.title}. Mood: ${storyForm.mood}. ${storyForm.content}. ${storyForm.tags && storyForm.tags.length > 0 ? `Tags: ${storyForm.tags.join(', ')}.` : ''}`;
                              speak(textToRead, 'story-preview');
                            } else {
                              setSpeechError('Please add a title and content to preview your story.');
                              setTimeout(() => setSpeechError(null), 3000);
                            }
                          }}
                          className="bg-purple-500/20 hover:bg-purple-500/30 text-purple-200 px-4 py-2 rounded-lg font-medium transition-all border border-purple-500/30"
                        >
                          <Volume2 className="w-4 h-4 inline mr-2" />
                          Preview
                        </button>
                        <button
                          onClick={cancelStoryEdit}
                          className="bg-white/10 hover:bg-white/20 text-white px-6 py-2 rounded-lg font-medium transition-all"
                        >
                          Cancel
                        </button>
                      </div>
                    </motion.div>
                  )}

                  <div className="space-y-4">
                    {eroticStories.length === 0 ? (
                      <div className="text-center py-12">
                        <BookOpen className="w-16 h-16 mx-auto mb-4 text-purple-300" />
                        <h3 className="text-xl font-bold mb-2">No Stories Yet</h3>
                        <p className="text-purple-200 mb-4">
                          Start sharing intimate stories with your partner
                        </p>
                        <button
                          onClick={() => setShowStoryForm(true)}
                          className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white px-6 py-3 rounded-lg font-medium transition-all"
                        >
                          Write Your First Story
                        </button>
                      </div>
                    ) : (
                      eroticStories.map((story, index) => (
                        <motion.div
                          key={story.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6"
                        >
                          <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-3">
                              <div className="text-2xl">
                                {story.mood === 'romantic' && '💕'}
                                {story.mood === 'passionate' && '🔥'}
                                {story.mood === 'playful' && '😏'}
                                {story.mood === 'intimate' && '💋'}
                                {story.mood === 'fantasy' && '✨'}
                              </div>
                              <div>
                                <h4 className="text-lg font-semibold">{story.title}</h4>
                                <p className="text-sm text-purple-200">
                                  {new Date(story.created_at).toLocaleDateString()}
                                </p>
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <button
                                onClick={() => setImmersionMode(!immersionMode)}
                                className={`p-2 transition-colors ${
                                  immersionMode 
                                    ? 'text-pink-400' 
                                    : 'text-purple-400 hover:text-purple-300'
                                }`}
                                title={immersionMode ? "Exit immersion mode" : "Enter immersion mode"}
                              >
                                {immersionMode ? (
                                  <Eye className="w-4 h-4" />
                                ) : (
                                  <EyeOff className="w-4 h-4" />
                                )}
                              </button>
                              <button
                                onClick={() => {
                                  const textToRead = `Story: ${story.title}. Mood: ${story.mood}. ${story.content}. ${story.tags && story.tags.length > 0 ? `Tags: ${story.tags.join(', ')}.` : ''} Created on ${new Date(story.created_at).toLocaleDateString()}.`;
                                  speak(textToRead, `story-${story.id}`);
                                }}
                                className={`p-2 transition-colors ${
                                  currentReadingId === `story-${story.id}` 
                                    ? 'text-pink-400' 
                                    : 'text-blue-400 hover:text-blue-300'
                                }`}
                                title="Read aloud"
                              >
                                {currentReadingId === `story-${story.id}` ? (
                                  <VolumeX className="w-4 h-4" />
                                ) : (
                                  <Volume2 className="w-4 h-4" />
                                )}
                              </button>
                              <button
                                onClick={() => startEditingStory(story)}
                                className="p-2 text-blue-400 hover:text-blue-300 transition-colors"
                              >
                                <Edit3 className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => deleteItem('story', story.id)}
                                className="p-2 text-red-400 hover:text-red-300 transition-colors"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>

                          <div className="mb-4">
                            <div 
                              className="text-purple-200 leading-relaxed whitespace-pre-wrap font-mono text-sm bg-white/5 rounded-lg p-4 border border-white/10"
                              style={{
                                fontFamily: 'ui-monospace, SFMono-Regular, "SF Mono", Consolas, "Liberation Mono", Menlo, monospace',
                                lineHeight: '1.7',
                                wordWrap: 'break-word'
                              }}
                            >
                              {story.content}
                            </div>
                          </div>

                          {story.tags && story.tags.length > 0 && (
                            <div className="flex flex-wrap gap-2 mb-3">
                              {story.tags.map((tag, tagIndex) => (
                                <span
                                  key={tagIndex}
                                  className="bg-pink-500/20 text-pink-200 px-2 py-1 rounded-full text-sm"
                                >
                                  {tag}
                                </span>
                              ))}
                            </div>
                          )}

                          <div className="flex items-center gap-2 text-sm">
                            <span className="text-purple-200">Privacy:</span>
                            {story.is_private ? (
                              <span className="text-green-400 font-medium">Private</span>
                            ) : (
                              <span className="text-blue-400 font-medium">Public</span>
                            )}
                          </div>
                        </motion.div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </motion.div>
          </>
        )}

        {/* Immersion Mode Overlay */}
        {immersionMode && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/95 backdrop-blur-sm z-50 flex items-center justify-center p-6"
            onClick={() => setImmersionMode(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-gradient-to-br from-gray-900 via-purple-900 to-indigo-900 rounded-2xl p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-white/20"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                  <BookOpen className="w-6 h-6 text-pink-400" />
                  Immersion Mode
                </h2>
                <button
                  onClick={() => setImmersionMode(false)}
                  className="text-white/60 hover:text-white transition-colors p-2"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-6">
                {eroticStories.map((story, index) => (
                  <div key={story.id} className="bg-white/5 rounded-xl p-6 border border-white/10">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="text-3xl">
                        {story.mood === 'romantic' && '💕'}
                        {story.mood === 'passionate' && '🔥'}
                        {story.mood === 'playful' && '😏'}
                        {story.mood === 'intimate' && '💋'}
                        {story.mood === 'fantasy' && '✨'}
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-white">{story.title}</h3>
                        <p className="text-purple-200 text-sm">
                          {new Date(story.created_at).toLocaleDateString()} • {story.mood}
                        </p>
                      </div>
                    </div>

                    <div 
                      className="text-white leading-relaxed whitespace-pre-wrap font-mono text-base bg-white/5 rounded-lg p-6 border border-white/10 mb-4"
                      style={{
                        fontFamily: 'ui-monospace, SFMono-Regular, "SF Mono", Consolas, "Liberation Mono", Menlo, monospace',
                        lineHeight: '1.8',
                        wordWrap: 'break-word'
                      }}
                    >
                      {story.content}
                    </div>

                    {story.tags && story.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-4">
                        {story.tags.map((tag, tagIndex) => (
                          <span
                            key={tagIndex}
                            className="bg-pink-500/20 text-pink-200 px-3 py-1 rounded-full text-sm"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-sm">
                        <span className="text-purple-200">Privacy:</span>
                        {story.is_private ? (
                          <span className="text-green-400 font-medium">Private</span>
                        ) : (
                          <span className="text-blue-400 font-medium">Public</span>
                        )}
                      </div>
                      <button
                        onClick={() => {
                          const textToRead = `Story: ${story.title}. Mood: ${story.mood}. ${story.content}. ${story.tags && story.tags.length > 0 ? `Tags: ${story.tags.join(', ')}.` : ''}`;
                          speak(textToRead, `immersion-story-${story.id}`);
                        }}
                        className={`px-4 py-2 rounded-lg transition-all flex items-center gap-2 ${
                          currentReadingId === `immersion-story-${story.id}` 
                            ? 'bg-pink-500 text-white' 
                            : 'bg-purple-500/20 text-purple-200 hover:bg-purple-500/30 border border-purple-500/30'
                        }`}
                      >
                        {currentReadingId === `immersion-story-${story.id}` ? (
                          <VolumeX className="w-4 h-4" />
                        ) : (
                          <Volume2 className="w-4 h-4" />
                        )}
                        {currentReadingId === `immersion-story-${story.id}` ? 'Stop' : 'Read Aloud'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8 text-center">
                <p className="text-purple-200 text-sm mb-4">
                  Click outside or press Escape to exit immersion mode
                </p>
                <button
                  onClick={() => setImmersionMode(false)}
                  className="bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-lg font-medium transition-all border border-white/20"
                >
                  Exit Immersion Mode
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default CoupleCommunicationHub;
