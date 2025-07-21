## 🚀 Features

## 📦 Prerequisites

- Node.js 18.17 or later
- npm or yarn package manager

## 🛠️ Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/naveenda/shacn-nextjs-dashboard.git
   cd shacn-nextjs-dashboard
   ```

2. Install dependencies:

   ```bash
   npm install
   # or
   yarn install
   ```

3. Run the development server:

   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 📁 Project Structure

```
├── app/
│   ├── (auth)/        # Authentication related pages
│   ├── (dashboard)/   # Dashboard pages and layouts
│   └── layout.tsx     # Root layout
├── components/
│   ├── ui/           # shadcn/ui components
│   └── shared/       # Shared components
├── lib/
│   ├── types/        # TypeScript types/interfaces
│   └── utils/        # Utility functions
└── public/
    └── images/       # Static images
```

## 🎨 Customization

This project uses shadcn/ui components which are fully customizable. You can modify the theme in:

- `app/globals.css` - For global styles
- `components.json` - For component configurations

## 📚 Documentation

For detailed documentation about the used technologies:

- [Next.js Documentation](https://nextjs.org/docs)
- [shadcn/ui Documentation](https://ui.shadcn.com)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
