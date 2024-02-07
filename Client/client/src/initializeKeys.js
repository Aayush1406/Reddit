import { generateDiffieHellmanKeyPair } from "./utils/diffieHellman";
import { generateRsaKeyPair } from "./utils/rsa";

const initializeKeys = async () => {
  if (!localStorage.getItem("dhKeyPair")) {
    console.log('Generating diffie hellman key pair on client side.');
    const dhKeyPair = generateDiffieHellmanKeyPair();

    localStorage.setItem("dhKeyPair", JSON.stringify(dhKeyPair));
  }

  if (!localStorage.getItem("rsaKeyPair")) {
    console.log('Generating RSA key pair on client side.');

    const rsaKeyPair = await generateRsaKeyPair();

    localStorage.setItem("rsaKeyPair", JSON.stringify(rsaKeyPair));
  }
};

export default initializeKeys;
