const mongoose = require('mongoose');

const uri = "mongodb+srv://joeltka1_db_user:nAm7kVaEACxpOiMM@cluster0.oyzwpzw.mongodb.net/dresscode?retryWrites=true&w=majority&appName=Cluster0";

console.log("Testing connection with provided URI...");
console.log("URI:", uri.replace(/:([^@]+)@/, ":****@")); // Mask password for safety in logs

mongoose.connect(uri, { serverSelectionTimeoutMS: 5000 })
  .then(() => {
    console.log("✅ SUCCESS: Connected to MongoDB successfully!");
    mongoose.connection.db.admin().ping()
      .then(() => {
        console.log("✅ SUCCESS: Database ping successful!");
        process.exit(0);
      })
      .catch(err => {
        console.error("❌ ERROR: Ping failed:", err);
        process.exit(1);
      });
  })
  .catch(err => {
    console.error("❌ ERROR: Connection failed:", err.message);
    process.exit(1);
  });
