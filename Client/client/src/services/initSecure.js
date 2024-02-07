import { httpGet } from "../utils/axiosRequests";

export const initSecure = async () => {
  const { data, status, error } = await httpGet({
    url: "/initSecure",
    service: "pds",
  });

  if (status === 200 && data) {
    return {
      serverRsaPubKey: data.rsaServerPublicKey,
      serverDhPubKey: data.dhServerPublicKey,
    };
  } else if (error) {
    throw new Error(error);
  }
};
