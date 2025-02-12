const exp = require('express');
const asyncHandler = require('express-async-handler');

const adminApp = exp.Router();
adminApp.use(exp.json()); // Middleware to parse JSON

let complaintsCollectionObj;

// Middleware to get the collection object from the app
adminApp.use((req, res, next) => {
    complaintsCollectionObj = req.app.get('complaintsCollectionObj');
    next();
});

// GET API to view all complaints (sorted by priority)
adminApp.get('/view-complaints', asyncHandler(async (req, res) => {
    const complaints = await complaintsCollectionObj
        .find()
        .sort({ priority_score: -1, timestamp: -1 })
        .toArray();

    if (complaints.length === 0) {
        return res.status(404).json({ message: "No complaints found" });
    }

    res.status(200).json({ complaints });
}));

// PUT API to update complaint status (Pending → In Progress → Resolved)
adminApp.put('/update-status/:complaint_id', asyncHandler(async (req, res) => {
    const complaintId = req.params.complaint_id;
    const { status } = req.body;

    const validStatuses = ["Pending", "In Progress", "Resolved"];
    if (!validStatuses.includes(status)) {
        return res.status(400).json({ message: "Invalid status" });
    }

    const updateResult = await complaintsCollectionObj.updateOne(
        { complaint_id: complaintId },
        { $set: { status } }
    );

    if (updateResult.matchedCount === 0) {
        return res.status(404).json({ message: "Complaint not found" });
    }

    res.status(200).json({ message: "Complaint status updated successfully", status });
}));

// DELETE API to remove a complaint
adminApp.delete('/delete-complaint/:complaint_id', asyncHandler(async (req, res) => {
    const complaintId = req.params.complaint_id;

    const deleteResult = await complaintsCollectionObj.deleteOne({ complaint_id: complaintId });

    if (deleteResult.deletedCount === 0) {
        return res.status(404).json({ message: "Complaint not found" });
    }

    res.status(200).json({ message: "Complaint deleted successfully" });
}));

// GET API to filter complaints
adminApp.get('/filter-complaints', asyncHandler(async (req, res) => {
    const { category, status, dateRange } = req.query;

    let query = {};

    if (category) {
        query.category = category;
    }

    if (status) {
        query.status = status;
    }

    if (dateRange) {
        const { startDate, endDate } = getDateRange(dateRange);
        if (startDate && endDate) {
            query.timestamp = {
                $gte: startDate,
                $lte: endDate
            };
        }
    }

    const complaints = await complaintsCollectionObj.find(query).toArray();

    if (complaints.length > 0) {
        res.status(200).json({ complaints });
    } else {
        res.status(404).json({ message: "No complaints found for the given filters" });
    }
}));

// Helper function to get the start and end of the week or month
function getDateRange(dateRange) {
    const now = new Date();
    let startDate, endDate;

    if (dateRange === 'weekly') {
        const dayOfWeek = now.getDay();
        startDate = new Date(now.setDate(now.getDate() - dayOfWeek));
        endDate = new Date(now.setDate(now.getDate() + (6 - dayOfWeek)));
    } else if (dateRange === 'monthly') {
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    } else {
        return null;
    }

    return { startDate, endDate };
}

// Route to add a comment to a complaint
adminApp.put('/complaints/:id/comment', asyncHandler(async (req, res) => {
    const { id } = req.params; // Get complaint ID from URL
    const { comment } = req.body; // Get admin's comment from request body

    if (!comment) {
        return res.status(400).json({ message: "Comment cannot be empty" });
    }

    const result = await complaintsCollectionObj.updateOne(
        { complaint_id: id },
        { $push: { comments: comment } } // Push new comment into the comments array
    );

    if (result.modifiedCount > 0) {
        res.json({ message: "Comment added successfully" });
    } else {
        res.status(404).json({ message: "Complaint not found or comment could not be added" });
    }
}));

// Route to flag or unflag a complaint
adminApp.put('/complaints/:id/flag', asyncHandler(async (req, res) => {
    const { id } = req.params; // Get complaint ID from URL

    // Find the complaint to check its current flag status
    const complaint = await complaintsCollectionObj.findOne({ complaint_id: id });

    if (!complaint) {
        return res.status(404).json({ message: "Complaint not found" });
    }

    // Toggle the flagged status
    const newFlagStatus = !complaint.flagged;

    // Update the complaint with the new flagged status
    const result = await complaintsCollectionObj.updateOne(
        { complaint_id: id },
        { $set: { flagged: newFlagStatus } }
    );

    if (result.modifiedCount > 0) {
        res.json({ message: `Complaint ${newFlagStatus ? "flagged" : "unflagged"} successfully`, flagged: newFlagStatus });
    } else {
        res.status(500).json({ message: "Failed to update flag status" });
    }
}));



module.exports = adminApp;