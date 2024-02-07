import { httpPost } from "../utils/axiosRequests";

export const sendEmailOtp = (email) => {
  return httpPost({ data: { email }, url: "/email/otp", service: "sne" });
};

export const verifyEmailOtp = (verificationKey, otp) => {
  return httpPost({
    data: { verification_key: verificationKey, otp },
    url: "/verify/otp",
    service: "sne",
  });
};
