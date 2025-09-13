ALTER TABLE "two_factor_codes" RENAME TO "two_factor_code";--> statement-breakpoint
ALTER TABLE "two_factor_code" DROP CONSTRAINT "two_factor_codes_email_user_email_fk";
--> statement-breakpoint
ALTER TABLE "two_factor_code" ADD CONSTRAINT "two_factor_code_email_user_email_fk" FOREIGN KEY ("email") REFERENCES "public"."user"("email") ON DELETE cascade ON UPDATE no action;