import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Typography,
  TextField,
  IconButton,
  Paper,
  Avatar,
  Chip,
  CircularProgress,
  Alert,
  Fade
} from '@mui/material';
import {
  Send as SendIcon,
  Psychology as PsychologyIcon,
  Person as PersonIcon,
  Warning as WarningIcon
} from '@mui/icons-material';

const ChatInterface = ({ sessionId, onEmotionUpdate }) => {
  const [messages, setMessages] = useState([]);
  const [currentMessage, setCurrentMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [error, setError] = useState(null);
  const [welcomeMessage, setWelcomeMessage] = useState('');
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (sessionId) {
      // Initialize with welcome message
      setWelcomeMessage("Hello! I'm MindEase, an AI companion here to support your mental wellness. I'm here to listen without judgment and help you explore your feelings. How are you doing today?");
      setMessages([{
        id: 'welcome',
        type: 'bot',
        text: "Hello! I'm MindEase, an AI companion here to support your mental wellness. I'm here to listen without judgment and help you explore your feelings. How are you doing today?",
        timestamp: new Date().toISOString(),
        tone: 'welcoming'
      }]);
    }
  }, [sessionId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async () => {
    if (!currentMessage.trim() || isLoading) return;

    const userMessage = {
      id: Date.now().toString(),
      type: 'user',
      text: currentMessage,
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMessage]);
    setCurrentMessage('');
    setIsLoading(true);
    setIsTyping(true);
    setError(null);

    try {
      const response = await fetch('/api/chat/message', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          message: currentMessage,
          sessionId
        })
      });

      if (!response.ok) {
        throw new Error('Failed to send message');
      }

      const data = await response.json();

      // Simulate typing delay for more natural feel
      setTimeout(() => {
        setIsTyping(false);
        
        const botMessage = {
          id: Date.now().toString() + '_bot',
          type: 'bot',
          text: data.botResponse,
          timestamp: new Date().toISOString(),
          tone: data.tone,
          emotionInsights: data.emotionInsights,
          recommendations: data.recommendations,
          crisisWarning: data.crisisWarning
        };

        setMessages(prev => [...prev, botMessage]);
        
        // Update parent component with emotion insights
        if (onEmotionUpdate) {
          onEmotionUpdate(data.emotionInsights, data.recommendations);
        }

        setIsLoading(false);
      }, 1000 + Math.random() * 1000); // Random delay between 1-2 seconds

    } catch (error) {
      console.error('Chat error:', error);
      setError('Sorry, I\'m having trouble processing your message. Please try again.');
      setIsLoading(false);
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const getConcernLevelColor = (level) => {
    switch (level) {
      case 'crisis': return 'error';
      case 'high': return 'warning';
      case 'medium': return 'info';
      case 'low': return 'success';
      default: return 'default';
    }
  };

  const getToneIcon = (tone) => {
    switch (tone) {
      case 'urgent':
      case 'crisis':
        return <WarningIcon sx={{ fontSize: 16, color: 'error.main' }} />;
      default:
        return <PsychologyIcon sx={{ fontSize: 16, color: 'primary.main' }} />;
    }
  };

  return (
    <Box sx={{ 
      height: '100%', 
      display: 'flex', 
      flexDirection: 'column',
      position: 'relative'
    }}>
      {/* Chat Messages */}
      <Box sx={{ 
        flex: 1, 
        overflow: 'auto', 
        p: 2,
        className: 'chat-container'
      }}>
        {messages.map((message, index) => (
          <Fade in={true} key={message.id} timeout={300}>
            <Box sx={{ 
              mb: 2,
              display: 'flex',
              flexDirection: message.type === 'user' ? 'row-reverse' : 'row',
              alignItems: 'flex-start',
              gap: 1
            }}>
              {/* Avatar */}
              <Avatar sx={{ 
                bgcolor: message.type === 'user' ? 'primary.main' : 'secondary.main',
                width: 36,
                height: 36
              }}>
                {message.type === 'user' ? <PersonIcon /> : getToneIcon(message.tone)}
              </Avatar>

              {/* Message Content */}
              <Paper sx={{ 
                p: 2,
                maxWidth: '70%',
                bgcolor: message.type === 'user' ? 'primary.light' : 'background.paper',
                color: message.type === 'user' ? 'white' : 'text.primary',
                borderRadius: message.type === 'user' ? '18px 18px 4px 18px' : '18px 18px 18px 4px'
              }}>
                <Typography variant="body1" sx={{ mb: 1 }}>
                  {message.text}
                </Typography>

                {/* Crisis Warning */}
                {message.crisisWarning && (
                  <Alert severity="error" sx={{ mt: 2, fontSize: '0.85rem' }}>
                    <Typography variant="body2" fontWeight="bold">
                      {message.crisisWarning.message}
                    </Typography>
                  </Alert>
                )}

                {/* Emotion Insights */}
                {message.emotionInsights && (
                  <Box sx={{ mt: 1, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                    {message.emotionInsights.concernLevel !== 'none' && (
                      <Chip
                        size="small"
                        label={`${message.emotionInsights.concernLevel} concern`}
                        color={getConcernLevelColor(message.emotionInsights.concernLevel)}
                        variant="outlined"
                      />
                    )}
                    {message.emotionInsights.sentiment !== 'neutral' && (
                      <Chip
                        size="small"
                        label={`${message.emotionInsights.sentiment} sentiment`}
                        variant="outlined"
                      />
                    )}
                    {message.emotionInsights.detectedConcerns?.map(concern => (
                      <Chip
                        key={concern.type}
                        size="small"
                        label={`${concern.type}: ${concern.level}`}
                        variant="outlined"
                        color="info"
                      />
                    ))}
                  </Box>
                )}

                <Typography variant="caption" sx={{ 
                  display: 'block', 
                  mt: 1, 
                  opacity: 0.7,
                  fontSize: '0.75rem'
                }}>
                  {new Date(message.timestamp).toLocaleTimeString()}
                </Typography>
              </Paper>
            </Box>
          </Fade>
        ))}

        {/* Typing Indicator */}
        {isTyping && (
          <Box sx={{ 
            display: 'flex',
            alignItems: 'flex-start',
            gap: 1,
            mb: 2
          }}>
            <Avatar sx={{ 
              bgcolor: 'secondary.main',
              width: 36,
              height: 36
            }}>
              <PsychologyIcon />
            </Avatar>
            <Paper sx={{ 
              p: 2,
              bgcolor: 'background.paper',
              borderRadius: '18px 18px 18px 4px'
            }}>
              <Box className="typing-indicator">
                <Typography variant="body2" sx={{ mr: 1, color: 'text.secondary' }}>
                  MindEase is typing
                </Typography>
                <Box className="typing-dots">
                  <Box className="typing-dot" />
                  <Box className="typing-dot" />
                  <Box className="typing-dot" />
                </Box>
              </Box>
            </Paper>
          </Box>
        )}

        <div ref={messagesEndRef} />
      </Box>

      {/* Error Display */}
      {error && (
        <Alert severity="error" sx={{ m: 2 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {/* Input Area */}
      <Box sx={{ 
        p: 2, 
        borderTop: 1, 
        borderColor: 'divider',
        bgcolor: 'background.paper'
      }}>
        <Box sx={{ display: 'flex', gap: 1, alignItems: 'flex-end' }}>
          <TextField
            ref={inputRef}
            fullWidth
            multiline
            maxRows={4}
            value={currentMessage}
            onChange={(e) => setCurrentMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Share what's on your mind..."
            variant="outlined"
            disabled={isLoading}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: '25px',
                bgcolor: 'background.default'
              }
            }}
          />
          <IconButton
            onClick={handleSendMessage}
            disabled={!currentMessage.trim() || isLoading}
            sx={{ 
              bgcolor: 'primary.main',
              color: 'white',
              '&:hover': {
                bgcolor: 'primary.dark'
              },
              '&:disabled': {
                bgcolor: 'action.disabledBackground'
              }
            }}
          >
            {isLoading ? <CircularProgress size={20} /> : <SendIcon />}
          </IconButton>
        </Box>

        <Typography variant="caption" sx={{ 
          display: 'block', 
          mt: 1, 
          color: 'text.secondary',
          textAlign: 'center'
        }}>
          Remember: This is not a replacement for professional mental health care.
        </Typography>
      </Box>
    </Box>
  );
};

export default ChatInterface;