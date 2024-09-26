import { authOptions } from "@/lib/authOptions";
import connectDB from "@/lib/connectDB";
import User from "@/Model/User";
import { getServerSession } from "next-auth/next";

export const POST = async (request: Request, response: Response) => {
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
    { $push: { savedData: body } },
    { new: true }
  );
  return Response.json(user.savedData);
};
