CREATE TABLE "trucks" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text NOT NULL,
	"truck_number" text,
	"km_inicial" text,
	"km_final" text
);
--> statement-breakpoint
ALTER TABLE "trucks" ADD CONSTRAINT "trucks_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;