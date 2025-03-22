"use server";

import { db } from "@/firebase/admin";

export async function createInterview({
  userId,
  type,
  questions,
}: {
  userId: string;
  type: string;
  questions: string[];
}) {
  try {
    const interview = {
      userId,
      type,
      questions,
      createdAt: new Date().toISOString(),
      finalized: false,
      role: "Senior Frontend Developer", // We can make this dynamic later
      level: "senior",
      techstack: ["React", "Next.js", "TypeScript"], // We can make this dynamic later
    };

    const interviewRef = await db.collection("interviews").add(interview);
    return { success: true, interviewId: interviewRef.id };
  } catch (error) {
    console.error("Error creating interview:", error);
    return { success: false, error: "Failed to save interview" };
  }
}

export async function createFeedback({
  interviewId,
  userId,
  transcript,
  feedbackId,
}: CreateFeedbackParams) {
  try {
    // If feedbackId is provided, update existing feedback
    if (feedbackId) {
      await db.collection("feedback").doc(feedbackId).update({
        transcript,
        updatedAt: new Date().toISOString(),
      });

      return { success: true, feedbackId };
    }

    // Create new feedback document
    const feedbackRef = await db.collection("feedback").add({
      interviewId,
      userId,
      transcript,
      createdAt: new Date().toISOString(),
      status: "pending", // Can be used to track feedback generation status
    });

    return { success: true, feedbackId: feedbackRef.id };
  } catch (error) {
    console.error("Error creating/updating feedback:", error);
    return { success: false, error: "Failed to save feedback" };
  }
}

export async function getInterviewsByUserId(userId: string) {
  try {
    const interviews = await db
      .collection("interviews")
      .where("userId", "==", userId)
      .orderBy("createdAt", "desc")
      .get();

    return interviews.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Interview[];
  } catch (error) {
    console.error("Error fetching interviews:", error);
    return [];
  }
}

export async function getLatestInterviews({
  userId,
  limit = 10,
}: GetLatestInterviewsParams) {
  try {
    const interviews = await db
      .collection("interviews")
      .where("userId", "==", userId)
      .orderBy("createdAt", "desc")
      .limit(limit)
      .get();

    return interviews.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Interview[];
  } catch (error) {
    console.error("Error fetching latest interviews:", error);
    return [];
  }
}
