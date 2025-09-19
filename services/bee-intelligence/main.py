"""
BeeIntelligence - ML & Analysis Service
Handles BDSM compatibility analysis, user profiling, and recommendations
"""

import os
import json
import logging
from datetime import datetime
from typing import Dict, List, Optional
import pandas as pd
import numpy as np
from sklearn.metrics.pairwise import cosine_similarity
from sklearn.cluster import KMeans
from scipy.stats import pearsonr

from fastapi import FastAPI, HTTPException, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import uvicorn
import redis
import httpx

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(
    title="BeeIntelligence",
    description="ML-powered BDSM compatibility analysis and recommendations",
    version="1.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Redis client for caching
try:
    redis_client = redis.Redis(
        host=os.getenv("REDIS_HOST", "bee-redis"),
        port=int(os.getenv("REDIS_PORT", 6379)),
        decode_responses=True
    )
except Exception as e:
    logger.warning(f"Redis connection failed: {e}")
    redis_client = None

# Pydantic models
class BDSMResults(BaseModel):
    user_id: str
    dominance: float
    submission: float
    sadism: float
    masochism: float
    switch: float
    vanilla: float
    bondage: float
    impact: float
    roleplay: float
    fetish: float
    
class UserProfile(BaseModel):
    user_id: str
    name: Optional[str] = None
    age: Optional[int] = None
    experience_level: str = "beginner"  # beginner, intermediate, advanced
    preferences: Dict = {}
    bdsm_results: Optional[BDSMResults] = None

class CompatibilityRequest(BaseModel):
    user1_id: str
    user2_id: str
    user1_results: Optional[BDSMResults] = None
    user2_results: Optional[BDSMResults] = None

class CompatibilityResponse(BaseModel):
    compatibility_score: float
    detailed_analysis: Dict
    recommendations: List[str]
    match_areas: List[str]
    growth_areas: List[str]

# ML Analysis Functions
class BDSMAnalyzer:
    def __init__(self):
        self.bdsm_dimensions = [
            'dominance', 'submission', 'sadism', 'masochism', 'switch',
            'vanilla', 'bondage', 'impact', 'roleplay', 'fetish'
        ]
    
    def calculate_compatibility(self, results1: BDSMResults, results2: BDSMResults) -> CompatibilityResponse:
        """Calculate comprehensive compatibility between two users"""
        
        # Convert to numpy arrays for analysis
        vector1 = np.array([getattr(results1, dim) for dim in self.bdsm_dimensions])
        vector2 = np.array([getattr(results2, dim) for dim in self.bdsm_dimensions])
        
        # Cosine similarity for overall compatibility
        similarity = cosine_similarity([vector1], [vector2])[0][0]
        
        # Pearson correlation for preference alignment
        correlation, _ = pearsonr(vector1, vector2)
        
        # Dominance/Submission complementarity
        dom_sub_compat = self._analyze_dom_sub_compatibility(results1, results2)
        
        # Sadism/Masochism complementarity
        sad_mas_compat = self._analyze_sad_mas_compatibility(results1, results2)
        
        # Calculate weighted compatibility score
        compatibility_score = (
            similarity * 0.4 +
            max(0, correlation) * 0.3 +
            dom_sub_compat * 0.2 +
            sad_mas_compat * 0.1
        )
        
        # Generate detailed analysis
        detailed_analysis = {
            "overall_similarity": float(similarity),
            "preference_correlation": float(correlation),
            "dom_sub_compatibility": dom_sub_compat,
            "sad_mas_compatibility": sad_mas_compat,
            "dimension_analysis": self._analyze_dimensions(vector1, vector2)
        }
        
        # Generate recommendations
        recommendations = self._generate_recommendations(results1, results2, compatibility_score)
        
        # Identify match and growth areas
        match_areas = self._identify_match_areas(vector1, vector2)
        growth_areas = self._identify_growth_areas(vector1, vector2)
        
        return CompatibilityResponse(
            compatibility_score=compatibility_score,
            detailed_analysis=detailed_analysis,
            recommendations=recommendations,
            match_areas=match_areas,
            growth_areas=growth_areas
        )
    
    def _analyze_dom_sub_compatibility(self, r1: BDSMResults, r2: BDSMResults) -> float:
        """Analyze dominance/submission complementarity"""
        # High dom + high sub = good match
        # High dom + low sub = potentially challenging
        # Balanced approach considering switch tendencies
        
        dom_align = (r1.dominance * r2.submission) + (r2.dominance * r1.submission)
        switch_factor = (r1.switch + r2.switch) / 2
        
        return min(1.0, dom_align + switch_factor * 0.3)
    
    def _analyze_sad_mas_compatibility(self, r1: BDSMResults, r2: BDSMResults) -> float:
        """Analyze sadism/masochism complementarity"""
        sad_mas_align = (r1.sadism * r2.masochism) + (r2.sadism * r1.masochism)
        return min(1.0, sad_mas_align)
    
    def _analyze_dimensions(self, v1: np.ndarray, v2: np.ndarray) -> Dict:
        """Analyze compatibility across all dimensions"""
        analysis = {}
        for i, dim in enumerate(self.bdsm_dimensions):
            diff = abs(v1[i] - v2[i])
            compatibility = 1 - diff  # Lower difference = higher compatibility
            analysis[dim] = {
                "user1_score": float(v1[i]),
                "user2_score": float(v2[i]),
                "difference": float(diff),
                "compatibility": float(compatibility)
            }
        return analysis
    
    def _generate_recommendations(self, r1: BDSMResults, r2: BDSMResults, score: float) -> List[str]:
        """Generate personalized recommendations based on compatibility analysis"""
        recommendations = []
        
        if score > 0.8:
            recommendations.extend([
                "🔥 Excellent compatibility! You share very similar interests and energy levels.",
                "💝 Consider exploring advanced scenarios together.",
                "🌟 Your preferences align well - try creating custom scenarios."
            ])
        elif score > 0.6:
            recommendations.extend([
                "✨ Good compatibility with room for exploration.",
                "💬 Focus on communication about preferences and boundaries.",
                "🎯 Explore areas where you both show moderate interest."
            ])
        else:
            recommendations.extend([
                "🤝 Different preferences can lead to interesting growth.",
                "📚 Consider starting with educational content together.",
                "💕 Focus on vanilla connection and communication first."
            ])
        
        # Specific recommendations based on dimensions
        if max(r1.dominance, r2.dominance) > 0.7 and max(r1.submission, r2.submission) > 0.7:
            recommendations.append("⚡ Great D/s potential - explore power exchange scenarios.")
        
        if r1.bondage > 0.6 and r2.bondage > 0.6:
            recommendations.append("🪢 Both interested in bondage - start with silk ties or soft restraints.")
        
        return recommendations
    
    def _identify_match_areas(self, v1: np.ndarray, v2: np.ndarray) -> List[str]:
        """Identify areas where both users score high"""
        match_areas = []
        for i, dim in enumerate(self.bdsm_dimensions):
            if v1[i] > 0.6 and v2[i] > 0.6:
                match_areas.append(dim.title())
        return match_areas
    
    def _identify_growth_areas(self, v1: np.ndarray, v2: np.ndarray) -> List[str]:
        """Identify areas where preferences differ significantly"""
        growth_areas = []
        for i, dim in enumerate(self.bdsm_dimensions):
            if abs(v1[i] - v2[i]) > 0.4:
                growth_areas.append(dim.title())
        return growth_areas

# Initialize analyzer
analyzer = BDSMAnalyzer()

# API Endpoints
@app.get("/health")
async def health_check():
    return {
        "status": "ok",
        "service": "bee-intelligence",
        "timestamp": datetime.utcnow().isoformat(),
        "ml_ready": True
    }

@app.post("/api/analyze/compatibility", response_model=CompatibilityResponse)
async def analyze_compatibility(request: CompatibilityRequest):
    """Analyze compatibility between two users"""
    try:
        # If results not provided, try to fetch from cache/database
        if not request.user1_results or not request.user2_results:
            raise HTTPException(status_code=400, detail="BDSM results required for both users")
        
        # Perform ML analysis
        compatibility = analyzer.calculate_compatibility(
            request.user1_results,
            request.user2_results
        )
        
        # Cache result if Redis is available
        if redis_client:
            cache_key = f"compatibility:{request.user1_id}:{request.user2_id}"
            redis_client.setex(cache_key, 3600, compatibility.json())  # Cache for 1 hour
        
        return compatibility
        
    except Exception as e:
        logger.error(f"Compatibility analysis error: {e}")
        raise HTTPException(status_code=500, detail="Analysis failed")

@app.post("/api/analyze/results")
async def analyze_results(results: BDSMResults):
    """Analyze individual BDSM test results"""
    try:
        # Convert to vector for analysis
        vector = np.array([getattr(results, dim) for dim in analyzer.bdsm_dimensions])
        
        # Determine primary traits
        primary_traits = []
        for i, score in enumerate(vector):
            if score > 0.7:
                primary_traits.append(analyzer.bdsm_dimensions[i])
        
        # Determine user type
        user_type = "Versatile"
        if results.dominance > 0.7:
            user_type = "Dominant"
        elif results.submission > 0.7:
            user_type = "Submissive"
        elif results.switch > 0.7:
            user_type = "Switch"
        elif results.vanilla > 0.7:
            user_type = "Vanilla"
        
        analysis = {
            "user_id": results.user_id,
            "primary_traits": primary_traits,
            "user_type": user_type,
            "intensity_level": float(np.mean(vector)),
            "trait_distribution": {dim: float(getattr(results, dim)) for dim in analyzer.bdsm_dimensions},
            "recommendations": [
                f"Your primary interest area appears to be {user_type.lower()}",
                f"Consider exploring: {', '.join(primary_traits[:3])}",
                "Remember: all exploration should be safe, sane, and consensual"
            ]
        }
        
        return analysis
        
    except Exception as e:
        logger.error(f"Results analysis error: {e}")
        raise HTTPException(status_code=500, detail="Analysis failed")

@app.get("/api/recommendations/{user_id}")
async def get_recommendations(user_id: str):
    """Get personalized recommendations for a user"""
    try:
        # In a real implementation, this would fetch user data from database
        # For now, return generic recommendations
        
        recommendations = {
            "user_id": user_id,
            "educational_content": [
                "Introduction to BDSM Safety",
                "Communication in Kink Relationships",
                "Consent and Negotiation"
            ],
            "starter_activities": [
                "Light bondage with silk ties",
                "Sensory play with ice and feathers",
                "Role-playing scenarios"
            ],
            "advanced_activities": [
                "Impact play techniques",
                "Advanced rope bondage",
                "Psychological dominance/submission"
            ]
        }
        
        return recommendations
        
    except Exception as e:
        logger.error(f"Recommendations error: {e}")
        raise HTTPException(status_code=500, detail="Failed to generate recommendations")

@app.post("/api/profiles")
async def create_profile(profile: UserProfile):
    """Create or update user profile"""
    try:
        # In a real implementation, save to database
        logger.info(f"Profile created/updated for user: {profile.user_id}")
        
        return {
            "status": "success",
            "user_id": profile.user_id,
            "timestamp": datetime.utcnow().isoformat()
        }
        
    except Exception as e:
        logger.error(f"Profile creation error: {e}")
        raise HTTPException(status_code=500, detail="Profile creation failed")

@app.get("/api/profiles/{user_id}")
async def get_profile(user_id: str):
    """Get user profile"""
    try:
        # In a real implementation, fetch from database
        # For now, return a mock profile
        
        profile = {
            "user_id": user_id,
            "name": f"User {user_id}",
            "experience_level": "intermediate",
            "last_analysis": datetime.utcnow().isoformat(),
            "compatibility_matches": 5,
            "preferences": {
                "primary_interests": ["bondage", "roleplay"],
                "experience_level": "intermediate",
                "looking_for": "exploration"
            }
        }
        
        return profile
        
    except Exception as e:
        logger.error(f"Profile retrieval error: {e}")
        raise HTTPException(status_code=404, detail="Profile not found")

if __name__ == "__main__":
    port = int(os.getenv("PORT", 8080))
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=port,
        reload=False,
        log_level="info"
    )
