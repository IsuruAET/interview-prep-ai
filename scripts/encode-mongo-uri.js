#!/usr/bin/env node

/**
 * Optional helper script to URL encode MongoDB connection string passwords
 *
 * NOTE: MongoDB Atlas usually handles this automatically when generating
 * connection strings. Only use this if you're manually editing a URI and
 * getting connection errors.
 *
 * Usage: node scripts/encode-mongo-uri.js "your-password"
 */

const readline = require("readline");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const password = process.argv[2];

if (password) {
  // Direct password encoding
  const encoded = encodeURIComponent(password);
  console.log("\n📝 Original password:", password);
  console.log("🔐 URL encoded:", encoded);
  console.log("\n💡 Use this encoded password in your MONGO_URI");
  console.log(
    "   Example: mongodb+srv://username:" +
      encoded +
      "@cluster.mongodb.net/dbname\n"
  );
  process.exit(0);
}

// Interactive mode
console.log("🔐 MongoDB Password URL Encoder\n");
console.log(
  "This tool helps encode special characters in MongoDB passwords.\n"
);
console.log("Special characters that need encoding:");
console.log("  @ → %40");
console.log("  # → %23");
console.log("  % → %25");
console.log("  ! → %21");
console.log("  $ → %24");
console.log("  & → %26");
console.log("  + → %2B");
console.log("  = → %3D");
console.log("  ? → %3F");
console.log("  / → %2F");
console.log("  : → %3A\n");

rl.question("Enter your MongoDB password: ", (password) => {
  if (!password) {
    console.log("❌ No password provided");
    rl.close();
    return;
  }

  const encoded = encodeURIComponent(password);

  console.log("\n✅ Encoding complete!\n");
  console.log("Original password:", password);
  console.log("URL encoded:", encoded);
  console.log("\n📋 Use this in your MONGO_URI:");
  console.log(
    "mongodb+srv://username:" + encoded + "@cluster.mongodb.net/dbname\n"
  );

  rl.close();
});
