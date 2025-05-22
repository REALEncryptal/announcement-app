import { Container, Group, Title, Button } from '@mantine/core';
import classes from './Header.module.css';

import { login } from '@/api/auth';
import { useAuth } from '@/context/AuthContext';

import { Profile } from '@/components/Profile/Profile'

export function Header() {
    const { isAuthenticated } = useAuth();
    return (
        <header className={classes.header}>
            <Container size="lg" className={classes.inner}>
                <Title order={2} fw={800}>MUSED</Title>

                <Group gap={5} visibleFrom="xs">
                    <a
                        href="/"
                        className={classes.link}
                    >
                        Explore
                    </a>

                    {isAuthenticated ? (
                        <Profile />
                    ) : (
                        <Button
                            variant="filled"
                            size="md"
                            radius="md"
                            onClick={login}
                        >
                            Get Started
                        </Button>
                    )}
                </Group>
            </Container>
        </header>
    );
}