import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "../axios";
import ReactMarkdown from 'react-markdown';
import { Post } from "../components/Post";
import { CommentsBlock } from "../components/CommentsBlock";
import { Index } from "../components/AddComment";
import Paper from '@mui/material/Paper';

export const FullPost = () => {
  const [data, setData] = useState(null);
  const [comments, setComments] = useState([]);
  const [isLoading, setLoading] = useState(true);
  const { id } = useParams();

  useEffect(() => {
    axios.get(`/posts/${id}`)
      .then((res) => {
        setData(res.data);
        return axios.get(`/comments/${id}`);
      })
      .then((res) => {
        setComments(res.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Ошибка при получении статьи:", error);
        alert("Ошибка при получении статьи");
        setLoading(false);
      });
  }, [id]);

  const handleAddComment = async (text) => {
    try {
      const { data } = await axios.post('/comments', {
        text,
        postId: id,
      });
      setComments([...comments, data]);
    } catch (error) {
      console.error("Ошибка при добавлении комментария:", error);
    }
  };

  if (isLoading) {
    return <Post isLoading={true} isFullPost />;
  }

  if (!data) {
    return <div>Not found</div>;
  }

  const imageUrl = data.imageUrl ? `http://localhost:4444${data.imageUrl}` : "";

  return (
    <Paper style={{ padding: 30 }}>
      <Post
        id={data._id}
        title={data.title}
        imageUrl={imageUrl}
        user={data.user}
        createdAt={data.createdAt}
        viewsCount={data.viewsCount}
        commentsCount={data.comments}
        tags={data.tags}
        isFullPost
      >
        <ReactMarkdown>{data.text}</ReactMarkdown>
      </Post>
      <CommentsBlock items={comments} isLoading={false}>
        <Index onAddComment={handleAddComment} />
      </CommentsBlock>
    </Paper>
  );
};
