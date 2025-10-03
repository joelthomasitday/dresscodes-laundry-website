"use client"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Menu, X, Phone } from "lucide-react"
import { usePathname } from "next/navigation"
import { getTelHref, getWhatsAppHref, PHONE_DISPLAY } from "@/lib/phone"
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
  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "unset"
    }

    return () => {
      document.body.style.overflow = "unset"
    }
  }, [isMobileMenuOpen])

  const navItems = [
    { href: "/", label: "Home" },
    { href: "/services", label: "Services" },
    { href: "/pricing", label: "Pricing" },
    // { href: "/booking", label: "Book Now" },
    { href: "/about", label: "About" },
    { href: "/blog", label: "Blog" },
    { href: "/contact", label: "Contact" },
  ]
  // Dark variant (for homepage with light background image)
  if (variant === "dark") {
    return (
      <>
       <nav
      className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200"
      role="navigation"
      aria-label="Main navigation"
    >
      <div className="max-w-[1440px] mx-auto px-6 sm:px-12 lg:px-24">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="text-2xl font-bold text-green-600" aria-label="Dresscode Laundry Home">
               dresscode
            </Link>
          </div>

          {/* Desktop navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-center space-x-6">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`relative text-base font-medium transition-colors duration-300 group ${
                    isActive(item.href)
                      ? "text-green-600 after:w-full"
                      : "text-gray-700 hover:text-green-600"
                  }`}
                  aria-current={isActive(item.href) ? "page" : undefined}
                >
                  {item.label}
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-green-600 transition-all duration-300 group-hover:w-full"></span>
                </Link>
              ))}
            </div>
          </div>

          {/* Desktop Book Now Button */}
          <div className="hidden md:flex items-center space-x-4">
            <Button
              asChild
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-full transition-all duration-200"
            >
              <Link href="/pricing">Book Now</Link>
            </Button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center gap-4">
            <Button
              asChild
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-full text-sm font-medium"
            >
              <Link href="/pricing">Book Now</Link>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleMobileMenu}
              className="p-2 transition-all duration-200"
              aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
            >
              {isMobileMenuOpen ? <X className="h-6 w-6 text-green-600" /> : <Menu className="h-6 w-6 text-green-600" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile menu - Dropdown */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white shadow-lg">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`block px-3 py-2 rounded-md text-base font-medium transition-colors duration-300 ${
                  isActive(item.href)
                    ? "bg-green-50 text-green-600 font-semibold"
                    : "text-gray-700 hover:bg-gray-100 hover:text-green-600"
                }`}
                aria-current={isActive(item.href) ? "page" : undefined}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>

        {/* Mobile Side Menu Overlay */}
        {isMobileMenuOpen && (
          <div className="fixed inset-0 z-50 md:hidden">
            {/* Backdrop with smooth fade-in */}
            <div
              className={`fixed inset-0 bg-black/50 backdrop-blur-sm transition-all duration-500 ease-out ${
                isMobileMenuOpen ? "opacity-100" : "opacity-0"
              }`}
              onClick={toggleMobileMenu}
            />

            {/* Side Menu with slide and scale animation */}
            <div
              className={`fixed top-0 right-0 h-full w-80 max-w-[85vw] bg-white shadow-2xl transform transition-all duration-500 ease-out ${
                isMobileMenuOpen ? "translate-x-0 scale-100 opacity-100" : "translate-x-full scale-95 opacity-0"
              }`}
            >
              {/* Menu Header with fade-in */}
              <div
                className={`flex items-center justify-between p-6 border-b border-gray-200 transition-all duration-700 delay-100 ${
                  isMobileMenuOpen ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"
                }`}
              >
                <h2 className="text-xl font-bold text-gray-900">Menu</h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={toggleMobileMenu}
                  className="text-gray-500 hover:text-gray-700 p-2 rounded-full hover:bg-gray-100 transition-all duration-200"
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>

              {/* Menu Items with staggered animation */}
              <div className="px-6 py-4 space-y-2">
                {navItems.map((item, index) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`block px-4 py-3 text-base font-medium transition-all duration-700 rounded-xl hover:bg-emerald-50 hover:scale-105 hover:shadow-sm ${
                      isActive(item.href)
                        ? "text-emerald-600 font-semibold bg-emerald-50 scale-105"
                        : "text-gray-700 hover:text-emerald-600"
                    } ${isMobileMenuOpen ? "opacity-100 translate-x-0" : "opacity-0 translate-x-8"}`}
                    style={{
                      transitionDelay: isMobileMenuOpen ? `${200 + index * 100}ms` : "0ms",
                    }}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {item.label}
                  </Link>
                ))}
              </div>

              {/* Contact Section with fade-in */}
              <div
                className={`px-6 py-4 border-t border-gray-200 mt-4 transition-all duration-700 delay-500 ${
                  isMobileMenuOpen ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                }`}
              >
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">Contact Us</h3>
                <div className="space-y-3">
                  <Link
                    href={getTelHref()}
                    className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-sm"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Phone className="h-5 w-5 transition-transform duration-300 group-hover:scale-110" />
                    <span>{PHONE_DISPLAY}</span>
                  </Link>
                  <Link
                    href={getWhatsAppHref()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:text-green-600 hover:bg-green-50 rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-sm group"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="transition-transform duration-300 group-hover:scale-110"
                    >
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.465 3.488" />
                    </svg>
                    <span>WhatsApp Us</span>
                  </Link>
                </div>
              </div>

              {/* CTA Button with bounce-in animation */}
              <div
                className={`px-6 py-6 border-t border-gray-200 mt-auto transition-all duration-700 delay-700 ${
                  isMobileMenuOpen ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-8 scale-95"
                }`}
              >
                <Button
                  asChild
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white rounded-full py-3 transition-all duration-300 hover:scale-105 hover:shadow-lg transform"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <Link href="/pricing">Schedule Pickup</Link>
                </Button>
              </div>
            </div>
          </div>
        )}
      </>
    )
  }
  // Glass variant (for homepage with background image)
  if (variant === "glass") {
    return (
      <>
        <nav
          className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-white/5 border-b border-white/10 shadow-2xl"
          role="navigation"
          aria-label="Main navigation"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-20">
              {/* Logo */}
              <div className="flex items-center">
                <Link
                  href="/"
                  className="text-2xl font-bold text-emerald-400 drop-shadow-lg dresscode-text"
                  aria-label="Dresscode Laundry Home"
                >
                  dresscode
                </Link>
              </div>

              {/* Center - Book Now Button (Mobile) */}
              <div className="md:hidden">
                <Button
                  asChild
                  size="sm"
                  className="bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white px-4 py-2 rounded-full text-sm font-medium transition-all duration-200"
                >
                  <Link href="/pricing">Book Now</Link>
                </Button>
              </div>

              {/* Right - Menu Button (Mobile) */}
              <div className="md:hidden">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={toggleMobileMenu}
                  className="text-emerald-400 hover:text-emerald-300 hover:bg-emerald-400/10 backdrop-blur-sm rounded-full transition-all duration-200"
                  aria-label={isMobileMenuOpen ? "Close mobile menu" : "Open mobile menu"}
                  aria-expanded={isMobileMenuOpen}
                >
                  <Menu className="h-5 w-5 text-white" />
                </Button>
              </div>

              {/* Desktop navigation */}
              <div className="hidden md:block">
                <div className="ml-10 flex items-baseline space-x-1">
                  {navItems.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`px-4 py-3 text-sm font-medium transition-all duration-300 rounded-xl hover:bg-emerald-400/10 backdrop-blur-sm drop-shadow-sm ${
                        isActive(item.href)
                          ? "text-emerald-400 font-semibold hover:text-emerald-300"
                          : "text-emerald-400/80 hover:text-emerald-400"
                      }`}
                      aria-current={isActive(item.href) ? "page" : undefined}
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              </div>

              {/* Desktop Book Now Button */}
              <div className="hidden md:flex items-center space-x-4">
                <Button
                  asChild
                  className="bg-gradient-to-r from-emerald-500 to-emerald-900 hover:from-emerald-600 hover:to-emerald-800 backdrop-blur-sm border border-emerald-400/30 text-white shadow-lg transition-all duration-300 hover:shadow-xl rounded-full"
                >
                  <Link href="/pricing">Schedule Pickup</Link>
                </Button>
              </div>
            </div>
          </div>
        </nav>

        {/* Mobile Side Menu - Same animations as dark variant */}
        {isMobileMenuOpen && (
          <div className="fixed inset-0 z-50 md:hidden">
            <div
              className={`fixed inset-0 bg-black/50 backdrop-blur-sm transition-all duration-500 ease-out ${
                isMobileMenuOpen ? "opacity-100" : "opacity-0"
              }`}
              onClick={toggleMobileMenu}
            />

            <div
              className={`fixed top-0 right-0 h-full w-80 max-w-[85vw] bg-white shadow-2xl transform transition-all duration-500 ease-out ${
                isMobileMenuOpen ? "translate-x-0 scale-100 opacity-100" : "translate-x-full scale-95 opacity-0"
              }`}
            >
              <div
                className={`flex items-center justify-between p-6 border-b border-gray-200 transition-all duration-700 delay-100 ${
                  isMobileMenuOpen ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"
                }`}
              >
                <h2 className="text-xl font-bold text-gray-900">Menu</h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={toggleMobileMenu}
                  className="text-gray-500 hover:text-gray-700 p-2 rounded-full hover:bg-gray-100 transition-all duration-200"
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>

              <div className="px-6 py-4 space-y-2">
                {navItems.map((item, index) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`block px-4 py-3 text-base font-medium transition-all duration-700 rounded-xl hover:bg-emerald-50 hover:scale-105 hover:shadow-sm ${
                      isActive(item.href)
                        ? "text-emerald-600 font-semibold bg-emerald-50 scale-105"
                        : "text-gray-700 hover:text-emerald-600"
                    } ${isMobileMenuOpen ? "opacity-100 translate-x-0" : "opacity-0 translate-x-8"}`}
                    style={{
                      transitionDelay: isMobileMenuOpen ? `${200 + index * 100}ms` : "0ms",
                    }}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {item.label}
                  </Link>
                ))}
              </div>

              <div
                className={`px-6 py-4 border-t border-gray-200 mt-4 transition-all duration-700 delay-500 ${
                  isMobileMenuOpen ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                }`}
              >
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">Contact Us</h3>
                <div className="space-y-3">
                  <Link
                    href={getTelHref()}
                    className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-sm group"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Phone className="h-5 w-5 transition-transform duration-300 group-hover:scale-110" />
                    <span>{PHONE_DISPLAY}</span>
                  </Link>
                  <Link
                    href={getWhatsAppHref()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:text-green-600 hover:bg-green-50 rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-sm group"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="transition-transform duration-300 group-hover:scale-110"
                    >
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.465 3.488" />
                    </svg>
                    <span>WhatsApp Us</span>
                  </Link>
                </div>
              </div>

              <div
                className={`px-6 py-6 border-t border-gray-200 mt-auto transition-all duration-700 delay-700 ${
                  isMobileMenuOpen ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-8 scale-95"
                }`}
              >
                <Button
                  asChild
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white rounded-full py-3 transition-all duration-300 hover:scale-105 hover:shadow-lg transform"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <Link href="/pricing">Schedule Pickup</Link>
                </Button>
              </div>
            </div>
          </div>
        )}
      </>
    )
  }
  // Solid variant (for other pages with white background)
  return (
    <>
      <nav
        className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-white border-b border-gray-200/50 shadow-lg"
        role="navigation"
        aria-label="Main navigation"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <div className="flex items-center">
              <Link
                href="/"
                className="text-2xl font-bold text-green-600"
                aria-label="Dresscode Laundry Home"
              >
                dresscode
              </Link>
            </div>

            {/* Center - Book Now Button (Mobile) */}
            <div className="md:hidden">
              <Button
                asChild
                size="sm"
                className="bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white px-4 py-2 rounded-full text-sm font-medium transition-all duration-200"
              >
                <Link href="/pricing">Book Now</Link>
              </Button>
            </div>

            {/* Right - Menu Button (Mobile) */}
            <div className="md:hidden">
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleMobileMenu}
                className="text-gray-700 hover:text-emerald-600 hover:bg-emerald-50 backdrop-blur-sm rounded-full transition-all duration-200"
                aria-label={isMobileMenuOpen ? "Close mobile menu" : "Open mobile menu"}
                aria-expanded={isMobileMenuOpen}
              >
                <Menu className="h-5 w-5 text-[#07553f]" />
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

            {/* Desktop Book Now Button */}
            <div className="hidden md:flex items-center space-x-4">
              <Button
                asChild
                className="bg-gradient-to-r from-emerald-500 to-emerald-900 hover:from-emerald-600 hover:to-emerald-800 text-white transition-all duration-300 rounded-full"
              >
                <Link href="/pricing">Schedule Pickup</Link>
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Side Menu - Same animations */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div
            className={`fixed inset-0 bg-black/50 backdrop-blur-sm transition-all duration-500 ease-out ${
              isMobileMenuOpen ? "opacity-100" : "opacity-0"
            }`}
            onClick={toggleMobileMenu}
          />

          <div
            className={`fixed top-0 right-0 h-full w-80 max-w-[85vw] bg-white shadow-2xl transform transition-all duration-500 ease-out ${
              isMobileMenuOpen ? "translate-x-0 scale-100 opacity-100" : "translate-x-full scale-95 opacity-0"
            }`}
          >
            <div
              className={`flex items-center justify-between p-6 border-b border-gray-200 transition-all duration-700 delay-100 ${
                isMobileMenuOpen ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"
              }`}
            >
              <h2 className="text-xl font-bold text-gray-900">Menu</h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleMobileMenu}
                className="text-gray-500 hover:text-gray-700 p-2 rounded-full hover:bg-gray-100 transition-all duration-200"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>

            <div className="px-6 py-4 space-y-2">
              {navItems.map((item, index) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`block px-4 py-3 text-base font-medium transition-all duration-700 rounded-xl hover:bg-emerald-50 hover:scale-105 hover:shadow-sm ${
                    isActive(item.href)
                      ? "text-emerald-600 font-semibold bg-emerald-50 scale-105"
                      : "text-gray-700 hover:text-emerald-600"
                  } ${isMobileMenuOpen ? "opacity-100 translate-x-0" : "opacity-0 translate-x-8"}`}
                  style={{
                    transitionDelay: isMobileMenuOpen ? `${200 + index * 100}ms` : "0ms",
                  }}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
            </div>

            <div
              className={`px-6 py-4 border-t border-gray-200 mt-4 transition-all duration-700 delay-500 ${
                isMobileMenuOpen ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
              }`}
            >
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">Contact Us</h3>
              <div className="space-y-3">
                <Link
                  href={getTelHref()}
                  className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-sm group"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <Phone className="h-5 w-5 transition-transform duration-300 group-hover:scale-110" />
                  <span>{PHONE_DISPLAY}</span>
                </Link>
                <Link
                  href={getWhatsAppHref()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:text-green-600 hover:bg-green-50 rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-sm group"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="transition-transform duration-300 group-hover:scale-110"
                  >
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.465 3.488" />
                  </svg>
                  <span>WhatsApp Us</span>
                </Link>
              </div>
            </div>

            <div
              className={`px-6 py-6 border-t border-gray-200 mt-auto transition-all duration-700 delay-700 ${
                isMobileMenuOpen ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-8 scale-95"
              }`}
            >
              <Button
                asChild
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white rounded-full py-3 transition-all duration-300 hover:scale-105 hover:shadow-lg transform"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <Link href="/pricing">Schedule Pickup</Link>
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
