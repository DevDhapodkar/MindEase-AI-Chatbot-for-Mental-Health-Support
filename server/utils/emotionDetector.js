const natural = require('natural');
const Sentiment = require('sentiment');
const compromise = require('compromise');

class EmotionDetector {
  constructor() {
    this.sentiment = new Sentiment();
    this.tokenizer = new natural.WordTokenizer();
    this.tfidf = new natural.TfIdf();
    
    // Initialize NLP models
    this.initializeNLPModels();
  }

  initializeNLPModels() {
    // Emotional context patterns
    this.emotionalPatterns = {
      relationship: {
        patterns: [
          /(love|like|crush|feelings|romantic|relationship|boyfriend|girlfriend|partner)/i,
          /(doesn't love|doesn't like|not interested|rejected|heartbroken|broken heart)/i,
          /(miss|missing|longing|yearning|want|desire)/i,
          /(girl|boy|person|someone|they|them)/i
        ],
        intensity: {
          high: ['love', 'heartbroken', 'crushed', 'devastated', 'obsessed', 'in love'],
          medium: ['like', 'crush', 'miss', 'want', 'feelings', 'romantic'],
          low: ['interested', 'attracted', 'curious']
        }
      },
      depression: {
        patterns: [
          /(sad|depressed|down|hopeless|worthless|empty|numb|lonely)/i,
          /(can't|cannot|don't|doesn't|won't|wouldn't)/i,
          /(tired|exhausted|drained|overwhelmed)/i,
          /(nobody|no one|alone|isolated)/i,
          /(feel like|feeling like|seems like)/i
        ],
        intensity: {
          high: ['suicidal', 'kill myself', 'end it all', 'worthless', 'hopeless', 'hate myself'],
          medium: ['depressed', 'sad', 'down', 'empty', 'numb', 'lonely', 'hopeless'],
          low: ['tired', 'unmotivated', 'bored', 'meh', 'down']
        }
      },
      anxiety: {
        patterns: [
          /(anxious|worried|nervous|stressed|scared|terrified|panic)/i,
          /(can't breathe|heart racing|overwhelmed|paralyzed)/i,
          /(what if|what happens if|worried about|concerned about)/i,
          /(can't stop thinking|obsessed|overthinking)/i,
          /(future|tomorrow|what if|uncertain)/i
        ],
        intensity: {
          high: ['panic attack', 'cant breathe', 'heart racing', 'terrified', 'paralyzed'],
          medium: ['anxious', 'worried', 'nervous', 'stressed', 'overwhelmed', 'scared'],
          low: ['concerned', 'uneasy', 'restless', 'tense', 'worried']
        }
      },
      crisis: {
        patterns: [
          /(suicide|kill myself|end my life|want to die|hurt myself)/i,
          /(can't go on|give up|tired of life|no point)/i,
          /(emergency|crisis|help me|desperate)/i
        ],
        intensity: {
          high: ['suicide', 'kill myself', 'end my life', 'want to die', 'hurt myself'],
          medium: ['crisis', 'emergency', 'help me', 'cant go on'],
          low: []
        }
      }
    };

    // Context analysis patterns
    this.contextPatterns = {
      temporal: {
        past: /(was|were|had|did|used to|before|yesterday|last)/i,
        present: /(am|is|are|feel|feeling|currently|now|today)/i,
        future: /(will|going to|plan to|hope to|want to|might)/i
      },
      intensity: {
        high: /(very|extremely|really|so|incredibly|absolutely|completely)/i,
        medium: /(quite|rather|somewhat|kind of|sort of)/i,
        low: /(a little|slightly|barely|hardly)/i
      },
      negation: /(not|don't|doesn't|didn't|won't|can't|never|no|none)/i
    };
  }

  analyzeEmotion(text) {
    const normalizedText = text.toLowerCase().trim();
    
    // Advanced NLP analysis
    const nlpAnalysis = this.performNLPAnalysis(normalizedText);
    
    // Contextual understanding
    const contextAnalysis = this.analyzeContext(normalizedText);
    
    // Semantic analysis
    const semanticAnalysis = this.performSemanticAnalysis(normalizedText);
    
    // Calculate overall concern level using multiple factors
    const concernLevel = this.calculateIntelligentConcernLevel(nlpAnalysis, contextAnalysis, semanticAnalysis);
    
    return {
      sentiment: nlpAnalysis.sentiment,
      emotionalContext: nlpAnalysis.emotionalContext,
      context: contextAnalysis,
      semantic: semanticAnalysis,
      concernLevel,
      recommendations: this.getIntelligentRecommendations(concernLevel, nlpAnalysis, contextAnalysis),
      timestamp: new Date().toISOString()
    };
  }

  performNLPAnalysis(text) {
    const doc = compromise(text);
    const sentimentResult = this.sentiment.analyze(text);
    
    // Extract emotional context using NLP
    const emotionalContext = {
      relationships: this.analyzeRelationshipContext(doc, text),
      mentalHealth: this.analyzeMentalHealthContext(doc, text),
      crisis: this.analyzeCrisisContext(doc, text),
      general: this.analyzeGeneralEmotionalContext(doc, text)
    };

    return {
      sentiment: {
        score: sentimentResult.score,
        comparative: sentimentResult.comparative,
        classification: this.classifySentiment(sentimentResult.comparative),
        tokens: sentimentResult.tokens,
        words: sentimentResult.words,
        positive: sentimentResult.positive,
        negative: sentimentResult.negative
      },
      emotionalContext,
      entities: this.extractEntities(doc),
      phrases: this.extractEmotionalPhrases(doc, text)
    };
  }

  analyzeRelationshipContext(doc, text) {
    const relationshipScore = this.calculatePatternScore(text, this.emotionalPatterns.relationship.patterns);
    const intensity = this.calculateIntensity(text, this.emotionalPatterns.relationship.intensity);
    
    return {
      score: relationshipScore,
      intensity,
      hasRejection: /(doesn't|does not|not interested|rejected|turned down)/i.test(text),
      hasLonging: /(miss|missing|longing|yearning|want|desire)/i.test(text),
      hasLove: /(love|in love|feelings|romantic)/i.test(text),
      entities: doc.match('(person|people)').out('array')
    };
  }

  analyzeMentalHealthContext(doc, text) {
    const depressionScore = this.calculatePatternScore(text, this.emotionalPatterns.depression.patterns);
    const anxietyScore = this.calculatePatternScore(text, this.emotionalPatterns.anxiety.patterns);
    
    return {
      depression: {
        score: depressionScore,
        intensity: this.calculateIntensity(text, this.emotionalPatterns.depression.intensity),
        hasHopelessness: /(hopeless|worthless|no point|meaningless)/i.test(text),
        hasIsolation: /(lonely|alone|isolated|no one|nobody)/i.test(text)
      },
      anxiety: {
        score: anxietyScore,
        intensity: this.calculateIntensity(text, this.emotionalPatterns.anxiety.intensity),
        hasPhysicalSymptoms: /(can't breathe|heart racing|sweating|shaking)/i.test(text),
        hasRumination: /(can't stop thinking|obsessed|overthinking)/i.test(text)
      }
    };
  }

  analyzeCrisisContext(doc, text) {
    const crisisScore = this.calculatePatternScore(text, this.emotionalPatterns.crisis.patterns);
    const intensity = this.calculateIntensity(text, this.emotionalPatterns.crisis.intensity);
    
    return {
      score: crisisScore,
      intensity,
      hasSuicidalIdeation: /(suicide|kill myself|end my life|want to die)/i.test(text),
      hasSelfHarm: /(hurt myself|cutting|self harm)/i.test(text),
      hasDesperation: /(can't go on|give up|tired of life|no point)/i.test(text)
    };
  }

  analyzeGeneralEmotionalContext(doc, text) {
    return {
      emotionalIntensity: this.calculateEmotionalIntensity(text),
      temporalContext: this.analyzeTemporalContext(text),
      negationCount: (text.match(/\b(not|don't|doesn't|didn't|won't|can't|never|no)\b/g) || []).length,
      questionCount: (text.match(/\?/g) || []).length,
      exclamationCount: (text.match(/!/g) || []).length
    };
  }

  analyzeContext(text) {
    const doc = compromise(text);
    
    return {
      hasQuestions: text.includes('?'),
      hasNegation: doc.has('#Negative').length > 0,
      futureReferences: doc.has('#Future').length > 0,
      pastReferences: doc.has('#Past').length > 0,
      personalPronouns: doc.has('#Pronoun').length,
      emotionalIntensity: this.calculateEmotionalIntensity(text),
      temporalContext: this.analyzeTemporalContext(text),
      complexity: this.analyzeTextComplexity(text)
    };
  }

  performSemanticAnalysis(text) {
    const tokens = this.tokenizer.tokenize(text);
    const tfidf = new natural.TfIdf();
    tfidf.addDocument(tokens);
    
    return {
      wordCount: tokens.length,
      uniqueWords: new Set(tokens).size,
      averageWordLength: tokens.reduce((sum, word) => sum + word.length, 0) / tokens.length,
      emotionalWords: this.countEmotionalWords(tokens),
      semanticSimilarity: this.calculateSemanticSimilarity(text)
    };
  }

  calculateIntelligentConcernLevel(nlpAnalysis, contextAnalysis, semanticAnalysis) {
    let score = 0;
    const { emotionalContext, sentiment } = nlpAnalysis;

    // Crisis detection (highest priority)
    if (emotionalContext.crisis.score > 0.7 || emotionalContext.crisis.intensity === 'high') {
      return 'crisis';
    }

    // Relationship issues
    if (emotionalContext.relationships.score > 0.6) {
      score += emotionalContext.relationships.intensity === 'high' ? 4 : 3;
    }

    // Mental health concerns
    if (emotionalContext.mentalHealth.depression.score > 0.5) {
      score += emotionalContext.mentalHealth.depression.intensity === 'high' ? 4 : 3;
    }

    if (emotionalContext.mentalHealth.anxiety.score > 0.5) {
      score += emotionalContext.mentalHealth.anxiety.intensity === 'high' ? 4 : 3;
    }

    // Sentiment contribution
    if (sentiment.comparative < -0.3) score += 3;
    else if (sentiment.comparative < -0.1) score += 2;
    else if (sentiment.comparative < 0) score += 1;

    // Context contribution
    if (contextAnalysis.emotionalIntensity.overall > 0.6) score += 2;
    if (contextAnalysis.hasNegation) score += 1;
    if (contextAnalysis.exclamationCount > 2) score += 1;

    // Semantic contribution
    if (semanticAnalysis.emotionalWords > 3) score += 1;

    // Classify concern level
    if (score >= 7) return 'crisis';
    if (score >= 5) return 'high';
    if (score >= 3) return 'medium';
    if (score >= 1) return 'low';
    return 'none';
  }

  calculatePatternScore(text, patterns) {
    return patterns.reduce((score, pattern) => {
      return score + (pattern.test(text) ? 1 : 0);
    }, 0) / patterns.length;
  }

  calculateIntensity(text, intensityLevels) {
    for (const [level, keywords] of Object.entries(intensityLevels)) {
      if (keywords.some(keyword => text.includes(keyword))) {
        return level;
      }
    }
    return 'none';
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

  analyzeTemporalContext(text) {
    const temporal = {
      past: this.contextPatterns.temporal.past.test(text),
      present: this.contextPatterns.temporal.present.test(text),
      future: this.contextPatterns.temporal.future.test(text)
    };
    
    return temporal;
  }

  analyzeTextComplexity(text) {
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
    const words = text.split(/\s+/);
    const avgSentenceLength = words.length / sentences.length;
    
    return {
      sentenceCount: sentences.length,
      avgSentenceLength,
      complexity: avgSentenceLength > 15 ? 'high' : avgSentenceLength > 10 ? 'medium' : 'low'
    };
  }

  countEmotionalWords(tokens) {
    const emotionalWords = [
      'love', 'hate', 'sad', 'happy', 'angry', 'excited', 'worried', 'scared',
      'anxious', 'depressed', 'lonely', 'hopeful', 'desperate', 'confused'
    ];
    
    return tokens.filter(token => emotionalWords.includes(token.toLowerCase())).length;
  }

  calculateSemanticSimilarity(text) {
    // Simple semantic similarity based on emotional word clusters
    const emotionalClusters = {
      positive: ['happy', 'joy', 'excited', 'love', 'hope', 'grateful'],
      negative: ['sad', 'angry', 'depressed', 'anxious', 'worried', 'scared'],
      relationship: ['love', 'crush', 'miss', 'heartbroken', 'rejected'],
      crisis: ['suicide', 'kill', 'die', 'end', 'hopeless', 'worthless']
    };

    const tokens = text.toLowerCase().split(/\s+/);
    const similarities = {};

    for (const [cluster, words] of Object.entries(emotionalClusters)) {
      const matches = tokens.filter(token => words.includes(token)).length;
      similarities[cluster] = matches / words.length;
    }

    return similarities;
  }

  extractEntities(doc) {
    return {
      people: doc.match('(person|people)').out('array'),
      places: doc.match('(place|location)').out('array'),
      organizations: doc.match('(organization|company)').out('array'),
      dates: doc.match('(date|time)').out('array')
    };
  }

  extractEmotionalPhrases(doc, text) {
    const phrases = [];
    
    // Extract emotional phrases using NLP
    const emotionalPhrases = [
      /I feel (.*?)(?=\s|$)/gi,
      /I am (.*?)(?=\s|$)/gi,
      /I'm (.*?)(?=\s|$)/gi,
      /It makes me (.*?)(?=\s|$)/gi
    ];

    emotionalPhrases.forEach(pattern => {
      const matches = text.match(pattern);
      if (matches) {
        phrases.push(...matches);
      }
    });

    return phrases;
  }

  classifySentiment(comparative) {
    if (comparative >= 0.1) return 'positive';
    if (comparative <= -0.1) return 'negative';
    return 'neutral';
  }

  getIntelligentRecommendations(concernLevel, nlpAnalysis, contextAnalysis) {
    const recommendations = {
      resources: [],
      exercises: [],
      immediateActions: [],
      therapeuticApproaches: []
    };

    const { emotionalContext } = nlpAnalysis;

    switch (concernLevel) {
      case 'crisis':
        recommendations.immediateActions = [
          'Please reach out to a crisis helpline immediately',
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

        // Relationship-specific recommendations
        if (emotionalContext.relationships.score > 0.5) {
          recommendations.therapeuticApproaches.push(
            'Cognitive Behavioral Therapy for relationship issues',
            'Self-compassion practices',
            'Building self-worth independent of relationships'
          );
        }

        // Depression-specific recommendations
        if (emotionalContext.mentalHealth.depression.score > 0.5) {
          recommendations.therapeuticApproaches.push(
            'Depression-focused therapy',
            'Behavioral activation techniques',
            'Social connection building'
          );
        }

        // Anxiety-specific recommendations
        if (emotionalContext.mentalHealth.anxiety.score > 0.5) {
          recommendations.therapeuticApproaches.push(
            'Anxiety management techniques',
            'Mindfulness-based stress reduction',
            'Exposure therapy principles'
          );
        }
        break;

      case 'medium':
        if (emotionalContext.mentalHealth.anxiety.score > 0.3) {
          recommendations.exercises.push(
            'Box breathing (4-4-4-4 pattern)',
            'Mindfulness meditation',
            'Body scan relaxation'
          );
        }
        if (emotionalContext.mentalHealth.depression.score > 0.3) {
          recommendations.exercises.push(
            'Gratitude journaling',
            'Gentle physical activity',
            'Connect with nature'
          );
        }
        if (emotionalContext.relationships.score > 0.3) {
          recommendations.exercises.push(
            'Practice self-love affirmations',
            'Focus on your personal growth',
            'Spend time with supportive friends'
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