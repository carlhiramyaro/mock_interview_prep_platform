import { db } from "@/firebase/admin";
import { createInterview, createFeedback } from "@/lib/actions/general.action";

interface TranscriptMessage {
  role: string;
  content: string;
}

export async function POST(request: Request) {
  try {
    const { userId, transcript, type } = await request.json();
    console.log("Received feedback request:", {
      userId,
      type,
      transcriptLength: transcript?.length,
    });

    if (!userId || !transcript || !type) {
      console.log("Missing required fields:", {
        userId: !!userId,
        transcript: !!transcript,
        type: !!type,
      });
      return Response.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    // First create the interview
    console.log("Creating interview...");
    const {
      success: interviewSuccess,
      interviewId,
      error: interviewError,
    } = await createInterview({
      userId,
      type,
      questions: transcript.map((msg: TranscriptMessage) => msg.content),
    });
    console.log("Interview creation result:", {
      success: interviewSuccess,
      interviewId,
      error: interviewError,
    });

    if (!interviewSuccess || !interviewId) {
      return Response.json(
        {
          success: false,
          error: interviewError || "Failed to create interview",
        },
        { status: 500 }
      );
    }

    // Then create the feedback with the transcript
    console.log("Creating feedback...");
    const { success: feedbackSuccess, error: feedbackError } =
      await createFeedback({
        interviewId,
        userId,
        transcript,
      });
    console.log("Feedback creation result:", {
      success: feedbackSuccess,
      error: feedbackError,
    });

    if (!feedbackSuccess) {
      return Response.json(
        { success: false, error: feedbackError || "Failed to create feedback" },
        { status: 500 }
      );
    }

    return Response.json({ success: true, interviewId }, { status: 200 });
  } catch (error) {
    console.error("Error in feedback route:", error);
    return Response.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
