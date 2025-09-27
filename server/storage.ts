import { type User, type InsertUser } from "@shared/schema";
import { randomUUID } from "crypto";
import session from "express-session";
import createMemoryStore from "memorystore";
import { MySQLStorage } from "./mysql-storage";

const MemoryStore = createMemoryStore(session);

// modify the interface with any CRUD methods
// you might need

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  sessionStore: session.Store & { destroy?: (sid: string, callback?: (err?: any) => void) => void };
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private nextId: number = 1;
  sessionStore: session.Store & { destroy?: (sid: string, callback?: (err?: any) => void) => void };

  constructor() {
    this.users = new Map();
    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000,
    });
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.nextId++;
    const user: User = { 
      ...insertUser, 
      id,
      dateOfBirth: insertUser.dateOfBirth // Already a string
    };
    this.users.set(id, user);
    return user;
  }
}

// Use MySQL storage in production, memory storage in development
export const storage = process.env.NODE_ENV === 'production' 
  ? new MySQLStorage() 
  : new MySQLStorage(); // Use MySQL for both dev and prod
