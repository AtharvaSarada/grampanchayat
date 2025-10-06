import React, { useState, useEffect } from 'react';
import {
  Badge,
  IconButton,
  Menu,
  MenuItem,
  Typography,
  Box,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Button,
  Chip
} from '@mui/material';
import {
  Notifications,
  NotificationsActive,
  Info,
  CheckCircle,
  Warning,
  Error,
  Assignment,
  Person,
  Build,
  Refresh
} from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { db } from '../../services/firebase';
import { 
  collection, 
  query, 
  where, 
  orderBy, 
  limit, 
  onSnapshot,
  doc,
  updateDoc,
  arrayUnion
} from 'firebase/firestore';
import { formatDistanceToNow } from 'date-fns';

const NotificationSystem = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!currentUser?.uid) return;

    // Subscribe to real-time notifications
    const notificationsQuery = query(
      collection(db, 'notifications'),
      where('userId', '==', currentUser.uid),
      orderBy('createdAt', 'desc'),
      limit(20)
    );

    const unsubscribe = onSnapshot(notificationsQuery, (snapshot) => {
      const notificationsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date()
      }));
      
      setNotifications(notificationsData);
      setUnreadCount(notificationsData.filter(n => !n.read).length);
    });

    return () => unsubscribe();
  }, [currentUser?.uid]);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const markAsRead = async (notificationId) => {
    try {
      const notificationRef = doc(db, 'notifications', notificationId);
      await updateDoc(notificationRef, {
        read: true,
        readAt: new Date()
      });
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      setLoading(true);
      const unreadNotifications = notifications.filter(n => !n.read);
      
      const promises = unreadNotifications.map(notification => 
        updateDoc(doc(db, 'notifications', notification.id), {
          read: true,
          readAt: new Date()
        })
      );
      
      await Promise.all(promises);
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    } finally {
      setLoading(false);
    }
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'success':
        return <CheckCircle color="success" />;
      case 'warning':
        return <Warning color="warning" />;
      case 'error':
        return <Error color="error" />;
      case 'application':
        return <Assignment color="primary" />;
      case 'user':
        return <Person color="primary" />;
      case 'service':
        return <Build color="primary" />;
      default:
        return <Info color="info" />;
    }
  };

  const getNotificationColor = (type) => {
    switch (type) {
      case 'success':
        return 'success';
      case 'warning':
        return 'warning';
      case 'error':
        return 'error';
      default:
        return 'primary';
    }
  };

  const handleReapply = (notification) => {
    // Get service type from notification metadata
    const serviceType = notification.metadata?.serviceType;
    if (!serviceType) return;
    
    // Map service type to service ID for routing
    const serviceIdMap = {
      'birth_certificate': 1,
      'death_certificate': 2,
      'marriage_certificate': 3,
      'bpl_certificate': 4,
      'caste_certificate': 5,
      'domicile_certificate': 6,
      'income_certificate': 7,
      'scholarship_application': 8,
      'agricultural_subsidy': 9,
      'crop_insurance': 10,
      'building_permission': 11,
      'drainage_connection': 12,
      'street_light_installation': 13,
      'water_connection': 14,
      'property_tax_assessment': 15,
      'property_tax_payment': 16,
      'water_tax_payment': 17,
      'trade_license': 18,
      'health_certificate': 19,
      'vaccination_certificate': 20,
      'school_transfer_certificate': 21
    };
    
    const serviceId = serviceIdMap[serviceType];
    if (serviceId) {
      handleClose();
      navigate(`/apply/${serviceId}`);
    }
  };

  const isRejectedApplication = (notification) => {
    return notification.metadata?.status === 'rejected' && 
           notification.metadata?.serviceType;
  };

  if (!currentUser) return null;

  return (
    <>
      <IconButton
        size="large"
        aria-label={`${unreadCount} new notifications`}
        color="inherit"
        onClick={handleClick}
      >
        <Badge badgeContent={unreadCount} color="error">
          {unreadCount > 0 ? <NotificationsActive /> : <Notifications />}
        </Badge>
      </IconButton>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        PaperProps={{
          sx: { width: 400, maxHeight: 600 }
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        {/* Header */}
        <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6">
            Notifications
          </Typography>
          {unreadCount > 0 && (
            <Button
              size="small"
              onClick={markAllAsRead}
              disabled={loading}
            >
              Mark all read
            </Button>
          )}
        </Box>
        
        <Divider />

        {/* Notifications List */}
        {notifications.length === 0 ? (
          <Box sx={{ p: 3, textAlign: 'center' }}>
            <Notifications sx={{ fontSize: 48, color: 'text.secondary', mb: 1 }} />
            <Typography variant="body2" color="text.secondary">
              No notifications yet
            </Typography>
          </Box>
        ) : (
          <List sx={{ maxHeight: 400, overflow: 'auto' }}>
            {notifications.map((notification) => (
              <ListItem
                key={notification.id}
                sx={{
                  bgcolor: notification.read ? 'transparent' : 'action.hover',
                  borderLeft: notification.read ? 'none' : `3px solid`,
                  borderLeftColor: notification.read ? 'transparent' : `${getNotificationColor(notification.type)}.main`,
                  cursor: 'pointer',
                  '&:hover': {
                    bgcolor: 'action.selected'
                  }
                }}
                onClick={() => !notification.read && markAsRead(notification.id)}
              >
                <ListItemIcon>
                  {getNotificationIcon(notification.type)}
                </ListItemIcon>
                <ListItemText
                  primary={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography variant="subtitle2" component="span">
                        {notification.title}
                      </Typography>
                      {!notification.read && (
                        <Chip label="New" size="small" color="primary" />
                      )}
                    </Box>
                  }
                  secondary={
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        {notification.message}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {formatDistanceToNow(notification.createdAt, { addSuffix: true })}
                      </Typography>
                      {isRejectedApplication(notification) && (
                        <Box sx={{ mt: 1 }}>
                          <Button
                            size="small"
                            variant="contained"
                            color="primary"
                            startIcon={<Refresh />}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleReapply(notification);
                            }}
                            sx={{ textTransform: 'none' }}
                          >
                            Reapply Now
                          </Button>
                        </Box>
                      )}
                    </Box>
                  }
                />
              </ListItem>
            ))}
          </List>
        )}

        {notifications.length > 0 && (
          <>
            <Divider />
            <Box sx={{ p: 1, textAlign: 'center' }}>
              <Button size="small" onClick={handleClose}>
                View All Notifications
              </Button>
            </Box>
          </>
        )}
      </Menu>
    </>
  );
};

export default NotificationSystem;
