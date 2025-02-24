const Complain = require('../models/complainSchema.js');

// Create a New Complaint
const complainCreate = async (req, res) => {
    try {
        const complain = new Complain(req.body);
        const result = await complain.save();
        res.status(201).json(result); // Return status 201 for created resource
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err });
    }
};

// List All Complaints for a Specific School
const complainList = async (req, res) => {
    try {
        const complains = await Complain.find({ school: req.params.id }).populate("user", "name");
        if (complains.length > 0) {
            res.status(200).json(complains); // Return status 200 for successful fetch
        } else {
            res.status(404).json({ message: "No complaints found" });
        }
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err });
    }
};

module.exports = { complainCreate, complainList };
