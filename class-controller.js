const Sclass = require('../models/sclassSchema.js');
const Student = require('../models/studentSchema.js');
const Subject = require('../models/subjectSchema.js');
const Teacher = require('../models/teacherSchema.js');

// Create Class
const sclassCreate = async (req, res) => {
    try {
        const { sclassName, adminID } = req.body;

        const existingSclassByName = await Sclass.findOne({
            sclassName,
            school: adminID
        });

        if (existingSclassByName) {
            return res.status(400).json({ message: 'Sorry, this class name already exists' });
        }

        const sclass = new Sclass({
            sclassName,
            school: adminID
        });

        const result = await sclass.save();
        res.status(201).json(result);
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err });
    }
};

// List All Classes for a School
const sclassList = async (req, res) => {
    try {
        const sclasses = await Sclass.find({ school: req.params.id });
        if (sclasses.length > 0) {
            res.status(200).json(sclasses);
        } else {
            res.status(404).json({ message: "No classes found" });
        }
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err });
    }
};

// Get Class Details by ID
const getSclassDetail = async (req, res) => {
    try {
        let sclass = await Sclass.findById(req.params.id);
        if (!sclass) {
            return res.status(404).json({ message: "No class found" });
        }

        sclass = await sclass.populate("school", "schoolName");
        res.status(200).json(sclass);
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err });
    }
};

// Get Students of a Class by Class ID
const getSclassStudents = async (req, res) => {
    try {
        const students = await Student.find({ sclassName: req.params.id });
        if (students.length > 0) {
            const modifiedStudents = students.map(student => ({
                ...student._doc,
                password: undefined  // Remove password from response
            }));
            res.status(200).json(modifiedStudents);
        } else {
            res.status(404).json({ message: "No students found" });
        }
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err });
    }
};

// Delete a Class and its Related Entities (Students, Subjects, Teachers)
const deleteSclass = async (req, res) => {
    try {
        const deletedClass = await Sclass.findByIdAndDelete(req.params.id);
        if (!deletedClass) {
            return res.status(404).json({ message: "Class not found" });
        }

        await Student.deleteMany({ sclassName: req.params.id });
        await Subject.deleteMany({ sclassName: req.params.id });
        await Teacher.deleteMany({ teachSclass: req.params.id });

        res.status(200).json({ message: "Class and related entities deleted", deletedClass });
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};

// Batch Delete All Classes and Related Entities for a School
const deleteSclasses = async (req, res) => {
    try {
        const deletedClasses = await Sclass.deleteMany({ school: req.params.id });
        if (deletedClasses.deletedCount === 0) {
            return res.status(404).json({ message: "No classes found to delete" });
        }

        await Student.deleteMany({ school: req.params.id });
        await Subject.deleteMany({ school: req.params.id });
        await Teacher.deleteMany({ school: req.params.id });

        res.status(200).json({ message: "All classes and related entities deleted", deletedClasses });
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};

module.exports = { 
    sclassCreate, 
    sclassList, 
    deleteSclass, 
    deleteSclasses, 
    getSclassDetail, 
    getSclassStudents 
};
