


SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;


COMMENT ON SCHEMA "public" IS 'standard public schema';



CREATE EXTENSION IF NOT EXISTS "pg_stat_statements" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "pgcrypto" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "supabase_vault" WITH SCHEMA "vault";






CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA "extensions";






CREATE OR REPLACE FUNCTION "public"."handle_new_user"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO ''
    AS $$
begin
  insert into public.profiles (id, first_name, last_name, email)
  values (
    new.id,
    new.raw_user_meta_data ->> 'first_name',
    new.raw_user_meta_data ->> 'last_name',
    new.email
  );
  return new;
end;
$$;


ALTER FUNCTION "public"."handle_new_user"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."is_admin"() RETURNS boolean
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
BEGIN
  RETURN EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin');
END;
$$;


ALTER FUNCTION "public"."is_admin"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."rls_auto_enable"() RETURNS "event_trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO 'pg_catalog'
    AS $$
DECLARE
  cmd record;
BEGIN
  FOR cmd IN
    SELECT *
    FROM pg_event_trigger_ddl_commands()
    WHERE command_tag IN ('CREATE TABLE', 'CREATE TABLE AS', 'SELECT INTO')
      AND object_type IN ('table','partitioned table')
  LOOP
     IF cmd.schema_name IS NOT NULL AND cmd.schema_name IN ('public') AND cmd.schema_name NOT IN ('pg_catalog','information_schema') AND cmd.schema_name NOT LIKE 'pg_toast%' AND cmd.schema_name NOT LIKE 'pg_temp%' THEN
      BEGIN
        EXECUTE format('alter table if exists %s enable row level security', cmd.object_identity);
        RAISE LOG 'rls_auto_enable: enabled RLS on %', cmd.object_identity;
      EXCEPTION
        WHEN OTHERS THEN
          RAISE LOG 'rls_auto_enable: failed to enable RLS on %', cmd.object_identity;
      END;
     ELSE
        RAISE LOG 'rls_auto_enable: skip % (either system schema or not in enforced list: %.)', cmd.object_identity, cmd.schema_name;
     END IF;
  END LOOP;
END;
$$;


ALTER FUNCTION "public"."rls_auto_enable"() OWNER TO "postgres";

SET default_tablespace = '';

SET default_table_access_method = "heap";


CREATE TABLE IF NOT EXISTS "public"."addresses" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "user_id" "uuid",
    "title" "text" DEFAULT 'Home'::"text",
    "address_line_1" "text" NOT NULL,
    "address_line_2" "text",
    "city" "text" NOT NULL,
    "state" "text" NOT NULL,
    "postal_code" "text" NOT NULL,
    "country" "text" DEFAULT 'India'::"text",
    "is_default" boolean DEFAULT false,
    "created_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."addresses" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."blogs" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "title" "text" NOT NULL,
    "slug" "text" NOT NULL,
    "content" "text",
    "image_url" "text",
    "is_published" boolean DEFAULT true,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "author" "text" DEFAULT 'Admin'::"text",
    "category" "text" DEFAULT 'Uncategorized'::"text",
    "category_id" "uuid",
    "keywords" "text",
    "meta_title" "text",
    "meta_description" "text",
    "published_at" timestamp with time zone DEFAULT "now"(),
    "cover_img_alt" "text",
    "canonical_tag" "text",
    "schema_markup" "text"
);


ALTER TABLE "public"."blogs" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."cart" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "user_id" "uuid",
    "created_at" timestamp with time zone DEFAULT "timezone"('utc'::"text", "now"())
);


ALTER TABLE "public"."cart" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."cart_items" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "cart_id" "uuid" NOT NULL,
    "variant_id" "uuid" NOT NULL,
    "quantity" integer DEFAULT 1,
    "created_at" timestamp with time zone DEFAULT "timezone"('utc'::"text", "now"())
);


ALTER TABLE "public"."cart_items" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."categories" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "name" "text" NOT NULL,
    "slug" "text" NOT NULL,
    "image_url" "text",
    "is_active" boolean DEFAULT true,
    "created_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."categories" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."collections" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "name" character varying(255) NOT NULL,
    "slug" character varying(255)
);


