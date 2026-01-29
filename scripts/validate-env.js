const required = [
  "NEXT_PUBLIC_FIREBASE_API_KEY",
  "NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN",
  "NEXT_PUBLIC_FIREBASE_PROJECT_ID",
  "NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET",
  "NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID",
  "NEXT_PUBLIC_FIREBASE_APP_ID",
];

function loadEnv() {
  try {
    const path = require("path");
    const fs = require("fs");
    const envPath = path.join(process.cwd(), ".env.local");
    if (fs.existsSync(envPath)) {
      const content = fs.readFileSync(envPath, "utf8");
      content.split("\n").forEach((line) => {
        const m = line.match(/^([^#=]+)=(.*)$/);
        if (m) process.env[m[1].trim()] = m[2].trim().replace(/^["']|["']$/g, "");
      });
    }
  } catch (e) {
    console.warn("Could not load .env.local:", e.message);
  }
}

loadEnv();
let failed = false;
required.forEach((key) => {
  if (!process.env[key]) {
    console.error("Missing required env:", key);
    failed = true;
  }
});
if (failed) process.exit(1);
console.log("Env validation passed.");
