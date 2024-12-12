// /Users/jasonwilson/git/FoodForNow/apps/web/src/app/layout.js
import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export const metadata = {
  title: 'FoodForNow',
  description: 'Welcome to the future of food',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="h-full scroll-smooth">
      <head>
        <title>{metadata.title}</title>
        <meta name="description" content={metadata.description} />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </head>
      <body>
        <Header />
        <main className="px-4 py-6 container mx-auto">{children}</main>
        <Footer />
      </body>
    </html>
  );
}

// import type { Metadata } from 'next'
// import { Inter } from 'next/font/google'
// import './globals.css'
// import { ThemeProvider } from "@/components/theme-provider"
// import { Toaster } from "@/components/ui/toaster"
// import { Header } from "@/components/header"

// const inter = Inter({ subsets: ['latin'] })

// export const metadata: Metadata = {
//   title: 'FoodForNow',
//   description: 'Manage your ingredients, recipes, and meals',
// }

// export default function RootLayout({
//   children,
// }: {
//   children: React.ReactNode
// }) {
//   return (
//     <html lang="en">
//       <head>
//         <link
//           rel="stylesheet"
//           href="https://cdnjs.cloudflare.com/ajax/libs/paper-css/0.4.1/paper.min.css"
//         />
//       </head>
//       <body className={inter.className}>
//         <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
//           <Header />
//           <div className="pt-16">
//             {children}
//           </div>
//           <Toaster />
//         </ThemeProvider>
//       </body>
//     </html>
//   )
// }
