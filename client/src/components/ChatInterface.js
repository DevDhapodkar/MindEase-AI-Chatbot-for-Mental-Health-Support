import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Text,
  Input,
  Button,
  VStack,
  HStack,
  Avatar,
  Card,
  CardBody,
} from '@chakra-ui/react';

const ChatInterface = ({ sessionId, onEmotionUpdate }) => {
  const [messages, setMessages] = useState([]);
  const [currentMessage, setCurrentMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (sessionId) {
      setMessages([{
        id: 'welcome',
        type: 'bot',
        text: "Hey there! 💕 I'm your AI friend, and I'm here to listen, support, and be there for you through whatever you're going through. Whether you're happy, sad, anxious, or just need someone to talk to, I'm here with an open heart and a listening ear. How are you feeling today?",
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
          text: data.botResponse || 'I\'m sorry, I didn\'t understand that. Could you please rephrase?',
          timestamp: new Date().toISOString(),
          tone: data.tone || 'neutral',
          emotionInsights: data.emotionInsights || null,
          recommendations: data.recommendations || null,
          crisisWarning: data.crisisWarning || null
        };

        setMessages(prev => [...prev, botMessage]);
        
        // Update parent component with emotion insights
        if (onEmotionUpdate && data.emotionInsights) {
          onEmotionUpdate(data.emotionInsights, data.recommendations);
        }

        setIsLoading(false);
      }, 1000 + Math.random() * 1000); // Random delay between 1-2 seconds

    } catch (error) {
      console.error('Chat error:', error);
      alert('Sorry, I\'m having trouble processing your message. Please try again.');
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

  return (
    <Box h="100%" display="flex" flexDirection="column">
      {/* Chat Messages */}
      <Box 
        flex={1} 
        overflowY="auto" 
        p={4}
        css={{
          '&::-webkit-scrollbar': {
            width: '6px',
          },
          '&::-webkit-scrollbar-track': {
            background: '#f1f1f1',
            borderRadius: '3px',
          },
          '&::-webkit-scrollbar-thumb': {
            background: '#c1c1c1',
            borderRadius: '3px',
          },
        }}
      >
        <VStack spacing={4} align="stretch">
          {messages.map((message) => (
            <HStack 
              key={message.id}
              align="flex-start"
              justify={message.type === 'user' ? 'flex-end' : 'flex-start'}
              spacing={3}
            >
              {message.type === 'bot' && (
                <Avatar 
                  size="sm" 
                  bg="#8FBC8F" 
                >
                  💝
                </Avatar>
              )}

              <Card 
                maxW="70%" 
                bg={message.type === 'user' ? '#4A90A4' : 'white'}
                color={message.type === 'user' ? 'white' : 'gray.800'}
                boxShadow="md"
                borderRadius={message.type === 'user' ? '18px 18px 4px 18px' : '18px 18px 18px 4px'}
              >
                <CardBody p={4}>
                  <Text mb={2} lineHeight="1.6">
                    {message.text}
                  </Text>

                  <Text 
                    fontSize="xs" 
                    color={message.type === 'user' ? 'whiteAlpha.700' : 'gray.500'}
                    mt={2}
                  >
                    {new Date(message.timestamp).toLocaleTimeString()}
                  </Text>
                </CardBody>
              </Card>

              {message.type === 'user' && (
                <Avatar 
                  size="sm" 
                  bg="#4A90A4" 
                >
                  👤
                </Avatar>
              )}
            </HStack>
          ))}

          {/* Typing Indicator */}
          {isTyping && (
            <HStack align="flex-start" spacing={3}>
              <Avatar 
                size="sm" 
                bg="#8FBC8F" 
              >
                💝
              </Avatar>
              <Card bg="white" boxShadow="md" borderRadius="18px 18px 18px 4px">
                <CardBody p={4}>
                  <Text fontSize="sm" color="gray.600">
                    MindEase is typing...
                  </Text>
                </CardBody>
              </Card>
            </HStack>
          )}

          <div ref={messagesEndRef} />
        </VStack>
      </Box>

      {/* Input Area */}
      <Box 
        p={4} 
        borderTop="1px solid" 
        borderColor="gray.100"
        bg="white"
      >
        <HStack spacing={3}>
          <Input
            value={currentMessage}
            onChange={(e) => setCurrentMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Share what's on your mind..."
            variant="filled"
            isDisabled={isLoading}
            bg="gray.50"
            _hover={{ bg: 'gray.100' }}
            _focus={{ bg: 'white' }}
          />
          <Button
            onClick={handleSendMessage}
            isLoading={isLoading}
            isDisabled={!currentMessage.trim() || isLoading}
            colorScheme="blue"
            borderRadius="full"
          >
            📩 Send
          </Button>
        </HStack>

        <Text 
          fontSize="xs" 
          color="gray.500"
          textAlign="center"
          mt={2}
        >
          Remember: This is not a replacement for professional mental health care.
        </Text>
      </Box>
    </Box>
  );
};

export default ChatInterface;