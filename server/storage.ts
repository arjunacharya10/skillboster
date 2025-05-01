import { 
  type User, 
  type InsertUser, 
  type Challenge, 
  type InsertChallenge, 
  type SavedChallenge, 
  type InsertSavedChallenge
} from "@shared/schema";

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Challenge methods
  getChallenges(): Promise<Challenge[]>;
  getChallenge(id: number): Promise<Challenge | undefined>;
  createChallenge(challenge: InsertChallenge): Promise<Challenge>;
  
  // Saved challenge methods
  getSavedChallenges(userId: number): Promise<(SavedChallenge & { challenge: Challenge })[]>;
  saveChallenge(savedChallenge: InsertSavedChallenge): Promise<SavedChallenge>;
  unsaveChallenge(userId: number, challengeId: number): Promise<boolean>;
  markChallengeComplete(userId: number, challengeId: number, isCompleted: boolean): Promise<SavedChallenge | undefined>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private challenges: Map<number, Challenge>;
  private savedChallenges: Map<number, SavedChallenge>;
  private currentUserId: number;
  private currentChallengeId: number;
  private currentSavedChallengeId: number;

  constructor() {
    this.users = new Map();
    this.challenges = new Map();
    this.savedChallenges = new Map();
    this.currentUserId = 1;
    this.currentChallengeId = 1;
    this.currentSavedChallengeId = 1;
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  // Challenge methods
  async getChallenges(): Promise<Challenge[]> {
    return Array.from(this.challenges.values());
  }

  async getChallenge(id: number): Promise<Challenge | undefined> {
    return this.challenges.get(id);
  }

  async createChallenge(challenge: InsertChallenge): Promise<Challenge> {
    const id = this.currentChallengeId++;
    const now = new Date();
    const newChallenge: Challenge = { ...challenge, id, createdAt: now };
    this.challenges.set(id, newChallenge);
    return newChallenge;
  }

  // Saved challenge methods
  async getSavedChallenges(userId: number): Promise<(SavedChallenge & { challenge: Challenge })[]> {
    const savedChallenges = Array.from(this.savedChallenges.values()).filter(
      (sc) => sc.userId === userId
    );
    
    return savedChallenges.map(sc => {
      const challenge = this.challenges.get(sc.challengeId);
      if (!challenge) {
        throw new Error(`Challenge with id ${sc.challengeId} not found`);
      }
      return { ...sc, challenge };
    });
  }

  async saveChallenge(savedChallenge: InsertSavedChallenge): Promise<SavedChallenge> {
    // Check if already saved
    const existing = Array.from(this.savedChallenges.values()).find(
      (sc) => sc.userId === savedChallenge.userId && sc.challengeId === savedChallenge.challengeId
    );
    
    if (existing) {
      return existing;
    }
    
    const id = this.currentSavedChallengeId++;
    const now = new Date();
    const newSavedChallenge: SavedChallenge = { ...savedChallenge, id, createdAt: now };
    this.savedChallenges.set(id, newSavedChallenge);
    return newSavedChallenge;
  }

  async unsaveChallenge(userId: number, challengeId: number): Promise<boolean> {
    const savedChallengeEntry = Array.from(this.savedChallenges.entries()).find(
      ([_, sc]) => sc.userId === userId && sc.challengeId === challengeId
    );
    
    if (savedChallengeEntry) {
      this.savedChallenges.delete(savedChallengeEntry[0]);
      return true;
    }
    
    return false;
  }

  async markChallengeComplete(userId: number, challengeId: number, isCompleted: boolean): Promise<SavedChallenge | undefined> {
    const savedChallengeEntry = Array.from(this.savedChallenges.entries()).find(
      ([_, sc]) => sc.userId === userId && sc.challengeId === challengeId
    );
    
    if (savedChallengeEntry) {
      const [id, savedChallenge] = savedChallengeEntry;
      const updatedChallenge = { ...savedChallenge, isCompleted };
      this.savedChallenges.set(id, updatedChallenge);
      return updatedChallenge;
    }
    
    return undefined;
  }
}

export const storage = new MemStorage();
