require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const winston = require('winston');
const staffController = require('./controllers/staffController');

const app = express();
const PORT = process.env.PORT || 3000;

// ==========================================
// 🛡️ HARDCORE SECURITY MIDDLEWARES
// ==========================================

// 1. Advanced Helmet Configuration (CWE-693)
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            scriptSrc: ["'self'"],
            objectSrc: ["'none'"],
            upgradeInsecureRequests: [],
        },
    },
    hsts: { maxAge: 31536000, includeSubDomains: true, preload: true } // Strict Transport Security
}));

// 2. Strict CORS Policy
app.use(cors({
    origin: process.env.NODE_ENV === 'production' ? 'https://vms.sentinelstaff.internal' : '*',
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type', 'Authorization', 'x-user-id']
}));

// 3. Rate Limiting (Mitigates Brute Force & DoS - CWE-307)
const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    message: { error: "Too many requests from this IP, please try again after 15 minutes." },
    standardHeaders: true,
    legacyHeaders: false,
});
app.use('/api/', apiLimiter);

// 4. Payload Limitation (Mitigates Buffer Overflow / Memory Exhaustion)
app.use(express.json({ limit: '5kb' })); 

// ==========================================
// 📝 ENTERPRISE LOGGING (Forensics Ready)
// ==========================================
const logger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json() // JSON format for SIEM integration (Splunk, ELK)
    ),
    transports: [
        new winston.transports.File({ filename: 'logs/audit.log', level: 'warn' }),
        new winston.transports.Console()
    ]
});

app.use((req, res, next) => {
    logger.info(`[AUDIT] ${req.method} ${req.url} - IP: ${req.ip} - UserAgent: ${req.get('User-Agent')}`);
    next();
});

// ==========================================
// 🚦 THREAT MODELING ROUTES
// ==========================================
app.get('/api/v1/staff/legacy-search', staffController.legacySearch);
app.get('/api/v1/staff/secure-search', staffController.secureSearch);

app.get('/api/v1/documents/legacy/:docId', staffController.legacyGetDocument);
app.get('/api/v1/documents/secure/:docId', staffController.secureGetDocument);

// ==========================================
// 🚀 IGNITION
// ==========================================
app.listen(PORT, () => {
    logger.info(`[+] Zero-Trust Node Online. Port: ${PORT}`);
});
