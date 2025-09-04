import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Heart, Users, Lock, Eye, EyeOff, Plus, Trash2, Edit3, Save, X, UserCheck, UserX } from 'lucide-react';
import apiService from '../utils/api';

const CoupleProfileManager = ({ onProfileUpdate, currentProfile: externalCurrentProfile }) => {
  const [coupleProfiles, setCoupleProfiles] = useState([]);
  const [currentProfile, setCurrentProfile] = useState(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingProfile, setEditingProfile] = useState(null);
  const [userProfiles, setUserProfiles] = useState([]);
  const [showPartnerDropdown, setShowPartnerDropdown] = useState(false);
  const [loading, setLoading] = useState(false);
  
  // Form state for creating/editing profiles
  const [formData, setFormData] = useState({
    coupleName: '',
    partners: [], // Array of partner objects: {test_id, name, emoji}
    relationshipDuration: '',
    bdsmExperience: 'beginner',
    privacyLevel: 'private',
    description: ''
  });

  // Load existing couple profiles from the database
  useEffect(() => {
    loadCoupleProfiles();
    loadUserProfiles();
  }, []);
  
  const loadCoupleProfiles = async () => {
    try {
      setLoading(true);
      const response = await apiService.getAllCoupleProfiles();
      setCoupleProfiles(response.profiles || []);
      console.log('Loaded couple profiles from database:', response.profiles);
    } catch (error) {
      console.error('Error loading couple profiles:', error);
      setCoupleProfiles([]);
    } finally {
      setLoading(false);
    }
  };

  const loadUserProfiles = async () => {
    try {
      const response = await apiService.getAllProfiles();
      setUserProfiles(response.profiles || []);
      console.log('Loaded user profiles from API:', response.profiles);
    } catch (error) {
      console.error('Error loading user profiles:', error);
      // Fallback: try to load from localStorage if API fails
      const savedUserProfiles = localStorage.getItem('bdsmUserProfiles');
      if (savedUserProfiles) {
        try {
          setUserProfiles(JSON.parse(savedUserProfiles));
        } catch (e) {
          console.error('Could not parse localStorage profiles:', e);
        }
      }
    }
  };

  // Notify parent component of profile updates
  useEffect(() => {
    if (onProfileUpdate) {
      onProfileUpdate(coupleProfiles.length > 0 ? coupleProfiles[0] : null);
    }
  }, [coupleProfiles, onProfileUpdate]);

  // Sync with external current profile
  useEffect(() => {
    if (externalCurrentProfile) {
      setCurrentProfile(externalCurrentProfile);
    }
  }, [externalCurrentProfile]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.partner-dropdown')) {
        setShowPartnerDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleCreateProfile = async () => {
    if (formData.partners.length < 2) {
      alert('Please select at least 2 partners to create a couple profile.');
      return;
    }

    try {
      setLoading(true);
      const partnerIds = formData.partners.map(p => p.test_id);
      const partnerNames = formData.partners.map(p => p.name);
      
      const response = await apiService.createCoupleProfile(
        formData.coupleName,
        partnerIds,
        partnerNames,
        formData.relationshipDuration,
        formData.bdsmExperience,
        formData.privacyLevel,
        formData.description
      );

      if (response.success) {
        await loadCoupleProfiles(); // Reload from database
        setFormData({
          coupleName: '',
          partners: [],
          relationshipDuration: '',
          bdsmExperience: 'beginner',
          privacyLevel: 'private',
          description: ''
        });
        setShowCreateForm(false);
      }
    } catch (error) {
      console.error('Error creating couple profile:', error);
      alert('Failed to create couple profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = async () => {
    if (!editingProfile) return;

    try {
      setLoading(true);
      const partnerIds = formData.partners.map(p => p.test_id);
      const partnerNames = formData.partners.map(p => p.name);
      
      const response = await apiService.updateCoupleProfile(
        editingProfile.id,
        formData.coupleName,
        partnerIds,
        partnerNames,
        formData.relationshipDuration,
        formData.bdsmExperience,
        formData.privacyLevel,
        formData.description
      );

      if (response.success) {
        await loadCoupleProfiles(); // Reload from database
        setEditingProfile(null);
        setFormData({
          coupleName: '',
          partners: [],
          relationshipDuration: '',
          bdsmExperience: 'beginner',
          privacyLevel: 'private',
          description: ''
        });
      }
    } catch (error) {
      console.error('Error updating couple profile:', error);
      alert('Failed to update couple profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProfile = async (profileId) => {
    if (!window.confirm('Are you sure you want to delete this couple profile?')) {
      return;
    }

    try {
      setLoading(true);
      const response = await apiService.deleteCoupleProfile(profileId);
      
      if (response.success) {
        await loadCoupleProfiles(); // Reload from database
        if (currentProfile?.id === profileId) {
          setCurrentProfile(null);
        }
      }
    } catch (error) {
      console.error('Error deleting couple profile:', error);
      alert('Failed to delete couple profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const startEditing = (profile) => {
    setEditingProfile(profile);
    
    // Convert partner data from database format to form format
    const partners = profile.partner_ids.map((testId, index) => ({
      test_id: testId,
      name: profile.partner_names[index],
      emoji: userProfiles.find(p => p.test_id === testId)?.emoji || '👤'
    }));
    
    setFormData({
      coupleName: profile.couple_name,
      partners: partners,
      relationshipDuration: profile.relationship_duration,
      bdsmExperience: profile.bdsm_experience,
      privacyLevel: profile.privacy_level,
      description: profile.description
    });
  };

  const addPartner = (partner) => {
    // Check if partner is already added
    if (formData.partners.some(p => p.test_id === partner.test_id)) {
      alert('This partner is already added to the couple profile.');
      return;
    }

    const newPartner = {
      test_id: partner.test_id,
      name: partner.name,
      emoji: partner.emoji
    };

    setFormData(prev => ({
      ...prev,
      partners: [...prev.partners, newPartner],
      coupleName: prev.partners.length === 0 ? partner.name : `${prev.coupleName} & ${partner.name}`
    }));
    setShowPartnerDropdown(false);
  };

  const removePartner = (testId) => {
    setFormData(prev => {
      const updatedPartners = prev.partners.filter(p => p.test_id !== testId);
      const coupleName = updatedPartners.length >= 2 
        ? updatedPartners.map(p => p.name).join(' & ')
        : updatedPartners.length === 1 
          ? updatedPartners[0].name 
          : '';
      
      return {
        ...prev,
        partners: updatedPartners,
        coupleName
      };
    });
  };

  const getPartnerEmoji = (profile) => {
    if (!profile) return '👤';
    
    // Use the emoji stored in the profile
    if (profile.emoji) {
      return profile.emoji;
    }
    
    // Fallback: try to get emoji from results if available
    if (profile.results && profile.results[0]) {
      const topRole = profile.results[0];
      const role = topRole.role.toLowerCase();
      if (role.includes('dominant') || role.includes('top')) return '👑';
      if (role.includes('submissive') || role.includes('bottom')) return '🌸';
      if (role.includes('switch')) return '🔄';
      if (role.includes('vanilla')) return '🌿';
      if (role.includes('sadist')) return '🔥';
      if (role.includes('masochist')) return '💎';
    }
    
    return '👤';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-indigo-900 text-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4 flex items-center justify-center gap-3">
            <Heart className="w-10 h-10 text-pink-400" />
            Couple Profile Manager
          </h1>
          <p className="text-purple-200 text-lg">
            Create couple relationships between existing user profiles to analyze compatibility and track growth
          </p>
          
          {externalCurrentProfile && (
            <div className="mt-6 bg-pink-500/20 border border-pink-500/30 rounded-xl p-4 max-w-md mx-auto">
              <div className="flex items-center gap-3">
                <Users className="w-5 h-5 text-pink-400" />
                <div>
                  <h3 className="text-lg font-semibold text-white">
                    Currently Selected: {externalCurrentProfile.couple_name}
                  </h3>
                  <p className="text-sm text-pink-200">
                    This profile is active for Communication Hub and Enhanced Analysis
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Create Profile Button */}
        <div className="mb-6 text-center">
          {userProfiles.length === 0 ? (
            <div className="bg-blue-500/20 border border-blue-500/30 rounded-lg p-4 mb-4">
              <p className="text-blue-200 mb-2">
                <strong>No User Profiles Found!</strong>
              </p>
              <p className="text-blue-100 text-sm mb-3">
                You need to create user profiles first in the "User Profiles" tab before creating couple relationships.
              </p>
              <p className="text-blue-100 text-sm">
                User profiles contain BDSM test results and personal information needed for compatibility analysis.
              </p>
            </div>
          ) : (
            <button
              onClick={() => setShowCreateForm(true)}
              className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white px-6 py-3 rounded-lg font-medium transition-all flex items-center gap-2 mx-auto"
            >
              <Plus className="w-5 h-5" />
              Create New Couple Profile
            </button>
          )}
        </div>

        {/* Create/Edit Profile Form */}
        {(showCreateForm || editingProfile) && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6 mb-8"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold">
                {editingProfile ? 'Edit Couple Profile' : 'Create New Couple Profile'}
              </h2>
              <button
                onClick={() => {
                  setShowCreateForm(false);
                  setEditingProfile(null);
                  setFormData({
                    coupleName: '',
                    partners: [],
                    relationshipDuration: '',
                    bdsmExperience: 'beginner',
                    privacyLevel: 'private',
                    description: ''
                  });
                }}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-purple-200 mb-2">
                  Couple Name
                </label>
                <input
                  type="text"
                  value={formData.coupleName}
                  onChange={(e) => setFormData({...formData, coupleName: e.target.value})}
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white placeholder-purple-200 focus:outline-none focus:ring-2 focus:ring-pink-500"
                  placeholder="e.g., Alex & Sam"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-purple-200 mb-2">
                  Privacy Level
                </label>
                <select
                  value={formData.privacyLevel}
                  onChange={(e) => setFormData({...formData, privacyLevel: e.target.value})}
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-pink-500"
                >
                  <option value="private">Private (Partners Only)</option>
                  <option value="friends">Friends Only</option>
                  <option value="community">Community (Anonymous)</option>
                </select>
              </div>

              {/* Partners Selection */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-purple-200 mb-2">
                  Partners ({formData.partners.length}/∞)
                </label>
                
                {/* Selected Partners Display */}
                {formData.partners.length > 0 && (
                  <div className="mb-3 flex flex-wrap gap-2">
                    {formData.partners.map((partner) => (
                      <div
                        key={partner.test_id}
                        className="flex items-center gap-2 bg-white/10 border border-white/20 rounded-lg px-3 py-2"
                      >
                        <span className="text-lg">{partner.emoji}</span>
                        <span className="text-white">{partner.name}</span>
                        <span className="text-xs text-gray-400">({partner.test_id})</span>
                        <button
                          onClick={() => removePartner(partner.test_id)}
                          className="text-red-400 hover:text-red-300 transition-colors"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {/* Partner Dropdown */}
                <div className="relative partner-dropdown">
                  <button
                    type="button"
                    onClick={() => setShowPartnerDropdown(!showPartnerDropdown)}
                    className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white placeholder-purple-200 focus:outline-none focus:ring-2 focus:ring-pink-500 text-left flex items-center justify-between"
                  >
                    <span className="text-purple-200">Add Partner</span>
                    <span className="text-gray-400">▼</span>
                  </button>
                  
                  {showPartnerDropdown && (
                    <div className="absolute z-10 w-full mt-1 bg-gray-800 border border-white/20 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                      {userProfiles.map((profile) => (
                        <button
                          key={profile.test_id}
                          onClick={() => addPartner(profile)}
                          disabled={formData.partners.some(p => p.test_id === profile.test_id)}
                          className={`w-full px-3 py-2 text-left hover:bg-white/10 flex items-center gap-3 border-b border-white/10 last:border-b-0 ${
                            formData.partners.some(p => p.test_id === profile.test_id) ? 'opacity-50 cursor-not-allowed' : ''
                          }`}
                        >
                          <span className="text-lg">{profile.emoji || getPartnerEmoji(profile)}</span>
                          <div className="flex-1">
                            <div className="text-white font-medium">{profile.name}</div>
                            <div className="text-xs text-gray-400">{profile.test_id}</div>
                            <div className="text-xs text-purple-300">
                              Created: {new Date(profile.created_at).toLocaleDateString()}
                            </div>
                          </div>
                        </button>
                      ))}
                      {userProfiles.length === 0 && (
                        <div className="px-3 py-2 text-gray-400 text-sm">
                          No user profiles found. Create user profiles first in the "User Profiles" tab.
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-purple-200 mb-2">
                  Relationship Duration
                </label>
                <input
                  type="text"
                  value={formData.relationshipDuration}
                  onChange={(e) => setFormData({...formData, relationshipDuration: e.target.value})}
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white placeholder-purple-200 focus:outline-none focus:ring-2 focus:ring-pink-500"
                  placeholder="e.g., 2 years, 6 months"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-purple-200 mb-2">
                  BDSM Experience Level
                </label>
                <select
                  value={formData.bdsmExperience}
                  onChange={(e) => setFormData({...formData, bdsmExperience: e.target.value})}
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-pink-500"
                >
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                  <option value="expert">Expert</option>
                </select>
              </div>
            </div>

            <div className="mt-4">
              <label className="block text-sm font-medium text-purple-200 mb-2">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                rows={3}
                className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white placeholder-purple-200 focus:outline-none focus:ring-2 focus:ring-pink-500"
                placeholder="Tell us about your relationship and BDSM journey..."
              />
            </div>

            <div className="mt-6 text-center">
              <button
                onClick={editingProfile ? handleUpdateProfile : handleCreateProfile}
                disabled={loading || formData.partners.length < 2}
                className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white px-6 py-2 rounded-lg font-medium transition-all flex items-center gap-2 mx-auto disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Save className="w-5 h-5" />
                {loading ? 'Saving...' : (editingProfile ? 'Update Profile' : 'Create Profile')}
              </button>
            </div>
          </motion.div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-pink-400"></div>
            <p className="text-purple-200 mt-2">Loading...</p>
          </div>
        )}

        {/* Couple Profiles Grid */}
        {!loading && coupleProfiles.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {coupleProfiles.map((profile, index) => (
              <motion.div
                key={profile.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6 hover:bg-white/15 transition-all cursor-pointer ${
                  externalCurrentProfile?.id === profile.id ? 'ring-2 ring-pink-500 bg-white/20' : ''
                }`}
                onClick={() => {
                  setCurrentProfile(profile);
                  if (onProfileUpdate) {
                    onProfileUpdate(profile);
                  }
                }}
              >
                {/* Profile Header */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Users className="w-5 h-5 text-pink-400" />
                    <h3 className="text-xl font-bold">{profile.couple_name}</h3>
                    {externalCurrentProfile?.id === profile.id && (
                      <span className="bg-pink-500 text-white text-xs px-2 py-1 rounded-full">
                        Selected
                      </span>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        startEditing(profile);
                      }}
                      className="p-2 text-gray-400 hover:text-white transition-colors"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteProfile(profile.id);
                      }}
                      className="p-2 text-red-400 hover:text-red-300 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Partner Names */}
                <div className="mb-4">
                  <div className="flex items-center gap-2 mb-2">
                    <UserCheck className="w-4 h-4 text-green-400" />
                    <span className="text-sm text-purple-200">Partners:</span>
                  </div>
                  {profile.partner_names.map((name, index) => (
                    <div key={index} className="flex items-center gap-2 ml-6 mb-1">
                      <span className="text-sm text-purple-200">{name}</span>
                      {profile.partner_ids[index] && (
                        <span className="text-xs text-gray-400">({profile.partner_ids[index]})</span>
                      )}
                    </div>
                  ))}
                </div>

                {/* Profile Details */}
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <span className="text-purple-200">Experience:</span>
                    <span className="capitalize">{profile.bdsm_experience}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-purple-200">Duration:</span>
                    <span>{profile.relationship_duration}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-purple-200">Privacy:</span>
                    <span className="capitalize">{profile.privacy_level}</span>
                  </div>
                </div>

                {/* Last Updated */}
                <div className="mt-4 text-xs text-gray-400">
                  Updated: {new Date(profile.updated_at).toLocaleDateString()}
                </div>

                {/* Select Profile Button */}
                <div className="mt-4">
                  {externalCurrentProfile?.id === profile.id ? (
                    <button
                      className="w-full bg-green-500/20 text-green-400 px-3 py-2 rounded-lg text-sm border border-green-500/30 cursor-default"
                      disabled
                    >
                      ✓ Currently Selected
                    </button>
                  ) : (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (onProfileUpdate) {
                          onProfileUpdate(profile);
                        }
                      }}
                      className="w-full bg-pink-500/20 hover:bg-pink-500/30 text-pink-200 px-3 py-2 rounded-lg text-sm border border-pink-500/30 transition-all"
                    >
                      Select This Profile
                    </button>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* No Profiles Message */}
        {!loading && coupleProfiles.length === 0 && userProfiles.length > 0 && (
          <div className="text-center py-12">
            <Users className="w-16 h-16 mx-auto mb-4 text-purple-300" />
            <h3 className="text-xl font-bold mb-2">No Couple Profiles Yet</h3>
            <p className="text-purple-200 mb-4">
              Create couple relationships between your existing user profiles to analyze compatibility and track your BDSM journey together
            </p>
            <button
              onClick={() => setShowCreateForm(true)}
              className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white px-6 py-3 rounded-lg font-medium transition-all"
            >
              Create Your First Couple Profile
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CoupleProfileManager;