ALTER TABLE "public"."collections" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."contact_messages" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "name" "text" NOT NULL,
    "email" "text" NOT NULL,
    "phone" "text",
    "message" "text" NOT NULL,
    "status" "text" DEFAULT 'new'::"text",
    "created_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."contact_messages" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."custom_requests" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "name" "text" NOT NULL,
    "phone" "text" NOT NULL,
    "callback_date" "date",
    "callback_time" time without time zone,
    "details" "text",
    "status" "text" DEFAULT 'pending'::"text",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "email" "text",
    "outfit_type" "text",
    "budget" "text",
    "source_page" "text"
);


ALTER TABLE "public"."custom_requests" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."occasions" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "name" character varying(255) NOT NULL,
    "slug" character varying(255)
);


ALTER TABLE "public"."occasions" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."order_items" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "order_id" "uuid",
    "variant_id" "uuid",
    "quantity" integer NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "price" numeric,
    CONSTRAINT "order_items_quantity_check" CHECK (("quantity" > 0))
);


ALTER TABLE "public"."order_items" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."orders" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "user_id" "uuid",
    "status" "text" DEFAULT 'pending'::"text",
    "total_amount" numeric(10,2) NOT NULL,
    "tracking_number" "text",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"(),
    "payment_method" "text",
    "payment_status" "text",
    "shipping_address" "jsonb",
    "shiprocket_order_id" "text",
    "shiprocket_shipment_id" "text",
    "customer_phone" "text",
    "razorpay_order_id" "text",
    "razorpay_payment_id" "text",
    "razorpay_signature" "text"
);


ALTER TABLE "public"."orders" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."product_addons" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "product_id" "uuid",
    "addon_product_id" "uuid",
    "addon_type" "text" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."product_addons" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."product_category_map" (
    "product_id" "uuid" NOT NULL,
    "category_id" "uuid" NOT NULL
);


ALTER TABLE "public"."product_category_map" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."product_category_mapping" (
    "product_id" "uuid" NOT NULL,
    "category_id" "uuid" NOT NULL
);


ALTER TABLE "public"."product_category_mapping" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."product_collection_map" (
    "product_id" "uuid" NOT NULL,
    "collection_id" "uuid" NOT NULL
);


ALTER TABLE "public"."product_collection_map" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."product_collection_mapping" (
    "product_id" "uuid" NOT NULL,
    "collection_id" "uuid" NOT NULL
);


ALTER TABLE "public"."product_collection_mapping" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."product_components" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "product_id" "uuid",
    "name" character varying(255) NOT NULL,
    "is_required" boolean DEFAULT true,
    "price" numeric(10,2) NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "image_url" "text",
    "component_type" "text" DEFAULT 'Top'::"text"
);


ALTER TABLE "public"."product_components" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."product_images" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "product_id" "uuid",
    "image_url" "text" NOT NULL,
    "is_primary" boolean DEFAULT false,
    "display_order" integer DEFAULT 0,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "alt_text" "text",
    "sort_order" integer DEFAULT 0
);


ALTER TABLE "public"."product_images" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."product_occasion_map" (
    "product_id" "uuid" NOT NULL,
    "occasion_id" "uuid" NOT NULL
);


ALTER TABLE "public"."product_occasion_map" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."product_occasion_mapping" (
    "product_id" "uuid" NOT NULL,
    "occasion_id" "uuid" NOT NULL
);


ALTER TABLE "public"."product_occasion_mapping" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."product_tag_map" (
    "product_id" "uuid" NOT NULL,
    "tag_id" "uuid" NOT NULL
);


ALTER TABLE "public"."product_tag_map" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."product_variants" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "product_id" "uuid",
    "sku" "text",
    "color" "text",
    "size" "text",
    "inventory_count" integer DEFAULT 0,
    "price_adjustment" numeric(10,2) DEFAULT 0,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "stock" integer DEFAULT 0,
    "color_name" character varying(100),
    "color_hex" character varying(50),
    "sale_price" numeric(10,2),
    "weight" numeric(10,2),
    "price" numeric(10,2) DEFAULT 0,
    "barcode" "text",
    "low_stock_threshold" integer DEFAULT 5
);


