const express = require('express');
const router = express.Router();

// Mental health resources categorized by type and urgency
const resources = {
  crisis: {
    immediate: [
      {
        name: "National Suicide Prevention Lifeline",
        contact: "988",
        description: "24/7 crisis support and suicide prevention",
        country: "US",
        type: "phone"
      },
      {
        name: "Crisis Text Line",
        contact: "Text HOME to 741741",
        description: "24/7 crisis support via text",
        country: "US",
        type: "text"
      },
      {
        name: "Samaritans",
        contact: "116 123",
        description: "24/7 emotional support",
        country: "UK",
        type: "phone"
      },
      {
        name: "Emergency Services",
        contact: "911 (US), 999 (UK), 112 (EU)",
        description: "For immediate life-threatening emergencies",
        country: "Multiple",
        type: "emergency"
      }
    ],
    international: [
      {
        name: "International Association for Suicide Prevention",
        contact: "https://www.iasp.info/resources/Crisis_Centres/",
        description: "Crisis centers worldwide",
        country: "Global",
        type: "website"
      }
    ]
  },
  professional: {
    therapy: [
      {
        name: "Psychology Today",
        contact: "https://www.psychologytoday.com",
        description: "Find licensed therapists in your area",
        country: "US/Canada",
        type: "directory"
      },
      {
        name: "BetterHelp",
        contact: "https://www.betterhelp.com",
        description: "Online therapy platform",
        country: "Multiple",
        type: "online"
      },
      {
        name: "NHS Mental Health Services",
        contact: "https://www.nhs.uk/mental-health/",
        description: "UK public mental health services",
        country: "UK",
        type: "public"
      }
    ],
    assessment: [
      {
        name: "PHQ-9 Depression Screening",
        description: "Self-assessment for depression symptoms",
        questions: [
          "Little interest or pleasure in doing things",
          "Feeling down, depressed, or hopeless",
          "Trouble falling or staying asleep, or sleeping too much",
          "Feeling tired or having little energy",
          "Poor appetite or overeating",
          "Feeling bad about yourself",
          "Trouble concentrating on things",
          "Moving or speaking slowly, or being fidgety",
          "Thoughts that you would be better off dead"
        ],
        scoring: "0-4: Minimal, 5-9: Mild, 10-14: Moderate, 15-19: Moderately severe, 20-27: Severe"
      },
      {
        name: "GAD-7 Anxiety Screening",
        description: "Self-assessment for anxiety symptoms",
        questions: [
          "Feeling nervous, anxious, or on edge",
          "Not being able to stop or control worrying",
          "Worrying too much about different things",
          "Trouble relaxing",
          "Being so restless that it's hard to sit still",
          "Becoming easily annoyed or irritable",
          "Feeling afraid as if something awful might happen"
        ],
        scoring: "0-4: Minimal, 5-9: Mild, 10-14: Moderate, 15-21: Severe"
      }
    ]
  },
  selfCare: {
    breathing: [
      {
        name: "4-7-8 Breathing",
        description: "Inhale for 4, hold for 7, exhale for 8 counts",
        instructions: [
          "Sit comfortably with your back straight",
          "Place your tongue against the roof of your mouth",
          "Exhale completely through your mouth",
          "Close your mouth and inhale through your nose for 4 counts",
          "Hold your breath for 7 counts",
          "Exhale through your mouth for 8 counts",
          "Repeat 3-4 times"
        ],
        duration: "2-3 minutes"
      },
      {
        name: "Box Breathing",
        description: "4-4-4-4 breathing pattern for anxiety relief",
        instructions: [
          "Inhale for 4 counts",
          "Hold for 4 counts",
          "Exhale for 4 counts",
          "Hold empty for 4 counts",
          "Repeat 5-10 times"
        ],
        duration: "3-5 minutes"
      }
    ],
    grounding: [
      {
        name: "5-4-3-2-1 Technique",
        description: "Use your senses to ground yourself in the present",
        instructions: [
          "5 things you can see",
          "4 things you can touch",
          "3 things you can hear",
          "2 things you can smell",
          "1 thing you can taste"
        ],
        duration: "5-10 minutes"
      },
      {
        name: "Progressive Muscle Relaxation",
        description: "Tense and release muscle groups systematically",
        instructions: [
          "Start with your toes, tense for 5 seconds",
          "Release and notice the relaxation",
          "Move up through each muscle group",
          "End with your face and scalp",
          "Focus on the contrast between tension and relaxation"
        ],
        duration: "10-15 minutes"
      }
    ],
    mindfulness: [
      {
        name: "Body Scan Meditation",
        description: "Mindful awareness of physical sensations",
        instructions: [
          "Lie down comfortably",
          "Start at the top of your head",
          "Slowly move attention down your body",
          "Notice sensations without judgment",
          "Include each part of your body"
        ],
        duration: "10-20 minutes"
      },
      {
        name: "Loving-Kindness Meditation",
        description: "Cultivate compassion for yourself and others",
        instructions: [
          "Start with yourself: 'May I be happy, may I be healthy'",
          "Extend to loved ones",
          "Include neutral people",
          "Include difficult people",
          "Extend to all beings"
        ],
        duration: "10-15 minutes"
      }
    ]
  },
  educational: {
    articles: [
      {
        title: "Understanding Depression",
        url: "https://www.nimh.nih.gov/health/topics/depression",
        source: "NIMH",
        description: "Comprehensive information about depression symptoms, causes, and treatments"
      },
      {
        title: "Anxiety Disorders",
        url: "https://www.nimh.nih.gov/health/topics/anxiety-disorders",
        source: "NIMH",
        description: "Types of anxiety disorders and treatment options"
      }
    ],
    apps: [
      {
        name: "Headspace",
        description: "Meditation and mindfulness app",
        features: ["Guided meditations", "Sleep stories", "Mindful exercises"]
      },
      {
        name: "Calm",
        description: "Meditation, sleep, and relaxation app",
        features: ["Daily calm sessions", "Sleep stories", "Nature sounds"]
      },
      {
        name: "Sanvello",
        description: "Anxiety and mood tracking",
        features: ["Mood tracking", "Coping toolbox", "Guided lessons"]
      }
    ]
  }
};

