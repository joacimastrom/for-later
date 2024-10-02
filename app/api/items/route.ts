import { authOptions } from "@/lib/authOptions";
import connectDB from "@/lib/connectDB";
import User from "@/Model/User";
import { getServerSession } from "next-auth/next";
import { NextResponse } from "next/server";

export const GET = async () => {
  const session = await getServerSession(authOptions);
  if (!session) {
    return new Response(JSON.stringify({ message: "Not authenticated" }), {
      status: 401,
    });
  }

  const user = await User.findById(session.user.id).select("items").lean();

  return NextResponse.json(user.items.reverse());
};

export const POST = async (request: Request) => {
  await connectDB();
  const session = await getServerSession(authOptions);

  if (!session) {
    return new Response(JSON.stringify({ message: "Not authenticated" }), {
      status: 401,
    });
  }

  const body = await request.json();

  const user = await User.findByIdAndUpdate(
    { _id: session.user.id },
    { $push: { items: body } },
    { new: true }
  )
    .select("items")
    .lean();
  return Response.json(user.items.reverse());
};
