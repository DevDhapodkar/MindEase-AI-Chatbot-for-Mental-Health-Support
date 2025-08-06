import React from 'react';
import {
  Paper,
  Typography,
  Box,
  Chip,
  LinearProgress,
  Alert,
  Collapse,
  List,
  ListItem,
  ListItemText,
  ListItemIcon
} from '@mui/material';
import {
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  TrendingFlat as TrendingFlatIcon,
  Psychology as PsychologyIcon,
  Warning as WarningIcon,
  Info as InfoIcon
} from '@mui/icons-material';

const EmotionInsights = ({ insights, recommendations }) => {
  if (!insights) return null;

  const getConcernLevelColor = (level) => {
    switch (level) {
      case 'crisis': return 'error';
      case 'high': return 'warning';
      case 'medium': return 'info';
      case 'low': return 'success';
      default: return 'default';
    }
  };

  const getConcernLevelIntensity = (level) => {
    switch (level) {
      case 'crisis': return 100;
      case 'high': return 75;
      case 'medium': return 50;
      case 'low': return 25;
      default: return 0;
    }
  };

  const getSentimentIcon = (sentiment) => {
    switch (sentiment) {
      case 'positive': return <TrendingUpIcon color="success" />;
      case 'negative': return <TrendingDownIcon color="error" />;
      default: return <TrendingFlatIcon color="info" />;
    }
  };

  const getSentimentColor = (sentiment) => {
    switch (sentiment) {
      case 'positive': return 'success.light';
      case 'negative': return 'error.light';
      default: return 'info.light';
    }
  };

  return (
    <Paper sx={{ p: 2, height: 'fit-content', maxHeight: '100%', overflow: 'auto' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
        <PsychologyIcon color="primary" />
        <Typography variant="h6" fontWeight="bold">
          Emotion Insights
        </Typography>
      </Box>

      {/* Crisis Alert */}
      <Collapse in={insights.concernLevel === 'crisis'}>
        <Alert severity="error" sx={{ mb: 2 }}>
          <Typography variant="body2" fontWeight="bold">
            Crisis indicators detected. Please consider reaching out for immediate support.
          </Typography>
        </Alert>
      </Collapse>

      {/* Concern Level */}
      <Box sx={{ mb: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
          <Typography variant="body2" fontWeight="medium">
            Concern Level
          </Typography>
          <Chip
            size="small"
            label={insights.concernLevel}
            color={getConcernLevelColor(insights.concernLevel)}
            variant="outlined"
          />
        </Box>
        <LinearProgress
          variant="determinate"
          value={getConcernLevelIntensity(insights.concernLevel)}
          color={getConcernLevelColor(insights.concernLevel)}
          sx={{ 
            height: 8, 
            borderRadius: 4,
            bgcolor: 'grey.200'
          }}
        />
      </Box>

      {/* Sentiment Analysis */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="body2" fontWeight="medium" sx={{ mb: 1 }}>
          Current Sentiment
        </Typography>
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: 1,
          p: 1.5,
          bgcolor: getSentimentColor(insights.sentiment),
          borderRadius: 2
        }}>
          {getSentimentIcon(insights.sentiment)}
          <Typography variant="body2" sx={{ textTransform: 'capitalize' }}>
            {insights.sentiment}
          </Typography>
        </Box>
      </Box>

      {/* Detected Concerns */}
      {insights.detectedConcerns && insights.detectedConcerns.length > 0 && (
        <Box sx={{ mb: 3 }}>
          <Typography variant="body2" fontWeight="medium" sx={{ mb: 1 }}>
            Areas of Focus
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {insights.detectedConcerns.map((concern, index) => (
              <Chip
                key={index}
                size="small"
                label={`${concern.type}: ${concern.level}`}
                variant="outlined"
                color="info"
                sx={{ fontSize: '0.75rem' }}
              />
            ))}
          </Box>
        </Box>
      )}

      {/* Immediate Recommendations */}
      {recommendations && (
        <Box>
          <Typography variant="body2" fontWeight="medium" sx={{ mb: 1 }}>
            Suggested Actions
          </Typography>
          
          {/* Immediate Actions */}
          {recommendations.immediateActions && recommendations.immediateActions.length > 0 && (
            <Alert severity={insights.concernLevel === 'crisis' ? 'error' : 'warning'} sx={{ mb: 2 }}>
              <Typography variant="body2" fontWeight="bold" sx={{ mb: 1 }}>
                Immediate Steps:
              </Typography>
              <List dense>
                {recommendations.immediateActions.slice(0, 2).map((action, index) => (
                  <ListItem key={index} sx={{ py: 0.25, pl: 0 }}>
                    <ListItemIcon sx={{ minWidth: 20 }}>
                      <WarningIcon sx={{ fontSize: 16, color: 'inherit' }} />
                    </ListItemIcon>
                    <ListItemText 
                      primary={action} 
                      primaryTypographyProps={{ variant: 'body2', fontSize: '0.8rem' }}
                    />
                  </ListItem>
                ))}
              </List>
            </Alert>
          )}

          {/* Exercises */}
          {recommendations.exercises && recommendations.exercises.length > 0 && (
            <Alert severity="info" sx={{ mb: 2 }}>
              <Typography variant="body2" fontWeight="bold" sx={{ mb: 1 }}>
                Helpful Exercises:
              </Typography>
              <List dense>
                {recommendations.exercises.slice(0, 3).map((exercise, index) => (
                  <ListItem key={index} sx={{ py: 0.25, pl: 0 }}>
                    <ListItemIcon sx={{ minWidth: 20 }}>
                      <InfoIcon sx={{ fontSize: 16, color: 'inherit' }} />
                    </ListItemIcon>
                    <ListItemText 
                      primary={typeof exercise === 'string' ? exercise : exercise.name}
                      primaryTypographyProps={{ variant: 'body2', fontSize: '0.8rem' }}
                    />
                  </ListItem>
                ))}
              </List>
            </Alert>
          )}

          {/* Resources */}
          {recommendations.resources && recommendations.resources.length > 0 && (
            <Alert severity="success" sx={{ mb: 1 }}>
              <Typography variant="body2" fontWeight="bold" sx={{ mb: 1 }}>
                Support Resources:
              </Typography>
              <List dense>
                {recommendations.resources.slice(0, 2).map((resource, index) => (
                  <ListItem key={index} sx={{ py: 0.25, pl: 0 }}>
                    <ListItemText 
                      primary={typeof resource === 'string' ? resource : resource.name}
                      primaryTypographyProps={{ variant: 'body2', fontSize: '0.8rem' }}
                    />
                  </ListItem>
                ))}
              </List>
            </Alert>
          )}
        </Box>
      )}

      <Typography variant="caption" color="text.secondary" sx={{ 
        display: 'block', 
        mt: 2,
        fontStyle: 'italic',
        textAlign: 'center'
      }}>
        These insights are based on conversation analysis and are not medical diagnoses.
      </Typography>
    </Paper>
  );
};

export default EmotionInsights;