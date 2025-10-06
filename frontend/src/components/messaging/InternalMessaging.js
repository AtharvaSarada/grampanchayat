import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Divider,
  Badge,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
} from '@mui/material';
import ChakraSpinner from '../common/ChakraSpinner';
import {
  Message,
  Send,
  Add,
  Group,
  Person,
  Close,
  AttachFile,
  Search
} from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';
import { db } from '../../services/firebase';
import {
  collection,
  addDoc,
  query,
  where,
  orderBy,
  onSnapshot,
  doc,
  updateDoc,
  getDocs,
  arrayUnion,
  serverTimestamp
} from 'firebase/firestore';
import { format, formatDistanceToNow } from 'date-fns';
import toast from 'react-hot-toast';

const InternalMessaging = () => {
  const { currentUser } = useAuth();
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [newConversationOpen, setNewConversationOpen] = useState(false);
  const [staffMembers, setStaffMembers] = useState([]);
  const [selectedStaff, setSelectedStaff] = useState([]);
  const [conversationTitle, setConversationTitle] = useState('');
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (currentUser && ['staff', 'officer', 'admin'].includes(currentUser.role)) {
      loadConversations();
      loadStaffMembers();
    }
  }, [currentUser]);

  useEffect(() => {
    if (selectedConversation) {
      loadMessages(selectedConversation.id);
    }
  }, [selectedConversation]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const loadConversations = () => {
    if (!currentUser?.uid) return;

    const conversationsQuery = query(
      collection(db, 'conversations'),
      where('participants', 'array-contains', currentUser.uid),
      orderBy('lastMessageAt', 'desc')
    );

    const unsubscribe = onSnapshot(conversationsQuery, (snapshot) => {
      const conversationsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        lastMessageAt: doc.data().lastMessageAt?.toDate() || new Date()
      }));
      setConversations(conversationsData);
      setLoading(false);
    });

    return unsubscribe;
  };

  const loadStaffMembers = async () => {
    try {
      const usersQuery = query(
        collection(db, 'users'),
        where('role', 'in', ['staff', 'officer', 'admin'])
      );
      const snapshot = await getDocs(usersQuery);
      const staff = snapshot.docs
        .map(doc => ({ id: doc.id, ...doc.data() }))
        .filter(user => user.id !== currentUser.uid);
      setStaffMembers(staff);
    } catch (error) {
      console.error('Error loading staff members:', error);
    }
  };

  const loadMessages = (conversationId) => {
    const messagesQuery = query(
      collection(db, 'conversations', conversationId, 'messages'),
      orderBy('createdAt', 'asc')
    );

    const unsubscribe = onSnapshot(messagesQuery, (snapshot) => {
      const messagesData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date()
      }));
      setMessages(messagesData);
      
      // Mark messages as read
      markMessagesAsRead(conversationId, messagesData);
    });

    return unsubscribe;
  };

  const markMessagesAsRead = async (conversationId, messages) => {
    try {
      const unreadMessages = messages.filter(
        msg => msg.senderId !== currentUser.uid && !msg.readBy?.includes(currentUser.uid)
      );

      for (const message of unreadMessages) {
        await updateDoc(doc(db, 'conversations', conversationId, 'messages', message.id), {
          readBy: arrayUnion(currentUser.uid)
        });
      }
    } catch (error) {
      console.error('Error marking messages as read:', error);
    }
  };

  const createConversation = async () => {
    if (!conversationTitle.trim() || selectedStaff.length === 0) {
      toast.error('Please provide a title and select participants');
      return;
    }

    try {
      const participants = [currentUser.uid, ...selectedStaff];
      const participantNames = [
        currentUser.name || currentUser.displayName,
        ...staffMembers
          .filter(staff => selectedStaff.includes(staff.id))
          .map(staff => staff.name || staff.displayName)
      ];

      const conversationData = {
        title: conversationTitle,
        participants,
        participantNames,
        createdBy: currentUser.uid,
        createdAt: serverTimestamp(),
        lastMessage: '',
        lastMessageAt: serverTimestamp(),
        lastMessageBy: currentUser.uid
      };

      const docRef = await addDoc(collection(db, 'conversations'), conversationData);
      
      // Send initial message
      await addDoc(collection(db, 'conversations', docRef.id, 'messages'), {
        senderId: currentUser.uid,
        senderName: currentUser.name || currentUser.displayName,
        content: `Started conversation: ${conversationTitle}`,
        type: 'system',
        createdAt: serverTimestamp(),
        readBy: [currentUser.uid]
      });

      setNewConversationOpen(false);
      setConversationTitle('');
      setSelectedStaff([]);
      toast.success('Conversation created successfully');
    } catch (error) {
      console.error('Error creating conversation:', error);
      toast.error('Failed to create conversation');
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedConversation) return;

    try {
      const messageData = {
        senderId: currentUser.uid,
        senderName: currentUser.name || currentUser.displayName,
        content: newMessage.trim(),
        type: 'text',
        createdAt: serverTimestamp(),
        readBy: [currentUser.uid]
      };

      // Add message to conversation
      await addDoc(
        collection(db, 'conversations', selectedConversation.id, 'messages'),
        messageData
      );

      // Update conversation last message
      await updateDoc(doc(db, 'conversations', selectedConversation.id), {
        lastMessage: newMessage.trim(),
        lastMessageAt: serverTimestamp(),
        lastMessageBy: currentUser.uid
      });

      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Failed to send message');
    }
  };

  const getUnreadCount = (conversation) => {
    return messages.filter(
      msg => msg.senderId !== currentUser.uid && !msg.readBy?.includes(currentUser.uid)
    ).length;
  };

  if (!currentUser || !['staff', 'officer', 'admin'].includes(currentUser.role)) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography variant="h6" color="error">
          Access denied. Staff privileges required.
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ height: '70vh', display: 'flex' }}>
      {/* Conversations List */}
      <Paper sx={{ width: 300, display: 'flex', flexDirection: 'column' }}>
        <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Typography variant="h6">
              <Message sx={{ mr: 1, verticalAlign: 'middle' }} />
              Messages
            </Typography>
            <IconButton onClick={() => setNewConversationOpen(true)} size="small">
              <Add />
            </IconButton>
          </Box>
        </Box>

        <List sx={{ flexGrow: 1, overflow: 'auto' }}>
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
              <ChakraSpinner size="30px" />
            </Box>
          ) : conversations.length === 0 ? (
            <Box sx={{ p: 3, textAlign: 'center' }}>
              <Typography variant="body2" color="text.secondary">
                No conversations yet
              </Typography>
            </Box>
          ) : (
            conversations.map((conversation) => (
              <ListItem
                key={conversation.id}
                button
                selected={selectedConversation?.id === conversation.id}
                onClick={() => setSelectedConversation(conversation)}
              >
                <ListItemAvatar>
                  <Avatar>
                    <Group />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Typography variant="subtitle2" noWrap sx={{ flexGrow: 1 }}>
                        {conversation.title}
                      </Typography>
                      {getUnreadCount(conversation) > 0 && (
                        <Badge badgeContent={getUnreadCount(conversation)} color="primary" />
                      )}
                    </Box>
                  }
                  secondary={
                    <Box>
                      <Typography variant="body2" noWrap>
                        {conversation.lastMessage}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {formatDistanceToNow(conversation.lastMessageAt, { addSuffix: true })}
                      </Typography>
                    </Box>
                  }
                />
              </ListItem>
            ))
          )}
        </List>
      </Paper>

      {/* Messages Area */}
      <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        {selectedConversation ? (
          <>
            {/* Chat Header */}
            <Paper sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
              <Typography variant="h6">{selectedConversation.title}</Typography>
              <Typography variant="body2" color="text.secondary">
                Participants: {selectedConversation.participantNames?.join(', ')}
              </Typography>
            </Paper>

            {/* Messages */}
            <Box sx={{ flexGrow: 1, overflow: 'auto', p: 1 }}>
              {messages.map((message) => (
                <Box
                  key={message.id}
                  sx={{
                    display: 'flex',
                    justifyContent: message.senderId === currentUser.uid ? 'flex-end' : 'flex-start',
                    mb: 1
                  }}
                >
                  <Paper
                    sx={{
                      p: 1.5,
                      maxWidth: '70%',
                      bgcolor: message.senderId === currentUser.uid ? 'primary.main' : 'grey.100',
                      color: message.senderId === currentUser.uid ? 'white' : 'text.primary'
                    }}
                  >
                    {message.senderId !== currentUser.uid && (
                      <Typography variant="caption" sx={{ fontWeight: 'bold' }}>
                        {message.senderName}
                      </Typography>
                    )}
                    <Typography variant="body2">{message.content}</Typography>
                    <Typography
                      variant="caption"
                      sx={{
                        display: 'block',
                        textAlign: 'right',
                        opacity: 0.7,
                        mt: 0.5
                      }}
                    >
                      {format(message.createdAt, 'HH:mm')}
                    </Typography>
                  </Paper>
                </Box>
              ))}
              <div ref={messagesEndRef} />
            </Box>

            {/* Message Input */}
            <Box sx={{ p: 2, borderTop: 1, borderColor: 'divider' }}>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <TextField
                  fullWidth
                  placeholder="Type a message..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                  size="small"
                />
                <Button
                  variant="contained"
                  onClick={sendMessage}
                  disabled={!newMessage.trim()}
                  sx={{ minWidth: 'auto', px: 2 }}
                >
                  <Send />
                </Button>
              </Box>
            </Box>
          </>
        ) : (
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexGrow: 1 }}>
            <Typography variant="h6" color="text.secondary">
              Select a conversation to start messaging
            </Typography>
          </Box>
        )}
      </Box>

      {/* New Conversation Dialog */}
      <Dialog open={newConversationOpen} onClose={() => setNewConversationOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Start New Conversation</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Conversation Title"
            value={conversationTitle}
            onChange={(e) => setConversationTitle(e.target.value)}
            sx={{ mb: 2, mt: 1 }}
          />
          <FormControl fullWidth>
            <InputLabel>Select Staff Members</InputLabel>
            <Select
              multiple
              value={selectedStaff}
              onChange={(e) => setSelectedStaff(e.target.value)}
              renderValue={(selected) => (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {selected.map((value) => {
                    const staff = staffMembers.find(s => s.id === value);
                    return (
                      <Chip key={value} label={staff?.name || staff?.displayName} size="small" />
                    );
                  })}
                </Box>
              )}
            >
              {staffMembers.map((staff) => (
                <MenuItem key={staff.id} value={staff.id}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Avatar sx={{ width: 24, height: 24, mr: 1 }}>
                      <Person />
                    </Avatar>
                    {staff.name || staff.displayName} ({staff.role})
                  </Box>
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setNewConversationOpen(false)}>Cancel</Button>
          <Button onClick={createConversation} variant="contained">
            Create Conversation
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default InternalMessaging;
