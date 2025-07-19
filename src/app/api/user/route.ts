import dbConnect from "../../../lib/mongodb";
import User from "../../../models/user";

export async function GET(req: Request) {
  try {
    await dbConnect();
    const userList = await User.find();

    console.log(userList);

    return Response.json({ users: userList });
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    return Response.error();
  }
}

export async function POST(req: Request) {
  try {
    await dbConnect();
    const body = await req.json();
    const newUser = new User(body);
    newUser.save();
    return Response.json({ user: newUser });
  } catch (error) {
    console.error("Failed to create user", error);
    return Response.error();
  }
}
