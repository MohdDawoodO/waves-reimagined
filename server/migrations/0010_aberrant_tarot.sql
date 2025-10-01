ALTER TABLE "playlistTrack" DROP CONSTRAINT "playlistTrack_id_playlist_id_fk";
--> statement-breakpoint
ALTER TABLE "playlistTrack" DROP CONSTRAINT "playlistTrack_id_sound_track_id_fk";
--> statement-breakpoint
ALTER TABLE "playlistTrack" ADD PRIMARY KEY ("id");--> statement-breakpoint
ALTER TABLE "playlistTrack" ALTER COLUMN "id" SET DATA TYPE serial;--> statement-breakpoint
ALTER TABLE "playlistTrack" ADD COLUMN "playlistID" text NOT NULL;--> statement-breakpoint
ALTER TABLE "playlistTrack" ADD COLUMN "trackID" text NOT NULL;--> statement-breakpoint
ALTER TABLE "playlistTrack" ADD CONSTRAINT "playlistTrack_playlistID_playlist_id_fk" FOREIGN KEY ("playlistID") REFERENCES "public"."playlist"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "playlistTrack" ADD CONSTRAINT "playlistTrack_trackID_sound_track_id_fk" FOREIGN KEY ("trackID") REFERENCES "public"."sound_track"("id") ON DELETE cascade ON UPDATE no action;