"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"
import Image from "next/image"
import {
  Truck,
  Clock,
  Shield,
  Star,
  CheckCircle,
  Shirt,
  Sparkles,
  AnvilIcon as Iron,
  Crown,
  Phone,
  MapPin,
  PhoneIcon,
  MessageCircle,
} from "lucide-react"
import { Navigation } from "@/components/navigation"
const cardData = [
  {
    icon: <MessageCircle className="h-8 w-8 text-green-600" />,
    title: "Free Pickup & Delivery",
    description:
      "Doorstep service across Kottayam. Schedule a pickup with just one call. It's fast, easy, and hassle-free.",
  },
  {
    icon: <Clock className="h-8 w-8 text-green-600" />,
    title: "24–48 Hour Turnaround",
    description:
      "Fast service without compromising quality. Express options available. Clean clothes, right on time.",
  },
  {
    icon: <CheckCircle className="h-8 w-8 text-green-600" />,
    title: "100% Satisfaction Guaranteed",
    description:
      "Not satisfied? We’ll make it right. Your happiness is our priority — no questions asked.",
  },
];

const WhatsappIcon = (props: any) => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="mr-2">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.465 3.488" />
  </svg>
);
export default function HomePage() {
  const services = [
    {
      icon: Shirt,
      title: "Wash & Fold",
      description: "Professional washing and folding service",
      price: "₹80/kg",
      features: ["Eco-friendly detergents", "Fabric softener included", "24-hour service"],
    },
    {
      icon: Sparkles,
      title: "Dry Cleaning",
      description: "Expert dry cleaning for delicate fabrics",
      price: "₹150/piece",
      features: ["Stain removal", "Professional pressing", "Garment protection"],
    },
    {
      icon: Iron,
      title: "Ironing & Pressing",
      description: "Crisp and professional ironing service",
      price: "₹25/piece",
      features: ["Steam pressing", "Crease-free finish", "Same-day service"],
    },
    {
      icon: Crown,
      title: "Premium Care",
      description: "Luxury treatment for premium garments",
      price: "Custom",
      features: ["Hand washing", "Special care", "Premium packaging"],
    },
  ]

  const testimonials = [
    {
      name: "Priya Nair",
      location: "Kottayam",
      rating: 5,
      comment:
        "Excellent service! My clothes come back perfectly clean and fresh. The pickup and delivery is so convenient.",
    },
    {
      name: "Rajesh Kumar",
      location: "Changanassery",
      rating: 5,
      comment: "Best laundry service in the area. Professional staff and great quality work. Highly recommended!",
    },
    {
      name: "Meera Thomas",
      location: "Pala",
      rating: 5,
      comment: "They handle my delicate fabrics with such care. The dry cleaning service is outstanding.",
    },
  ]

  return (
    <div className="min-h-screen">
      {/* Navigation with dark text */}
      <Navigation variant="dark" />

      {/* Hero Section - Simplified */}
      
      <section className="min-h-screen bg-[#f3f2ef] flex items-center px-6 sm:px-12 lg:px-24">
        <div className="max-w-[1440px] mx-auto w-full flex flex-col-reverse lg:flex-row items-center justify-between gap-16 lg:gap-24">

          {/* LEFT SIDE */}
          <div className="w-full lg:w-1/2 text-center lg:text-left space-y-8">
         
         
            <h1 className="text-5xl sm:text-6xl xl:text-7xl font-bold text-gray-900 leading-tight">
              Drop the laundry<br />
              <span className="text-[#008c5b]">Not your plans</span>
            </h1>


            <p className="text-lg text-gray-600 max-w-xl mx-auto lg:mx-0">
              A convenient laundry solution that helps protect the environment.
            </p>
            

            {/* New Button and Contact Section */}
            <div className="space-y-4 lg:space-y-0">
              <div className="flex flex-col sm:flex-row justify-center lg:justify-start gap-4 mb-8">
                <Button asChild size="lg" className="bg-[#008c5b] hover:bg-green-700 rounded-full">
                  <Link href="/booking">Schedule Free Pickup</Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className="border-gray-300 text-gray-800  hover:text-[#008c5d] hover:border-[#008c5d] bg-transparent rounded-full transition-colors duration-200"
                >
                  <Link href="/services">View Services</Link>
                </Button>
              </div>

              <div className="flex flex-col justify-center lg:justify-start gap-4 text-gray-700 font-medium">
                <Link
                  href="tel:+918943437272"
                  className="flex items-center gap-2 group hover:text-[#008c5b] transition-colors duration-200"
                >
                  <Phone className="h-5 w-5" />
                  <span className="relative pb-0.5 after:bg-[#008c5b] after:absolute after:bottom-0 after:left-0 after:h-[1px] after:w-0 group-hover:after:w-full after:transition-all after:duration-300">
                    Call: +91 89434 37272
                  </span>
                </Link>

                <Link
                  href="https://wa.me/918943437272"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 group hover:text-[#008c5b] transition-colors duration-200"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.465 3.488" />
                  </svg>
                  <span className="relative pb-0.5 after:bg-[#008c5b] after:absolute after:bottom-0 after:left-0 after:h-[1px] after:w-0 group-hover:after:w-full after:transition-all after:duration-300">
                    WhatsApp Us
                  </span>
                </Link>
              </div>
            </div>
          </div>

          {/* RIGHT SIDE IMAGE */}
          <div className="w-full lg:w-1/2 flex justify-center pt-24 lg:pt-0">
            <div className="  max-w-md lg:max-w-lg">
              <Image
                src="/images/hero.png"
                alt="Laundry Illustration"
                width={700}
                height={700}
                className="w-full h-auto object-contain"
              />
            </div>
          </div>
        </div>
      </section>


      {/* Features Section */}
      <section className=" py-16 sm:py-24 bg-white">

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">Why Choose Dresscode?</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We combine traditional care with modern convenience to deliver exceptional laundry services
            </p>
          </div>


          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {cardData.map((card, index) => (
              <div
                key={index}
                className="flex flex-col justify-between bg-[#ffffff] p-5 rounded-3xl shadow-md min-h-[300px]"
              >
                {/* Top Section */}
                <div>
                  <div className="mb-4">{card.icon}</div>

                  <h2 className="text-2xl font-normal text-gray-900 mb-2 leading-snug">
                    {card.title}
                  </h2>

                  <p className="text-gray-600 text-sm leading-relaxed mb-4">
                    {card.description}
                  </p>
                </div>

                {/* Button */}
                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className="border-gray-300 text-gray-800 hover:text-[#008c5d] hover:border-[#008c5d] bg-transparent rounded-full transition-colors duration-200"
                >
                  <Link href="/about">Read More</Link>
                </Button>
              </div>
            ))}
          </div>


        </div>
      </section>

      {/* Services Section */}
      <section className="py-16 sm:py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">Our Services</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Professional care for all your garments with transparent pricing
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {services.map((service, index) => (
              <Card key={index} className="hover:shadow-xl transition-all duration-300 border-0 shadow-md group">
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <service.icon className="h-8 w-8 text-white" />
                  </div>

                  <h3 className="text-xl font-semibold mb-2">{service.title}</h3>
                  <p className="text-gray-600 mb-4">{service.description}</p>

                  <div className="mb-4">
                    <span className="text-xl font-bold text-emerald-600 ">{service.price}</span>
                  </div>

                  <ul className="space-y-2 mb-6">
                    {service.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center text-sm text-gray-600">
                        <CheckCircle className="h-4 w-4 text-emerald-500 mr-2 flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>

                  <Button
                    asChild
                    className="w-full bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 rounded-full"
                  >
                    <Link href="/booking">Book This Service</Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 sm:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">What Our Customers Say</h2>
            <p className="text-xl text-gray-600">Join thousands of satisfied customers across Kottayam</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow border-0 shadow-md">
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                    ))}
                  </div>

                  <p className="text-gray-600 mb-4 italic">"{testimonial.comment}"</p>

                  <div>
                    <p className="font-semibold">{testimonial.name}</p>
                    <p className="text-sm text-gray-500 flex items-center">
                      <MapPin className="h-4 w-4 mr-1" />
                      {testimonial.location}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 sm:py-24 bg-gradient-to-r from-emerald-600 to-emerald-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">Ready to Experience Premium Laundry Care?</h2>
          <p className="text-xl text-emerald-100 mb-8 max-w-3xl mx-auto">
            Schedule your free pickup today and discover why we're Kottayam's most trusted laundry service
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              asChild
              size="lg"
              className="bg-white text-emerald-600 hover:bg-gray-100 shadow-lg text-lg px-8 py-6 rounded-full"
            >
              <Link href="/booking">Schedule Free Pickup</Link>
            </Button>

            <Button
              asChild
              variant="outline"
              size="lg"
              className="border-2 border-white text-white hover:bg-white/10 text-lg px-8 py-6 rounded-full bg-transparent"
            >
              <Link href="tel:+918943437272">Call Now</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <h3 className="text-2xl font-bold mb-4">DRESSCODE</h3>
              <p className="text-gray-300 mb-4 max-w-md">
                Premium laundry and dry cleaning services in Kottayam. Professional care for your garments with
                convenient pickup and delivery.
              </p>
              <div className="flex space-x-4">
                <Button asChild variant="outline" size="sm" className="rounded-full bg-transparent">
                  <Link href="tel:+918943437272">
                    <Phone className="h-4 w-4 mr-2" />
                    Call Us
                  </Link>
                </Button>
                <Button asChild variant="outline" size="sm" className="rounded-full bg-transparent">
                  <Link href="https://wa.me/918943437272" target="_blank" rel="noopener noreferrer">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="mr-2">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.465 3.488" />
                    </svg>
                    WhatsApp
                  </Link>
                </Button>
              </div>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li>
                  <Link href="/services" className="text-gray-300 hover:text-white transition-colors">
                    Services
                  </Link>
                </li>
                <li>
                  <Link href="/booking" className="text-gray-300 hover:text-white transition-colors">
                    Book Now
                  </Link>
                </li>
                <li>
                  <Link href="/about" className="text-gray-300 hover:text-white transition-colors">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="text-gray-300 hover:text-white transition-colors">
                    Contact
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-4">Contact Info</h4>
              <ul className="space-y-2 text-gray-300">
                <li className="flex items-center">
                  <Phone className="h-4 w-4 mr-2" />
                  +91 89434 37272
                </li>
                <li className="flex items-center">
                  <MapPin className="h-4 w-4 mr-2" />
                  Kottayam, Kerala
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 Dresscode Laundry. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
