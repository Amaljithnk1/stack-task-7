// middleware/contentFilter.js
const abusiveWords = ["abuse", "hate", "offensive"]; // Example list of abusive words

const contentFilter = (req, res, next) => {
    console.log("content filter middleware executed");
    try {
        // Check if the request contains text content
        if (req.body.text) {
            // Check if the text content contains any abusive words
            if (containsAbusiveWords(req.body.text)) {
                // Remove or sanitize the abusive words
                req.body.text = sanitizeContent(req.body.text);
            }
        }
        // Continue to the next middleware or route handler
        next();
    } catch (error) {
        console.error("Content filter error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// Function to check if the text contains abusive words
const containsAbusiveWords = (text) => {
    const lowerCaseText = text.toLowerCase();
    return abusiveWords.some(word => lowerCaseText.includes(word));
};

// Function to sanitize or remove abusive words from the text
const sanitizeContent = (text) => {
    return text.replace(new RegExp(abusiveWords.join('|'), 'gi'), '***');
};

export default contentFilter;


