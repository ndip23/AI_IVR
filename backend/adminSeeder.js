require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');

const seedAdmin = async () => {
  try {
    // 1. Connect to MongoDB Atlas
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connecting to database...");

    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPassword = process.env.ADMIN_PASSWORD;

    if (!adminEmail || !adminPassword) {
      console.error("❌ ERROR: ADMIN_EMAIL or ADMIN_PASSWORD not found in .env file");
      process.exit(1);
    }

    // 2. Check if the Admin already exists
    let admin = await User.findOne({ email: adminEmail });

    if (admin) {
      console.log(`User ${adminEmail} already exists. Updating role to 'admin'...`);
      admin.role = 'admin';
      await admin.save();
      console.log("✅ SUCCESS: Role updated to Admin.");
    } else {
      console.log(`Creating new Admin user: ${adminEmail}...`);
      
      // Hash the password from .env
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(adminPassword, salt);

      // Create the Admin
      await User.create({
        name: "Master Admin",
        email: adminEmail,
        password: hashedPassword,
        role: 'admin'
      });
      console.log("✅ SUCCESS: Admin user created successfully!");
    }

    mongoose.connection.close();
    process.exit();
  } catch (error) {
    console.error("❌ ERROR:", error.message);
    process.exit(1);
  }
};

seedAdmin();