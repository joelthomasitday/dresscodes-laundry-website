"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Menu, X } from "lucide-react"
import { usePathname } from "next/navigation"

interface NavigationProps {
  variant?: "glass" | "solid" | "dark"
}

export function Navigation({ variant = "solid" }: NavigationProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const pathname = usePathname()

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  const isActive = (path: string) => {
    return pathname === path
  }

  const navItems = [
    { href: "/", label: "Home" },
    { href: "/services", label: "Services" },
    { href: "/booking", label: "Book Now" },
    { href: "/about", label: "About" },
    { href: "/blog", label: "Blog" },
    { href: "/contact", label: "Contact" },
  ]

  // Dark variant (for homepage with light background image)
  if (variant === "dark") {
    return (
      <nav
        className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-white/10 border-b border-black/10 shadow-2xl"
        role="navigation"
        aria-label="Main navigation"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center">
              <Link
                href="/"
                className="text-2xl font-bold text-black drop-shadow-sm"
                aria-label="Dresscode Laundry Home"
              >
                DRESSCODE
              </Link>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleMobileMenu}
                className="text-black hover:text-gray-700 hover:bg-black/10 backdrop-blur-sm rounded-full"
                aria-label={isMobileMenuOpen ? "Close mobile menu" : "Open mobile menu"}
                aria-expanded={isMobileMenuOpen}
              >
                {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
            </div>

            {/* Desktop navigation */}
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-1">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`px-4 py-3 text-sm font-medium transition-all duration-300 rounded-xl hover:bg-black/10 backdrop-blur-sm drop-shadow-sm ${
                      isActive(item.href)
                        ? "text-black font-semibold hover:text-gray-700"
                        : "text-black/80 hover:text-black"
                    }`}
                    aria-current={isActive(item.href) ? "page" : undefined}
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Button
                asChild
                className="bg-gradient-to-r from-emerald-500 to-emerald-900 hover:from-emerald-600 hover:to-emerald-800 backdrop-blur-sm border border-emerald-400/30 text-white shadow-lg transition-all duration-300 hover:shadow-xl rounded-full"
              >
                <Link href="/booking">Schedule Pickup</Link>
              </Button>
            </div>
          </div>

          {/* Mobile Navigation Menu */}
          {isMobileMenuOpen && (
            <div className="md:hidden absolute top-full left-0 right-0 backdrop-blur-xl bg-white/20 border-b border-black/10 shadow-2xl">
              <div className="px-4 py-6 space-y-2">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`block px-4 py-3 text-base font-medium transition-all duration-300 rounded-xl hover:bg-black/10 backdrop-blur-sm ${
                      isActive(item.href)
                        ? "text-black font-semibold hover:text-gray-700"
                        : "text-black/80 hover:text-black"
                    }`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {item.label}
                  </Link>
                ))}
                <div className="pt-4 border-t border-black/10">
                  <Button
                    asChild
                    className="w-full bg-gradient-to-r from-emerald-500 to-emerald-900 hover:from-emerald-600 hover:to-emerald-800 text-white rounded-full"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Link href="/booking">Schedule Pickup</Link>
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </nav>
    )
  }

  // Glass variant (for homepage with background image)
  if (variant === "glass") {
    return (
      <nav
        className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-white/5 border-b border-white/10 shadow-2xl"
        role="navigation"
        aria-label="Main navigation"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center">
              <Link
                href="/"
                className="text-2xl font-bold text-white drop-shadow-lg"
                aria-label="Dresscode Laundry Home"
              >
                DRESSCODE
              </Link>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleMobileMenu}
                className="text-white/90 hover:text-white hover:bg-white/10 backdrop-blur-sm rounded-full"
                aria-label={isMobileMenuOpen ? "Close mobile menu" : "Open mobile menu"}
                aria-expanded={isMobileMenuOpen}
              >
                {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
            </div>

            {/* Desktop navigation */}
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-1">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`px-4 py-3 text-sm font-medium transition-all duration-300 rounded-xl hover:bg-white/10 backdrop-blur-sm drop-shadow-sm ${
                      isActive(item.href)
                        ? "text-white font-semibold hover:text-emerald-200"
                        : "text-white/80 hover:text-white"
                    }`}
                    aria-current={isActive(item.href) ? "page" : undefined}
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Button
                asChild
                className="bg-gradient-to-r from-emerald-500 to-emerald-900 hover:from-emerald-600 hover:to-emerald-800 backdrop-blur-sm border border-emerald-400/30 text-white shadow-lg transition-all duration-300 hover:shadow-xl rounded-full"
              >
                <Link href="/booking">Schedule Pickup</Link>
              </Button>
            </div>
          </div>

          {/* Mobile Navigation Menu */}
          {isMobileMenuOpen && (
            <div className="md:hidden absolute top-full left-0 right-0 backdrop-blur-xl bg-white/10 border-b border-white/10 shadow-2xl">
              <div className="px-4 py-6 space-y-2">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`block px-4 py-3 text-base font-medium transition-all duration-300 rounded-xl hover:bg-white/10 backdrop-blur-sm ${
                      isActive(item.href)
                        ? "text-white font-semibold hover:text-emerald-200"
                        : "text-white/80 hover:text-white"
                    }`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {item.label}
                  </Link>
                ))}
                <div className="pt-4 border-t border-white/10">
                  <Button
                    asChild
                    className="w-full bg-gradient-to-r from-emerald-500 to-emerald-900 hover:from-emerald-600 hover:to-emerald-800 text-white rounded-full"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Link href="/booking">Schedule Pickup</Link>
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </nav>
    )
  }

  // Solid variant (for other pages with white background)
  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-white/95 border-b border-gray-200/50 shadow-lg"
      role="navigation"
      aria-label="Main navigation"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <div className="flex items-center">
            <Link
              href="/"
              className="text-2xl font-bold bg-gradient-to-r from-emerald-500 to-emerald-900 bg-clip-text text-transparent"
              aria-label="Dresscode Laundry Home"
            >
              DRESSCODE
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleMobileMenu}
              className="text-gray-700 hover:text-emerald-600 hover:bg-emerald-50 backdrop-blur-sm rounded-full"
              aria-label={isMobileMenuOpen ? "Close mobile menu" : "Open mobile menu"}
              aria-expanded={isMobileMenuOpen}
            >
              {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>

          {/* Desktop navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-1">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`px-4 py-3 text-sm font-medium transition-all duration-300 rounded-xl hover:bg-emerald-50 backdrop-blur-sm ${
                    isActive(item.href)
                      ? "text-emerald-600 font-semibold bg-emerald-50"
                      : "text-gray-700 hover:text-emerald-600"
                  }`}
                  aria-current={isActive(item.href) ? "page" : undefined}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Button
              asChild
              className="bg-gradient-to-r from-emerald-500 to-emerald-900 hover:from-emerald-600 hover:to-emerald-800 text-white transition-all duration-300 rounded-full"
            >
              <Link href="/booking">Schedule Pickup</Link>
            </Button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden absolute top-full left-0 right-0 backdrop-blur-xl bg-white/98 border-b border-gray-200/50 shadow-lg">
            <div className="px-4 py-6 space-y-2">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`block px-4 py-3 text-base font-medium transition-all duration-300 rounded-xl hover:bg-emerald-50 backdrop-blur-sm ${
                    isActive(item.href)
                      ? "text-emerald-600 font-semibold bg-emerald-50"
                      : "text-gray-700 hover:text-emerald-600"
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
              <div className="pt-4 border-t border-gray-200">
                <Button
                  asChild
                  className="w-full bg-gradient-to-r from-emerald-500 to-emerald-900 hover:from-emerald-600 hover:to-emerald-800 text-white rounded-full"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <Link href="/booking">Schedule Pickup</Link>
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
