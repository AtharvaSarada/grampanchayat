import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  CardHeader,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Alert
} from '@mui/material';
import {
  Analytics,
  Assessment,
  Security,
  Download,
  Refresh,
  FilterList
} from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';
import { getAuditLogs, AUDIT_ACTIONS } from '../../services/auditService';
import { format } from 'date-fns';
import ChakraSpinner from '../../components/common/ChakraSpinner';
import toast from 'react-hot-toast';

const AdminReports = () => {
  const { currentUser } = useAuth();
  const [auditLogs, setAuditLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [actionFilter, setActionFilter] = useState('');
  const [resourceFilter, setResourceFilter] = useState('');
  const [systemStats, setSystemStats] = useState({
    totalUsers: 0,
    totalApplications: 0,
    totalServices: 0,
    auditLogCount: 0
  });

  useEffect(() => {
    if (currentUser && ['admin', 'officer'].includes(currentUser.role)) {
      loadAuditLogs();
      loadSystemStats();
    }
  }, [currentUser, actionFilter, resourceFilter]);

  const loadAuditLogs = async () => {
    try {
      setLoading(true);
      const filters = {
        limit: 100
      };
      
      if (actionFilter) filters.action = actionFilter;
      if (resourceFilter) filters.resourceType = resourceFilter;
      
      const logs = await getAuditLogs(filters);
      setAuditLogs(logs);
    } catch (error) {
      console.error('Error loading audit logs:', error);
      toast.error('Failed to load audit logs');
    } finally {
      setLoading(false);
    }
  };

  const loadSystemStats = async () => {
    try {
      // This would typically come from a dedicated analytics service
      // For now, we'll show placeholder data
      setSystemStats({
        totalUsers: 150,
        totalApplications: 1250,
        totalServices: 25,
        auditLogCount: auditLogs.length
      });
    } catch (error) {
      console.error('Error loading system stats:', error);
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const getActionColor = (action) => {
    if (action.includes('delete')) return 'error';
    if (action.includes('create')) return 'success';
    if (action.includes('update')) return 'warning';
    if (action.includes('login')) return 'info';
    return 'default';
  };

  const exportAuditLogs = () => {
    try {
      const csvContent = [
        ['Timestamp', 'User', 'Action', 'Resource Type', 'Resource ID', 'Details'].join(','),
        ...auditLogs.map(log => [
          format(log.timestamp, 'yyyy-MM-dd HH:mm:ss'),
          log.userEmail,
          log.action,
          log.resourceType,
          log.resourceId || '',
          JSON.stringify(log.details).replace(/,/g, ';')
        ].join(','))
      ].join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `audit-logs-${format(new Date(), 'yyyy-MM-dd')}.csv`;
      a.click();
      window.URL.revokeObjectURL(url);
      
      toast.success('Audit logs exported successfully');
    } catch (error) {
      console.error('Error exporting audit logs:', error);
      toast.error('Failed to export audit logs');
    }
  };

  if (!currentUser || !['admin', 'officer'].includes(currentUser.role)) {
    return (
      <Container maxWidth="lg">
        <Alert severity="error" sx={{ mt: 4 }}>
          Access denied. Admin or Officer privileges required.
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl">
      <Box sx={{ mt: 4, mb: 4 }}>
        {/* Header */}
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
          <Analytics sx={{ mr: 2, fontSize: 32, color: 'primary.main' }} />
          <Typography variant="h4" component="h1">
            System Reports & Analytics
          </Typography>
        </Box>

        {/* System Statistics */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent sx={{ textAlign: 'center' }}>
                <Typography variant="h4" color="primary">
                  {systemStats.totalUsers}
                </Typography>
                <Typography color="text.secondary">
                  Total Users
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent sx={{ textAlign: 'center' }}>
                <Typography variant="h4" color="success.main">
                  {systemStats.totalApplications}
                </Typography>
                <Typography color="text.secondary">
                  Total Applications
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent sx={{ textAlign: 'center' }}>
                <Typography variant="h4" color="info.main">
                  {systemStats.totalServices}
                </Typography>
                <Typography color="text.secondary">
                  Active Services
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent sx={{ textAlign: 'center' }}>
                <Typography variant="h4" color="warning.main">
                  {systemStats.auditLogCount}
                </Typography>
                <Typography color="text.secondary">
                  Audit Log Entries
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Audit Logs Section */}
        <Card>
          <CardHeader
            title={
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Security sx={{ mr: 1 }} />
                Audit Logs
              </Box>
            }
            action={
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button
                  startIcon={<Refresh />}
                  onClick={loadAuditLogs}
                  disabled={loading}
                  size="small"
                >
                  Refresh
                </Button>
                <Button
                  startIcon={<Download />}
                  onClick={exportAuditLogs}
                  variant="outlined"
                  size="small"
                >
                  Export
                </Button>
              </Box>
            }
          />
          <CardContent>
            {/* Filters */}
            <Grid container spacing={2} sx={{ mb: 3 }}>
              <Grid item xs={12} sm={6} md={3}>
                <FormControl fullWidth size="small">
                  <InputLabel>Action Filter</InputLabel>
                  <Select
                    value={actionFilter}
                    onChange={(e) => setActionFilter(e.target.value)}
                    label="Action Filter"
                  >
                    <MenuItem value="">All Actions</MenuItem>
                    {Object.values(AUDIT_ACTIONS).map(action => (
                      <MenuItem key={action} value={action}>
                        {action.replace('_', ' ').toUpperCase()}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <FormControl fullWidth size="small">
                  <InputLabel>Resource Filter</InputLabel>
                  <Select
                    value={resourceFilter}
                    onChange={(e) => setResourceFilter(e.target.value)}
                    label="Resource Filter"
                  >
                    <MenuItem value="">All Resources</MenuItem>
                    <MenuItem value="user">User</MenuItem>
                    <MenuItem value="service">Service</MenuItem>
                    <MenuItem value="application">Application</MenuItem>
                    <MenuItem value="document">Document</MenuItem>
                    <MenuItem value="system">System</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>

            {/* Audit Logs Table */}
            {loading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
                <ChakraSpinner size="40px" />
              </Box>
            ) : (
              <>
                <TableContainer component={Paper} variant="outlined">
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Timestamp</TableCell>
                        <TableCell>User</TableCell>
                        <TableCell>Action</TableCell>
                        <TableCell>Resource</TableCell>
                        <TableCell>Details</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {auditLogs
                        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                        .map((log) => (
                          <TableRow key={log.id}>
                            <TableCell>
                              {format(log.timestamp, 'MMM dd, yyyy HH:mm:ss')}
                            </TableCell>
                            <TableCell>
                              <Box>
                                <Typography variant="body2">
                                  {log.userEmail}
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                  {log.userRole}
                                </Typography>
                              </Box>
                            </TableCell>
                            <TableCell>
                              <Chip
                                label={log.action.replace('_', ' ')}
                                color={getActionColor(log.action)}
                                size="small"
                              />
                            </TableCell>
                            <TableCell>
                              <Typography variant="body2">
                                {log.resourceType}
                              </Typography>
                              {log.resourceId && (
                                <Typography variant="caption" color="text.secondary">
                                  ID: {log.resourceId}
                                </Typography>
                              )}
                            </TableCell>
                            <TableCell>
                              <Typography variant="body2" sx={{ maxWidth: 200 }}>
                                {JSON.stringify(log.details, null, 2).substring(0, 100)}
                                {JSON.stringify(log.details).length > 100 && '...'}
                              </Typography>
                            </TableCell>
                          </TableRow>
                        ))}
                    </TableBody>
                  </Table>
                </TableContainer>
                <TablePagination
                  rowsPerPageOptions={[5, 10, 25, 50]}
                  component="div"
                  count={auditLogs.length}
                  rowsPerPage={rowsPerPage}
                  page={page}
                  onPageChange={handleChangePage}
                  onRowsPerPageChange={handleChangeRowsPerPage}
                />
              </>
            )}
          </CardContent>
        </Card>
      </Box>
    </Container>
  );
};

export default AdminReports;
