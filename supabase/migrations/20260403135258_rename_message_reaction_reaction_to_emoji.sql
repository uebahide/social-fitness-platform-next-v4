alter table "public"."message_reactions" drop column "reaction";

alter table "public"."message_reactions" add column "emoji" text not null;


