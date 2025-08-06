import React from 'react';
import {
  Box,
  Flex,
  Heading,
  Text,
  Button,
  HStack,
  VStack,
} from '@chakra-ui/react';

const Header = ({ onNewSession }) => {
  return (
    <Box
      bg="white"
      borderRadius="xl"
      boxShadow="0 4px 20px rgba(0,0,0,0.08)"
      border="1px solid"
      borderColor="gray.100"
      p={6}
    >
      <Flex 
        direction={{ base: 'column', md: 'row' }}
        align={{ base: 'flex-start', md: 'center' }}
        justify="space-between"
        gap={4}
      >
        <HStack spacing={4}>
          <Box
            p={3}
            bg="#4A90A4"
            borderRadius="xl"
            boxShadow="0 4px 15px rgba(74, 144, 164, 0.3)"
          >
            <Text fontSize="2xl" color="white">💝</Text>
          </Box>
          
          <VStack align="flex-start" spacing={1}>
            <HStack>
              <Heading 
                size="lg" 
                color="gray.800"
                fontWeight="bold"
              >
                MindEase
              </Heading>
            </HStack>
            <HStack spacing={2}>
              <Text color="red.400">❤️</Text>
              <Text 
                fontSize="sm" 
                color="gray.600"
                fontWeight="medium"
              >
                Your compassionate AI companion for mental wellness
              </Text>
            </HStack>
          </VStack>
        </HStack>

        <Button
          onClick={onNewSession}
          colorScheme="blue"
          variant="ghost"
          size="lg"
          borderRadius="full"
        >
          🔄 New Session
        </Button>
      </Flex>
    </Box>
  );
};

export default Header;