🌍 TopPicks Travels – Tourism Management Platform

TopPicks Travels is a production-ready tourism platform designed to manage tours, transfers, destinations, bookings, and multilingual content with a strong focus on scalability, security, performance, and SEO.

🚀 Live Website:
👉 https://toppickstravels.com

📌 Project Overview

The platform is divided into two fully integrated systems:

🧳 Client Website

Browse tours & transfers

SEO-friendly pages with slug-based URLs

Multi-language content

Booking requests with email notifications

Fully responsive design (mobile, tablet, desktop)

🛠️ Admin Dashboard

Full content management (Tours, Destinations, Transfers, Categories)

Multi-language management (dynamic, no hardcoded text)

Image & media galleries

SEO control per page (Meta Title, Meta Description, Meta Keywords)

Booking management

Role-based protected access

🧱 System Architecture
Backend

Clean / Layered Architecture
(API → Service → Repository → Core)

Repository + Unit of Work + Specification Pattern

DTO-based API design

Dependency Injection & SOLID principles

Frontend

Standalone-first Angular architecture

Feature-based structure (Client / Admin)

Lazy-loaded routes & components

SSR with full client hydration

🛠️ Tech Stack
Backend

ASP.NET Core Web API (.NET 8)

C#

Entity Framework Core

SQL Server

Redis (Caching)

JWT Authentication (HttpOnly Cookies)

ASP.NET Core Identity

Swagger (API Documentation)

Frontend

Angular 17

TypeScript

Angular Signals

Angular SSR (@angular/ssr)

Bootstrap 5

RxJS

Reactive Forms

DevOps & Tools

Git & GitHub

Netlify (Frontend Deployment)

The frontend proxies `/api/*` requests through its own origin on Vercel and Netlify deployments. Keep the backend auth cookie host-only (do not set a fixed `Domain`) so Safari can use the HttpOnly cookie without relying on third-party cookies.

Production HTTPS domain

SMTP Email Integration

🔐 Authentication & Security

JWT-based authentication

Tokens stored in HttpOnly Secure Cookies

Role-based authorization

Protected admin routes

Secure CORS configuration

HTTPS-only communication

🌐 Internationalization (i18n)

Fully dynamic multi-language system
Supported languages:
🇬🇧 English | 🇩🇪 German | 🇳🇱 Dutch

Language handled on both backend & frontend

Admin-controlled translations

No static or hardcoded content

⚡ Performance Optimizations
Backend

Redis caching with custom caching attributes

Server-side pagination

Optimized EF Core queries

Async/Await across all I/O operations

Image optimization (WebP, resizing, compression)

Frontend

Server-Side Rendering (SSR)

Lazy loading for routes & components

Client hydration

Optimized builds for SEO & Lighthouse scores

📈 SEO Features

Server-Side Rendering (SSR)

Dynamic Meta Tags

Open Graph tags

Sitemap.xml

SEO-friendly slug-based routing

Admin-controlled SEO metadata

✉️ Booking & Email System

Booking requests linked to tours

SMTP email notifications to admin

Booking data stored in database

Admin management dashboard for bookings

📂 Frontend Repository

👉 https://github.com/mahmoudali-ops/TourSitaTopPicks

🧑‍💻 Author

Mahmoud Ali
Full Stack .NET & Angular Developer

⭐ Notes

This is a real production project, not a demo.

Actively deployed and running with real users.

Built with enterprise-level patterns and best practices.
