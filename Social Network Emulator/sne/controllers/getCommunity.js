const { Op } = require("sequelize");
const { Community, sequelize, User } = require("../sequelize");

const getTopCommunitiesController = async (req, res, next) => {
  try {
    const userId = req.userId;

    const topCommunities = await Community.findAll({
      order: [["membersCount", "DESC"]],
      limit: 10,
      include: {
        model: User,
        where: { pdsId: { [Op.eq]: userId } },
        required: false,
      },
    });

    const formattedTopCommunities = topCommunities.map((community) => {
      const communityObj = community.get();

      const isJoined = !!communityObj.Users.length;

      delete communityObj.Users;

      return { ...communityObj, isJoined };
    });

    res.json(formattedTopCommunities);
  } catch (err) {
    next(err);
  }
};

const getCommunityBySlug = async (req, res, next) => {
  try {
    const userId = req.userId;
    const { slug } = req.params;

    const community = await Community.findOne({
      where: { slug },
      include: {
        model: User,
        where: { pdsId: { [Op.eq]: userId } },
        required: false,
      },
    });

    if (!community) {
      const err = new Error("Community not found");
      err.statusCode = 404;
      throw err;
    }

    const communityObj = community.get();

    const isJoined = !!communityObj.Users.length;

    delete communityObj.Users;

    res.json({ ...communityObj, isJoined });
  } catch (err) {
    next(err);
  }
};

module.exports = { getTopCommunitiesController, getCommunityBySlug };
