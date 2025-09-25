CREATE TYPE "public"."turn" AS ENUM('diurno', 'nocturno');--> statement-breakpoint
CREATE TYPE "public"."type" AS ENUM('desvio_de_cargas', 'inspeccion_mantos_carbon', 'inspeccion_pilas', 'sondeo_cargas');--> statement-breakpoint
CREATE TABLE "activity_log" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"action" text NOT NULL,
	"details" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "activityOperation" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text NOT NULL,
	"turn" "turn" NOT NULL,
	"type" "type" NOT NULL,
	"data" jsonb,
	"created_day" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "activity_log" ADD CONSTRAINT "activity_log_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "activityOperation" ADD CONSTRAINT "activityOperation_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;