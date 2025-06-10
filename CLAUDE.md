# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a portfolio website for hand model 심수연 (Shim Su-yeon) built with SvelteKit and Supabase. The project features a responsive image gallery with advanced positioning controls, a complete admin CMS, and optimized performance.

## Development Commands

```bash
# Development
npm run dev          # Start dev server with hot reload (includes sitemap generation)

# Production
npm run build        # Build for production
npm run preview      # Preview production build locally

# Code Quality
npm run check        # Run svelte-check for type checking
npm run lint         # Run Prettier and ESLint
npm run format       # Auto-format code with Prettier

# Utilities
npm run generate-sitemap  # Manually generate sitemap.xml
```

## Architecture Overview

### Tech Stack
- **Frontend**: SvelteKit 2.7.1 with TypeScript
- **Styling**: TailwindCSS + DaisyUI design system
- **Database**: Supabase (PostgreSQL with Row Level Security)
- **Deployment**: Vercel with Edge Functions
- **Animations**: GSAP 3.12.5

### Key Database Tables
- `posts`: Portfolio items with images, categories, and metadata
- `categories`: Post categorization system
- `main_images`: Hero section and main page images
- `page_contents`: Dynamic page content stored as JSON
- `contact_forms`: Contact form submissions
- `users`: Admin user management

### Critical Components

1. **ImagePositioner** (`src/lib/components/ui/ImagePositioner.svelte`)
   - Custom component for precise image positioning within containers
   - Uses scale and position controls for thumbnail optimization
   - Critical for portfolio presentation

2. **PostDetail** (`src/lib/components/my-ui/post/PostDetail.svelte`)
   - Handles post display with navigation between posts
   - Manages image galleries and metadata

3. **CategoryFilter** (`src/lib/components/ui/CategoryFilter.svelte`)
   - Dynamic filtering system for portfolio items
   - Integrates with post store for reactive updates

4. **Admin System** (`src/routes/admin/`)
   - Complete CMS with authentication
   - CRUD operations for posts, categories, and images
   - Protected routes with Supabase auth

### State Management
- Uses Svelte stores (`src/lib/stores/postStore.ts`) for global state
- Categories and posts are cached for performance

## Important Development Notes

### Image Handling
- All images are stored in Supabase Storage
- Thumbnail positioning is crucial - use ImagePositioner for precise control
- Images should be optimized before upload

### Authentication
- Admin routes require Supabase authentication
- Auth state is managed through Supabase client
- Remember to handle auth redirects properly

### SEO Considerations
- Sitemap is auto-generated on dev/build
- Meta tags are handled in individual routes
- Korean language is primary, ensure proper UTF-8 encoding

### Performance
- Use Vercel Image Optimization for production
- Implement lazy loading for gallery images
- GSAP animations should be cleaned up on component destroy

### Testing Changes
- Always test responsive behavior, especially mobile
- Verify admin functionality after auth changes
- Check image positioning on different screen sizes
- Test category filtering with various combinations

### Common Tasks
- **Adding new posts**: Use admin panel at `/admin/posts/add`
- **Updating categories**: Manage through `/admin/categories`
- **Modifying hero images**: Update via `/admin/images`
- **Changing page content**: Edit through `/admin/pages`

### Environment Variables
Required in `.env` file:
- `PUBLIC_SUPABASE_URL`
- `PUBLIC_SUPABASE_ANON_KEY`
- `PRIVATE_SUPABASE_SERVICE_KEY`