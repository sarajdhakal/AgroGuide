"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ArrowLeft, Save, User, Mail, MapPin, AlertCircle, CheckCircle } from "lucide-react"
import AdminSidebar from "@/components/admin/AdminSidebar"
import AdminHeader from "@/components/admin/AdminHeader"
import axios from "axios"

const capitalize = (value) => {
  return value ? value.charAt(0).toUpperCase() + value.slice(1).toLowerCase() : "";
};
export default function AddUserPage() {
  const router = useRouter()
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  const users = {
    firstName: "",
    email: "",
    address: "",
    phoneNumber: "",
    lastName: "",
    farmSize: "",
    description: "",
    role: "User",
    status: "Active",
    experience: "",

  };
  const [user, setUser] = useState(users);


  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")
    setSuccess("")

    await axios
      .post("http://localhost:8000/api/user", {
        ...user,
        role: capitalize(user.role),
        status: capitalize(user.status),
      })
      .then((response) => {
        setSuccess(response.data.message || "User created successfully!")
        console.log("User Created Successfully.")
        setTimeout(() => {
          router.push("/admin/users/add")
        }, 2000)

      })
      .catch((error) => {
        console.log(error);
        setError("Failed to create user. Please try again.");
      });


    // try {
    //     const response = await fetch("http://localhost:8000/api/user", {
    //       method: "POST",
    //       headers: {
    //         "Content-Type": "application/json",
    //       },
    //       body: JSON.stringify(formData),
    //     })

    //     const data = await response.json()

    //     if (response.ok) {
    //       setSuccess(data.message || "User created successfully!")
    //       setTimeout(() => {
    //         router.push("/admin")
    //       }, 2000)
    //     } else {
    //       setError(data.message || "Failed to create user.")
    //     }
    //   } catch (err) {
    //     setError("Server error. Please try again.")
    //     console.error(err)
    //   } finally {
    //     setIsLoading(false)
    //   }
  }

  const handleInputChange = (field, value) => {

    setUser((prev) => ({ ...prev, [field]: value }))
    console.log(field, value)
    setError("")
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <AdminSidebar
        activeTab="users"
        setActiveTab={() => { }}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />

      <div className={`transition-all duration-300 ${sidebarOpen ? "ml-64" : "ml-16"}`}>
        <AdminHeader sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} activeTab="users" />

        <main className="p-6">
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="flex items-center gap-4 mb-6">
              <Button variant="ghost" onClick={() => router.back()} className="flex items-center gap-2">
                <ArrowLeft className="w-4 h-4" />
                Back
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Add New User</h1>
                <p className="text-slate-600 dark:text-slate-400">Create a new user account</p>
              </div>
            </div>

            {/* Form */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5" />
                  User Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {error && (
                    <Alert className="bg-red-50 border-red-200 text-red-800">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}

                  {success && (
                    <Alert className="bg-green-50 border-green-200 text-green-800">
                      <CheckCircle className="h-4 w-4" />
                      <AlertDescription>{success}</AlertDescription>
                    </Alert>
                  )}

                  {/* Personal Information */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name *</Label>
                      <Input
                        id="firstName" name="firstName"
                        value={user.firstName}
                        onChange={(e) => handleInputChange("firstName", e.target.value)}
                        placeholder="Saraj"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name *</Label>
                      <Input name="lastName"
                        id="lastName"
                        value={user.lastName}
                        onChange={(e) => handleInputChange("lastName", e.target.value)}
                        placeholder="Dhakal"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address *</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                        <Input name="email"
                          id="email"
                          type="email"
                          value={user.email}
                          onChange={(e) => handleInputChange("email", e.target.value)}
                          placeholder="sarajdhakal@gmail.com"
                          className="pl-10"
                          required
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phoneNumber">Phone Number</Label>
                      <Input
                        id="phoneNumber" name="phoneNumber"
                        value={user.phoneNumber}
                        onChange={(e) => handleInputChange("phoneNumber", e.target.value)}
                        placeholder="+977 9866115177"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="password">Password *</Label>
                      <Input
                        id="password"
                        type="password" name="password"
                        value={user.password}
                        onChange={(e) => handleInputChange("password", e.target.value)}
                        placeholder="Create password"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="role">Role</Label>
                      <Select name="role" value={user.role} onValueChange={(value) => handleInputChange("role", value)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="User">User</SelectItem>
                          <SelectItem value="Admin">Admin</SelectItem>
                          <SelectItem value="Moderator">Moderator</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="status">Account Status</Label>
                    <Select name="status" value={user.status} onValueChange={(value) => handleInputChange("status", value)}>
                      <SelectTrigger className="w-full md:w-48">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Active">Active</SelectItem>
                        <SelectItem value="Inactive">Inactive</SelectItem>
                        <SelectItem value="Suspended">Suspended</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Farm Information */}
                  <div className="border-t pt-6">
                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                      <MapPin className="w-5 h-5" />
                      Farm Information
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="farmLocation">Farm Location</Label>
                        <Input
                          id="farmLocation" name="address"
                          value={user.address}
                          onChange={(e) => handleInputChange("address", e.target.value)}
                          placeholder="City, State"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="farmSize">Farm Size</Label>
                        <Select
                          value={user.farmSize} name="farmSize"
                          onValueChange={(value) => handleInputChange("farmSize", value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select farm size" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="small">Under 10 acres</SelectItem>
                            <SelectItem value="medium">10-100 acres</SelectItem>
                            <SelectItem value="large">100-500 acres</SelectItem>
                            <SelectItem value="enterprise">500+ acres</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-2 mt-4">
                      <Label htmlFor="experience">Farming Experience</Label>
                      <Select
                        value={user.experience} name="experience"
                        onValueChange={(value) => handleInputChange("experience", value)}
                      >
                        <SelectTrigger className="w-full md:w-48">
                          <SelectValue placeholder="Select experience" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="beginner">0-2 years</SelectItem>
                          <SelectItem value="intermediate">3-10 years</SelectItem>
                          <SelectItem value="experienced">10+ years</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Additional Notes */}
                  <div className="space-y-2">
                    <Label htmlFor="notes">Additional Notes</Label>
                    <Textarea
                      id="notes" name="description"
                      value={user.description}
                      onChange={(e) => handleInputChange("description", e.target.value)}
                      placeholder="Any additional information about the user..."
                      rows={3}
                    />
                  </div>

                  {/* Submit Buttons */}
                  <div className="flex gap-4 pt-6">
                    <Button type="submit" disabled={isLoading} className="bg-emerald-600 hover:bg-emerald-700">
                      <Save className="w-4 h-4 mr-2" />
                      {isLoading ? "Creating User..." : "Create User"}
                    </Button>
                    <Button type="button" variant="outline" onClick={() => router.back()}>
                      Cancel
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  )
}
