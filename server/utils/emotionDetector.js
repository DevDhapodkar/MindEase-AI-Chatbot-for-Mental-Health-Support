const natural = require('natural');
const Sentiment = require('sentiment');
const compromise = require('compromise');

class EmotionDetector {
  constructor() {
    this.sentiment = new Sentiment();
    
    // Mental health keywords categorized by concern level
    this.keywords = {
      depression: {
        high: ['suicidal', 'kill myself', 'end it all', 'worthless', 'hopeless', 'hate myself'],
        medium: ['depressed', 'sad', 'down', 'empty', 'numb', 'lonely', 'isolated'],
        low: ['tired', 'unmotivated', 'bored', 'meh', 'blah']
      },
      anxiety: {
        high: ['panic attack', 'cant breathe', 'heart racing', 'terrified', 'paralyzed'],
        medium: ['anxious', 'worried', 'nervous', 'stressed', 'overwhelmed', 'scared'],
        low: ['concerned', 'uneasy', 'restless', 'tense']
      },
      crisis: {
        high: ['suicide', 'self harm', 'hurt myself', 'cutting', 'overdose', 'jump'],
        medium: ['crisis', 'emergency', 'help me', 'cant go on'],
        low: []
      }
    };

    // Positive indicators
    this.positiveKeywords = [
      'happy', 'good', 'great', 'excellent', 'wonderful', 'amazing',
      'excited', 'grateful', 'thankful', 'blessed', 'content', 'peaceful'
    ];
  }

  analyzeEmotion(text) {
    const normalizedText = text.toLowerCase().trim();
    
    // Basic sentiment analysis
    const sentimentResult = this.sentiment.analyze(normalizedText);
    
    // Keyword detection
    const keywordResults = this.detectKeywords(normalizedText);
    
    // Contextual analysis
    const contextAnalysis = this.analyzeContext(normalizedText);
    
    // Calculate overall concern level
    const concernLevel = this.calculateConcernLevel(sentimentResult, keywordResults, contextAnalysis);
    
    return {
      sentiment: {
        score: sentimentResult.score,
        comparative: sentimentResult.comparative,
        classification: this.classifySentiment(sentimentResult.comparative)
      },
      keywords: keywordResults,
      context: contextAnalysis,
      concernLevel,
      recommendations: this.getRecommendations(concernLevel, keywordResults),
      timestamp: new Date().toISOString()
    };
  }

  detectKeywords(text) {
    const results = {
      depression: { level: 'none', matches: [] },
      anxiety: { level: 'none', matches: [] },
      crisis: { level: 'none', matches: [] },
      positive: { matches: [] }
    };

    // Check for mental health keywords
    Object.keys(this.keywords).forEach(category => {
      Object.keys(this.keywords[category]).forEach(level => {
        this.keywords[category][level].forEach(keyword => {
          if (text.includes(keyword)) {
            results[category].matches.push(keyword);
            if (results[category].level === 'none' || 
                (level === 'high' && results[category].level !== 'high') ||
                (level === 'medium' && results[category].level === 'low')) {
              results[category].level = level;
            }
          }
        });
      });
    });

    // Check for positive keywords
    this.positiveKeywords.forEach(keyword => {
      if (text.includes(keyword)) {
        results.positive.matches.push(keyword);
      }
    });

    return results;
  }

  analyzeContext(text) {
    const doc = compromise(text);
    
    return {
      hasQuestions: text.includes('?'),
      hasNegation: doc.has('#Negative'),
      futureReferences: doc.has('#Future').length > 0,
      pastReferences: doc.has('#Past').length > 0,
      personalPronouns: doc.has('#Pronoun').length,
      emotionalIntensity: this.calculateEmotionalIntensity(text)
    };
  }

  calculateEmotionalIntensity(text) {
    const intensifiers = ['very', 'extremely', 'really', 'so', 'incredibly', 'absolutely'];
    const caps = (text.match(/[A-Z]/g) || []).length;
    const exclamations = (text.match(/!/g) || []).length;
    const intensifierCount = intensifiers.reduce((count, word) => {
      return count + (text.toLowerCase().split(word).length - 1);
    }, 0);

    return {
      intensifierWords: intensifierCount,
      capsUsage: caps / text.length,
      exclamationPoints: exclamations,
      overall: Math.min((intensifierCount + caps * 0.1 + exclamations) / 10, 1)
    };
  }

  classifySentiment(comparative) {
    if (comparative >= 0.1) return 'positive';
    if (comparative <= -0.1) return 'negative';
    return 'neutral';
  }

  calculateConcernLevel(sentiment, keywords, context) {
    let score = 0;

    // Sentiment contribution
    if (sentiment.comparative < -0.3) score += 3;
    else if (sentiment.comparative < -0.1) score += 2;
    else if (sentiment.comparative < 0) score += 1;

    // Keywords contribution
    if (keywords.crisis.level === 'high') score += 5;
    else if (keywords.crisis.level === 'medium') score += 4;
    
    if (keywords.depression.level === 'high') score += 4;
    else if (keywords.depression.level === 'medium') score += 3;
    else if (keywords.depression.level === 'low') score += 1;

    if (keywords.anxiety.level === 'high') score += 4;
    else if (keywords.anxiety.level === 'medium') score += 3;
    else if (keywords.anxiety.level === 'low') score += 1;

    // Context contribution
    if (context.emotionalIntensity.overall > 0.5) score += 2;
    if (context.hasNegation) score += 1;

    // Positive adjustment
    if (keywords.positive.matches.length > 0) score = Math.max(0, score - 2);

    // Classify concern level
    if (score >= 7) return 'crisis';
    if (score >= 5) return 'high';
    if (score >= 3) return 'medium';
    if (score >= 1) return 'low';
    return 'none';
  }

  getRecommendations(concernLevel, keywords) {
    const recommendations = {
      resources: [],
      exercises: [],
      immediateActions: []
    };

    switch (concernLevel) {
      case 'crisis':
        recommendations.immediateActions = [
          'Please consider reaching out to a crisis helpline immediately',
          'Contact emergency services if you are in immediate danger',
          'Reach out to a trusted friend, family member, or mental health professional'
        ];
        recommendations.resources = [
          'National Suicide Prevention Lifeline: 988',
          'Crisis Text Line: Text HOME to 741741',
          'International Association for Suicide Prevention'
        ];
        break;

      case 'high':
        recommendations.immediateActions = [
          'Consider speaking with a mental health professional',
          'Reach out to someone you trust',
          'Practice grounding techniques'
        ];
        recommendations.exercises = [
          '5-4-3-2-1 grounding technique',
          'Deep breathing exercises',
          'Progressive muscle relaxation'
        ];
        break;

      case 'medium':
        if (keywords.anxiety.level !== 'none') {
          recommendations.exercises.push(
            'Box breathing (4-4-4-4 pattern)',
            'Mindfulness meditation',
            'Body scan relaxation'
          );
        }
        if (keywords.depression.level !== 'none') {
          recommendations.exercises.push(
            'Gratitude journaling',
            'Gentle physical activity',
            'Connect with nature'
          );
        }
        break;

      case 'low':
        recommendations.exercises = [
          'Take a few deep breaths',
          'Write down your thoughts',
          'Listen to calming music'
        ];
        break;
    }

    return recommendations;
  }
}

module.exports = EmotionDetector;