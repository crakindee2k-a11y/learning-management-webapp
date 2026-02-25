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
import { Learner } from './model/learner.model.js';
import { Instructor } from './model/instructor.model.js';
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

const isTruthy = (value) => ['true', '1', 'yes'].includes((value || '').toLowerCase());

const ensureBankAccountByNumber = async (accountNumber) => {
  if (!accountNumber) return null;

  const existing = await BankAccount.findOne({ account_number: accountNumber });
  if (existing) return existing;

  const seedAccount = bankAccountData.find((account) => account.account_number === accountNumber);
  if (seedAccount) {
    return BankAccount.create(seedAccount);
  }

  return BankAccount.create({
    account_number: accountNumber,
    current_balance: 5000,
    secret_key: `demo-${accountNumber}`,
  });
};

const ensureRoleUser = async ({
  RoleModel,
  role,
  email,
  password,
  userName,
  fullName,
  shouldReset,
  bankAccountNumber,
}) => {
  const existing = await User.findOne({
    $or: [{ email }, { userName }],
  });

  let bankDetails = null;
  if (bankAccountNumber) {
    const bank = await ensureBankAccountByNumber(bankAccountNumber);
    bankDetails = {
      bank_account_number: bank.account_number,
      bank_secret: bank.secret_key,
    };
  }

  if (existing) {
    if (existing.role !== role) {
      console.warn(
        `⚠️ ${role} seed skipped: existing user found with same email/username but role ${existing.role}.`,
      );
      return;
    }

    if (shouldReset) {
      existing.fullName = fullName;
      existing.userName = userName;
      existing.email = email;
      existing.password = password;

      if (bankDetails) {
        existing.bank_account_number = bankDetails.bank_account_number;
        existing.bank_secret = bankDetails.bank_secret;
      }

      await existing.save();
      console.log(`✅ ${role} user updated: ${email}`);
    }
    return;
  }

  await RoleModel.create({
    fullName,
    userName,
    email,
    password,
    role,
    ...(bankDetails || {}),
  });
  console.log(`✅ ${role} user seeded: ${email}`);
};

const ensureDemoUsers = async () => {
  try {
    if (isTruthy(process.env.DEMO_USERS_ENABLED || 'true') === false) return;

    const shouldReset = isTruthy(process.env.DEMO_USERS_RESET_PASSWORD || '');
    const adminAccountNumber = process.env.ADMIN_BANK_ACCOUNT_NUMBER;
    const demoBankPool = bankAccountData
      .map((account) => account.account_number)
      .filter((number) => number !== adminAccountNumber);

    const learnerBankAccount =
      process.env.DEMO_LEARNER_BANK_ACCOUNT_NUMBER || demoBankPool[0] || null;
    let instructorBankAccount =
      process.env.DEMO_INSTRUCTOR_BANK_ACCOUNT_NUMBER || demoBankPool[1] || demoBankPool[0] || null;

    if (learnerBankAccount && instructorBankAccount === learnerBankAccount) {
      instructorBankAccount =
        demoBankPool.find((accountNumber) => accountNumber !== learnerBankAccount) ||
        instructorBankAccount;
    }

    await ensureRoleUser({
      RoleModel: Learner,
      role: 'Learner',
      email: process.env.DEMO_LEARNER_EMAIL || 'learner@demo.lms',
      password: process.env.DEMO_LEARNER_PASSWORD || 'learner123',
      userName: process.env.DEMO_LEARNER_USERNAME || 'demo_learner',
      fullName: process.env.DEMO_LEARNER_FULL_NAME || 'Demo Learner',
      shouldReset,
      bankAccountNumber: learnerBankAccount,
    });

    await ensureRoleUser({
      RoleModel: Instructor,
      role: 'Instructor',
      email: process.env.DEMO_INSTRUCTOR_EMAIL || 'instructor@demo.lms',
      password: process.env.DEMO_INSTRUCTOR_PASSWORD || 'instructor123',
      userName: process.env.DEMO_INSTRUCTOR_USERNAME || 'demo_instructor',
      fullName: process.env.DEMO_INSTRUCTOR_FULL_NAME || 'Demo Instructor',
      shouldReset,
      bankAccountNumber: instructorBankAccount,
    });
  } catch (error) {
    console.error('❌ Error ensuring demo users:', error);
  }
};



connectDb()
  .then(() => {
    app.listen(process.env.PORT || 5000, async () => {
      console.log(`port is listening at ${process.env.PORT || 5000}`);
      // Ensure admin bank account exists
      await ensureAdminBankAccount();
      // Ensure admin user exists
      await ensureAdminUser();
      // Ensure learner/instructor demo users exist
      await ensureDemoUsers();
    });
  })
  .catch((error) => {
    console.log("MongoDB connection failed", error);
  });
