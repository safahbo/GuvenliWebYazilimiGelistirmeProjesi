# 🚀 SentinelStaff Enterprise VMS - Proje Yol Haritası (Roadmap)

Bu dosya, projenin tamamlanan güvenlik aşamalarını ve gelecekteki teknik hedeflerini siber güvenlik standartları çerçevesinde listeler.

## ✅ Tamamlanan Görevler (Completed)

### 1. Zafiyet Giderme (Vulnerability Remediation)
- [x] **SQL Injection (CWE-89):** `Joi` doğrulaması ve parametreli sorgularla veri katmanı güvenliği sağlandı.
- [x] **IDOR (CWE-639):** `Object-Level Authorization` kontrolü ile doküman erişiminde sahiplik doğrulaması aktif edildi.
- [x] **Reflected XSS (CWE-79):** Dinamik çıktılar için `HTML Entity Encoding` ve `Helmet.js` CSP politikaları uygulandı.
- [x] **Command Injection (CWE-78):** Tehlikeli `exec()` kullanımı sonlandırıldı ve `spawn()` API'si ile argüman izolasyonu sağlandı.

### 2. Altyapı Sıkılaştırma (Hardening)
- [x] **Docker İzolasyonu:** Konteynır `read_only: true` (salt-okunur) dosya sistemiyle yapılandırıldı.
- [x] **Yetki Kısıtlaması:** Linux çekirdek yetkileri `cap_drop: ALL` ile sıfırlandı ve `USER node` ile non-root çalışma prensibi uygulandı.
- [x] **Zombi Süreç Yönetimi:** Konteynır sinyal yönetimi için `dumb-init` wrapper yapısı entegre edildi.
- [x] **DoS Koruması:** IP tabanlı `rate-limit` ve konteynır düzeyinde CPU/Memory limitleri (0.5 CPU, 256M RAM) aktif edildi.

---

## 🛠️ Gelecek Hedefleri (Backlog)

### 🔴 Yüksek Öncelikli (Güvenlik)
- [ ] **JWT Entegrasyonu:** Mevcut simüle edilen `x-user-id` yapısı yerine RS256 imzalı asimetrik JWT mimarisine geçilecek.
- [ ] **Bcrypt Şifreleme:** Veritabanındaki kullanıcı şifrelerinin `bcrypt` veya `argon2` ile tuzlanarak (salted hash) saklanması sağlanacak.
- [ ] **Global Sanitization Middleware:** `Joi` doğrulamasına ek olarak, tüm `POST/PUT` isteklerini XSS vektörlerinden temizleyen merkezi bir katman eklenecek.

### 🟡 Orta Öncelikli (Teknik Derinlik)
- [ ] **NoSQL Injection Testleri:** SQLite'a ek olarak MongoDB katmanı eklenerek NoSQL tabanlı enjeksiyon zafiyetleri modellenecek.
- [ ] **Winston Log Dashboard:** Kaydedilen güvenlik loglarının (Unauthorized access, SQLi attempts) görsel bir arayüzde izlenmesi sağlanacak.
- [ ] **CI/CD Pipeline Optimizasyonu:** `Semgrep` ve `npm audit` taramalarının GitHub Actions üzerine tam entegrasyonu tamamlanacak.

### 🟢 Düşük Öncelikli (UI/UX)
- [ ] **Dashboard Görselleştirme:** `public/index.html` üzerindeki tehdit istatistiklerinin grafiklerle (Chart.js) sunulması sağlanacak.
- [ ] **Swagger (OpenAPI) Dökümantasyonu:** API uç noktaları için interaktif bir dokümantasyon paneli oluşturulacak.

---
**Akademik Not:** Bu rapor **İstinye Üniversitesi Bilişim Güvenliği Teknolojisi** programı kapsamında **Keyvan Arasteh** danışmanlığında **Safa Hacıbayramoğlu** tarafından hazırlanmıştır.
