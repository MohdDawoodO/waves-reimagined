import {
  timestamp,
  pgTable,
  text,
  primaryKey,
  integer,
  serial,
  pgEnum,
  real,
  boolean,
} from "drizzle-orm/pg-core";
import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";
import type { AdapterAccountType } from "@auth/core/adapters";
import { relations } from "drizzle-orm";

const connectionString = process.env.DATABASE_URL!;
const sql = postgres(connectionString);

export const db = drizzle(sql);

export const visibilityEnum = pgEnum("visibility", [
  "private",
  "unlisted",
  "public",
]);

export const rolesEnum = pgEnum("role", ["user", "admin"]);

export const users = pgTable("user", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: text("name"),
  handle: text("handle").unique(),
  email: text("email").unique(),
  emailVerified: timestamp("emailVerified", { mode: "date" }),
  image: text("image"),
  role: rolesEnum().default("user"),
  password: text("password"),
  profileDescription: text("profileDescription"),
});

export const userRelations = relations(users, ({ one, many }) => ({
  user_avatar: one(userAvatars, {
    fields: [users.id],
    references: [userAvatars.userID],
    relationName: "user_avatar",
  }),
  user_tracks: many(soundTracks, { relationName: "user_track" }),
}));

export const accounts = pgTable(
  "account",
  {
    userId: text("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    type: text("type").$type<AdapterAccountType>().notNull(),
    provider: text("provider").notNull(),
    providerAccountId: text("providerAccountId").notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: integer("expires_at"),
    token_type: text("token_type"),
    scope: text("scope"),
    id_token: text("id_token"),
    session_state: text("session_state"),
  },
  (account) => [
    {
      compoundKey: primaryKey({
        columns: [account.provider, account.providerAccountId],
      }),
    },
  ]
);

export const verificationTokens = pgTable("verification_token", {
  id: serial("id").primaryKey(),
  token: text("token").notNull(),
  email: text("email")
    .notNull()
    .references(() => users.email, { onDelete: "cascade" }),
  expires: timestamp("expires").notNull(),
});

export const twoFactorCodes = pgTable("two_factor_code", {
  id: serial("id").primaryKey(),
  code: text("code").notNull(),
  email: text("email")
    .notNull()
    .references(() => users.email, { onDelete: "cascade" }),
  expires: timestamp("expires").notNull(),
});

export const userAvatars = pgTable("user_avatar", {
  id: serial("id").primaryKey(),
  userID: text("userID")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),

  imageURL: text("imageURL").notNull(),
  publicID: text("publicID").notNull(),
});

export const userAvatarRelations = relations(userAvatars, ({ one }) => ({
  user: one(users, {
    fields: [userAvatars.userID],
    references: [users.id],
    relationName: "user_avatar",
  }),
}));

export const soundTracks = pgTable("sound_track", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  userID: text("userID")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  trackName: text("name").notNull(),
  description: text("description").notNull(),
  duration: real("duration").notNull(),
  trackURL: text("trackURL").notNull(),
  publicID: text("publicID").notNull(),
  visibility: visibilityEnum().default("public"),
  uploadedOn: timestamp("uploadedOn").notNull().defaultNow(),
  likes: real("likes").notNull().default(0),
});

export const soundTrackRelations = relations(soundTracks, ({ one, many }) => ({
  user: one(users, {
    fields: [soundTracks.userID],
    references: [users.id],
    relationName: "user_track",
  }),
  albumCover: one(albumCovers, {
    fields: [soundTracks.id],
    references: [albumCovers.trackID],
    relationName: "album_cover",
  }),
  trackTags: many(trackTags, { relationName: "track_tag" }),
}));

export const albumCovers = pgTable("album_cover", {
  id: serial("id").primaryKey(),
  trackID: text("trackID")
    .notNull()
    .references(() => soundTracks.id, { onDelete: "cascade" }),
  imageURL: text("imageURL").notNull(),
  publicID: text("publicID").notNull(),
});

export const trackTags = pgTable("track_tags", {
  id: serial("id").primaryKey(),
  trackID: text("trackID")
    .notNull()
    .references(() => soundTracks.id, { onDelete: "cascade" }),
  tag: text("tag").notNull(),
});

export const trackTagRelations = relations(trackTags, ({ one }) => ({
  soundTrack: one(soundTracks, {
    fields: [trackTags.trackID],
    references: [soundTracks.id],
    relationName: "track_tag",
  }),
}));

export const likes = pgTable("likes", {
  id: serial("id").primaryKey(),
  userID: text("userID")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  trackID: text("trackID")
    .notNull()
    .references(() => soundTracks.id, { onDelete: "cascade" }),
});

export const likeRelations = relations(likes, ({ one }) => ({
  soundTrack: one(soundTracks, {
    fields: [likes.trackID],
    references: [soundTracks.id],
    relationName: "track_like",
  }),
}));

export const playlists = pgTable("playlist", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  userID: text("userID")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  description: text("description").notNull(),
  visibility: visibilityEnum().notNull().default("public"),
  tracks: real("tracks").notNull().default(0),
  editable: boolean("editable").notNull().default(false),
});

export const playlistRelations = relations(playlists, ({ one, many }) => ({
  user: one(users, {
    fields: [playlists.userID],
    references: [users.id],
    relationName: "playlist_user",
  }),
  playlistTracks: many(playlistTracks, {
    relationName: "playlist_track",
  }),
}));

export const playlistTracks = pgTable("playlistTrack", {
  id: serial("id").primaryKey(),
  playlistID: text("playlistID")
    .notNull()
    .references(() => playlists.id, { onDelete: "cascade" }),
  trackID: text("trackID")
    .notNull()
    .references(() => soundTracks.id, { onDelete: "cascade" }),
});

export const playlistTrackRelations = relations(playlistTracks, ({ one }) => ({
  playlist: one(playlists, {
    fields: [playlistTracks.playlistID],
    references: [playlists.id],
    relationName: "playlist_track",
  }),
  track: one(soundTracks, {
    fields: [playlistTracks.trackID],
    references: [soundTracks.id],
    relationName: "playlist_content",
  }),
}));
