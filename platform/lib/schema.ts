import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { relations, sql } from 'drizzle-orm';

/**
 * Teams table schema
 */
export const teams = sqliteTable('teams', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull().unique(),
  password: text('password').notNull(),
  score: integer('score').notNull().default(0),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().default(sql`(strftime('%s', 'now'))`),
});

/**
 * Members table schema
 */
export const members = sqliteTable('members', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  teamId: integer('team_id').references(() => teams.id, { onDelete: 'cascade' }),
  isLeader: integer('is_leader', { mode: 'boolean' }).notNull().default(false),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().default(sql`(strftime('%s', 'now'))`),
});

/**
 * Team relations
 */
export const teamsRelations = relations(teams, ({ many }) => ({
  members: many(members),
  solves: many(solves),
}));

/**
 * Member relations
 */
export const membersRelations = relations(members, ({ one }) => ({
  team: one(teams, {
    fields: [members.teamId],
    references: [teams.id],
  }),
}));

/**
 * Challenges table schema
 */
export const challenges = sqliteTable('challenges', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  title: text('title').notNull().unique(),
  description: text('description').notNull(),
  flag: text('flag').notNull(),
  category: text('category').notNull(),
  points: integer('points').notNull().default(100),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().default(sql`(strftime('%s', 'now'))`),
});

/**
 * Challenge relations
 */
export const challengesRelations = relations(challenges, ({ many }) => ({
  solves: many(solves),
}));

/**
 * Solves table to track which teams have solved which challenges
 */
export const solves = sqliteTable('solves', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  teamId: integer('team_id').references(() => teams.id, { onDelete: 'cascade' }).notNull(),
  challengeId: integer('challenge_id').references(() => challenges.id, { onDelete: 'cascade' }).notNull(),
  solvedAt: integer('solved_at', { mode: 'timestamp' }).notNull().default(sql`(strftime('%s', 'now'))`),
});

/**
 * Solves relations
 */
export const solvesRelations = relations(solves, ({ one }) => ({
  team: one(teams, {
    fields: [solves.teamId],
    references: [teams.id],
  }),
  challenge: one(challenges, {
    fields: [solves.challengeId],
    references: [challenges.id],
  }),
})); 