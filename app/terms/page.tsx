import Link from "next/link"
import { Button } from "@/components/ui/button"
import { FileText, Scale, AlertTriangle, CheckCircle } from "lucide-react"
import { Navigation } from "@/components/navigation"

export default function TermsPage() {
  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <Navigation variant="solid" />

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-emerald-500 to-emerald-900 text-white py-12 sm:py-16 pt-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Scale className="h-16 w-16 mx-auto mb-4" />
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Terms of Service</h1>
          <p className="text-xl text-teal-100 max-w-2xl mx-auto">
            Please read these terms carefully before using our laundry and dry cleaning services.
          </p>
        </div>
      </section>

      {/* Terms Content */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="prose prose-lg max-w-none">
            <div className="bg-gray-50 p-6 rounded-lg mb-8">
              <p className="text-sm text-gray-600 mb-2">
                <strong>Last Updated:</strong> January 1, 2024
              </p>
              <p className="text-gray-700">
                These Terms of Service ("Terms") govern your use of the laundry and dry cleaning services provided by
                Dresscode Laundry Service ("we," "our," or "us"). By using our services, you agree to be bound by these
                Terms.
              </p>
            </div>

            <div className="space-y-8">
              <section>
                <div className="flex items-center mb-4">
                  <CheckCircle className="h-6 w-6 text-teal-600 mr-3" />
                  <h2 className="text-2xl font-bold text-gray-900">Acceptance of Terms</h2>
                </div>
                <div className="space-y-4 text-gray-700">
                  <p>
                    By scheduling a pickup, using our website, or engaging our services in any way, you acknowledge that
                    you have read, understood, and agree to be bound by these Terms and our Privacy Policy. If you do
                    not agree to these Terms, please do not use our services.
                  </p>
                  <p>
                    These Terms apply to all customers, including individuals, businesses, and organizations that use
                    our laundry and dry cleaning services.
                  </p>
                </div>
              </section>

              <section>
                <div className="flex items-center mb-4">
                  <FileText className="h-6 w-6 text-teal-600 mr-3" />
                  <h2 className="text-2xl font-bold text-gray-900">Service Description</h2>
                </div>
                <div className="space-y-4 text-gray-700">
                  <p>Dresscode Laundry Service provides the following services:</p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>
                      <strong>Wash & Fold:</strong> Professional washing, drying, and folding of garments
                    </li>
                    <li>
                      <strong>Dry Cleaning:</strong> Specialized cleaning for delicate and formal garments
                    </li>
                    <li>
                      <strong>Ironing & Pressing:</strong> Professional pressing and finishing services
                    </li>
                    <li>
                      <strong>Premium Care:</strong> Specialized care for luxury and delicate items
                    </li>
                    <li>
                      <strong>Pickup & Delivery:</strong> Free collection and delivery within our service area
                    </li>
                  </ul>
                  <p>
                    Service availability may vary based on location, demand, and operational capacity. We reserve the
                    right to modify or discontinue services with reasonable notice.
                  </p>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Customer Responsibilities</h2>
                <div className="space-y-4 text-gray-700">
                  <p>As a customer, you agree to:</p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Provide accurate contact information and service address</li>
                    <li>Check all pockets and remove personal items before service</li>
                    <li>Inform us of any stains, damage, or special care requirements</li>
                    <li>Separate items requiring different cleaning methods</li>
                    <li>Be available during scheduled pickup and delivery times</li>
                    <li>Pay for services according to our pricing and payment terms</li>
                    <li>Treat our staff with respect and courtesy</li>
                  </ul>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Pricing and Payment</h2>
                <div className="space-y-4 text-gray-700">
                  <h3 className="text-xl font-semibold">Pricing Structure</h3>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Wash & Fold: ₹80 per kilogram</li>
                    <li>Dry Cleaning: Starting at ₹150 per piece</li>
                    <li>Ironing & Pressing: ₹25 per piece</li>
                    <li>Premium Care: Custom pricing based on item and requirements</li>
                    <li>Same-day service: Additional ₹20 per kilogram</li>
                  </ul>

                  <h3 className="text-xl font-semibold mt-6">Payment Terms</h3>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Payment is due upon delivery of cleaned items</li>
                    <li>We accept cash, UPI, credit/debit cards, and digital wallets</li>
                    <li>Prices are subject to change with 30 days' notice</li>
                    <li>All prices include applicable taxes</li>
                    <li>Pickup and delivery are free within our service area</li>
                  </ul>
                </div>
              </section>

              <section>
                <div className="flex items-center mb-4">
                  <AlertTriangle className="h-6 w-6 text-teal-600 mr-3" />
                  <h2 className="text-2xl font-bold text-gray-900">Liability and Risk</h2>
                </div>
                <div className="space-y-4 text-gray-700">
                  <h3 className="text-xl font-semibold">Our Liability</h3>
                  <p>We take utmost care in handling your garments. However, our liability is limited to:</p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Repair or replacement of damaged items up to 10 times the cleaning charge</li>
                    <li>Maximum liability of ₹5,000 per item unless higher value is declared</li>
                    <li>No liability for items left unclaimed for more than 30 days</li>
                    <li>No liability for pre-existing damage or wear</li>
                  </ul>

                  <h3 className="text-xl font-semibold mt-6">Items We Cannot Accept</h3>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Items contaminated with hazardous materials</li>
                    <li>Garments with permanent stains or damage</li>
                    <li>Items requiring specialized restoration</li>
                    <li>Vintage or antique items without prior consultation</li>
                    <li>Items with loose buttons, beads, or decorations</li>
                  </ul>

                  <h3 className="text-xl font-semibold mt-6">Customer Risk</h3>
                  <p>You acknowledge that certain risks are inherent in the cleaning process, including:</p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Color bleeding or fading in some fabrics</li>
                    <li>Shrinkage despite proper care</li>
                    <li>Inability to remove certain stains completely</li>
                    <li>Minor variations in texture or appearance</li>
                  </ul>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Service Standards and Guarantees</h2>
                <div className="space-y-4 text-gray-700">
                  <h3 className="text-xl font-semibold">Quality Guarantee</h3>
                  <p>We guarantee:</p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Professional cleaning according to industry standards</li>
                    <li>Proper handling and care of your garments</li>
                    <li>Timely completion within promised timeframes</li>
                    <li>100% satisfaction or we'll re-clean at no charge</li>
                  </ul>

                  <h3 className="text-xl font-semibold mt-6">Service Timeframes</h3>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Wash & Fold: 24-48 hours</li>
                    <li>Dry Cleaning: 2-3 business days</li>
                    <li>Ironing & Pressing: 24-48 hours</li>
                    <li>Premium Care: 3-5 business days</li>
                    <li>Same-day service: Available for urgent requests (additional charges apply)</li>
                  </ul>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Cancellation and Refund Policy</h2>
                <div className="space-y-4 text-gray-700">
                  <h3 className="text-xl font-semibold">Cancellation</h3>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Pickup appointments can be cancelled up to 2 hours before scheduled time</li>
                    <li>Orders in process cannot be cancelled but can be modified if possible</li>
                    <li>Repeated cancellations may result in service restrictions</li>
                  </ul>

                  <h3 className="text-xl font-semibold mt-6">Refunds</h3>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Full refund for services not performed</li>
                    <li>Partial refund for unsatisfactory service after re-cleaning attempt</li>
                    <li>Refunds processed within 7-10 business days</li>
                    <li>No refund for services completed to satisfaction</li>
                  </ul>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Unclaimed Items</h2>
                <div className="space-y-4 text-gray-700">
                  <p>Items not collected within specified timeframes will be handled as follows:</p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>
                      <strong>7 days:</strong> First reminder sent via phone/SMS
                    </li>
                    <li>
                      <strong>15 days:</strong> Second reminder with email notification
                    </li>
                    <li>
                      <strong>30 days:</strong> Final notice with storage fee of ₹10 per day
                    </li>
                    <li>
                      <strong>60 days:</strong> Items may be donated to charity or disposed of
                    </li>
                  </ul>
                  <p>
                    We are not responsible for items left unclaimed beyond 60 days. Storage fees must be paid before
                    item collection.
                  </p>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Intellectual Property</h2>
                <div className="space-y-4 text-gray-700">
                  <p>
                    All content on our website, including text, images, logos, and design elements, is the property of
                    Dresscode Laundry Service and is protected by copyright and trademark laws. You may not use,
                    reproduce, or distribute our content without written permission.
                  </p>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Privacy and Data Protection</h2>
                <div className="space-y-4 text-gray-700">
                  <p>
                    Your privacy is important to us. Our collection, use, and protection of your personal information is
                    governed by our Privacy Policy, which is incorporated into these Terms by reference. Please review
                    our Privacy Policy to understand our data practices.
                  </p>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Dispute Resolution</h2>
                <div className="space-y-4 text-gray-700">
                  <p>In the event of any dispute arising from these Terms or our services:</p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>We encourage direct communication to resolve issues amicably</li>
                    <li>Disputes will be governed by the laws of Kerala, India</li>
                    <li>Any legal proceedings will be subject to the jurisdiction of Kottayam courts</li>
                    <li>We prefer mediation or arbitration before litigation</li>
                  </ul>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Force Majeure</h2>
                <div className="space-y-4 text-gray-700">
                  <p>
                    We shall not be liable for any delay or failure to perform our obligations due to circumstances
                    beyond our reasonable control, including but not limited to:
                  </p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Natural disasters, floods, or severe weather conditions</li>
                    <li>Government regulations or restrictions</li>
                    <li>Labor strikes or equipment failures</li>
                    <li>Public health emergencies or pandemics</li>
                  </ul>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Modifications to Terms</h2>
                <div className="space-y-4 text-gray-700">
                  <p>
                    We reserve the right to modify these Terms at any time. Changes will be effective immediately upon
                    posting on our website. We will notify customers of material changes via email or SMS. Your
                    continued use of our services after changes constitutes acceptance of the modified Terms.
                  </p>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Severability</h2>
                <div className="space-y-4 text-gray-700">
                  <p>
                    If any provision of these Terms is found to be invalid or unenforceable, the remaining provisions
                    will continue to be valid and enforceable to the fullest extent permitted by law.
                  </p>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Contact Information</h2>
                <div className="space-y-4 text-gray-700">
                  <p>If you have any questions about these Terms of Service, please contact us:</p>
                  <div className="bg-gray-50 p-6 rounded-lg">
                    <p>
                      <strong>Dresscode Laundry Service</strong>
                    </p>
                    <p>Thottathil Building, First Floor</p>
                    <p>Ghandinagar PO, Kottayam, Kerala - 686008</p>
                    <p>
                      <strong>Phone:</strong> 89-4343-7272
                    </p>
                    <p>
                      <strong>Email:</strong> hellodresscodes@gmail.com
                    </p>
                    <p>
                      <strong>Website:</strong> dresscodes.in
                    </p>
                  </div>
                </div>
              </section>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Ready to Get Started?</h2>
          <p className="text-lg text-gray-600 mb-8">
            By using our services, you agree to these terms. Experience professional laundry care today!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              asChild
              size="lg"
              className="bg-gradient-to-r from-emerald-500 to-emerald-900 hover:from-emerald-600 hover:to-emerald-800 rounded-full"
            >
              <Link href="/booking">Schedule Pickup</Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/privacy">View Privacy Policy</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
