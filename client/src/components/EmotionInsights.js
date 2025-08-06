import React from 'react';
import {
  Box,
  VStack,
  HStack,
  Text,
  Card,
  CardHeader,
  CardBody,
  Heading,
  Progress,
} from '@chakra-ui/react';

const EmotionInsights = ({ insights, recommendations }) => {
  if (!insights) return null;

  const getConcernLevelData = (level) => {
    switch (level) {
      case 'crisis':
        return { 
          color: 'red', 
          label: 'Crisis', 
          progress: 100,
          description: 'Immediate support needed',
          emoji: '🚨'
        };
      case 'high':
        return { 
          color: 'orange', 
          label: 'High Concern', 
          progress: 80,
          description: 'Significant emotional distress',
          emoji: '⚠️'
        };
      case 'medium':
        return { 
          color: 'blue', 
          label: 'Medium Concern', 
          progress: 60,
          description: 'Moderate emotional support needed',
          emoji: '😔'
        };
      case 'low':
        return { 
          color: 'green', 
          label: 'Low Concern', 
          progress: 30,
          description: 'Mild emotional fluctuation',
          emoji: '💙'
        };
      default:
        return { 
          color: 'gray', 
          label: 'Stable', 
          progress: 10,
          description: 'Emotional well-being appears stable',
          emoji: '☀️'
        };
    }
  };

  const concernData = getConcernLevelData(insights.concernLevel);

  return (
    <Card bg="white" boxShadow="xl" borderRadius="xl" border="1px solid" borderColor="gray.100">
      <CardHeader pb={2}>
        <HStack spacing={3}>
          <Text fontSize="lg">🧠</Text>
          <Heading size="sm" color="gray.700">
            Emotional Insights
          </Heading>
        </HStack>
      </CardHeader>

      <CardBody pt={0}>
        <VStack spacing={4} align="stretch">
          {/* Concern Level */}
          <Box>
            <HStack justify="space-between" mb={2}>
              <HStack spacing={2}>
                <Text fontSize="md">{concernData.emoji}</Text>
                <Text fontSize="sm" fontWeight="semibold" color="gray.700">
                  {concernData.label}
                </Text>
              </HStack>
            </HStack>
            
            <Progress 
              value={concernData.progress} 
              colorScheme={concernData.color}
              size="sm" 
              borderRadius="full"
              bg="gray.100"
              mb={1}
            />
            
            <Text fontSize="xs" color="gray.500">
              {concernData.description}
            </Text>
          </Box>

          {/* Sentiment */}
          <Box>
            <HStack justify="space-between" mb={2}>
              <Text fontSize="sm" fontWeight="semibold" color="gray.700">
                Sentiment
              </Text>
              <Text 
                fontSize="sm"
                color={
                  insights.sentiment === 'positive' ? 'green.600' : 
                  insights.sentiment === 'negative' ? 'red.600' : 'gray.600'
                }
                fontWeight="medium"
              >
                {insights.sentiment === 'positive' ? '😊 Positive' :
                 insights.sentiment === 'negative' ? '😔 Negative' : '😐 Neutral'}
              </Text>
            </HStack>
          </Box>

          {/* Emotional Context */}
          {insights.emotionalContext && (
            <Box>
              <Text fontSize="sm" fontWeight="semibold" color="gray.700" mb={3}>
                Detected Emotions
              </Text>
              <VStack spacing={2} align="stretch">
                {Object.entries(insights.emotionalContext)
                  .filter(([key, value]) => value === 'detected')
                  .map(([emotion]) => (
                    <HStack key={emotion} justify="space-between">
                      <HStack spacing={2}>
                        <Text fontSize="sm">
                          {emotion === 'relationships' ? '💕' :
                           emotion === 'depression' ? '😔' :
                           emotion === 'anxiety' ? '😰' :
                           emotion === 'crisis' ? '🚨' : '🧠'}
                        </Text>
                        <Text fontSize="sm" color="gray.600" textTransform="capitalize">
                          {emotion}
                        </Text>
                      </HStack>
                      <Text fontSize="xs" color="blue.600" fontWeight="medium">
                        Active
                      </Text>
                    </HStack>
                  ))}
                
                {Object.entries(insights.emotionalContext)
                  .filter(([key, value]) => value === 'detected').length === 0 && (
                  <HStack spacing={2}>
                    <Text fontSize="sm">☀️</Text>
                    <Text fontSize="sm" color="gray.500">
                      No specific emotional concerns detected
                    </Text>
                  </HStack>
                )}
              </VStack>
            </Box>
          )}

          {/* Context Information */}
          {insights.context && (
            <Box>
              <Text fontSize="sm" fontWeight="semibold" color="gray.700" mb={2}>
                Context Analysis
              </Text>
              <VStack spacing={1} align="stretch">
                {insights.context.complexity && (
                  <HStack justify="space-between">
                    <Text fontSize="xs" color="gray.500">Complexity:</Text>
                    <Text fontSize="xs" fontWeight="medium" color="gray.700">
                      {insights.context.complexity}
                    </Text>
                  </HStack>
                )}
                
                {insights.context.emotionalIntensity !== undefined && (
                  <HStack justify="space-between">
                    <Text fontSize="xs" color="gray.500">Intensity:</Text>
                    <Progress 
                      value={insights.context.emotionalIntensity * 100} 
                      size="xs" 
                      colorScheme="blue"
                      w="60px"
                      borderRadius="full"
                    />
                  </HStack>
                )}
              </VStack>
            </Box>
          )}
        </VStack>
      </CardBody>
    </Card>
  );
};

export default EmotionInsights;