ALTER TABLE "public"."product_variants" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."products" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "category_id" "uuid",
    "title" "text" NOT NULL,
    "slug" "text" NOT NULL,
    "description" "text",
    "base_price" numeric(10,2) NOT NULL,
    "is_active" boolean DEFAULT true,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "image_url" "text",
    "product_type" "text",
    "tags" "text",
    "short_description" "text",
    "full_description" "text",
    "brand" character varying(255) DEFAULT 'Srijan'::character varying,
    "department" character varying(100),
    "purchase_type" character varying(50) DEFAULT 'Single Product'::character varying,
    "seo_title" character varying(255),
    "seo_slug" character varying(255),
    "meta_desc" "text",
    "focus_keyword" character varying(255),
    "seo_keywords" "text",
    "status" character varying(50) DEFAULT 'Draft'::character varying,
    "display_note" "text",
    "material_care" "text",
    "shipping_policy" "text",
    "return_policy" "text",
    "gender" "text",
    "style" "jsonb",
    "faqs" "jsonb",
    "canonical_tag" "text",
    "schema_code" "text",
    "highlights" "text",
    "additional_info" "text",
    "shipping_class" "text",
    "estimated_delivery" "text",
    "is_cod_available" boolean DEFAULT true,
    "is_free_shipping" boolean DEFAULT false,
    "is_return_eligible" boolean DEFAULT true,
    "og_title" "text",
    "og_description" "text",
    "og_image_url" "text",
    "weight" numeric,
    "length" numeric,
    "width" numeric,
    "height" numeric,
    "canonical_url" "text",
    "categories" "jsonb" DEFAULT '[]'::"jsonb",
    "collections" "jsonb" DEFAULT '[]'::"jsonb",
    "occasions" "jsonb" DEFAULT '[]'::"jsonb",
    "sale_price" numeric,
    "schema_markup" "text",
    "view_count" integer DEFAULT 0,
    "cart_count" integer DEFAULT 0,
    "wishlist_count" integer DEFAULT 0,
    "purchase_count" integer DEFAULT 0
);


ALTER TABLE "public"."products" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."profiles" (
    "id" "uuid" NOT NULL,
    "first_name" "text",
    "last_name" "text",
    "phone" "text",
    "role" "text" DEFAULT 'customer'::"text",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "avatar_url" "text",
    "email" "text"
);


ALTER TABLE "public"."profiles" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."reviews" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "product_id" "uuid",
    "user_id" "uuid",
    "rating" integer,
    "comment" "text",
    "is_approved" boolean DEFAULT false,
    "created_at" timestamp with time zone DEFAULT "now"(),
    CONSTRAINT "reviews_rating_check" CHECK ((("rating" >= 1) AND ("rating" <= 5)))
);


ALTER TABLE "public"."reviews" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."search_keywords" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "keyword" "text" NOT NULL,
    "searches" integer DEFAULT 0,
    "conversion_rate" numeric(5,2) DEFAULT 0.0,
    "is_active" boolean DEFAULT true,
    "created_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."search_keywords" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."tags" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "name" "text" NOT NULL,
    "slug" "text" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."tags" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."wishlist" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "user_id" "uuid",
    "product_id" "uuid",
    "created_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."wishlist" OWNER TO "postgres";


ALTER TABLE ONLY "public"."addresses"
    ADD CONSTRAINT "addresses_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."blogs"
    ADD CONSTRAINT "blogs_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."blogs"
    ADD CONSTRAINT "blogs_slug_key" UNIQUE ("slug");



ALTER TABLE ONLY "public"."cart_items"
    ADD CONSTRAINT "cart_items_cart_id_variant_id_key" UNIQUE ("cart_id", "variant_id");



ALTER TABLE ONLY "public"."cart_items"
    ADD CONSTRAINT "cart_items_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."cart"
    ADD CONSTRAINT "cart_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."categories"
    ADD CONSTRAINT "categories_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."categories"
    ADD CONSTRAINT "categories_slug_key" UNIQUE ("slug");



ALTER TABLE ONLY "public"."collections"
    ADD CONSTRAINT "collections_name_key" UNIQUE ("name");



ALTER TABLE ONLY "public"."collections"
    ADD CONSTRAINT "collections_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."collections"
    ADD CONSTRAINT "collections_slug_key" UNIQUE ("slug");



ALTER TABLE ONLY "public"."contact_messages"
    ADD CONSTRAINT "contact_messages_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."custom_requests"
    ADD CONSTRAINT "custom_requests_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."occasions"
    ADD CONSTRAINT "occasions_name_key" UNIQUE ("name");



