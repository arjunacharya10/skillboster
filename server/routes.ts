import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { generateChallenges } from "./openai";
import { 
  insertChallengeSchema, 
  challengeRequestSchema, 
  insertSavedChallengeSchema 
} from "@shared/schema";
import { ZodError } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Health check endpoint
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  // Generate challenges endpoint
  app.post("/api/challenges/generate", async (req, res) => {
    try {
      const validatedRequest = challengeRequestSchema.parse(req.body);
      
      // Check if OpenAI API key is available
      if (!process.env.OPENAI_API_KEY) {
        return res.status(500).json({ 
          message: "OpenAI API key is not available. Please set the OPENAI_API_KEY environment variable." 
        });
      }
      
      const generatedChallenges = await generateChallenges(validatedRequest);
      
      // Store generated challenges in the database
      const savedChallenges = await Promise.all(
        generatedChallenges.map(async (challenge) => {
          const validatedChallenge = insertChallengeSchema.parse(challenge);
          return await storage.createChallenge(validatedChallenge);
        })
      );
      
      res.json(savedChallenges);
    } catch (error) {
      if (error instanceof ZodError) {
        res.status(400).json({ message: "Invalid request data", errors: error.errors });
      } else if (error.message.includes("OpenAI")) {
        res.status(502).json({ message: `AI service error: ${error.message}` });
      } else {
        console.error("Error generating challenges:", error);
        res.status(500).json({ message: "Failed to generate challenges", error: error.message });
      }
    }
  });

  // Get all stored challenges
  app.get("/api/challenges", async (req, res) => {
    try {
      const challenges = await storage.getChallenges();
      res.json(challenges);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch challenges", error: error.message });
    }
  });

  // Get a specific challenge
  app.get("/api/challenges/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid challenge ID" });
      }
      
      const challenge = await storage.getChallenge(id);
      if (!challenge) {
        return res.status(404).json({ message: "Challenge not found" });
      }
      
      res.json(challenge);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch challenge", error: error.message });
    }
  });

  // Save a challenge for a user
  app.post("/api/challenges/:id/save", async (req, res) => {
    try {
      const challengeId = parseInt(req.params.id);
      const userId = 1; // For demo purposes, using a default user ID
      
      if (isNaN(challengeId)) {
        return res.status(400).json({ message: "Invalid challenge ID" });
      }
      
      const challenge = await storage.getChallenge(challengeId);
      if (!challenge) {
        return res.status(404).json({ message: "Challenge not found" });
      }
      
      const saveData = insertSavedChallengeSchema.parse({
        userId,
        challengeId,
        isCompleted: false
      });
      
      const savedChallenge = await storage.saveChallenge(saveData);
      res.json(savedChallenge);
    } catch (error) {
      if (error instanceof ZodError) {
        res.status(400).json({ message: "Invalid request data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to save challenge", error: error.message });
      }
    }
  });

  // Unsave a challenge for a user
  app.delete("/api/challenges/:id/save", async (req, res) => {
    try {
      const challengeId = parseInt(req.params.id);
      const userId = 1; // For demo purposes
      
      if (isNaN(challengeId)) {
        return res.status(400).json({ message: "Invalid challenge ID" });
      }
      
      const result = await storage.unsaveChallenge(userId, challengeId);
      if (!result) {
        return res.status(404).json({ message: "Saved challenge not found" });
      }
      
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ message: "Failed to unsave challenge", error: error.message });
    }
  });

  // Mark a challenge as complete/incomplete
  app.patch("/api/challenges/:id/complete", async (req, res) => {
    try {
      const challengeId = parseInt(req.params.id);
      const userId = 1; // For demo purposes
      
      if (isNaN(challengeId)) {
        return res.status(400).json({ message: "Invalid challenge ID" });
      }
      
      const { isCompleted } = req.body;
      if (typeof isCompleted !== "boolean") {
        return res.status(400).json({ message: "isCompleted must be a boolean" });
      }
      
      const updatedChallenge = await storage.markChallengeComplete(userId, challengeId, isCompleted);
      if (!updatedChallenge) {
        return res.status(404).json({ message: "Saved challenge not found" });
      }
      
      res.json(updatedChallenge);
    } catch (error) {
      res.status(500).json({ message: "Failed to update challenge status", error: error.message });
    }
  });

  // Get all saved challenges for a user
  app.get("/api/saved-challenges", async (req, res) => {
    try {
      const userId = 1; // For demo purposes
      const savedChallenges = await storage.getSavedChallenges(userId);
      res.json(savedChallenges);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch saved challenges", error: error.message });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
