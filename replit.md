# A2Z Game Development Website

## Overview

This is a professional casino game development website built for A2Z, a company specializing in casino and gaming platforms. The site showcases their premier product - the IND SLOT casino game - and serves as both a marketing platform and order portal. The website features authentic game screenshots, detailed service offerings, and a streamlined ordering process for their ₹1,30,000 slot game package.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
The application uses a modern React-based frontend built with Vite for fast development and optimized builds. The UI is constructed using shadcn/ui components with Radix UI primitives, providing accessible and customizable interface elements. The design system follows a casino gaming aesthetic with a dark theme, featuring authentic color palettes derived from the IND SLOTS game interface.

The frontend implements a multi-page structure using wouter for client-side routing, with dedicated pages for home, about, services, games showcase, pricing, contact, and order forms. The component architecture is modular, with reusable UI components for navigation, hero sections, service cards, and forms.

### Styling and Design System
Tailwind CSS provides the styling framework with a custom configuration that extends the default theme. The design guidelines specify a reference-based approach using authentic IND SLOTS game colors including deep teal-green backgrounds, gold accents, and orange highlights. Typography uses Google Fonts (Inter, Orbitron, Space Grotesk) with a structured spacing system based on Tailwind's 4, 8, 12, 16, 24 unit scale.

### Backend Architecture
The backend is built with Express.js using TypeScript for type safety. The server implements a modular route registration system and includes middleware for request logging and error handling. The application uses a development-optimized Vite integration for hot module replacement during development.

The backend currently implements an in-memory storage system with interfaces designed for CRUD operations on user data. This provides a foundation for future database integration while maintaining clean separation of concerns.

### Database Design
The application uses Drizzle ORM configured for PostgreSQL with a schema defining user entities. The current schema includes basic user management with username/password authentication. Database migrations are managed through Drizzle Kit, providing version control for schema changes.

### Build and Development
The project uses a modern build pipeline with Vite for frontend bundling and esbuild for backend compilation. The development setup includes TypeScript checking, hot module replacement, and automated error overlays. The production build creates optimized static assets with proper chunking and compression.

## External Dependencies

### UI and Component Libraries
- **Radix UI**: Provides accessible component primitives for dialogs, dropdowns, navigation, and form elements
- **shadcn/ui**: Component library built on Radix UI with consistent styling patterns
- **Lucide React**: Icon library for consistent iconography throughout the interface
- **TanStack React Query**: Handles server state management and API data fetching

### Development and Build Tools
- **Vite**: Frontend build tool and development server with fast HMR
- **TypeScript**: Type system for enhanced development experience and code safety
- **Tailwind CSS**: Utility-first CSS framework for responsive design
- **Drizzle ORM**: Type-safe database ORM with PostgreSQL support

### Database and Storage
- **Neon Database**: PostgreSQL-compatible serverless database (via @neondatabase/serverless)
- **Drizzle Kit**: Database migration and schema management tool

### Utilities and Helpers
- **React Hook Form**: Form state management and validation
- **Class Variance Authority**: Utility for creating component variants
- **Date-fns**: Date manipulation and formatting utilities
- **Wouter**: Lightweight client-side routing solution

The application is designed to scale from the current in-memory storage to full PostgreSQL integration while maintaining type safety and clean architectural boundaries throughout the stack.