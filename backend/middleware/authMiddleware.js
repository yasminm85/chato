import jwt from 'jsonwebtoken';

const authMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res
      .status(401)
      .json({ success: false, message: 'Not Authorized. Login Again' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const tokenDecode = jwt.verify(token, process.env.JWT_SECRET);

    if (tokenDecode) {
      req.user = { id: tokenDecode._id || tokenDecode.id, username: tokenDecode.username };
    } else {
      return res.json({
        success: false,
        message: 'Not Authorized. Login Again',
      });
    }

    next();
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export default authMiddleware;
