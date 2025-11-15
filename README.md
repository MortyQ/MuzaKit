# 🎨 MuzaKit

<div align="center">

**Where inspiration meets development**

A modern, production-ready Vue 3 starter template with glassmorphism design

[![Vue 3](https://img.shields.io/badge/Vue-3.5-42b883?logo=vue.js)](https://vuejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178c6?logo=typescript)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-5.4-646cff?logo=vite)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-06b6d4?logo=tailwind-css)](https://tailwindcss.com/)

[Live Demo](#) • [Documentation](#) • [Examples](#)

</div>

---

## ✨ Features

### 🚀 **Modern Stack**
- **Vue 3** with Composition API and `<script setup>` syntax
- **TypeScript** for type-safe development
- **Vite** for lightning-fast HMR and optimized builds
- **Pinia** for intuitive state management
- **Vue Router** with type-safe routing and lazy loading

### 🎨 **Beautiful Design System**
- **Glassmorphism UI** with multi-layered shadows and backdrop blur
- **Light/Dark Theme** with seamless switching
- **CSS Variables** based theming system
- **Responsive Design** mobile-first approach
- **50+ Reusable Components** ready to use

### 🛠️ **Developer Experience**
- **ESLint + Prettier** configured for modern development
- **Husky** git hooks for code quality
- **Feature-based Architecture** for scalability
- **Comprehensive Documentation** for all components
- **Type-safe Everything** with full TypeScript support

### 📦 **Production Ready**
- **Optimized Build** with Vite's tree-shaking
- **Code Splitting** for optimal performance
- **SEO Friendly** with meta tags support
- **PWA Ready** (optional)
- **Deploy Anywhere** Vercel, Netlify, or any static host

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm/pnpm

### Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd muzakit

# Install dependencies
npm install
# or
pnpm install

# Start development server
npm run dev
```

Open [http://localhost:3001](http://localhost:3001) to view your app.

---

## 📂 Project Structure

```
muzakit/
├── src/
│   ├── app/              # Application core
│   │   ├── layouts/      # Layout components
│   │   └── router/       # Routing configuration
│   ├── features/         # Feature modules
│   │   ├── auth/         # Authentication feature
│   │   └── theme/        # Theme management
│   ├── pages/            # Page components
│   ├── widgets/          # Complex UI widgets
│   │   ├── sidebar/      # Sidebar widget
│   │   └── table/        # Data table widget
│   ├── shared/           # Shared resources
│   │   ├── ui/           # Reusable UI components
│   │   ├── composables/  # Vue composables
│   │   └── utils/        # Utility functions
│   └── main.ts           # Application entry
├── public/               # Static assets
└── docs/                 # Documentation
```

---

## 🎨 Glassmorphism Design

MuzaKit features a modern glassmorphism design system with:

### Available Glass Utilities

```vue
<!-- Basic glass effect -->
<div class="glass">...</div>

<!-- Strong glass (more opaque) -->
<div class="glass-strong">...</div>

<!-- Glass cards -->
<VCard variant="glass">...</VCard>
<VCard variant="glass-elevated">...</VCard>
```

### Automatic Light/Dark Theme
All glass effects automatically adjust for light and dark themes:
- **Light Theme**: Subtle purple/blue shadows
- **Dark Theme**: Glowing blue shadows for visibility

### Mobile Optimization
Glass effects are conditionally applied:
- **Desktop**: Full glassmorphism with backdrop blur
- **Mobile**: Simplified for better performance

---

## 🧩 Key Components

### UI Components
- **VButton** - Versatile button component
- **VCard** - Card with multiple variants (default, elevated, glass)
- **VModal** - Accessible modal dialogs
- **VInput** - Form input with validation
- **VTable** - Feature-rich data table
- **VIcon** - Icon component with MDI support
- **VToast** - Toast notifications

### Widgets
- **Sidebar** - Collapsible navigation sidebar
- **Table** - Advanced data table with sorting, filtering, pagination
- **Header** - Application header with theme toggle

### Features
- **Theme System** - Light/Dark mode with CSS variables
- **Authentication** - Auth guards and state management example
- **Form Validation** - Built-in validation utilities

---

## 📚 Documentation

Visit the [UI Gallery](/ui-gallery) page in the app to see all components with interactive examples.

### Component Documentation
- [VCard Usage](./docs/components/VCARD_USAGE.md)
- [VModal Usage](./docs/components/MODAL_USAGE.md)
- [VTable Full Documentation](./docs/table/TABLE_FULL_DOCUMENTATION.md)
- [Theme System](./docs/THEME_SYSTEM.md)

### Design Guidelines
- [Glassmorphism Strategy](./GLASSMORPHISM_STRATEGY.md)
- [Glass Utilities Guide](./GLASS_UTILITIES_GUIDE.md)
- [Design System Migration](./DESIGN_SYSTEM_MIGRATION_REPORT.md)

---

## 🛠️ Scripts

```bash
# Development
npm run dev          # Start dev server

# Build
npm run build        # Build for production
npm run preview      # Preview production build

# Code Quality
npm run lint         # Lint and fix code
npm run lint:check   # Check linting only
npm run format       # Format with Prettier
```

---

## 🎯 Roadmap

- [ ] Component Storybook
- [ ] E2E Testing setup
- [ ] More UI components
- [ ] CLI for component generation
- [ ] Theme builder tool

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

---

## 📝 License

MIT License - feel free to use this template for your projects!

---

## 💬 Support

- 📧 Email: [your-email]
- 🐛 Issues: [GitHub Issues](https://github.com/yourusername/muzakit/issues)
- 💬 Discussions: [GitHub Discussions](https://github.com/yourusername/muzakit/discussions)

---

<div align="center">

**Built with ❤️ and inspired by creativity**

MuzaKit - Your muse for building beautiful interfaces

[⬆ back to top](#-muzakit)

</div>

