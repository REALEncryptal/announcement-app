import { User } from '@/types';

// API base URL
const API_URL = 'http://localhost:3000';

// Post type definitions (should eventually be moved to types/index.ts)
export interface Post {
  _id: string;
  title: string;
  content: string;
  author: User | string;
  tags?: string[];
  likes?: number;
  views?: number;
  createdAt: string;
  updatedAt: string;
  published: boolean;
  coverImage?: string;
  summary?: string;
}

export interface CreatePostDto {
  title: string;
  content: string;
  tags?: string[];
  published?: boolean;
  coverImage?: string;
  summary?: string;
}

export interface UpdatePostDto {
  title?: string;
  content?: string;
  tags?: string[];
  published?: boolean;
  coverImage?: string;
  summary?: string;
}

export interface PostsResponse {
  posts: Post[];
  total: number;
  page: number;
  limit: number;
}

// Error handling helper
const handleApiError = (error: any, customMessage: string) => {
  // Instead of console.error, we'll create a structured error object that includes our custom message
  const enhancedError = new Error(
    `${customMessage} ${error?.message || 'Unknown error'}`
  );
  // Preserve the original error properties if needed
  (enhancedError as any).originalError = error;
  
  throw enhancedError;
};

/**
 * Get all posts with pagination
 */
export const getPosts = async (page = 1, limit = 10): Promise<PostsResponse> => {
  try {
    const response = await fetch(`${API_URL}/api/posts?page=${page}&limit=${limit}`, {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch posts');
    }

    return await response.json();
  } catch (error) {
    return handleApiError(error, 'Error fetching posts:');
  }
};

/**
 * Get a single post by ID
 */
export const getPostById = async (id: string): Promise<Post> => {
  try {
    const response = await fetch(`${API_URL}/api/posts/${id}`, {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch post');
    }

    return await response.json();
  } catch (error) {
    return handleApiError(error, `Error fetching post ${id}:`);
  }
};

/**
 * Create a new post
 */
export const createPost = async (postData: CreatePostDto): Promise<Post> => {
  try {
    const response = await fetch(`${API_URL}/api/posts`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(postData),
    });

    if (!response.ok) {
      throw new Error('Failed to create post');
    }

    return await response.json();
  } catch (error) {
    return handleApiError(error, 'Error creating post:');
  }
};

/**
 * Update an existing post
 */
export const updatePost = async (id: string, postData: UpdatePostDto): Promise<Post> => {
  try {
    const response = await fetch(`${API_URL}/api/posts/${id}`, {
      method: 'PATCH',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(postData),
    });

    if (!response.ok) {
      throw new Error('Failed to update post');
    }

    return await response.json();
  } catch (error) {
    return handleApiError(error, `Error updating post ${id}:`);
  }
};

/**
 * Delete a post
 */
export const deletePost = async (id: string): Promise<void> => {
  try {
    const response = await fetch(`${API_URL}/api/posts/${id}`, {
      method: 'DELETE',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to delete post');
    }
  } catch (error) {
    return handleApiError(error, `Error deleting post ${id}:`);
  }
};

/**
 * Get posts by the current user - if user is not authenticated, returns an empty list
 */
export const getCurrentUserPosts = async (page = 1, limit = 10): Promise<PostsResponse> => {
  try {
    // First, get the current user's ID from the auth profile
    const userResponse = await fetch(`${API_URL}/auth/profile`, {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // If not authenticated, return empty posts array with pagination info
    if (!userResponse.ok) {
      // Return empty posts array with pagination info for unauthenticated users
      return {
        posts: [],
        total: 0,
        page,
        limit
      };
    }

    const userData = await userResponse.json();
    const userId = userData._id;

    if (!userId) {
      // If user is authenticated but has no ID, return empty array
      return {
        posts: [],
        total: 0,
        page,
        limit
      };
    }

    // Then use the user ID to fetch their posts
    const response = await fetch(`${API_URL}/api/posts/user/${userId}?page=${page}&limit=${limit}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch user posts');
    }

    return await response.json();
  } catch (error) {
    return handleApiError(error, 'Error fetching user posts:');
  }
};

/**
 * Like a post
 */
export const likePost = async (id: string): Promise<Post> => {
  try {
    const response = await fetch(`${API_URL}/api/posts/${id}/like`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to like post');
    }

    return await response.json();
  } catch (error) {
    return handleApiError(error, `Error liking post ${id}:`);
  }
};

/**
 * Unlike a post
 */
export const unlikePost = async (id: string): Promise<Post> => {
  try {
    const response = await fetch(`${API_URL}/api/posts/${id}/unlike`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to unlike post');
    }

    return await response.json();
  } catch (error) {
    return handleApiError(error, `Error unliking post ${id}:`);
  }
};