ALTER TABLE ONLY "public"."occasions"
    ADD CONSTRAINT "occasions_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."occasions"
    ADD CONSTRAINT "occasions_slug_key" UNIQUE ("slug");



ALTER TABLE ONLY "public"."order_items"
    ADD CONSTRAINT "order_items_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."orders"
    ADD CONSTRAINT "orders_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."product_addons"
    ADD CONSTRAINT "product_addons_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."product_category_map"
    ADD CONSTRAINT "product_category_map_pkey" PRIMARY KEY ("product_id", "category_id");



ALTER TABLE ONLY "public"."product_category_mapping"
    ADD CONSTRAINT "product_category_mapping_pkey" PRIMARY KEY ("product_id", "category_id");



ALTER TABLE ONLY "public"."product_collection_map"
    ADD CONSTRAINT "product_collection_map_pkey" PRIMARY KEY ("product_id", "collection_id");



ALTER TABLE ONLY "public"."product_collection_mapping"
    ADD CONSTRAINT "product_collection_mapping_pkey" PRIMARY KEY ("product_id", "collection_id");



ALTER TABLE ONLY "public"."product_components"
    ADD CONSTRAINT "product_components_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."product_images"
    ADD CONSTRAINT "product_images_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."product_occasion_map"
    ADD CONSTRAINT "product_occasion_map_pkey" PRIMARY KEY ("product_id", "occasion_id");



ALTER TABLE ONLY "public"."product_occasion_mapping"
    ADD CONSTRAINT "product_occasion_mapping_pkey" PRIMARY KEY ("product_id", "occasion_id");



ALTER TABLE ONLY "public"."product_tag_map"
    ADD CONSTRAINT "product_tag_map_pkey" PRIMARY KEY ("product_id", "tag_id");



ALTER TABLE ONLY "public"."product_variants"
    ADD CONSTRAINT "product_variants_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."product_variants"
    ADD CONSTRAINT "product_variants_sku_key" UNIQUE ("sku");



ALTER TABLE ONLY "public"."products"
    ADD CONSTRAINT "products_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."products"
    ADD CONSTRAINT "products_seo_slug_key" UNIQUE ("seo_slug");



ALTER TABLE ONLY "public"."products"
    ADD CONSTRAINT "products_slug_key" UNIQUE ("slug");



ALTER TABLE ONLY "public"."profiles"
    ADD CONSTRAINT "profiles_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."reviews"
    ADD CONSTRAINT "reviews_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."search_keywords"
    ADD CONSTRAINT "search_keywords_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."tags"
    ADD CONSTRAINT "tags_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."tags"
    ADD CONSTRAINT "tags_slug_key" UNIQUE ("slug");



ALTER TABLE ONLY "public"."wishlist"
    ADD CONSTRAINT "wishlist_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."wishlist"
    ADD CONSTRAINT "wishlist_user_id_product_id_key" UNIQUE ("user_id", "product_id");



ALTER TABLE ONLY "public"."addresses"
    ADD CONSTRAINT "addresses_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."profiles"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."blogs"
    ADD CONSTRAINT "blogs_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "public"."categories"("id") ON DELETE SET NULL;



ALTER TABLE ONLY "public"."cart_items"
    ADD CONSTRAINT "cart_items_cart_id_fkey" FOREIGN KEY ("cart_id") REFERENCES "public"."cart"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."cart_items"
    ADD CONSTRAINT "cart_items_variant_id_fkey" FOREIGN KEY ("variant_id") REFERENCES "public"."product_variants"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."cart"
    ADD CONSTRAINT "cart_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."orders"
    ADD CONSTRAINT "fk_orders_user_id" FOREIGN KEY ("user_id") REFERENCES "public"."profiles"("id") ON DELETE SET NULL;



