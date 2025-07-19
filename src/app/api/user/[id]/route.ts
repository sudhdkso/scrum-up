import dbConnect from "@/lib/mongodb";
import User from "@/models/user";

export async function GET(req: Request, context: { params: { id: string } }) {
  try {
    await dbConnect();
    const id = context.params.id;
    const user = await User.findById(id);
    if (!user) {
      return new Response("User not found", { status: 400 });
    }
    return new Response(JSON.stringify(user), { status: 200 });
  } catch (error) {
    console.error("Failed to find user by id", error);
    return Response.error();
  }
}
