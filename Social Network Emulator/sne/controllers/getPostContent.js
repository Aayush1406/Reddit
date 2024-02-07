const fetch = require("node-fetch");

const getPostContent = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.userId;

    const response = await fetch(process.env.PDS_BASE_URL + "/posts/list", {
      method: "POST",
      body: JSON.stringify({ userId, postIds: [id] }),
      headers: { "Content-Type": "application/json" },
    });

    const jsonResponse = await response.json();

    res.json(jsonResponse);
  } catch (err) {
    next(err);
  }
};

module.exports = { getPostContent };
