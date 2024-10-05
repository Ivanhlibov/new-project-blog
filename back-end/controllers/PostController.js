import PostModel from '../models/Post.js';
import CommentModel from '../models/comment.js';

export const getLastTags = async (req, res) => {
  try {
    const posts = await PostModel.find().limit(5).exec();

    const tags = posts
      .map((obj) => obj.tags)
      .flat()
      .slice(0, 5);

    res.json(tags);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: 'Не удалось получить тэги',
    });
  }
};


export const getAll = async (req, res) => {
  try {
    const posts = await PostModel.find().populate('user').exec();
    
    // Добавляем количество комментариев для каждого поста
    const postsWithCommentsCount = await Promise.all(posts.map(async (post) => {
      const commentsCount = await CommentModel.countDocuments({ postId: post._id });
      return { ...post.toObject(), commentsCount };
    }));
    
    res.json(postsWithCommentsCount);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: 'Не удалось получить статьи',
    });
  }
};
export const getOne = async (req, res) => {
  try {
    const postId = req.params.id;

    const doc = await PostModel.findOneAndUpdate(
      { _id: postId },
      { $inc: { viewsCount: 1 } },
      { returnDocument: 'after' } // для Mongoose v6 и выше
    ).populate('user');

    if (!doc) {
      return res.status(404).json({
        message: 'Статья не найдена',
      });
    }

    res.json(doc);
  } catch (error) {
    console.log('Ошибка при получении статьи:', error);
    res.status(500).json({
      message: 'Не удалось получить статью',
    });
  }
};
// PostController.js
export const getPostsByTag = async (req, res) => {
  try {
    const tag = req.params.tag; // Получаем тег из параметров
    const posts = await PostModel.find({ tags: tag }).populate('user').exec(); // Ищем посты с этим тегом

    if (!posts.length) {
      return res.status(404).json({
        message: 'Посты с таким тегом не найдены',
      });
    }

    res.json(posts); // Возвращаем посты
  } catch (err) {
    console.log('Ошибка на сервере:', err);
    res.status(500).json({
      message: 'Не удалось получить посты с таким тегом',
    });
  }
};



// PostController.js
// export const getPopularPosts = async (req, res) => {
//   try {
//     const posts = await PostModel.find().sort({ viewsCount: -1 }).populate('user').exec();
//     res.json(posts);
//   } catch (err) {
//     console.log(err);
//     res.status(500).json({
//       message: 'Не удалось получить популярные статьи',
//     });
//   }
// };






export const remove = async (req, res) => {
  try {
    const postId = req.params.id;

    // Находим пост для удаления, чтобы получить его теги
    const post = await PostModel.findById(postId);
    if (!post) {
      return res.status(404).json({ message: 'Статья не найдена' });
    }

    const postTags = post.tags;

    // Удаляем пост
    await PostModel.findOneAndDelete({ _id: postId });

    // Проверяем, какие теги больше не используются в других постах
    const remainingPosts = await PostModel.find({ tags: { $in: postTags } });

    // Получаем теги, которые больше нигде не используются
    const unusedTags = postTags.filter(tag => !remainingPosts.some(post => post.tags.includes(tag)));

    res.json({
      success: true,
      unusedTags, // Возвращаем список неиспользуемых тегов
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: 'Не удалось удалить статью',
    });
  }
};
export const create = async (req, res) => {
  try {
    const doc = new PostModel({
      title: req.body.title,
      text: req.body.text,
      imageUrl: req.body.imageUrl,
      tags: req.body.tags.split(','),
      user: req.userId,
    });

    const post = await doc.save();

    res.json(post);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: 'Не удалось создать статью',
    });
  }
};

export const update = async (req, res) => {
  try {
    const postId = req.params.id;

    await PostModel.updateOne(
      {
        _id: postId,
      },
      {
        title: req.body.title,
        text: req.body.text,
        imageUrl: req.body.imageUrl,
        user: req.userId,
        tags: req.body.tags.split(','),
      },
    );

    res.json({
      success: true,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: 'Не удалось обновить статью',
    });
  }
};