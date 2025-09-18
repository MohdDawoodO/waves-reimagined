CREATE TABLE "track_tags" (
	"id" serial PRIMARY KEY NOT NULL,
	"trackID" text NOT NULL,
	"tag" text NOT NULL
);
--> statement-breakpoint
ALTER TABLE "sound_tracks" RENAME TO "sound_track";--> statement-breakpoint
ALTER TABLE "album_cover" DROP CONSTRAINT "album_cover_trackID_sound_tracks_id_fk";
--> statement-breakpoint
ALTER TABLE "sound_track" DROP CONSTRAINT "sound_tracks_userID_user_id_fk";
--> statement-breakpoint
ALTER TABLE "track_tags" ADD CONSTRAINT "track_tags_trackID_sound_track_id_fk" FOREIGN KEY ("trackID") REFERENCES "public"."sound_track"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "album_cover" ADD CONSTRAINT "album_cover_trackID_sound_track_id_fk" FOREIGN KEY ("trackID") REFERENCES "public"."sound_track"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sound_track" ADD CONSTRAINT "sound_track_userID_user_id_fk" FOREIGN KEY ("userID") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sound_track" DROP COLUMN "albumCover";