const { CommunityMembers, sequelize } = require("../sequelize");

const subscribeUnsubsribeController = async (req, res, next) => {
  try {
    const { communityId } = req.body;
    const userId = req.userId;

    if (!communityId) {
      const err = new Error("communityId is missing");
      err.statusCode = 400;
      throw err;
    }

    await sequelize.transaction(async (t) => {
      const [_, created] = await CommunityMembers.findOrCreate({
        where: {
          UserPdsId: userId,
          CommunityId: communityId,
        },
        defaults: {
          UserPdsId: userId,
          CommunityId: communityId,
        },
        transaction: t,
      });

      if (!created) {
        await CommunityMembers.destroy(
          {
            where: {
              UserPdsId: userId,
              CommunityId: communityId,
            },
          },
          {
            transaction: t,
          }
        );
      }
    });

    res.status(200).end();
  } catch (err) {
    next(err);
  }
};

module.exports = { subscribeUnsubsribeController };
