import React, { useState, useRef, useEffect } from 'react';
import {
  Box,
  Paper,
  TextField,
  IconButton,
  Typography,
  Fab,
  Collapse,
  Card,
  CardContent,
  Button,
  Chip,
  Alert,
  Divider,
  Avatar,
  Badge
} from '@mui/material';
import ChakraSpinner from '../common/ChakraSpinner';
import {
  Chat as ChatIcon,
  Send as SendIcon,
  Close as CloseIcon,
  SmartToy as BotIcon,
  Person as PersonIcon,
  Launch as LaunchIcon,
  AutoAwesome as GeminiIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../i18n/LanguageProvider';

// Use the deployed Firebase Functions URL
const API_BASE_URL = 'https://api-vastrf6wqa-uc.a.run.app';

const GeminiProChatbot = () => {
  const { t, language, isMarathi } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'bot',
      text: t('chatbot.greeting', isMarathi ? 'नमस्कार! आज मी तुम्हाला कशात मदत करू शकतो/शकते? 😊' : 'Hello! What can I help you with today? 😊'),
      timestamp: new Date()
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState('connected');
  const messagesEndRef = useRef(null);
  const navigate = useNavigate();

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Update the initial greeting if the user changes the site language before chatting
  useEffect(() => {
    setMessages(prev => {
      if (prev.length === 1 && prev[0].type === 'bot') {
        const cloned = [...prev];
        cloned[0] = {
          ...cloned[0],
          text: t('chatbot.greeting', isMarathi ? 'नमस्कार! आज मी तुम्हाला कशात मदत करू शकतो/शकते? 😊' : 'Hello! What can I help you with today? 😊')
        };
        return cloned;
      }
      return prev;
    });
  }, [language, isMarathi, t]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Test connection on mount
  useEffect(() => {
    const testConnection = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/health`);
        if (response.ok) {
          setConnectionStatus('connected');
        } else {
          setConnectionStatus('error');
        }
      } catch (error) {
        setConnectionStatus('error');
      }
    };
    testConnection();
  }, []);

  const sendMessage = async () => {
    if (!inputText.trim() || isLoading) return;

    const userMessage = {
      id: Date.now(),
      type: 'user',
      text: inputText.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsLoading(true);
    setConnectionStatus('sending');

    try {
      const response = await fetch(`${API_BASE_URL}/intelligent-chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          query: userMessage.text,
          lang: language
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      setConnectionStatus('connected');

      if (data.success) {
        const botMessage = {
          id: Date.now() + 1,
          type: 'bot',
          text: data.message,
          recommendedService: data.recommended_service,
          applicationLinks: data.application_links,
          method: data.method,
          timestamp: new Date()
        };
        setMessages(prev => [...prev, botMessage]);
      } else {
        const botMessage = {
          id: Date.now() + 1,
          type: 'bot',
          text: data.message || t('chatbot.fallback', isMarathi ? 'मला तुमची विनंती समजण्यात अडचण येत आहे. कृपया पुन्हा स्पष्टपणे सांगा.' : "I'm having trouble understanding your request. Could you try rephrasing it?"),
          fallback: true,
          suggestions: data.suggestions || t('chatbot.quickSuggestions', []),
          timestamp: new Date()
        };
        setMessages(prev => [...prev, botMessage]);
      }
    } catch (error) {
      console.error('Gemini Pro Chatbot error:', error);
      console.error('Error details:', {
        message: error.message,
        name: error.name,
        stack: error.stack
      });
      setConnectionStatus('error');
      const errorMessage = {
        id: Date.now() + 1,
        type: 'bot',
        text: t('chatbot.errorProcessing', isMarathi 
          ? 'सध्या तुमची विनंती प्रक्रिया करण्यात अडचण येत आहे. कृपया तुम्हाला नेमकी कोणती सरकारी सेवा हवी आहे ते सांगा. उदाहरणार्थ, "मला जन्म प्रमाणपत्र हवे आहे" किंवा "माझे लग्न आहे, मला काय लागेल?" असे सांगा. 🤔'
          : `I'm having trouble processing your request right now. Could you please tell me specifically what government service you need? For example, you could say 'I need a birth certificate' or 'I'm getting married, what do I need?' 🤔`
        ),
        fallback: true,
        suggestions: t('chatbot.quickSuggestions', isMarathi ? [
          'माझे लग्न पुढच्या महिन्यात आहे 💍',
          'माझ्या बायकोला नुकताच बाळ झाला 👶',
          'मला छोटा व्यवसाय सुरू करायचा आहे 🏪',
          'मला घरासाठी पाणी कनेक्शन हवे आहे 💧',
          'मला घर बांधायचे आहे 🏠',
          'मला उत्पन्न प्रमाणपत्र हवे आहे 📄'
        ] : [
          "I'm getting married next month 💍",
          "My wife just had a baby 👶",
          "I want to start a small business 🏪",
          "I need water connection 💧",
          "I want to build a house 🏠",
          "I need income certificate 📄"
        ]),
        error: true,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
      // Reset status after 3 seconds
      setTimeout(() => setConnectionStatus('connected'), 3000);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const handleServiceApply = (applicationLink) => {
    setIsOpen(false);
    navigate(applicationLink);
  };

  const handleSuggestionClick = (suggestion) => {
    setInputText(suggestion);
  };

  const renderMessage = (message) => {
    const isBot = message.type === 'bot';
    
    return (
      <Box
        key={message.id}
        sx={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'flex-start',
          mb: 2,
          justifyContent: isBot ? 'flex-start' : 'flex-end'
        }}
      >
        {isBot && (
          <Avatar
            sx={{ 
              bgcolor: 'primary.main', 
              width: 36, 
              height: 36,
              mr: 1,
              mt: 0.5
            }}
          >
            <GeminiIcon fontSize="small" />
          </Avatar>
        )}
        
        <Box sx={{ maxWidth: '80%' }}>
          <Paper
            elevation={2}
            sx={{
              p: 2,
              bgcolor: isBot ? 'grey.50' : 'primary.main',
              color: isBot ? 'text.primary' : 'primary.contrastText',
              borderRadius: 2,
              borderBottomLeftRadius: isBot ? 0.5 : 2,
              borderBottomRightRadius: isBot ? 2 : 0.5
            }}
          >
            <Typography 
              variant="body2" 
              sx={{ 
                mb: message.recommendedService ? 1 : 0,
                lineHeight: 1.5,
                whiteSpace: 'pre-line'
              }}
            >
              {message.text}
            </Typography>
            
            {/* Gemini Pro Badge */}
            {message.method === 'gemini_pro_intelligent' && (
              <Box sx={{ mt: 1, mb: 1 }}>
                <Chip 
                  icon={<GeminiIcon />}
                  label="Powered by Gemini Pro" 
                  size="small" 
                  variant="outlined" 
                  color="info"
                  sx={{ fontSize: '0.7rem' }}
                />
              </Box>
            )}
            
            {/* Service Recommendation Card */}
            {message.recommendedService && (
              <Card variant="outlined" sx={{ mt: 2, bgcolor: 'background.paper' }}>
                <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <Typography variant="h6" color="primary" sx={{ flexGrow: 1 }}>
                      📋 {message.recommendedService.service_name}
                    </Typography>
                    <Chip 
                      label={message.recommendedService.category} 
                      size="small" 
                      color="secondary" 
                      variant="outlined"
                    />
                  </Box>
                  
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    {message.recommendedService.description}
                  </Typography>
                  
                  <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
                    <Chip 
                      label={`💰 ${isMarathi ? 'शुल्क' : 'Fee'}: ${message.recommendedService.fee}`} 
                      size="small" 
                      variant="outlined"
                    />
                    <Chip 
                      label={`⏱️ ${isMarathi ? 'वेळ' : 'Time'}: ${message.recommendedService.processing_time}`} 
                      size="small" 
                      variant="outlined"
                    />
                  </Box>
                  
                  {message.recommendedService.documents_required && message.recommendedService.documents_required.length > 0 && (
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="subtitle2" gutterBottom>
                        📄 {isMarathi ? 'आवश्यक कागदपत्रे:' : 'Required Documents:'}
                      </Typography>
                      <Box sx={{ pl: 1 }}>
                        {message.recommendedService.documents_required.map((doc, index) => (
                          <Typography 
                            key={index}
                            variant="body2" 
                            color="text.secondary"
                            sx={{ display: 'block', mb: 0.5 }}
                          >
                            • {doc}
                          </Typography>
                        ))}
                      </Box>
                    </Box>
                  )}
                  
                  <Button
                    variant="contained"
                    startIcon={<LaunchIcon />}
                    onClick={() => handleServiceApply(message.recommendedService.application_link)}
                    fullWidth
                    sx={{ mt: 1 }}
                  >
                    {t('services.applyNow', isMarathi ? 'आता अर्ज करा' : 'Apply Now')}
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Fallback: Show apply links if present even when no structured service object */}
            {!message.recommendedService && message.applicationLinks && message.applicationLinks.length > 0 && (
              <Box sx={{ mt: 2 }}>
                <Typography variant="subtitle2" gutterBottom>
                  {t('services.applyNow', isMarathi ? 'आता अर्ज करा' : 'Apply Now')}
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  {message.applicationLinks.slice(0, 3).map((link, idx) => (
                    <Button
                      key={idx}
                      variant="contained"
                      startIcon={<LaunchIcon />}
                      onClick={() => handleServiceApply(link)}
                    >
                      {link}
                    </Button>
                  ))}
                </Box>
              </Box>
            )}
            
            {/* Fallback suggestions */}
            {message.fallback && message.suggestions && message.suggestions.length > 0 && (
              <Box sx={{ mt: 2 }}>
                <Typography variant="caption" color="text.secondary" gutterBottom>
                  {t('chatbot.tryExamples', isMarathi ? 'ही उदाहरणे वापरून पाहा:' : 'Try these examples:')}
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1 }}>
                  {message.suggestions.map((suggestion, index) => (
                    <Chip
                      key={index}
                      label={suggestion}
                      size="small"
                      variant="outlined"
                      clickable
                      onClick={() => handleSuggestionClick(suggestion)}
                    />
                  ))}
                </Box>
              </Box>
            )}
            
            {message.error && (
              <Alert severity="error" sx={{ mt: 1 }}>
                Connection Error - Please try again
              </Alert>
            )}
          </Paper>
          
          <Typography variant="caption" color="text.secondary" sx={{ 
            display: 'block', 
            textAlign: isBot ? 'left' : 'right',
            mt: 0.5,
            ml: isBot ? 1 : 0
          }}>
            {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </Typography>
        </Box>
        
        {!isBot && (
          <Avatar
            sx={{ 
              bgcolor: 'primary.main', 
              width: 36, 
              height: 36,
              ml: 1,
              mt: 0.5
            }}
          >
            <PersonIcon fontSize="small" />
          </Avatar>
        )}
      </Box>
    );
  };

  const quickSuggestions = t('chatbot.quickSuggestions', isMarathi ? [
    'माझे लग्न पुढच्या महिन्यात आहे 💍',
    'माझ्या बायकोला नुकताच बाळ झाला 👶',
    'मला छोटा व्यवसाय सुरू करायचा आहे 🏪',
    'मला पाणी कनेक्शन हवे आहे 💧',
    'मला घर बांधायचे आहे 🏠',
    'मला उत्पन्न प्रमाणपत्र हवे आहे 📄'
  ] : [
    'I\'m getting married next month 💍',
    'My wife just had a baby 👶',
    'I want to start a small business 🏪',
    'I need water connection 💧',
    'I want to build a house 🏠',
    'I need income certificate 📄'
  ]);

  const getConnectionStatusColor = () => {
    switch (connectionStatus) {
      case 'connected': return 'success';
      case 'sending': return 'info';
      case 'error': return 'error';
      default: return 'default';
    }
  };

  const getConnectionStatusText = () => {
    switch (connectionStatus) {
      case 'connected': return t('chatbot.status.connected', isMarathi ? '🟢 जेमिनी प्रोशी कनेक्ट झाले' : '🟢 Connected to Gemini Pro');
      case 'sending': return t('chatbot.status.sending', isMarathi ? '📡 एआयकडे पाठवत आहे...' : '📡 Sending to AI...');
      case 'error': return t('chatbot.status.error', isMarathi ? '🔴 कनेक्शन त्रुटी' : '🔴 Connection Error');
      default: return 'Status Unknown';
    }
  };

  return (
    <>
      {/* Floating Chat Button */}
      <Badge
        badgeContent="AI"
        color="secondary"
        sx={{
          position: 'fixed',
          bottom: 24,
          right: 24,
          zIndex: 1000,
          '& .MuiBadge-badge': {
            backgroundColor: '#ff6f00',
            color: 'white',
            fontSize: '10px',
            fontWeight: 'bold'
          }
        }}
      >
        <Fab
          color="primary"
          aria-label="gemini pro chat"
          onClick={() => setIsOpen(!isOpen)}
          sx={{
            background: 'linear-gradient(45deg, #4CAF50 30%, #2196F3 90%)',
            '&:hover': {
              background: 'linear-gradient(45deg, #388e3c 30%, #1976d2 90%)',
            }
          }}
        >
          {isOpen ? <CloseIcon /> : <GeminiIcon />}
        </Fab>
      </Badge>

      {/* Chat Window */}
      <Collapse in={isOpen}>
        <Paper
          elevation={8}
          sx={{
            position: 'fixed',
            bottom: 100,
            right: 24,
            width: 420,
            maxWidth: '90vw',
            height: 600,
            maxHeight: '80vh',
            zIndex: 999,
            display: 'flex',
            flexDirection: 'column',
            borderRadius: 3,
            overflow: 'hidden'
          }}
        >
          {/* Header */}
          <Box
            sx={{
              p: 2,
              background: 'linear-gradient(90deg, #4CAF50, #2196F3)',
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <GeminiIcon sx={{ mr: 1 }} />
              <Box>
                <Typography variant="h6" sx={{ lineHeight: 1 }}>
                  Gemini Pro Assistant
                </Typography>
                <Typography variant="caption" sx={{ opacity: 0.9 }}>
                  Intelligent AI for Government Services
                </Typography>
              </Box>
            </Box>
            <IconButton
              size="small"
              onClick={() => setIsOpen(false)}
              sx={{ color: 'inherit' }}
            >
              <CloseIcon />
            </IconButton>
          </Box>

          {/* Connection Status */}
          <Box
            sx={{
              px: 2,
              py: 1,
              bgcolor: 'grey.100',
              borderBottom: 1,
              borderColor: 'grey.200'
            }}
          >
            <Chip
              size="small"
              label={getConnectionStatusText()}
              color={getConnectionStatusColor()}
              variant="outlined"
              sx={{ fontSize: '0.7rem' }}
            />
          </Box>

          {/* Messages Area */}
          <Box
            sx={{
              flex: 1,
              p: 2,
              overflowY: 'auto',
              bgcolor: 'background.default'
            }}
          >
            {messages.map(renderMessage)}
            
            {isLoading && (
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Avatar
                  sx={{ 
                    bgcolor: 'primary.main', 
                    width: 36, 
                    height: 36,
                    mr: 1
                  }}
                >
                  <GeminiIcon fontSize="small" />
                </Avatar>
                <Paper elevation={2} sx={{ p: 2, bgcolor: 'grey.50' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <ChakraSpinner size="20px" />
                    <Typography variant="body2">{t('chatbot.thinking', isMarathi ? 'जेमिनी प्रो विचार करत आहे...' : 'Gemini Pro is thinking...')}</Typography>
                  </Box>
                </Paper>
              </Box>
            )}
            
            <div ref={messagesEndRef} />
          </Box>

          {/* Quick Suggestions (shown when no messages except welcome) */}
          {messages.length === 1 && (
            <Box sx={{ p: 2, bgcolor: 'background.paper' }}>
              <Typography variant="caption" color="text.secondary" gutterBottom>
                {t('chatbot.tryExamples', isMarathi ? 'ही उदाहरणे वापरून पाहा:' : 'Try these examples:')}
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1 }}>
                {quickSuggestions.map((suggestion, index) => (
                  <Chip
                    key={index}
                    label={suggestion}
                    size="small"
                    variant="outlined"
                    clickable
                    onClick={() => handleSuggestionClick(suggestion)}
                    sx={{ 
                      '&:hover': { 
                        backgroundColor: 'primary.light',
                        color: 'primary.contrastText'
                      }
                    }}
                  />
                ))}
              </Box>
            </Box>
          )}

          <Divider />

          {/* Input Area */}
          <Box sx={{ p: 2, bgcolor: 'background.paper' }}>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <TextField
                fullWidth
                variant="outlined"
                placeholder={t('chatbot.inputPlaceholder', isMarathi ? 'कोणत्याही सरकारी सेवेसंबंधी मला विचारा...' : 'Ask me about any government service...')}
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyPress={handleKeyPress}
                disabled={isLoading}
                size="small"
                multiline
                maxRows={3}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 3,
                  }
                }}
              />
              <IconButton
                color="primary"
                onClick={sendMessage}
                disabled={!inputText.trim() || isLoading}
                sx={{
                  bgcolor: 'primary.main',
                  color: 'white',
                  '&:hover': {
                    bgcolor: 'primary.dark',
                  },
                  '&:disabled': {
                    bgcolor: 'grey.300',
                    color: 'grey.500'
                  }
                }}
              >
                <SendIcon />
              </IconButton>
            </Box>
          </Box>
        </Paper>
      </Collapse>
    </>
  );
};

export default GeminiProChatbot;
