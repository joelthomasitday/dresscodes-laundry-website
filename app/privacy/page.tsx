import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Shield, Lock, Eye, UserCheck } from "lucide-react"
import { Navigation } from "@/components/navigation"

export default function PrivacyPage() {
  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <Navigation variant="solid" />

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-emerald-500 to-emerald-900 text-white py-12 sm:py-16 pt-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Shield className="h-16 w-16 mx-auto mb-4" />
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Privacy Policy</h1>
          <p className="text-xl text-teal-100 max-w-2xl mx-auto">
            Your privacy is important to us. Learn how we collect, use, and protect your personal information.
          </p>
        </div>
      </section>

      {/* Privacy Policy Content */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="prose prose-lg max-w-none">
            <div className="bg-gray-50 p-6 rounded-lg mb-8">
              <p className="text-sm text-gray-600 mb-2">
                <strong>Last Updated:</strong> January 1, 2024
              </p>
              <p className="text-gray-700">
                This Privacy Policy describes how Dresscode Laundry Service ("we," "our," or "us") collects, uses, and
                protects your personal information when you use our laundry and dry cleaning services.
              </p>
            </div>

            <div className="space-y-8">
              <section>
                <div className="flex items-center mb-4">
                  <UserCheck className="h-6 w-6 text-teal-600 mr-3" />
                  <h2 className="text-2xl font-bold text-gray-900">Information We Collect</h2>
                </div>
                <div className="space-y-4 text-gray-700">
                  <h3 className="text-xl font-semibold">Personal Information</h3>
                  <p>When you use our services, we may collect the following personal information:</p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Name and contact information (phone number, email address)</li>
                    <li>Pickup and delivery addresses</li>
                    <li>Service preferences and special instructions</li>
                    <li>Payment information (processed securely through third-party providers)</li>
                    <li>Order history and service records</li>
                  </ul>

                  <h3 className="text-xl font-semibold mt-6">Automatically Collected Information</h3>
                  <p>We may automatically collect certain information when you visit our website:</p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>IP address and browser information</li>
                    <li>Website usage patterns and preferences</li>
                    <li>Device information and operating system</li>
                    <li>Cookies and similar tracking technologies</li>
                  </ul>
                </div>
              </section>

              <section>
                <div className="flex items-center mb-4">
                  <Eye className="h-6 w-6 text-teal-600 mr-3" />
                  <h2 className="text-2xl font-bold text-gray-900">How We Use Your Information</h2>
                </div>
                <div className="space-y-4 text-gray-700">
                  <p>We use your personal information for the following purposes:</p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>
                      <strong>Service Delivery:</strong> To provide laundry and dry cleaning services, schedule pickups
                      and deliveries
                    </li>
                    <li>
                      <strong>Communication:</strong> To send service updates, confirmations, and respond to inquiries
                    </li>
                    <li>
                      <strong>Payment Processing:</strong> To process payments and maintain billing records
                    </li>
                    <li>
                      <strong>Service Improvement:</strong> To analyze usage patterns and improve our services
                    </li>
                    <li>
                      <strong>Marketing:</strong> To send promotional offers and newsletters (with your consent)
                    </li>
                    <li>
                      <strong>Legal Compliance:</strong> To comply with applicable laws and regulations
                    </li>
                  </ul>
                </div>
              </section>

              <section>
                <div className="flex items-center mb-4">
                  <Lock className="h-6 w-6 text-teal-600 mr-3" />
                  <h2 className="text-2xl font-bold text-gray-900">Information Sharing and Disclosure</h2>
                </div>
                <div className="space-y-4 text-gray-700">
                  <p>
                    We do not sell, trade, or rent your personal information to third parties. We may share your
                    information only in the following circumstances:
                  </p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>
                      <strong>Service Providers:</strong> With trusted third-party service providers who assist in our
                      operations (payment processors, delivery partners)
                    </li>
                    <li>
                      <strong>Legal Requirements:</strong> When required by law, court order, or government regulation
                    </li>
                    <li>
                      <strong>Business Transfer:</strong> In the event of a merger, acquisition, or sale of business
                      assets
                    </li>
                    <li>
                      <strong>Protection:</strong> To protect our rights, property, or safety, or that of our customers
                      or others
                    </li>
                  </ul>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Data Security</h2>
                <div className="space-y-4 text-gray-700">
                  <p>
                    We implement appropriate technical and organizational security measures to protect your personal
                    information against unauthorized access, alteration, disclosure, or destruction. These measures
                    include:
                  </p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Encryption of sensitive data during transmission and storage</li>
                    <li>Regular security assessments and updates</li>
                    <li>Access controls and employee training</li>
                    <li>Secure payment processing through certified providers</li>
                  </ul>
                  <p>
                    However, no method of transmission over the internet or electronic storage is 100% secure, and we
                    cannot guarantee absolute security.
                  </p>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Your Rights and Choices</h2>
                <div className="space-y-4 text-gray-700">
                  <p>You have the following rights regarding your personal information:</p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>
                      <strong>Access:</strong> Request access to your personal information we hold
                    </li>
                    <li>
                      <strong>Correction:</strong> Request correction of inaccurate or incomplete information
                    </li>
                    <li>
                      <strong>Deletion:</strong> Request deletion of your personal information (subject to legal
                      requirements)
                    </li>
                    <li>
                      <strong>Opt-out:</strong> Unsubscribe from marketing communications at any time
                    </li>
                    <li>
                      <strong>Data Portability:</strong> Request a copy of your data in a structured format
                    </li>
                  </ul>
                  <p>To exercise these rights, please contact us using the information provided below.</p>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Cookies and Tracking Technologies</h2>
                <div className="space-y-4 text-gray-700">
                  <p>
                    Our website uses cookies and similar tracking technologies to enhance your browsing experience.
                    Cookies are small text files stored on your device that help us:
                  </p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Remember your preferences and settings</li>
                    <li>Analyze website traffic and usage patterns</li>
                    <li>Provide personalized content and advertisements</li>
                    <li>Improve website functionality and performance</li>
                  </ul>
                  <p>
                    You can control cookie settings through your browser preferences, but disabling cookies may affect
                    website functionality.
                  </p>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Data Retention</h2>
                <div className="space-y-4 text-gray-700">
                  <p>
                    We retain your personal information for as long as necessary to provide our services and fulfill the
                    purposes outlined in this policy. Specifically:
                  </p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Customer account information: Until account closure plus 3 years</li>
                    <li>Order and service records: 5 years for business and tax purposes</li>
                    <li>Marketing communications: Until you unsubscribe</li>
                    <li>Website analytics data: 2 years</li>
                  </ul>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Children's Privacy</h2>
                <div className="space-y-4 text-gray-700">
                  <p>
                    Our services are not directed to children under the age of 13, and we do not knowingly collect
                    personal information from children under 13. If we become aware that we have collected personal
                    information from a child under 13, we will take steps to delete such information promptly.
                  </p>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Changes to This Privacy Policy</h2>
                <div className="space-y-4 text-gray-700">
                  <p>
                    We may update this Privacy Policy from time to time to reflect changes in our practices or
                    applicable laws. We will notify you of any material changes by:
                  </p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Posting the updated policy on our website</li>
                    <li>Sending email notifications to registered customers</li>
                    <li>Updating the "Last Updated" date at the top of this policy</li>
                  </ul>
                  <p>
                    Your continued use of our services after any changes indicates your acceptance of the updated
                    policy.
                  </p>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Contact Information</h2>
                <div className="space-y-4 text-gray-700">
                  <p>
                    If you have any questions, concerns, or requests regarding this Privacy Policy or our data
                    practices, please contact us:
                  </p>
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
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Questions About Our Privacy Policy?</h2>
          <p className="text-lg text-gray-600 mb-8">
            We're here to help clarify any concerns you may have about how we handle your personal information.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              asChild
              size="lg"
              className="bg-gradient-to-r from-emerald-500 to-emerald-900 hover:from-emerald-600 hover:to-emerald-800 rounded-full"
            >
              <Link href="/contact">Contact Us</Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/terms">View Terms of Service</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
