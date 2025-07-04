git # Number Facts App

A modern, multilingual Next.js application that provides interesting facts about numbers. Built with TypeScript, Redux Toolkit, RTK Query, and next-intl for internationalization.

## 🌟 Features

- **Multi-language Support**: English, Russian, and Uzbek
- **Number Facts**: Get interesting facts about any number
- **Multiple Categories**: Trivia, Math, and Date facts
- **Random Facts**: Generate random number facts
- **Favorites System**: Save your favorite facts
- **Search History**: Track your previous searches
- **Dark/Light Theme**: Toggle between themes
- **Responsive Design**: Works on all devices
- **Offline Support**: Fallback facts when API is unavailable

## 🚀 Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **State Management**: Redux Toolkit + RTK Query
- **Internationalization**: next-intl
- **Styling**: Tailwind CSS + shadcn/ui
- **Icons**: Lucide React
- **Notifications**: Sonner

## 📦 Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd number-fact
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Run the development server**

   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🏗️ Project Structure

```
src/
├── app/
│   ├── [locale]/           # Internationalized routes
│   │   ├── layout.tsx      # Root layout with i18n
│   │   └── page.tsx        # Main page
│   ├── globals.css         # Global styles
│   └── providers.tsx       # Redux provider
├── components/
│   ├── ui/                 # shadcn/ui components
│   ├── NumberFactForm.tsx  # Main form component
│   ├── NumberFactResult.tsx # Result display
│   ├── FavoritesList.tsx   # Favorites management
│   ├── HistoryList.tsx     # Search history
│   ├── ThemeToggle.tsx     # Theme switcher
│   ├── LangSelect.tsx      # Language selector
│   └── LoadingSpinner.tsx  # Loading component
├── lib/
│   ├── api.ts              # API utilities
│   ├── storage.ts          # Local storage utilities
│   └── validation.ts       # Form validation
├── redux/
│   ├── store.ts            # Redux store configuration
│   └── features/           # Redux slices
│       ├── themeSlice.ts   # Theme state
│       ├── favoritesSlice.ts # Favorites state
│       ├── historySlice.ts # History state
│       └── localeSlice.ts  # Locale state
├── services/
│   └── numberFactsApi.ts   # RTK Query API service
├── types/
│   └── index.ts            # TypeScript type definitions
├── i18n/
│   ├── config.ts           # i18n configuration
│   └── index.ts            # i18n setup
└── messages/               # Translation files
    ├── en.json             # English translations
    ├── ru.json             # Russian translations
    └── uz.json             # Uzbek translations
```

## 🌍 Internationalization

The app supports three languages:

- **English** (`/en`)
- **Russian** (`/ru`)
- **Uzbek** (`/uz`)

Language switching is handled by the middleware, which automatically redirects the root path to the default locale.

## 🎨 Theming

The app supports:

- **Light Theme**: Clean, bright interface
- **Dark Theme**: Easy on the eyes
- **System Theme**: Automatically follows system preference

## 📱 Usage

### Getting Number Facts

1. **Enter a number** in the input field
2. **Select a category**:
   - **Trivia**: Interesting general facts
   - **Math**: Mathematical properties
   - **Date**: Date-related facts
3. **Click "Find fact"** to get your fact
4. **Use "Random number"** for surprise facts

### Managing Favorites

- **Add to favorites**: Click the heart icon on any fact
- **View favorites**: Switch to the "Favorites" tab
- **Remove from favorites**: Click the heart icon again
- **Clear all**: Use the "Clear" button

### Viewing History

- **Search history**: Automatically saved
- **View history**: Switch to the "History" tab
- **Clear history**: Use the "Clear" button

## 🔧 Configuration

### Environment Variables

Create a `.env.local` file:

```env
# API Configuration
NEXT_PUBLIC_API_BASE_URL=https://numbersapi.com
NEXT_PUBLIC_API_TIMEOUT=5000

# App Configuration
NEXT_PUBLIC_DEFAULT_LOCALE=en
NEXT_PUBLIC_SUPPORTED_LOCALES=en,ru,uz
```

### Customization

#### Adding New Languages

1. Add locale to `src/i18n/config.ts`:

   ```typescript
   export const locales = ["en", "ru", "uz", "fr"] as const;
   ```

2. Create translation file `src/messages/fr.json`

3. Update locale names and flags in config

#### Adding New Fact Categories

1. Update `FactCategory` type in `src/types/index.ts`
2. Add category to form options in `NumberFactForm.tsx`
3. Add translations for the new category

## 🚀 Deployment

### Vercel (Recommended)

1. **Connect your repository** to Vercel
2. **Set environment variables** in Vercel dashboard
3. **Deploy** - Vercel will automatically build and deploy

### Other Platforms

The app can be deployed to any platform that supports Next.js:

```bash
npm run build
npm start
```

## 🧪 Development

### Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run type-check   # Run TypeScript check
```

### Code Quality

- **ESLint**: Code linting and formatting
- **TypeScript**: Type safety and IntelliSense
- **Prettier**: Code formatting (configured via ESLint)

## 🤝 Contributing

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Commit your changes**: `git commit -m 'Add amazing feature'`
4. **Push to the branch**: `git push origin feature/amazing-feature`
5. **Open a Pull Request**

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **NumbersAPI**: For providing number facts (with fallback support)
- **shadcn/ui**: For beautiful UI components
- **next-intl**: For internationalization support
- **Redux Toolkit**: For state management
- **Tailwind CSS**: For styling

## 📞 Support

If you encounter any issues or have questions:

1. **Check the issues** on GitHub
2. **Create a new issue** with detailed information
3. **Contact the maintainers**

---

**Made with ❤️ using Next.js, TypeScript, and modern web technologies**
