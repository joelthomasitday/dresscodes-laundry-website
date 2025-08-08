import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Navigation } from "@/components/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  Shirt,
  Sparkles,
  AnvilIcon as Iron,
  Crown,
  CheckCircle,
} from "lucide-react";

export default function ServicesPage() {
  const services = [
    {
      id: "wash-fold",
      title: "Wash & Fold",
      icon: Shirt,
      description:
        "Professional washing, drying, and folding of your everyday clothes with premium detergents.",
      price: "₹140/kg",
      features: [
        "Premium detergents and fabric softeners",
        "Gentle wash cycles for fabric care",
        "Professional folding and packaging",
        "Same-day service available",
      ],
      image: "https://picsum.photos/400/300?random=washfold",
    },
    {
      id: "dry-cleaning",
      title: "Dry Cleaning",
      icon: Sparkles,
      description:
        "Expert dry cleaning for delicate fabrics, formal wear, and specialty garments.",
      price: "Coming soon",
      features: [
        "Eco-friendly dry cleaning solvents",
        "Expert stain removal",
        "Delicate fabric care",
        "Professional pressing included",
      ],
      image: "https://picsum.photos/400/300?random=drycleaning",
    },
    {
      id: "ironing",
      title: "Ironing & Pressing",
      icon: Iron,
      description:
        "Professional ironing and pressing services for a crisp, fresh appearance.",
      price: "₹20/piece",
      features: [
        "Professional steam pressing",
        "Wrinkle-free guarantee",
        "Proper hanging and packaging",
        "Quick turnaround time",
      ],
      image: "https://picsum.photos/400/300?random=ironing",
    },
    {
      id: "premium",
      title: "Premium Care",
      icon: Crown,
      description:
        "Specialized care for luxury items, leather, suede, and designer clothing.",
      price: "Custom pricing",
      features: [
        "Hand-cleaning for delicate items",
        "Leather and suede cleaning",
        "Designer garment care",
        "Custom packaging",
      ],
      image: "https://picsum.photos/400/300?random=premium",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation with solid background */}
      <Navigation variant="solid" />

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-emerald-500 to-emerald-900 text-white py-12 sm:py-16 pt-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
            Our Services
          </h1>
          <p className="text-lg sm:text-xl text-emerald-100 max-w-2xl mx-auto">
            Professional laundry and dry cleaning services tailored to meet all
            your garment care needs.
          </p>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            {services.map((service, index) => (
              <Card
                key={service.id}
                className="overflow-hidden hover:shadow-xl transition-all duration-300 backdrop-blur-sm bg-white/90 border border-white/30 rounded-2xl"
              >
                <div className="md:flex">
                  <div className="md:w-1/2">
                    <Image
                      src={service.image || "/placeholder.svg"}
                      alt={`${service.title} service`}
                      width={400}
                      height={300}
                      className="w-full h-64 md:h-full object-cover"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 400px"
                    />
                  </div>
                  <div className="md:w-1/2 p-4 sm:p-6">
                    <CardHeader className="p-0 mb-4">
                      <div className="flex items-center mb-2">
                        <service.icon className="h-6 w-6 sm:h-8 sm:w-8 text-emerald-600 mr-3" />
                        <CardTitle className="text-xl sm:text-2xl">
                          {service.title}
                        </CardTitle>
                      </div>
                      <Badge className="w-fit bg-emerald-100 text-emerald-800 rounded-full">
                        {service.price}
                      </Badge>
                    </CardHeader>
                    <CardContent className="p-0">
                      <p className="text-gray-600 mb-4 text-sm sm:text-base">
                        {service.description}
                      </p>
                      <ul className="space-y-2 mb-6">
                        {service.features.map((feature, idx) => (
                          <li
                            key={idx}
                            className="flex items-center text-xs sm:text-sm"
                          >
                            <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 text-emerald-600 mr-2 flex-shrink-0" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                      <Button
                        asChild
                        className="w-full bg-gradient-to-r from-emerald-500 to-emerald-900 hover:from-emerald-600 hover:to-emerald-800 transition-all duration-300 rounded-full"
                      >
                        <Link href="/booking">Book This Service</Link>
                      </Button>
                    </CardContent>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Service Process */}
      <section className="py-12 sm:py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-base sm:text-lg text-gray-600">
              Simple, convenient, and reliable service in 4 easy steps
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
            <div className="text-center">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-emerald-500 to-emerald-900 rounded-full flex items-center justify-center text-white text-lg sm:text-2xl font-bold mx-auto mb-4">
                1
              </div>
              <h3 className="text-lg sm:text-xl font-semibold mb-2">
                Schedule Pickup
              </h3>
              <p className="text-gray-600 text-sm sm:text-base">
                Book online or call us to schedule a convenient pickup time.
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-emerald-500 to-emerald-900 rounded-full flex items-center justify-center text-white text-lg sm:text-2xl font-bold mx-auto mb-4">
                2
              </div>
              <h3 className="text-lg sm:text-xl font-semibold mb-2">
                We Collect
              </h3>
              <p className="text-gray-600 text-sm sm:text-base">
                Our team arrives at your location to collect your garments.
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-emerald-500 to-emerald-900 rounded-full flex items-center justify-center text-white text-lg sm:text-2xl font-bold mx-auto mb-4">
                3
              </div>
              <h3 className="text-lg sm:text-xl font-semibold mb-2">
                Professional Care
              </h3>
              <p className="text-gray-600 text-sm sm:text-base">
                Expert cleaning, pressing, and quality control at our facility.
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-emerald-500 to-emerald-900 rounded-full flex items-center justify-center text-white text-lg sm:text-2xl font-bold mx-auto mb-4">
                4
              </div>
              <h3 className="text-lg sm:text-xl font-semibold mb-2">
                Fresh Delivery
              </h3>
              <p className="text-gray-600 text-sm sm:text-base">
                Clean, pressed garments delivered back to your doorstep.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Table */}
      <section className="py-12 sm:py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
              Transparent Pricing
            </h2>
            <p className="text-base sm:text-lg text-gray-600">
              No hidden fees, just honest pricing for quality service
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            <Card className="backdrop-blur-sm bg-white/90 border border-white/30 rounded-2xl">
              <CardHeader>
                <CardTitle>Wash & Fold</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm sm:text-base">
                    <span>Regular clothes (per kg)</span>
                    <span className="font-semibold">₹140</span>
                  </div>
                  <div className="flex justify-between text-sm sm:text-base">
                    <span>Bedsheets & towels (per kg)</span>
                    <span className="font-semibold">₹60</span>
                  </div>
                  <div className="flex justify-between text-sm sm:text-base">
                    <span>Same-day service</span>
                    <span className="font-semibold">+₹20/kg</span>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="backdrop-blur-sm bg-white/90 border border-white/30 rounded-2xl">
              <CardHeader>
                <CardTitle>Dry Cleaning</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center text-sm sm:text-base text-gray-600">
                  Coming soon
                </div>
              </CardContent>
            </Card>
            <Card className="backdrop-blur-sm bg-white/90 border border-white/30 rounded-2xl">
              <CardHeader>
                <CardTitle>Ironing & Pressing</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm sm:text-base">
                    <span>Shirts</span>
                    <span className="font-semibold">₹20</span>
                  </div>
                  <div className="flex justify-between text-sm sm:text-base">
                    <span>T-shirts</span>
                    <span className="font-semibold">₹20</span>
                  </div>
                  <div className="flex justify-between text-sm sm:text-base">
                    <span>Trousers</span>
                    <span className="font-semibold">₹20</span>
                  </div>
                  <div className="flex justify-between text-sm sm:text-base">
                    <span>Wash + Iron (per piece)</span>
                    <span className="font-semibold">₹30</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 sm:py-16 bg-gradient-to-r from-emerald-500 to-emerald-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-lg sm:text-xl mb-8 text-emerald-100">
            Experience the convenience of professional laundry service today.
          </p>
          <Button
            size="lg"
            asChild
            className="bg-white text-emerald-600 hover:bg-gray-100 transition-colors rounded-full"
          >
            <Link href="/booking">Schedule Your First Pickup</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
