const { Community, sequelize } = require("../sequelize");
const { getImageByQuery } = require("../services/unsplash");

const createCommunityController = async (req, res, next) => {
  try {
    const { title } = req.body;
    const userId = req.userId;

    if (!title) {
      const err = new Error("Title is missing");
      err.statusCode = 400;
      throw err;
    }

    const slug = slugify(title) + "-" + Math.round(Math.random() * 10000);

    const imageURL = await getImageByQuery(title);

    await sequelize.transaction(async (t) => {
      const communityInstance = await Community.create(
        {
          title,
          slug,
          imageURL,
          creatorId: userId,
          membersCount: 1,
        },
        { transaction: t }
      );

      await communityInstance.addUsers(userId, { transaction: t });
    });

    res.json({ data: "ok" });
  } catch (err) {
    next(err);
  }
};

const slugify = (str) =>
  str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "")
    .replace(/^-+|-+$/g, "");

module.exports = { createCommunityController };
