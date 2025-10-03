import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import Link from "next/link";
import { HelpCircle, Phone, Mail } from "lucide-react";
import { Navigation } from "@/components/navigation";

export default function FAQPage() {
  const faqCategories = [
    {
      title: "General Questions",
      faqs: [
        {
          question: "What areas do you serve?",
          answer:
            "We provide pickup and delivery services throughout Kottayam, Changanassery, Pala, and surrounding areas within a 25km radius of our facility. If you're unsure whether we serve your area, please call us at 89-4343-7272.",
        },
        {
          question: "How do I schedule a pickup?",
          answer:
            "You can schedule a pickup through our online booking system, by calling us at 89-4343-7272, or by scanning our QR code. We recommend booking at least 24 hours in advance for guaranteed pickup slots.",
        },
        {
          question: "What are your business hours?",
          answer:
            "We're open Monday through Saturday from 8:00 AM to 8:00 PM, and Sunday from 9:00 AM to 6:00 PM. Pickup and delivery services are available during these hours.",
        },
        {
          question: "Do you offer same-day service?",
          answer:
            "Yes, same-day service is available for urgent requests with an additional charge of ₹20 per kg for wash & fold services. Same-day service must be requested before 10:00 AM and is subject to availability.",
        },
      ],
    },
    {
      title: "Services & Pricing",
      faqs: [
        {
          question: "What services do you offer?",
          answer:
            "We offer wash & fold (₹140/kg), dry cleaning, ironing & pressing (₹20/piece), and wash & iron (₹30/piece). We also handle bedding, curtains, and other household textiles.",
        },
        {
          question: "How is pricing calculated?",
          answer:
            "Wash & fold services are priced per kilogram, while dry cleaning and ironing are priced per piece. We provide transparent pricing with no hidden fees. You'll receive a detailed invoice with your order.",
        },
        {
          question: "Do you handle delicate or expensive items?",
          answer:
            "We specialize in caring for delicate fabrics, designer clothing, silk sarees, leather items, and other specialty garments. Our premium care service ensures your valuable items receive the attention they deserve.",
        },
        {
          question: "What detergents and chemicals do you use?",
          answer:
            "We use premium, eco-friendly detergents and fabric softeners that are gentle on fabrics and safe for sensitive skin. Our dry cleaning process uses environmentally safe solvents.",
        },
      ],
    },
    {
      title: "Pickup & Delivery",
      faqs: [
        {
          question: "Is pickup and delivery free?",
          answer:
            "Yes, pickup and delivery are completely free within our service area. There are no minimum order requirements for free pickup and delivery.",
        },
        {
          question: "How long does the service take?",
          answer:
            "Most orders are completed within 24-48 hours. Dry cleaning typically takes 2-3 days, while wash & fold can often be completed within 24 hours. We'll provide an estimated completion time when we collect your items.",
        },
        {
          question: "What if I'm not home during pickup/delivery?",
          answer:
            "We can arrange to collect items from a trusted neighbor, building security, or we can reschedule for a more convenient time. Please let us know your preferences when booking.",
        },
        {
          question: "How do I track my order?",
          answer:
            "We'll send you updates via SMS and email at key stages: pickup confirmation, processing start, quality check completion, and delivery scheduling. You can also call us anytime for status updates.",
        },
      ],
    },
    {
      title: "Quality & Care",
      faqs: [
        {
          question: "What if my clothes are damaged?",
          answer:
            "We take full responsibility for any damage that occurs during our care. We have comprehensive insurance coverage and will repair, replace, or compensate for any items damaged in our facility.",
        },
        {
          question: "Do you guarantee stain removal?",
          answer:
            "We use professional-grade stain removal techniques and will make every effort to remove stains. While we can't guarantee 100% stain removal (some stains may be permanent), we'll inform you before processing if we believe a stain cannot be removed.",
        },
        {
          question: "How do you handle different fabric types?",
          answer:
            "Our experienced team is trained to identify different fabric types and apply appropriate cleaning methods. We follow care label instructions and use specialized techniques for silk, wool, cotton, synthetic blends, and other materials.",
        },
        {
          question: "What is your satisfaction guarantee?",
          answer:
            "We offer a 100% satisfaction guarantee. If you're not completely happy with our service, we'll re-clean your items at no charge or provide a full refund. Your satisfaction is our top priority.",
        },
      ],
    },
    {
      title: "Payment & Policies",
      faqs: [
        {
          question: "What payment methods do you accept?",
          answer:
            "We accept cash on delivery, UPI payments, credit/debit cards, and digital wallets. Payment is collected at the time of delivery for your convenience.",
        },
        {
          question: "Do you provide receipts and invoices?",
          answer:
            "Yes, we provide detailed receipts and invoices for all services. You'll receive an itemized bill showing services performed and pricing for each item.",
        },
        {
          question: "What is your cancellation policy?",
          answer:
            "You can cancel or reschedule pickup appointments up to 2 hours before the scheduled time without any charges. For orders already in process, cancellation may not be possible.",
        },
        {
          question: "How long do you keep unclaimed items?",
          answer:
            "We hold completed orders for up to 30 days. After this period, unclaimed items may be donated to charity. We'll contact you multiple times before this happens.",
        },
      ],
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <Navigation variant="solid" />

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-emerald-500 to-emerald-900 text-white py-12 sm:py-16 pt-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <HelpCircle className="h-16 w-16 mx-auto mb-4" />
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Frequently Asked Questions
          </h1>
          <p className="text-xl text-teal-100 max-w-2xl mx-auto">
            Find answers to common questions about our laundry and dry cleaning
            services
          </p>
        </div>
      </section>

      {/* FAQ Content */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-8">
            {faqCategories.map((category, categoryIndex) => (
              <div key={categoryIndex}>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  {category.title}
                </h2>
                <Accordion type="single" collapsible className="space-y-4">
                  {category.faqs.map((faq, faqIndex) => (
                    <AccordionItem
                      key={faqIndex}
                      value={`${categoryIndex}-${faqIndex}`}
                      className="border border-gray-200 rounded-lg px-6"
                    >
                      <AccordionTrigger className="text-left font-medium hover:no-underline">
                        {faq.question}
                      </AccordionTrigger>
                      <AccordionContent className="text-gray-600 pb-4">
                        {faq.answer}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Still Have Questions */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Still Have Questions?
            </h2>
            <p className="text-lg text-gray-600">
              Can't find what you're looking for? Our friendly team is here to
              help!
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <Card className="text-center p-6">
              <CardContent className="pt-6">
                <Phone className="h-12 w-12 text-teal-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Call Us</h3>
                <p className="text-gray-600 mb-4">
                  Speak directly with our customer service team
                </p>
                <Button
                  asChild
                  className="bg-gradient-to-r from-emerald-500 to-emerald-900 hover:from-emerald-600 hover:to-emerald-800 rounded-full"
                >
                  <Link href="tel:89-4343-7272">89-4343-7272</Link>
                </Button>
              </CardContent>
            </Card>
            <Card className="text-center p-6">
              <CardContent className="pt-6">
                <Mail className="h-12 w-12 text-teal-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Email Us</h3>
                <p className="text-gray-600 mb-4">
                  Send us your questions and we'll respond within 24 hours
                </p>
                <Button asChild variant="outline">
                  <Link href="mailto:hellodresscodes@gmail.com">
                    Send Email
                  </Link>
                </Button>
              </CardContent>
            </Card>
            <Card className="text-center p-6">
              <CardContent className="pt-6">
                <HelpCircle className="h-12 w-12 text-teal-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Contact Form</h3>
                <p className="text-gray-600 mb-4">
                  Fill out our detailed contact form for specific inquiries
                </p>
                <Button asChild variant="outline">
                  <Link href="/contact">Contact Form</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Quick Tips */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Quick Tips
            </h2>
            <p className="text-lg text-gray-600">
              Helpful tips to get the most out of our services
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="p-4 text-center">
              <CardContent className="pt-4">
                <div className="w-8 h-8 bg-teal-600 rounded-full flex items-center justify-center text-white font-bold mx-auto mb-3">
                  1
                </div>
                <h3 className="font-semibold mb-2">Check Pockets</h3>
                <p className="text-sm text-gray-600">
                  Always check pockets for items before sending clothes for
                  cleaning
                </p>
              </CardContent>
            </Card>
            <Card className="p-4 text-center">
              <CardContent className="pt-4">
                <div className="w-8 h-8 bg-teal-600 rounded-full flex items-center justify-center text-white font-bold mx-auto mb-3">
                  2
                </div>
                <h3 className="font-semibold mb-2">Point Out Stains</h3>
                <p className="text-sm text-gray-600">
                  Let us know about any stains and what caused them for better
                  treatment
                </p>
              </CardContent>
            </Card>
            <Card className="p-4 text-center">
              <CardContent className="pt-4">
                <div className="w-8 h-8 bg-teal-600 rounded-full flex items-center justify-center text-white font-bold mx-auto mb-3">
                  3
                </div>
                <h3 className="font-semibold mb-2">Separate Items</h3>
                <p className="text-sm text-gray-600">
                  Separate dry cleaning items from regular wash & fold items
                </p>
              </CardContent>
            </Card>
            <Card className="p-4 text-center">
              <CardContent className="pt-4">
                <div className="w-8 h-8 bg-teal-600 rounded-full flex items-center justify-center text-white font-bold mx-auto mb-3">
                  4
                </div>
                <h3 className="font-semibold mb-2">Book in Advance</h3>
                <p className="text-sm text-gray-600">
                  Schedule pickups 24 hours ahead for guaranteed time slots
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}
