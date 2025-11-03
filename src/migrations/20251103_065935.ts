import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_articles_card_type" AS ENUM('card_normal', 'card_detailed', 'title_only', 'thumbnail_only');
  CREATE TYPE "public"."enum_articles_status" AS ENUM('draft', 'published', 'pending_approval', 'rejected');
  CREATE TYPE "public"."enum__articles_v_version_card_type" AS ENUM('card_normal', 'card_detailed', 'title_only', 'thumbnail_only');
  CREATE TYPE "public"."enum__articles_v_version_status" AS ENUM('draft', 'published', 'pending_approval', 'rejected');
  CREATE TYPE "public"."enum_categories_color" AS ENUM('red', 'orange', 'yellow', 'green', 'blue', 'purple', 'brown', 'gray');
  CREATE TYPE "public"."enum_users_role" AS ENUM('admin', 'editor', 'reporter', 'art_editor');
  CREATE TYPE "public"."enum_themes_components_card_shadow" AS ENUM('none', 'sm', 'md', 'lg');
  CREATE TYPE "public"."enum_analytics_content_type" AS ENUM('article', 'post', 'media', 'page');
  CREATE TYPE "public"."enum_analytics_event_type" AS ENUM('page_view', 'content_read', 'video_play', 'video_complete', 'share', 'like', 'comment', 'download');
  CREATE TYPE "public"."enum_analytics_device_info_device_type" AS ENUM('desktop', 'mobile', 'tablet', 'other');
  CREATE TYPE "public"."enum_analytics_traffic_source_source" AS ENUM('direct', 'search', 'social', 'email', 'referral', 'other');
  CREATE TYPE "public"."enum_reels_platform" AS ENUM('tiktok', 'reels');
  CREATE TYPE "public"."enum_payload_folders_folder_type" AS ENUM('media');
  CREATE TABLE "articles" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"content" jsonb,
  	"slug" varchar,
  	"card_type" "enum_articles_card_type" DEFAULT 'card_normal',
  	"theme_id" integer,
  	"featured" boolean DEFAULT false,
  	"featured_image_id" integer,
  	"description" varchar,
  	"status" "enum_articles_status" DEFAULT 'draft',
  	"published_at" timestamp(3) with time zone,
  	"created_by_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_articles_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "articles_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"users_id" integer,
  	"categories_id" integer
  );
  
  CREATE TABLE "_articles_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_title" varchar,
  	"version_content" jsonb,
  	"version_slug" varchar,
  	"version_card_type" "enum__articles_v_version_card_type" DEFAULT 'card_normal',
  	"version_theme_id" integer,
  	"version_featured" boolean DEFAULT false,
  	"version_featured_image_id" integer,
  	"version_description" varchar,
  	"version_status" "enum__articles_v_version_status" DEFAULT 'draft',
  	"version_published_at" timestamp(3) with time zone,
  	"version_created_by_id" integer,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__articles_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean,
  	"autosave" boolean
  );
  
  CREATE TABLE "_articles_v_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"users_id" integer,
  	"categories_id" integer
  );
  
  CREATE TABLE "categories" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"slug" varchar NOT NULL,
  	"color" "enum_categories_color" DEFAULT 'gray',
  	"description" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "categories_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"articles_id" integer
  );
  
  CREATE TABLE "media" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"alt" varchar,
  	"caption" jsonb,
  	"folder_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"url" varchar,
  	"thumbnail_u_r_l" varchar,
  	"filename" varchar,
  	"mime_type" varchar,
  	"filesize" numeric,
  	"width" numeric,
  	"height" numeric,
  	"focal_x" numeric,
  	"focal_y" numeric,
  	"sizes_thumbnail_url" varchar,
  	"sizes_thumbnail_width" numeric,
  	"sizes_thumbnail_height" numeric,
  	"sizes_thumbnail_mime_type" varchar,
  	"sizes_thumbnail_filesize" numeric,
  	"sizes_thumbnail_filename" varchar,
  	"sizes_square_url" varchar,
  	"sizes_square_width" numeric,
  	"sizes_square_height" numeric,
  	"sizes_square_mime_type" varchar,
  	"sizes_square_filesize" numeric,
  	"sizes_square_filename" varchar,
  	"sizes_small_url" varchar,
  	"sizes_small_width" numeric,
  	"sizes_small_height" numeric,
  	"sizes_small_mime_type" varchar,
  	"sizes_small_filesize" numeric,
  	"sizes_small_filename" varchar,
  	"sizes_medium_url" varchar,
  	"sizes_medium_width" numeric,
  	"sizes_medium_height" numeric,
  	"sizes_medium_mime_type" varchar,
  	"sizes_medium_filesize" numeric,
  	"sizes_medium_filename" varchar,
  	"sizes_large_url" varchar,
  	"sizes_large_width" numeric,
  	"sizes_large_height" numeric,
  	"sizes_large_mime_type" varchar,
  	"sizes_large_filesize" numeric,
  	"sizes_large_filename" varchar,
  	"sizes_xlarge_url" varchar,
  	"sizes_xlarge_width" numeric,
  	"sizes_xlarge_height" numeric,
  	"sizes_xlarge_mime_type" varchar,
  	"sizes_xlarge_filesize" numeric,
  	"sizes_xlarge_filename" varchar,
  	"sizes_og_url" varchar,
  	"sizes_og_width" numeric,
  	"sizes_og_height" numeric,
  	"sizes_og_mime_type" varchar,
  	"sizes_og_filesize" numeric,
  	"sizes_og_filename" varchar
  );
  
  CREATE TABLE "users_sessions" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"created_at" timestamp(3) with time zone,
  	"expires_at" timestamp(3) with time zone NOT NULL
  );
  
  CREATE TABLE "users" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"role" "enum_users_role" DEFAULT 'reporter' NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"email" varchar NOT NULL,
  	"reset_password_token" varchar,
  	"reset_password_expiration" timestamp(3) with time zone,
  	"salt" varchar,
  	"hash" varchar,
  	"login_attempts" numeric DEFAULT 0,
  	"lock_until" timestamp(3) with time zone
  );
  
  CREATE TABLE "themes" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"slug" varchar NOT NULL,
  	"description" varchar,
  	"is_active" boolean DEFAULT true,
  	"is_default" boolean DEFAULT false,
  	"colors_primary_main" varchar DEFAULT '#1976d2' NOT NULL,
  	"colors_primary_light" varchar,
  	"colors_primary_dark" varchar,
  	"colors_primary_contrast" varchar DEFAULT '#ffffff',
  	"colors_secondary_main" varchar DEFAULT '#dc004e' NOT NULL,
  	"colors_secondary_light" varchar,
  	"colors_secondary_dark" varchar,
  	"colors_secondary_contrast" varchar DEFAULT '#ffffff',
  	"colors_accent_main" varchar DEFAULT '#ff9800',
  	"colors_accent_contrast" varchar DEFAULT '#000000',
  	"colors_background_default" varchar DEFAULT '#ffffff' NOT NULL,
  	"colors_background_paper" varchar DEFAULT '#ffffff',
  	"colors_background_elevated" varchar DEFAULT '#f5f5f5',
  	"colors_text_primary" varchar DEFAULT '#000000' NOT NULL,
  	"colors_text_secondary" varchar DEFAULT '#757575',
  	"colors_text_disabled" varchar DEFAULT '#bdbdbd',
  	"colors_text_hint" varchar DEFAULT '#9e9e9e',
  	"colors_semantic_success" varchar DEFAULT '#4caf50',
  	"colors_semantic_error" varchar DEFAULT '#f44336',
  	"colors_semantic_warning" varchar DEFAULT '#ff9800',
  	"colors_semantic_info" varchar DEFAULT '#2196f3',
  	"colors_divider" varchar DEFAULT '#e0e0e0',
  	"typography_font_family_primary" varchar DEFAULT 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  	"typography_font_family_heading" varchar DEFAULT 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  	"typography_font_family_monospace" varchar DEFAULT '"Fira Code", "Consolas", "Monaco", monospace',
  	"typography_font_size_h1" numeric DEFAULT 32,
  	"typography_font_size_h2" numeric DEFAULT 28,
  	"typography_font_size_h3" numeric DEFAULT 24,
  	"typography_font_size_h4" numeric DEFAULT 20,
  	"typography_font_size_h5" numeric DEFAULT 18,
  	"typography_font_size_h6" numeric DEFAULT 16,
  	"typography_font_size_body" numeric DEFAULT 16,
  	"typography_font_size_small" numeric DEFAULT 14,
  	"typography_font_size_caption" numeric DEFAULT 12,
  	"typography_font_weight_light" numeric DEFAULT 300,
  	"typography_font_weight_regular" numeric DEFAULT 400,
  	"typography_font_weight_medium" numeric DEFAULT 500,
  	"typography_font_weight_semibold" numeric DEFAULT 600,
  	"typography_font_weight_bold" numeric DEFAULT 700,
  	"typography_line_height_tight" numeric DEFAULT 1.2,
  	"typography_line_height_normal" numeric DEFAULT 1.5,
  	"typography_line_height_relaxed" numeric DEFAULT 1.75,
  	"spacing_xs" numeric DEFAULT 4,
  	"spacing_sm" numeric DEFAULT 8,
  	"spacing_md" numeric DEFAULT 16,
  	"spacing_lg" numeric DEFAULT 24,
  	"spacing_xl" numeric DEFAULT 32,
  	"spacing_xxl" numeric DEFAULT 48,
  	"border_radius_none" numeric DEFAULT 0,
  	"border_radius_sm" numeric DEFAULT 4,
  	"border_radius_md" numeric DEFAULT 8,
  	"border_radius_lg" numeric DEFAULT 12,
  	"border_radius_xl" numeric DEFAULT 16,
  	"border_radius_full" numeric DEFAULT 9999,
  	"shadows_sm" varchar DEFAULT '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  	"shadows_md" varchar DEFAULT '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
  	"shadows_lg" varchar DEFAULT '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
  	"shadows_xl" varchar DEFAULT '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
  	"components_button_border_radius" numeric DEFAULT 8,
  	"components_button_padding_x" numeric DEFAULT 16,
  	"components_button_padding_y" numeric DEFAULT 8,
  	"components_card_border_radius" numeric DEFAULT 12,
  	"components_card_padding" numeric DEFAULT 16,
  	"components_card_shadow" "enum_themes_components_card_shadow" DEFAULT 'md',
  	"components_input_border_radius" numeric DEFAULT 8,
  	"components_input_border_color" varchar DEFAULT '#e0e0e0',
  	"components_input_focus_border_color" varchar DEFAULT '#1976d2',
  	"custom_c_s_s" varchar,
  	"metadata_version" varchar DEFAULT '1.0.0',
  	"metadata_author" varchar,
  	"metadata_tags" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "analytics" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"content_type" "enum_analytics_content_type" NOT NULL,
  	"content_id" varchar NOT NULL,
  	"content_title" varchar,
  	"event_type" "enum_analytics_event_type" NOT NULL,
  	"user_id" varchar,
  	"session_id" varchar,
  	"is_authenticated" boolean DEFAULT false,
  	"device_info_device_type" "enum_analytics_device_info_device_type",
  	"device_info_os" varchar,
  	"device_info_os_version" varchar,
  	"device_info_browser" varchar,
  	"device_info_browser_version" varchar,
  	"device_info_screen_resolution" varchar,
  	"geo_location_country" varchar,
  	"geo_location_country_code" varchar,
  	"geo_location_region" varchar,
  	"geo_location_city" varchar,
  	"geo_location_latitude" numeric,
  	"geo_location_longitude" numeric,
  	"engagement_metrics_time_spent" numeric,
  	"engagement_metrics_scroll_depth" numeric,
  	"engagement_metrics_click_count" numeric DEFAULT 0,
  	"engagement_metrics_bounced" boolean DEFAULT false,
  	"traffic_source_referrer" varchar,
  	"traffic_source_source" "enum_analytics_traffic_source_source",
  	"traffic_source_medium" varchar,
  	"traffic_source_campaign" varchar,
  	"traffic_source_utm_params" jsonb,
  	"ip_address" varchar,
  	"user_agent" varchar,
  	"metadata" jsonb,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "reels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"url" varchar NOT NULL,
  	"platform" "enum_reels_platform" NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_kv" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar NOT NULL,
  	"data" jsonb NOT NULL
  );
  
  CREATE TABLE "payload_folders_folder_type" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum_payload_folders_folder_type",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "payload_folders" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"folder_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_locked_documents" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"global_slug" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_locked_documents_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"articles_id" integer,
  	"categories_id" integer,
  	"media_id" integer,
  	"users_id" integer,
  	"themes_id" integer,
  	"analytics_id" integer,
  	"reels_id" integer,
  	"payload_kv_id" integer,
  	"payload_folders_id" integer
  );
  
  CREATE TABLE "payload_preferences" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar,
  	"value" jsonb,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_preferences_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"users_id" integer
  );
  
  CREATE TABLE "payload_migrations" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"batch" numeric,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "app_layout_blocks_featured_article" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"article_id" integer NOT NULL,
  	"is_hidden" boolean DEFAULT false,
  	"block_name" varchar
  );
  
  CREATE TABLE "app_layout_blocks_category_section" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"category_id" integer NOT NULL,
  	"is_hidden" boolean DEFAULT false,
  	"block_name" varchar
  );
  
  CREATE TABLE "app_layout_blocks_reels_section" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar DEFAULT 'Vídeos Curtos' NOT NULL,
  	"is_hidden" boolean DEFAULT false,
  	"block_name" varchar
  );
  
  CREATE TABLE "app_layout" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "app_layout_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"reels_id" integer
  );
  
  ALTER TABLE "articles" ADD CONSTRAINT "articles_theme_id_themes_id_fk" FOREIGN KEY ("theme_id") REFERENCES "public"."themes"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "articles" ADD CONSTRAINT "articles_featured_image_id_media_id_fk" FOREIGN KEY ("featured_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "articles" ADD CONSTRAINT "articles_created_by_id_users_id_fk" FOREIGN KEY ("created_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "articles_rels" ADD CONSTRAINT "articles_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."articles"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "articles_rels" ADD CONSTRAINT "articles_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "articles_rels" ADD CONSTRAINT "articles_rels_categories_fk" FOREIGN KEY ("categories_id") REFERENCES "public"."categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_articles_v" ADD CONSTRAINT "_articles_v_parent_id_articles_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."articles"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_articles_v" ADD CONSTRAINT "_articles_v_version_theme_id_themes_id_fk" FOREIGN KEY ("version_theme_id") REFERENCES "public"."themes"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_articles_v" ADD CONSTRAINT "_articles_v_version_featured_image_id_media_id_fk" FOREIGN KEY ("version_featured_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_articles_v" ADD CONSTRAINT "_articles_v_version_created_by_id_users_id_fk" FOREIGN KEY ("version_created_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_articles_v_rels" ADD CONSTRAINT "_articles_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_articles_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_articles_v_rels" ADD CONSTRAINT "_articles_v_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_articles_v_rels" ADD CONSTRAINT "_articles_v_rels_categories_fk" FOREIGN KEY ("categories_id") REFERENCES "public"."categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "categories_rels" ADD CONSTRAINT "categories_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "categories_rels" ADD CONSTRAINT "categories_rels_articles_fk" FOREIGN KEY ("articles_id") REFERENCES "public"."articles"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "media" ADD CONSTRAINT "media_folder_id_payload_folders_id_fk" FOREIGN KEY ("folder_id") REFERENCES "public"."payload_folders"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "users_sessions" ADD CONSTRAINT "users_sessions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_folders_folder_type" ADD CONSTRAINT "payload_folders_folder_type_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_folders"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_folders" ADD CONSTRAINT "payload_folders_folder_id_payload_folders_id_fk" FOREIGN KEY ("folder_id") REFERENCES "public"."payload_folders"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_locked_documents"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_articles_fk" FOREIGN KEY ("articles_id") REFERENCES "public"."articles"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_categories_fk" FOREIGN KEY ("categories_id") REFERENCES "public"."categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_themes_fk" FOREIGN KEY ("themes_id") REFERENCES "public"."themes"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_analytics_fk" FOREIGN KEY ("analytics_id") REFERENCES "public"."analytics"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_reels_fk" FOREIGN KEY ("reels_id") REFERENCES "public"."reels"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_payload_kv_fk" FOREIGN KEY ("payload_kv_id") REFERENCES "public"."payload_kv"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_payload_folders_fk" FOREIGN KEY ("payload_folders_id") REFERENCES "public"."payload_folders"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_preferences"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "app_layout_blocks_featured_article" ADD CONSTRAINT "app_layout_blocks_featured_article_article_id_articles_id_fk" FOREIGN KEY ("article_id") REFERENCES "public"."articles"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "app_layout_blocks_featured_article" ADD CONSTRAINT "app_layout_blocks_featured_article_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."app_layout"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "app_layout_blocks_category_section" ADD CONSTRAINT "app_layout_blocks_category_section_category_id_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."categories"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "app_layout_blocks_category_section" ADD CONSTRAINT "app_layout_blocks_category_section_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."app_layout"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "app_layout_blocks_reels_section" ADD CONSTRAINT "app_layout_blocks_reels_section_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."app_layout"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "app_layout_rels" ADD CONSTRAINT "app_layout_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."app_layout"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "app_layout_rels" ADD CONSTRAINT "app_layout_rels_reels_fk" FOREIGN KEY ("reels_id") REFERENCES "public"."reels"("id") ON DELETE cascade ON UPDATE no action;
  CREATE UNIQUE INDEX "articles_slug_idx" ON "articles" USING btree ("slug");
  CREATE INDEX "articles_theme_idx" ON "articles" USING btree ("theme_id");
  CREATE INDEX "articles_featured_image_idx" ON "articles" USING btree ("featured_image_id");
  CREATE INDEX "articles_created_by_idx" ON "articles" USING btree ("created_by_id");
  CREATE INDEX "articles_updated_at_idx" ON "articles" USING btree ("updated_at");
  CREATE INDEX "articles_created_at_idx" ON "articles" USING btree ("created_at");
  CREATE INDEX "articles__status_idx" ON "articles" USING btree ("_status");
  CREATE INDEX "articles_rels_order_idx" ON "articles_rels" USING btree ("order");
  CREATE INDEX "articles_rels_parent_idx" ON "articles_rels" USING btree ("parent_id");
  CREATE INDEX "articles_rels_path_idx" ON "articles_rels" USING btree ("path");
  CREATE INDEX "articles_rels_users_id_idx" ON "articles_rels" USING btree ("users_id");
  CREATE INDEX "articles_rels_categories_id_idx" ON "articles_rels" USING btree ("categories_id");
  CREATE INDEX "_articles_v_parent_idx" ON "_articles_v" USING btree ("parent_id");
  CREATE INDEX "_articles_v_version_version_slug_idx" ON "_articles_v" USING btree ("version_slug");
  CREATE INDEX "_articles_v_version_version_theme_idx" ON "_articles_v" USING btree ("version_theme_id");
  CREATE INDEX "_articles_v_version_version_featured_image_idx" ON "_articles_v" USING btree ("version_featured_image_id");
  CREATE INDEX "_articles_v_version_version_created_by_idx" ON "_articles_v" USING btree ("version_created_by_id");
  CREATE INDEX "_articles_v_version_version_updated_at_idx" ON "_articles_v" USING btree ("version_updated_at");
  CREATE INDEX "_articles_v_version_version_created_at_idx" ON "_articles_v" USING btree ("version_created_at");
  CREATE INDEX "_articles_v_version_version__status_idx" ON "_articles_v" USING btree ("version__status");
  CREATE INDEX "_articles_v_created_at_idx" ON "_articles_v" USING btree ("created_at");
  CREATE INDEX "_articles_v_updated_at_idx" ON "_articles_v" USING btree ("updated_at");
  CREATE INDEX "_articles_v_latest_idx" ON "_articles_v" USING btree ("latest");
  CREATE INDEX "_articles_v_autosave_idx" ON "_articles_v" USING btree ("autosave");
  CREATE INDEX "_articles_v_rels_order_idx" ON "_articles_v_rels" USING btree ("order");
  CREATE INDEX "_articles_v_rels_parent_idx" ON "_articles_v_rels" USING btree ("parent_id");
  CREATE INDEX "_articles_v_rels_path_idx" ON "_articles_v_rels" USING btree ("path");
  CREATE INDEX "_articles_v_rels_users_id_idx" ON "_articles_v_rels" USING btree ("users_id");
  CREATE INDEX "_articles_v_rels_categories_id_idx" ON "_articles_v_rels" USING btree ("categories_id");
  CREATE UNIQUE INDEX "categories_name_idx" ON "categories" USING btree ("name");
  CREATE UNIQUE INDEX "categories_slug_idx" ON "categories" USING btree ("slug");
  CREATE INDEX "categories_updated_at_idx" ON "categories" USING btree ("updated_at");
  CREATE INDEX "categories_created_at_idx" ON "categories" USING btree ("created_at");
  CREATE INDEX "categories_rels_order_idx" ON "categories_rels" USING btree ("order");
  CREATE INDEX "categories_rels_parent_idx" ON "categories_rels" USING btree ("parent_id");
  CREATE INDEX "categories_rels_path_idx" ON "categories_rels" USING btree ("path");
  CREATE INDEX "categories_rels_articles_id_idx" ON "categories_rels" USING btree ("articles_id");
  CREATE INDEX "media_folder_idx" ON "media" USING btree ("folder_id");
  CREATE INDEX "media_updated_at_idx" ON "media" USING btree ("updated_at");
  CREATE INDEX "media_created_at_idx" ON "media" USING btree ("created_at");
  CREATE UNIQUE INDEX "media_filename_idx" ON "media" USING btree ("filename");
  CREATE INDEX "media_sizes_thumbnail_sizes_thumbnail_filename_idx" ON "media" USING btree ("sizes_thumbnail_filename");
  CREATE INDEX "media_sizes_square_sizes_square_filename_idx" ON "media" USING btree ("sizes_square_filename");
  CREATE INDEX "media_sizes_small_sizes_small_filename_idx" ON "media" USING btree ("sizes_small_filename");
  CREATE INDEX "media_sizes_medium_sizes_medium_filename_idx" ON "media" USING btree ("sizes_medium_filename");
  CREATE INDEX "media_sizes_large_sizes_large_filename_idx" ON "media" USING btree ("sizes_large_filename");
  CREATE INDEX "media_sizes_xlarge_sizes_xlarge_filename_idx" ON "media" USING btree ("sizes_xlarge_filename");
  CREATE INDEX "media_sizes_og_sizes_og_filename_idx" ON "media" USING btree ("sizes_og_filename");
  CREATE INDEX "users_sessions_order_idx" ON "users_sessions" USING btree ("_order");
  CREATE INDEX "users_sessions_parent_id_idx" ON "users_sessions" USING btree ("_parent_id");
  CREATE INDEX "users_updated_at_idx" ON "users" USING btree ("updated_at");
  CREATE INDEX "users_created_at_idx" ON "users" USING btree ("created_at");
  CREATE UNIQUE INDEX "users_email_idx" ON "users" USING btree ("email");
  CREATE UNIQUE INDEX "themes_name_idx" ON "themes" USING btree ("name");
  CREATE UNIQUE INDEX "themes_slug_idx" ON "themes" USING btree ("slug");
  CREATE INDEX "themes_updated_at_idx" ON "themes" USING btree ("updated_at");
  CREATE INDEX "themes_created_at_idx" ON "themes" USING btree ("created_at");
  CREATE INDEX "analytics_content_id_idx" ON "analytics" USING btree ("content_id");
  CREATE INDEX "analytics_user_id_idx" ON "analytics" USING btree ("user_id");
  CREATE INDEX "analytics_session_id_idx" ON "analytics" USING btree ("session_id");
  CREATE INDEX "analytics_geo_location_geo_location_country_idx" ON "analytics" USING btree ("geo_location_country");
  CREATE INDEX "analytics_updated_at_idx" ON "analytics" USING btree ("updated_at");
  CREATE INDEX "analytics_created_at_idx" ON "analytics" USING btree ("created_at");
  CREATE INDEX "reels_updated_at_idx" ON "reels" USING btree ("updated_at");
  CREATE INDEX "reels_created_at_idx" ON "reels" USING btree ("created_at");
  CREATE UNIQUE INDEX "payload_kv_key_idx" ON "payload_kv" USING btree ("key");
  CREATE INDEX "payload_folders_folder_type_order_idx" ON "payload_folders_folder_type" USING btree ("order");
  CREATE INDEX "payload_folders_folder_type_parent_idx" ON "payload_folders_folder_type" USING btree ("parent_id");
  CREATE INDEX "payload_folders_name_idx" ON "payload_folders" USING btree ("name");
  CREATE INDEX "payload_folders_folder_idx" ON "payload_folders" USING btree ("folder_id");
  CREATE INDEX "payload_folders_updated_at_idx" ON "payload_folders" USING btree ("updated_at");
  CREATE INDEX "payload_folders_created_at_idx" ON "payload_folders" USING btree ("created_at");
  CREATE INDEX "payload_locked_documents_global_slug_idx" ON "payload_locked_documents" USING btree ("global_slug");
  CREATE INDEX "payload_locked_documents_updated_at_idx" ON "payload_locked_documents" USING btree ("updated_at");
  CREATE INDEX "payload_locked_documents_created_at_idx" ON "payload_locked_documents" USING btree ("created_at");
  CREATE INDEX "payload_locked_documents_rels_order_idx" ON "payload_locked_documents_rels" USING btree ("order");
  CREATE INDEX "payload_locked_documents_rels_parent_idx" ON "payload_locked_documents_rels" USING btree ("parent_id");
  CREATE INDEX "payload_locked_documents_rels_path_idx" ON "payload_locked_documents_rels" USING btree ("path");
  CREATE INDEX "payload_locked_documents_rels_articles_id_idx" ON "payload_locked_documents_rels" USING btree ("articles_id");
  CREATE INDEX "payload_locked_documents_rels_categories_id_idx" ON "payload_locked_documents_rels" USING btree ("categories_id");
  CREATE INDEX "payload_locked_documents_rels_media_id_idx" ON "payload_locked_documents_rels" USING btree ("media_id");
  CREATE INDEX "payload_locked_documents_rels_users_id_idx" ON "payload_locked_documents_rels" USING btree ("users_id");
  CREATE INDEX "payload_locked_documents_rels_themes_id_idx" ON "payload_locked_documents_rels" USING btree ("themes_id");
  CREATE INDEX "payload_locked_documents_rels_analytics_id_idx" ON "payload_locked_documents_rels" USING btree ("analytics_id");
  CREATE INDEX "payload_locked_documents_rels_reels_id_idx" ON "payload_locked_documents_rels" USING btree ("reels_id");
  CREATE INDEX "payload_locked_documents_rels_payload_kv_id_idx" ON "payload_locked_documents_rels" USING btree ("payload_kv_id");
  CREATE INDEX "payload_locked_documents_rels_payload_folders_id_idx" ON "payload_locked_documents_rels" USING btree ("payload_folders_id");
  CREATE INDEX "payload_preferences_key_idx" ON "payload_preferences" USING btree ("key");
  CREATE INDEX "payload_preferences_updated_at_idx" ON "payload_preferences" USING btree ("updated_at");
  CREATE INDEX "payload_preferences_created_at_idx" ON "payload_preferences" USING btree ("created_at");
  CREATE INDEX "payload_preferences_rels_order_idx" ON "payload_preferences_rels" USING btree ("order");
  CREATE INDEX "payload_preferences_rels_parent_idx" ON "payload_preferences_rels" USING btree ("parent_id");
  CREATE INDEX "payload_preferences_rels_path_idx" ON "payload_preferences_rels" USING btree ("path");
  CREATE INDEX "payload_preferences_rels_users_id_idx" ON "payload_preferences_rels" USING btree ("users_id");
  CREATE INDEX "payload_migrations_updated_at_idx" ON "payload_migrations" USING btree ("updated_at");
  CREATE INDEX "payload_migrations_created_at_idx" ON "payload_migrations" USING btree ("created_at");
  CREATE INDEX "app_layout_blocks_featured_article_order_idx" ON "app_layout_blocks_featured_article" USING btree ("_order");
  CREATE INDEX "app_layout_blocks_featured_article_parent_id_idx" ON "app_layout_blocks_featured_article" USING btree ("_parent_id");
  CREATE INDEX "app_layout_blocks_featured_article_path_idx" ON "app_layout_blocks_featured_article" USING btree ("_path");
  CREATE INDEX "app_layout_blocks_featured_article_article_idx" ON "app_layout_blocks_featured_article" USING btree ("article_id");
  CREATE INDEX "app_layout_blocks_category_section_order_idx" ON "app_layout_blocks_category_section" USING btree ("_order");
  CREATE INDEX "app_layout_blocks_category_section_parent_id_idx" ON "app_layout_blocks_category_section" USING btree ("_parent_id");
  CREATE INDEX "app_layout_blocks_category_section_path_idx" ON "app_layout_blocks_category_section" USING btree ("_path");
  CREATE INDEX "app_layout_blocks_category_section_category_idx" ON "app_layout_blocks_category_section" USING btree ("category_id");
  CREATE INDEX "app_layout_blocks_reels_section_order_idx" ON "app_layout_blocks_reels_section" USING btree ("_order");
  CREATE INDEX "app_layout_blocks_reels_section_parent_id_idx" ON "app_layout_blocks_reels_section" USING btree ("_parent_id");
  CREATE INDEX "app_layout_blocks_reels_section_path_idx" ON "app_layout_blocks_reels_section" USING btree ("_path");
  CREATE INDEX "app_layout_rels_order_idx" ON "app_layout_rels" USING btree ("order");
  CREATE INDEX "app_layout_rels_parent_idx" ON "app_layout_rels" USING btree ("parent_id");
  CREATE INDEX "app_layout_rels_path_idx" ON "app_layout_rels" USING btree ("path");
  CREATE INDEX "app_layout_rels_reels_id_idx" ON "app_layout_rels" USING btree ("reels_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "articles" CASCADE;
  DROP TABLE "articles_rels" CASCADE;
  DROP TABLE "_articles_v" CASCADE;
  DROP TABLE "_articles_v_rels" CASCADE;
  DROP TABLE "categories" CASCADE;
  DROP TABLE "categories_rels" CASCADE;
  DROP TABLE "media" CASCADE;
  DROP TABLE "users_sessions" CASCADE;
  DROP TABLE "users" CASCADE;
  DROP TABLE "themes" CASCADE;
  DROP TABLE "analytics" CASCADE;
  DROP TABLE "reels" CASCADE;
  DROP TABLE "payload_kv" CASCADE;
  DROP TABLE "payload_folders_folder_type" CASCADE;
  DROP TABLE "payload_folders" CASCADE;
  DROP TABLE "payload_locked_documents" CASCADE;
  DROP TABLE "payload_locked_documents_rels" CASCADE;
  DROP TABLE "payload_preferences" CASCADE;
  DROP TABLE "payload_preferences_rels" CASCADE;
  DROP TABLE "payload_migrations" CASCADE;
  DROP TABLE "app_layout_blocks_featured_article" CASCADE;
  DROP TABLE "app_layout_blocks_category_section" CASCADE;
  DROP TABLE "app_layout_blocks_reels_section" CASCADE;
  DROP TABLE "app_layout" CASCADE;
  DROP TABLE "app_layout_rels" CASCADE;
  DROP TYPE "public"."enum_articles_card_type";
  DROP TYPE "public"."enum_articles_status";
  DROP TYPE "public"."enum__articles_v_version_card_type";
  DROP TYPE "public"."enum__articles_v_version_status";
  DROP TYPE "public"."enum_categories_color";
  DROP TYPE "public"."enum_users_role";
  DROP TYPE "public"."enum_themes_components_card_shadow";
  DROP TYPE "public"."enum_analytics_content_type";
  DROP TYPE "public"."enum_analytics_event_type";
  DROP TYPE "public"."enum_analytics_device_info_device_type";
  DROP TYPE "public"."enum_analytics_traffic_source_source";
  DROP TYPE "public"."enum_reels_platform";
  DROP TYPE "public"."enum_payload_folders_folder_type";`)
}
