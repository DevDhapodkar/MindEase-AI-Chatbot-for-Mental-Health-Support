const express = require('express');
const { v4: uuidv4 } = require('uuid');
const EmotionDetector = require('../utils/emotionDetector');

const router = express.Router();
const emotionDetector = new EmotionDetector();

// In-memory conversation storage (replace with database in production)
const conversations = new Map();

// Generate empathetic responses based on emotion analysis
const generateResponse = (emotionAnalysis, userMessage) => {
  const { concernLevel, keywords, sentiment } = emotionAnalysis;
  
  let response = '';
  let tone = 'supportive';

  switch (concernLevel) {
    case 'crisis':
      tone = 'urgent';
      response = "I'm really concerned about what you're going through right now. Your feelings are valid, but I want to make sure you're safe. ";
      if (keywords.crisis.matches.length > 0) {
        response += "Please reach out to a crisis helpline immediately - they have trained professionals who can help you through this. ";
      }
      response += "You don't have to face this alone. Would you like me to share some immediate support resources?";
      break;

    case 'high':
      tone = 'caring';
      response = "It sounds like you're going through a really difficult time. I can hear the pain in your words, and I want you to know that what you're feeling matters. ";
      if (keywords.depression.level === 'high') {
        response += "These feelings of hopelessness can feel overwhelming, but they are temporary. ";
      }
      if (keywords.anxiety.level === 'high') {
        response += "I can sense how anxious you're feeling right now. ";
      }
      response += "Would you like to talk more about what's happening, or would you prefer some coping strategies that might help?";
      break;

    case 'medium':
      tone = 'understanding';
      if (keywords.anxiety.level !== 'none') {
        response = "I can hear that you're feeling anxious about this. That's completely understandable given what you're dealing with. ";
      } else if (keywords.depression.level !== 'none') {
        response = "It sounds like you're having a tough time right now. Those feelings are valid and it's okay to not feel okay sometimes. ";
      } else {
        response = "Thank you for sharing that with me. It takes courage to open up about how you're feeling. ";
      }
      response += "Would you like to explore this further, or would some gentle coping techniques be helpful?";
      break;

    case 'low':
      tone = 'gentle';
      response = "I hear you. Sometimes even small challenges can feel significant, and that's completely normal. ";
      if (sentiment.classification === 'negative') {
        response += "It's okay to have days that don't feel great. ";
      }
      response += "Is there anything specific that's been on your mind lately?";
      break;

    default:
      tone = 'neutral';
      if (sentiment.classification === 'positive') {
        response = "It's wonderful to hear something positive from you! Those moments of feeling good are important to acknowledge and celebrate. ";
      } else {
        response = "Thank you for sharing with me. I'm here to listen and support you in whatever way I can. ";
      }
      response += "How has your day been treating you?";
  }

  return { text: response, tone, suggestions: emotionAnalysis.recommendations };
};

// Chat endpoint
router.post('/message', async (req, res) => {
  try {
    const { message, sessionId = uuidv4(), userId = null } = req.body;

    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'Message is required and must be a string' });
    }

    // Analyze emotion in the message
    const emotionAnalysis = emotionDetector.analyzeEmotion(message);
    
    // Generate appropriate response
    const botResponse = generateResponse(emotionAnalysis, message);
    
    // Store conversation turn
    const conversationTurn = {
      id: uuidv4(),
      timestamp: new Date().toISOString(),
      userMessage: message,
      botResponse: botResponse.text,
      emotionAnalysis,
      sessionId,
      userId
    };

    // Get or create conversation history
    if (!conversations.has(sessionId)) {
      conversations.set(sessionId, {
        sessionId,
        startTime: new Date().toISOString(),
        turns: [],
        emotionTrends: [],
        userId
      });
    }

    const conversation = conversations.get(sessionId);
    conversation.turns.push(conversationTurn);
    
    // Track emotion trends
    conversation.emotionTrends.push({
      timestamp: conversationTurn.timestamp,
      concernLevel: emotionAnalysis.concernLevel,
      sentimentScore: emotionAnalysis.sentiment.comparative
    });

    // Prepare response
    const response = {
      botResponse: botResponse.text,
      tone: botResponse.tone,
      sessionId,
      emotionInsights: {
        concernLevel: emotionAnalysis.concernLevel,
        sentiment: emotionAnalysis.sentiment.classification,
        detectedConcerns: Object.keys(emotionAnalysis.keywords)
          .filter(key => key !== 'positive' && emotionAnalysis.keywords[key].level !== 'none')
          .map(key => ({ type: key, level: emotionAnalysis.keywords[key].level }))
      },
      recommendations: emotionAnalysis.recommendations,
      conversationLength: conversation.turns.length
    };

    // Add crisis warning if needed
    if (emotionAnalysis.concernLevel === 'crisis') {
      response.crisisWarning = {
        message: "This conversation indicates potential crisis. Professional help is strongly recommended.",
        resources: emotionAnalysis.recommendations.resources
      };
    }

    res.json(response);

  } catch (error) {
    console.error('Chat error:', error);
    res.status(500).json({ 
      error: 'Unable to process message',
      botResponse: "I'm sorry, I'm having trouble processing your message right now. If you're in crisis, please contact emergency services or a mental health helpline immediately."
    });
  }
});

// Get conversation suggestions
router.get('/suggestions/:concernLevel', (req, res) => {
  const { concernLevel } = req.params;
  
  const suggestions = {
    low: [
      "How are you feeling today?",
      "What's one thing that made you smile recently?",
      "Tell me about something you're looking forward to."
    ],
    medium: [
      "Would you like to talk about what's been bothering you?",
      "How long have you been feeling this way?",
      "What usually helps you feel better?"
    ],
    high: [
      "I'm here to listen. What's the hardest part right now?",
      "Have you been able to talk to anyone about this?",
      "What feels most overwhelming today?"
    ],
    crisis: [
      "Are you safe right now?",
      "Is there someone you can call?",
      "Would you like me to help you find immediate support?"
    ]
  };

  res.json({ 
    suggestions: suggestions[concernLevel] || suggestions.low,
    concernLevel 
  });
});

// Start new conversation
router.post('/start', (req, res) => {
  const sessionId = uuidv4();
  const { userId = null } = req.body;

  conversations.set(sessionId, {
    sessionId,
    startTime: new Date().toISOString(),
    turns: [],
    emotionTrends: [],
    userId
  });

  res.json({
    sessionId,
    welcomeMessage: "Hello! I'm MindEase, an AI companion here to support your mental wellness. I'm here to listen without judgment and help you explore your feelings. How are you doing today?",
    disclaimer: "Please remember that I'm not a replacement for professional mental health care. If you're experiencing a crisis, please contact emergency services or a mental health professional."
  });
});

module.exports = router;