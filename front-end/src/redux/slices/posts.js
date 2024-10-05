import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../../axios';

export const fetchPosts = createAsyncThunk('/posts/fetchPosts', async () => {
  const { data } = await axios.get('/posts');
  return data;
});

export const fetchPopularPosts = createAsyncThunk('/posts/fetchPopularPosts', async () => {
  const { data } = await axios.get('/posts/popular');
  return data;
});

export const fetchPostsByTag = createAsyncThunk('/posts/fetchPostsByTag', async (tag) => {
  const { data } = await axios.get(`/posts/tags/${tag}`);
  return data;
});


export const fetchTags = createAsyncThunk('/posts/fetchTags', async () => {
  const { data } = await axios.get('/tags');
  return data;
});


export const fetchRemovePost = createAsyncThunk('posts/fetchRemovePost', async (id) => {
  const { data } = await axios.delete(`/posts/${id}`);
  return data;
});

const initialState = {
  posts: {
    items: [],
    status: 'Loading',
  },
  tags: {
    items: [],
    status: 'Loading'
  }
};

const postSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPosts.pending, (state) => {
        state.posts.status = 'Loading';
      })
      .addCase(fetchPosts.fulfilled, (state, action) => {
        state.posts.items = action.payload;
        state.posts.status = 'Loaded';
      })
      .addCase(fetchPosts.rejected, (state) => {
        state.posts.items = [];
        state.posts.status = 'Error';
      })
      .addCase(fetchPopularPosts.pending, (state) => {
        state.posts.status = 'Loading';
      })
      .addCase(fetchPopularPosts.fulfilled, (state, action) => {
        state.posts.items = action.payload;
        state.posts.status = 'Loaded';
      })
      .addCase(fetchPopularPosts.rejected, (state) => {
        state.posts.items = [];
        state.posts.status = 'Error';
      })
      .addCase(fetchPostsByTag.pending, (state) => {
        state.posts.status = 'Loading';
      })
      .addCase(fetchPostsByTag.fulfilled, (state, action) => {
        state.posts.items = action.payload;
        state.posts.status = 'Loaded';
      })
      .addCase(fetchPostsByTag.rejected, (state) => {
        state.posts.items = [];
        state.posts.status = 'Error';
      })
      .addCase(fetchTags.pending, (state) => {
        state.tags.status = 'Loading';
      })
      .addCase(fetchTags.fulfilled, (state, action) => {
        state.tags.items = action.payload;
        state.tags.status = 'Loaded';
      })
      .addCase(fetchTags.rejected, (state) => {
        state.tags.items = [];
        state.tags.status = 'Error';
      })
      .addCase(fetchRemovePost.pending, (state, action) => {
        state.posts.items = state.posts.items.filter((obj) => obj._id !== action.meta.arg);
    })
    .addCase(fetchRemovePost.fulfilled, (state, action) => {
      const { unusedTags } = action.payload;
      if (unusedTags && unusedTags.length) {
        // Удаляем неиспользуемые теги
        state.tags.items = state.tags.items.filter(tag => !unusedTags.includes(tag));
      }
    });
    
      
  },
});

export const postsReducer = postSlice.reducer;
