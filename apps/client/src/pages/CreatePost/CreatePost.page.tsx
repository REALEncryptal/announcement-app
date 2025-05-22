import { UserHeader } from '@/components/UserHeader/UserHeader';
import { Container, Title, Button, Stack, Paper, Flex, Box, Group, Modal, Image, Text } from '@mantine/core';
import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import { BlockNoteView } from "@blocknote/mantine";
import { useCreateBlockNote, GridSuggestionMenuController } from "@blocknote/react";
import { Block, PartialBlock } from "@blocknote/core";
import { codeBlock } from "@blocknote/code-block";
import { IconArrowLeft } from '@tabler/icons-react';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { ConfirmModal } from '@/modals/Confirm';
import { useDisclosure } from '@mantine/hooks';
import { useAuth } from '@/context/AuthContext';

import { TagSelector } from '@/components/TagSelector/TagSelector';

import classes from './CreatePost.module.css';

interface PostFormValues {
    title: string;
    content: string;
}

async function saveToStorage(jsonBlocks: Block[]) {
    // Save contents to local storage. You might want to debounce this or replace
    // with a call to your API / database.
    localStorage.setItem("editorContent", JSON.stringify(jsonBlocks));
}

async function loadFromStorage() {
    // Gets the previously stored editor contents.
    const storageString = localStorage.getItem("editorContent");
    return storageString
        ? (JSON.parse(storageString) as PartialBlock[])
        : undefined;
}

