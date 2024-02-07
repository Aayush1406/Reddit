const isAuth = (req, res, next) => {
  try {
    const userId = req.get("userId");
    if (!userId) {
      const err = new Error("Authorization failed");
      err.statusCode = 401;
      throw err;
    }

    req.userId = userId;
    next();
  } catch (e) {
    next(e);
  }
};

module.exports = { isAuth };
