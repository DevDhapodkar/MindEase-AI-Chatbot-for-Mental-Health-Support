const express = require('express');
const router = express.Router();

// In-memory storage (same as chat.js - in production, use shared database)
const conversations = new Map();

// Get conversation history for analysis
router.get('/session/:sessionId', (req, res) => {
  try {
    const { sessionId } = req.params;
    const conversation = conversations.get(sessionId);

    if (!conversation) {
      return res.status(404).json({ error: 'Conversation not found' });
    }

    // Prepare anonymized history for analysis
    const analysis = {
      sessionId,
      startTime: conversation.startTime,
      duration: calculateDuration(conversation.startTime),
      totalTurns: conversation.turns.length,
      emotionTrends: conversation.emotionTrends,
      concernLevelProgression: analyzeConcernProgression(conversation.emotionTrends),
      keyTopics: extractKeyTopics(conversation.turns),
      riskAssessment: assessRisk(conversation.turns),
      recommendations: generateSessionRecommendations(conversation)
    };

    res.json(analysis);

  } catch (error) {
    console.error('History retrieval error:', error);
    res.status(500).json({ error: 'Unable to retrieve conversation history' });
  }
});

// Get emotion trends over time
router.get('/trends/:sessionId', (req, res) => {
  try {
    const { sessionId } = req.params;
    const conversation = conversations.get(sessionId);

    if (!conversation) {
      return res.status(404).json({ error: 'Conversation not found' });
    }

    const trends = {
      sentimentOverTime: conversation.emotionTrends.map(trend => ({
        timestamp: trend.timestamp,
        sentiment: trend.sentimentScore,
        concernLevel: trend.concernLevel
      })),
      averageSentiment: calculateAverageSentiment(conversation.emotionTrends),
      concernLevelDistribution: calculateConcernDistribution(conversation.emotionTrends),
      progressionAnalysis: analyzeEmotionalProgression(conversation.emotionTrends)
    };

    res.json(trends);

  } catch (error) {
    console.error('Trends analysis error:', error);
    res.status(500).json({ error: 'Unable to analyze trends' });
  }
});

// Get aggregated statistics (anonymized)
router.get('/stats/anonymous', (req, res) => {
  try {
    const allConversations = Array.from(conversations.values());
    
    const stats = {
      totalSessions: allConversations.length,
      averageSessionLength: calculateAverageSessionLength(allConversations),
      concernLevelDistribution: calculateOverallConcernDistribution(allConversations),
      commonTopics: extractCommonTopics(allConversations),
      peakActivityTimes: analyzePeakTimes(allConversations),
      improvementTrends: analyzeImprovementTrends(allConversations)
    };

    res.json(stats);

  } catch (error) {
    console.error('Statistics error:', error);
    res.status(500).json({ error: 'Unable to generate statistics' });
  }
});

// Delete conversation history (privacy compliance)
router.delete('/session/:sessionId', (req, res) => {
  try {
    const { sessionId } = req.params;
    
    if (conversations.has(sessionId)) {
      conversations.delete(sessionId);
      res.json({ message: 'Conversation history deleted successfully' });
    } else {
      res.status(404).json({ error: 'Conversation not found' });
    }

  } catch (error) {
    console.error('Deletion error:', error);
    res.status(500).json({ error: 'Unable to delete conversation history' });
  }
});

// Helper functions for analysis
function calculateDuration(startTime) {
  const start = new Date(startTime);
  const now = new Date();
  return Math.round((now - start) / (1000 * 60)); // Duration in minutes
}

function analyzeConcernProgression(trends) {
  if (trends.length < 2) return 'insufficient_data';

  const concernLevels = { none: 0, low: 1, medium: 2, high: 3, crisis: 4 };
  const progression = trends.map(trend => concernLevels[trend.concernLevel] || 0);
  
  const first = progression.slice(0, Math.ceil(progression.length / 3));
  const last = progression.slice(-Math.ceil(progression.length / 3));
  
  const firstAvg = first.reduce((a, b) => a + b, 0) / first.length;
  const lastAvg = last.reduce((a, b) => a + b, 0) / last.length;
  
  if (lastAvg < firstAvg - 0.5) return 'improving';
  if (lastAvg > firstAvg + 0.5) return 'worsening';
  return 'stable';
}

function extractKeyTopics(turns) {
  const topics = [];
  turns.forEach(turn => {
    const analysis = turn.emotionAnalysis;
    if (analysis.keywords.depression.level !== 'none') topics.push('depression');
    if (analysis.keywords.anxiety.level !== 'none') topics.push('anxiety');
    if (analysis.keywords.crisis.level !== 'none') topics.push('crisis');
  });
  
  // Count frequency and return top topics
  const topicCounts = topics.reduce((acc, topic) => {
    acc[topic] = (acc[topic] || 0) + 1;
    return acc;
  }, {});
  
  return Object.entries(topicCounts)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 3)
    .map(([topic, count]) => ({ topic, frequency: count }));
}

