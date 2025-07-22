
"use client";

import { db, storage } from "./firebase";
import { doc, getDoc, updateDoc, serverTimestamp, Timestamp, collection, addDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import type { UserData } from "@/hooks/use-auth";

// Helper function to check if two Timestamps are on the same day
const isSameDay = (d1: Timestamp, d2: Date) => {
    const date1 = d1.toDate();
    return date1.getFullYear() === d2.getFullYear() &&
           date1.getMonth() === d2.getMonth() &&
           date1.getDate() === d2.getDate();
};

/**
 * Checks AI usage limits and records a new action if allowed.
 * @param uid The user's UID.
 * @param actionType The type of action ('analyze' or 'enhance').
 * @returns An object { allowed: boolean, reason?: string, infoMessage?: string }.
 */
export const checkAndRecordAction = async (
  uid: string,
  actionType: 'analyze' | 'enhance'
): Promise<{ allowed: boolean; reason?: string; infoMessage?: string }> => {
  const DAILY_LIMIT = 20; // New daily limit
  const userDocRef = doc(db, "users", uid);
  const today = new Date();

  try {
    const userDoc = await getDoc(userDocRef);
    if (!userDoc.exists()) {
      return { allowed: false, reason: "User data not found." };
    }

    const userData = userDoc.data() as UserData;

    // BYPASS: Allow unlimited AI usage for this email
    if (userData.email && userData.email.toLowerCase() === "nikhileshatal@gmail.com") {
      return { allowed: true };
    }

    // 1. Check if user is currently blocked
    if (userData.blockedUntil && userData.blockedUntil.toDate() > today) {
      return {
        allowed: false,
        reason: `Your access to AI features is temporarily blocked. Please try again after ${userData.blockedUntil.toDate().toLocaleString()}.`,
      };
    }

    let currentUsageCount = userData.aiUsageCount;

    // 2. Reset usage count if last usage was not today
    if (userData.lastUsageDate && !isSameDay(userData.lastUsageDate, today)) {
      currentUsageCount = 0;
    }

    let updates: any = {};

    // 3. Increment usage count and update last usage date
    currentUsageCount++;
    updates.aiUsageCount = currentUsageCount;
    updates.lastUsageDate = serverTimestamp();

    // 4. Block user for 24-36 hours after reaching the daily limit
    let infoMessage: string | undefined = undefined;
    if (currentUsageCount >= DAILY_LIMIT) {
      // Block for 24-36 hours (randomized)
      const blockHours = 24 + Math.floor(Math.random() * 13); // 24-36 hours
      const blockUntil = new Date();
      blockUntil.setHours(blockUntil.getHours() + blockHours);
      updates.blockedUntil = Timestamp.fromDate(blockUntil);
    }

    // 5. Update Firestore
    await updateDoc(userDocRef, updates);

    // 6. Show info message after every 5th call (5, 10, 15, 20)
    if (currentUsageCount % 5 === 0 && currentUsageCount <= DAILY_LIMIT) {
      infoMessage = `You've used AI ${currentUsageCount}/${DAILY_LIMIT} times today.`;
    }

    // 7. Final check: block if limit reached
    if (currentUsageCount > DAILY_LIMIT) {
      return {
        allowed: false,
        reason: `You have reached your daily AI usage limit. Please try again after your block period ends.`,
      };
    }

    return { allowed: true, infoMessage };
  } catch (error) {
    console.error("Error checking/recording AI action:", error);
    return {
      allowed: false,
      reason: "An internal error occurred while validating your request.",
    };
  }
};

/**
 * Extracts project ideas from resume text using a simple regex or keyword-based approach.
 * @param resumeText The text content of the resume.
 * @returns An array of project ideas (strings).
 */
export function extractProjectsFromResume(resumeText: string): string[] {
    // Simple heuristic: look for lines containing 'project', 'projects', or similar
    // You can improve this logic as needed
    const lines = resumeText.split(/\r?\n/);
    const projectLines = lines.filter(line =>
        /project[s]?:?/i.test(line)
    );
    // Optionally, clean up the project lines
    return projectLines.map(line => line.trim()).filter(Boolean);
}

/**
 * Stores extracted projects in the 'job' collection in Firestore.
 * @param projects Array of project idea strings.
 */
export async function storeProjectsInFirestore(projects: string[]): Promise<void> {
    if (!projects || projects.length === 0) return;
    try {
        await addDoc(collection(db, "job"), {
            projects: projects,
            createdAt: serverTimestamp(),
        });
    } catch (error) {
        console.error("Error storing projects in Firestore:", error);
    }
}

/**
 * Uploads a resume file to Firebase Storage and updates the user's Firestore document.
 * We use both services for their strengths:
 * 1. Firebase Storage: Efficiently stores large, binary files (like a PDF or DOCX resume).
 * 2. Firestore: Stores a simple text link (URL) to the file in the user's data document.
 * This is the standard, most efficient pattern for handling file uploads with Firebase.
 * @param uid The user's UID.
 * @param file The resume file to upload.
 */
export const uploadResume = async (uid: string, file: File): Promise<void> => {
    if (!uid || !file) {
        throw new Error("User ID and file are required for upload.");
    }
    
    const storageRef = ref(storage, `Resume/${uid}/${file.name}`);
    
    // Upload the file to Firebase Storage
    await uploadBytes(storageRef, file);
    
    // Get the download URL from Storage
    const downloadURL = await getDownloadURL(storageRef);

    // Update the user's document in Firestore with the URL link
    const userDocRef = doc(db, "users", uid);
    await updateDoc(userDocRef, {
        resumeURL: downloadURL
    });

    // Try to extract and store projects if the file is a text file
    if (file.type === 'text/plain') {
        const text = await file.text();
        const projects = extractProjectsFromResume(text);
        await storeProjectsInFirestore(projects);
    }
};
