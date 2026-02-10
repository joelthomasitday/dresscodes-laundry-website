const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

// Load env vars
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const uri = process.env.MONGODB_URI;
console.log("URI found:", uri ? "Yes" : "No");

if (!uri) {
  console.error("No MONGODB_URI found");
  process.exit(1);
}

console.log("Attempting to connect...");
mongoose.connect(uri, { serverSelectionTimeoutMS: 5000 })
  .then(async () => {
    console.log("Connected successfully!");
    
    // Check for admin user
    try {
        const User = mongoose.model('User', new mongoose.Schema({ email: String, role: String }));
        const admin = await User.findOne({ email: 'admin@dresscodes.in' });
        console.log("Admin user found:", admin ? "Yes" : "No");
        
        if (!admin) {
            console.log("Admin user missing. You should run the seed script.");
        } else {
             console.log("Admin user exists.");
        }
        
    } catch (e) {
        console.error("Error querying user:", e);
    }
    
    await mongoose.disconnect();
    process.exit(0);
  })
  .catch(err => {
    console.error("Connection failed:", err.message);
    process.exit(1);
  });
