const { Post } = require("../sequelize");

const createPostController = async (req, res, next) => {
  try {
    const { pdsId, communityId } = req.body;
    const userId = req.userId;

    if (!pdsId || !communityId) {
      const err = new Error("pdsId and communityId is missing");
      err.statusCode = 400;
      throw err;
    }

    await Post.create({
      pdsId,
      communityId,
      creatorId: userId,
    });
    res.status(200).end();
  } catch (err) {
    next(err);
  }
};

module.exports = { createPostController };
