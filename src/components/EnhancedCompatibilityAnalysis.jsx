import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Heart, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle, 
  XCircle, 
  Target, 
  Users, 
  BarChart3,
  Lightbulb,
  Shield,
  MessageCircle,
  Star
} from 'lucide-react';

const EnhancedCompatibilityAnalysis = ({ coupleProfile, partner1Results, partner2Results }) => {
  const [analysisData, setAnalysisData] = useState(null);
  const [selectedTab, setSelectedTab] = useState('overview');

  useEffect(() => {
    console.log('EnhancedCompatibilityAnalysis useEffect triggered:', {
      coupleProfile,
      partner1Results,
      partner2Results
    });
    
    if (partner1Results && partner2Results) {
      console.log('Performing analysis with:', { partner1Results, partner2Results });
      const analysis = performComprehensiveAnalysis(coupleProfile, partner1Results, partner2Results);
      console.log('Analysis result:', analysis);
      setAnalysisData(analysis);
    }
  }, [coupleProfile, partner1Results, partner2Results]);

  const performComprehensiveAnalysis = (profile, p1, p2) => {
    const analysis = {
      overallScore: 0,
      roleCompatibility: { score: 0, details: [], conflicts: [], suggestions: [] },
      intensityCompatibility: { score: 0, details: [], conflicts: [], suggestions: [] },
      kinkCompatibility: { score: 0, details: [], conflicts: [], suggestions: [] },
      communicationCompatibility: { score: 0, details: [], conflicts: [], suggestions: [] },
      growthAreas: [],
      safetyConsiderations: [],
      recommendedActivities: []
    };

    // Role Compatibility Analysis
    if (p1.results && p2.results) {
      analysis.roleCompatibility = analyzeRoleCompatibility(p1.results, p2.results);
    }

    // Intensity Compatibility Analysis
    if (p1.results && p2.results) {
      analysis.intensityCompatibility = analyzeIntensityCompatibility(p1.results, p2.results);
    }

    // Kink Compatibility Analysis
    if (p1.results && p2.results) {
      analysis.kinkCompatibility = analyzeKinkCompatibility(p1.results, p2.results);
    }

    // Communication Compatibility
    analysis.communicationCompatibility = analyzeCommunicationCompatibility(p1, p2);

    // Calculate overall score
    const scores = [
      analysis.roleCompatibility.score,
      analysis.intensityCompatibility.score,
      analysis.kinkCompatibility.score,
      analysis.communicationCompatibility.score
    ].filter(score => score > 0);

    analysis.overallScore = scores.length > 0 ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0;

    // Generate growth areas
    analysis.growthAreas = generateGrowthAreas(analysis);

    // Generate safety considerations
    analysis.safetyConsiderations = generateSafetyConsiderations(analysis, profile);

    // Generate recommended activities
    analysis.recommendedActivities = generateRecommendedActivities(analysis, profile);

    return analysis;
  };

  const analyzeRoleCompatibility = (results1, results2) => {
    const result = { score: 0, details: [], conflicts: [], suggestions: [] };
    
    // Get top roles (highest percentage) for each partner
    const topRoles1 = results1.filter(r => r.percentage > 70).map(r => r.role);
    const topRoles2 = results2.filter(r => r.percentage > 70).map(r => r.role);
    
    // Check for complementary roles
    const hasDom1 = topRoles1.some(r => r.toLowerCase().includes('dominant') || r.toLowerCase().includes('top'));
    const hasSub1 = topRoles1.some(r => r.toLowerCase().includes('submissive') || r.toLowerCase().includes('bottom'));
    const hasDom2 = topRoles2.some(r => r.toLowerCase().includes('dominant') || r.toLowerCase().includes('top'));
    const hasSub2 = topRoles2.some(r => r.toLowerCase().includes('submissive') || r.toLowerCase().includes('bottom'));

    if ((hasDom1 && hasSub2) || (hasSub1 && hasDom2)) {
      result.score = 100;
      result.details.push("Perfect role complementarity - dominant/submissive dynamics align well");
      result.suggestions.push("Explore power exchange dynamics", "Practice safe words and boundaries");
    } else if ((hasDom1 && hasDom2) || (hasSub1 && hasSub2)) {
      result.score = 60;
      result.details.push("Both partners prefer similar roles - may need to take turns or explore switching");
      result.conflicts.push("Role preference overlap may limit variety");
      result.suggestions.push("Consider role switching", "Explore co-dominant or co-submissive dynamics");
    } else {
      result.score = 80;
      result.details.push("Mixed role preferences - good foundation for variety");
      result.suggestions.push("Explore different role combinations", "Communicate about role preferences");
    }

    return result;
  };

  const analyzeIntensityCompatibility = (results1, results2) => {
    const result = { score: 0, details: [], conflicts: [], suggestions: [] };
    
    // Calculate average intensity based on high-scoring roles
    const highIntensityRoles1 = results1.filter(r => r.percentage > 80).map(r => r.percentage);
    const highIntensityRoles2 = results2.filter(r => r.percentage > 80).map(r => r.percentage);
    
    const avgIntensity1 = highIntensityRoles1.length > 0 ? highIntensityRoles1.reduce((a, b) => a + b, 0) / highIntensityRoles1.length : 50;
    const avgIntensity2 = highIntensityRoles2.length > 0 ? highIntensityRoles2.reduce((a, b) => a + b, 0) / highIntensityRoles2.length : 50;
    
    const diff = Math.abs(avgIntensity1 - avgIntensity2);

    if (diff <= 2) {
      result.score = 100;
      result.details.push("Excellent intensity compatibility - both partners enjoy similar levels");
      result.suggestions.push("Explore activities at your preferred intensity", "Gradually increase intensity together");
    } else if (diff <= 4) {
      result.score = 75;
      result.details.push("Good intensity compatibility - minor differences that can be bridged");
      result.suggestions.push("Start with lower intensity and build up", "Use safe words to adjust intensity");
    } else if (diff <= 6) {
      result.score = 50;
      result.details.push("Moderate intensity compatibility - significant differences require careful navigation");
      result.conflicts.push("Intensity preferences may cause discomfort or dissatisfaction");
      result.suggestions.push("Focus on communication and consent", "Find middle ground intensity levels");
    } else {
      result.score = 25;
      result.details.push("Challenging intensity compatibility - major differences require extensive communication");
      result.conflicts.push("Large intensity gap may lead to safety concerns");
      result.suggestions.push("Professional guidance recommended", "Focus on non-physical BDSM activities");
    }

    return result;
  };

  const analyzeKinkCompatibility = (results1, results2) => {
    const result = { score: 0, details: [], conflicts: [], suggestions: [] };
    
    // Get high-scoring roles for each partner
    const highScoreRoles1 = results1.filter(r => r.percentage > 70).map(r => r.role);
    const highScoreRoles2 = results2.filter(r => r.percentage > 70).map(r => r.role);
    
    // Find common high-scoring roles
    const commonRoles = highScoreRoles1.filter(role => highScoreRoles2.includes(role));
    const totalRoles = [...new Set([...highScoreRoles1, ...highScoreRoles2])];
    
    if (commonRoles.length > 0) {
      result.score = Math.min(100, (commonRoles.length / totalRoles.length) * 100 + 50);
      result.details.push(`Found ${commonRoles.length} shared high-interest roles`);
      result.suggestions.push("Explore shared role interests together", "Use common roles as foundation for scenes");
    } else {
      result.score = 30;
      result.details.push("No shared high-interest roles found - focus on communication and exploration");
      result.suggestions.push("Discuss role interests openly", "Start with basic BDSM concepts", "Explore role switching");
    }

    return result;
  };

  const analyzeCommunicationCompatibility = (p1, p2) => {
    const result = { score: 75, details: [], conflicts: [], suggestions: [] };
    
    // This would analyze communication patterns, but for now we'll provide general guidance
    result.details.push("Communication is key to successful BDSM relationships");
    result.suggestions.push("Establish regular check-ins", "Use safe words consistently", "Discuss boundaries before scenes");

    return result;
  };

  const generateGrowthAreas = (analysis) => {
    const areas = [];
    
    if (analysis.roleCompatibility.score < 80) {
      areas.push({
        title: "Role Exploration",
        description: "Work on understanding and exploring different role dynamics",
        priority: "High",
        suggestions: ["Practice role switching", "Read about different BDSM roles", "Attend workshops together"]
      });
    }

    if (analysis.intensityCompatibility.score < 70) {
      areas.push({
        title: "Intensity Communication",
        description: "Improve communication about intensity preferences and limits",
        priority: "High",
        suggestions: ["Use intensity scales (1-10)", "Practice gradual intensity increases", "Regular check-ins during activities"]
      });
    }

    if (analysis.kinkCompatibility.score < 60) {
      areas.push({
        title: "Kink Education",
        description: "Learn about different kinks and how to explore them safely",
        priority: "Medium",
        suggestions: ["Research kinks together", "Join BDSM communities", "Attend educational events"]
      });
    }

    return areas;
  };

  const generateSafetyConsiderations = (analysis, profile) => {
    const considerations = [];
    
    if (analysis.intensityCompatibility.score < 50) {
      considerations.push({
        type: "warning",
        title: "Intensity Mismatch",
        description: "Large intensity differences require extra safety measures",
        recommendations: ["Always use safe words", "Start with low intensity", "Regular check-ins"]
      });
    }

    if (profile && profile.bdsmExperience === 'beginner') {
      considerations.push({
        type: "info",
        title: "Beginner Safety",
        description: "As beginners, focus on education and safety",
        recommendations: ["Take BDSM safety courses", "Start with basic activities", "Build trust gradually"]
      });
    }

    considerations.push({
      type: "success",
      title: "Communication Foundation",
      description: "Strong communication is essential for safe BDSM",
      recommendations: ["Establish clear boundaries", "Use safe words", "Regular relationship check-ins"]
    });

    return considerations;
  };

  const generateRecommendedActivities = (analysis, profile) => {
    const activities = [];
    
    if (analysis.roleCompatibility.score >= 80) {
      activities.push({
        title: "Power Exchange Scenes",
        description: "Explore dominant/submissive dynamics",
        difficulty: "Intermediate",
        duration: "30-60 minutes",
        safetyNotes: "Use safe words, establish boundaries"
      });
    }

    if (analysis.intensityCompatibility.score >= 70) {
      activities.push({
        title: "Sensation Play",
        description: "Explore different types of touch and sensation",
        difficulty: "Beginner",
        duration: "20-40 minutes",
        safetyNotes: "Start gentle, communicate preferences"
      });
    }

    activities.push({
      title: "Communication Exercise",
      description: "Practice discussing desires and boundaries",
      difficulty: "Beginner",
      duration: "15-30 minutes",
      safetyNotes: "Safe space, no judgment"
    });

    return activities;
  };

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-400';
    if (score >= 60) return 'text-yellow-400';
    if (score >= 40) return 'text-orange-400';
    return 'text-red-400';
  };

  const getScoreLabel = (score) => {
    if (score >= 80) return 'Excellent';
    if (score >= 60) return 'Good';
    if (score >= 40) return 'Moderate';
    return 'Challenging';
  };

  if (!partner1Results || !partner2Results) {
    return (
      <div className="text-center py-12">
        <div className="mb-6">
          <BarChart3 className="w-16 h-16 text-pink-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Enhanced Compatibility Analysis</h2>
          <p className="text-purple-200 mb-4">Get detailed insights into your BDSM compatibility</p>
        </div>
        
        <div className="glass-effect rounded-2xl p-6 max-w-md mx-auto">
          <div className="text-center">
            <Users className="w-12 h-12 text-purple-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">Partner Results Required</h3>
            <p className="text-purple-200 mb-4">
              To perform enhanced compatibility analysis, you need to fetch results for at least two partners.
            </p>
            <div className="space-y-2 text-sm text-purple-300">
              <p>• Enter test IDs for both partners</p>
              <p>• Click "Fetch Results" to get their data</p>
              <p>• Return here to see detailed analysis</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!analysisData) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-400 mx-auto mb-4"></div>
        <p className="text-purple-200">Analyzing compatibility...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-indigo-900 text-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4 flex items-center justify-center gap-3">
            <BarChart3 className="w-10 h-10 text-pink-400" />
            Enhanced Compatibility Analysis
          </h1>
          <p className="text-purple-200 text-lg">
            Detailed insights into your BDSM compatibility, growth areas, and recommendations
          </p>
        </div>

        {/* Overall Score Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6 mb-8 text-center"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <Heart className="w-8 h-8 text-pink-400" />
            <h2 className="text-3xl font-bold">Overall Compatibility Score</h2>
          </div>
          
          <div className={`text-6xl font-bold mb-2 ${getScoreColor(analysisData.overallScore)}`}>
            {analysisData.overallScore}%
          </div>
          
          <div className="text-xl text-purple-200 mb-4">
            {getScoreLabel(analysisData.overallScore)} Match
          </div>
          
          <div className="text-purple-200">
            {coupleProfile?.coupleName ? `${coupleProfile.coupleName} • ${coupleProfile.bdsmExperience || 'Mixed'} level` : 'Partner Analysis'}
          </div>
        </motion.div>

        {/* Analysis Tabs */}
        <div className="mb-6">
          <div className="flex gap-2 overflow-x-auto pb-2">
            {[
              { id: 'overview', label: 'Overview', icon: BarChart3 },
              { id: 'roles', label: 'Role Compatibility', icon: Users },
              { id: 'intensity', label: 'Intensity', icon: TrendingUp },
              { id: 'kinks', label: 'Kink Interests', icon: Star },
              { id: 'growth', label: 'Growth Areas', icon: Target },
              { id: 'safety', label: 'Safety', icon: Shield },
              { id: 'activities', label: 'Recommended Activities', icon: Lightbulb }
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
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <motion.div
          key={selectedTab}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          {selectedTab === 'overview' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Role Compatibility */}
              <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6">
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <Users className="w-5 h-5 text-blue-400" />
                  Role Compatibility
                </h3>
                <div className={`text-3xl font-bold mb-2 ${getScoreColor(analysisData.roleCompatibility.score)}`}>
                  {analysisData.roleCompatibility.score}%
                </div>
                <div className="text-sm text-purple-200 space-y-2">
                  {analysisData.roleCompatibility.details.map((detail, index) => (
                    <div key={index} className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                      <span>{detail}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Intensity Compatibility */}
              <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6">
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-orange-400" />
                  Intensity Compatibility
                </h3>
                <div className={`text-3xl font-bold mb-2 ${getScoreColor(analysisData.intensityCompatibility.score)}`}>
                  {analysisData.intensityCompatibility.score}%
                </div>
                <div className="text-sm text-purple-200 space-y-2">
                  {analysisData.intensityCompatibility.details.map((detail, index) => (
                    <div key={index} className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                      <span>{detail}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Kink Compatibility */}
              <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6">
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <Star className="w-5 h-5 text-yellow-400" />
                  Kink Compatibility
                </h3>
                <div className={`text-3xl font-bold mb-2 ${getScoreColor(analysisData.kinkCompatibility.score)}`}>
                  {analysisData.kinkCompatibility.score}%
                </div>
                <div className="text-sm text-purple-200 space-y-2">
                  {analysisData.kinkCompatibility.details.map((detail, index) => (
                    <div key={index} className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                      <span>{detail}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Communication */}
              <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6">
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <MessageCircle className="w-5 h-5 text-green-400" />
                  Communication
                </h3>
                <div className={`text-3xl font-bold mb-2 ${getScoreColor(analysisData.communicationCompatibility.score)}`}>
                  {analysisData.communicationCompatibility.score}%
                </div>
                <div className="text-sm text-purple-200 space-y-2">
                  {analysisData.communicationCompatibility.details.map((detail, index) => (
                    <div key={index} className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                      <span>{detail}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {selectedTab === 'roles' && (
            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6">
              <h3 className="text-2xl font-bold mb-6">Role Compatibility Analysis</h3>
              
              <div className="mb-6">
                <div className={`text-4xl font-bold mb-2 ${getScoreColor(analysisData.roleCompatibility.score)}`}>
                  {analysisData.roleCompatibility.score}%
                </div>
                <div className="text-lg text-purple-200 mb-4">
                  {getScoreLabel(analysisData.roleCompatibility.score)} Role Compatibility
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <h4 className="text-lg font-semibold mb-3 text-green-400">Strengths</h4>
                  <div className="space-y-2">
                    {analysisData.roleCompatibility.details.map((detail, index) => (
                      <div key={index} className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-green-400 mt-1 flex-shrink-0" />
                        <span>{detail}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {analysisData.roleCompatibility.conflicts.length > 0 && (
                  <div>
                    <h4 className="text-lg font-semibold mb-3 text-orange-400">Areas of Concern</h4>
                    <div className="space-y-2">
                      {analysisData.roleCompatibility.conflicts.map((conflict, index) => (
                        <div key={index} className="flex items-start gap-2">
                          <AlertTriangle className="w-4 h-4 text-orange-400 mt-1 flex-shrink-0" />
                          <span>{conflict}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div>
                  <h4 className="text-lg font-semibold mb-3 text-blue-400">Suggestions</h4>
                  <div className="space-y-2">
                    {analysisData.roleCompatibility.suggestions.map((suggestion, index) => (
                      <div key={index} className="flex items-start gap-2">
                        <Lightbulb className="w-4 h-4 text-blue-400 mt-1 flex-shrink-0" />
                        <span>{suggestion}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {selectedTab === 'growth' && (
            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6">
              <h3 className="text-2xl font-bold mb-6">Growth Areas & Development</h3>
              
              <div className="space-y-6">
                {analysisData.growthAreas.map((area, index) => (
                  <div key={index} className="border border-white/20 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="text-lg font-semibold">{area.title}</h4>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        area.priority === 'High' ? 'bg-red-500/20 text-red-400' :
                        area.priority === 'Medium' ? 'bg-yellow-500/20 text-yellow-400' :
                        'bg-green-500/20 text-green-400'
                      }`}>
                        {area.priority} Priority
                      </span>
                    </div>
                    
                    <p className="text-purple-200 mb-3">{area.description}</p>
                    
                    <div>
                      <h5 className="text-sm font-medium text-blue-400 mb-2">Suggestions:</h5>
                      <ul className="space-y-1">
                        {area.suggestions.map((suggestion, sIndex) => (
                          <li key={sIndex} className="flex items-start gap-2 text-sm">
                            <Target className="w-3 h-3 text-blue-400 mt-1 flex-shrink-0" />
                            <span>{suggestion}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {selectedTab === 'safety' && (
            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6">
              <h3 className="text-2xl font-bold mb-6">Safety Considerations</h3>
              
              <div className="space-y-6">
                {analysisData.safetyConsiderations.map((consideration, index) => (
                  <div key={index} className={`border rounded-lg p-4 ${
                    consideration.type === 'warning' ? 'border-orange-500/30 bg-orange-500/10' :
                    consideration.type === 'info' ? 'border-blue-500/30 bg-blue-500/10' :
                    'border-green-500/30 bg-green-500/10'
                  }`}>
                    <div className="flex items-center gap-2 mb-3">
                      {consideration.type === 'warning' ? (
                        <AlertTriangle className="w-5 h-5 text-orange-400" />
                      ) : consideration.type === 'info' ? (
                        <MessageCircle className="w-5 h-5 text-blue-400" />
                      ) : (
                        <CheckCircle className="w-5 h-5 text-green-400" />
                      )}
                      <h4 className="text-lg font-semibold">{consideration.title}</h4>
                    </div>
                    
                    <p className="text-purple-200 mb-3">{consideration.description}</p>
                    
                    <div>
                      <h5 className="text-sm font-medium mb-2">Recommendations:</h5>
                      <ul className="space-y-1">
                        {consideration.recommendations.map((rec, rIndex) => (
                          <li key={rIndex} className="flex items-start gap-2 text-sm">
                            <Shield className="w-3 h-3 text-purple-400 mt-1 flex-shrink-0" />
                            <span>{rec}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {selectedTab === 'activities' && (
            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6">
              <h3 className="text-2xl font-bold mb-6">Recommended Activities</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {analysisData.recommendedActivities.map((activity, index) => (
                  <div key={index} className="border border-white/20 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="text-lg font-semibold">{activity.title}</h4>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        activity.difficulty === 'Beginner' ? 'bg-green-500/20 text-green-400' :
                        activity.difficulty === 'Intermediate' ? 'bg-yellow-500/20 text-yellow-400' :
                        'bg-red-500/20 text-red-400'
                      }`}>
                        {activity.difficulty}
                      </span>
                    </div>
                    
                    <p className="text-purple-200 mb-3">{activity.description}</p>
                    
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <span className="text-purple-200">Duration:</span>
                        <span>{activity.duration}</span>
                      </div>
                      
                      <div>
                        <span className="text-purple-200">Safety Notes:</span>
                        <p className="mt-1">{activity.safetyNotes}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default EnhancedCompatibilityAnalysis;
