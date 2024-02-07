import { decrypt, encrypt } from "crypto-js/aes";
import { parse } from "crypto-js/enc-hex";

const iv = parse(Buffer.alloc(16).toString("hex"));

export const aesEncrypt = (dataString, secretKey) => {
  const key = parse(secretKey);

  const cipher = encrypt(dataString, key, {
    iv,
  });

  return cipher.ciphertext.toString();
};

export const aesDecrypt = (cipherText, secretKey) => {
  const key = parse(secretKey);

  const decipher = decrypt({ ciphertext: parse(cipherText) }, key, { iv });

  return hex2a(decipher.toString());
};

function hex2a(hex) {
  var str = "";
  for (var i = 0; i < hex.length; i += 2)
    str += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
  return str;
}
