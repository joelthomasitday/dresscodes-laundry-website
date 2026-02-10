const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const uri = "mongodb+srv://joeltka1_db_user:nAm7kVaEACxpOiMM@cluster0.oyzwpzw.mongodb.net/dresscode?retryWrites=true&w=majority&appName=Cluster0";

const userSchema = new mongoose.Schema({
  email: String,
  passwordHash: String,
  role: String,
  name: String
}, { strict: false });

const User = mongoose.model('User', userSchema);

async function verifyLogin() {
  try {
    console.log("🔌 Connecting to MongoDB...");
    await mongoose.connect(uri, { serverSelectionTimeoutMS: 5000 });
    console.log("✅ Connected.");

    const email = "admin@dresscodes.in";
    const password = "admin123";

    console.log(`🔍 Looking for user: ${email}`);
    const user = await User.findOne({ email });

    if (!user) {
      console.error("❌ User NOT FOUND.");
      process.exit(1);
    }

    console.log("✅ User found:", user._id, user.role);
    console.log("stored hash:", user.passwordHash);

    console.log(`🔑 Verifying password: '${password}'`);
    const isMatch = await bcrypt.compare(password, user.passwordHash);

    if (isMatch) {
      console.log("✅ Password MATCHES! Login should work.");
    } else {
      console.error("❌ Password MISMATCH.");
      
      console.log("🔄 Re-hashing and updating password to 'admin123'...");
      const newHash = await bcrypt.hash(password, 12);
      user.passwordHash = newHash;
      await user.save();
      console.log("✅ Password updated.");
      
      const retryMatch = await bcrypt.compare(password, newHash);
      console.log("Re-verification:", retryMatch ? "SUCCESS" : "FAILED");
    }

  } catch (error) {
    console.error("❌ Error:", error);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

verifyLogin();
