import { connectDB } from "@/lib/config/db";
import ToDoModel from "@/lib/models/todoModel";
import { NextResponse } from "next/server";

const LoadDB = async () => {
    await connectDB();
}

LoadDB();

export async function GET(request) {
    const todos = await ToDoModel.find({});
    return NextResponse.json({todos:todos})
}

export async function POST(request) {
    const {title,description} = await request.json();
    await ToDoModel.create({
        title,description
    })
    return NextResponse.json({msg: "ToDo Added"})
}

export async function DELETE(request) {
    const mongoId = await request.nextUrl.searchParams.get('mongoId');
    await ToDoModel.findByIdAndDelete(mongoId);
    return NextResponse.json({msg: "ToDo Deleted"})
}

export async function PUT(request) {
    const mongoId = await request.nextUrl.searchParams.get('mongoId');
    const action = await request.nextUrl.searchParams.get('action'); // Get the action type

    if (action === 'undo') {
        // Handle undo logic
        await ToDoModel.findByIdAndUpdate(mongoId, { $set: { isCompleted: false } });
        return NextResponse.json({ msg: "ToDo Marked as Pending" });
    } else {
        // Handle complete logic
        await ToDoModel.findByIdAndUpdate(mongoId, { $set: { isCompleted: true } });
        return NextResponse.json({ msg: "ToDo Completed" });
    }
}

