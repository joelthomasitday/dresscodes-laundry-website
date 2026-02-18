import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Navigation } from "@/components/navigation";
import { Shield, AlertTriangle, Droplets, Eye, Truck, Clock, CreditCard } from "lucide-react";
import { Footer } from "@/components/footer";

export default function TermsPage() {
  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <Navigation variant="solid" />

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-emerald-500 to-emerald-900 text-white py-12 sm:py-16 pt-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center sm:pt-24 pt-0">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Terms & Conditions
          </h1>
          <p className="text-xl text-teal-100 max-w-2xl mx-auto">
            Please read these terms carefully before using our laundry and dry cleaning services.
          </p>
        </div>
      </section>
      {/* Terms Content */}
      <section className="py-6 bg-gray-50">
        <div className="max-w-7xl mx-auto px-3">
          <div className="space-y-4">
            {/* Garment Care Section */}
            <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
              <div className="flex items-start gap-3">
                <div className="bg-emerald-100 rounded-full p-2.5 flex-shrink-0 mt-1">
                  <Shield className="w-5 h-5 text-emerald-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <h2 className="text-lg font-bold text-gray-900 mb-2">
                    Garment Care
                  </h2>
                  <p className="text-sm text-gray-700 leading-relaxed">
                    All garments are handled with utmost care. However, we are not responsible for wear and tear, color bleeding, shrinkage, or damage due to manufacturer defects or inherent weaknesses in fabrics.
                  </p>
                </div>
              </div>
            </div>

            {/* Damage or Loss Section */}
            <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
              <div className="flex items-start gap-3">
                <div className="bg-red-100 rounded-full p-2.5 flex-shrink-0 mt-1">
                  <AlertTriangle className="w-5 h-5 text-red-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <h2 className="text-lg font-bold text-gray-900 mb-2">
                    Damage or Loss
                  </h2>
                  <p className="text-sm text-gray-700 leading-relaxed">
                    Liability for any lost or damaged item is limited to 10 times the laundry charge of the particular item. Claims must be reported within 2 hours of delivery, accompanied by the original invoice.
                  </p>
                </div>
              </div>
            </div>

            {/* Stain Removal Section */}
            <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
              <div className="flex items-start gap-3">
                <div className="bg-blue-100 rounded-full p-2.5 flex-shrink-0 mt-1">
                  <Droplets className="w-5 h-5 text-blue-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <h2 className="text-lg font-bold text-gray-900 mb-2">
                    Stain Removal
                  </h2>
                  <p className="text-sm text-gray-700 leading-relaxed">
                    We do our best to remove stains but cannot guarantee complete removal without risking damage to the fabric.
                  </p>
                </div>
              </div>
            </div>

            {/* Inspection Section */}
            <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
              <div className="flex items-start gap-3">
                <div className="bg-purple-100 rounded-full p-2.5 flex-shrink-0 mt-1">
                  <Eye className="w-5 h-5 text-purple-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <h2 className="text-lg font-bold text-gray-900 mb-2">
                    Inspection
                  </h2>
                  <p className="text-sm text-gray-700 leading-relaxed">
                    Customers are advised to inspect garments before and after the laundry service. No claims will be entertained once garments have been accepted by the company or after received by the party.
                  </p>
                </div>
              </div>
            </div>

            {/* Pickup & Delivery Section */}
            <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
              <div className="flex items-start gap-3">
                <div className="bg-orange-100 rounded-full p-2.5 flex-shrink-0 mt-1">
                  <Truck className="w-5 h-5 text-orange-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <h2 className="text-lg font-bold text-gray-900 mb-2">
                    Pickup & Delivery
                  </h2>
                  <p className="text-sm text-gray-700 leading-relaxed">
                    If customer is not available to receive the delivery, we would place the garments and customer premises and acknowledge the same. No claims would be entertained for such deliveries.
                  </p>
                </div>
              </div>
            </div>

            {/* Unclaimed Garments Section */}
            <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
              <div className="flex items-start gap-3">
                <div className="bg-yellow-100 rounded-full p-2.5 flex-shrink-0 mt-1">
                  <Clock className="w-5 h-5 text-yellow-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <h2 className="text-lg font-bold text-gray-900 mb-2">
                    Unclaimed Garments
                  </h2>
                  <p className="text-sm text-gray-700 leading-relaxed">
                    Unclaimed garments will be discarded or donated after 30 days from the date of billing.
                  </p>
                </div>
              </div>
            </div>

            {/* Payment Terms Section */}
            <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
              <div className="flex items-start gap-3">
                <div className="bg-green-100 rounded-full p-2.5 flex-shrink-0 mt-1">
                  <CreditCard className="w-5 h-5 text-green-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <h2 className="text-lg font-bold text-gray-900 mb-2">
                    Payment Terms
                  </h2>
                  <p className="text-sm text-gray-700 leading-relaxed">
                    Full payment is due upon delivery.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}