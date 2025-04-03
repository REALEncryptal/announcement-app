// Type definitions for the announcement app

/*
  Thank god I dont have to do this manually
*/

/**
 * Tag object for categorizing announcements
 */
export interface Tag {
  type: string;
  color: string;
}

/**
 * Main Announcement data structure
 */
export interface Announcement {
  _id: string;
  title: string;
  content: string;
  tags: Tag[];
  createdAt: Date;
}

/**
 * API response for announcements list
 */
export interface AnnouncementsResponse {
  data: Announcement[];
  totalCount?: number;
}

/**
 * Error response from API
 */
export interface ApiError {
  message: string;
  status?: number;
  errors?: Record<string, string[]>;
}
