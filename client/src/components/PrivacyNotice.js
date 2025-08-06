import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Button,
  Box,
  Alert,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider
} from '@mui/material';
import {
  Shield as ShieldIcon,
  Lock as LockIcon,
  Visibility as VisibilityIcon,
  Schedule as ScheduleIcon,
  Warning as WarningIcon
} from '@mui/icons-material';

const PrivacyNotice = ({ onAccept }) => {
  return (
    <Dialog
      open={true}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          maxHeight: '90vh'
        }
      }}
    >
      <DialogTitle sx={{ 
        textAlign: 'center',
        pb: 1,
        background: 'linear-gradient(45deg, #4A90A4 30%, #8FBC8F 90%)',
        backgroundClip: 'text',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent'
      }}>
        <Typography variant="h4" component="h1" fontWeight="bold">
          Welcome to MindEase
        </Typography>
        <Typography variant="subtitle1" color="text.secondary" sx={{ mt: 1 }}>
          Your privacy and wellbeing are our priorities
        </Typography>
      </DialogTitle>

      <DialogContent sx={{ py: 3 }}>
        {/* Important Disclaimer */}
        <Alert severity="warning" sx={{ mb: 3 }}>
          <Typography variant="body2" fontWeight="bold">
            Important: MindEase is not a replacement for professional mental health care.
          </Typography>
          <Typography variant="body2" sx={{ mt: 1 }}>
            If you are experiencing a mental health crisis, please contact emergency services 
            or a mental health professional immediately.
          </Typography>
        </Alert>

        {/* Crisis Resources */}
        <Box sx={{ mb: 3, p: 2, bgcolor: 'error.light', borderRadius: 2 }}>
          <Typography variant="h6" color="error.dark" fontWeight="bold" sx={{ mb: 1 }}>
            Crisis Resources (24/7)
          </Typography>
          <Typography variant="body2" color="error.dark">
            <strong>US:</strong> 988 (Suicide & Crisis Lifeline)<br />
            <strong>UK:</strong> 116 123 (Samaritans)<br />
            <strong>Emergency:</strong> 911, 999, or your local emergency number
          </Typography>
        </Box>

        {/* What MindEase Does */}
        <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
          What MindEase Does
        </Typography>
        <List dense>
          <ListItem>
            <ListItemIcon>
              <VisibilityIcon color="primary" />
            </ListItemIcon>
            <ListItemText 
              primary="Emotion Detection"
              secondary="Analyzes your messages to understand emotional state and provide appropriate support"
            />
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <ScheduleIcon color="primary" />
            </ListItemIcon>
            <ListItemText 
              primary="Conversation History"
              secondary="Stores conversation temporarily to track emotional trends and provide better support"
            />
          </ListItem>
        </List>

        <Divider sx={{ my: 3 }} />

        {/* Privacy Protection */}
        <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
          Your Privacy Protection
        </Typography>
        <List dense>
          <ListItem>
            <ListItemIcon>
              <LockIcon color="secondary" />
            </ListItemIcon>
            <ListItemText 
              primary="No Personal Data Storage"
              secondary="We don't store names, contact information, or other identifying details"
            />
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <ShieldIcon color="secondary" />
            </ListItemIcon>
            <ListItemText 
              primary="Temporary Conversation Storage"
              secondary="Conversations are stored temporarily for analysis and improvement, then deleted"
            />
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <WarningIcon color="secondary" />
            </ListItemIcon>
            <ListItemText 
              primary="Crisis Detection"
              secondary="We may recommend immediate professional help if crisis indicators are detected"
            />
          </ListItem>
        </List>

        <Divider sx={{ my: 3 }} />

        {/* Data Usage */}
        <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
          How We Use Your Data
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Your conversations help us:
        </Typography>
        <List dense>
          <ListItem sx={{ py: 0.5 }}>
            <Typography variant="body2">• Detect emotional states and provide appropriate responses</Typography>
          </ListItem>
          <ListItem sx={{ py: 0.5 }}>
            <Typography variant="body2">• Suggest relevant mental health resources and exercises</Typography>
          </ListItem>
          <ListItem sx={{ py: 0.5 }}>
            <Typography variant="body2">• Track emotional trends during your session</Typography>
          </ListItem>
          <ListItem sx={{ py: 0.5 }}>
            <Typography variant="body2">• Improve our emotional support capabilities (anonymized data only)</Typography>
          </ListItem>
        </List>

        {/* Your Rights */}
        <Typography variant="h6" fontWeight="bold" sx={{ mb: 1, mt: 3 }}>
          Your Rights
        </Typography>
        <Typography variant="body2" color="text.secondary">
          • You can start a new session at any time to clear your conversation history<br />
          • You can stop using MindEase at any time<br />
          • Your data is automatically deleted after your session ends<br />
          • You maintain full control over what you share
        </Typography>
      </DialogContent>

      <DialogActions sx={{ 
        p: 3, 
        pt: 1,
        flexDirection: 'column',
        gap: 2
      }}>
        <Alert severity="info" sx={{ width: '100%' }}>
          <Typography variant="body2">
            By continuing, you acknowledge that you understand MindEase is an AI support tool, 
            not professional medical advice, and that you agree to our privacy practices.
          </Typography>
        </Alert>

        <Box sx={{ display: 'flex', gap: 2, width: '100%' }}>
          <Button
            variant="outlined"
            fullWidth
            onClick={() => window.close()}
            sx={{ borderRadius: 3 }}
          >
            I Don't Agree
          </Button>
          <Button
            variant="contained"
            fullWidth
            onClick={onAccept}
            sx={{ 
              borderRadius: 3,
              background: 'linear-gradient(45deg, #4A90A4 30%, #8FBC8F 90%)'
            }}
          >
            I Understand & Agree
          </Button>
        </Box>
      </DialogActions>
    </Dialog>
  );
};

export default PrivacyNotice;