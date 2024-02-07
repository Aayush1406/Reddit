const fetch = require("node-fetch");
const { URLSearchParams } = require("url");

const UNSPLASH_BASE_URL = "https://api.unsplash.com/search/photos?";
const UNSPLASH_CLIENT_ID =
  "Client-ID Uuii4O9pUPqHEjcUDAGT-Qh1M5zt6yno5W7v1f4EVKA";

const getImageByQuery = async (query = "") => {
  const response = await fetch(
    UNSPLASH_BASE_URL +
      new URLSearchParams({
        query,
        per_page: 1,
      }),
    {
      headers: { Authorization: UNSPLASH_CLIENT_ID },
    }
  );

  const data = await response.json();

  if (data.results?.length) {
    const firstRec = data.results[0];

    return firstRec.urls.full;
  } else {
    return "";
  }
};

module.exports = { getImageByQuery };
