import React, { useState } from 'react';
import {
  Paper,
  Typography,
  Box,
  Button,
  Collapse,
  IconButton,
  Tabs,
  Tab,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Chip,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import {
  Close as CloseIcon,
  SelfImprovement as SelfImprovementIcon,
  Psychology as PsychologyIcon,
  Phone as PhoneIcon,
  Schedule as ScheduleIcon,
  Favorite as FavoriteIcon,
  Info as InfoIcon
} from '@mui/icons-material';

const ResourcePanel = ({ show, recommendations, onClose }) => {
  const [activeTab, setActiveTab] = useState(0);
  const [selectedExercise, setSelectedExercise] = useState(null);
  const [exerciseDialogOpen, setExerciseDialogOpen] = useState(false);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleExerciseClick = (exercise) => {
    setSelectedExercise(exercise);
    setExerciseDialogOpen(true);
  };

  const crisisResources = [
    {
      name: "National Suicide Prevention Lifeline",
      contact: "988",
      description: "24/7 crisis support",
      country: "US"
    },
    {
      name: "Crisis Text Line", 
      contact: "Text HOME to 741741",
      description: "24/7 crisis support via text",
      country: "US"
    },
    {
      name: "Samaritans",
      contact: "116 123", 
      description: "24/7 emotional support",
      country: "UK"
    }
  ];

  const breathingExercises = [
    {
      name: "4-7-8 Breathing",
      description: "Inhale for 4, hold for 7, exhale for 8 counts",
      duration: "2-3 minutes",
      instructions: [
        "Sit comfortably with your back straight",
        "Place your tongue against the roof of your mouth",
        "Exhale completely through your mouth",
        "Close your mouth and inhale through your nose for 4 counts",
        "Hold your breath for 7 counts",
        "Exhale through your mouth for 8 counts",
        "Repeat 3-4 times"
      ]
    },
    {
      name: "Box Breathing",
      description: "4-4-4-4 breathing pattern for anxiety relief",
      duration: "3-5 minutes",
      instructions: [
        "Inhale for 4 counts",
        "Hold for 4 counts", 
        "Exhale for 4 counts",
        "Hold empty for 4 counts",
        "Repeat 5-10 times"
      ]
    }
  ];

  const mindfulnessExercises = [
    {
      name: "5-4-3-2-1 Grounding",
      description: "Use your senses to ground yourself",
      duration: "5-10 minutes",
      instructions: [
        "5 things you can see",
        "4 things you can touch",
        "3 things you can hear", 
        "2 things you can smell",
        "1 thing you can taste"
      ]
    },
    {
      name: "Body Scan",
      description: "Mindful awareness of physical sensations",
      duration: "10-20 minutes",
      instructions: [
        "Lie down comfortably",
        "Start at the top of your head",
        "Slowly move attention down your body",
        "Notice sensations without judgment",
        "Include each part of your body"
      ]
    }
  ];

  if (!show) return null;

  return (
    <>
      <Paper sx={{ 
        height: 'fit-content',
        maxHeight: '100%',
        overflow: 'auto',
        position: 'relative'
      }}>
        {/* Header */}
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between',
          p: 2,
          borderBottom: 1,
          borderColor: 'divider'
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <FavoriteIcon color="secondary" />
            <Typography variant="h6" fontWeight="bold">
              Resources
            </Typography>
          </Box>
          <IconButton size="small" onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Box>

        {/* Crisis Alert */}
        {recommendations?.immediateActions && recommendations.immediateActions.length > 0 && (
          <Alert severity="error" sx={{ m: 2 }}>
            <Typography variant="body2" fontWeight="bold">
              Immediate Support Needed
            </Typography>
            <Typography variant="body2" sx={{ mt: 1 }}>
              Please consider contacting crisis support services.
            </Typography>
          </Alert>
        )}

        {/* Tabs */}
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
          sx={{ px: 2 }}
        >
          <Tab 
            icon={<PhoneIcon />} 
            label="Crisis Help" 
            iconPosition="start"
            sx={{ minHeight: 48 }}
          />
          <Tab 
            icon={<SelfImprovementIcon />} 
            label="Breathing" 
            iconPosition="start"
            sx={{ minHeight: 48 }}
          />
          <Tab 
            icon={<PsychologyIcon />} 
            label="Mindfulness" 
            iconPosition="start"
            sx={{ minHeight: 48 }}
          />
        </Tabs>

        {/* Tab Content */}
        <Box sx={{ p: 2 }}>
          {/* Crisis Help Tab */}
          {activeTab === 0 && (
            <Box>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                If you're in crisis or having thoughts of self-harm, please reach out immediately:
              </Typography>
              <List>
                {crisisResources.map((resource, index) => (
                  <ListItem 
                    key={index}
                    sx={{ 
                      bgcolor: 'error.light',
                      borderRadius: 2,
                      mb: 1,
                      '&:hover': {
                        bgcolor: 'error.main',
                        color: 'white'
                      }
                    }}
                  >
                    <ListItemIcon>
                      <PhoneIcon color="error" />
                    </ListItemIcon>
                    <ListItemText
                      primary={resource.name}
                      secondary={
                        <Box>
                          <Typography variant="body2" component="span" fontWeight="bold">
                            {resource.contact}
                          </Typography>
                          <br />
                          <Typography variant="caption">
                            {resource.description} ({resource.country})
                          </Typography>
                        </Box>
                      }
                    />
                  </ListItem>
                ))}
              </List>
              
              <Alert severity="warning" sx={{ mt: 2 }}>
                <Typography variant="body2">
                  <strong>Emergency:</strong> Call 911 (US), 999 (UK), or your local emergency number
                </Typography>
              </Alert>
            </Box>
          )}

          {/* Breathing Exercises Tab */}
          {activeTab === 1 && (
            <Box>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Breathing exercises can help reduce anxiety and promote calm:
              </Typography>
              <List>
                {breathingExercises.map((exercise, index) => (
                  <ListItem 
                    key={index}
                    button
                    onClick={() => handleExerciseClick(exercise)}
                    sx={{ 
                      bgcolor: 'info.light',
                      borderRadius: 2,
                      mb: 1,
                      '&:hover': {
                        bgcolor: 'info.main',
                        color: 'white'
                      }
                    }}
                  >
                    <ListItemIcon>
                      <SelfImprovementIcon color="info" />
                    </ListItemIcon>
                    <ListItemText
                      primary={exercise.name}
                      secondary={
                        <Box>
                          <Typography variant="body2">
                            {exercise.description}
                          </Typography>
                          <Chip 
                            size="small" 
                            label={exercise.duration}
                            icon={<ScheduleIcon />}
                            sx={{ mt: 1 }}
                          />
                        </Box>
                      }
                    />
                  </ListItem>
                ))}
              </List>
            </Box>
          )}

          {/* Mindfulness Tab */}
          {activeTab === 2 && (
            <Box>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Mindfulness exercises to help ground yourself in the present:
              </Typography>
              <List>
                {mindfulnessExercises.map((exercise, index) => (
                  <ListItem 
                    key={index}
                    button
                    onClick={() => handleExerciseClick(exercise)}
                    sx={{ 
                      bgcolor: 'secondary.light',
                      borderRadius: 2,
                      mb: 1,
                      '&:hover': {
                        bgcolor: 'secondary.main',
                        color: 'white'
                      }
                    }}
                  >
                    <ListItemIcon>
                      <PsychologyIcon color="secondary" />
                    </ListItemIcon>
                    <ListItemText
                      primary={exercise.name}
                      secondary={
                        <Box>
                          <Typography variant="body2">
                            {exercise.description}
                          </Typography>
                          <Chip 
                            size="small" 
                            label={exercise.duration}
                            icon={<ScheduleIcon />}
                            sx={{ mt: 1 }}
                          />
                        </Box>
                      }
                    />
                  </ListItem>
                ))}
              </List>
            </Box>
          )}
        </Box>

        {/* Footer */}
        <Box sx={{ 
          p: 2, 
          borderTop: 1, 
          borderColor: 'divider',
          bgcolor: 'background.default'
        }}>
          <Typography variant="caption" color="text.secondary" sx={{ 
            display: 'block',
            textAlign: 'center',
            fontStyle: 'italic'
          }}>
            These resources complement but don't replace professional care
          </Typography>
        </Box>
      </Paper>

      {/* Exercise Detail Dialog */}
      <Dialog 
        open={exerciseDialogOpen} 
        onClose={() => setExerciseDialogOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: { borderRadius: 3 }
        }}
      >
        {selectedExercise && (
          <>
            <DialogTitle sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 1,
              pb: 1
            }}>
              <SelfImprovementIcon color="primary" />
              <Box>
                <Typography variant="h6">{selectedExercise.name}</Typography>
                <Typography variant="body2" color="text.secondary">
                  {selectedExercise.description}
                </Typography>
              </Box>
            </DialogTitle>
            
            <DialogContent>
              <Alert severity="info" sx={{ mb: 2 }}>
                <Typography variant="body2">
                  <strong>Duration:</strong> {selectedExercise.duration}
                </Typography>
              </Alert>
              
              <Typography variant="body2" fontWeight="bold" sx={{ mb: 1 }}>
                Instructions:
              </Typography>
              <List dense>
                {selectedExercise.instructions.map((instruction, index) => (
                  <ListItem key={index}>
                    <ListItemIcon>
                      <InfoIcon sx={{ fontSize: 16 }} />
                    </ListItemIcon>
                    <ListItemText 
                      primary={instruction}
                      primaryTypographyProps={{ variant: 'body2' }}
                    />
                  </ListItem>
                ))}
              </List>
            </DialogContent>
            
            <DialogActions>
              <Button onClick={() => setExerciseDialogOpen(false)}>
                Close
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </>
  );
};

export default ResourcePanel;