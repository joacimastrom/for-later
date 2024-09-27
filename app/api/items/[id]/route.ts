import { authOptions } from "@/lib/authOptions";
import connectDB from "@/lib/connectDB";
import User from "@/Model/User";
import { getServerSession } from "next-auth/next";
import { NextResponse } from "next/server";

export const DELETE = async (
  req: Request,
  { params }: { params: { id: string } }
) => {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = session.user?.id; // Make sure you have user id in session

  try {
    // Connect to the database
    await connectDB();

    // Find the user and check if the item exists in their items array
    const updatedUser = await User.findOneAndUpdate(
      { _id: userId },
      { $pull: { items: { _id: params.id } } },
      { new: true, projection: { items: 1 } }
    );

    // Check if the update succeeded and the item was removed
    if (!updatedUser) {
      return NextResponse.json(
        { error: "Item not found or does not belong to user" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Item deleted successfully", items: updatedUser.items },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting item:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
};
