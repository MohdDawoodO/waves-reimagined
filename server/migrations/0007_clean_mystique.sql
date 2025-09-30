CREATE TYPE "public"."role" AS ENUM('user', 'admin');--> statement-breakpoint
CREATE TABLE "likes" (
	"id" serial PRIMARY KEY NOT NULL,
	"userID" text NOT NULL,
	"trackID" text NOT NULL
);
--> statement-breakpoint
ALTER TABLE "album_cover" ALTER COLUMN "publicID" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "user_avatar" ALTER COLUMN "publicID" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "sound_track" ADD COLUMN "likes" real DEFAULT 0;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "role" "role" DEFAULT 'user';--> statement-breakpoint
ALTER TABLE "likes" ADD CONSTRAINT "likes_userID_user_id_fk" FOREIGN KEY ("userID") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "likes" ADD CONSTRAINT "likes_trackID_sound_track_id_fk" FOREIGN KEY ("trackID") REFERENCES "public"."sound_track"("id") ON DELETE cascade ON UPDATE no action;