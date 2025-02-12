const exp = require('express');
const asyncHandler = require('express-async-handler');

const userApp = exp.Router();
userApp.use(exp.json()); // Middleware to parse JSON

let complaintsCollectionObj;

// Middleware to get the collection object from the app
userApp.use((req, res, next) => {
    complaintsCollectionObj = req.app.get('complaintsCollectionObj');
    next();
});

// POST API to add a new complaint
userApp.post('/add-complaint', asyncHandler(async (req, res) => {
    const newComplaint = req.body; // Get complaint data from request body

    // Validate required fields
    if (!newComplaint.complaint_id || !newComplaint.title || !newComplaint.description) {
        return res.status(400).json({ message: "Complaint ID, title, and description are required" });
    }

    // Auto-set timestamp and initialize default values
    newComplaint.timestamp = new Date().toISOString();
    newComplaint.likes = 0;
    newComplaint.dislikes = 0;
    newComplaint.status = "Pending";
    newComplaint.comments = []; // Array to store admin comments
    newComplaint.flagged = false; // Boolean to indicate if the complaint is flagged

    // Insert the complaint into the database
    const result = await complaintsCollectionObj.insertOne(newComplaint);
    
    if (result.acknowledged) {
        res.status(201).json({ message: "Complaint added successfully", complaint: newComplaint });
    } else {
        res.status(500).json({ message: "Failed to add complaint" });
    }
}));


// GET API to fetch all complaints
userApp.get('/view-complaints', asyncHandler(async (req, res) => {
    // Fetch all complaints where is_anonymous is false
    const complaints = await complaintsCollectionObj.find().toArray();

    // If no complaints found
    if (complaints.length === 0) {
        return res.status(404).json({ message: "No complaints found" });
    }

    // Return the list of complaints
    res.status(200).json({ complaints });
}));

// POST API to like a complaint
userApp.post('/like-complaint/:complaint_id', asyncHandler(async (req, res) => {
    const complaintId = req.params.complaint_id; // Get complaint ID from URL parameter

    // Find the complaint in the database
    const complaint = await complaintsCollectionObj.findOne({ complaint_id: complaintId });

    if (!complaint) {
        return res.status(404).json({ message: "Complaint not found" });
    }

    // Increment likes count
    complaint.likes += 1;

    // Update the complaint in the database
    const result = await complaintsCollectionObj.updateOne(
        { complaint_id: complaintId },
        { $set: { likes: complaint.likes } }
    );

    if (result.modifiedCount > 0) {
        res.status(200).json({ message: "Complaint liked", likes: complaint.likes });
    } else {
        res.status(500).json({ message: "Failed to like complaint" });
    }
}));

// POST API to dislike a complaint
userApp.post('/dislike-complaint/:complaint_id', asyncHandler(async (req, res) => {
    const complaintId = req.params.complaint_id; // Get complaint ID from URL parameter

    // Find the complaint in the database
    const complaint = await complaintsCollectionObj.findOne({ complaint_id: complaintId });

    if (!complaint) {
        return res.status(404).json({ message: "Complaint not found" });
    }

    // Increment dislikes count
    complaint.dislikes += 1;

    // Update the complaint in the database
    const result = await complaintsCollectionObj.updateOne(
        { complaint_id: complaintId },
        { $set: { dislikes: complaint.dislikes } }
    );

    if (result.modifiedCount > 0) {
        res.status(200).json({ message: "Complaint disliked", dislikes: complaint.dislikes });
    } else {
        res.status(500).json({ message: "Failed to dislike complaint" });
    }
}));

// Helper function to get the start and end of the week or month
function getDateRange(dateRange) {
    const now = new Date();
    let startDate, endDate;

    if (dateRange === 'weekly') {
        // Get the start and end date of the current week (assuming week starts on Sunday)
        const dayOfWeek = now.getDay();
        startDate = new Date(now.setDate(now.getDate() - dayOfWeek)); // Start of the week
        endDate = new Date(now.setDate(now.getDate() + (6 - dayOfWeek))); // End of the week
    } else if (dateRange === 'monthly') {
        // Get the start and end date of the current month
        startDate = new Date(now.getFullYear(), now.getMonth(), 1); // First day of the month
        endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0); // Last day of the month
    } else {
        return null;
    }

    return { startDate, endDate };
}

// GET API to filter complaints with text-based search
userApp.get('/filter-complaints', asyncHandler(async (req, res) => {
    const { category, status, dateRange, searchKeyword } = req.query;

    // Build the query for MongoDB
    let query = {};

    // Text-based search for title or description
    if (searchKeyword) {
        query.$text = { $search: searchKeyword }; // Use MongoDB's $text operator for text-based search
    }

    // Category filter
    if (category) {
        query.category = category;
    }

    // Status filter
    if (status) {
        query.status = status;
    }

    // Date range filter
    if (dateRange) {
        const { startDate, endDate } = getDateRange(dateRange);
        if (startDate && endDate) {
            query.timestamp = {
                $gte: startDate,
                $lte: endDate
            };
        }
    }

    try {
        // Find complaints based on the query
        const complaints = await complaintsCollectionObj.find(query).toArray();

        if (complaints.length > 0) {
            res.status(200).json({ complaints });
        } else {
            res.status(404).json({ message: "No complaints found for the given filters" });
        }
    } catch (error) {
        res.status(500).json({ message: "Error fetching complaints", error: error.message });
    }
}));

module.exports = userApp;
