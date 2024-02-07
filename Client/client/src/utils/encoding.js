export function convertPemToBinary(pem) {
  const lines = pem.split("\n");
  const base64 = lines.filter((line) => !line.startsWith("-----")).join("");
  return Uint8Array.from(atob(base64), (c) => c.charCodeAt(0));
}
