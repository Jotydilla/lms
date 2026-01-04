import bcrypt from "bcrypt";
import User from "../../models/User.js";

const generateVerification = () => {
  const code = Math.floor(100000 + Math.random() * 900000).toString();
  const expires = new Date(Date.now() + 10 * 60 * 1000);
  return { code, expires };
};
export const addUser = async (c) => {
  try {
    let body;
    try {
      body = await c.req.json();
    } catch (err) {
      return c.json({ error: "Invalid JSON body" }, 400);
    }
    let { phone, password } = body;

    if (!phone || !password) {
      return c.json({ error: "Phone and password are required" }, 400);
    }
    const { code, expires } = generateVerification();

    const errors = [];
    if (!phone || !/^[0-9]{9,15}$/.test(phone)) errors.push("Invalid phone");
    if (!password || password.trim() === "") errors.push("Password required");

    if (errors.length > 0)
      return c.json({ error: "Validation failed", details: errors }, 400);

    password = String(password).trim();
    if (password.length === 0) {
      return c.json({ error: "Password cannot be empty" }, 400);
    }
    const existingUser = await User.findOne({ where: { phone } });
    if (existingUser) {
      return c.json({ error: "User already exists" }, 409);
    }
    const hashed = await bcrypt.hash(password, 10);
    await User.create({
      phone,
      password: hashed,
      verificationCode: code,
      verificationExpires: expires,
      lastChangePassword: new Date(),
    });
    const user = await User.findOne({ where: { phone } });
    return c.json(
      {
        message: "register successfully!!",
        id: user.publicId,
      },
      200
    );
  } catch (err) {
    console.log("error", err);
    return c.json({ error: "Internal server error" }, 500);
  }
};
