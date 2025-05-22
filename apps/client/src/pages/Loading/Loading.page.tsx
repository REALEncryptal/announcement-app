import { Container, Loader, Text, Stack, Image } from '@mantine/core';
import classes from './Loading.module.css';
import Mused3DIcon from '@/assets/MusedIcon3DLeft.png';

type LoadingPageProps = {
  message?: string;
};

/**
 * A reusable loading screen page component
 * Displays a centered loader with the app logo and an optional custom message
 */
export function LoadingPage({ message = 'Loading...' }: LoadingPageProps) {
  return (
    <Container fluid className={classes.loadingContainer} p={0}>
      <Stack align="center" justify="center" gap="md">
        <div className={classes.logoContainer}>
          <Image src={Mused3DIcon} alt="Mused" width={120} height={120} />
        </div>
        
        <Loader size="lg" color="blue" className={classes.spinner} />
        
        <Text className={classes.loadingText}>
          {message}
        </Text>
      </Stack>
    </Container>
  );
}
