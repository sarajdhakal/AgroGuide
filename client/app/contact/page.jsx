"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Send, MapPin, Phone, Mail, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import Header from "@/components/Header"
import Footer from "@/components/Footer"

export default function ContactPage() {
    const router = useRouter()
    const [formState, setFormState] = useState({
        name: "",
        email: "",
        subject: "",
        message: "",
    })
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isSubmitted, setIsSubmitted] = useState(false)

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormState((prev) => ({ ...prev, [name]: value }))
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        setIsSubmitting(true)

        // Simulate form submission
        setTimeout(() => {
            setIsSubmitting(false)
            setIsSubmitted(true)
            setFormState({
                name: "",
                email: "",
                subject: "",
                message: "",
            })

            // Reset success message after 5 seconds
            setTimeout(() => {
                setIsSubmitted(false)
            }, 5000)
        }, 1500)
    }

    return (
        <div className="min-h-screen bg-slate-900">
            <Header />

            <main className="pt-24 pb-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Hero Section */}
                    <div className="text-center mb-16">
                        <h1 className="text-4xl font-bold text-white mb-4">Get in Touch</h1>
                        <p className="text-lg text-gray-300 max-w-2xl mx-auto">
                            Have questions about AgroGuide? We're here to help. Reach out to our team and we'll get back to you as
                            soon as possible.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Contact Information */}
                        <div className="lg:col-span-1">
                            <div className="space-y-6">
                                <Card className="bg-slate-800 border-slate-700">
                                    <CardContent className="p-6">
                                        <div className="flex items-start space-x-4">
                                            <div className="mt-1 bg-emerald-500/20 p-2 rounded-full">
                                                <MapPin className="h-5 w-5 text-emerald-400" />
                                            </div>
                                            <div>
                                                <h3 className="text-lg font-medium text-white mb-1">Our Location</h3>
                                                <p className="text-gray-300">
                                                    Ward Chowk, Fulbari
                                                    <br />
                                                    Bhatatpur-15, Chitwan
                                                    <br />
                                                    Nepal
                                                </p>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>

                                <Card className="bg-slate-800 border-slate-700">
                                    <CardContent className="p-6">
                                        <div className="flex items-start space-x-4">
                                            <div className="mt-1 bg-emerald-500/20 p-2 rounded-full">
                                                <Phone className="h-5 w-5 text-emerald-400" />
                                            </div>
                                            <div>
                                                <h3 className="text-lg font-medium text-white mb-1">Call Us</h3>
                                                <p className="text-gray-300">
                                                    +977 9866115177
                                                    <br />
                                                    Sunday-Friday, 9am-5pm NST
                                                </p>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>

                                <Card className="bg-slate-800 border-slate-700">
                                    <CardContent className="p-6">
                                        <div className="flex items-start space-x-4">
                                            <div className="mt-1 bg-emerald-500/20 p-2 rounded-full">
                                                <Mail className="h-5 w-5 text-emerald-400" />
                                            </div>
                                            <div>
                                                <h3 className="text-lg font-medium text-white mb-1">Email Us</h3>
                                                <p className="text-gray-300">
                                                    support@agroguide.com
                                                    <br />
                                                    info@agroguide.com
                                                </p>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        </div>

                        {/* Contact Form */}
                        <div className="lg:col-span-2">
                            <Card className="bg-slate-800 border-slate-700">
                                <CardContent className="p-6">
                                    <h2 className="text-2xl font-bold text-white mb-6">Send Us a Message</h2>

                                    {isSubmitted ? (
                                        <div className="bg-emerald-500/20 border border-emerald-500/50 rounded-lg p-4 flex items-center">
                                            <CheckCircle className="h-5 w-5 text-emerald-400 mr-3" />
                                            <p className="text-emerald-400">Thank you for your message! We'll get back to you shortly.</p>
                                        </div>
                                    ) : (
                                        <form onSubmit={handleSubmit} className="space-y-4">
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                <div>
                                                    <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-1">
                                                        Your Name
                                                    </label>
                                                    <Input
                                                        id="name"
                                                        name="name"
                                                        value={formState.name}
                                                        onChange={handleChange}
                                                        required
                                                        className="bg-slate-700 border-slate-600 text-white"
                                                    />
                                                </div>
                                                <div>
                                                    <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">
                                                        Your Email
                                                    </label>
                                                    <Input
                                                        id="email"
                                                        name="email"
                                                        type="email"
                                                        value={formState.email}
                                                        onChange={handleChange}
                                                        required
                                                        className="bg-slate-700 border-slate-600 text-white"
                                                    />
                                                </div>
                                            </div>

                                            <div>
                                                <label htmlFor="subject" className="block text-sm font-medium text-gray-300 mb-1">
                                                    Subject
                                                </label>
                                                <Input
                                                    id="subject"
                                                    name="subject"
                                                    value={formState.subject}
                                                    onChange={handleChange}
                                                    required
                                                    className="bg-slate-700 border-slate-600 text-white"
                                                />
                                            </div>

                                            <div>
                                                <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-1">
                                                    Message
                                                </label>
                                                <Textarea
                                                    id="message"
                                                    name="message"
                                                    rows={6}
                                                    value={formState.message}
                                                    onChange={handleChange}
                                                    required
                                                    className="bg-slate-700 border-slate-600 text-white"
                                                />
                                            </div>

                                            <Button
                                                type="submit"
                                                className="bg-emerald-500 hover:bg-emerald-600 text-white w-full"
                                                disabled={isSubmitting}
                                            >
                                                {isSubmitting ? (
                                                    <>Sending...</>
                                                ) : (
                                                    <>
                                                        <Send className="h-4 w-4 mr-2" />
                                                        Send Message
                                                    </>
                                                )}
                                            </Button>
                                        </form>
                                    )}
                                </CardContent>
                            </Card>
                        </div>
                    </div>

                    {/* Map Section */}
                    <div className="mt-16">
                        <Card className="bg-slate-800 border-slate-700 overflow-hidden">
                            <div className="h-96 w-full bg-slate-700 flex items-center justify-center">
                                <div className="text-center p-8">
                                    <p className="text-gray-400 mb-2">Map placeholder</p>
                                    <p className="text-sm text-gray-500">An interactive map would be displayed here in production</p>
                                </div>
                            </div>
                        </Card>
                    </div>

                    {/* FAQ Section */}
                    <div className="mt-16">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl font-bold text-white mb-4">Frequently Asked Questions</h2>
                            <p className="text-gray-300 max-w-2xl mx-auto">
                                Find quick answers to common questions about AgroGuide and our services.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {[
                                {
                                    question: "How do I get started with AgroGuide?",
                                    answer:
                                        "Sign up for an account, input your farm details, and our AI will provide personalized crop recommendations based on your specific conditions.",
                                },
                                {
                                    question: "Is my data secure with AgroGuide?",
                                    answer:
                                        "Yes, we use enterprise-grade security measures to protect all your data. Your information is encrypted and never shared with third parties without your consent.",
                                },
                                {
                                    question: "How accurate are the crop predictions?",
                                    answer:
                                        "Our AI model has a 95% accuracy rate based on historical data and is continuously improving with more data points and farmer feedback.",
                                },
                                {
                                    question: "Do you offer support for technical issues?",
                                    answer:
                                        "Yes, we provide 24/7 technical support via email and phone. Our team is always ready to assist you with any questions or issues.",
                                },
                            ].map((faq, index) => (
                                <Card key={index} className="bg-slate-800 border-slate-700">
                                    <CardContent className="p-6">
                                        <h3 className="text-lg font-medium text-white mb-2">{faq.question}</h3>
                                        <p className="text-gray-300">{faq.answer}</p>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    )
}
