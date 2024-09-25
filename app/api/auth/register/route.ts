// /pages/api/auth/register.js
import connectDB from "@/lib/connectDB";
import User from "@/Model/User";
import bcrypt from "bcrypt";

export const POST = async (request: Request) => {
  const body = await request.json();

  const { email, password, name } = body;

  if (!email || !password || !name) {
    return new Response("Missing required fields", { status: 500 });
  }

  try {
    await connectDB();

    // Check if the user already exists
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return new Response("User already exists", { status: 400 });
    }
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Save the new user to the database
    const newUser = await User.create({
      email,
      password: hashedPassword, // Save the hashed password
      name,
      createdAt: new Date(),
    });

    return Response.json(newUser);
  } catch (error) {
    console.error("Error registering user:", error);
    return new Response("Internal server error", { status: 500 });
  }
};
