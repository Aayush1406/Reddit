require("dotenv").config();
const express = require("express");
const cors = require("cors");
const sgMail = require("@sendgrid/mail");
const { sequelize } = require("./sequelize");

const { sendOtpController } = require("./controllers/sendOtp");
const { verifyOtpController } = require("./controllers/verifyOtp");
const { signUpController } = require("./controllers/signUp");
const { createCommunityController } = require("./controllers/createCommunity");
const { createPostController } = require("./controllers/createPost");
const {
  subscribeUnsubsribeController,
} = require("./controllers/subscribeCommunity");
const { isAuth } = require("./middlewares/auth");
const {
  getTopCommunitiesController,
  getCommunityBySlug,
} = require("./controllers/getCommunity");
const {
  getFeedPosts,
  getPostsByCommunitySlug,
} = require("./controllers/getPost");
const { getPostContent } = require("./controllers/getPostContent");

sgMail.setApiKey(process.env.SENDGRID_API_KEY);
const port = process.env.PORT || 8001;

const app = express();

app.use(cors());
app.use(express.json());

app.post("/email/otp", sendOtpController);
app.post("/verify/otp", verifyOtpController);
app.post("/signup", signUpController);
app.post("/community", isAuth, createCommunityController);
app.get("/communities", isAuth, getTopCommunitiesController);
app.get("/community/:slug", isAuth, getCommunityBySlug);

app.get("/posts/feed", isAuth, getFeedPosts);
app.get("/posts/community/:communitySlug", isAuth, getPostsByCommunitySlug);
app.get("/post/:id", isAuth, getPostContent);
app.post("/post", isAuth, createPostController);

app.post("/community/joinOrLeave", isAuth, subscribeUnsubsribeController);

app.use((error, req, res, next) => {
  console.error(error);

  if (!error.statusCode) {
    error.statusCode = 500;
    error.message = "Server Error";
  }

  const errRes = {
    error: {
      message: error.message,
      status: error.statusCode,
    },
  };

  res.status(error.statusCode).json(errRes);
});

sequelize
  .sync()
  .then(() => {
    app.listen(port, function () {
      console.log("Server is running on " + port);
    });
  })
  .catch((err) => {
    console.error(err);
  });
