import { useState, useEffect } from 'react';
import { useDisclosure, useMediaQuery } from '@mantine/hooks';
import { createAnnouncement, deleteAnnouncement, getAnnouncementById, getAnnouncements, updateAnnouncement } from '../api/api';
import {
  Container,
  Title,
  Group,
  Flex,
  Text,
  Badge,
  Paper,
  Button,
  ActionIcon,
  Modal,
  TextInput,
  Textarea,
  ColorInput
} from '@mantine/core';
import { ColorSchemeToggle } from '../components/ColorSchemeToggle/ColorSchemeToggle';
import { Announcement, Tag } from '../types';

import { notifications } from '@mantine/notifications';

import { IconEdit, IconTrash, IconPlus, IconCalendar } from '@tabler/icons-react';

import classes from './Home.module.css';

export function HomePage() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [editMode, setEditMode] = useState(false);
  const [announcementModal, { open, close }] = useDisclosure();
  const [deleteModal, { open: openDeleteModal, close: closeDeleteModal }] = useDisclosure();
  const [announcementToDelete, setAnnouncementToDelete] = useState<string>('');
  const [isEditing, setIsEditing] = useState(false);
  const [currentAnnouncement, setCurrentAnnouncement] = useState<Partial<Announcement> | null>(null);
  const [newTag, setNewTag] = useState<Partial<Tag>>({ type: '', color: '#1C7ED6' });

  const isMobile = useMediaQuery('(max-width: 50em)');

  // Fetch announcements on component mount
  useEffect(() => {
    getAnnouncements()
      .then((data) => {
        setAnnouncements(data);
      })
      .catch((_error) => {
        notifications.show({
          title: 'Error fetching announcements',
          message: 'The announcements could not be fetched',
          color: 'red',
        });
      });
  }, []);

  // Open modal for editing announcement
  const handleEdit = async (announcementId: string) => {
    try {
      const announcement = await getAnnouncementById(announcementId);
      setCurrentAnnouncement(announcement);
      setIsEditing(true);
      open();
    } catch (error) {
      notifications.show({
        title: 'Error fetching announcement',
        message: 'The announcement could not be fetched',
        color: 'red',
      });
    }
  };

  // Open modal for creating a new announcement
  const handleCreate = () => {
    setCurrentAnnouncement({ title: '', content: '', tags: [] });
    setIsEditing(false);
    open();
  };

  // Show delete confirmation modal
  const showDeleteConfirmation = (announcementId: string) => {
    setAnnouncementToDelete(announcementId);
    openDeleteModal();
  };

  // Handle delete announcement after confirmation
  const handleConfirmedDelete = async () => {
    if (!announcementToDelete) { return; }
    
    try {
      await deleteAnnouncement(announcementToDelete);
      setAnnouncements((prev) => prev.filter((announcement) => announcement._id !== announcementToDelete));
      notifications.show({
        title: 'Announcement deleted',
        message: 'The announcement has been deleted',
        color: 'green',
      });
      closeDeleteModal();
      setAnnouncementToDelete('');
    } catch (error) {
      notifications.show({
        title: 'Error deleting announcement',
        message: 'The announcement could not be deleted',
        color: 'red',
      });
    }
  };

  // Add new tag to current announcement
  const handleAddTag = () => {
    if (!currentAnnouncement || !newTag.type || !newTag.color) { return; }
    
    if (newTag.type.trim() === '') {
      notifications.show({
        title: 'Invalid tag',
        message: 'Tag type cannot be empty',
        color: 'red',
      });
      return;
    }

    // Add the new tag to the current announcement
    const tag = { type: newTag.type, color: newTag.color } as Tag;
    setCurrentAnnouncement({
      ...currentAnnouncement,
      tags: [...(currentAnnouncement.tags || []), tag],
    });

    // Reset the new tag form
    setNewTag({ type: '', color: '#1C7ED6' });
  };

  // Remove tag from current announcement
  const handleRemoveTag = (index: number) => {
    if (!currentAnnouncement || !currentAnnouncement.tags) { return; }
    
    const updatedTags = [...currentAnnouncement.tags];
    updatedTags.splice(index, 1);
    
    setCurrentAnnouncement({
      ...currentAnnouncement,
      tags: updatedTags,
    });
  };

  // Save (create or update) announcement
  const handleSave = async () => {
    if (!currentAnnouncement) { return; }

    // Validate input
    if (!currentAnnouncement.title || !currentAnnouncement.content) {
      notifications.show({
        title: 'Error saving announcement',
        message: 'The announcement title and content are required',
        color: 'red',
      });
      return;
    }

    // Input must be trimmed and not empty
    const title = currentAnnouncement.title.trim();
    const content = currentAnnouncement.content.trim();

    if (!title || !content) {
      notifications.show({
        title: 'Error saving announcement',
        message: 'The announcement title and content cannot be empty',
        color: 'red',
      });
      return;
    }

    // Prepare data with trimmed values
    const data = {
      ...currentAnnouncement,
      title,
      content,
      tags: currentAnnouncement.tags || [],
    };

    try {
      if (isEditing && currentAnnouncement._id) {
        // Update existing announcement
        const updated = await updateAnnouncement(currentAnnouncement._id, data);
        setAnnouncements((prev) => prev.map((a) => a._id === updated._id ? updated : a));
        notifications.show({
          title: 'Announcement updated',
          message: 'The announcement has been updated',
          color: 'green',
        });
      } else {
        // Create new announcement
        const created = await createAnnouncement(data as Omit<Announcement, '_id' | 'createdAt'>);
        setAnnouncements((prev) => [...prev, created]);
        notifications.show({
          title: 'Announcement created',
          message: 'The announcement has been created',
          color: 'green',
        });
      }
      
      // Clean up and close modal
      setCurrentAnnouncement(null);
      close();
    } catch (error) {
      notifications.show({
        title: `Error ${isEditing ? 'updating' : 'creating'} announcement`,
        message: `The announcement could not be ${isEditing ? 'updated' : 'created'}`,
        color: 'red',
      });
    }
  };

  return (
    <>      
      {/* Delete Confirmation Modal */}
      <Modal
        opened={deleteModal}
        onClose={closeDeleteModal}
        title="Confirm Delete"
        centered
        size="sm"
      >
        <Text>Are you sure you want to delete this announcement?</Text>
        <Text size="sm" c="dimmed" mt="xs">This action cannot be undone.</Text>
        
        <Group justify="flex-end" mt="xl">
          <Button variant="default" onClick={closeDeleteModal}>Cancel</Button>
          <Button color="red" onClick={handleConfirmedDelete}>Delete</Button>
        </Group>
      </Modal>
      <Modal.Root
        size="lg"
        opened={announcementModal}
        onClose={() => {
          setCurrentAnnouncement(null);
          close();
        }}
        fullScreen={isMobile}
      >
        <Modal.Overlay />
        <Modal.Content>
          <Modal.Header>
            <Modal.Title>{isEditing ? 'Edit' : 'Create'} Announcement</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <TextInput
              withAsterisk
              label="Title"
              placeholder="Enter announcement title"
              value={currentAnnouncement?.title || ''}
              onChange={(e) => {
                if (currentAnnouncement) {
                  setCurrentAnnouncement({
                    ...currentAnnouncement,
                    title: e.target.value
                  });
                }
              }}
            />

            <Textarea
              withAsterisk
              mt="sm"
              label="Content"
              placeholder="Enter announcement content"
              autosize
              minRows={3}
              maxRows={15}
              value={currentAnnouncement?.content || ''}
              onChange={(e) => {
                if (currentAnnouncement) {
                  setCurrentAnnouncement({
                    ...currentAnnouncement,
                    content: e.target.value
                  });
                }
              }}
            />
            
            {/* Tags section */}
            <Title order={5} mt="md">Tags</Title>
            
            {/* Display current tags */}
            <Flex gap="xs" mt="xs" wrap="wrap">
              {currentAnnouncement?.tags?.map((tag, index) => (
                <Badge 
                  key={`${tag.type}-${index}`} 
                  color={tag.color} 
                  variant="light"
                  rightSection={
                    <ActionIcon 
                      size="xs" 
                      color="red" 
                      variant="transparent"
                      onClick={() => handleRemoveTag(index)}
                    >
                      <IconTrash size={12} />
                    </ActionIcon>
                  }
                >
                  {tag.type}
                </Badge>
              ))}
            </Flex>
            
            {/* Add new tag UI */}
            <Group mt="sm" align="flex-end">
              <TextInput
                label="Tag Type"
                placeholder="Enter tag name"
                value={newTag.type}
                onChange={(e) => setNewTag({...newTag, type: e.target.value})}
                style={{ flex: 1 }}
              />
              
              <ColorInput
                label="Tag Color"
                placeholder="Pick a color"
                format="hex"
                value={newTag.color}
                onChange={(color) => setNewTag({...newTag, color})}
                withPreview
                swatches={['#25262b', '#868e96', '#fa5252', '#e64980', '#be4bdb', '#7950f2', '#4c6ef5', '#228be6', '#15aabf', '#12b886', '#40c057', '#82c91e', '#fab005', '#fd7e14']}
              />
              
              <Button onClick={handleAddTag} disabled={!newTag.type || !newTag.color}>
                Add Tag
              </Button>
            </Group>

            {/* Action buttons */}
            <Group justify="flex-end" mt="xl">
              <Button 
                variant="outline" 
                color="red" 
                onClick={() => {
                  setCurrentAnnouncement(null);
                  close();
                }}
              >
                Cancel
              </Button>
              <Button variant="filled" onClick={handleSave}>
                Save
              </Button>
            </Group>
          </Modal.Body>
        </Modal.Content>
      </Modal.Root>

      <Container>
        <Group justify="space-between" mb="md" mt="md">
          <Title>Announcements</Title>
          <Group gap="xs">
            <ActionIcon
              variant="default"
              size="xl"
              aria-label="Create"
              onClick={handleCreate}
            >
              <IconPlus stroke={1.5} />
            </ActionIcon>
            <ActionIcon
              variant="default"
              size="xl"
              aria-label="Edit"
              onClick={() => setEditMode(!editMode)}
            >
              <IconEdit stroke={1.5} />
            </ActionIcon>
            <ColorSchemeToggle />
          </Group>
        </Group>

        <Flex
          direction="column"
          gap="md"
          align="stretch"
        >
          {announcements.map((announcement) => (
            <Paper
              key={announcement._id}
              withBorder
              radius="md"
              p="md"
              shadow="md"
              className={classes.paper}
            >
              <Title order={3}>{announcement.title}</Title>
              <Group gap="xs" mb="xs">
                <IconCalendar size={14} stroke={1.5} />
                <Text size="sm" c="dimmed">
                  Posted {new Date(announcement.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </Text>
              </Group>
              <Text>{announcement.content}</Text>
              <Flex gap="xs" mt="xs">
                {announcement.tags.map((tag) => (
                  <Badge key={tag.type} color={tag.color} variant="light" size="xs">
                    {tag.type}
                  </Badge>
                ))}
              </Flex>
              {editMode && (
                <Flex gap="xs" mt="md" justify="flex-start">
                  <ActionIcon
                    variant="default"
                    size="lg"
                    aria-label="Edit"
                    onClick={() => handleEdit(announcement._id)}
                  >
                    <IconEdit stroke={1.5} />
                  </ActionIcon>
                  <ActionIcon
                    variant="default"
                    size="lg"
                    aria-label="Delete"
                    onClick={() => showDeleteConfirmation(announcement._id)}
                  >
                    <IconTrash stroke={1.5} color="var(--mantine-color-red-5)"/>
                  </ActionIcon>
                </Flex>
              )}
            </Paper>
          ))}
        </Flex>
      </Container>
    </>
  );
}
