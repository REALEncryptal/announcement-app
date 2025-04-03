import { Announcement } from '../types';

const API_URL = "http://localhost:3000/api";

export const getAnnouncements = async (): Promise<Announcement[]> => {
  const response = await fetch(`${API_URL}/announcements`);
  return response.json();
};

export const createAnnouncement = async (announcement: Omit<Announcement, '_id' | 'createdAt'>): Promise<Announcement> => {
  const response = await fetch(`${API_URL}/announcements`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(announcement),
  });
  return response.json();
};

export const updateAnnouncement = async (id: string, announcement: Partial<Omit<Announcement, '_id' | 'createdAt'>>): Promise<Announcement> => {
  const response = await fetch(`${API_URL}/announcements/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(announcement),
  });
  return response.json();
};

export const deleteAnnouncement = async (id: string): Promise<{ success: boolean }> => {
  const response = await fetch(`${API_URL}/announcements/${id}`, {
    method: 'DELETE',
  });
  return response.json();
};
  
export const getAnnouncementById = async (id: string): Promise<Announcement> => {
  const response = await fetch(`${API_URL}/announcements/${id}`);
  return response.json();
};
  
