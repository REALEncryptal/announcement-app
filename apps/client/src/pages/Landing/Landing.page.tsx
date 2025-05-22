import {Container, Text, Title, Flex, Button, Image} from '@mantine/core';
import { Header } from '@/components/Header/Header';
import { Footer } from '@/components/Footer/Footer';

import Mused3DIcon from '@/assets/MusedIcon3DLeft.png';

import { login } from '@/api/auth';

import classes from './Landing.module.css';

import { useAuth } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';

export function LandingPage() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  if (isAuthenticated) {
    navigate('/dashboard');
  }
  return (
    <div className={classes.root}>
      <Header />
      <Container size="lg" className={classes.mainContainer}>
        <div className={classes.contentWrapper}>
          <Flex direction="column" gap="xl" justify="center" className={classes.content}>
            <Title mb="40px" order={1} className={classes.title}>For minds that question</Title>
            <Text mb="md" fw={1000} size="xl">Join a community of thinkers, learners, and creators.</Text>

            <Button w="200px" variant="filled" size="lg" onClick={login}>Get Started</Button>
          </Flex>
          
          <div className={classes.imageContainer}>
            <Image src={Mused3DIcon} alt="Mused 3D Icon" className={classes.mused3DIcon} />
          </div>
        </div>
      </Container>
      <Footer />
    </div>
  );
}
