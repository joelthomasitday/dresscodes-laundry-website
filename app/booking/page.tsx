"use client";

import type React from "react";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { DatePicker } from "@/components/ui/date-picker";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { CalendarIcon, Clock, Phone, CreditCard, Loader2 } from "lucide-react";
import { format } from "date-fns";
import { toast } from "@/hooks/use-toast";
import { Navigation } from "@/components/navigation";
import { PriceEstimator } from "@/components/price-estimator";
import { getTelHref, getWhatsAppHref, PHONE_DISPLAY } from "@/lib/phone";
import { useIsMobile } from "@/hooks/use-mobile";

export default function BookingPage() {
  const isMobile = useIsMobile();
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    timeSlot: "",
    specialInstructions: "",
  });

  const services = [
    { id: "wash-fold", name: "Wash & Fold", price: "₹140/kg" },
    { id: "dry-cleaning", name: "Dry Cleaning", price: "Coming soon" },
    { id: "ironing", name: "Ironing & Pressing", price: "₹20/piece" },
    { id: "premium", name: "Premium Care", price: "Custom" },
  ];

  const timeSlots = [
    "9:00 AM - 11:00 AM",
    "11:00 AM - 1:00 PM",
    "1:00 PM - 3:00 PM",
    "3:00 PM - 5:00 PM",
    "5:00 PM - 7:00 PM",
  ];

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (!/^[0-9]{10}$/.test(formData.phone.replace(/[-\s]/g, ""))) {
      newErrors.phone = "Please enter a valid 10-digit phone number";
    }

    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!formData.address.trim()) {
      newErrors.address = "Pickup address is required";
    }

    if (!selectedDate) {
      newErrors.date = "Please select a pickup date";
    }

    if (!formData.timeSlot) {
      newErrors.timeSlot = "Please select a time slot";
    }

    if (selectedServices.length === 0) {
      newErrors.services = "Please select at least one service";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleServiceToggle = (serviceId: string) => {
    setSelectedServices((prev) =>
      prev.includes(serviceId)
        ? prev.filter((id) => id !== serviceId)
        : [...prev, serviceId]
    );
    if (errors.services) {
      setErrors((prev) => ({ ...prev, services: "" }));
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const bookingData = {
        ...formData,
        selectedDate: selectedDate?.toISOString(),
        selectedServices,
        timestamp: new Date().toISOString(),
      };

      // Send to API route
      const response = await fetch("/api/pricing", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(bookingData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to submit booking");
      }

      toast({
        title: "Booking request submitted!",
        description: "We will contact you shortly to confirm your pickup.",
      });

      // Reset form
      setFormData({
        name: "",
        phone: "",
        email: "",
        address: "",
        timeSlot: "",
        specialInstructions: "",
      });
      setSelectedDate(undefined);
      setSelectedServices([]);
      setErrors({});
    } catch (error) {
      console.error("Error submitting booking:", error);
      toast({
        title: "Error submitting booking",
        description:
          error instanceof Error
            ? error.message
            : "Please try again or call us directly.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <Navigation variant="solid" />

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-emerald-600 to-emerald-800 text-white py-16 sm:py-20 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
            Schedule Your Pickup
          </h1>
          <p className="text-lg sm:text-xl text-emerald-100 mb-8">
            Book your laundry service in just a few simple steps
          </p>

          {/* Quick Contact Section */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <div className="flex items-center gap-2 text-emerald-200">
              <Phone className="h-5 w-5" />
              <span>Need help? Call us:</span>
            </div>

            <div className="flex gap-3">
              <Button
                asChild
                variant="outline"
                size="sm"
                className="border-white/30 text-white hover:bg-white/10 rounded-full bg-transparent"
              >
                <Link href={getTelHref()}>
                  <Phone className="h-4 w-4 mr-2" />
                  Call Now
                </Link>
              </Button>

              <Button
                asChild
                variant="outline"
                size="sm"
                className="border-white/30 text-white hover:bg-white/10 rounded-full bg-transparent"
              >
                <Link
                  href={getWhatsAppHref("Hi! I need help with booking my laundry service.")}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="mr-2"
                  >
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.465 3.488" />
                  </svg>
                  WhatsApp
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Booking Form */}
      <section className="py-8 sm:py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <form
            onSubmit={handleSubmit}
            className="space-y-6 sm:space-y-8"
            noValidate
          >
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
              {/* Main Form */}
              <div className="lg:col-span-2 space-y-6">
                {/* Personal Information */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Phone className="h-5 w-5 mr-2 text-emerald-600" />
                      Contact Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="name">Full Name *</Label>
                        <Input
                          id="name"
                          value={formData.name}
                          onChange={(e) =>
                            handleInputChange("name", e.target.value)
                          }
                          className={errors.name ? "border-red-500" : ""}
                          required
                          aria-describedby={
                            errors.name ? "name-error" : undefined
                          }
                        />
                        {errors.name && (
                          <p
                            id="name-error"
                            className="text-red-500 text-sm mt-1"
                            role="alert"
                          >
                            {errors.name}
                          </p>
                        )}
                      </div>
                      <div>
                        <Label htmlFor="phone">Phone Number *</Label>
                        <Input
                          id="phone"
                          type="tel"
                          value={formData.phone}
                          onChange={(e) =>
                            handleInputChange("phone", e.target.value)
                          }
                          className={errors.phone ? "border-red-500" : ""}
                          required
                          aria-describedby={
                            errors.phone ? "phone-error" : undefined
                          }
                        />
                        {errors.phone && (
                          <p
                            id="phone-error"
                            className="text-red-500 text-sm mt-1"
                            role="alert"
                          >
                            {errors.phone}
                          </p>
                        )}
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="email">Email Address</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) =>
                          handleInputChange("email", e.target.value)
                        }
                        className={errors.email ? "border-red-500" : ""}
                        aria-describedby={
                          errors.email ? "email-error" : undefined
                        }
                      />
                      {errors.email && (
                        <p
                          id="email-error"
                          className="text-red-500 text-sm mt-1"
                          role="alert"
                        >
                          {errors.email}
                        </p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="address">Pickup Address *</Label>
                      <Textarea
                        id="address"
                        value={formData.address}
                        onChange={(e) =>
                          handleInputChange("address", e.target.value)
                        }
                        placeholder="Enter your complete address including landmarks"
                        className={errors.address ? "border-red-500" : ""}
                        required
                        aria-describedby={
                          errors.address ? "address-error" : undefined
                        }
                      />
                      {errors.address && (
                        <p
                          id="address-error"
                          className="text-red-500 text-sm mt-1"
                          role="alert"
                        >
                          {errors.address}
                        </p>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Services Selection */}
                <Card>
                  <CardHeader>
                    <CardTitle>Select Services *</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {services.map((service) => (
                        <div
                          key={service.id}
                          className={`flex items-center space-x-2 p-3 border rounded-lg hover:bg-gray-50 transition-colors ${
                            errors.services ? "border-red-500" : ""
                          }`}
                        >
                          <Checkbox
                            id={service.id}
                            checked={selectedServices.includes(service.id)}
                            onCheckedChange={() =>
                              handleServiceToggle(service.id)
                            }
                            disabled={service.id === "dry-cleaning"}
                          />
                          <div className="flex-1">
                            <Label
                              htmlFor={service.id}
                              className="font-medium cursor-pointer"
                            >
                              {service.name}
                            </Label>
                            {service.id === "dry-cleaning" && (
                              <span className="ml-2 inline-flex items-center rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-600">
                                Coming soon
                              </span>
                            )}
                            <p className="text-sm text-gray-500">
                              {service.price}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                    {errors.services && (
                      <p className="text-red-500 text-sm mt-2" role="alert">
                        {errors.services}
                      </p>
                    )}
                  </CardContent>
                </Card>

                {/* Date and Time Selection */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Clock className="h-5 w-5 mr-2 text-emerald-600" />
                      Pickup Schedule *
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <DatePicker
                        date={selectedDate}
                        onDateChange={(date) => {
                          setSelectedDate(date);
                          if (errors.date) {
                            setErrors((prev) => ({ ...prev, date: "" }));
                          }
                        }}
                        placeholder="Select date"
                        error={!!errors.date}
                        errorMessage={errors.date}
                        label="Pickup Date *"
                      />
                      <div>
                        <Label htmlFor="timeSlot">Time Slot *</Label>
                        <Select
                          value={formData.timeSlot}
                          onValueChange={(value) => {
                            handleInputChange("timeSlot", value);
                            if (errors.timeSlot) {
                              setErrors((prev) => ({ ...prev, timeSlot: "" }));
                            }
                          }}
                        >
                          <SelectTrigger
                            className={errors.timeSlot ? "border-red-500" : ""}
                          >
                            <SelectValue placeholder="Select time slot" />
                          </SelectTrigger>
                          <SelectContent>
                            {timeSlots.map((slot) => (
                              <SelectItem key={slot} value={slot}>
                                {slot}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {errors.timeSlot && (
                          <p className="text-red-500 text-sm mt-1" role="alert">
                            {errors.timeSlot}
                          </p>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Special Instructions */}
                <Card>
                  <CardHeader>
                    <CardTitle>Special Instructions</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Textarea
                      value={formData.specialInstructions}
                      onChange={(e) =>
                        handleInputChange("specialInstructions", e.target.value)
                      }
                      placeholder="Any special care instructions, stain details, or delivery preferences..."
                      rows={3}
                    />
                  </CardContent>
                </Card>
              </div>

              {/* Order Summary */}
              <div className="lg:col-span-1">
                <Card className="sticky top-24">
                  <CardHeader>
                    <CardTitle className="text-center text-xl font-bold text-emerald-700">
                      🧾 Order Summary
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Customer Details */}
                    <div className="bg-emerald-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-emerald-800 mb-3 flex items-center">
                        <Phone className="h-4 w-4 mr-2" />
                        Customer Details
                      </h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Name:</span>
                          <span className="font-medium">{formData.name || "Not specified"}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Phone:</span>
                          <span className="font-medium">{formData.phone || "Not specified"}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Address:</span>
                          <span className="font-medium text-right">{formData.address || "Not specified"}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Pickup:</span>
                          <span className="font-medium">
                            {selectedDate ? format(selectedDate, "dd/MM/yyyy") : "Not selected"}
                            {formData.timeSlot && ` | ${formData.timeSlot}`}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Selected Services */}
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-blue-800 mb-3">Selected Services</h4>
                      {selectedServices.length > 0 ? (
                        <div className="space-y-2">
                          {selectedServices.map((serviceId) => {
                            const service = services.find((s) => s.id === serviceId);
                            return (
                              <div key={serviceId} className="flex justify-between items-center text-sm">
                                <span className="text-gray-700">{service?.name}</span>
                                <Badge variant="secondary" className="bg-white text-blue-700 border-blue-200">
                                  {service?.price}
                                </Badge>
                              </div>
                            );
                          })}
                        </div>
                      ) : (
                        <p className="text-gray-500 text-sm">No services selected</p>
                      )}
                    </div>

                    {/* Order Summary in New Format */}
                    {selectedServices.length > 0 && (
                      <div className="bg-white p-4 rounded-lg border-2 border-gray-200">
                        <div className="space-y-4 text-sm">
                          {/* Header */}
                          <div className="text-center border-b pb-2">
                            <h3 className="text-lg font-bold text-gray-800">🧾 Dresscode Laundry – Order Summary</h3>
                          </div>

                          {/* Customer Details */}
                          <div>
                            <h4 className="font-bold text-gray-800 mb-2">Customer Details</h4>
                            <div className="space-y-1 text-gray-700">
                              <p><strong>Name:</strong> {formData.name || "Not specified"}</p>
                              <p><strong>Phone:</strong> {formData.phone || "Not specified"}</p>
                              <p><strong>Address:</strong> {formData.address || "Not specified"}</p>
                              <p><strong>Pickup:</strong> {selectedDate ? format(selectedDate, "dd/MM/yyyy") : "Not selected"}
                                {formData.timeSlot && ` | ${formData.timeSlot}`}
                              </p>
                            </div>
                          </div>

                          {/* Order Items */}
                          <div>
                            <h4 className="font-bold text-gray-800 mb-2">Order Items</h4>
                            <div className="space-y-1">
                              <p>1. Shirt — ₹100 × 1 = <strong>₹100</strong></p>
                            </div>
                          </div>

                          {/* Summary */}
                          <div>
                            <h4 className="font-bold text-gray-800 mb-2">Summary</h4>
                            <div className="space-y-1 text-gray-700">
                              <p><strong>Total Items:</strong> {selectedServices.length || 0}</p>
                              <p><strong>Total Amount:</strong> <strong>₹{selectedServices.length > 0 ? "100" : "0"}</strong></p>
                            </div>
                          </div>

                          {/* Payment Details */}
                          <div>
                            <h4 className="font-bold text-gray-800 mb-2">Payment Details</h4>
                            <div className="space-y-1 text-gray-700">
                              <p><strong>UPI ID:</strong> dresscode@upi</p>
                              <p><strong>Account Holder:</strong> Dresscode Laundry Services</p>
                              <p><strong>Bank:</strong> HDFC Bank</p>
                            </div>
                          </div>

                          {/* Thank you message */}
                          <div className="text-center pt-2 border-t">
                            <p className="text-green-600 font-medium">✅ Thank you for choosing <strong>Dresscode Laundry!</strong></p>
                          </div>

                          {/* Separator */}
                          <div className="border-t pt-2">
                            <p className="text-xs text-gray-500 text-center">---</p>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Action Button */}
                    <Button
                      type="submit"
                      className="w-full bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 transition-colors rounded-full text-lg py-3 font-semibold"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                          Submitting...
                        </>
                      ) : (
                        <>
                          <CreditCard className="h-5 w-5 mr-2" />
                          Schedule Pickup
                        </>
                      )}
                    </Button>

                    {/* Help Section */}
                    <div className="text-center space-y-3 pt-4 border-t">
                      <p className="text-sm text-gray-500">Need help?</p>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          asChild
                          className="rounded-full bg-transparent flex-1"
                        >
                          <Link href={getTelHref()}>
                            <Phone className="h-4 w-4 mr-1" />
                            Call
                          </Link>
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          asChild
                          className="rounded-full bg-transparent flex-1"
                        >
                          <Link
                            href={getWhatsAppHref("Hi! I need help with my booking.")}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <svg
                              width="16"
                              height="16"
                              viewBox="0 0 24 24"
                              fill="currentColor"
                              className="mr-1"
                            >
                              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.465 3.488" />
                            </svg>
                            WhatsApp
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </form>
        </div>
      </section>
    </div>
  );
}
