import dbConnect from "@/lib/mongodb";
import User from "@/models/user";

export async function POST(req: Request) {
  try {
    await dbConnect();
    const body = await req.json();
    const newUser = new User(body);
    await newUser.save();

    console.log("Saved user:", newUser);
    return Response.json({ user: newUser }, { status: 201 });
  } catch (error) {
    console.error("Failed to create user", error);
    return Response.error();
  }
}
