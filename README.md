# MindEase - AI-Powered Mental Health Support Chatbot

![MindEase Banner](https://img.shields.io/badge/MindEase-AI%20Mental%20Health%20Support-4A90A4?style=for-the-badge&logo=psychology&logoColor=white)

MindEase is an AI-powered chatbot designed to provide empathetic mental health support through real-time emotion detection, personalized resource suggestions, and conversation history analysis. This MVP focuses on privacy-first design while offering meaningful support for users experiencing anxiety, depression, or emotional distress.

## 🌟 Key Features

### 🧠 Real-Time Emotion Detection
- Advanced NLP analysis using sentiment analysis and keyword detection
- Identifies signs of anxiety, depression, and crisis situations
- Contextual understanding of emotional intensity and patterns

### 💬 Empathetic Conversation Flow
- Non-intrusive, friendly conversational interface
- Reflective listening responses
- Tone-appropriate messaging based on emotional state
- Crisis-aware response system

### 📚 Personalized Resource Suggestions
- **Breathing Exercises**: 4-7-8 breathing, box breathing
- **Mindfulness Techniques**: 5-4-3-2-1 grounding, body scan meditation
- **Self-Assessment Tools**: PHQ-9, GAD-7 screening questionnaires
- **Crisis Resources**: 24/7 helplines and emergency contacts

### 🔒 Privacy-Focused Design
- Minimal data storage with user consent
- Temporary conversation storage for session analysis
- No personal identifying information retained
- Clear privacy disclaimers and emergency resources

### 📊 Conversation History & Analysis
- Real-time emotion trend tracking
- Session-based conversation analytics
- Concern level progression monitoring
- Anonymized aggregate insights

## 🛠️ Tech Stack

### Frontend
- **React 18** - Modern UI framework
- **Material-UI (MUI)** - Beautiful, accessible component library
- **Emotion/React** - CSS-in-JS styling
- **Axios** - HTTP client for API communication

### Backend
- **Node.js + Express** - Server framework
- **Natural.js** - Natural language processing
- **Sentiment.js** - Sentiment analysis
- **Compromise.js** - Text analysis and NLP
- **Helmet** - Security middleware
- **CORS** - Cross-origin resource sharing
- **Rate Limiting** - API protection

### Security & Privacy
- **Helmet.js** - Security headers
- **Rate limiting** - DDoS protection
- **CORS configuration** - Secure cross-origin requests
- **Privacy-by-design** - Minimal data collection

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ and npm
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd hack-o-week
   ```

2. **Install dependencies**
   ```bash
   npm run install-deps
   ```

3. **Environment Setup**
   ```bash
   # Copy environment file
   cp server/env.example server/.env
   
   # Edit environment variables as needed
   nano server/.env
   ```

4. **Start the application**
   ```bash
   # Development mode (both frontend and backend)
   npm run dev
   
   # Or run separately:
   # Backend only
   npm run server
   
   # Frontend only  
   npm run client
   ```

5. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5001
   - Health Check: http://localhost:5001/api/health

## 📁 Project Structure

```
mindease/
├── client/                 # React frontend
│   ├── public/            # Static assets
│   ├── src/
│   │   ├── components/    # React components
│   │   │   ├── ChatInterface.js
│   │   │   ├── EmotionInsights.js
│   │   │   ├── ResourcePanel.js
│   │   │   ├── PrivacyNotice.js
│   │   │   └── Header.js
│   │   ├── App.js         # Main app component
│   │   ├── App.css        # Global styles
│   │   └── index.js       # Entry point
│   └── package.json
├── server/                # Node.js backend
│   ├── routes/           # API routes
│   │   ├── chat.js       # Chat endpoints
│   │   ├── history.js    # History analysis
│   │   └── resources.js  # Resource management
│   ├── utils/
│   │   └── emotionDetector.js  # NLP emotion analysis
│   ├── index.js          # Server entry point
│   └── package.json
├── package.json          # Root package configuration
└── README.md
```

## 🔌 API Endpoints

### Chat Management
- `POST /api/chat/start` - Initialize new conversation session
- `POST /api/chat/message` - Send message and get AI response
- `GET /api/chat/suggestions/:concernLevel` - Get conversation prompts

### History & Analytics
- `GET /api/history/session/:sessionId` - Get conversation analysis
- `GET /api/history/trends/:sessionId` - Get emotion trends
- `GET /api/history/stats/anonymous` - Get aggregated statistics
- `DELETE /api/history/session/:sessionId` - Delete conversation data

### Resources & Support
- `GET /api/resources/:category` - Get resources by category
- `POST /api/resources/recommendations` - Get personalized recommendations
- `GET /api/resources/exercises/:type/:name` - Get guided exercise details

### System
- `GET /api/health` - Health check endpoint
- `GET /api/privacy` - Privacy policy and emergency contacts

## 🧪 Emotion Detection System

### Analysis Components
1. **Sentiment Analysis** - Overall emotional tone (-1 to +1 scale)
2. **Keyword Detection** - Mental health indicators by severity
3. **Context Analysis** - Temporal references, negation, intensity
4. **Concern Classification** - None/Low/Medium/High/Crisis levels

### Keywords Tracked
- **Depression**: hopeless, worthless, empty, sad, down
- **Anxiety**: worried, nervous, overwhelmed, panic, scared  
- **Crisis**: suicidal, self-harm, can't go on, end it all

### Response System
- **Crisis Level**: Immediate professional help recommendations
- **High Level**: Therapy suggestions and grounding techniques
- **Medium Level**: Coping strategies and self-care resources
- **Low Level**: Gentle support and wellness tips

## 🔒 Privacy & Security

### Data Protection
- ✅ No personal identifying information stored
- ✅ Conversations stored temporarily for session only
- ✅ Automatic data deletion after session ends
- ✅ Privacy notice required before use
- ✅ User control over data deletion

### Security Measures
- ✅ Rate limiting to prevent abuse
- ✅ CORS protection for API access
- ✅ Security headers via Helmet.js
- ✅ Input validation and sanitization
- ✅ Error handling without data exposure

### Crisis Protocol
- Immediate resource presentation for crisis keywords
- Clear disclaimers about AI limitations
- Emergency contact information prominently displayed
- Escalation recommendations for sustained high concern

## 🌐 Browser Support

- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+

## ♿ Accessibility

- ✅ WCAG 2.1 AA compliance
- ✅ Keyboard navigation support
- ✅ Screen reader compatibility
- ✅ High contrast mode support
- ✅ Reduced motion preferences
- ✅ Focus management

## 🚦 Development Guidelines

### Code Quality
- ESLint configuration for code consistency
- Component-based architecture
- Separation of concerns (UI, business logic, data)
- Error boundaries and graceful degradation

### Testing Strategy
- Unit tests for emotion detection algorithms
- Integration tests for API endpoints
- E2E tests for critical user journeys
- Accessibility testing with automated tools

### Performance Optimization
- Code splitting for faster initial loads
- Lazy loading of non-critical components
- Optimized bundle sizes
- Caching strategies for static resources

## 🔮 Future Enhancements

### Phase 2 Features
- [ ] **Voice Interface** - Speech-to-text and voice responses
- [ ] **Professional Handoff** - Direct connection to licensed therapists
- [ ] **Progress Tracking** - Long-term mood and wellness monitoring
- [ ] **Group Support** - Moderated peer support communities

### Phase 3 Features
- [ ] **Mobile App** - Native iOS/Android applications
- [ ] **Wearable Integration** - Biometric mood correlation
- [ ] **AI Model Training** - Custom models trained on mental health data
- [ ] **Telehealth Integration** - EHR and telemedicine platform connections

## 🆘 Crisis Resources

### United States
- **National Suicide Prevention Lifeline**: 988
- **Crisis Text Line**: Text HOME to 741741
- **SAMHSA National Helpline**: 1-800-662-4357

### United Kingdom
- **Samaritans**: 116 123
- **Crisis Text Line**: Text SHOUT to 85258

### International
- **International Association for Suicide Prevention**: [Crisis Centers Worldwide](https://www.iasp.info/resources/Crisis_Centres/)

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🤝 Contributing

We welcome contributions to improve MindEase! Please read our contributing guidelines and code of conduct before submitting pull requests.

### Development Setup
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Submit a pull request

## 📞 Support

For technical support or questions about MindEase:
- 📧 Email: support@mindease.ai
- 🐛 Issues: [GitHub Issues](https://github.com/mindease/mindease/issues)
- 💬 Discussions: [GitHub Discussions](https://github.com/mindease/mindease/discussions)

---

**⚠️ Important Disclaimer**: MindEase is an AI support tool designed to complement, not replace, professional mental health care. If you are experiencing a mental health crisis, please contact emergency services or a mental health professional immediately.

**Made with ❤️ for mental health awareness and support.**