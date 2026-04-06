<div align="center">
  <img src="istinye-logo.png.png" alt="İstinye Üniversitesi Logosu" width="150"/>

  <h1>🛡️ SentinelStaff Enterprise VMS</h1>
  <p><b>Zero-Trust Architecture & Threat Modeling Project</b></p>

  <img src="https://img.shields.io/badge/Node.js-18.x-green.svg" alt="Node.js">
  <img src="https://img.shields.io/badge/Docker-Hardened-blue.svg" alt="Docker">
  <img src="https://img.shields.io/badge/Security-OWASP_Top_10-red.svg" alt="Security">
  <img src="https://img.shields.io/badge/Build-Passing-brightgreen.svg" alt="Build">
</div>

---

## 📋 Akademik Bilgiler
* **Ders Adı:** Güvenli Web Yazılımı Geliştirme (Vize Projesi)
* **Danışman/Eğitmen:** Keyvan Arasteh
* **Hazırlayan:** Safa Hacıbayramoğlu
* **Bölüm:** Bilişim Güvenliği Teknolojisi

---

## 📑 İçindekiler (Table of Contents)
1. [Proje Amacı](#-proje-amaci)
2. [Siber Güvenlik Zafiyet Analizi (Audit Report)](#-zafiyet-analizi-audit-report)
3. [DevSecOps & Kurulum](#-devsecops--kurulum)
4. [Kullanım ve Test](#-kullanim-ve-test)

---

## 🎯 Proje Amacı
Bu projenin temel geliştirilme amacı; kurumsal düzeyde bir Node.js/Express API mimarisi üzerinde, zafiyetli (legacy) kod pratikleri ile "Sıfır Güven" (Zero-Trust) mimarisine uygun sıkılaştırılmış (hardened) kod pratiklerini yan yana barındırarak karşılaştırmalı bir zafiyet analizi laboratuvarı oluşturmaktır.

---

## 🔬 Zafiyet Analizi (Audit Report)

### 1. Code-Level Threat Modeling
* **SQL Injection (CWE-89):** Legacy endpoint'te String Interpolation zafiyeti bırakılmıştır. Çözüm olarak **Strict Input Validation** ve **Prepared Statements** uygulanmıştır.
* **IDOR (CWE-639):** Belge erişiminde yatay yetki yükseltme test edilmiştir. Çözüm olarak **Object-Level Authorization** (Zero-Trust) sağlanmıştır.

### 2. Application Hardening
* **Rate Limiting & Payload Limits:** Brute-force ve DoS saldırılarını engellemek için `express-rate-limit` uygulanmıştır.
* **Header Security:** `Helmet.js` ile HSTS ve CSP aktif edilmiştir.

### 3. Container Security (Docker)
* **Immutable Infrastructure:** Docker container `read_only: true` ile başlatılmıştır.
* **Kernel Management:** İmaj `USER node` yetkilerinde çalıştırılmış, `cap_drop: ALL` ile Linux kernel yetkileri sıfırlanmıştır.

### 4. DevSecOps & CI/CD Pipeline
GitHub Actions üzerinden **Shift-Left Security** uygulanmıştır (SCA, SAST ve Secret Scanning).

---

## 🚀 DevSecOps & Kurulum
Projeyi lokalinizde ayağa kaldırmak için:
```bash
docker-compose up --build -d