// Get resources by category and concern level
router.get('/:category', (req, res) => {
  try {
    const { category } = req.params;
    const { concernLevel = 'medium', country = 'US' } = req.query;

    if (!resources[category]) {
      return res.status(404).json({ error: 'Resource category not found' });
    }

    let filteredResources = resources[category];

    // Filter by country if applicable
    if (category === 'crisis') {
      filteredResources = {
        ...filteredResources,
        immediate: filteredResources.immediate.filter(resource => 
          resource.country === country || resource.country === 'Multiple' || resource.country === 'Global'
        )
      };
    }

    res.json({
      category,
      concernLevel,
      resources: filteredResources,
      disclaimer: "These resources are provided for informational purposes. In case of emergency, contact local emergency services immediately."
    });

  } catch (error) {
    console.error('Resource retrieval error:', error);
    res.status(500).json({ error: 'Unable to retrieve resources' });
  }
});

// Get personalized recommendations based on emotion analysis
router.post('/recommendations', (req, res) => {
  try {
    const { emotionAnalysis, userPreferences = {}, sessionHistory = [] } = req.body;

    if (!emotionAnalysis) {
      return res.status(400).json({ error: 'Emotion analysis required' });
    }

    const recommendations = generatePersonalizedRecommendations(
      emotionAnalysis, 
      userPreferences, 
      sessionHistory
    );

    res.json({
      recommendations,
      timestamp: new Date().toISOString(),
      disclaimer: "These recommendations are based on your current emotional state. Please consult a mental health professional for personalized advice."
    });

  } catch (error) {
    console.error('Recommendation error:', error);
    res.status(500).json({ error: 'Unable to generate recommendations' });
  }
});

