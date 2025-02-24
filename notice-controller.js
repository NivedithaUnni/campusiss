const Notice = require('../models/noticeSchema.js');

// Create a New Notice
const noticeCreate = async (req, res) => {
    try {
        const notice = new Notice({
            ...req.body,
            school: req.body.adminID
        });
        const result = await notice.save();
        res.status(201).json(result); // Return status 201 for created resource
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err });
    }
};

// List All Notices for a Specific School
const noticeList = async (req, res) => {
    try {
        const notices = await Notice.find({ school: req.params.id });
        if (notices.length > 0) {
            res.status(200).json(notices); // Return status 200 for successful fetch
        } else {
            res.status(404).json({ message: "No notices found" });
        }
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err });
    }
};

// Update an Existing Notice
const updateNotice = async (req, res) => {
    try {
        const result = await Notice.findByIdAndUpdate(
            req.params.id,
            { $set: req.body },
            { new: true }
        );
        if (result) {
            res.status(200).json(result); // Return status 200 for successful update
        } else {
            res.status(404).json({ message: "Notice not found" });
        }
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error });
    }
};

// Delete a Specific Notice
const deleteNotice = async (req, res) => {
    try {
        const result = await Notice.findByIdAndDelete(req.params.id);
        if (result) {
            res.status(200).json({ message: "Notice deleted successfully", result });
        } else {
            res.status(404).json({ message: "Notice not found" });
        }
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error });
    }
};

// Delete All Notices for a Specific School
const deleteNotices = async (req, res) => {
    try {
        const result = await Notice.deleteMany({ school: req.params.id });
        if (result.deletedCount === 0) {
            res.status(404).json({ message: "No notices found to delete" });
        } else {
            res.status(200).json({ message: "Notices deleted successfully", result });
        }
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error });
    }
};

module.exports = { noticeCreate, noticeList, updateNotice, deleteNotice, deleteNotices };
