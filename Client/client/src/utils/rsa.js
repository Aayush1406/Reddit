import { generateSHA256Hash } from "./digest";
const { JSEncrypt } = require("js-encrypt");

export const generateRsaKeyPair = async () => {
  const keyPair = await window.crypto.subtle.generateKey(
    {
      name: "RSA-OAEP",
      modulusLength: 1024,
      publicExponent: new Uint8Array([1, 0, 1]),
      hash: "SHA-256",
    },
    true,
    ["encrypt", "decrypt"]
  );
  const publicKeyBuffer = await window.crypto.subtle.exportKey(
    "spki",
    keyPair.publicKey
  );

  const privateKeyBuffer = await window.crypto.subtle.exportKey(
    "pkcs8",
    keyPair.privateKey
  );

  const publicKey = btoa(
    String.fromCharCode(...new Uint8Array(publicKeyBuffer))
  );
  const privateKey = btoa(
    String.fromCharCode(...new Uint8Array(privateKeyBuffer))
  );

  return {
    publicKey,
    privateKey,
  };
};

export const getSignature = async (message, serverPubKey) => {
  const jsEncrypt = new JSEncrypt();

  jsEncrypt.setPublicKey(serverPubKey);

  const messageDigest = await generateSHA256Hash(message);

  const encrypted = jsEncrypt.encrypt(messageDigest);

  return encrypted;
};

export const verifySignature = async (data, signature) => {
  const jsEncrypt = new JSEncrypt();

  const rsaKeyPair = JSON.parse(localStorage.getItem("rsaKeyPair"));

  const privateKey = rsaKeyPair.privateKey;

  jsEncrypt.setPrivateKey(privateKey);

  const digestFromSignature = jsEncrypt.decrypt(signature);

  const digestOfData = await generateSHA256Hash(data);

  return digestFromSignature === digestOfData;
};

export const getRSAKeyPair = () => {
  const rsaKeyPair = localStorage.getItem("rsaKeyPair");
  if (rsaKeyPair) {
    const parsedRsaKeyPair = JSON.parse(rsaKeyPair);

    return {
      publicKey: parsedRsaKeyPair.publicKey,
      privateKey: parsedRsaKeyPair.privateKey,
    };
  }
  return null;
};
