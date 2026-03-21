 
import { User, Customer } from "../models/index.js"; 
import sequelize from "../config/database.js";      
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { Op } from "sequelize";


const verificationStore = new Map();  

const registerUserAndCustomer = async (userData) => {
  const { email, password, first_name, last_name, phone, address } = userData; 
  const t = await sequelize.transaction();

  try {
 
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      throw new Error("This email address is already registered.");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      username: email.split('@')[0],  
      email: email,
      password: hashedPassword,
      role_id: 3
    }, { transaction: t });

    const newCustomer = await Customer.create({
      user_id: newUser.id, 
      first_name,
      last_name,
      phone,
      address, 
      is_phone_verified: 1  
    }, { transaction: t });

    await t.commit();
    
    verificationStore.delete(email);

    const token = jwt.sign(
      { 
        id: newUser.id, 
        role: "user",
        customer_id: newCustomer.id 
      },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    return { 
      user: { ...newUser.toJSON(), token }, 
      customer: newCustomer 
    };
  } catch (error) {
    await t.rollback();
    throw error;
  }
};

const loginUser = async (email, password) => {
  const user = await User.findOne({
    where: { email },
    include: [{ model: Customer }]
  });

  if (!user || !(await bcrypt.compare(password, user.password))) {
    throw new Error("The email address or password is incorrect.");
  }

  let roleName = "user"; 
  if (user.role_id === 1) roleName = "admin";
  else if (user.role_id === 2) roleName = "editor";

  const token = jwt.sign(
    { 
      id: user.id, 
      role: roleName,
      customer_id: user.Customer?.id || null 
    },
    process.env.JWT_SECRET,
    { expiresIn: '1d' }
  );

  const userJson = user.toJSON();
  delete userJson.password;

  return { 
    ...userJson, 
    role: roleName,
    token 
  }; 
};

const createVerificationCode = async (email) => {

  const existingUser = await User.findOne({ where: { email } });
  if (existingUser) {
    throw new Error("This email address is already registered.");
  }

  const code = Math.floor(100000 + Math.random() * 900000).toString();
  
  const expiresAt = Date.now() + 10 * 60 * 1000;
  
  verificationStore.set(email, { code, expiresAt });
  
  setTimeout(() => {
    if (verificationStore.has(email)) {
      const data = verificationStore.get(email);
      if (data.expiresAt <= Date.now()) {
        verificationStore.delete(email);
      }
    }
  }, 10 * 60 * 1000);
  
  return code;
};

const verifyCode = async (email, code) => {
  const data = verificationStore.get(email);
  
  if (!data) {
    throw new Error("The verification code for this email could not be found or has expired.");
  }

  if (data.code !== code) {
    throw new Error("Invalid verification code.");
  }

  if (data.expiresAt < Date.now()) {
    verificationStore.delete(email);
    throw new Error("Your verification code has expired. Request a new code.");
  }

  verificationStore.set(email, { ...data, verified: true });
  
  return { success: true };
};

const isEmailVerified = (email) => {
  const data = verificationStore.get(email);
  return data && data.verified === true;
};

export default {
  registerUserAndCustomer,
  loginUser,
  createVerificationCode,
  verifyCode,
  isEmailVerified
};