// CommentController.js
import CommentModel from '../models/comment.js';

export const getCommentsByPostId = async (req, res) => {
  try {
    const postId = req.params.postId;
    const comments = await CommentModel.find({ postId }).populate('user').exec();
    res.json(comments);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: 'Не удалось получить комментарии',
    });
  }
};

export  const addComment = async (req, res) => {
  try {
    const doc = new CommentModel({
      text: req.body.text,
      postId: req.body.postId,
      user: req.userId,
    });
    const comment = await doc.save();
    res.json(comment);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: 'Не удалось добавить комментарий',
    });
  }
 
};


