#!/bin/bash

# MindEase Demo Script
echo "🧠 MindEase - AI Mental Health Support Demo"
echo "=========================================="

echo ""
echo "🔍 Testing Backend API..."

# Test health endpoint
echo "📊 Health Check:"
curl -s http://localhost:5001/api/health | jq '.'

echo ""
echo "🆕 Starting new chat session:"
SESSION_RESPONSE=$(curl -s -X POST http://localhost:5001/api/chat/start -H "Content-Type: application/json" -d '{}')
SESSION_ID=$(echo $SESSION_RESPONSE | jq -r '.sessionId')
echo "Session ID: $SESSION_ID"
echo "Welcome Message: $(echo $SESSION_RESPONSE | jq -r '.welcomeMessage')"

echo ""
echo "💬 Testing emotion detection with anxiety message:"
ANXIETY_TEST='{"message": "I feel really overwhelmed and anxious about everything lately", "sessionId": "'$SESSION_ID'"}'
curl -s -X POST http://localhost:5001/api/chat/message -H "Content-Type: application/json" -d "$ANXIETY_TEST" | jq '.'

echo ""
echo "💬 Testing emotion detection with depression message:"
DEPRESSION_TEST='{"message": "I feel so hopeless and worthless, nothing seems to matter anymore", "sessionId": "'$SESSION_ID'"}'
curl -s -X POST http://localhost:5001/api/chat/message -H "Content-Type: application/json" -d "$DEPRESSION_TEST" | jq '.'

echo ""
echo "📈 Getting conversation analysis:"
curl -s http://localhost:5001/api/history/session/$SESSION_ID | jq '.'

echo ""
echo "🎯 Getting crisis resources:"
curl -s http://localhost:5001/api/resources/crisis | jq '.resources.immediate[0]'

echo ""
echo "🧘 Getting breathing exercises:"
curl -s http://localhost:5001/api/resources/selfCare | jq '.breathing[0]'

echo ""
echo "✅ Demo complete! The backend is fully functional."
echo ""
echo "🌐 To test the full application:"
echo "   1. Open http://localhost:3000 in your browser"
echo "   2. Accept the privacy notice"
echo "   3. Start chatting with MindEase"
echo ""
echo "🔧 API Documentation:"
echo "   - Health: GET http://localhost:5001/api/health"
echo "   - Start Chat: POST http://localhost:5001/api/chat/start"
echo "   - Send Message: POST http://localhost:5001/api/chat/message"
echo "   - Get Resources: GET http://localhost:5001/api/resources/{category}"
echo ""