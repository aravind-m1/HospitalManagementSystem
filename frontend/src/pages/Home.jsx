import React from 'react';
import {
  Container,
  Grid,
  Typography,
  Box,
  Button,
  Card,
  CardContent,
  Stack,
  useTheme,
  useMediaQuery,
  IconButton,
  Fade,
  Link,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import {
  LocalHospital,
  MedicalServices,
  Psychology,
  Favorite,
  AddCircle,
  Science,
  Biotech,
  Phone,
  Email,
  LocationOn,
  Facebook,
  Twitter,
  LinkedIn,
  Instagram,
} from '@mui/icons-material';
const SpecialtyCard = ({ title, description, icon: Icon, delay }) => (
  <Fade in timeout={1000} style={{ transitionDelay: `${delay}ms` }}>
    <Card
      sx={{
        background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
        borderRadius: '20px',
        boxShadow: '0 8px 32px rgba(0, 136, 255, 0.1)',
        transition: 'all 0.3s ease',
        height: '100%',
        '&:hover': {
          transform: 'translateY(-8px)',
          boxShadow: '0 12px 48px rgba(0, 136, 255, 0.2)',
          '& .icon-wrapper': {
            transform: 'scale(1.1)',
            backgroundColor: '#0088ff',
            '& svg': {
              color: '#ffffff',
            },
          },
        },
      }}
    >
      <CardContent sx={{ p: 3, height: '100%' }}>
        <Box
          className="icon-wrapper"
          sx={{
            backgroundColor: 'rgba(0, 136, 255, 0.1)',
            borderRadius: '16px',
            width: 64,
            height: 64,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            mb: 2,
            transition: 'all 0.3s ease',
          }}
        >
          <Icon sx={{ fontSize: 32, color: '#0088ff', transition: 'all 0.3s ease' }} />
        </Box>
        <Typography variant="h6" sx={{ mb: 1, fontWeight: 700, color: '#1a1a1a' }}>
          {title}
        </Typography>
        <Typography variant="body2" sx={{ color: '#666666' }}>
          {description}
        </Typography>
      </CardContent>
    </Card>
  </Fade>
);
const Home = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const specialties = [
    {
      title: 'Emergency Care',
      description: '24/7 emergency medical services with rapid response teams',
      icon: LocalHospital,
    },
    {
      title: 'Cardiology',
      description: 'Advanced cardiac care with state-of-the-art facilities',
      icon: Favorite,
    },
    {
      title: 'Neurology',
      description: 'Expert treatment for neurological disorders',
      icon: Psychology,
    },
    {
      title: 'Laboratory',
      description: 'Cutting-edge diagnostic and testing facilities',
      icon: Science,
    },
    {
      title: 'General Medicine',
      description: 'Comprehensive healthcare for all age groups',
      icon: MedicalServices,
    },
    {
      title: 'Research',
      description: 'Pioneering medical research and clinical trials',
      icon: Biotech,
    },
  ];
  const quickLinks = [
    { text: 'About Us', path: '/about' },
    { text: 'Our Doctors', path: '/doctors' },
    { text: 'Departments', path: '/departments' },
    { text: 'Contact Us', path: '/contact' },
    { text: 'Emergency Care', path: '/emergency' },
  ];
  const socialLinks = [
    { icon: Facebook, label: 'Facebook' },
    { icon: Twitter, label: 'Twitter' },
    { icon: LinkedIn, label: 'LinkedIn' },
    { icon: Instagram, label: 'Instagram' },
  ];
  return (
    <Box sx={{ bgcolor: '#f8f9fa', minHeight: '100vh' }}>
      {}
      <Box
        sx={{
          bgcolor: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(8px)',
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 1100,
          boxShadow: '0 2px 20px rgba(0, 0, 0, 0.05)',
        }}
      >
        <Container maxWidth="lg">
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            py={2}
          >
            <Typography
              variant="h5"
              sx={{
                fontWeight: 800,
                background: 'linear-gradient(45deg, #0088ff, #00ff88)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                color: 'transparent',
                display: 'flex',
                alignItems: 'center',
                gap: 1,
              }}
            >
              <LocalHospital sx={{ color: '#0088ff' }} />
              City General Hospital
            </Typography>
            <Stack direction="row" spacing={2}>
              <Button
                variant="outlined"
                onClick={() => navigate('/login')}
                sx={{
                  borderRadius: '12px',
                  borderColor: '#0088ff',
                  color: '#0088ff',
                  '&:hover': {
                    borderColor: '#0066cc',
                    bgcolor: 'rgba(0, 136, 255, 0.05)',
                  },
                }}
              >
                Login
              </Button>
              <Button
                variant="contained"
                onClick={() => navigate('/register')}
                sx={{
                  borderRadius: '12px',
                  bgcolor: '#0088ff',
                  '&:hover': {
                    bgcolor: '#0066cc',
                  },
                }}
              >
                Register
              </Button>
            </Stack>
          </Stack>
        </Container>
      </Box>
      {}
      <Box
        sx={{
          pt: { xs: 12, md: 16 },
          pb: { xs: 8, md: 12 },
          background: 'linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%)',
          width: '100vw',
          position: 'relative',
          left: '50%',
          right: '50%',
          marginLeft: '-50vw',
          marginRight: '-50vw',
          overflow: 'hidden',
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={6}>
              <Fade in timeout={1000}>
                <Box>
                  <Typography
                    variant="h2"
                    sx={{
                      fontWeight: 800,
                      color: '#1a1a1a',
                      mb: 2,
                      fontSize: { xs: '2.5rem', md: '3.5rem' },
                      lineHeight: 1.2,
                    }}
                  >
                    Your Health,{' '}
                    <Box component="span" sx={{ display: 'block' }}>
                      Our Priority
                    </Box>
                  </Typography>
                  <Typography
                    variant="h6"
                    sx={{
                      color: '#666666',
                      mb: 4,
                      fontWeight: 400,
                      lineHeight: 1.6,
                    }}
                  >
                    Experience world-class healthcare with cutting-edge technology
                    and compassionate care from our expert medical professionals.
                  </Typography>
                  <Button
                    variant="contained"
                    size="large"
                    startIcon={<AddCircle />}
                    onClick={() => navigate('/login')}
                    sx={{
                      borderRadius: '16px',
                      bgcolor: '#0088ff',
                      px: 4,
                      py: 2,
                      fontSize: '1.1rem',
                      boxShadow: '0 8px 32px rgba(0, 136, 255, 0.2)',
                      '&:hover': {
                        bgcolor: '#0066cc',
                        transform: 'translateY(-2px)',
                        boxShadow: '0 12px 48px rgba(0, 136, 255, 0.3)',
                      },
                    }}
                  >
                    Book Appointment
                  </Button>
                </Box>
              </Fade>
            </Grid>
            <Grid item xs={12} md={6}>
              <Fade in timeout={1000} style={{ transitionDelay: '500ms' }}>
                <Box
                  component="img"
                  src="/images/19767.jpg"
                  alt="Image"
                  sx={{
                    width: '100%',
                    height: 'auto',
                    filter: 'drop-shadow(0 20px 40px rgba(0,0,0,0.1))',
                  }}
                />
              </Fade>
            </Grid>
          </Grid>
        </Container>
      </Box>
      {}
      <Box
        sx={{
          width: '100vw',
          position: 'relative',
          left: '50%',
          right: '50%',
          marginLeft: '-50vw',
          marginRight: '-50vw',
          py: { xs: 8, md: 12 },
          bgcolor: '#ffffff',
          overflow: 'hidden',
        }}
      >
        <Container maxWidth="lg">
          <Typography
            variant="h3"
            align="center"
            sx={{
              fontWeight: 800,
              color: '#1a1a1a',
              mb: 2,
            }}
          >
            Our Specialties
          </Typography>
          <Typography
            variant="h6"
            align="center"
            sx={{
              color: '#666666',
              mb: 8,
              maxWidth: '800px',
              mx: 'auto',
            }}
          >
            Discover our comprehensive range of medical services designed to meet all your healthcare needs
          </Typography>
          <Grid container spacing={4}>
            {specialties.map((specialty, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <SpecialtyCard {...specialty} delay={index * 100} />
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>
      {}
      <Box
        sx={{
          width: '100vw',
          position: 'relative',
          left: '50%',
          right: '50%',
          marginLeft: '-50vw',
          marginRight: '-50vw',
          bgcolor: '#1a1a1a',
          color: '#ffffff',
          pt: { xs: 6, md: 8 },
          pb: { xs: 4, md: 6 },
          overflow: 'hidden',
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={4}>
            {}
            <Grid item xs={12} md={4}>
              <Stack spacing={3}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <LocalHospital sx={{ color: '#0088ff', fontSize: 32 }} />
                  <Typography variant="h6" sx={{ fontWeight: 700 }}>
                    City General Hospital
                  </Typography>
                </Box>
                <Typography variant="body2" sx={{ color: '#999999' }}>
                  Providing world-class healthcare services with compassion and excellence since 1990.
                </Typography>
                <Stack spacing={2}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Phone sx={{ color: '#0088ff' }} />
                    <Typography variant="body2">+1 (555) 123-4567</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Email sx={{ color: '#0088ff' }} />
                    <Typography variant="body2">info@citygeneralhospital.com</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <LocationOn sx={{ color: '#0088ff' }} />
                    <Typography variant="body2">123 Healthcare Ave, Medical District</Typography>
                  </Box>
                </Stack>
              </Stack>
            </Grid>
            {}
            <Grid item xs={12} sm={6} md={4}>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 3 }}>
                Quick Links
              </Typography>
              <Stack spacing={2}>
                {quickLinks.map((link) => (
                  <Link
                    key={link.text}
                    component="button"
                    onClick={() => navigate(link.path)}
                    sx={{
                      color: '#999999',
                      textDecoration: 'none',
                      '&:hover': {
                        color: '#ffffff',
                      },
                      textAlign: 'left',
                    }}
                  >
                    {link.text}
                  </Link>
                ))}
              </Stack>
            </Grid>
            {}
            <Grid item xs={12} sm={6} md={4}>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 3 }}>
                Connect With Us
              </Typography>
              <Stack spacing={3}>
                <Typography variant="body2" sx={{ color: '#999999' }}>
                  Follow us on social media for updates, health tips, and news.
                </Typography>
                <Stack direction="row" spacing={2}>
                  {socialLinks.map(({ icon: Icon, label }) => (
                    <IconButton
                      key={label}
                      aria-label={label}
                      sx={{
                        color: '#999999',
                        '&:hover': {
                          color: '#ffffff',
                          bgcolor: 'rgba(255, 255, 255, 0.1)',
                        },
                      }}
                    >
                      <Icon />
                    </IconButton>
                  ))}
                </Stack>
              </Stack>
            </Grid>
          </Grid>
          {}
          <Box
            sx={{
              borderTop: '1px solid rgba(255, 255, 255, 0.1)',
              mt: 6,
              pt: 3,
              textAlign: 'center',
            }}
          >
          </Box>
        </Container>
      </Box>
    </Box>
  );
};
export default Home;
