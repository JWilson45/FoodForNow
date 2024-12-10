// page.js
'use client';
import Head from 'next/head';
import Button from '@/components/Button';

export default function LandingPage() {
  return (
    <>
      <Head>
        <title>Food For Now - Welcome</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>
      <main className="flex-grow flex flex-col items-center justify-center bg-background text-foreground">
        <section className="w-full max-w-2xl text-center p-8 bg-black/80 border-2 border-button-blue rounded-xl shadow-custom animate-fadeIn">
          <h1 className="text-4xl font-bold text-white mb-4">
            Welcome to the Future of Food
          </h1>
          <p className="text-lg text-gray-300 mb-6">
            Discover, create, and enjoy meals like never before.
          </p>
          <Button href="/signin" className="px-6 py-3">
            Get Started
          </Button>
        </section>
      </main>
    </>
  );
}