ALTER TABLE ONLY "public"."order_items"
    ADD CONSTRAINT "order_items_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "public"."orders"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."orders"
    ADD CONSTRAINT "orders_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."product_addons"
    ADD CONSTRAINT "product_addons_addon_product_id_fkey" FOREIGN KEY ("addon_product_id") REFERENCES "public"."products"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."product_addons"
    ADD CONSTRAINT "product_addons_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."product_category_map"
    ADD CONSTRAINT "product_category_map_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "public"."categories"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."product_category_map"
    ADD CONSTRAINT "product_category_map_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."product_category_mapping"
    ADD CONSTRAINT "product_category_mapping_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "public"."categories"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."product_category_mapping"
    ADD CONSTRAINT "product_category_mapping_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."product_collection_map"
    ADD CONSTRAINT "product_collection_map_collection_id_fkey" FOREIGN KEY ("collection_id") REFERENCES "public"."collections"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."product_collection_map"
    ADD CONSTRAINT "product_collection_map_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."product_collection_mapping"
    ADD CONSTRAINT "product_collection_mapping_collection_id_fkey" FOREIGN KEY ("collection_id") REFERENCES "public"."collections"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."product_collection_mapping"
    ADD CONSTRAINT "product_collection_mapping_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."product_components"
    ADD CONSTRAINT "product_components_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."product_images"
    ADD CONSTRAINT "product_images_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."product_occasion_map"
    ADD CONSTRAINT "product_occasion_map_occasion_id_fkey" FOREIGN KEY ("occasion_id") REFERENCES "public"."occasions"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."product_occasion_map"
    ADD CONSTRAINT "product_occasion_map_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."product_occasion_mapping"
    ADD CONSTRAINT "product_occasion_mapping_occasion_id_fkey" FOREIGN KEY ("occasion_id") REFERENCES "public"."occasions"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."product_occasion_mapping"
    ADD CONSTRAINT "product_occasion_mapping_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."product_tag_map"
    ADD CONSTRAINT "product_tag_map_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."product_tag_map"
    ADD CONSTRAINT "product_tag_map_tag_id_fkey" FOREIGN KEY ("tag_id") REFERENCES "public"."tags"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."product_variants"
    ADD CONSTRAINT "product_variants_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."products"
    ADD CONSTRAINT "products_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "public"."categories"("id") ON DELETE SET NULL;



