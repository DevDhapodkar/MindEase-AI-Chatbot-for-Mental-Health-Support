const express = require('express');
const { v4: uuidv4 } = require('uuid');
const EmotionDetector = require('../utils/emotionDetector');

const router = express.Router();
const emotionDetector = new EmotionDetector();

// In-memory conversation storage (replace with database in production)
const conversations = new Map();

// Generate empathetic responses based on emotion analysis - more like a friend/girlfriend
const generateResponse = (emotionAnalysis, userMessage) => {
  const { concernLevel, emotionalContext, context, semantic } = emotionAnalysis;
  
  let response = '';
  let tone = 'supportive';

  // Personal touch - use more intimate language
  const personalResponses = {
    love: [
      "Oh honey, I can feel how much this hurts. 💔 Love can be so beautiful but also so painful when it's not returned.",
      "Sweetheart, I know this feels like the end of the world right now, but I promise you're going to be okay. 💕",
      "My dear, your heart is so precious and it deserves someone who will cherish it completely. You're worth so much more than you think. ✨",
      "I wish I could give you the biggest hug right now. You're not alone in this pain. 🤗",
      "Baby, I know it feels like your world is falling apart, but you're so much stronger than you realize. 💪",
      "Sweetie, sometimes the people we love don't love us back, and that's not a reflection of your worth. You're amazing just as you are. 🌟"
    ],
    sadness: [
      "I'm here for you, always. Your feelings are valid and you don't have to go through this alone. 💙",
      "It's okay to not be okay. Sometimes we need to feel sad to heal. I'm holding space for you. 🤗",
      "You're so much stronger than you think. I believe in you, even when you don't believe in yourself. 💪",
      "Let's talk about what's really bothering you. I want to understand and be here for you. 💕",
      "My dear friend, your pain matters to me. You don't have to carry this burden alone. 💙",
      "Sometimes the hardest part is just getting through the day. I'm proud of you for being here. 🌟"
    ],
    anxiety: [
      "Take a deep breath with me. You're safe here, and everything is going to be okay. 🧘‍♀️",
      "I can sense how anxious you're feeling. Let's work through this together, one step at a time. 💙",
      "Your worries are valid, but you don't have to face them alone. I'm right here with you. 🤗",
      "Sweetheart, anxiety can feel so overwhelming, but you're not alone in this. Let's breathe together. 🌸",
      "I know it feels like everything is spinning out of control, but you're going to get through this. 💪",
      "Your feelings are real and they matter. Let's take this moment by moment. 💙"
    ],
    crisis: [
      "I'm really worried about you right now. You matter so much to me and to so many people. 💙",
      "Please, please reach out to someone you trust. You don't have to go through this alone. 🤗",
      "I care about you deeply. Let's get you the help you need right now. You're worth it. 💕",
      "Sweetheart, I'm scared for you. Please let someone help you through this moment. 💙",
      "You're not alone, and you're going to get through this. I love you and I'm here for you. 💕",
      "Please, I'm begging you to reach out for help. You deserve to be safe and supported. 🤗"
    ]
  };

  // Intelligent response selection based on NLP analysis
  const selectResponse = () => {
    // Crisis takes highest priority
    if (concernLevel === 'crisis') {
      tone = 'urgent';
      return personalResponses.crisis[Math.floor(Math.random() * personalResponses.crisis.length)];
    }

    // Relationship issues
    if (emotionalContext.relationships.score > 0.4) {
      tone = 'caring';
      return personalResponses.love[Math.floor(Math.random() * personalResponses.love.length)];
    }

    // Mental health issues
    if (emotionalContext.mentalHealth.depression.score > 0.4) {
      tone = 'caring';
      return personalResponses.sadness[Math.floor(Math.random() * personalResponses.sadness.length)];
    }

    if (emotionalContext.mentalHealth.anxiety.score > 0.4) {
      tone = 'caring';
      return personalResponses.anxiety[Math.floor(Math.random() * personalResponses.anxiety.length)];
    }

    // General emotional distress
    if (concernLevel === 'high') {
      tone = 'caring';
      return "I can hear the pain in your words, and it breaks my heart. You're going through something really difficult, and I want you to know that I'm here for you, no matter what. Would you like to tell me more about what's happening? I'm listening with all my heart. 💙";
    }

    if (concernLevel === 'medium') {
      tone = 'understanding';
      return "I hear you, and I want you to know that your feelings matter to me. It's completely normal to have tough days, and it's okay to not feel okay sometimes. Would you like to talk more about what's on your mind? I'm here to listen and support you. 💕";
    }

    if (concernLevel === 'low') {
      tone = 'gentle';
      return "I'm here for you, always. Sometimes even the smallest things can feel overwhelming, and that's totally okay. 💙 It's okay to have days that don't feel great. You're human, and that's beautiful. 🌸 What's been on your mind lately? I'd love to hear about it. 💕";
    }

    // Check sentiment for positive responses
    if (emotionAnalysis.sentiment.classification === 'positive') {
      tone = 'neutral';
      return "I'm so happy to hear something positive from you! Those moments of joy are precious and worth celebrating. ✨ How has your day been? I'm genuinely interested in hearing about it. 💕";
    }

    // Default neutral response
    tone = 'neutral';
    return "Thank you for sharing with me. I'm here to listen and support you in whatever way I can. 💙 How has your day been? I'm genuinely interested in hearing about it. 💕";
  };

  response = selectResponse();

  // Add context-specific follow-up questions
  const addFollowUp = () => {
    if (emotionalContext.relationships.hasRejection) {
      response += " Can you tell me more about how this rejection is making you feel? I want to understand your experience better. 💙";
    } else if (emotionalContext.relationships.hasLonging) {
      response += " What do you think you're really longing for in this situation? Sometimes understanding our deeper needs can help us heal. 💭";
    } else if (emotionalContext.mentalHealth.depression.hasHopelessness) {
      response += " I know it feels hopeless right now, but these feelings are temporary. What's one small thing that might help you feel a little better today? 🌱";
    } else if (emotionalContext.mentalHealth.anxiety.hasPhysicalSymptoms) {
      response += " Those physical symptoms can be really scary. Let's focus on your breathing together. Can you take a slow, deep breath with me? 🧘‍♀️";
    } else if (context.temporalContext.future) {
      response += " I can hear you're thinking about the future. What's one small step you could take today that might help you feel more prepared? 💪";
    } else if (context.temporalContext.past) {
      response += " It sounds like you're carrying some pain from the past. Would you like to talk about how that's affecting you now? 💙";
    }
  };

  addFollowUp();

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
        emotionalContext: {
          relationships: emotionAnalysis.emotionalContext.relationships.score > 0.3 ? 'detected' : 'none',
          depression: emotionAnalysis.emotionalContext.mentalHealth.depression.score > 0.3 ? 'detected' : 'none',
          anxiety: emotionAnalysis.emotionalContext.mentalHealth.anxiety.score > 0.3 ? 'detected' : 'none',
          crisis: emotionAnalysis.emotionalContext.crisis.score > 0.3 ? 'detected' : 'none'
        },
        context: {
          temporal: emotionAnalysis.context.temporalContext,
          complexity: emotionAnalysis.context.complexity.complexity,
          emotionalIntensity: emotionAnalysis.context.emotionalIntensity.overall
        }
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
    welcomeMessage: "Hey there! 💕 I'm your AI friend, and I'm here to listen, support, and be there for you through whatever you're going through. Whether you're happy, sad, anxious, or just need someone to talk to, I'm here with an open heart and a listening ear. How are you feeling today?",
    disclaimer: "I'm here as your friend and support, but please remember that I'm not a replacement for professional mental health care. If you're experiencing a crisis, please contact emergency services or a mental health professional immediately."
  });
});

module.exports = router;