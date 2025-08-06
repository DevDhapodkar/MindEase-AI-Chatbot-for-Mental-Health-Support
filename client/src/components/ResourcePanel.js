import React from 'react';
import {
  Box,
  VStack,
  HStack,
  Text,
  Button,
  Card,
  CardHeader,
  CardBody,
  Heading,


} from '@chakra-ui/react';


const ResourcePanel = ({ show, recommendations, onClose }) => {
  if (!show) return null;

  return (
    <Box>
      <Card 
        bg="white" 
        boxShadow="xl" 
        borderRadius="xl" 
        border="1px solid" 
        borderColor="gray.100"
        position="relative"
      >
        <CardHeader pb={2}>
          <HStack justify="space-between">
            <HStack spacing={3}>
              <Text fontSize="lg">💝</Text>
              <Heading size="sm" color="gray.700">
                Support Resources
              </Heading>
            </HStack>
            <Button
              size="sm"
              variant="ghost"
              onClick={onClose}
              borderRadius="full"
              aria-label="Close resources panel"
            >
              ✕
            </Button>
          </HStack>
        </CardHeader>

        <CardBody pt={0}>
          <VStack spacing={4} align="stretch">
            {/* Crisis Resources */}
            {recommendations?.resources && recommendations.resources.length > 0 && (
              <Box>
                <Box bg="red.50" p={3} borderRadius="lg" mb={3} border="1px solid" borderColor="red.200">
                  <HStack spacing={2} mb={1}>
                    <Text fontSize="md">🚨</Text>
                    <Heading size="sm" color="red.700">Crisis Support Available</Heading>
                  </HStack>
                  <Text fontSize="xs" color="red.600">
                    Immediate help is available 24/7
                  </Text>
                </Box>
                
                <VStack spacing={2} align="stretch">
                  {recommendations.resources.map((resource, index) => (
                    <Text key={index} fontSize="sm" fontWeight="semibold" color="red.600">
                      📞 {resource}
                    </Text>
                  ))}
                </VStack>
              </Box>
            )}

            {/* Immediate Actions */}
            {recommendations?.immediateActions && recommendations.immediateActions.length > 0 && (
              <Box>
                <HStack spacing={2} mb={3}>
                  <Text fontSize="md">🆘</Text>
                  <Heading size="xs" color="gray.700">
                    Immediate Actions
                  </Heading>
                </HStack>
                
                <VStack spacing={2} align="stretch">
                  {recommendations.immediateActions.map((action, index) => (
                    <Text key={index} fontSize="sm" color="gray.600">
                      ✅ {action}
                    </Text>
                  ))}
                </VStack>
              </Box>
            )}

            {/* Coping Exercises */}
            {recommendations?.exercises && recommendations.exercises.length > 0 && (
              <Box>
                <HStack spacing={2} mb={3}>
                  <Text fontSize="md">🧘‍♀️</Text>
                  <Heading size="xs" color="gray.700">
                    Coping Exercises
                  </Heading>
                </HStack>
                
                <VStack spacing={2} align="stretch">
                  {recommendations.exercises.map((exercise, index) => (
                    <Box
                      key={index}
                      p={3}
                      bg="green.50"
                      borderRadius="lg"
                      border="1px solid"
                      borderColor="green.100"
                    >
                      <Text fontSize="sm" color="green.700" fontWeight="medium">
                        💚 {exercise}
                      </Text>
                    </Box>
                  ))}
                </VStack>
              </Box>
            )}

            {/* Therapeutic Approaches */}
            {recommendations?.therapeuticApproaches && recommendations.therapeuticApproaches.length > 0 && (
              <Box>
                <HStack spacing={2} mb={3}>
                  <Text fontSize="md">🎯</Text>
                  <Heading size="xs" color="gray.700">
                    Therapeutic Approaches
                  </Heading>
                </HStack>
                
                <VStack spacing={2} align="stretch">
                  {recommendations.therapeuticApproaches.map((approach, index) => (
                    <Text key={index} fontSize="sm" color="gray.600">
                      🔹 {approach}
                    </Text>
                  ))}
                </VStack>
              </Box>
            )}

            {/* Help Message */}
            <Box bg="blue.50" p={4} borderRadius="lg" border="1px solid" borderColor="blue.100">
              <HStack spacing={2} mb={2}>
                <Text fontSize="md">💙</Text>
                <Text fontSize="sm" fontWeight="semibold" color="blue.700">
                  Remember, You're Not Alone
                </Text>
              </HStack>
              <Text fontSize="xs" color="blue.600">
                These resources are here to support you. Take things one step at a time, 
                and don't hesitate to reach out for professional help when needed.
              </Text>
            </Box>

            {/* Professional Help Button */}
            <Button
              colorScheme="blue"
              variant="outline"
              size="sm"
              borderRadius="full"
            >
              🏥 Find Professional Help
            </Button>
          </VStack>
        </CardBody>
      </Card>
    </Box>
  );
};

export default ResourcePanel;