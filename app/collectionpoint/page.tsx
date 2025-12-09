"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Navigation } from "@/components/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  TrendingUp,
  Users,
  Shield,
  Award,
  CheckCircle,
  Phone,
  Mail,
  MapPin,
  Clock,
  Loader2,
  Send,
  Star,
  Building2,
  Handshake,
  GraduationCap,
  HeartHandshake,
  Wallet,
  Target,
  Rocket,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { getTelHref, getWhatsAppHref, PHONE_DISPLAY } from "@/lib/phone";

export default function FranchisePage() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    city: "",
    investment: "",
    experience: "",
    message: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Benefits data
  const benefits = [
    {
      icon: Wallet,
      title: "Minimal Investment",
      description:
        "Start your partnership with just ₹10,000. No expensive equipment or heavy infrastructure needed.",
    },
    {
      icon: Building2,
      title: "Use Your Space",
      description:
        "Perfect for existing shops. Turn a small counter space into a revenue-generating collection point.",
    },
    {
      icon: TrendingUp,
      title: "Earn Commission",
      description:
        "Earn on every order you collect. A perfect add-on income stream for your existing business.",
    },
    {
      icon: Shield,
      title: "We Handle Cleaning",
      description:
        "You just collect and hand over. We handle all the processing, cleaning, and logistics.",
    },
    {
      icon: Rocket,
      title: "Fast Launch",
      description:
        "Get started in just a few days with our simple 1-2 day training program.",
    },
    {
      icon: Users,
      title: "Increase Footfall",
      description:
        "Attract more customers to your shop by offering essential laundry services.",
    },
  ];

  // Stats data
  const stats = [
    { number: "₹10,000", label: "Partnership Fee" },
    { number: "0", label: "Equipment Needed" },
    { number: "1-2 Days", label: "Training Time" },
    { number: "Day 1", label: "Start Earning" },
  ];

  // Ideal partner profile
  const idealProfile = [
    "Existing clothing business (Tailor, Boutique, Garment Shop)",
    "Entrepreneurs with available commercial space",
    "Shop owners looking to add extra services",
    "Anyone seeking a low-investment opportunity",
    "Passionate about customer service",
    "Located in an accessible area",
  ];

  // Process steps
  const processSteps = [
    {
      step: 1,
      title: "Apply Online",
      description:
        "Fill out the simple form to express your interest in becoming a partner.",
    },
    {
      step: 2,
      title: "Space Review",
      description:
        "We visit your location to assess the space and discuss the opportunity.",
    },
    {
      step: 3,
      title: "Quick Training",
      description:
        "Complete a simple 1-2 day training on our systems and service standards.",
    },
    {
      step: 4,
      title: "Launch",
      description:
        "Start accepting laundry from customers and earning commission immediately!",
    },
  ];



  // Investment details
  const investmentDetails = [
    { item: "Partnership Fee", amount: "₹10,000" },
    { item: "Space", amount: "Your Existing Space" },
    { item: "Equipment", amount: "None Required" },
    { item: "Marketing Support", amount: "Included" },
    { item: "Total Investment", amount: "₹10,000 (One-time)", highlight: true },
  ];

  // FAQ data
  const faqs = [
    {
      question: "What exactly does a Collection Point Partner do?",
      answer:
        "You act as a drop-off and pick-up point for laundry. Customers bring their clothes to you, you log them, we collect and process them, and return them to you for the customer to pick up.",
    },
    {
      question: "Do I need any special equipment?",
      answer:
        "No! Since we handle all the cleaning and processing at our central facility, you don't need any washing machines or expensive equipment. Just a counter and some storage space.",
    },
    {
      question: "How much space do I need?",
      answer:
        "Very little. A small counter area for receiving clothes and some shelf space to store processed laundry awaiting pickup is all you need.",
    },
    {
      question: "Can I operate my existing business alongside?",
      answer:
        "Absolutely! This model is designed to work perfectly alongside businesses like tailors, boutiques, or garment shops. It adds revenue without disrupting your main business.",
    },
    {
      question: "How do I earn money?",
      answer:
        "You earn a commission on every order that is dropped off at your location. It's a great way to generate passive income from your existing footfall.",
    },
    {
      question: "What support do you provide?",
      answer:
        "We provide branding materials, the booking system/app, training, marketing support, and we handle all the logistics of pickup, delivery, and cleaning.",
    },
  ];

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }
    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (!/^[0-9]{10}$/.test(formData.phone.replace(/[-\s]/g, ""))) {
      newErrors.phone = "Please enter a valid 10-digit phone number";
    }
    if (!formData.city.trim()) newErrors.city = "City is required";
    if (!formData.investment) newErrors.investment = "Please select investment capacity";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsSubmitting(true);

    try {
      const whatsappMessage = `🏪 *New Partner Inquiry*

*Name:* ${formData.name}
*Email:* ${formData.email}
*Phone:* ${formData.phone}
*City:* ${formData.city}
*Investment Capacity:* ${formData.investment}
*Experience:* ${formData.experience || "Not specified"}

*Message:* ${formData.message || "No additional message"}

_Submitted on: ${new Date().toLocaleString()}_`;

      window.open(getWhatsAppHref(whatsappMessage), "_blank");

      toast({
        title: "Opening WhatsApp...",
        description: "Please send the pre-filled message to complete your inquiry.",
      });

      setFormData({
        name: "",
        email: "",
        phone: "",
        city: "",
        investment: "",
        experience: "",
        message: "",
      });
    } catch (error) {
      toast({
        title: "Error opening WhatsApp",
        description: "Please try again or contact us directly.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };



  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation variant="solid" />

      {/* Hero Section */}
      <section className="relative bg-gray-50 pt-20 lg:h-[700px] lg:flex lg:items-center lg:overflow-hidden">
        {/* Mobile Hero Image */}
        <div className="relative w-full h-[300px] sm:h-[400px] lg:hidden">
          <Image
            src="/hero-mobile.jpg"
            alt="Dresscode Collection Point"
            fill
            className="object-cover"
            priority
          />
        </div>

        {/* Desktop Background Image */}
        <div className="hidden lg:block absolute inset-0 z-0">
          <Image
            src="/hero.jpg"
            alt="Dresscode Collection Point"
            fill
            className="object-cover object-center"
            priority
            quality={100}
          />
          {/* Light Gradient Overlay for Text Readability */}
          <div className="absolute inset-0 bg-gradient-to-r from-gray-50/90 via-gray-50/60 to-transparent lg:via-gray-50/30 lg:to-transparent" />
        </div>

        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-12 relative z-10 w-full">
          <div className="max-w-2xl py-8 lg:py-0">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white shadow-sm border border-emerald-100 text-emerald-800 text-sm font-medium mb-8">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              Partner Opportunity
            </div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold text-gray-900 leading-[1.1] tracking-tight mb-6">
              Become a Collection<br />
              Point Partner
            </h1>
            
            <p className="text-lg sm:text-xl text-gray-600 mb-8 max-w-xl leading-relaxed font-medium">
              Transform your unused space into a valuable income stream. 
Be part of an expanding, reliable partner ecosystem.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                asChild
                size="lg"
                className="bg-emerald-600 text-white hover:bg-emerald-700 rounded-full text-lg px-8 h-14 shadow-lg shadow-emerald-200 transition-all hover:scale-105"
              >
                <Link href="#apply">Apply Now</Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="border-2 border-emerald-600 text-emerald-700 hover:bg-emerald-50 bg-transparent rounded-full text-lg px-8 h-14"
              >
                <Link href={getTelHref()}>
                  <Phone className="h-5 w-5 mr-2" />
                  Call Us
                </Link>
              </Button>
            </div>

            <div className="mt-8 sm:mt-12 flex flex-wrap items-center gap-4 sm:gap-8 text-sm text-gray-600 font-medium">
              <div className="flex items-center gap-2">
                <div className="p-1 rounded-full bg-emerald-100">
                  <CheckCircle className="h-4 w-4 text-emerald-600" />
                </div>
                <span>Low Entry Cost</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="p-1 rounded-full bg-emerald-100">
                  <CheckCircle className="h-4 w-4 text-emerald-600" />
                </div>
                <span>Use Existing Space</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 sm:py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-emerald-600 mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-600 text-sm sm:text-base">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Partner Section */}
      <section className="py-12 sm:py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <Badge className="mb-4 bg-emerald-100 text-emerald-800 rounded-full">
              Why Join Us
            </Badge>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Why Become a Collection Point Partner?
            </h2>
            <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto">
              Minimal investment, maximum convenience. Add a profitable service to your existing business.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {benefits.map((benefit, index) => (
              <Card
                key={index}
                className="hover:shadow-xl transition-all duration-300 border-0 shadow-md group backdrop-blur-sm bg-white/90 rounded-2xl"
              >
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <benefit.icon className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2 text-gray-900">{benefit.title}</h3>
                  <p className="text-gray-600">{benefit.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Detailed Benefits Section */}
      <section className="py-12 sm:py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            <div className="order-2 lg:order-1">
              <Badge className="mb-4 bg-emerald-100 text-emerald-800 rounded-full">
                Program Benefits
              </Badge>
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6">
                Simple Model, Smart Earnings
              </h2>
              <div className="space-y-4 text-gray-600">
                <p>
                  The laundry service industry in Kerala is booming. dresscode offers you a chance to enter this market with a simple collection point model.
                </p>
                <p>
                  By utilizing your existing space (like a tailor shop, boutique, or spare room), you can add a profitable revenue stream without the burden of processing the clothes yourself. We handle the dirty work; you handle the customers.
                </p>
              </div>
              <div className="mt-6 space-y-3">
                {[
                  "Extremely low entry cost (₹10,000)",
                  "Monetize your existing real estate",
                  "No processing equipment needed",
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-emerald-500 mr-3 flex-shrink-0" />
                    <span className="text-gray-700">{item}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="order-1 lg:order-2 flex justify-center">
              <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-3xl p-6 sm:p-8 w-full max-w-md">
                <div className="text-center">
                  <Target className="h-12 w-12 sm:h-16 sm:w-16 text-emerald-600 mx-auto mb-4" />
                  <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">Target ROI</h3>
                  <div className="text-3xl sm:text-4xl font-bold text-emerald-600 mb-2">High</div>
                  <p className="text-sm sm:text-base text-gray-600">Annual Return on Investment</p>
                </div>
                <div className="mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-emerald-200">
                  <div className="flex justify-between text-xs sm:text-sm mb-2">
                    <span className="text-gray-600">Break-even Period</span>
                    <span className="font-semibold text-gray-900">3-6 Months</span>
                  </div>
                  <div className="flex justify-between text-xs sm:text-sm">
                    <span className="text-gray-600">Payback Period</span>
                    <span className="font-semibold text-gray-900">6-12 Months</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Ideal Partner Section */}
      <section className="py-12 sm:py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            <div className="flex justify-center order-2 lg:order-1">
              <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-lg w-full max-w-md">
                <GraduationCap className="h-12 w-12 sm:h-16 sm:w-16 text-emerald-600 mx-auto mb-4" />
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900 text-center mb-4 sm:mb-6">
                  Are You the Right Fit?
                </h3>
                <div className="space-y-3 sm:space-y-4">
                  {idealProfile.map((item, idx) => (
                    <div key={idx} className="flex items-start">
                      <div className="w-5 h-5 sm:w-6 sm:h-6 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 text-emerald-600" />
                      </div>
                      <span className="ml-2 sm:ml-3 text-sm sm:text-base text-gray-700">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="order-1 lg:order-2">
              <Badge className="mb-4 bg-emerald-100 text-emerald-800 rounded-full">
                Perfect For
              </Badge>
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4 sm:mb-6">
                Who Should Join?
              </h2>
              <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6">
                We are looking for partners who have an existing space and want to earn extra income. This is perfect for owners of tailor shops, boutiques, garment stores, or anyone with a commercial room to spare.
              </p>
              <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6">
                No laundry experience needed. If you have the space and a friendly attitude, we handle the rest.
              </p>
              <Button
                asChild
                className="w-full sm:w-auto bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 rounded-full"
              >
                <Link href="#apply">Check Your Eligibility</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

    {/* Process Timeline Section */}
<section className="py-12 sm:py-16 bg-white">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div className="text-center mb-12">
      <Badge className="mb-4 bg-emerald-100 text-emerald-800 rounded-full">
        How It Works
      </Badge>
      <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
        Get Started in 4 Simple Steps
      </h2>
      <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto">
        A simple, transparent process to become a Collection Point Partner.
      </p>
    </div>
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
      {processSteps.map((step, index) => (
        <div key={index} className="relative">
          <div className="bg-gray-50 rounded-2xl p-6 shadow-md hover:shadow-xl transition-shadow border border-gray-200">
            <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-full flex items-center justify-center text-white text-xl font-bold mb-4">
              {step.step}
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">{step.title}</h3>
            <p className="text-gray-600 text-sm">{step.description}</p>
          </div>
        </div>
      ))}
    </div>
  </div>
</section>



      {/* Investment Details Section */}
      <section className="py-12 sm:py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <Badge className="mb-4 bg-emerald-100 text-emerald-800 rounded-full">
              Simple Investment
            </Badge>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Simple Investment Structure
            </h2>
            <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto">
              Transparent pricing with no hidden costs. Just a one-time fee to get started.
            </p>
          </div>
          <div className="max-w-2xl mx-auto">
            <Card className="rounded-2xl shadow-lg border-0">
              <CardContent className="p-0">
                {investmentDetails.map((item, idx) => (
                  <div
                    key={idx}
                    className={`flex flex-col sm:flex-row justify-between items-start sm:items-center gap-1 sm:gap-4 px-4 sm:px-6 py-3 sm:py-4 ${
                      idx !== investmentDetails.length - 1 ? "border-b border-gray-100" : ""
                    } ${item.highlight ? "bg-emerald-50" : ""}`}
                  >
                    <span
                      className={`text-sm sm:text-base ${
                        item.highlight ? "font-bold text-gray-900" : "text-gray-700"
                      }`}
                    >
                      {item.item}
                    </span>
                    <span
                      className={`text-sm sm:text-base ${
                        item.highlight
                          ? "font-bold text-emerald-600 sm:text-lg"
                          : "font-semibold text-gray-900"
                      }`}
                    >
                      {item.amount}
                    </span>
                  </div>
                ))}
              </CardContent>
            </Card>
            <p className="text-center text-gray-500 text-sm mt-4">
              * Actual investment may vary based on location and setup requirements
            </p>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-12 sm:py-16 bg-[#E8E4DD]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <Badge className="mb-4 bg-emerald-100 text-emerald-800 rounded-full">FAQ</Badge>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Frequently Asked Questions
            </h2>
          </div>
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, idx) => (
              <AccordionItem
                key={idx}
                value={`faq-${idx}`}
                className="border border-gray-200 rounded-lg px-6 bg-white"
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
      </section>

      {/* Contact Form Section */}
      <section id="apply" className="py-12 sm:py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Left Side - Info */}
            <div>
              <Badge className="mb-4 bg-emerald-100 text-emerald-800 rounded-full">
                Get Started
              </Badge>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-6">
                Ready to Become a Partner?
              </h2>
              <p className="text-gray-600 mb-8">
                Join our growing network of collection point partners. Fill out the form below to instantly send your details to our team via WhatsApp. We will review your profile and get back to you shortly.
              </p>
              <div className="space-y-6">
                <Card className="hover:shadow-lg transition-shadow border-emerald-100 bg-emerald-50/50">
                  <CardContent className="p-6 flex items-start space-x-4">
                    <div className="w-12 h-12 bg-[#25D366] rounded-lg flex items-center justify-center flex-shrink-0">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="white" className="h-6 w-6">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.465 3.488" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">Direct WhatsApp Line</h3>
                      <p className="text-sm text-gray-600 mb-2">
                        Prefer to chat directly? Click below to start a conversation.
                      </p>
                      <Link
                        href={getWhatsAppHref("Hi! I'm interested in the dresscode partner program.")}
                        target="_blank"
                        className="text-[#25D366] hover:text-[#128C7E] font-bold inline-flex items-center"
                      >
                        Chat Now <ChevronRight className="h-4 w-4 ml-1" />
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Right Side - Form */}
            <div>
              <Card className="shadow-lg rounded-2xl">
                <CardHeader>
                  <CardTitle className="text-2xl">Send Inquiry via WhatsApp</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-4" noValidate>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="name">Full Name *</Label>
                        <Input
                          id="name"
                          value={formData.name}
                          onChange={(e) => handleInputChange("name", e.target.value)}
                          className={errors.name ? "border-red-500" : ""}
                        />
                        {errors.name && (
                          <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                        )}
                      </div>
                      <div>
                        <Label htmlFor="phone">Phone Number *</Label>
                        <Input
                          id="phone"
                          type="tel"
                          value={formData.phone}
                          onChange={(e) => handleInputChange("phone", e.target.value)}
                          className={errors.phone ? "border-red-500" : ""}
                        />
                        {errors.phone && (
                          <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
                        )}
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="email">Email Address *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange("email", e.target.value)}
                        className={errors.email ? "border-red-500" : ""}
                      />
                      {errors.email && (
                        <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                      )}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="city">Preferred City/Location *</Label>
                        <Input
                          id="city"
                          value={formData.city}
                          onChange={(e) => handleInputChange("city", e.target.value)}
                          className={errors.city ? "border-red-500" : ""}
                        />
                        {errors.city && (
                          <p className="text-red-500 text-sm mt-1">{errors.city}</p>
                        )}
                      </div>
                      <div>
                        <Label htmlFor="investment">Investment Capacity *</Label>
                        <select
                          id="investment"
                          value={formData.investment}
                          onChange={(e) => handleInputChange("investment", e.target.value)}
                          className={`w-full h-10 px-3 rounded-md border ${
                            errors.investment ? "border-red-500" : "border-input"
                          } bg-background text-sm`}
                        >
                          <option value="">Select range</option>
                          <option value="₹10,000 (Partnership Fee)">₹10,000 (Partnership Fee)</option>
                          <option value="₹10,000 - ₹50,000">₹10,000 - ₹50,000</option>
                          <option value="₹50,000+">₹50,000+</option>
                        </select>
                        {errors.investment && (
                          <p className="text-red-500 text-sm mt-1">{errors.investment}</p>
                        )}
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="experience">Business Experience (Optional)</Label>
                      <Input
                        id="experience"
                        value={formData.experience}
                        onChange={(e) => handleInputChange("experience", e.target.value)}
                        placeholder="e.g., 5 years in retail"
                      />
                    </div>
                    <div>
                      <Label htmlFor="message">Additional Message (Optional)</Label>
                      <Textarea
                        id="message"
                        value={formData.message}
                        onChange={(e) => handleInputChange("message", e.target.value)}
                        placeholder="Tell us about yourself and why you're interested..."
                        rows={4}
                      />
                    </div>
                    <Button
                      type="submit"
                      className="w-full bg-[#25D366] hover:bg-[#128C7E] text-white rounded-full transition-colors"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Opening WhatsApp...
                        </>
                      ) : (
                        <>
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" className="mr-2">
                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.465 3.488" />
                          </svg>
                          Send via WhatsApp
                        </>
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-10 sm:py-12 md:py-16 bg-gradient-to-r from-emerald-600 to-emerald-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Rocket className="h-12 w-12 sm:h-16 sm:w-16 text-white/80 mx-auto mb-4 sm:mb-6" />
          <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-3 sm:mb-4">
            Ready to Become a Partner?
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-emerald-100 mb-6 sm:mb-8 max-w-2xl mx-auto px-2">
            Join the dresscode family and build a profitable business as a collection point partner.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="col-span-1 sm:col-span-2">
              <h3 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4">dresscode</h3>
              <p className="text-gray-300 mb-4 text-sm sm:text-base max-w-md">
                Premium laundry and dry cleaning services in Kottayam. Join our partner network and be part of Kerala's fastest-growing laundry brand.
              </p>
              <div className="flex flex-wrap gap-3 sm:space-x-4 sm:gap-0">
                <Button asChild variant="outline" size="sm" className="rounded-full bg-transparent text-xs sm:text-sm">
                  <Link href={getTelHref()}>
                    <Phone className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                    Call Us
                  </Link>
                </Button>
                <Button asChild variant="outline" size="sm" className="rounded-full bg-transparent text-xs sm:text-sm">
                  <Link href={getWhatsAppHref()} target="_blank" rel="noopener noreferrer">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" className="mr-1 sm:mr-2 sm:w-4 sm:h-4">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.465 3.488" />
                    </svg>
                    WhatsApp
                  </Link>
                </Button>
              </div>
            </div>
            <div>
              <h4 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">Quick Links</h4>
              <ul className="space-y-2 text-sm sm:text-base">
                <li>
                  <Link href="/services" className="text-gray-300 hover:text-white transition-colors">
                    Services
                  </Link>
                </li>
                <li>
                  <Link href="/pricing" className="text-gray-300 hover:text-white transition-colors">
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
              <h4 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">Contact Info</h4>
              <ul className="space-y-2 text-gray-300 text-sm sm:text-base">
                <li className="flex items-center">
                  <Phone className="h-3 w-3 sm:h-4 sm:w-4 mr-2 flex-shrink-0" />
                  <span className="break-all">{PHONE_DISPLAY}</span>
                </li>
                <li className="flex items-center">
                  <MapPin className="h-3 w-3 sm:h-4 sm:w-4 mr-2 flex-shrink-0" />
                  Kottayam, Kerala
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2025 dresscode laundry. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
