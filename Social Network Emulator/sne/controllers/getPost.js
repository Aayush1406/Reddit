const { Op } = require("sequelize");
const { Post, Community, CommunityMembers, User } = require("../sequelize");

const getFeedPosts = async (req, res, next) => {
  try {
    const userId = req.userId;

    const postsResponse = await Post.findAll({
      order: [["created_at", "DESC"]],
      attributes: { exclude: ["communityId"] },
      include: [
        {
          model: Community,
          include: [
            {
              model: User,
              where: { pdsId: { [Op.eq]: userId } },
              required: true,
              attributes: [],
            },
          ],
          attributes: ["id", "slug"],
          as: "community",
          required: true,
        },
        {
          model: User,
          attributes: ["pdsId", "email"],
          as: "creator",
        },
      ],
    });

    res.json(postsResponse);
  } catch (err) {
    next(err);
  }
};

const getPostsByCommunitySlug = async (req, res, next) => {
  try {
    const { communitySlug } = req.params;

    const postsResponse = await Post.findAll({
      order: [["created_at", "DESC"]],
      attributes: { exclude: ["communityId"] },
      include: [
        {
          model: Community,
          where: { slug: { [Op.eq]: communitySlug } },
          attributes: ["id", "slug"],
          as: "community",
        },
        {
          model: User,
          attributes: ["pdsId", "email"],
          as: "creator",
        },
      ],
    });

    res.json(postsResponse);
  } catch (err) {
    next(err);
  }
};

module.exports = { getFeedPosts, getPostsByCommunitySlug };
