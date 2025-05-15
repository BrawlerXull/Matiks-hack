const CryptoJS = require("crypto-js");

// 1. Hardcoded encryption key
const key = ["S1E9C5R", "@E@T*K)E", "(YS1E9C5R", "^E@T*K)E"].join("");

// 2. Your encrypted string (in "iv:ciphertext" format, both hex-encoded)
const encrypted = `38e3186ae388680022977e5e81b225f4:5c012d400c2b6bbd05a0c9ef140667dcb18abba6a0b77f0f384366758f385b0951c8c5e01c961b44964157136fa98d158ec2238553b2a8ce050ecf5ce94be3e4a134a6c87a9885aa122444ab2026e35d1a55cfc11d15b64fee9fd7e6445d2c1edf4bab567f52be99c8d2003d1c2255b70e87b4dad7cac502163c4119b558252e4d973b9a8b3232740ffebc1fc815196266e3bd606bc7b853dcda7126b5a1ac371d8d263bf6db494bf8dfb5b153728e79e5c0804df447614700b720616933395d406ebc3157053b1cbab4a9ce5f3f7351c857bf50a2fc2f107bed6f2922062d1ed64120c1ce51a28f9b0581329c8bfd0f8c003fa35a64a0da10f32d474b02abff64bf9ece1793c0c23865a88e279a94ece1b95a15976333c94f5d81649eb59ef6e4cad81cd555b60759e7f676007b463b988f5aa209a2d0fa4b485a1508b203da`;

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
