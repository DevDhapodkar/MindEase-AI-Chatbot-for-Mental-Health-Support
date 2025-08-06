import React, { useState, useEffect } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline, Container, Paper, Box } from '@mui/material';
import ChatInterface from './components/ChatInterface';
import Header from './components/Header';
import PrivacyNotice from './components/PrivacyNotice';
import ResourcePanel from './components/ResourcePanel';
import EmotionInsights from './components/EmotionInsights';
import { v4 as uuidv4 } from 'uuid';
import './App.css';

const theme = createTheme({
  palette: {
    primary: {
      main: '#4A90A4',
      light: '#7BB3C1',
      dark: '#2F5F6F'
    },
    secondary: {
      main: '#8FBC8F',
      light: '#B5D8B5',
      dark: '#5A8A5A'
    },
    background: {
      default: '#F8FFFE',
      paper: '#FFFFFF'
    },
    text: {
      primary: '#2C3E50',
      secondary: '#5D6D7E'
    },
    success: {
      main: '#27AE60'
    },
    warning: {
      main: '#F39C12'
    },
    error: {
      main: '#E74C3C'
    }
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h4: {
      fontWeight: 600,
      color: '#2C3E50'
    },
    h6: {
      fontWeight: 500,
      color: '#34495E'
    },
    body1: {
      lineHeight: 1.6
    }
  },
  shape: {
    borderRadius: 12
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
        }
      }
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 25,
          padding: '10px 24px'
        }
      }
    }
  }
});

function App() {
  const [sessionId, setSessionId] = useState(null);
  const [showPrivacyNotice, setShowPrivacyNotice] = useState(true);
  const [currentEmotionInsights, setCurrentEmotionInsights] = useState(null);
  const [recommendations, setRecommendations] = useState(null);
  const [showResourcePanel, setShowResourcePanel] = useState(false);

  useEffect(() => {
    // Check if user has already accepted privacy notice
    const privacyAccepted = localStorage.getItem('mindease_privacy_accepted');
    if (privacyAccepted) {
      setShowPrivacyNotice(false);
      initializeSession();
    }
  }, []);

  const initializeSession = async () => {
    try {
      const response = await fetch('/api/chat/start', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          userId: localStorage.getItem('mindease_user_id') || uuidv4()
        })
      });

      if (response.ok) {
        const data = await response.json();
        setSessionId(data.sessionId);
        
        // Store user ID for future sessions
        if (!localStorage.getItem('mindease_user_id')) {
          localStorage.setItem('mindease_user_id', uuidv4());
        }
      }
    } catch (error) {
      console.error('Failed to initialize session:', error);
    }
  };

  const handlePrivacyAccept = () => {
    localStorage.setItem('mindease_privacy_accepted', 'true');
    setShowPrivacyNotice(false);
    initializeSession();
  };

  const handleEmotionUpdate = (insights, recs) => {
    setCurrentEmotionInsights(insights);
    setRecommendations(recs);
    
    // Auto-show resource panel for medium+ concern levels
    if (insights && ['medium', 'high', 'crisis'].includes(insights.concernLevel)) {
      setShowResourcePanel(true);
    }
  };

  const handleNewSession = () => {
    setSessionId(null);
    setCurrentEmotionInsights(null);
    setRecommendations(null);
    setShowResourcePanel(false);
    initializeSession();
  };

  if (showPrivacyNotice) {
    return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <PrivacyNotice onAccept={handlePrivacyAccept} />
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ 
        minHeight: '100vh', 
        background: 'linear-gradient(135deg, #F8FFFE 0%, #E8F6F3 100%)',
        py: 2
      }}>
        <Container maxWidth="lg">
          <Header onNewSession={handleNewSession} />
          
          <Box sx={{ 
            display: 'grid', 
            gridTemplateColumns: { xs: '1fr', lg: '1fr 300px' },
            gap: 2,
            mt: 2
          }}>
            {/* Main Chat Area */}
            <Paper sx={{ 
              height: '70vh', 
              display: 'flex', 
              flexDirection: 'column',
              overflow: 'hidden'
            }}>
              {sessionId ? (
                <ChatInterface 
                  sessionId={sessionId}
                  onEmotionUpdate={handleEmotionUpdate}
                />
              ) : (
                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  height: '100%',
                  color: 'text.secondary'
                }}>
                  Initializing MindEase...
                </Box>
              )}
            </Paper>

            {/* Side Panel */}
            <Box sx={{ 
              display: 'flex', 
              flexDirection: 'column', 
              gap: 2,
              height: '70vh'
            }}>
              {/* Emotion Insights */}
              {currentEmotionInsights && (
                <EmotionInsights 
                  insights={currentEmotionInsights}
                  recommendations={recommendations}
                />
              )}

              {/* Resource Panel */}
              <ResourcePanel 
                show={showResourcePanel}
                recommendations={recommendations}
                onClose={() => setShowResourcePanel(false)}
              />
            </Box>
          </Box>
        </Container>
      </Box>
    </ThemeProvider>
  );
}

export default App;