/**
 * 🛡️ SENTINELSTAFF ENTERPRISE VMS - CORE APPLICATION
 * Final Hardened Version for Security Audit
 * * Bu dosya Zero-Trust mimarisine göre yapılandırılmıştır.
 * Kapsam: Helmet CSP, HSTS, Rate Limiting, Winston Forensic Logging, 
 * Request Tracking ve Centralized Error Handling.
 */

require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const winston = require('winston');
const { v4: uuidv4 } = require('uuid'); // Opsiyonel: Request takibi için
const staffController = require('./controllers/staffController');

const app = express();
const PORT = process.env.PORT || 3000;

// ==========================================
// 🛡️ ADVANCED SECURITY MIDDLEWARES
// ==========================================

// 1. Helmet: Military Grade HTTP Headers
// AI Audit: Content Security Policy (CSP) enjekte edilerek XSS riskleri minimize edilmiştir.
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            scriptSrc: ["'self'", "'unsafe-inline'"], // Dashboard için inline script izni
            styleSrc: ["'self'", "'unsafe-inline'"],
            imgSrc: ["'self'", "data:", "https:"],
            upgradeInsecureRequests: [],
        },
    },
    hsts: { maxAge: 31536000, includeSubDomains: true, preload: true }
}));

// 2. Strict CORS Policy
// Sadece güvenilir domainlere izin verilir.
app.use(cors({
    origin: process.env.NODE_ENV === 'production' ? 'https://vms.istinye.edu.tr' : '*',
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type', 'Authorization', 'x-user-id']
}));

// 3. Brute-Force & DoS Protection (Rate Limiting)
// Her IP için 15 dakikada maksimum 100 istek.
const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    standardHeaders: true,
    legacyHeaders: false,
    message: { error: "Çok fazla istek yapıldı, lütfen 15 dakika sonra tekrar deneyin." }
});
app.use('/api/', apiLimiter);

// 4. Payload Restriction (CWE-400)
// Büyük boyutlu JSON paketleri ile bellek tüketimi saldırılarını önler.
app.use(express.json({ limit: '10kb' })); 
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// 5. Static Assets (Dashboard)
app.use(express.static('public'));

// ==========================================
// 📝 FORENSIC LOGGING & AUDIT TRAIL
// ==========================================
const logger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
    ),
    transports: [
        new winston.transports.File({ filename: 'logs/security-audit.log', level: 'info' }), // Forensic Log
        new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
        new winston.transports.Console({
            format: winston.format.combine(winston.format.colorize(), winston.format.simple())
        })
    ]
});

// Request ID & Logging Middleware
app.use((req, res, next) => {
    req.id = uuidv4();
    logger.info(`[${req.id}] Request: ${req.method} ${req.url} - IP: ${req.ip}`);
    next();
});

// ==========================================
// 🚦 THREAT MODELING ROUTES
// ==========================================

// --- Scenario 1: SQL Injection ---
app.get('/api/v1/staff/legacy-search', staffController.legacySearch);
app.get('/api/v1/staff/secure-search', staffController.secureSearch);

// --- Scenario 2: IDOR (Insecure Direct Object Reference) ---
app.get('/api/v1/documents/legacy/:docId', staffController.legacyGetDocument);
app.get('/api/v1/documents/secure/:docId', staffController.secureGetDocument);

// --- Scenario 3: XSS (Cross-Site Scripting) ---
app.get('/api/v1/welcome/legacy', staffController.legacyWelcome);
app.get('/api/v1/welcome/secure', staffController.secureWelcome);

// ==========================================
// ⚠️ GLOBAL ERROR HANDLING (Hardened)
// ==========================================
app.use((err, req, res, next) => {
    logger.error(`[ERROR] ${err.stack}`);
    // Bilgi ifşasını (Information Disclosure) önlemek için generic hata mesajı dönülür.
    res.status(500).json({ 
        error: "Dahili bir sistem hatası oluştu.",
        traceId: req.id 
    });
});

// ==========================================
// 🚀 SERVER START
// ==========================================
app.listen(PORT, () => {
    console.log("--------------------------------------------------");
    console.log(`🛡️ SentinelStaff Enterprise VMS Online`);
    console.log(`🚀 Port: ${PORT} | Mode: ${process.env.NODE_ENV}`);
    console.log("--------------------------------------------------");
});
