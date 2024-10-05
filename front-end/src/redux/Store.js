import { configureStore } from '@reduxjs/toolkit';
import  {postsReducer} from './slices/posts';
import { AuthReducer } from './slices/auth';


const store = configureStore({
    reducer: {
        posts: postsReducer,
        auth: AuthReducer,
    },
});
// store.dispatch(setPosts({ items: ['post1', 'post2'], status: 'Loaded' }));
// store.dispatch(setTags({ items: ['tag1', 'tag2'], status: 'Loaded' }));

export default store;