// Get guided exercise by type
router.get('/exercises/:type/:name', (req, res) => {
  try {
    const { type, name } = req.params;

    if (!resources.selfCare[type]) {
      return res.status(404).json({ error: 'Exercise type not found' });
    }

    const exercise = resources.selfCare[type].find(ex => 
      ex.name.toLowerCase().replace(/\s+/g, '-') === name.toLowerCase()
    );

    if (!exercise) {
      return res.status(404).json({ error: 'Exercise not found' });
    }

    res.json({
      exercise,
      category: type,
      additionalTips: getExerciseTips(type, exercise)
    });

  } catch (error) {
    console.error('Exercise retrieval error:', error);
    res.status(500).json({ error: 'Unable to retrieve exercise' });
  }
});

// Helper function to generate personalized recommendations
function generatePersonalizedRecommendations(emotionAnalysis, preferences, history) {
  const { concernLevel, keywords, sentiment } = emotionAnalysis;
  const recommendations = {
    immediate: [],
    exercises: [],
    resources: [],
    professional: []
  };

  // Crisis level recommendations
  if (concernLevel === 'crisis') {
    recommendations.immediate = resources.crisis.immediate.slice(0, 3);
    recommendations.professional.push({
      urgency: 'immediate',
      action: 'Contact crisis helpline or emergency services',
      reasoning: 'Crisis indicators detected in conversation'
    });
    return recommendations;
  }

  // High concern level
  if (concernLevel === 'high') {
    recommendations.professional.push({
      urgency: 'high',
      action: 'Consider scheduling appointment with mental health professional',
      reasoning: 'Sustained high concern levels detected'
    });
  }

  // Anxiety-specific recommendations
  if (keywords.anxiety.level !== 'none') {
    recommendations.exercises.push(
      ...resources.selfCare.breathing.slice(0, 2),
      resources.selfCare.grounding[0]
    );
  }

  // Depression-specific recommendations
  if (keywords.depression.level !== 'none') {
    recommendations.exercises.push(
      ...resources.selfCare.mindfulness,
      resources.selfCare.grounding[1]
    );
    recommendations.resources.push(resources.educational.apps[2]); // Sanvello for mood tracking
  }

  // General negative sentiment
  if (sentiment.classification === 'negative' && concernLevel === 'medium') {
    recommendations.exercises.push(
      resources.selfCare.mindfulness[1], // Loving-kindness
      resources.selfCare.breathing[0]
    );
  }

  // Positive sentiment reinforcement
  if (sentiment.classification === 'positive') {
    recommendations.exercises.push({
      name: "Gratitude Practice",
      description: "Strengthen positive emotions through gratitude",
      instructions: [
        "Write down 3 things you're grateful for today",
        "Reflect on why each one matters to you",
        "Notice the positive feelings this brings",
        "Consider sharing your gratitude with someone"
      ],
      duration: "5-10 minutes"
    });
  }

  // Add educational resources based on history
  if (history.length > 3) {
    recommendations.resources.push(...resources.educational.articles);
  }

  return recommendations;
}

function getExerciseTips(type, exercise) {
  const tips = {
    breathing: [
      "Find a quiet, comfortable space",
      "Don't worry if your mind wanders, gently return to the breath",
      "Start with shorter sessions and gradually increase",
      "Practice regularly for best results"
    ],
    grounding: [
      "Use this technique anywhere when feeling overwhelmed",
      "Take your time with each step",
      "There's no right or wrong way to do this",
      "Focus on the present moment"
    ],
    mindfulness: [
      "Approach with curiosity, not judgment",
      "It's normal for thoughts to arise - acknowledge and let them pass",
      "Consistency is more important than duration",
      "Be patient and kind with yourself"
    ]
  };

  return tips[type] || [];
}

module.exports = router;