ALTER TABLE ONLY "public"."profiles"
    ADD CONSTRAINT "profiles_id_fkey" FOREIGN KEY ("id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."reviews"
    ADD CONSTRAINT "reviews_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."reviews"
    ADD CONSTRAINT "reviews_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."profiles"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."wishlist"
    ADD CONSTRAINT "wishlist_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."wishlist"
    ADD CONSTRAINT "wishlist_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."profiles"("id") ON DELETE CASCADE;



CREATE POLICY "Admin All Blogs" ON "public"."blogs" USING (((("auth"."jwt"() -> 'user_metadata'::"text") ->> 'role'::"text") = 'admin'::"text"));



CREATE POLICY "Admin update orders" ON "public"."orders" FOR UPDATE USING (((("auth"."jwt"() -> 'user_metadata'::"text") ->> 'role'::"text") = 'admin'::"text"));



CREATE POLICY "Admins have full access" ON "public"."categories" USING (((("auth"."jwt"() -> 'user_metadata'::"text") ->> 'role'::"text") = 'admin'::"text"));



CREATE POLICY "Admins have full access" ON "public"."contact_messages" USING ("public"."is_admin"());



CREATE POLICY "Admins have full access" ON "public"."custom_requests" USING ("public"."is_admin"());



CREATE POLICY "Admins have full access" ON "public"."order_items" USING ("public"."is_admin"());



CREATE POLICY "Admins have full access" ON "public"."orders" USING ("public"."is_admin"());



CREATE POLICY "Admins have full access" ON "public"."product_images" USING (((("auth"."jwt"() -> 'user_metadata'::"text") ->> 'role'::"text") = 'admin'::"text"));



CREATE POLICY "Admins have full access" ON "public"."product_variants" USING (((("auth"."jwt"() -> 'user_metadata'::"text") ->> 'role'::"text") = 'admin'::"text"));



CREATE POLICY "Admins have full access" ON "public"."products" USING (((("auth"."jwt"() -> 'user_metadata'::"text") ->> 'role'::"text") = 'admin'::"text"));



CREATE POLICY "Admins have full access" ON "public"."profiles" USING ("public"."is_admin"());



CREATE POLICY "Admins have full access" ON "public"."reviews" USING ("public"."is_admin"());



CREATE POLICY "Admins have full access" ON "public"."search_keywords" USING ("public"."is_admin"());



CREATE POLICY "Allow Authenticated Delete" ON "public"."products" FOR DELETE USING (("auth"."role"() = 'authenticated'::"text"));



CREATE POLICY "Allow Authenticated Insert" ON "public"."products" FOR INSERT WITH CHECK (("auth"."role"() = 'authenticated'::"text"));



CREATE POLICY "Allow Public Select" ON "public"."products" FOR SELECT USING (true);



CREATE POLICY "Allow Select for Authenticated Users" ON "public"."profiles" FOR SELECT USING (true);



CREATE POLICY "Allow all operations for order_items" ON "public"."order_items" USING (true) WITH CHECK (true);



CREATE POLICY "Allow all operations for orders" ON "public"."orders" USING (true) WITH CHECK (true);



CREATE POLICY "Allow authenticated delete on products" ON "public"."products" FOR DELETE TO "authenticated" USING (true);



CREATE POLICY "Allow authenticated insert on products" ON "public"."products" FOR INSERT TO "authenticated" WITH CHECK (true);



CREATE POLICY "Allow authenticated update on products" ON "public"."products" FOR UPDATE TO "authenticated" USING (true);



CREATE POLICY "Authenticated users can insert reviews" ON "public"."reviews" FOR INSERT WITH CHECK (("auth"."role"() = 'authenticated'::"text"));



CREATE POLICY "Enable Delete Access for Products" ON "public"."products" FOR DELETE USING (true);



CREATE POLICY "Enable Insert Access for Products" ON "public"."products" FOR INSERT WITH CHECK (true);



CREATE POLICY "Enable Update Access for Products" ON "public"."products" FOR UPDATE USING (true);



CREATE POLICY "Public Insert Access" ON "public"."contact_messages" FOR INSERT WITH CHECK (true);



CREATE POLICY "Public Insert Access" ON "public"."custom_requests" FOR INSERT WITH CHECK (true);



CREATE POLICY "Public Read Access" ON "public"."categories" FOR SELECT USING (true);



CREATE POLICY "Public Read Access" ON "public"."product_images" FOR SELECT USING (true);



CREATE POLICY "Public Read Access" ON "public"."product_variants" FOR SELECT USING (true);



CREATE POLICY "Public Read Access" ON "public"."products" FOR SELECT USING (true);



CREATE POLICY "Public Read Access" ON "public"."reviews" FOR SELECT USING (("is_approved" = true));



CREATE POLICY "Public Read Access for Products" ON "public"."products" FOR SELECT USING (true);



CREATE POLICY "Public Read Blogs" ON "public"."blogs" FOR SELECT USING ((("is_published" = true) OR ((("auth"."jwt"() -> 'user_metadata'::"text") ->> 'role'::"text") = 'admin'::"text")));



CREATE POLICY "Public can view active products" ON "public"."products" FOR SELECT USING (("is_active" = true));



CREATE POLICY "Public can view approved reviews" ON "public"."reviews" FOR SELECT USING (("is_approved" = true));



CREATE POLICY "Public can view blogs" ON "public"."blogs" FOR SELECT USING (true);



CREATE POLICY "Public can view categories" ON "public"."categories" FOR SELECT USING (true);



CREATE POLICY "Public can view images" ON "public"."product_images" FOR SELECT USING (true);



CREATE POLICY "Public can view variants" ON "public"."product_variants" FOR SELECT USING (true);



CREATE POLICY "User insert order items" ON "public"."order_items" FOR INSERT WITH CHECK ((EXISTS ( SELECT 1
   FROM "public"."orders"
  WHERE (("orders"."id" = "order_items"."order_id") AND ("orders"."user_id" = "auth"."uid"())))));



CREATE POLICY "User insert own orders" ON "public"."orders" FOR INSERT WITH CHECK (("auth"."uid"() = "user_id"));



CREATE POLICY "User view own order items" ON "public"."order_items" FOR SELECT USING ((EXISTS ( SELECT 1
   FROM "public"."orders"
  WHERE (("orders"."id" = "order_items"."order_id") AND (("orders"."user_id" = "auth"."uid"()) OR ((("auth"."jwt"() -> 'user_metadata'::"text") ->> 'role'::"text") = 'admin'::"text"))))));



CREATE POLICY "User view own orders" ON "public"."orders" FOR SELECT USING ((("auth"."uid"() = "user_id") OR ((("auth"."jwt"() -> 'user_metadata'::"text") ->> 'role'::"text") = 'admin'::"text")));



CREATE POLICY "Users can delete from their own wishlist" ON "public"."wishlist" FOR DELETE USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can insert into their own wishlist" ON "public"."wishlist" FOR INSERT WITH CHECK (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can insert own reviews" ON "public"."reviews" FOR INSERT WITH CHECK (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can manage own addresses" ON "public"."addresses" USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can manage own wishlist" ON "public"."wishlist" USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can manage their own cart" ON "public"."cart" USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can manage their own cart items" ON "public"."cart_items" USING ((EXISTS ( SELECT 1
   FROM "public"."cart"
  WHERE (("cart"."id" = "cart_items"."cart_id") AND ("cart"."user_id" = "auth"."uid"())))));



CREATE POLICY "Users can read own profile" ON "public"."profiles" FOR SELECT USING (("auth"."uid"() = "id"));



CREATE POLICY "Users can update own profile" ON "public"."profiles" FOR UPDATE USING (("auth"."uid"() = "id"));



CREATE POLICY "Users can view their own wishlist" ON "public"."wishlist" FOR SELECT USING (("auth"."uid"() = "user_id"));



ALTER TABLE "public"."addresses" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."blogs" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."cart" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."cart_items" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."categories" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."collections" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."contact_messages" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."custom_requests" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."occasions" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."order_items" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."orders" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."product_addons" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."product_category_map" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."product_category_mapping" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."product_collection_map" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."product_collection_mapping" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."product_components" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."product_images" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."product_occasion_map" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."product_occasion_mapping" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."product_tag_map" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."product_variants" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."products" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."profiles" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."reviews" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."search_keywords" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."tags" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."wishlist" ENABLE ROW LEVEL SECURITY;




ALTER PUBLICATION "supabase_realtime" OWNER TO "postgres";


GRANT USAGE ON SCHEMA "public" TO "postgres";
GRANT USAGE ON SCHEMA "public" TO "anon";
GRANT USAGE ON SCHEMA "public" TO "authenticated";
GRANT USAGE ON SCHEMA "public" TO "service_role";






















































































































































GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "anon";
GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "service_role";



GRANT ALL ON FUNCTION "public"."is_admin"() TO "anon";
GRANT ALL ON FUNCTION "public"."is_admin"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."is_admin"() TO "service_role";



GRANT ALL ON FUNCTION "public"."rls_auto_enable"() TO "anon";
GRANT ALL ON FUNCTION "public"."rls_auto_enable"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."rls_auto_enable"() TO "service_role";


















GRANT ALL ON TABLE "public"."addresses" TO "anon";
GRANT ALL ON TABLE "public"."addresses" TO "authenticated";
GRANT ALL ON TABLE "public"."addresses" TO "service_role";



GRANT ALL ON TABLE "public"."blogs" TO "anon";
GRANT ALL ON TABLE "public"."blogs" TO "authenticated";
GRANT ALL ON TABLE "public"."blogs" TO "service_role";



GRANT ALL ON TABLE "public"."cart" TO "anon";
GRANT ALL ON TABLE "public"."cart" TO "authenticated";
GRANT ALL ON TABLE "public"."cart" TO "service_role";



GRANT ALL ON TABLE "public"."cart_items" TO "anon";
GRANT ALL ON TABLE "public"."cart_items" TO "authenticated";
GRANT ALL ON TABLE "public"."cart_items" TO "service_role";



GRANT ALL ON TABLE "public"."categories" TO "anon";
GRANT ALL ON TABLE "public"."categories" TO "authenticated";
GRANT ALL ON TABLE "public"."categories" TO "service_role";



GRANT ALL ON TABLE "public"."collections" TO "anon";
GRANT ALL ON TABLE "public"."collections" TO "authenticated";
GRANT ALL ON TABLE "public"."collections" TO "service_role";



GRANT ALL ON TABLE "public"."contact_messages" TO "anon";
GRANT ALL ON TABLE "public"."contact_messages" TO "authenticated";
GRANT ALL ON TABLE "public"."contact_messages" TO "service_role";



GRANT ALL ON TABLE "public"."custom_requests" TO "anon";
GRANT ALL ON TABLE "public"."custom_requests" TO "authenticated";
GRANT ALL ON TABLE "public"."custom_requests" TO "service_role";



GRANT ALL ON TABLE "public"."occasions" TO "anon";
GRANT ALL ON TABLE "public"."occasions" TO "authenticated";
GRANT ALL ON TABLE "public"."occasions" TO "service_role";



GRANT ALL ON TABLE "public"."order_items" TO "anon";
GRANT ALL ON TABLE "public"."order_items" TO "authenticated";
GRANT ALL ON TABLE "public"."order_items" TO "service_role";



GRANT ALL ON TABLE "public"."orders" TO "anon";
GRANT ALL ON TABLE "public"."orders" TO "authenticated";
GRANT ALL ON TABLE "public"."orders" TO "service_role";



GRANT ALL ON TABLE "public"."product_addons" TO "anon";
GRANT ALL ON TABLE "public"."product_addons" TO "authenticated";
GRANT ALL ON TABLE "public"."product_addons" TO "service_role";



GRANT ALL ON TABLE "public"."product_category_map" TO "anon";
GRANT ALL ON TABLE "public"."product_category_map" TO "authenticated";
GRANT ALL ON TABLE "public"."product_category_map" TO "service_role";



GRANT ALL ON TABLE "public"."product_category_mapping" TO "anon";
GRANT ALL ON TABLE "public"."product_category_mapping" TO "authenticated";
GRANT ALL ON TABLE "public"."product_category_mapping" TO "service_role";



GRANT ALL ON TABLE "public"."product_collection_map" TO "anon";
GRANT ALL ON TABLE "public"."product_collection_map" TO "authenticated";
GRANT ALL ON TABLE "public"."product_collection_map" TO "service_role";



GRANT ALL ON TABLE "public"."product_collection_mapping" TO "anon";
GRANT ALL ON TABLE "public"."product_collection_mapping" TO "authenticated";
GRANT ALL ON TABLE "public"."product_collection_mapping" TO "service_role";



GRANT ALL ON TABLE "public"."product_components" TO "anon";
GRANT ALL ON TABLE "public"."product_components" TO "authenticated";
GRANT ALL ON TABLE "public"."product_components" TO "service_role";



GRANT ALL ON TABLE "public"."product_images" TO "anon";
GRANT ALL ON TABLE "public"."product_images" TO "authenticated";
GRANT ALL ON TABLE "public"."product_images" TO "service_role";



GRANT ALL ON TABLE "public"."product_occasion_map" TO "anon";
GRANT ALL ON TABLE "public"."product_occasion_map" TO "authenticated";
GRANT ALL ON TABLE "public"."product_occasion_map" TO "service_role";



GRANT ALL ON TABLE "public"."product_occasion_mapping" TO "anon";
GRANT ALL ON TABLE "public"."product_occasion_mapping" TO "authenticated";
GRANT ALL ON TABLE "public"."product_occasion_mapping" TO "service_role";



GRANT ALL ON TABLE "public"."product_tag_map" TO "anon";
GRANT ALL ON TABLE "public"."product_tag_map" TO "authenticated";
GRANT ALL ON TABLE "public"."product_tag_map" TO "service_role";



GRANT ALL ON TABLE "public"."product_variants" TO "anon";
GRANT ALL ON TABLE "public"."product_variants" TO "authenticated";
GRANT ALL ON TABLE "public"."product_variants" TO "service_role";



GRANT ALL ON TABLE "public"."products" TO "anon";
GRANT ALL ON TABLE "public"."products" TO "authenticated";
GRANT ALL ON TABLE "public"."products" TO "service_role";



GRANT ALL ON TABLE "public"."profiles" TO "anon";
GRANT ALL ON TABLE "public"."profiles" TO "authenticated";
GRANT ALL ON TABLE "public"."profiles" TO "service_role";



GRANT ALL ON TABLE "public"."reviews" TO "anon";
GRANT ALL ON TABLE "public"."reviews" TO "authenticated";
GRANT ALL ON TABLE "public"."reviews" TO "service_role";



GRANT ALL ON TABLE "public"."search_keywords" TO "anon";
GRANT ALL ON TABLE "public"."search_keywords" TO "authenticated";
GRANT ALL ON TABLE "public"."search_keywords" TO "service_role";



GRANT ALL ON TABLE "public"."tags" TO "anon";
GRANT ALL ON TABLE "public"."tags" TO "authenticated";
GRANT ALL ON TABLE "public"."tags" TO "service_role";



GRANT ALL ON TABLE "public"."wishlist" TO "anon";
GRANT ALL ON TABLE "public"."wishlist" TO "authenticated";
GRANT ALL ON TABLE "public"."wishlist" TO "service_role";









ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "service_role";



































