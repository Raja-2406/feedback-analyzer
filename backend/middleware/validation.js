const { body, validationResult } = require('express-validator');

// Validation middleware for registering
const validateSignup = [
    body('name').notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
];

// Validation middleware for login
const validateLogin = [
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').notEmpty().withMessage('Password is required'),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
];

// Validation middleware for feedback
const validateFeedback = [
    body('userId').notEmpty().withMessage('User ID is required'),
    body('userName').notEmpty().withMessage('User Name is required'),
    body('category').notEmpty().withMessage('Category is required'),
    body('rating').isNumeric().withMessage('Rating must be a number'),
    body('comment').notEmpty().withMessage('Comment is required'),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
];

// Validation middleware for updating feedback (partial data)
const validateUpdateFeedback = [
    body('category').optional().notEmpty().withMessage('Category cannot be empty'),
    body('rating').optional().isNumeric().withMessage('Rating must be a number'),
    body('comment').optional().notEmpty().withMessage('Comment cannot be empty'),
    body('sentiment').optional().notEmpty().withMessage('Sentiment cannot be empty'),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
];

module.exports = {
    validateSignup,
    validateLogin,
    validateFeedback,
    validateUpdateFeedback
};
