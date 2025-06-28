import { Card, CardContent } from "@/components/ui/card"
import { TrendingUp, Globe, Users, Award, Lightbulb, Heart, Star, Linkedin, Mail } from "lucide-react"
import Header from "@/components/Header"
import Footer from "@/components/Footer"

export default function About() {
  return (
    <div className="min-h-screen bg-slate-900">
      <Header />

      <main className="pt-16">
        {/* About Hero Section */}
        <section
          className="relative py-20"
          style={{
            backgroundImage: "url('/about-bg.png')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
          }}
        >
          <div className="absolute inset-0 bg-slate-900/80" />
          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-400 mb-8">
                About AgroGuide
              </h1>
              <p className="text-lg text-gray-300 max-w-4xl mx-auto leading-relaxed">
                AgroGuide is a revolutionary platform designed to empower farmers with intelligent crop selection tools.
                Our goal is to enhance agricultural productivity and sustainability through cutting-edge technology and
                data science.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Data-Driven Insights */}
              <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
                <CardContent className="p-8 text-center">
                  <div className="w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                    <TrendingUp className="w-8 h-8 text-emerald-400" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-4">Data-Driven Insights</h3>
                  <p className="text-gray-300 leading-relaxed">
                    Leverage advanced analytics and machine learning to make informed decisions about crop selection and
                    farming strategies.
                  </p>
                </CardContent>
              </Card>

              {/* Global Impact */}
              <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
                <CardContent className="p-8 text-center">
                  <div className="w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Globe className="w-8 h-8 text-emerald-400" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-4">Global Impact</h3>
                  <p className="text-gray-300 leading-relaxed">
                    Contributing to sustainable agriculture worldwide by helping farmers optimize their crop yields and
                    reduce environmental impact.
                  </p>
                </CardContent>
              </Card>

              {/* Farmer-Centric */}
              <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
                <CardContent className="p-8 text-center">
                  <div className="w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Users className="w-8 h-8 text-emerald-400" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-4">Farmer-Centric</h3>
                  <p className="text-gray-300 leading-relaxed">
                    Built by farmers, for farmers. Our platform addresses real-world challenges with practical,
                    easy-to-use solutions.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Mission & Vision Section */}
        <section className="py-20 bg-slate-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <Card className="bg-slate-700 border-slate-600">
                <CardContent className="p-8 text-center">
                  <div className="w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Award className="w-8 h-8 text-emerald-400" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-4">Our Mission</h3>
                  <p className="text-gray-300">
                    To revolutionize agriculture by providing farmers with intelligent, data-driven tools that maximize
                    yield while promoting sustainable farming practices.
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-slate-700 border-slate-600">
                <CardContent className="p-8 text-center">
                  <div className="w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Lightbulb className="w-8 h-8 text-emerald-400" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-4">Our Vision</h3>
                  <p className="text-gray-300">
                    A world where every farmer has access to cutting-edge technology and insights to feed the growing
                    global population sustainably.
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-slate-700 border-slate-600">
                <CardContent className="p-8 text-center">
                  <div className="w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Heart className="w-8 h-8 text-emerald-400" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-4">Our Values</h3>
                  <p className="text-gray-300">
                    Innovation, sustainability, farmer empowerment, and environmental stewardship guide everything we
                    do.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Our Team Section */}
        <section className="py-20 bg-slate-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">Meet Our Team</h2>
              <p className="text-lg text-gray-300 max-w-3xl mx-auto">
                Our diverse team combines agricultural expertise, technology innovation, and passion for sustainable
                farming to bring you the best crop recommendation solutions.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {/* Team Member 1 - Saraj Dhakal */}
              <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm hover:border-emerald-500 transition-all duration-300">
                <CardContent className="p-6 text-center">
                  <div className="relative w-24 h-24 mx-auto mb-4">
                    <img
                      src="/saraj.jpg"
                      alt="Saraj Dhakal - CEO & Co-Founder"
                      className="w-24 h-24 rounded-full object-cover border-4 border-emerald-500/50 hover:border-emerald-400 transition-all duration-300  filter brightness-125"
                    />
                    <div className="absolute inset-0 rounded-full bg-gradient-to-br from-blue-400/20 to-purple-500/20"></div>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">Saraj Dhakal</h3>
                  <p className="text-emerald-400 text-sm mb-3">CEO & Founder </p>
                  <p className="text-gray-300 text-sm leading-relaxed mb-4">
                    Computer engineer with advanced agricultural knowledge with 22+ years of experience in precision farming and sustainable agriculture
                    practices.
                  </p>
                  <div className="flex justify-center space-x-3">
                    <div className="w-8 h-8 bg-slate-700 rounded-full flex items-center justify-center hover:bg-emerald-500 transition-colors cursor-pointer">
                      <Linkedin className="w-4 h-4 text-white" />
                    </div>
                    <div className="w-8 h-8 bg-slate-700 rounded-full flex items-center justify-center hover:bg-emerald-500 transition-colors cursor-pointer">
                      <Mail className="w-4 h-4 text-white" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Team Member 2 - Samar Bhattarai */}
              <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm hover:border-emerald-500 transition-all duration-300">
                <CardContent className="p-6 text-center">
                  <div className="relative w-24 h-24 mx-auto mb-4">
                    <img
                      src="/samar.jpg"
                      alt="Samar Bhattarai CTO"
                      className="w-24 h-24 rounded-full object-cover border-4 border-emerald-500/50 hover:border-emerald-400 transition-all duration-300  filter brightness-125"
                    />
                    <div className="absolute inset-0 rounded-full bg-gradient-to-br from-blue-400/20 to-purple-500/20"></div>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">Samar Bhattarai</h3>
                  <p className="text-emerald-400 text-sm mb-3">CTO </p>
                  <p className="text-gray-300 text-sm leading-relaxed mb-4">
                    Machine learning expert specializing in agricultural AI and predictive analytics for crop
                    optimization.
                  </p>
                  <div className="flex justify-center space-x-3">
                    <div className="w-8 h-8 bg-slate-700 rounded-full flex items-center justify-center hover:bg-emerald-500 transition-colors cursor-pointer">
                      <Linkedin className="w-4 h-4 text-white" />
                    </div>
                    <div className="w-8 h-8 bg-slate-700 rounded-full flex items-center justify-center hover:bg-emerald-500 transition-colors cursor-pointer">
                      <Mail className="w-4 h-4 text-white" />
                    </div>
                  </div>
                </CardContent>
              </Card>



              {/* Team Member 3 - NIshani Kumari Rai */}
              <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm hover:border-emerald-500 transition-all duration-300">
                <CardContent className="p-6 text-center">
                  <div className="relative w-24 h-24 mx-auto mb-4">
                    <img
                      src="/nisha.jpg"
                      alt="Nishani Kumari Rai Head of Agriculture"
                      className="w-24 h-24 rounded-full object-cover border-4 border-emerald-500/50 hover:border-emerald-400 transition-all duration-300  filter brightness-125"
                    />
                    <div className="absolute inset-0 rounded-full bg-gradient-to-br from-blue-400/20 to-purple-500/20"></div>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">Nishani Kumari Rai </h3>
                  <p className="text-emerald-400 text-sm mb-3">Head of Agriculture </p>
                  <p className="text-gray-300 text-sm leading-relaxed mb-4">
                    Soil scientist and crop specialist with deep knowledge of Nepalese farming conditions and
                    traditional practices.
                  </p>
                  <div className="flex justify-center space-x-3">
                    <div className="w-8 h-8 bg-slate-700 rounded-full flex items-center justify-center hover:bg-emerald-500 transition-colors cursor-pointer">
                      <Linkedin className="w-4 h-4 text-white" />
                    </div>
                    <div className="w-8 h-8 bg-slate-700 rounded-full flex items-center justify-center hover:bg-emerald-500 transition-colors cursor-pointer">
                      <Mail className="w-4 h-4 text-white" />
                    </div>
                  </div>
                </CardContent>
              </Card>


              {/* Team Member 4 - Soviyat Lamsal */}
              <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm hover:border-emerald-500 transition-all duration-300">
                <CardContent className="p-6 text-center">
                  <div className="relative w-24 h-24 mx-auto mb-4">
                    <img
                      src="/soviyat.jpg"
                      alt="Soviyat Lamsal"
                      className="w-24 h-24 rounded-full object-cover border-4 border-emerald-500/50 hover:border-emerald-400 transition-all duration-300  filter brightness-125"
                    />
                    <div className="absolute inset-0 rounded-full bg-gradient-to-br from-pink-400/20 to-purple-500/20"></div>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">Soviyat Lamsal</h3>
                  <p className="text-emerald-400 text-sm mb-3">Head of Product</p>
                  <p className="text-gray-300 text-sm leading-relaxed mb-4">
                    UX designer and product strategist focused on creating intuitive farming solutions for rural
                    communities.
                  </p>
                  <div className="flex justify-center space-x-3">
                    <div className="w-8 h-8 bg-slate-700 rounded-full flex items-center justify-center hover:bg-emerald-500 transition-colors cursor-pointer">
                      <Linkedin className="w-4 h-4 text-white" />
                    </div>
                    <div className="w-8 h-8 bg-slate-700 rounded-full flex items-center justify-center hover:bg-emerald-500 transition-colors cursor-pointer">
                      <Mail className="w-4 h-4 text-white" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="py-20 bg-gradient-to-br from-emerald-900/20 to-teal-900/20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">What Farmers Say</h2>
              <p className="text-lg text-gray-300 max-w-3xl mx-auto">
                Hear from farmers across Nepal who have transformed their agricultural practices with AgroGuide's
                intelligent crop recommendations.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Testimonial 1 */}
              <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full flex items-center justify-center mr-4">
                      <span className="text-lg font-bold text-white">RB</span>
                    </div>
                    <div>
                      <h4 className="text-white font-semibold">Ram Bahadur Thapa</h4>
                      <p className="text-gray-400 text-sm">Chitwan District</p>
                    </div>
                  </div>
                  <div className="flex mb-3">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-gray-300 leading-relaxed">
                    "AgroGuide helped me increase my tomato yield by 40% last season. The soil analysis and crop
                    recommendations were spot-on. Now I'm planning my next crop with confidence!"
                  </p>
                </CardContent>
              </Card>

              {/* Testimonial 2 */}
              <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center mr-4">
                      <span className="text-lg font-bold text-white">SK</span>
                    </div>
                    <div>
                      <h4 className="text-white font-semibold">Sita Kumari Poudel</h4>
                      <p className="text-gray-400 text-sm">Kaski District</p>
                    </div>
                  </div>
                  <div className="flex mb-3">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-gray-300 leading-relaxed">
                    "As a new farmer, I was unsure about what to grow. AgroGuide's predictions guided me to choose
                    cauliflower, and I got excellent results. The platform is very easy to use!"
                  </p>
                </CardContent>
              </Card>

              {/* Testimonial 3 */}
              <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-red-500 rounded-full flex items-center justify-center mr-4">
                      <span className="text-lg font-bold text-white">BG</span>
                    </div>
                    <div>
                      <h4 className="text-white font-semibold">Bikash Gurung</h4>
                      <p className="text-gray-400 text-sm">Lalitpur District</p>
                    </div>
                  </div>
                  <div className="flex mb-3">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-gray-300 leading-relaxed">
                    "The weather and market insights are incredibly valuable. I switched from rice to vegetables based
                    on AgroGuide's recommendation and doubled my income this year."
                  </p>
                </CardContent>
              </Card>

              {/* Testimonial 4 */}
              <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center mr-4">
                      <span className="text-lg font-bold text-white">MS</span>
                    </div>
                    <div>
                      <h4 className="text-white font-semibold">Maya Shrestha</h4>
                      <p className="text-gray-400 text-sm">Bhaktapur District</p>
                    </div>
                  </div>
                  <div className="flex mb-3">
                    {[...Array(4)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                    ))}
                    <Star className="w-4 h-4 text-gray-400" />
                  </div>
                  <p className="text-gray-300 leading-relaxed">
                    "The soil nutrient analysis feature is amazing. I learned so much about my land and now use
                    fertilizers more efficiently. My crops are healthier than ever!"
                  </p>
                </CardContent>
              </Card>

              {/* Testimonial 5 */}
              <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full flex items-center justify-center mr-4">
                      <span className="text-lg font-bold text-white">DT</span>
                    </div>
                    <div>
                      <h4 className="text-white font-semibold">Deepak Tamang</h4>
                      <p className="text-gray-400 text-sm">Nuwakot District</p>
                    </div>
                  </div>
                  <div className="flex mb-3">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-gray-300 leading-relaxed">
                    "AgroGuide's timeline feature helps me plan my farming activities perfectly. I never miss important
                    tasks like fertilization or pest control anymore."
                  </p>
                </CardContent>
              </Card>

              {/* Testimonial 6 */}
              <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-teal-400 to-cyan-500 rounded-full flex items-center justify-center mr-4">
                      <span className="text-lg font-bold text-white">LM</span>
                    </div>
                    <div>
                      <h4 className="text-white font-semibold">Laxmi Maharjan</h4>
                      <p className="text-gray-400 text-sm">Kathmandu District</p>
                    </div>
                  </div>
                  <div className="flex mb-3">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-gray-300 leading-relaxed">
                    "Being a commercial farmer, I need accurate predictions. AgroGuide's AI recommendations have helped
                    me reduce risks and maximize profits across my 50-kattha farm."
                  </p>
                </CardContent>
              </Card>
            </div>


          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
