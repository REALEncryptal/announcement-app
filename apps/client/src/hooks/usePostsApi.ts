import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { 
  getPosts, 
  getPostById, 
  createPost, 
  updatePost, 
  deletePost, 
  getCurrentUserPosts,
  likePost,
  unlikePost,
  type CreatePostDto, 
  type UpdatePostDto
} from '@/api/post';

// Keys for React Query cache
export const postKeys = {
  all: ['posts'] as const,
  lists: () => [...postKeys.all, 'list'] as const,
  list: (filters: Record<string, any>) => [...postKeys.lists(), filters] as const,
  details: () => [...postKeys.all, 'detail'] as const,
  detail: (id: string) => [...postKeys.details(), id] as const,
  userPosts: () => [...postKeys.all, 'user'] as const,
};

// Get all posts with pagination
export function useGetPosts(page = 1, limit = 10) {
  return useQuery({
    queryKey: postKeys.list({ page, limit }),
    queryFn: () => getPosts(page, limit),
  });
}

// Get a single post by ID
export function useGetPostById(id: string) {
  return useQuery({
    queryKey: postKeys.detail(id),
    queryFn: () => getPostById(id),
    enabled: !!id, // Only run if ID is provided
  });
}

// Get posts by current user
export function useGetCurrentUserPosts(page = 1, limit = 10) {
  return useQuery({
    queryKey: [...postKeys.userPosts(), { page, limit }],
    queryFn: () => getCurrentUserPosts(page, limit),
  });
}

// Create a new post
export function useCreatePost() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (newPost: CreatePostDto) => createPost(newPost),
    onSuccess: () => {
      // Invalidate and refetch posts lists
      queryClient.invalidateQueries({ queryKey: postKeys.lists() });
      queryClient.invalidateQueries({ queryKey: postKeys.userPosts() });
    },
  });
}

// Update an existing post
export function useUpdatePost() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, post }: { id: string; post: UpdatePostDto }) => 
      updatePost(id, post),
    onSuccess: (updatedPost) => {
      // Update cache for this specific post
      queryClient.setQueryData(
        postKeys.detail(updatedPost._id), 
        updatedPost
      );
      
      // Invalidate affected lists
      queryClient.invalidateQueries({ queryKey: postKeys.lists() });
      queryClient.invalidateQueries({ queryKey: postKeys.userPosts() });
    },
  });
}

// Delete a post
export function useDeletePost() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => deletePost(id),
    onSuccess: (_, id) => {
      // Invalidate affected lists
      queryClient.invalidateQueries({ queryKey: postKeys.lists() });
      queryClient.invalidateQueries({ queryKey: postKeys.userPosts() });
      
      // Remove from cache
      queryClient.removeQueries({ queryKey: postKeys.detail(id) });
    },
  });
}

// Like a post
export function useLikePost() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => likePost(id),
    onSuccess: (updatedPost) => {
      // Update the post in cache
      queryClient.setQueryData(
        postKeys.detail(updatedPost._id), 
        updatedPost
      );
      
      // Optionally refresh lists that might display like counts
      queryClient.invalidateQueries({ queryKey: postKeys.lists() });
    },
  });
}

// Unlike a post
export function useUnlikePost() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => unlikePost(id),
    onSuccess: (updatedPost) => {
      // Update the post in cache
      queryClient.setQueryData(
        postKeys.detail(updatedPost._id), 
        updatedPost
      );
      
      // Optionally refresh lists that might display like counts
      queryClient.invalidateQueries({ queryKey: postKeys.lists() });
    },
  });
}
