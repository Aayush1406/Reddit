const crypto = require("crypto");
const password = "aayush";

const iv = Buffer.alloc(16);

function sha1(input) {
  return crypto.createHash("sha1").update(input).digest();
}

function password_derive_bytes(password, salt, iterations, len) {
  let key = Buffer.from(password + salt);
  for (let i = 0; i < iterations; i++) {
    key = sha1(key);
  }
  if (key.length < len) {
    const hx = password_derive_bytes(password, salt, iterations - 1, 20);
    for (let counter = 1; key.length < len; ++counter) {
      key = Buffer.concat([
        key,
        sha1(Buffer.concat([Buffer.from(counter.toString()), hx])),
      ]);
    }
  }
  return Buffer.alloc(len, key);
}

function encode(string) {
  const key = password_derive_bytes(password, "", 100, 32);
  const cipher = crypto.createCipheriv("aes-256-cbc", key, iv);
  const part1 = cipher.update(string, "utf8");
  const part2 = cipher.final();
  const encrypted = Buffer.concat([part1, part2]).toString("base64");
  return encrypted;
}

function decode(string) {
  const key = password_derive_bytes(password, "", 100, 32);
  const decipher = crypto.createDecipheriv("aes-256-cbc", key, iv);
  let decrypted = decipher.update(string, "base64", "utf8");
  decrypted += decipher.final();
  return decrypted;
}

module.exports = { encode, decode };
