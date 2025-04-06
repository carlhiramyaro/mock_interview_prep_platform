import { generateText } from "ai";
import { google } from "@ai-sdk/google";
import { getRandomInterviewCover } from "@/lib/utils";
import { db } from "@/firebase/admin";

export async function GET() {
  return Response.json({ success: true, data: "THANK YOU!" }, { status: 200 });
}

export async function POST(request: Request) {
  console.log("Received POST request to /api/vapi/generate");

  try {
    const { type, role, level, techstack, amount, userid } =
      await request.json();

    console.log("Request parameters:", {
      type,
      role,
      level,
      techstack,
      amount,
      userid,
    });

    if (!type || !role || !level || !techstack || !amount || !userid) {
      console.error("Missing required parameters:", {
        type,
        role,
        level,
        techstack,
        amount,
        userid,
      });
      return Response.json(
        { success: false, error: "Missing required parameters" },
        { status: 400 }
      );
    }

    console.log("Generating questions with Gemini...");
    const { text: questions } = await generateText({
      model: google("gemini-2.0-flash-001"),
      prompt: `Prepare questions for a job interview.
        The job role is ${role}.
        The job experience level is ${level}.
        The tech stack used in the job is: ${techstack}.
        The focus between behavioural and technical questions should lean towards: ${type}.
        The amount of questions required is: ${amount}.
        Please return only the questions, without any additional text.
        The questions are going to be read by a voice assistant so do not use "/" or "*" or any other special characters which might break the voice assistant.
        Return the questions formatted like this:
        ["Question 1", "Question 2", "Question 3"]
        
        Thank you! <3
    `,
    });

    console.log("Questions generated:", questions);

    let parsedQuestions;
    try {
      parsedQuestions = JSON.parse(questions);
      if (!Array.isArray(parsedQuestions)) {
        throw new Error("Questions not in array format");
      }
    } catch (error) {
      console.error("Failed to parse questions:", questions);
      console.error("Parse error:", error);
      return Response.json(
        { success: false, error: "Failed to parse generated questions" },
        { status: 500 }
      );
    }

    const interview = {
      role,
      type,
      level,
      techstack: techstack.split(","),
      questions: parsedQuestions,
      userId: userid,
      finalized: true,
      coverImage: getRandomInterviewCover(),
      createdAt: new Date().toISOString(),
    };

    console.log("Saving interview to Firebase:", interview);

    try {
      const docRef = await db.collection("interviews").add(interview);
      console.log("Interview saved successfully with ID:", docRef.id);
      return Response.json(
        { success: true, interviewId: docRef.id },
        { status: 200 }
      );
    } catch (error) {
      console.error("Failed to save to Firebase:", error);
      return Response.json(
        { success: false, error: "Failed to save interview to database" },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Error in /api/vapi/generate:", error);
    return Response.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Internal server error",
      },
      { status: 500 }
    );
  }
}
