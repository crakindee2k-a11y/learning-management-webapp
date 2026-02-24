import dotenv from 'dotenv';
dotenv.config();

const requiredEnvVars = [
  'MONGODB_URL',
  'ACCESS_TOKEN_SECRET',
  'REFRESH_TOKEN_SECRET',
  'ADMIN_BANK_ACCOUNT_NUMBER',
];

const missingEnvVars = requiredEnvVars.filter((key) => !process.env[key]);
if (missingEnvVars.length > 0) {
  console.error(`Missing required environment variables: ${missingEnvVars.join(', ')}`);
  process.exit(1);
}
import connectDb from './db/index.js';
import app from './app.js';
import { BankAccount} from './model/bankAccount.model.js';  
import { Admin } from './model/Admin.model.js';
import { User } from './model/user.model.js';
import { bankAccountData } from './utils/bankAccountData.js'; 

const ensureAdminBankAccount = async () => {
  try {
    const adminAccountNumber = process.env.ADMIN_BANK_ACCOUNT_NUMBER;
    if (!adminAccountNumber) return;

    const existing = await BankAccount.findOne({ account_number: adminAccountNumber });
    if (existing) return;

    const seedAccount = bankAccountData.find(
      (account) => account.account_number === adminAccountNumber
    );

    await BankAccount.create(
      seedAccount || {
        account_number: adminAccountNumber,
        current_balance: 0,
        secret_key: `admin-${adminAccountNumber}`,
      }
    );
    console.log(`✅ Admin bank account seeded: ${adminAccountNumber}`);
  } catch (error) {
    console.error("❌ Error ensuring admin bank account:", error);
  }
};

const ensureAdminUser = async () => {
  try {
    const existingAdmin = await Admin.findOne({ role: 'Admin' });
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@lms.com';
    const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';
    const adminUserName = process.env.ADMIN_USERNAME || 'admin';
    const adminFullName = process.env.ADMIN_FULL_NAME || 'System Admin';
    const shouldReset = ['true', '1', 'yes'].includes(
      (process.env.ADMIN_RESET_PASSWORD || '').toLowerCase(),
    );

    if (existingAdmin) {
      if (shouldReset) {
        existingAdmin.fullName = adminFullName;
        existingAdmin.userName = adminUserName;
        existingAdmin.email = adminEmail;
        existingAdmin.password = adminPassword;
        await existingAdmin.save();
        console.log(`✅ Admin user updated: ${adminEmail}`);
      }
      return;
    }

    const existingUser = await User.findOne({
      $or: [{ email: adminEmail }, { userName: adminUserName }],
    });
    if (existingUser) {
      if (shouldReset) {
        existingUser.fullName = adminFullName;
        existingUser.userName = adminUserName;
        existingUser.email = adminEmail;
        existingUser.password = adminPassword;
        existingUser.role = 'Admin';
        await existingUser.save();
        console.log(`✅ Existing user promoted to admin: ${adminEmail}`);
      } else {
        console.warn(
          '⚠️ Admin user not created: user already exists with admin email/username. Set ADMIN_RESET_PASSWORD=true to promote.',
        );
      }
      return;
    }

    await Admin.create({
      fullName: adminFullName,
      userName: adminUserName,
      email: adminEmail,
      password: adminPassword,
      role: 'Admin',
    });
    console.log(`✅ Admin user seeded: ${adminEmail}`);
  } catch (error) {
    console.error('❌ Error ensuring admin user:', error);
  }
};



connectDb()
  .then(() => {
    app.listen(process.env.PORT || 5000, () => {
      console.log(`port is listening at ${process.env.PORT || 5000}`);
      // Ensure admin bank account exists
      ensureAdminBankAccount();
      // Ensure admin user exists
      ensureAdminUser();
    });
  })
  .catch((error) => {
    console.log("MongoDB connection failed", error);
  });