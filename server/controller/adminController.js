import Admin from "../model/admin.js"
// Create Admin
export const createAdmin = async (req, res) => {
    const { name, email, password } = req.body

    if (!name || !email || !password) {
        return res.status(400).json({ message: "All fields are required" })
    }

    try {
        const existing = await Admin.findOne({ email })
        if (existing) {
            return res.status(409).json({ message: "Admin with this email already exists" })
        }

        const newAdmin = new Admin({ name, email, password })
        await newAdmin.save()

        res.status(201).json({
            message: "Admin created successfully",
            admin: {
                id: newAdmin._id,
                name: newAdmin.name,
                email: newAdmin.email,
            },
        })
    } catch (err) {
        res.status(500).json({ message: "Server error" })
    }
}

// Get All Admins (optional)
export const getAllAdmins = async (req, res) => {
    try {
        const admins = await Admin.find().select("-password")
        res.status(200).json(admins)
    } catch (err) {
        res.status(500).json({ message: "Server error" })
    }
}

// Update Admin
export const updateAdmin = async (req, res) => {
    const { id } = req.params
    const { name, email, password } = req.body

    try {
        const updated = await Admin.findByIdAndUpdate(
            id,
            { name, email, password },
            { new: true, runValidators: true }
        )

        if (!updated) {
            return res.status(404).json({ message: "Admin not found" })
        }

        res.status(200).json({
            message: "Admin updated",
            admin: {
                id: updated._id,
                name: updated.name,
                email: updated.email,
            },
        })
    } catch (err) {
        res.status(500).json({ message: "Server error" })
    }
}

// Delete Admin
export const deleteAdmin = async (req, res) => {
    const { id } = req.params

    try {
        const deleted = await Admin.findByIdAndDelete(id)
        if (!deleted) {
            return res.status(404).json({ message: "Admin not found" })
        }

        res.status(200).json({ message: "Admin deleted" })
    } catch (err) {
        res.status(500).json({ message: "Server error" })
    }
}
// Get single admin by ID
export const getAdminById = async (req, res) => {
    const { id } = req.params

    try {
        const admin = await Admin.findById(id).select("-password")
        if (!admin) {
            return res.status(404).json({ message: "Admin not found" })
        }

        res.status(200).json(admin)
    } catch (err) {
        res.status(500).json({ message: "Server error" })
    }
}
//login
export const adminLogin = async (req, res) => {
    const { email, password } = req.body

    if (!email || !password) {
        return res.status(400).json({ message: "Email and password are required" })
    }

    try {
        const admin = await Admin.findOne({ email })

        if (!admin || admin.password !== password) {
            return res.status(401).json({ message: "Invalid email or password" })
        }

        // 🔐 Generate simple custom token
        const token = `admin-token-${Date.now()}`

        return res.status(200).json({
            message: "Admin login successful",
            token,
            admin: {
                id: admin._id,
                name: admin.name,
                email: admin.email,
                role: "admin",
            },
        })
    } catch (err) {
        console.error("Admin Login Error:", err)
        return res.status(500).json({ message: "Server error" })
    }
}
