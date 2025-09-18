CREATE TABLE "album_cover" (
	"id" serial PRIMARY KEY NOT NULL,
	"trackID" text NOT NULL,
	"imageURL" text NOT NULL,
	"publicID" text
);
--> statement-breakpoint
CREATE TABLE "sound_tracks" (
	"id" text PRIMARY KEY NOT NULL,
	"userID" text NOT NULL,
	"name" text NOT NULL,
	"description" text NOT NULL,
	"trackURL" text NOT NULL,
	"publicID" text NOT NULL,
	"albumCover" text NOT NULL
);
--> statement-breakpoint
ALTER TABLE "album_cover" ADD CONSTRAINT "album_cover_trackID_sound_tracks_id_fk" FOREIGN KEY ("trackID") REFERENCES "public"."sound_tracks"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sound_tracks" ADD CONSTRAINT "sound_tracks_userID_user_id_fk" FOREIGN KEY ("userID") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;