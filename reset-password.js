const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const path = require('path');

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const uri = process.env.MONGODB_URI;

if (!uri) {
  console.error("No MONGODB_URI found");
  process.exit(1);
}

const userSchema = new mongoose.Schema({
  email: String,
  passwordHash: String,
  role: String,
  name: String
}, { strict: false });

const User = mongoose.model('User', userSchema);

async function reset() {
  try {
    console.log("Connecting...");
    await mongoose.connect(uri, { serverSelectionTimeoutMS: 5000 });
    console.log("Connected.");

    const email = "admin@dresscodes.in";
    const newPassword = "admin123";
    const hash = await bcrypt.hash(newPassword, 12);

    const res = await User.updateOne(
      { email },
      { $set: { passwordHash: hash, role: 'admin', isActive: true, name: 'Admin' } },
      { upsert: true } // Create if not exists
    );

    console.log("Password reset result:", res);
    console.log(`User ${email} password set to: ${newPassword}`);

  } catch (error) {
    console.error("Reset failed:", error);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

reset();
