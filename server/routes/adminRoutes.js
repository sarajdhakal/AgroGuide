import express from "express"
import {
    adminLogin,
    createAdmin,
    getAllAdmins,
    getAdminById,
    updateAdmin,
    deleteAdmin,
} from "../controller/adminController.js"
const router = express.Router()

router.post("/login", adminLogin)
router.get("/:id", getAdminById)
router.post("/", createAdmin)
router.get("/", getAllAdmins)
router.put("/:id", updateAdmin)
router.delete("/:id", deleteAdmin)

export default router