function assessRisk(turns) {
  const latestTurns = turns.slice(-3); // Last 3 turns
  const crisisIndicators = latestTurns.filter(turn => 
    turn.emotionAnalysis.concernLevel === 'crisis'
  ).length;
  
  const highConcernIndicators = latestTurns.filter(turn => 
    turn.emotionAnalysis.concernLevel === 'high'
  ).length;

  if (crisisIndicators > 0) return { level: 'high', reason: 'Crisis indicators detected' };
  if (highConcernIndicators >= 2) return { level: 'medium', reason: 'Sustained high concern levels' };
  return { level: 'low', reason: 'No immediate risk indicators' };
}

function generateSessionRecommendations(conversation) {
  const risk = assessRisk(conversation.turns);
  const topics = extractKeyTopics(conversation.turns);
  const progression = analyzeConcernProgression(conversation.emotionTrends);

  const recommendations = [];

  if (risk.level === 'high') {
    recommendations.push({
      priority: 'urgent',
      action: 'Suggest professional help immediately',
      reason: 'Crisis indicators detected'
    });
  }

  if (progression === 'worsening') {
    recommendations.push({
      priority: 'high',
      action: 'Monitor closely and suggest additional resources',
      reason: 'Emotional state declining over conversation'
    });
  }

  topics.forEach(topicData => {
    if (topicData.topic === 'anxiety' && topicData.frequency > 2) {
      recommendations.push({
        priority: 'medium',
        action: 'Provide anxiety management techniques',
        reason: 'Recurring anxiety themes'
      });
    }
    if (topicData.topic === 'depression' && topicData.frequency > 2) {
      recommendations.push({
        priority: 'medium',
        action: 'Suggest mood tracking and professional support',
        reason: 'Recurring depression themes'
      });
    }
  });

  return recommendations;
}

function calculateAverageSentiment(trends) {
  if (trends.length === 0) return 0;
  return trends.reduce((sum, trend) => sum + trend.sentimentScore, 0) / trends.length;
}

function calculateConcernDistribution(trends) {
  const distribution = { none: 0, low: 0, medium: 0, high: 0, crisis: 0 };
  trends.forEach(trend => {
    distribution[trend.concernLevel]++;
  });
  return distribution;
}

function analyzeEmotionalProgression(trends) {
  if (trends.length < 3) return 'insufficient_data';
  
  const recentTrends = trends.slice(-5); // Last 5 data points
  const sentiments = recentTrends.map(t => t.sentimentScore);
  
  // Simple linear regression to detect trend
  const n = sentiments.length;
  const x = Array.from({length: n}, (_, i) => i);
  const sumX = x.reduce((a, b) => a + b, 0);
  const sumY = sentiments.reduce((a, b) => a + b, 0);
  const sumXY = x.reduce((sum, xi, i) => sum + xi * sentiments[i], 0);
  const sumXX = x.reduce((sum, xi) => sum + xi * xi, 0);
  
  const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
  
  if (slope > 0.02) return 'improving';
  if (slope < -0.02) return 'declining';
  return 'stable';
}

function calculateAverageSessionLength(conversations) {
  if (conversations.length === 0) return 0;
  return conversations.reduce((sum, conv) => sum + conv.turns.length, 0) / conversations.length;
}

function calculateOverallConcernDistribution(conversations) {
  const distribution = { none: 0, low: 0, medium: 0, high: 0, crisis: 0 };
  conversations.forEach(conv => {
    conv.emotionTrends.forEach(trend => {
      distribution[trend.concernLevel]++;
    });
  });
  return distribution;
}

function extractCommonTopics(conversations) {
  const allTopics = [];
  conversations.forEach(conv => {
    const topics = extractKeyTopics(conv.turns);
    topics.forEach(topic => allTopics.push(topic.topic));
  });
  
  const topicCounts = allTopics.reduce((acc, topic) => {
    acc[topic] = (acc[topic] || 0) + 1;
    return acc;
  }, {});
  
  return Object.entries(topicCounts)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 5)
    .map(([topic, count]) => ({ topic, count }));
}

function analyzePeakTimes(conversations) {
  const hourCounts = new Array(24).fill(0);
  conversations.forEach(conv => {
    const hour = new Date(conv.startTime).getHours();
    hourCounts[hour]++;
  });
  
  const maxCount = Math.max(...hourCounts);
  const peakHours = hourCounts
    .map((count, hour) => ({ hour, count }))
    .filter(({ count }) => count > maxCount * 0.8)
    .map(({ hour }) => hour);
    
  return peakHours;
}

function analyzeImprovementTrends(conversations) {
  const progressions = conversations.map(conv => 
    analyzeConcernProgression(conv.emotionTrends)
  ).filter(prog => prog !== 'insufficient_data');
  
  const counts = progressions.reduce((acc, prog) => {
    acc[prog] = (acc[prog] || 0) + 1;
    return acc;
  }, {});
  
  return counts;
}

module.exports = router;