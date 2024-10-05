import React from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Grid from '@mui/material/Grid';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { Post } from '../components/Post';
import { TagsBlock } from '../components/TagsBlock';
import { fetchPosts, fetchTags, fetchPostsByTag, fetchPopularPosts, fetchRemovePost } from '../redux/slices/posts';

export const Home = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const userData = useSelector((state) => state.auth.data);
  const { posts, tags } = useSelector((state) => state.posts);
  const [tab, setTab] = React.useState(0);

  // Обновляем посты и теги в зависимости от вкладки
  React.useEffect(() => {
    if (tab === 0) {
      dispatch(fetchPosts());
    } else if (tab === 1) {
      dispatch(fetchPopularPosts()); // Популярные посты
    }
    dispatch(fetchTags());
  }, [tab, dispatch]);

  // Обработчик удаления поста
  const handleRemovePost = async (id) => {
    if (window.confirm('Вы действительно хотите удалить статью?')) {
      const { payload } = await dispatch(fetchRemovePost(id)); // Удаление поста и получение неиспользуемых тегов
      if (payload && payload.unusedTags) {
        // Если есть неиспользуемые теги, удаляем их из списка тегов на фронтенде
        const updatedTags = tags.items.filter(tag => !payload.unusedTags.includes(tag));
        dispatch({
          type: 'posts/setTags', // Обновляем теги в состоянии
          payload: updatedTags,
        });
      }
    }
  };

  // Обработчик клика по тегу
  const handleTagClick = (tag) => {
    navigate(`/tag/${tag}`); // Навигация на страницу с постами по тегу
  };

  // Обработчик переключения вкладок
  const handleTabChange = (event, newValue) => {
    setTab(newValue);
    if (newValue === 0) {
      dispatch(fetchPosts()); // Новые посты
    } else if (newValue === 1) {
      dispatch(fetchPopularPosts()); // Популярные посты
    }
  };

  const isPostsLoading = posts.status === 'loading';
  const isTagsLoading = tags.status === 'loading';

  return (
    <>
      <Tabs
        style={{ marginBottom: 15 }}
        value={tab}
        // onChange={handleTabChange}
        aria-label="basic tabs example"
      >
        <Tab label="Posts" />
      </Tabs>
      <Grid container spacing={4}>
        {/* Левая колонка с постами */}
        <Grid item xs={12} md={8}>
          {isPostsLoading
            ? [...Array(5)].map((_, index) => <Post key={index} isLoading={true} />)
            : (posts.items && posts.items.length > 0) ? (
                posts.items.map((obj, index) => (
                  <Post
                    key={index}
                    id={obj._id}
                    title={obj.title}
                    imageUrl={obj.imageUrl ?  `http://localhost:4444${obj.imageUrl}` : '' }
                    user={obj.user}
                    createdAt={obj.createdAt}
                    viewsCount={obj.viewsCount}
                    commentsCount={obj.commentsCount || 0} // Количество комментариев
                    tags={obj.tags}
                    isEditable={userData?._id === obj.user._id}
                    onRemove={() => handleRemovePost(obj._id)} // Передаем обработчик удаления
                  />
                ))
              ) : (
                <div>Not found posts</div>
              )}
        </Grid>

        {/* Правая колонка с тегами */}
        <Grid item xs={12} md={4}>
          <TagsBlock items={tags.items} isLoading={isTagsLoading} onClickTag={handleTagClick} />
        </Grid>
      </Grid>
    </>
  );
};
