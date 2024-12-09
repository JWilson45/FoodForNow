import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export const metadata = {
  title: 'FoodForNow',
  description: 'Welcome to the future of food',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        {/* Metadata */}
        <title>{metadata.title}</title>
        <meta name="description" content={metadata.description} />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </head>
      <body className="bg-background text-foreground font-sans">
        {/* Sticky header for consistent navigation */}
        <div className="sticky top-0 z-50 bg-black shadow-lg">
          <Header />
        </div>

        {/* Main content */}
        <main className="min-h-screen p-4">{children}</main>

        {/* Footer */}
        <Footer />
      </body>
    </html>
  );
}
