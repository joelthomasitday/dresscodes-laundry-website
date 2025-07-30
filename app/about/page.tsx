import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import Image from "next/image"
import { Award, Users, Clock, Leaf, Heart, Shield } from "lucide-react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "About Us - Professional Laundry Service | Dresscode Laundry",
  description:
    "Learn about Dresscode Laundry's mission, values, and commitment to providing exceptional laundry and dry cleaning services in Kottayam since our founding.",
  keywords: "about dresscode laundry, laundry service history, professional cleaning team, Kottayam laundry",
}

export default function AboutPage() {
  const values = [
    {
      icon: Award,
      title: "Quality Excellence",
      description:
        "We maintain the highest standards in garment care using premium equipment and eco-friendly products.",
    },
    {
      icon: Users,
      title: "Customer First",
      description: "Your satisfaction is our priority. We listen, adapt, and deliver personalized service every time.",
    },
    {
      icon: Clock,
      title: "Reliability",
      description: "Consistent, on-time service you can depend on. We respect your schedule and commitments.",
    },
    {
      icon: Leaf,
      title: "Eco-Friendly",
      description: "Committed to sustainable practices with biodegradable detergents and energy-efficient processes.",
    },
    {
      icon: Heart,
      title: "Care & Attention",
      description: "Every garment receives individual attention and care as if it were our own.",
    },
    {
      icon: Shield,
      title: "Trust & Security",
      description: "Your belongings are safe with us. We maintain strict security and handling protocols.",
    },
  ]

  const stats = [
    { number: "5000+", label: "Happy Customers" },
    { number: "50,000+", label: "Garments Cleaned" },
    { number: "99.8%", label: "Satisfaction Rate" },
    { number: "24-48h", label: "Turnaround Time" },
  ]

  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link href="/" className="text-2xl font-bold text-teal-600">
                DRESSCODE
              </Link>
            </div>
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                <Link
                  href="/"
                  className="text-gray-500 hover:text-teal-600 px-3 py-2 text-sm font-medium transition-colors"
                >
                  Home
                </Link>
                <Link
                  href="/services"
                  className="text-gray-500 hover:text-teal-600 px-3 py-2 text-sm font-medium transition-colors"
                >
                  Services
                </Link>
                <Link
                  href="/booking"
                  className="text-gray-500 hover:text-teal-600 px-3 py-2 text-sm font-medium transition-colors"
                >
                  Book Now
                </Link>
                <Link
                  href="/about"
                  className="text-gray-900 hover:text-teal-600 px-3 py-2 text-sm font-medium transition-colors"
                  aria-current="page"
                >
                  About
                </Link>
                <Link
                  href="/blog"
                  className="text-gray-500 hover:text-teal-600 px-3 py-2 text-sm font-medium transition-colors"
                >
                  Blog
                </Link>
                <Link
                  href="/contact"
                  className="text-gray-500 hover:text-teal-600 px-3 py-2 text-sm font-medium transition-colors"
                >
                  Contact
                </Link>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Button asChild className="bg-teal-600 hover:bg-teal-700 transition-colors">
                <Link href="/booking">Schedule Pickup</Link>
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="bg-teal-600 text-white py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">About Dresscode Laundry</h1>
          <p className="text-lg sm:text-xl text-teal-100 max-w-2xl mx-auto">
            Your trusted partner for professional laundry and dry cleaning services in Kottayam
          </p>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            <div>
              <Badge className="mb-4 bg-teal-100 text-teal-800">Our Story</Badge>
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6">Redefining Laundry Care in Kottayam</h2>
              <div className="space-y-4 text-gray-600 text-sm sm:text-base">
                <p>
                  Founded with a vision to transform the laundry experience, Dresscode Laundry has been serving the
                  Kottayam community with dedication and excellence. What started as a small local business has grown
                  into a trusted name in professional garment care.
                </p>
                <p>
                  We understand that your clothes are more than just fabric – they're an expression of your personality
                  and professionalism. That's why we treat every garment with the utmost care and attention it deserves.
                </p>
                <p>
                  Our commitment to quality, convenience, and customer satisfaction has made us the preferred choice for
                  thousands of families and professionals across Kottayam and surrounding areas.
                </p>
              </div>
            </div>
            <div className="relative">
              <Image
                src="https://picsum.photos/600/500?random=about"
                alt="Dresscode Laundry facility"
                width={600}
                height={500}
                className="rounded-lg shadow-xl w-full h-auto"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 600px"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 sm:py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">Our Impact</h2>
            <p className="text-base sm:text-lg text-gray-600">Numbers that reflect our commitment to excellence</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-teal-600 mb-2">{stat.number}</div>
                <div className="text-gray-600 text-sm sm:text-base">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <Badge className="mb-4 bg-teal-100 text-teal-800">Our Values</Badge>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">What Drives Us</h2>
            <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto">
              Our core values guide everything we do, from how we treat your garments to how we serve our community.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {values.map((value, index) => (
              <Card key={index} className="text-center p-4 sm:p-6 hover:shadow-lg transition-shadow">
                <CardContent className="pt-6">
                  <value.icon className="h-10 w-10 sm:h-12 sm:w-12 text-teal-600 mx-auto mb-4" />
                  <h3 className="text-lg sm:text-xl font-semibold mb-3">{value.title}</h3>
                  <p className="text-gray-600 text-sm sm:text-base leading-relaxed">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-12 sm:py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            <Card className="p-6 sm:p-8">
              <CardContent className="pt-0">
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">Our Mission</h3>
                <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
                  To provide exceptional laundry and dry cleaning services that exceed customer expectations while
                  maintaining the highest standards of quality, convenience, and environmental responsibility. We strive
                  to make professional garment care accessible and affordable for everyone in our community.
                </p>
              </CardContent>
            </Card>
            <Card className="p-6 sm:p-8">
              <CardContent className="pt-0">
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">Our Vision</h3>
                <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
                  To become the most trusted and preferred laundry service provider in Kerala, known for our innovation,
                  reliability, and commitment to customer satisfaction. We envision a future where professional garment
                  care is seamlessly integrated into everyone's lifestyle.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">Why Choose Dresscode Laundry?</h2>
            <p className="text-base sm:text-lg text-gray-600">Experience the difference that sets us apart</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-teal-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-white text-sm font-bold">✓</span>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">State-of-the-Art Equipment</h4>
                  <p className="text-gray-600 text-sm sm:text-base">
                    We use the latest commercial-grade washing machines, dryers, and pressing equipment to ensure
                    optimal results for every garment.
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-teal-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-white text-sm font-bold">✓</span>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Expert Team</h4>
                  <p className="text-gray-600 text-sm sm:text-base">
                    Our trained professionals have years of experience in handling all types of fabrics and stains,
                    ensuring your clothes receive the best care possible.
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-teal-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-white text-sm font-bold">✓</span>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Convenient Service</h4>
                  <p className="text-gray-600 text-sm sm:text-base">
                    Free pickup and delivery service saves you time and effort. Schedule online or call us – we make it
                    easy for you.
                  </p>
                </div>
              </div>
            </div>
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-teal-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-white text-sm font-bold">✓</span>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Transparent Pricing</h4>
                  <p className="text-gray-600 text-sm sm:text-base">
                    No hidden fees or surprise charges. Our pricing is clear, competitive, and provides excellent value
                    for professional service.
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-teal-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-white text-sm font-bold">✓</span>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Quality Guarantee</h4>
                  <p className="text-gray-600 text-sm sm:text-base">
                    We stand behind our work with a 100% satisfaction guarantee. If you're not happy, we'll make it
                    right.
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-teal-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-white text-sm font-bold">✓</span>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Community Focused</h4>
                  <p className="text-gray-600 text-sm sm:text-base">
                    As a local business, we're committed to serving our community and building lasting relationships
                    with our customers.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 sm:py-16 bg-teal-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold mb-4">Ready to Experience the Dresscode Difference?</h2>
          <p className="text-lg sm:text-xl mb-8 text-teal-100">
            Join thousands of satisfied customers who trust us with their garment care needs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              asChild
              className="bg-white text-teal-600 hover:bg-gray-100 transition-colors rounded-full"
            >
              <Link href="/booking">Schedule Your First Pickup</Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              asChild
              className="border-white text-white hover:bg-white hover:text-teal-600 bg-transparent transition-colors rounded-full"
            >
              <Link href="/contact">Get in Touch</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
