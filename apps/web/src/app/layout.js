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
