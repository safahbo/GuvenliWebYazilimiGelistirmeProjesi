# 🛡️ SentinelStaff-Enterprise-VMS
**Zero-Trust Architecture & Threat Modeling Project**

Bu proje, güvensiz kod pratikleri ile enterprise-grade "Hardened" güvenlik standartlarının karşılaştırmalı analizini sunan bir DevSecOps laboratuvarıdır.

## 🔬 Zafiyet Analizi ve Sıkılaştırma Raporu (Audit Report)

### 1. Code-Level Threat Modeling
* **SQL Injection (CWE-89):** Legacy endpoint'te String Interpolation zafiyeti bırakılmıştır. Secure endpoint'te ise `Joi` kütüphanesi ile **Strict Input Validation** (Sadece harf kabulü) yapılmış ve veritabanı iletişimi **Prepared Statements** ile izole edilmiştir.
* **IDOR (CWE-639):** Belge erişiminde yatay yetki yükseltme test edilmiştir. Çözüm olarak **Object-Level Authorization** uygulanmış; sorgulara `owner_id = currentUserId` mantığı gömülerek Zero-Trust sağlanmıştır.

### 2. Application Hardening
* **Rate Limiting & Payload Limits:** Brute-force ve DoS/DDoS saldırılarını engellemek için `express-rate-limit` ve 5KB JSON payload limiti uygulanmıştır.
* **Header Security:** `Helmet.js` kullanılarak HSTS (Strict-Transport-Security) ve CSP (Content-Security-Policy) aktif edilmiştir. XSS ve Clickjacking vektörleri daraltılmıştır.

### 3. Container Security (Docker Hardening)
* **Immutable Infrastructure:** Docker container `read_only: true` flag'i ile başlatılarak saldırganın sisteme Web Shell yazması engellenmiştir.
* **Privilege & Kernel Management:** İmaj `USER node` ile non-root yetkilerde çalıştırılmış, `cap_drop: ALL` ile Linux kernel yetkileri sıfırlanmıştır.
* **Process Management:** PID 1 zombi process sorunlarını engellemek için askeri DevOps standardı olan `dumb-init` kullanılmıştır.

### 4. DevSecOps & CI/CD Pipeline
GitHub Actions üzerinden **Shift-Left Security** uygulanmıştır.
* **SCA:** Bağımlılıklardaki bilinen zafiyetler (CVE) taranır.
* **SAST:** `Semgrep` ile koddaki OWASP Top 10 zafiyetleri statik olarak analiz edilir.
* **Secret Scanning:** `TruffleHog` ile kod geçmişine sızmış API Key veya şifreler denetlenir.

### 5. Forensics & Initialization Flaws
* Sistem kurulumunda bilerek bırakılan `curl | bash` ve `chmod 777` anti-pattern'leri incelenmek üzere eklenmiştir. Temizlik script'inde ise adli bilişim incelemelerini zorlaştırmak adına `shred` ile zeroing işlemi gerçekleştirilmektedir.
