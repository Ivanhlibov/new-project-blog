// pages/PostsByTag.jsx
import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPostsByTag } from '../redux/slices/posts';
import { Post } from '../components/Post';
import styles from './style.scss';


export const PostsByTag = () => {
  const { tag } = useParams(); // Получаем параметр тега из URL
  const dispatch = useDispatch();
  const { posts } = useSelector((state) => state.posts);

  useEffect(() => {
    dispatch(fetchPostsByTag(tag)); // Загружаем посты по тегу
  }, [tag, dispatch]);

  const isPostsLoading = posts.status === 'loading';

  return (
    <div>
      <h2 className={styles.tags} >   #{tag}</h2>
      <div>
        {isPostsLoading
          ? [...Array(5)].map((_, index) => <Post key={index} isLoading={true} />)
          : (posts.items && posts.items.length > 0) ? (
              posts.items.map((post) => (
                <Post
                  key={post._id}
                  id={post._id}
                  title={post.title}
                  imageUrl={post.imageUrl ? `http://localhost:4444${post.imageUrl}` : ''}
                  user={post.user}
                  createdAt={post.createdAt}
                  viewsCount={post.viewsCount}
                  commentsCount={post.commentsCount || 0}
                  tags={post.tags}
                />
              ))
            ) : (
              <div>Not found tags</div>
            )}
      </div>
    </div>
  );
};
