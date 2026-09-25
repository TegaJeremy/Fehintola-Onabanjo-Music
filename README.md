# Fehintola Onabanjo – Official Website

Built with **Next.js 15**, **Tailwind CSS**, **Supabase** (database + admin login) and **Cloudinary** (photo uploads).

- Light / dark mode (moon/sun button, remembers each visitor's choice)
- 5 languages: English, Yorùbá, Igbo, Hausa, Pidgin (`/en`, `/yo`, `/ig`, `/ha`, `/pcm`)
- Animations: hero slideshow, gold mouse cursor, magnetic buttons, 3D tilt cards, scroll reveals, photo marquee, counters
- Pages: Home, Music, Videos, Events, About (bio + awards + gallery), Contact
- Songs open on **Audiomack**, videos open on **YouTube**
- Admin dashboard at **`/admin`** to add events, awards, music, videos, gallery photos, bio and social links

---

## 0. Replace the dummy content

Open **`lib/site.ts`**. Everything marked `DUMMY` is placeholder data:

- **Logo**: replace `public/logo.svg` with the real logo (same name), or put `logo.png` in `/public` and change `logo: "/logo.png"`.
- **Audiomack / Spotify / YouTube links** and **social media links**
- **Email and phone**
- **Stats** (years, songs, shows, awards) for the animated counters
- **Hero slideshow photos** (`heroSlides`) and the **Moments** photos (`carousel`)

Dummy songs, videos, events and awards live in **`lib/placeholder.ts`**. They show only while the database is empty and disappear as soon as you add real ones in the admin. To hide them completely, set `showPlaceholders: false` in `lib/site.ts`.

## 1. Run it on your computer

You need **Node.js 20 or newer** (https://nodejs.org).

```bash
npm install
cp .env.example .env.local     # on Windows: copy .env.example .env.local
npm run dev
```

Open http://localhost:3000. The site works even before Supabase is set up; the lists will simply be empty.

## 2. Set up Supabase (database + admin login)

Works with a new project or an existing one. All tables for this site start with `fo_`, so nothing else in the project is touched.

1. Go to **SQL Editor → New query**, paste everything from `supabase/schema.sql` and click **Run**. (Safe to run again after updates.)
2. Go to **Authentication → Users → Add user → Create new user**, enter the admin email and password, and tick **Auto Confirm User**.
3. Back in **SQL Editor**, run (with your email):
   ```sql
   insert into public.fo_admins (user_id, email) select id, email from auth.users where email = 'YOUR-EMAIL@example.com' on conflict do nothing;
   ```
   Only accounts in `fo_admins` can use the admin. Repeat for anyone else who should have access.
4. Go to **Project Settings → API** (or **Data API**), and copy the **Project URL** and **anon public key** into `.env.local`.

## 3. Set up Cloudinary (photo uploads)

1. Create a free account at https://cloudinary.com.
2. Copy your **Cloud name** from the dashboard into `.env.local`.
3. Go to **Settings → Upload → Upload presets → Add upload preset**, set **Signing mode: Unsigned**, save it, and copy the preset name into `.env.local`.

Restart `npm run dev` after editing `.env.local`.

## 4. Use the admin dashboard

Go to http://localhost:3000/admin and sign in.

| Section | What you can do |
|---|---|
| Events | Name, date and time, venue, city, ticket link, flyer, description |
| Awards | Award name, who gave it, year, photo, description |
| Music | Song or album title, type, **Audiomack link**, cover art, release date |
| Videos | Title and **YouTube link** (the thumbnail is added automatically) |
| Gallery | Upload photos for the About page |
| Settings & socials | Logo, the 3 home slideshow photos, tagline, bio, phone numbers, email, counters, Audiomack/YouTube links, all social links |

Text fields have a box for each language (English, Yorùbá, Igbo, Hausa, Pidgin). **Only English is required.** If a translation is empty, the site shows the English text.

## 5. Put it online (Vercel)

1. Push this folder to a GitHub repository.
2. Import it at https://vercel.com/new.
3. Add the same 4 variables from `.env.local` under **Environment Variables**.
4. Click Deploy. Connect a custom domain later under **Settings → Domains**.

---

## Where things are

```
app/
  [locale]/            Public website (one copy per language)
    page.tsx           Home: hero, photo carousel, music, events, videos, awards
    music/ events/ videos/ about/ contact/
  admin/               Admin dashboard (login protected)
    login/
    (dashboard)/       events, awards, music, videos, gallery, settings
components/            Header, Footer, cards, carousel, theme and language switchers
components/admin/      Admin forms. resources.ts lists every admin field
i18n/                  Language setup
messages/              Website text in en / ig / yo / pcm. Edit these to change wording
lib/site.ts            Artist name, default social links, and which photo goes where
lib/data.ts            Loads data from Supabase
public/images/         Web-optimised photos (originals are in _originals/)
supabase/schema.sql    Database tables and security rules
```

### Change which photo shows where

Edit `images` in `lib/site.ts`. To add new fixed photos, put them in `public/images/` and reference them as `/images/your-file.jpg`.

### Translations

Have a native speaker check the Yorùbá, Igbo, Hausa and Pidgin wording in `messages/*.json` before launch.

## Team, roles & activity log

- **Admin → Team & access**: add people (email + password), choose **Admin** (full control, can manage the team) or **Editor** (content only), change roles, reset passwords, remove people, change your own password.
  Adding brand-new accounts needs `SUPABASE_SERVICE_ROLE_KEY` in `.env.local` (Project Settings → API → `service_role`). Keep it secret – never add `NEXT_PUBLIC_` to it. On Vercel add it as an environment variable too.
- **Admin → Activity log**: every add / edit / delete (and team changes) with who did it and when. It's recorded by the database itself, so it can't be skipped or edited from the website.

## Troubleshooting: "Database error creating new user"

This comes from an existing trigger on `auth.users` in the Supabase project (usually from an older app that creates a `profiles` row for every new user). See which trigger it is:

```sql
select t.tgname as trigger_name, p.proname as function_name, pg_get_functiondef(p.oid) as code
from pg_trigger t join pg_proc p on p.oid = t.tgfoid
where t.tgrelid = 'auth.users'::regclass and not t.tgisinternal;
```

Also check **Logs → Postgres** for the exact error. Then either fix that function or make it skip errors.
