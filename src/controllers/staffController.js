const sqlite3 = require('sqlite3').verbose();
const Joi = require('joi');
const db = new sqlite3.Database(process.env.DB_PATH || './vms.sqlite');

/**
 * 🛡️ SentinelStaff VMS - Threat Modeling Scenarios
 * Bu dosya hem zafiyetli (legacy) hem de güvenli (secure) fonksiyonları barındırır.
 */

// ==========================================
// SCENARIO 1: SQL INJECTION (SQLi)
// ==========================================

// @vulnerability: CWE-89 (SQL Injection)
exports.legacySearch = (req, res) => {
    const searchParam = req.query.name;
    const query = `SELECT id, name, role FROM staff WHERE name = '${searchParam}'`;
    db.all(query, [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ data: rows });
    });
};

// @remediation: Prepared Statements + Input Validation
exports.secureSearch = (req, res) => {
    const schema = Joi.string().pattern(/^[a-zA-Z\s]+$/).max(50).required();
    const { error, value: searchParam } = schema.validate(req.query.name);
    if (error) return res.status(400).json({ error: "Geçersiz giriş formatı." });

    const query = `SELECT id, name, role FROM staff WHERE name = ?`;
    db.all(query, [searchParam], (err, rows) => {
        if (err) return res.status(500).json({ error: "Sunucu hatası." });
        res.json({ data: rows });
    });
};

// ==========================================
// SCENARIO 2: IDOR (Insecure Direct Object Reference)
// ==========================================

// @vulnerability: CWE-639 (IDOR)
exports.legacyGetDocument = (req, res) => {
    const docId = req.params.docId;
    const query = `SELECT * FROM confidential_docs WHERE id = ?`;
    db.get(query, [docId], (err, row) => {
        if (!row) return res.status(404).json({ error: "Belge bulunamadı." });
        res.json({ data: row });
    });
};

// @remediation: Object-Level Authorization (Zero-Trust)
exports.secureGetDocument = (req, res) => {
    const docId = parseInt(req.params.docId, 10);
    const currentUserId = parseInt(req.headers['x-user-id'], 10);
    if (isNaN(docId) || isNaN(currentUserId)) return res.status(400).json({ error: "Eksik parametre." });

    const query = `SELECT * FROM confidential_docs WHERE id = ? AND owner_id = ?`;
    db.get(query, [docId, currentUserId], (err, row) => {
        if (!row) return res.status(403).json({ error: "Erişim Reddedildi." });
        res.json({ data: row });
    });
};

// ==========================================
// SCENARIO 3: CROSS-SITE SCRIPTING (Reflected XSS)
// ==========================================

// @vulnerability: CWE-79 (XSS)
exports.legacyWelcome = (req, res) => {
    const user = req.query.user || 'Guest';
    // TEHLİKELİ: Kullanıcı girdisi doğrudan HTML'e basılıyor.
    res.send(`<h1>Hoşgeldin, ${user}</h1><p>VMS Portalı Aktif.</p>`);
};

// @remediation: Output Encoding & Sanitization
exports.secureWelcome = (req, res) => {
    const user = req.query.user || 'Guest';
    // GÜVENLİ: HTML karakterleri encode ediliyor (escape).
    const safeUser = user.replace(/</g, "&lt;").replace(/>/g, "&gt;");
    res.send(`<h1>Hoşgeldin, ${safeUser}</h1><p>VMS Portalı Aktif (Güvenli).</p>`);
};
