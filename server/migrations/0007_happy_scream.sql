CREATE TABLE "verification_code" (
	"id" serial PRIMARY KEY NOT NULL,
	"code" real NOT NULL,
	"email" text NOT NULL,
	"expires" timestamp NOT NULL
);
--> statement-breakpoint
ALTER TABLE "verification_token" ALTER COLUMN "expires" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "verification_code" ADD CONSTRAINT "verification_code_email_user_email_fk" FOREIGN KEY ("email") REFERENCES "public"."user"("email") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "verification_token" ADD CONSTRAINT "verification_token_email_user_email_fk" FOREIGN KEY ("email") REFERENCES "public"."user"("email") ON DELETE cascade ON UPDATE no action;