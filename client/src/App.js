import React, { useState, useEffect } from 'react';
import { ChakraProvider } from '@chakra-ui/react';
import { Box, Container } from '@chakra-ui/react';
import ChatInterface from './components/ChatInterface';
import Header from './components/Header';
import PrivacyNotice from './components/PrivacyNotice';
import ResourcePanel from './components/ResourcePanel';
import EmotionInsights from './components/EmotionInsights';
import { v4 as uuidv4 } from 'uuid';
import './App.css';

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
      <ChakraProvider>
        <PrivacyNotice onAccept={handlePrivacyAccept} />
      </ChakraProvider>
    );
  }

  return (
    <ChakraProvider>
      <Box 
        minH="100vh" 
        py={4}
        bg="linear-gradient(135deg, #F8FFFE 0%, #E8F6F3 100%)"
      >
        <Container maxW="7xl">
          <Header onNewSession={handleNewSession} />
          
          <Box 
            display={{ base: 'flex', lg: 'grid' }}
            flexDirection={{ base: 'column', lg: 'unset' }}
            gridTemplateColumns={{ lg: '1fr 300px' }}
            gap={6}
            mt={6}
          >
            {/* Main Chat Area */}
            <Box
              bg="white"
              borderRadius="xl"
              boxShadow="0 4px 20px rgba(0,0,0,0.08)"
              border="1px solid"
              borderColor="gray.100"
              h={{ base: '70vh', lg: '75vh' }}
              display="flex"
              flexDirection="column"
              overflow="hidden"
            >
              {sessionId ? (
                <ChatInterface 
                  sessionId={sessionId}
                  onEmotionUpdate={handleEmotionUpdate}
                />
              ) : (
                <Box 
                  display="flex" 
                  alignItems="center" 
                  justifyContent="center"
                  h="100%"
                  color="gray.500"
                  fontSize="lg"
                >
                  Initializing MindEase...
                </Box>
              )}
            </Box>

            {/* Side Panel */}
            <Box 
              display="flex" 
              flexDirection="column" 
              gap={4}
              h={{ base: 'auto', lg: '75vh' }}
            >
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
    </ChakraProvider>
  );
}

export default App;