export function CreatePostPage() {
    const navigate = useNavigate();
    const [opened, { open, close }] = useDisclosure(false);
    const [title, setTitle] = useState('');
    const { user } = useAuth();
    const [tags, setTags] = useState<string[]>([]);

    // Define function to get default content for the editor
    const getDefaultContent = (): PartialBlock[] => [
        // Start with a heading
        {
            type: "heading" as const,
            props: {
                level: 2
            },
            content: [
                {
                    type: "text" as const,
                    text: 'Enter your post title',
                    styles: {},
                },
            ],
        },
        // Create 1 empty paragraph
        ...Array(1).fill(null).map(() => ({
            type: "paragraph" as const,
            content: [],
            props: {}
        }))
    ];

    const [initialContent, setInitialContent] = useState<
        PartialBlock[] | undefined | "loading"
    >("loading");

    // Create the editor with default content initially
    const editor = useCreateBlockNote({
        codeBlock,
        initialContent: getDefaultContent()
    });

    // Loads the previously stored editor contents and updates the editor
    useEffect(() => {
        loadFromStorage().then((content) => {
            if (content) {
                // Update the editor with the loaded content
                editor.replaceBlocks(editor.document, content);
            }
            // Mark loading as complete
            setInitialContent(content || undefined);
        });
    }, []);

    // Update editor when initialContent changes
    useEffect(() => {
        if (initialContent !== "loading") {
            editor.replaceBlocks(editor.document, initialContent || getDefaultContent());
        }
    }, [initialContent]);

    const form = useForm<PostFormValues>({
        initialValues: {
            title,
            content: ''
        },
        validate: {
            title: (value: string) => (value.trim().length < 15 ? 'Title must be at least 15 characters' : null),
            content: (value): string | null => {
                try {
                    // Parse the blocks from JSON string
                    const blocks = JSON.parse(value);

                    // Function to recursively extract text from blocks and their content
                    const extractText = (item: any): string => {
                        // If it's a text item with a 'text' property
                        if (item && typeof item === 'object' && 'text' in item) {
                            return item.text || '';
                        }

                        // If it's an array (like block.content), process each item
                        if (Array.isArray(item)) {
                            return item.map(extractText).join('');
                        }

                        // If it has a content property that's an array
                        if (item && typeof item === 'object' && Array.isArray(item.content)) {
                            return extractText(item.content);
                        }

                        return '';
                    };

                    // Extract all text from all blocks
                    const allText = blocks.map(extractText).join('');

                    // Count characters in the full content
                    const charCount = allText.trim().length;

                    // Define interface for block structure based on BlockNote's types
                    interface BlockWithContent {
                        type: string;
                        content: any[];
                        props?: Record<string, any>;
                    }

                    // Define interface for our block length tracking
                    interface BlockLengthInfo {
                        index: number;
                        type: string;
                        length: number;
                        text: string;
                    }

                    // Get character counts for individual blocks
                    const blockLengths = blocks.map((block: BlockWithContent, index: number): BlockLengthInfo => {
                        const blockText = extractText(block);

                        return {
                            index,
                            type: block.type || 'unknown',
                            length: blockText.trim().length,
                            text: blockText.trim().substring(0, 20) + (blockText.trim().length > 20 ? '...' : '')
                        };
                    });

                    // Trim empty blocks from end
                    while (blockLengths[blockLengths.length - 1].length === 0) {
                        blockLengths.pop();
                    }

                    // Compare with minimum required length
                    const minLength = 40;

                    if (charCount < minLength) {
                        return `Content must be at least ${minLength} characters (currently ${charCount})`;
                    }

                    return null;
                } catch (error) {
                    // Safely handle parsing errors without console statements
                    return 'Invalid content format - please ensure content is properly structured';
                }
            },
        },
        validateInputOnChange: true, // Validate all fields on change for responsive UX
        validateInputOnBlur: true,   // Validate all fields on blur
    });

    const handleSubmit = (_values: PostFormValues, _event?: React.FormEvent) => {
        open();
        /*notifications.show({
            title: 'Post created',
            message: 'Your post has been successfully created',
            color: 'green',
        });
        form.reset();
        localStorage.removeItem("editorContent");
        editor.replaceBlocks(editor.document, getDefaultContent());
        setInitialContent(undefined);*/
    };

    const handleError = (errors: typeof form.errors) => {
        if (errors.title) {
            notifications.show({ message: errors.title, color: 'red' });
        } else if (errors.content) {
            notifications.show({ message: errors.content, color: 'red' });
        }
    };

    const resetForm = () => {
        notifications.show({
            title: 'Post reset',
            message: 'Your post has been reset',
            color: 'blue',
        });
        form.reset();
        localStorage.removeItem("editorContent");
        editor.replaceBlocks(editor.document, getDefaultContent());
        setInitialContent(undefined);
    };

    return (
        <>
            <Modal.Root opened={opened} onClose={close} size="xl" centered>
                <Modal.Overlay />
                <Modal.Content>
                    <Modal.Header>
                        <Modal.Title>
                            <Title ff="Roboto, sans-serif" order={3} fw={800}>{title}</Title>
                        </Modal.Title>
                        <Modal.CloseButton />
                    </Modal.Header>
                    <Modal.Body>
                        <Group gap="md" justify="space-between" grow h="100%" align="stretch">
                            <Image src="https://placehold.co/400"/>
                            <Stack justify="space-between" align="stretch">
                                <Group gap="sm">
                                    <Title ff="Roboto, sans-serif" order={4} fw={300}>Publishing to: <span style={{ fontWeight: 800 }}>{user?.username}</span></Title>
                                    <hr style={{ width: '100%', height: '1px', backgroundColor: 'gray', margin: '0', padding: '0' }} />
                                    <Text>Add or remove tags to your post</Text>
                                    <TagSelector value={tags} setValue={setTags} />
                                </Group>
                                <Group gap="md" justify="flex-end">
                                    <Button variant="outline" onClick={resetForm}>Cancel</Button>
                                    <Button variant="filled" onClick={close}>Publish</Button>
                                </Group>
                            </Stack>
                        </Group>
                    </Modal.Body>
                </Modal.Content>
            </Modal.Root>

            <UserHeader />
            <Container size="lg" py="xl">
                <form onSubmit={form.onSubmit(handleSubmit, handleError)}>
                    <Paper shadow="xs" p="md" mb="md" withBorder>
                        <Box pos="relative">
                            <Flex justify="space-between" align="center">
                                <Button variant="transparent" onClick={() => navigate('/dashboard')} leftSection={<IconArrowLeft />}>
                                    <span className={classes.backspan}>Back to Dashboard</span>
                                </Button>
                                <Box w={0} />

                                <Group gap="md">
                                    <Button variant="outline" onClick={ConfirmModal({ title: 'Clear Post', message: 'Are you sure you want to clear this post?', onConfirm: resetForm })}>Clear Post</Button>
                                    <Button type="submit">Create Post</Button>
                                </Group>
                            </Flex>
                            <Box pos="absolute" top={0} left={0} right={0} h="100%" style={{ display: "flex", justifyContent: "center", alignItems: "center", pointerEvents: "none" }}>
                                <Title ff="Roboto, sans-serif" order={3} fw={800} className={classes.title} style={{ pointerEvents: "auto" }}>Create a new post</Title>
                            </Box>
                        </Box>
                    </Paper>
                    <Stack gap="md">
                        <BlockNoteView
                            editor={editor}
                            theme="light"
                            emojiPicker={false}
                            onChange={() => {
                                // Save content to storage
                                saveToStorage(editor.document);

                                // Update form values with editor content
                                // Find the first heading or paragraph block that contains text to use as the title
                                let title = '';

                                // Loop through all blocks to find the first heading or paragraph with content
                                for (const block of editor.document) {
                                    if ((block.type === 'heading' || block.type === 'paragraph') && block.content.length > 0) {
                                        // Extract text from the block's content
                                        title = block.content
                                            .map(item => {
                                                // Check if this is a StyledText with a text property
                                                if ('text' in item) {
                                                    return item.text;
                                                }
                                                return '';
                                            })
                                            .join('');

                                        // If we found text, stop looking
                                        if (title.trim()) {
                                            break;
                                        }
                                    }
                                }

                                // Remove the title block from the content array before serializing
                                const contentBlocks = [...editor.document];
                                // Find the index of the first heading or paragraph with text (the title block)
                                const titleBlockIndex = contentBlocks.findIndex(block =>
                                    (block.type === 'heading' || block.type === 'paragraph') &&
                                    block.content.length > 0 &&
                                    block.content.some(item => 'text' in item && item.text.trim() !== '')
                                );
                                if (titleBlockIndex !== -1) {
                                    contentBlocks.splice(titleBlockIndex, 1);
                                }
                                const content = JSON.stringify(contentBlocks);

                                // Update form values with property shorthand
                                setTitle(title);
                                form.setValues({ title, content });
                            }}>
                            <GridSuggestionMenuController
                                triggerCharacter=":"
                                // Changes the Emoji Picker to only have 5 columns.
                                columns={5}
                                minQueryLength={2}
                            />
                        </BlockNoteView>
                    </Stack>
                </form>
            </Container>
        </>
    );
}
