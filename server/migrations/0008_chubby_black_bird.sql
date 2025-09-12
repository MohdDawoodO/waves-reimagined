CREATE TABLE "two_factor_codes" (
	"id" serial PRIMARY KEY NOT NULL,
	"code" text NOT NULL,
	"email" text NOT NULL,
	"expires" timestamp NOT NULL
);
--> statement-breakpoint
DROP TABLE "verification_code" CASCADE;--> statement-breakpoint
ALTER TABLE "two_factor_codes" ADD CONSTRAINT "two_factor_codes_email_user_email_fk" FOREIGN KEY ("email") REFERENCES "public"."user"("email") ON DELETE cascade ON UPDATE no action;