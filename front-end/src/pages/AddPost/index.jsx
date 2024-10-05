import React, { useEffect, useRef } from 'react';
import TextField from '@mui/material/TextField';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import SimpleMDE from 'react-simplemde-editor';
import { selectAuth } from '../../redux/slices/auth';
import { useSelector } from 'react-redux';
import { useNavigate, Navigate, useParams } from 'react-router-dom';

import 'easymde/dist/easymde.min.css';
import styles from './AddPost.module.scss';
import axios from '../../axios';

export const AddPost = () => {
  const {id} = useParams()
  const isAuth = useSelector(selectAuth);
  const navigate = useNavigate();

  const [isLoading, setLoading] = React.useState(false);
  const [text, setText] = React.useState('');
  const [title, setTitle] = React.useState('');
  const [tags, setTags] = React.useState('');
  const [imageUrl, setImage] = React.useState('');
  const inputFileRef = useRef(null);

  const isEditing = Boolean(id)
  const handleChangeFile = async (event) => {
    try {
      const formData = new FormData();
      const file = event.target.files[0];
      formData.append('image', file);
      const { data } = await axios.post('/upload', formData);
      setImage(data.url);
      console.log('Uploaded Image URL:', data.url);  // Проверка на правильность URL
    } catch (error) {
      console.log(error);
      alert('Ошибка при загрузке файлов');
    }
  };

  const onClickRemoveImage = () => {
    setImage('');
  };

  const onChange = React.useCallback((value) => {
    setText(value);
  }, []);

  useEffect(() => {
    if (id) {
      axios.get(`/posts/${id}`).then(response => {
        const data = response.data;
        setTitle(data.title || '');
        setText(data.text || '');
        setImage(data.imageUrl || '');
        setTags(Array.isArray(data.tags) ? data.tags.join(',') : '');
  
      }).catch(err => {
        console.log(err);
        alert('Ошибка при получении статьи');
      });
    }
  }, [id]);
  

  const options = React.useMemo(
    () => ({
      spellChecker: false,
      maxHeight: '400px',
      autofocus: true,
      placeholder: 'Введите текст...',
      status: false,
      autosave: {
        enabled: true,
        delay: 1000,
      },
    }),
    []
  );

  if (!window.localStorage.getItem('token') && !isAuth) {
    return <Navigate to="/" />;
  }

  const onSubmit = async () => {
    try {
      setLoading(true);
      const fields = {
        title,
         imageUrl, 
        tags,
        text,
      };
      const { data } = isEditing 
      ?  await axios.patch(`/posts/${id}`, fields)
      :  await axios.post('/posts', fields)

      const _id = isEditing ? id : data._id;
      navigate(`/posts/${_id}`);
    } catch (error) {
      console.log(error);
      alert('Ошибка при создании статьи');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Paper style={{ padding: 30 }}>
      <Button onClick={() => inputFileRef.current.click()} variant="outlined" size="large">
      Download preview
            </Button>
      <input ref={inputFileRef} type="file" onChange={handleChangeFile} hidden />
      {imageUrl && (
        <>
          <Button variant="contained" color="error" onClick={onClickRemoveImage}>
            Delete
          </Button>
          <img className={styles.image} src={`http://localhost:4444${imageUrl}`} alt="Uploaded" />
        </>
      )}

      <br />
      <br />
      <TextField
        classes={{ root: styles.title }}
        variant="standard"
        placeholder="Article title..."
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        fullWidth
      />
      <TextField
        value={tags}
        onChange={(e) => setTags(e.target.value)}
        classes={{ root: styles.tags }}
        variant="standard"
        placeholder="Tags..."
        fullWidth
      />
      <SimpleMDE className={styles.editor} value={text} onChange={onChange} options={options} />
      <div className={styles.buttons}>
        <Button onClick={onSubmit} size="large" variant="contained" disabled={isLoading}>
          {isEditing ? 'Сохранить' : 'Опубликовать'}
        </Button>
        <a href="/">
          <Button size="large">Cancel</Button>
        </a>
      </div>
    </Paper>
  );
};