# SentinelStaff Enterprise VMS - Management Commands

.PHONY: install start test docker-up docker-down clean help

# Bağımlılıkları yükle
install:
	npm install

# Uygulamayı yerel olarak başlat
start:
	npm start

# Güvenlik testlerini ve unit testleri çalıştır
test:
	npm test

# Docker konteynerlarını ayağa kaldır (Hardened config ile)
docker-up:
	docker-compose up --build -d

# Sistemleri durdur
docker-down:
	docker-compose down

# Geçici dosyaları temizle
clean:
	rm -rf node_modules
	rm -f package-lock.json

# Yardım menüsü
help:
	@echo "Kullanılabilir komutlar:"
	@echo "  make install    - Bağımlılıkları yükler"
	@echo "  make start      - Uygulamayı başlatır"
	@echo "  make docker-up  - Docker altyapısını kurar ve başlatır"
	@echo "  make test       - Testleri çalıştırır"
