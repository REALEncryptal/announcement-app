import { Button, Container, Text, Box, Loader, Group, Title, Paper, Center } from '@mantine/core';
import { useAuth } from '../context/AuthContext';
import { login, logout } from '../api/auth';

export function ProfilePage() {
  const { user, isLoading, isAuthenticated } = useAuth();

  const handleLogin = () => {
    login();
  };

  const handleLogout = () => {
    logout();
  };

  if (isLoading) {
    return (
      <Container size="md" py="xl">
        <Center style={{ minHeight: '70vh' }}>
          <Loader size="xl" />
        </Center>
      </Container>
    );
  }

  // Not authenticated state
  if (!isAuthenticated) {
    return (
      <Container size="md" py="xl">
        <Paper p="xl" shadow="md" radius="md" withBorder>
          <Title order={2} mb="lg" ta="center">Authentication Demo</Title>
          <Text ta="center" mb="xl">Please login to continue</Text>
          
          <Center>
            <Button size="lg" onClick={handleLogin}>Login with Auth0</Button>
          </Center>
        </Paper>
      </Container>
    );
  }

  // Authenticated state with profile information
  return (
    <Container size="md" py="xl">
      <Paper p="xl" shadow="md" radius="md" withBorder mb="lg">
        <Title order={2} mb="lg">Your Profile</Title>
        
        <Box style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '20px' }}>
          {user?.avatar && user.avatar ? (
            <img 
              src={user.avatar} 
              alt="Profile" 
              style={{ width: '100px', height: '100px', borderRadius: '50%', marginBottom: '16px' }}
            />
          ) : (
            <Box 
              style={{ 
                width: '100px', 
                height: '100px', 
                borderRadius: '50%', 
                backgroundColor: '#e9ecef', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                marginBottom: '16px'
              }}
            >
              <Text size="xl">👤</Text>
            </Box>
          )}
          
          <Text size="xl" fw={700}>{user?.displayName || 'N/A'}</Text>
          <Text size="md" c="dimmed">@{user?.username || 'N/A'}</Text>
        </Box>
        
        <Box p="md" style={{ backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
          <Text fw={600} mb="xs">Account Information:</Text>
          <Text mb="xs">Username: {user?.username || 'N/A'}</Text>
          <Text mb="xs">Display Name: {user?.displayName || 'N/A'}</Text>
          <Text mb="xs">Email: {user?.email || 'N/A'}</Text>
          <Text mb="xs">Provider: {user?.provider || 'N/A'}</Text>
          <Text mb="xs">User ID: {user?._id || user?.providerId || 'N/A'}</Text>
        </Box>
      </Paper>
      
      <Group justify="center">
        <Button 
          variant="outline"
          onClick={handleLogout}
          color="red"
          size="md"
        >
          Logout
        </Button>
      </Group>
    </Container>
  );
}
