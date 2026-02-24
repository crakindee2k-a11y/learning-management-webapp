#!/usr/bin/env node
import dotenv from 'dotenv'
import mongoose from 'mongoose'
import { Admin } from '../model/Admin.model.js'
import { User } from '../model/user.model.js'

dotenv.config({ path: new URL('../.env', import.meta.url) })

const DB_NAME = 'lms'
const mongoUrl = process.env.MONGODB_URL ? `${process.env.MONGODB_URL}/${DB_NAME}` : null

if (!mongoUrl) {
  console.error('MONGODB_URL is missing; cannot seed admin')
  process.exit(1)
}

const adminEmail = process.env.ADMIN_EMAIL || 'admin@lms.com'
const adminPassword = process.env.ADMIN_PASSWORD || 'admin123'
const adminUserName = process.env.ADMIN_USERNAME || 'admin'
const adminFullName = process.env.ADMIN_FULL_NAME || 'System Admin'

const adminPayload = {
  fullName: adminFullName,
  userName: adminUserName,
  email: adminEmail,
  password: adminPassword,
  role: 'Admin',
}

const upsertAdmin = async () => {
  await mongoose.connect(mongoUrl)

  const existingAdmin = await Admin.findOne({ role: 'Admin' })
  if (existingAdmin) {
    Object.assign(existingAdmin, adminPayload)
    await existingAdmin.save()
    console.log(`✅ Admin updated: ${adminEmail}`)
    return
  }

  const existingUser = await User.findOne({
    $or: [{ email: adminEmail }, { userName: adminUserName }],
  })
  if (existingUser) {
    Object.assign(existingUser, adminPayload)
    existingUser.role = 'Admin'
    await existingUser.save()
    console.log(`✅ User promoted to admin: ${adminEmail}`)
    return
  }

  await Admin.create(adminPayload)
  console.log(`✅ Admin created: ${adminEmail}`)
}

try {
  await upsertAdmin()
} catch (error) {
  console.error('❌ Admin seed failed:', error)
  process.exitCode = 1
} finally {
  await mongoose.disconnect()
}
