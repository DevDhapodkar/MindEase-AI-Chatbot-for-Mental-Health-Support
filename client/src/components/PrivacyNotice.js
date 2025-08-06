import React from 'react';
import {
  Box,
  VStack,
  HStack,
  Heading,
  Text,
  Button,

  Card,
  CardBody,
  Container,
  Flex,
} from '@chakra-ui/react';


const PrivacyNotice = ({ onAccept }) => {
  return (
    <Box 
      minH="100vh" 
      bg="linear-gradient(135deg, #F8FFFE 0%, #E8F6F3 100%)"
      py={8}
    >
      <Container maxW="2xl">
        <Flex direction="column" align="center" justify="center" minH="90vh">
          {/* Header */}
          <VStack spacing={6} mb={8} textAlign="center">
            <Box
              p={4}
              bg="#4A90A4"
              borderRadius="xl"
              boxShadow="0 8px 25px rgba(74, 144, 164, 0.3)"
            >
              <Text fontSize="3xl" color="white">💝</Text>
            </Box>
            
            <VStack spacing={2}>
              <Heading 
                size="xl" 
                color="gray.800"
                fontWeight="bold"
              >
                Welcome to MindEase
              </Heading>
              <HStack>
                <Text color="red.400">❤️</Text>
                <Text color="gray.600" fontSize="lg">
                  Your compassionate AI friend for mental wellness
                </Text>
              </HStack>
            </VStack>
          </VStack>

          {/* Privacy Notice Card */}
          <Card 
            w="100%" 
            boxShadow="xl" 
            borderRadius="2xl"
            border="1px solid"
            borderColor="gray.100"
          >
            <CardBody p={8}>
              <VStack spacing={6} align="stretch">
                {/* Privacy Header */}
                <HStack spacing={3}>
                  <Text fontSize="xl">🛡️</Text>
                  <Heading size="md" color="gray.800">
                    Privacy & Safety Notice
                  </Heading>
                </HStack>

                {/* Crisis Warning */}
                <Box bg="orange.50" p={4} borderRadius="xl" border="1px solid" borderColor="orange.200">
                  <HStack spacing={2} mb={2}>
                    <Text fontSize="lg">⚠️</Text>
                    <Heading size="sm" color="orange.700">Important Safety Information</Heading>
                  </HStack>
                  <Text fontSize="sm" color="orange.700">
                    This chatbot is not a replacement for professional mental health care. 
                    If you're experiencing a crisis, please contact emergency services or a 
                    mental health professional immediately.
                  </Text>
                </Box>

                {/* What We Do */}
                <Box>
                  <Heading size="sm" mb={3} color="gray.700">
                    How MindEase Supports You:
                  </Heading>
                  <VStack align="stretch" spacing={2}>
                    <Text fontSize="sm" color="gray.600">
                      ✅ Provides empathetic, judgment-free conversations
                    </Text>
                    <Text fontSize="sm" color="gray.600">
                      ✅ Offers personalized coping strategies and resources
                    </Text>
                    <Text fontSize="sm" color="gray.600">
                      ✅ Detects emotional patterns to provide better support
                    </Text>
                    <Text fontSize="sm" color="gray.600">
                      ✅ Available 24/7 for whenever you need someone to talk to
                    </Text>
                  </VStack>
                </Box>

                {/* Emergency Contacts */}
                <Box bg="red.50" p={4} borderRadius="xl" border="1px solid" borderColor="red.100">
                  <HStack spacing={2} mb={3}>
                    <Text fontSize="lg">⚠️</Text>
                    <Heading size="sm" color="red.700">
                      Crisis Support Resources:
                    </Heading>
                  </HStack>
                  <VStack align="stretch" spacing={1}>
                    <Text fontSize="sm" fontWeight="semibold" color="red.700">
                      US: 988 (Suicide & Crisis Lifeline)
                    </Text>
                    <Text fontSize="sm" fontWeight="semibold" color="red.700">
                      UK: 116 123 (Samaritans)
                    </Text>
                    <Text fontSize="sm" fontWeight="semibold" color="red.700">
                      Emergency: Contact your local emergency services
                    </Text>
                  </VStack>
                </Box>

                {/* Accept Button */}
                <VStack spacing={3} pt={4}>
                  <Button
                    onClick={onAccept}
                    colorScheme="blue"
                    size="lg"
                    w="100%"
                    borderRadius="full"
                    fontWeight="semibold"
                  >
                    ❤️ I Understand - Let's Begin
                  </Button>
                  <Text fontSize="xs" color="gray.500" textAlign="center">
                    By clicking above, you acknowledge that you understand this is an AI chatbot 
                    and not a replacement for professional mental health care.
                  </Text>
                </VStack>
              </VStack>
            </CardBody>
          </Card>
        </Flex>
      </Container>
    </Box>
  );
};

export default PrivacyNotice;