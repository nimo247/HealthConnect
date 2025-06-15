import type React from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Activity, Stethoscope, Calendar, FileText, MessageSquare, Bell, MapPin } from "lucide-react"

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 relative">
      <header className="bg-gray-900/80 backdrop-blur-sm border-b border-gray-700 relative z-10">
        <div className="container mx-auto px-4 py-6 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Stethoscope className="h-8 w-8 text-green-400" />
            <h1 className="text-2xl font-bold text-white">HealthConnect</h1>
          </div>
          <div className="flex gap-4">
            <Link href="/login">
              <Button variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-700">
                Login
              </Button>
            </Link>
            <Link href="/signup">
              <Button className="bg-green-600 hover:bg-green-700 text-white">Sign Up</Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12 relative z-10">
        <section className="mb-16 text-center">
          <h2 className="text-4xl font-bold text-white mb-4">Your Complete Healthcare Companion</h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
            Connect with nearby clinics, monitor your health metrics, and receive personalized recommendations all in
            one place.
          </p>
          <div className="flex justify-center gap-4">
            <Link href="/signup">
              <Button size="lg" className="bg-green-600 hover:bg-green-700 text-white">
                Get Started
              </Button>
            </Link>
            <Link href="/features">
              <Button size="lg" variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-700">
                Learn More
              </Button>
            </Link>
          </div>
        </section>

        <section className="mb-16">
          <h3 className="text-2xl font-bold text-center mb-8 text-white">Key Features</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <FeatureCard
              icon={<MapPin className="h-8 w-8 text-green-400" />}
              title="Find Nearby Clinics"
              description="Discover available clinics and doctors in your area with real-time availability information."
            />
            <FeatureCard
              icon={<Activity className="h-8 w-8 text-green-400" />}
              title="Health Monitoring"
              description="Track your blood pressure, sugar levels, and other vital metrics with personalized recommendations."
            />
            <FeatureCard
              icon={<Bell className="h-8 w-8 text-green-400" />}
              title="Health Alerts"
              description="Receive timely alerts about disease outbreaks, vaccine availability, and medication reminders."
            />
            <FeatureCard
              icon={<Calendar className="h-8 w-8 text-green-400" />}
              title="Appointment Booking"
              description="Book appointments with doctors and clinics directly through the platform."
            />
            <FeatureCard
              icon={<FileText className="h-8 w-8 text-green-400" />}
              title="Health Records"
              description="Upload and summarize your health records for easy access and sharing with healthcare providers."
            />
            <FeatureCard
              icon={<MessageSquare className="h-8 w-8 text-green-400" />}
              title="Symptom Analysis"
              description="Chat with our AI assistant to analyze symptoms and get preliminary health insights."
            />
          </div>
        </section>

        <section className="bg-gray-800/50 backdrop-blur-sm rounded-lg shadow-lg p-8 mb-16 border border-gray-700">
          <h3 className="text-2xl font-bold text-center mb-6 text-white">How It Works</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-green-500/20 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 border border-green-500/30">
                <span className="text-2xl font-bold text-green-400">1</span>
              </div>
              <h4 className="text-xl font-semibold mb-2 text-white">Create an Account</h4>
              <p className="text-gray-300">Sign up and complete your health profile with relevant information.</p>
            </div>
            <div className="text-center">
              <div className="bg-green-500/20 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 border border-green-500/30">
                <span className="text-2xl font-bold text-green-400">2</span>
              </div>
              <h4 className="text-xl font-semibold mb-2 text-white">Track Your Health</h4>
              <p className="text-gray-300">Regularly update your health metrics and receive personalized insights.</p>
            </div>
            <div className="text-center">
              <div className="bg-green-500/20 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 border border-green-500/30">
                <span className="text-2xl font-bold text-green-400">3</span>
              </div>
              <h4 className="text-xl font-semibold mb-2 text-white">Connect with Clinics</h4>
              <p className="text-gray-300">Find and book appointments with healthcare providers in your area.</p>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-gray-900 border-t border-gray-700 text-white py-12 relative z-10">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between">
            <div className="mb-8 md:mb-0">
              <div className="flex items-center gap-2 mb-4">
                <Stethoscope className="h-6 w-6 text-green-400" />
                <h2 className="text-xl font-bold">HealthConnect</h2>
              </div>
              <p className="text-gray-400 max-w-md">
                Connecting patients with healthcare providers and empowering better health management.
              </p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
              <div>
                <h3 className="text-lg font-semibold mb-4">Features</h3>
                <ul className="space-y-2">
                  <li>
                    <a href="#" className="text-gray-400 hover:text-white">
                      Health Monitoring
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-gray-400 hover:text-white">
                      Clinic Finder
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-gray-400 hover:text-white">
                      Health Records
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-gray-400 hover:text-white">
                      Symptom Analysis
                    </a>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-4">Company</h3>
                <ul className="space-y-2">
                  <li>
                    <a href="#" className="text-gray-400 hover:text-white">
                      About Us
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-gray-400 hover:text-white">
                      Contact
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-gray-400 hover:text-white">
                      Careers
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-gray-400 hover:text-white">
                      Privacy Policy
                    </a>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-4">Support</h3>
                <ul className="space-y-2">
                  <li>
                    <a href="#" className="text-gray-400 hover:text-white">
                      Help Center
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-gray-400 hover:text-white">
                      FAQs
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-gray-400 hover:text-white">
                      Community
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-gray-400 hover:text-white">
                      Feedback
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
            <p>&copy; {new Date().getFullYear()} HealthConnect. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <Card className="border-gray-700 bg-gray-800/50 backdrop-blur-sm hover:bg-gray-800/70 transition-all duration-300 hover:shadow-lg hover:shadow-green-500/10">
      <CardContent className="p-6 text-center">
        <div className="mb-4 flex justify-center">{icon}</div>
        <h4 className="text-xl font-semibold mb-2 text-white">{title}</h4>
        <p className="text-gray-300">{description}</p>
      </CardContent>
    </Card>
  )
}
