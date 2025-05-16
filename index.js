const CryptoJS = require("crypto-js");

// 1. Hardcoded encryption key
const key = ["S1E9C5R", "@E@T*K)E", "(YS1E9C5R", "^E@T*K)E"].join("");

// 2. Your encrypted string (in "iv:ciphertext" format, both hex-encoded)
const encrypted = `97715f363e546e40ff1e52bab09790d8:2b64e26b33bce9781edc543258024725895939aeb35884aadb20e6b2816501036179c72ee2d17cc46c255410a361756bea0042baf350e5c3d022188a3f3eeda84b54a8cd0aa6ec519f01878606c1ee7812e24dfb78a59d78508d8ef6ba2ae27008c0cb0b12c25ae773a640840251d26a252a33dc409ddb89ecc1c3c912dd0ff981f026e3096e47d81e1cf7f08f5b1d28fecb552a21a8a06ed5a54a929fc180491cc95cafcad45949a90aa72dfdf4a326020eafd59123b9e1730d7a34dedfc5ee6f307e9f87d8ad28e323740bf0b82d7575374d57cd2765f0fb36915a3f8c8d04bd68824e32b114f27f200fdde1cdd62c0b66482d449dd3c1277e4a3f1f5633204a59c56f0556476084b760be67c88d55fdf561651cb5ce92cb331788eb8b0c320f3ddaeea3c1123fad36f195b2f2d2bb`;

// 3. Split IV and ciphertext
const [ivHex, cipherHex] = encrypted.split(":");

// 4. Parse to CryptoJS types
const iv = CryptoJS.enc.Hex.parse(ivHex);
const ciphertext = CryptoJS.enc.Hex.parse(cipherHex);

// 5. Decrypt using AES-CBC and PKCS7 padding
try {
  const decrypted = CryptoJS.AES.decrypt(
    { ciphertext },
    CryptoJS.enc.Utf8.parse(key),
    {
      iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7
    }
  );

  const plaintext = decrypted.toString(CryptoJS.enc.Utf8);

  try {
    const json = JSON.parse(plaintext);
    console.log("✅ Decrypted JSON:", json);
  } catch (err) {
    console.log("🔓 Decrypted text:", plaintext);
  }

} catch (err) {
  console.error("❌ Decryption failed:", err.message);
}
