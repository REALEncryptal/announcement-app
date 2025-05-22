import { Container, Group, Title } from '@mantine/core';
import classes from './UserHeader.module.css';

import { Profile } from '@/components/Profile/Profile'

export function UserHeader({ children }: { children?: React.ReactNode }) {
    return (
        <header className={classes.header}>
            <Container size="lg" className={classes.inner}>
                <Title order={2} fw={800}>MUSED</Title>

                <Group gap={5} visibleFrom="xs">
                    {children}
                    <Profile />
                </Group>
            </Container>
        </header>
    );
}