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
  Star
} from 'lucide-react';
import apiService from '../utils/api';

const CoupleCommunicationHub = ({ coupleProfile, onProfileUpdate }) => {
  const [checkIns, setCheckIns] = useState([]);
  const [boundaries, setBoundaries] = useState([]);
  const [selectedTab, setSelectedTab] = useState('checkins');
  const [showCheckInForm, setShowCheckInForm] = useState(false);
  const [showBoundaryForm, setShowBoundaryForm] = useState(false);

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

  useEffect(() => {
    if (coupleProfile?.id) {
      loadCheckIns();
      loadBoundaries();
    }
  }, [coupleProfile]);

  const loadCheckIns = async () => {
    if (!coupleProfile?.id) return;
    try {
      const response = await apiService.getCheckIns(coupleProfile.id);
      if (response.success) {
        setCheckIns(response.checkIns || []);
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

  const handleCheckIn = async () => {
    if (!coupleProfile?.id) return;
    
    try {
      const response = await apiService.createCheckIn(
        coupleProfile.id,
        checkInForm.date,
        checkInForm.mood,
        checkInForm.relationshipSatisfaction,
        checkInForm.bdsmSatisfaction,
        checkInForm.notes
      );
      
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
      alert('Failed to save check-in. Please try again.');
    }
  };

  const handleBoundary = async () => {
    if (!coupleProfile?.id) return;
    
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
      alert('Failed to save boundary. Please try again.');
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
        }
      } catch (error) {
        console.error('Error deleting item:', error);
        alert('Failed to delete item. Please try again.');
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
                  { id: 'boundaries', label: 'Boundaries', icon: Shield, count: boundaries.length }
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
                            <button
                              onClick={() => deleteItem('checkin', checkIn.id)}
                              className="p-2 text-red-400 hover:text-red-300 transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
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
                            <button
                              onClick={() => deleteItem('boundary', boundary.id)}
                              className="p-2 text-red-400 hover:text-red-300 transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
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
            </motion.div>
          </>
        )}
      </div>
    </div>
  );
};

export default CoupleCommunicationHub;
