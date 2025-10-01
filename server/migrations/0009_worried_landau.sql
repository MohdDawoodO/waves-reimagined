CREATE TABLE "playlistTrack" (
	"id" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "playlist" (
	"id" text PRIMARY KEY NOT NULL,
	"userID" text NOT NULL,
	"name" text NOT NULL,
	"description" text NOT NULL,
	"visibility" "visibility" DEFAULT 'public' NOT NULL,
	"tracks" real DEFAULT 0 NOT NULL
);
--> statement-breakpoint
ALTER TABLE "playlistTrack" ADD CONSTRAINT "playlistTrack_id_playlist_id_fk" FOREIGN KEY ("id") REFERENCES "public"."playlist"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "playlistTrack" ADD CONSTRAINT "playlistTrack_id_sound_track_id_fk" FOREIGN KEY ("id") REFERENCES "public"."sound_track"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "playlist" ADD CONSTRAINT "playlist_userID_user_id_fk" FOREIGN KEY ("userID") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;