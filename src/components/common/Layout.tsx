/**
 * Main Layout Component
 * School Advisories System
 * 
 * Application layout with AppBar, Sidebar, and content area
 */

import { useState, type ReactNode } from 'react';
import {
  Box,
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  Avatar,
  Menu,
  MenuItem,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  Menu as MenuIcon,
  School as SchoolIcon,
  Dashboard as DashboardIcon,
  Person as PersonIcon,
  ExitToApp as LogoutIcon,
  ChevronLeft as ChevronLeftIcon,
  Add as AddIcon,
  Assignment as AssignmentIcon,
  Event as EventIcon,
  People as PeopleIcon,
  CalendarToday as CalendarIcon,
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { UserRole } from '@/api/types';

/**
 * Layout Props
 */
interface LayoutProps {
  /** Page content */
  children: ReactNode;
  /** Optional page title for AppBar */
  title?: string;
  /** Show sidebar (default: true) */
  showSidebar?: boolean;
}

/**
 * Sidebar width in pixels
 */
const DRAWER_WIDTH = 260;

/**
 * Main Layout Component
 * 
 * Provides consistent layout across the application with:
 * - Top AppBar with user menu
 * - Collapsible sidebar navigation
 * - Responsive design (mobile drawer)
 * - Role-based navigation items
 * 
 * @param children - Page content
 * @param title - Optional page title
 * @param showSidebar - Show/hide sidebar (default: true)
 * 
 * @example
 * ```tsx
 * <Layout title="Dashboard">
 *   <YourPageContent />
 * </Layout>
 * ```
 */
export function Layout({ children, title, showSidebar = true }: LayoutProps) {
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const { user, role, logout } = useAuth();
  
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileOpen, setMobileOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(!isMobile);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  /**
   * Toggle mobile drawer
   */
  const handleDrawerToggle = () => {
    if (isMobile) {
      setMobileOpen(!mobileOpen);
    } else {
      setSidebarOpen(!sidebarOpen);
    }
  };

  /**
   * Open user menu
   */
  const handleUserMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  /**
   * Close user menu
   */
  const handleUserMenuClose = () => {
    setAnchorEl(null);
  };

  /**
   * Navigate to profile
   */
  const handleProfile = () => {
    navigate('/profile');
    handleUserMenuClose();
  };

  /**
   * Handle logout
   */
  const handleLogout = () => {
    logout();
    navigate('/login');
    handleUserMenuClose();
  };

  /**
   * Navigate to route
   */
  const handleNavigate = (path: string) => {
    navigate(path);
    if (isMobile) {
      setMobileOpen(false);
    }
  };

  /**
   * Get navigation items based on user role
   */
  const getNavigationItems = () => {
    const baseItems = [
      {
        text: 'Dashboard',
        icon: <DashboardIcon />,
        path: `/${role}/dashboard`,
        roles: [UserRole.STUDENT, UserRole.PROFESSOR, UserRole.ADMIN],
      },
    ];

    // Student-specific items
    const studentItems = [
      {
        text: 'Nueva Solicitud',
        icon: <AddIcon />,
        path: '/student/new-request',
        roles: [UserRole.STUDENT],
      },
      {
        text: 'Mis Solicitudes',
        icon: <AssignmentIcon />,
        path: '/student/requests',
        roles: [UserRole.STUDENT],
      },
      {
        text: 'Mis Invitaciones',
        icon: <EventIcon />,
        path: '/student/invitations',
        roles: [UserRole.STUDENT],
      },
      {
        text: 'Mis Sesiones',
        icon: <CalendarIcon />,
        path: '/student/sessions',
        roles: [UserRole.STUDENT],
      },
    ];

    // Professor-specific items
    const professorItems = [
      {
        text: 'Solicitudes Pendientes',
        icon: <AssignmentIcon />,
        path: '/professor/requests',
        roles: [UserRole.PROFESSOR],
      },
      {
        text: 'Crear Sesión',
        icon: <AddIcon />,
        path: '/professor/create-session',
        roles: [UserRole.PROFESSOR],
      },
      {
        text: 'Gestionar Sesiones',
        icon: <EventIcon />,
        path: '/professor/sessions',
        roles: [UserRole.PROFESSOR],
      },
      {
        text: 'Disponibilidad',
        icon: <CalendarIcon />,
        path: '/professor/availability',
        roles: [UserRole.PROFESSOR],
      },
    ];

    // Admin-specific items
    const adminItems = [
      {
        text: 'Usuarios',
        icon: <PeopleIcon />,
        path: '/admin/users',
        roles: [UserRole.ADMIN],
      },
      {
        text: 'Materias',
        icon: <SchoolIcon />,
        path: '/admin/subjects',
        roles: [UserRole.ADMIN],
      },
      {
        text: 'Sedes',
        icon: <EventIcon />,
        path: '/admin/venues',
        roles: [UserRole.ADMIN],
      },
      {
        text: 'Asignaciones',
        icon: <AssignmentIcon />,
        path: '/admin/subject-details',
        roles: [UserRole.ADMIN],
      },
    ];

    const allItems = [...baseItems, ...studentItems, ...professorItems, ...adminItems];
    return allItems.filter((item) => item.roles.includes(role!));
  };

  const navigationItems = getNavigationItems();

  /**
   * Sidebar content
   */
  const drawer = (
    <Box>
      {/* Sidebar Header */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          p: 2,
          minHeight: 64,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <SchoolIcon color="primary" sx={{ fontSize: 32 }} />
          {(!isMobile || sidebarOpen) && (
            <Typography variant="h6" fontWeight="bold" noWrap>
              School Advisories
            </Typography>
          )}
        </Box>
        {!isMobile && (
          <IconButton onClick={handleDrawerToggle} size="small">
            <ChevronLeftIcon />
          </IconButton>
        )}
      </Box>

      <Divider />

      {/* Navigation Items */}
      <List>
        {navigationItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <ListItem key={item.path} disablePadding>
              <ListItemButton
                selected={isActive}
                onClick={() => handleNavigate(item.path)}
                sx={{
                  borderRadius: 1,
                  mx: 1,
                  mb: 0.5,
                }}
              >
                <ListItemIcon
                  sx={{
                    color: isActive ? 'primary.main' : 'inherit',
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={item.text}
                  primaryTypographyProps={{
                    fontWeight: isActive ? 600 : 400,
                  }}
                />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      {/* AppBar */}
      <AppBar
        position="fixed"
        sx={{
          zIndex: theme.zIndex.drawer + 1,
          width: showSidebar && !isMobile && sidebarOpen
            ? `calc(100% - ${DRAWER_WIDTH}px)`
            : '100%',
          ml: showSidebar && !isMobile && sidebarOpen ? `${DRAWER_WIDTH}px` : 0,
          transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
          }),
        }}
      >
        <Toolbar>
          {/* Menu Button */}
          {showSidebar && (
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
          )}

          {/* Page Title */}
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            {title || 'School Advisories System'}
          </Typography>

          {/* User Avatar and Menu */}
          <IconButton onClick={handleUserMenuOpen} sx={{ p: 0 }}>
            <Avatar
              alt={user?.name || user?.email}
              src={user?.photo_url || undefined}
              sx={{ bgcolor: 'secondary.main' }}
            >
              {user?.name?.[0] || user?.email?.[0] || '?'}
            </Avatar>
          </IconButton>

          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleUserMenuClose}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
          >
            <MenuItem onClick={handleProfile}>
              <ListItemIcon>
                <PersonIcon fontSize="small" />
              </ListItemIcon>
              Mi Perfil
            </MenuItem>
            <Divider />
            <MenuItem onClick={handleLogout}>
              <ListItemIcon>
                <LogoutIcon fontSize="small" />
              </ListItemIcon>
              Cerrar Sesión
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>

      {/* Sidebar Drawer */}
      {showSidebar && (
        <>
          {/* Mobile Drawer */}
          <Drawer
            variant="temporary"
            open={mobileOpen}
            onClose={handleDrawerToggle}
            ModalProps={{
              keepMounted: true, // Better mobile performance
            }}
            sx={{
              display: { xs: 'block', md: 'none' },
              '& .MuiDrawer-paper': {
                boxSizing: 'border-box',
                width: DRAWER_WIDTH,
              },
            }}
          >
            {drawer}
          </Drawer>

          {/* Desktop Drawer */}
          <Drawer
            variant="permanent"
            open={sidebarOpen}
            sx={{
              display: { xs: 'none', md: 'block' },
              width: sidebarOpen ? DRAWER_WIDTH : 0,
              flexShrink: 0,
              '& .MuiDrawer-paper': {
                width: DRAWER_WIDTH,
                boxSizing: 'border-box',
                transition: theme.transitions.create('width', {
                  easing: theme.transitions.easing.sharp,
                  duration: theme.transitions.duration.enteringScreen,
                }),
              },
            }}
          >
            {drawer}
          </Drawer>
        </>
      )}

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: '100%',
          minHeight: '100vh',
          bgcolor: 'background.default',
        }}
      >
        {/* Toolbar spacer */}
        <Toolbar />

        {/* Page Content */}
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      </Box>
    </Box>
  );
}

export default Layout;
