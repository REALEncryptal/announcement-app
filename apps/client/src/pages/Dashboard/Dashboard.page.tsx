import { UserHeader } from '@/components/UserHeader/UserHeader';
import { Container, Title, Text, Loader, Button, Group, Stack, Pagination } from '@mantine/core';
import { useGetCurrentUserPosts } from '@/hooks/usePostsApi';
import { useState, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';

import classes from './Dashboard.module.css';
import { IconWriting } from '@tabler/icons-react';

type StatusDisplayProps = {
    isLoading: boolean;
    isError: boolean;
    isEmpty: boolean;
    error: unknown;
    refetch: () => void;
    children: ReactNode;
    navigate: (path: string) => void;
};

const StatusDisplay = ({ isLoading, isError, isEmpty, error, refetch, children, navigate }: StatusDisplayProps) => {
    if (isLoading) {
        return (
            <Stack align="center" py="xl">
                <Loader size="md" />
                <Text size="sm" c="dimmed">Loading your posts...</Text>
            </Stack>
        );
    }

    if (isError) {
        return (
            <Stack align="center" py="xl">
                <Text c="red">{(error as Error)?.message || 'An error occurred while fetching your posts'}</Text>
                <Button variant="outline" color="red" size="sm" onClick={() => refetch()}>Try Again</Button>
            </Stack>
        );
    }

    if (isEmpty) {
        return (
            <Stack align="center" py="xl" className={classes.emptyState}>
                <Text size="lg">You haven't written any posts yet :(</Text>
                <Button onClick={() => navigate('/create')} variant="filled" mt="md">Share your first post</Button>
            </Stack>
        );
    }

    return <>{children}</>;
};

export function DashboardPage() {
    const navigate = useNavigate();
    const [page, setPage] = useState(1);
    const { data, isLoading, isError, error, refetch } = useGetCurrentUserPosts(page, 10);
    const POSTS_PER_PAGE = 10;

    const handlePageChange = (newPage: number) => {
        setPage(newPage);
    };

    const isEmpty = data?.posts?.length === 0;
    const totalPages = Math.ceil((data?.total ?? 0) / POSTS_PER_PAGE);
    const showPagination = (data?.total ?? 0) > POSTS_PER_PAGE;

    return (
        <>
            <UserHeader>
                <Button onClick={() => navigate('/create')} color="var(--mantine-color-neutral-6)" leftSection={<IconWriting color="var(--mantine-color-neutral-6)" />} variant="transparent">
                    Write
                </Button>
            </UserHeader>

            <Container size="lg" py="xl" mt="xl">
                <Title order={3} ff="Roboto, sans-serif">Your posts</Title>

                <StatusDisplay
                    isLoading={isLoading}
                    isError={isError}
                    isEmpty={isEmpty}
                    error={error}
                    refetch={refetch}
                    navigate={navigate}
                >
                    <div className={classes.postsGrid}>
                        {data?.posts.map(post => (
                            <div key={post._id} className={classes.postCard}>
                                <Text fw={700}>{post.title}</Text>
                                <Text lineClamp={2}>{post.summary || post.content}</Text>
                            </div>
                        ))}
                    </div>

                    {showPagination && (
                        <Group justify="center" mt="xl">
                            <Pagination
                                total={totalPages}
                                value={page}
                                onChange={handlePageChange}
                            />
                        </Group>
                    )}
                </StatusDisplay>
            </Container>
        </>
    );
}
