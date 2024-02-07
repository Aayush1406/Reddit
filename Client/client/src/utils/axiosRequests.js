import axios from "axios";

const BASE_URL = {
  pds: "http://localhost:8080",
  sne: "http://localhost:8001",
};

export const httpGet = async ({
  url,
  params,
  headers,
  service = "sne",
  ...rest
}) => {
  try {
    const apiUrl = BASE_URL[service] + url;
    const response = await axios.get(apiUrl, {
      params,
      headers,
      ...rest,
    });

    return {
      data: response.data,
      status: response.status,
    };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return {
        error,
      };
    }
    throw error;
  }
};

export const httpPost = async ({ url, data, service = "sne", ...rest }) => {
  try {
    const apiUrl = BASE_URL[service] + url;
    const response = await axios.post(apiUrl, data, rest);

    return {
      data: response.data,
      status: response.status,
    };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return {
        error,
      };
    }
    throw error;
  }
};
