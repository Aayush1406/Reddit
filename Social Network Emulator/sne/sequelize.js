const Sequelize = require("sequelize");
const OTP_Model = require("./models/OTP");
const User_Model = require("./models/User");
const Community_Model = require("./models/Community");
const Post_Model = require("./models/Post");

const sequelize = new Sequelize("SNE", "postgres", "admin", {
  host: "localhost",
  dialect: "postgres",
  protocol: "postgres",
  port: "5431",
  define: {
    timestamps: false,
  },
  pool: {
    max: 20,
    min: 0,
    idle: 5000,
  },
  logging: false,
});

const OTP = OTP_Model(sequelize, Sequelize);
const User = User_Model(sequelize, Sequelize);
const Community = Community_Model(sequelize, Sequelize);
const Post = Post_Model(sequelize, Sequelize);

const CommunityMembers = sequelize.define("User_Community", {});
User.belongsToMany(Community, { through: CommunityMembers });
Community.belongsToMany(User, { through: CommunityMembers });

Post.belongsTo(Community, {
  foreignKey: "communityId",
  as: "community",
});

Community.belongsTo(User, { foreignKey: "creatorId" });

Post.belongsTo(User, { foreignKey: "creatorId", as: "creator" });

module.exports = { OTP, sequelize, User, Community, Post, CommunityMembers };
