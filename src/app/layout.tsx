import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import {
  ClerkProvider,
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/nextjs";
import Link from "next/link";
import { Code } from "lucide-react";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "GitGud - Coding Interview Journal",
  description: "Track your coding interview preparation with brutal honesty",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen bg-background text-foreground`}
        >
          <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex h-16 items-center justify-between">
                <div className="flex items-center space-x-8">
                  <Link href="/" className="flex items-center space-x-2">
                    <div className="h-8 w-8 rounded bg-foreground flex items-center justify-center">
                      <Code className="h-4 w-4 text-background" />
                    </div>
                    <span className="font-bold text-xl">GitGud</span>
                  </Link>
                  <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
                    <SignedIn>
                      <Link
                        href="/"
                        className="transition-colors hover:text-foreground text-muted-foreground"
                      >
                        Dashboard
                      </Link>
                      <Link
                        href="/problems"
                        className="transition-colors hover:text-foreground text-muted-foreground"
                      >
                        Problems
                      </Link>
                    </SignedIn>
                  </nav>
                </div>
                <div className="flex items-center space-x-4">
                  <SignedOut>
                    <SignInButton>
                      <button className="text-sm font-medium transition-colors hover:text-foreground text-muted-foreground">
                        Sign In
                      </button>
                    </SignInButton>
                    <SignUpButton>
                      <button className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-9 px-4">
                        Sign Up
                      </button>
                    </SignUpButton>
                  </SignedOut>
                  <SignedIn>
                    <UserButton />
                  </SignedIn>
                </div>
              </div>
            </div>
          </header>
          <main className="flex-1">{children}</main>
        </body>
      </html>
    </ClerkProvider>
  );
}
