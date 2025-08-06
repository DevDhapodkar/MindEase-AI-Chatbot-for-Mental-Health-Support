import React from 'react';
import {
  Box,
  Typography,
  IconButton,
  Tooltip,
  Button
} from '@mui/material';
import {
  Psychology as PsychologyIcon,
  Refresh as RefreshIcon,
  Info as InfoIcon,
  Shield as ShieldIcon
} from '@mui/icons-material';

const Header = ({ onNewSession }) => {
  const handleInfoClick = () => {
    window.open('/api/privacy', '_blank');
  };

  return (
    <Box sx={{ 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'space-between',
      mb: 2,
      p: 2,
      bgcolor: 'background.paper',
      borderRadius: 2,
      boxShadow: 1
    }}>
      {/* Logo and Title */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          width: 48,
          height: 48,
          bgcolor: 'primary.main',
          borderRadius: '50%'
        }}>
          <PsychologyIcon sx={{ color: 'white', fontSize: 28 }} />
        </Box>
        
        <Box>
          <Typography variant="h4" sx={{ 
            fontWeight: 700,
            background: 'linear-gradient(45deg, #4A90A4 30%, #8FBC8F 90%)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            mb: 0.5
          }}>
            MindEase
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Your AI companion for mental wellness
          </Typography>
        </Box>
      </Box>

      {/* Action Buttons */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Tooltip title="Privacy & Resources">
          <IconButton onClick={handleInfoClick} sx={{ color: 'text.secondary' }}>
            <InfoIcon />
          </IconButton>
        </Tooltip>

        <Tooltip title="Data Protection">
          <IconButton sx={{ color: 'text.secondary' }}>
            <ShieldIcon />
          </IconButton>
        </Tooltip>

        <Button
          variant="outlined"
          startIcon={<RefreshIcon />}
          onClick={onNewSession}
          sx={{ 
            borderRadius: 3,
            textTransform: 'none'
          }}
        >
          New Session
        </Button>
      </Box>
    </Box>
  );
};

export default Header;