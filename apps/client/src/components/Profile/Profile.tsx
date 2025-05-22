import { useState } from 'react';
import {
    Avatar,
    Menu,
    UnstyledButton,
    Group,
    Text,
    useMantineTheme
} from '@mantine/core';
import {
    IconChevronDown,
    IconHeart,
    IconLogout,
    IconNotebook,
    IconSettings,
} from '@tabler/icons-react';

import { useAuth } from '@/context/AuthContext';
import { logout } from '@/api/auth';

import cx from 'clsx';
import classes from './Profile.module.css';

export function Profile() {
    const theme = useMantineTheme();
    const { user } = useAuth();
    const [userMenuOpened, setUserMenuOpened] = useState(false);

    return (
        <>
            <Menu
                width={260}
                position="bottom-end"
                transitionProps={{ transition: 'pop-top-right' }}
                onClose={() => setUserMenuOpened(false)}
                onOpen={() => setUserMenuOpened(true)}
                withinPortal
            >
                <Menu.Target>
                    <UnstyledButton
                        className={cx(classes.user, { [classes.userActive]: userMenuOpened })}
                    >
                        <Group gap={7}>
                            <Avatar src={user?.avatar} alt={user?.username} radius="xl" size={20} />
                            <Text fw={500} size="sm" lh={1} mr={3}>
                                {user?.username}
                            </Text>
                            <IconChevronDown size={12} stroke={1.5} />
                        </Group>
                    </UnstyledButton>
                </Menu.Target>
                <Menu.Dropdown>
                    <Menu.Item
                        leftSection={<IconNotebook size={16} color={theme.colors.yellow[6]} stroke={1.5} />}
                    >
                        Your posts
                    </Menu.Item>
                    <Menu.Item
                        leftSection={<IconHeart size={16} color={theme.colors.red[6]} stroke={1.5} />}
                    >
                        Liked posts
                    </Menu.Item>

                    <Menu.Label>Settings</Menu.Label>
                    <Menu.Item leftSection={<IconSettings size={16} stroke={1.5} />}>
                        Account settings
                    </Menu.Item>
                    <Menu.Item onClick={logout} leftSection={<IconLogout size={16} stroke={1.5} />}>Logout</Menu.Item>

                </Menu.Dropdown>
            </Menu>
        </>
    );
}