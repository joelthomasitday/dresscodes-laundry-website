import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { RiderTask } from "@/models/RiderTask";
import { getCurrentUser } from "@/lib/auth";

/**
 * PATCH /api/rider-tasks/[id] — Update rider task status
 */
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const body = await req.json();
    const task = await RiderTask.findById(id);

    if (!task) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 });
    }

    // Riders can only update their own tasks
    if (user.role === "rider" && task.riderId.toString() !== user.userId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    if (body.status) {
      task.status = body.status;
      if (body.status === "completed") {
        task.completedTime = new Date();
      }
    }
    if (body.proofImageUrl) task.proofImageUrl = body.proofImageUrl;
    if (body.notes !== undefined) task.notes = body.notes;

    await task.save();

    return NextResponse.json({ success: true, task });
  } catch (error: any) {
    console.error("PATCH /api/rider-tasks/[id] error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
