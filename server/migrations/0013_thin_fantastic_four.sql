CREATE TABLE "comment" (
	"id" serial PRIMARY KEY NOT NULL,
	"comment" text NOT NULL,
	"userID" text NOT NULL,
	"trackID" text NOT NULL
);
--> statement-breakpoint
ALTER TABLE "playlist" ALTER COLUMN "editable" SET DEFAULT true;--> statement-breakpoint
ALTER TABLE "comment" ADD CONSTRAINT "comment_userID_user_id_fk" FOREIGN KEY ("userID") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "comment" ADD CONSTRAINT "comment_trackID_sound_track_id_fk" FOREIGN KEY ("trackID") REFERENCES "public"."sound_track"("id") ON DELETE cascade ON UPDATE no action;