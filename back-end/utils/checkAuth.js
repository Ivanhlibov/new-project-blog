import jwt from 'jsonwebtoken';

const secretKey = 'secret123';

export default (req, res, next) => {
  const token = (req.headers.authorization || '').replace(/Bearer\s?/, '');

  console.log('Received token:', token);

  if (token) {
    try {
      const decoded = jwt.verify(token, secretKey);
      console.log('Decoded token:', decoded);

      req.userId = decoded._id;
      next();
    } catch (error) {
      console.error('Token verification failed:', error.message);
      return res.status(403).json({
        message: 'Нет доступа',
      });
    }
  } else {
    console.log('No token provided');
    return res.status(403).json({
      message: 'Нет доступа',
    });
  }
};
