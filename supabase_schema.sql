-- Supabase Schema for E-Commerce Showcase

-- 1. Create the products table
CREATE TABLE IF NOT EXISTS public.products (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  price numeric NOT NULL,
  storage text NOT NULL,
  warranty text NOT NULL,
  color text,
  description text,
  images text[] DEFAULT '{}',
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Note: Jika Anda sebelumnya menggunakan "image_url" atau belum memiliki "color"/"description", jalankan query di bawah ini:
-- ALTER TABLE public.products ADD COLUMN images text[] DEFAULT '{}';
-- UPDATE public.products SET images = ARRAY[image_url] WHERE image_url IS NOT NULL;
-- ALTER TABLE public.products DROP COLUMN image_url;
-- ALTER TABLE public.products ADD COLUMN color text;
-- ALTER TABLE public.products ADD COLUMN description text;

-- 2. Setup RLS (Row Level Security)
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- 3. Create policies
-- Policy: Allow anyone to view products (Public Read)
CREATE POLICY "Allow public read access to products"
ON public.products FOR SELECT
TO public
USING (true);

-- Policy: Allow authenticated users to insert (Admin Write)
CREATE POLICY "Allow authenticated users to insert products"
ON public.products FOR INSERT
TO authenticated
WITH CHECK (true);

-- Policy: Allow authenticated users to update (Admin Write)
CREATE POLICY "Allow authenticated users to update products"
ON public.products FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

-- Policy: Allow authenticated users to delete (Admin Write)
CREATE POLICY "Allow authenticated users to delete products"
ON public.products FOR DELETE
TO authenticated
USING (true);

-- 4. Storage Bucket Setup
-- Note: You should create a storage bucket named "products" in the Supabase Dashboard.
-- Alternatively, you can run this SQL command:
INSERT INTO storage.buckets (id, name, public) VALUES ('products', 'products', true) ON CONFLICT DO NOTHING;

-- 5. Storage Policies
-- Policy: Allow public read access to product images
CREATE POLICY "Allow public read access to product images"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'products');

-- Policy: Allow authenticated users to upload product images
CREATE POLICY "Allow authenticated users to upload product images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'products');

CREATE POLICY "Allow authenticated users to update product images"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'products');

CREATE POLICY "Allow authenticated users to delete product images"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'products');

-- 6. Create the testimonials table
CREATE TABLE IF NOT EXISTS public.testimonials (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_name text,
  product_name text,
  image_url text NOT NULL,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 7. Setup RLS for testimonials
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access to testimonials"
ON public.testimonials FOR SELECT
TO public
USING (true);

CREATE POLICY "Allow authenticated users to insert testimonials"
ON public.testimonials FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "Allow authenticated users to update testimonials"
ON public.testimonials FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

CREATE POLICY "Allow authenticated users to delete testimonials"
ON public.testimonials FOR DELETE
TO authenticated
USING (true);

-- 8. Storage Bucket for Testimonial Images
INSERT INTO storage.buckets (id, name, public) VALUES ('testimonials', 'testimonials', true) ON CONFLICT DO NOTHING;

CREATE POLICY "Allow public read access to testimonial images"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'testimonials');

CREATE POLICY "Allow authenticated users to upload testimonial images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'testimonials');

CREATE POLICY "Allow authenticated users to delete testimonial images"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'testimonials');
