"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Mail, Lock, Eye, EyeOff, ArrowLeft, AlertCircle, User, MapPin } from "lucide-react"
import Link from "next/link"
import axios from "axios"

const capitalize = (value) => {
  return value ? value.charAt(0).toUpperCase() + value.slice(1).toLowerCase() : "";
};
export default function RegisterPage() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  const users = {
    firstName: "",
    email: "",
    address: "",
    phoneNumber: "",
    password: "",
    confirmPassword: "",
    lastName: "",
    farmSize: "",
    role: "User",
    status: "Active",
    experience: "",

  };
  const [user, setUser] = useState(users);

  const handleRegister = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")
    setSuccess("")

    // Validation
    if (user.password !== user.confirmPassword) {
      setError("Passwords do not match")
      setIsLoading(false)
      return
    }
    const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*()_+{}\[\]:;<>,.?~\\/-]).{6,}$/

    if (!passwordRegex.test(user.password)) {
      setError("Password must include at least one uppercase letter and one special character.")
      setIsLoading(false)
      return
    }

    if (!user.agreeToTerms) {
      setError("Please agree to the terms and conditions")
      setIsLoading(false)
      return
    }
    if (!user.farmSize) {
      setError("Please select your farm size ")
      setIsLoading(false)
      return
    }
    if (!user.experience) {
      setError("Please select experience level")
      setIsLoading(false)
      return
    }

    try {
      // Simulate API call

      await axios
        .post("http://localhost:8000/api/user", {
          ...user,
          role: capitalize(user.role),
          status: capitalize(user.status),
        })

      setSuccess("Account created successfully! Redirecting to login...")
      setTimeout(() => {
        router.push("/login")
      }, 3000)
    } catch (err) {
      console.log(err);
      setError("Registration failed. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (field, value) => {
    setUser((prev) => ({ ...prev, [field]: value }))
    setError("")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-900 flex items-center justify-center p-4">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[url('/hero-bg.png')] bg-cover bg-center opacity-10" />

      <div className="relative z-10 w-full max-w-lg">
        {/* Back to Home */}
        <div className="mb-6">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-emerald-400 hover:text-emerald-300 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
        </div>

        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => router.push("/")} >
              <img src="/logo.png" alt="AgroGuide Logo" className="h-[70px] w-auto" />
            </div>
            <span className="text-2xl font-bold text-white">AgroGuide</span>
          </div>
          <p className="text-slate-400">Create your farming account</p>
        </div>

        <Card className="bg-white/10 backdrop-blur-md border-white/20 shadow-2xl">
          <CardHeader className="pb-4">
            <CardTitle className="text-center text-white">Join AgroGuide</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleRegister} className="space-y-4">
              {error && (
                <Alert className="flex items-start gap-3 bg-red-500/10 border border-red-500/30 text-red-400 p-4 rounded-lg shadow-md">
                  <div className="mt-1">
                    <AlertCircle className="h-5 w-5 text-red-400" />
                  </div>
                  <AlertDescription className="text-sm font-medium leading-relaxed text-red-300">
                    {error}
                  </AlertDescription>
                </Alert>
              )}


              {success && (
                <Alert className="flex items-start gap-3 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 p-4 rounded-lg shadow-md">
                  <div className="mt-1">
                    <AlertCircle className="h-5 w-5 text-emerald-400" />
                  </div>
                  <AlertDescription className="text-sm font-medium leading-relaxed text-emerald-200">
                    {success}
                  </AlertDescription>
                </Alert>
              )}


              {/* Name Fields */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName" className="text-white">
                    First Name
                  </Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                    <Input
                      id="firstName"
                      type="text"
                      placeholder="Saraj"
                      value={user.firstName}
                      onChange={(e) => handleInputChange("firstName", e.target.value)}
                      className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-slate-400 focus:border-emerald-500"
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName" className="text-white">
                    Last Name
                  </Label>
                  <Input
                    id="lastName"
                    type="text"
                    placeholder="Dhakal"
                    value={user.lastName}
                    onChange={(e) => handleInputChange("lastName", e.target.value)}
                    className="bg-white/10 border-white/20 text-white placeholder:text-slate-400 focus:border-emerald-500"
                    required
                  />
                </div>
              </div>

              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-white">
                  Email
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="sarajdhakal@gmail.com"
                    value={user.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-slate-400 focus:border-emerald-500"
                    required
                  />
                </div>
              </div>

              {/* Password Fields */}
              <div className="grid grid-cols-1 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-white">
                    Password
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Create password"
                      value={user.password}
                      onChange={(e) => handleInputChange("password", e.target.value)}
                      className="pl-10 pr-10 bg-white/10 border-white/20 text-white placeholder:text-slate-400 focus:border-emerald-500"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-white"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="text-white">
                    Confirm Password
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Confirm password"
                      value={user.confirmPassword}
                      onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                      className="pl-10 pr-10 bg-white/10 border-white/20 text-white placeholder:text-slate-400 focus:border-emerald-500"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-white"
                    >
                      {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              </div>

              {/* Farm Information */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="address" className="text-white">
                    Farm Location
                  </Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                    <Input
                      id="address"
                      type="text"
                      placeholder="City, State"
                      value={user.address}
                      onChange={(e) => handleInputChange("address", e.target.value)}
                      className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-slate-400 focus:border-emerald-500"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="farmSize" className="text-white">
                      Farm Size
                    </Label>
                    <Select onValueChange={(value) => handleInputChange("farmSize", value)}>
                      <SelectTrigger className="bg-white/10 border-white/20 text-white">
                        <SelectValue placeholder="Select size" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="small">Under 10 kattha</SelectItem>
                        <SelectItem value="medium">10-100 kattha</SelectItem>
                        <SelectItem value="large">100-500 kattha</SelectItem>
                        <SelectItem value="enterprise">500+ kattha</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="experience" className="text-white">
                      Experience
                    </Label>
                    <Select onValueChange={(value) => handleInputChange("experience", value)}>
                      <SelectTrigger className="bg-white/10 border-white/20 text-white">
                        <SelectValue placeholder="Years" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="beginner">0-2 years</SelectItem>
                        <SelectItem value="intermediate">3-10 years</SelectItem>
                        <SelectItem value="experienced">10+ years</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {/* Checkboxes */}
              <div className="space-y-3">
                <div className="flex items-start space-x-2">
                  <Checkbox
                    id="agreeToTerms"
                    checked={user.agreeToTerms}
                    onCheckedChange={(checked) => handleInputChange("agreeToTerms", checked)}
                    className="border-white/20 data-[state=checked]:bg-emerald-600 mt-1"
                  />
                  <Label htmlFor="agreeToTerms" className="text-sm text-slate-300 leading-relaxed">
                    I agree to the{" "}
                    <Link href="/terms" className="text-emerald-400 hover:text-emerald-300">
                      Terms of Service
                    </Link>{" "}
                    and{" "}
                    <Link href="/privacy" className="text-emerald-400 hover:text-emerald-300">
                      Privacy Policy
                    </Link>
                  </Label>
                </div>


              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-2.5 font-semibold"
              >
                {isLoading ? "Creating Account..." : "Create Account"}
              </Button>

              <div className="text-center">
                <span className="text-slate-400">Already have an account? </span>
                <Link href="/login" className="text-emerald-400 hover:text-emerald-300 font-medium">
                  Sign in
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center mt-8 text-slate-400 text-sm">
          <p>&copy; 2024 AgroGuide. All rights reserved.</p>
        </div>
      </div>
    </div>
  )
}
