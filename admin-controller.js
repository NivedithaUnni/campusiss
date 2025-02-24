const bcrypt = require('bcrypt');
const Admin = require('../models/adminSchema.js');
const Sclass = require('../models/sclassSchema.js');
const Student = require('../models/studentSchema.js');
const Teacher = require('../models/teacherSchema.js');
const Subject = require('../models/subjectSchema.js');
const Notice = require('../models/noticeSchema.js');
const Complain = require('../models/complainSchema.js');

// Admin Registration
const adminRegister = async (req, res) => {
    try {
        const { password, email, schoolName } = req.body;

        const existingAdminByEmail = await Admin.findOne({ email });
        const existingSchool = await Admin.findOne({ schoolName });

        if (existingAdminByEmail) {
            return res.status(400).json({ message: 'Email already exists' });
        } else if (existingSchool) {
            return res.status(400).json({ message: 'School name already exists' });
        } else {
            // Hash password before saving to the database
            const hashedPassword = await bcrypt.hash(password, 10);
            const admin = new Admin({
                ...req.body,
                password: hashedPassword
            });

            let result = await admin.save();
            result.password = undefined;  // To hide password in the response
            res.status(201).json(result);
        }
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err });
    }
};

// Admin Login
const adminLogIn = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required" });
        }

        const admin = await Admin.findOne({ email });
        if (!admin) {
            return res.status(404).json({ message: "Admin not found" });
        }

        // Compare the provided password with the hashed password in the database
        const isMatch = await bcrypt.compare(password, admin.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid password" });
        }

        admin.password = undefined;  // Hide password in response
        res.status(200).json(admin);
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err });
    }
};

// Get Admin Details
const getAdminDetail = async (req, res) => {
    try {
        let admin = await Admin.findById(req.params.id);
        if (!admin) {
            return res.status(404).json({ message: "Admin not found" });
        }

        admin.password = undefined;  // Hide password in response
        res.status(200).json(admin);
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err });
    }
}

module.exports = { adminRegister, adminLogIn, getAdminDetail };
