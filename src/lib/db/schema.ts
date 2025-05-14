import { boolean, foreignKey, integer, jsonb, pgEnum, pgTable, serial, text, timestamp, varchar } from "drizzle-orm/pg-core";

// Enum for badge types
export const badgeTypeEnum = pgEnum("badge_type", ["letter_completion", "number_completion", "practice_streak"]);

// Users table - stores user information and authentication
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  pin: varchar("pin", { length: 4 }).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  points: integer("points").default(0).notNull(),
  isActive: boolean("is_active").default(true).notNull(),
});

// Enum for the type of learning content
export const contentTypeEnum = pgEnum("content_type", ["letter", "number"]);

// Learning content table - stores letters and numbers
export const learningContent = pgTable("learning_content", {
  id: serial("id").primaryKey(),
  type: contentTypeEnum("type").notNull(),
  content: text("content").notNull(), // The actual letter or number
  displayOrder: integer("display_order").notNull(),
  variants: jsonb("variants"), // Different forms of the letter (start, middle, end)
  exampleWords: jsonb("example_words"), // Example words with this letter, but for number may be null
  audio: text("audio"), // Path or URL to audio file
  imageUrl: text("image_url"), // Optional image 
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  isActive: boolean("is_active").default(true).notNull(),
});

// User progress tracking
export const userProgress = pgTable("user_progress", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  contentId: integer("content_id").notNull().references(() => learningContent.id, { onDelete: "cascade" }),
  completed: boolean("completed").default(false).notNull(),
  correctAttempts: integer("correct_attempts").default(0).notNull(),
  totalAttempts: integer("total_attempts").default(0).notNull(),
  lastAttemptAt: timestamp("last_attempt_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// User badges
export const badges = pgTable("badges", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  imageUrl: text("image_url").notNull(),
  type: badgeTypeEnum("type").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// User earned badges
export const userBadges = pgTable("user_badges", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  badgeId: integer("badge_id").notNull().references(() => badges.id, { onDelete: "cascade" }),
  earnedAt: timestamp("earned_at").defaultNow().notNull(),
});

// Exercises table
export const exercises = pgTable("exercises", {
  id: serial("id").primaryKey(),
  contentId: integer("content_id").notNull().references(() => learningContent.id, { onDelete: "cascade" }),
  type: text("type").notNull(), // pronunciation, identification
  instructions: text("instructions").notNull(),
  data: jsonb("data"), // Exercise specific data
  points: integer("points").default(10).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  isActive: boolean("is_active").default(true).notNull(),
});

// User exercise attempts
export const userExerciseAttempts = pgTable("user_exercise_attempts", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  exerciseId: integer("exercise_id").notNull().references(() => exercises.id, { onDelete: "cascade" }),
  successful: boolean("successful").default(false).notNull(),
  pointsEarned: integer("points_earned").default(0).notNull(),
  attemptedAt: timestamp("attempted_at").defaultNow().notNull(),
});
