# Leadwerk Site Starter

The header already contains a hidden `data-lw-language-switcher-slot`. Leave it
inside the primary navigation and style the surrounding header normally. It stays
invisible in the static preview and WordPress replaces it with the language menu
only after at least two published languages exist. Do not add a floating language
switcher.

Bu klasör yeni bir müşteri sitesinin **statik kaynak deposudur**. WordPress tema
PHP'si içermez. GTD uygulaması bu dosyaları doğrular, imzalı tema paketine çevirir
ve Theme Center üzerinden WordPress'e sunar.

## Çalışanın yapacağı

1. Git'i ve Leadwerk GTD uygulamasını kur.
2. Bu ZIP'i yeni bir klasöre aç.
3. `PROJECT-BRIEF.md` içindeki bütün `REVIEW REQUIRED` alanlarını gerçek müşteri
   bilgileriyle doldur.
4. Tasarım/HTML çalışmasını Codex veya tercih edilen araçla yap; ona
   `AGENTS.md` sözleşmesini eksiksiz takip etmesini söyle.
   Agent, push öncesi JPG/JPEG/PNG görselleri WebP kalite 85'e dönüştürür,
   deterministik küçük harfli `.webp` yollarına ait tüm referansları günceller
   ve yalnız başarılı doğrulamadan sonra raster orijinalleri siler.
5. Klasörde Git deposu oluştur, şirket GitHub hesabında yeni repo aç, ilk temiz
   commit'i push et.
6. İlk temiz push'tan sonra merkezi GTD, GitHub'daki public `Leadwerk-Web`
   reposunu yerel klasör konumundan bağımsız olarak normalde beş dakikalık
   reconciliation aralığında algılar; validate + dry-run başarılıysa public
   stable Theme Market profilini oluşturur, başarısızsa hiçbir kayıt yayınlamaz.
   Aynı işlem GitHub Pages ayarını `main` + `/ (root)` olarak açar;
   statik önizleme `https://leadwerk-web.github.io/<repo-adi>/` adresinde online
   olur ve sonraki `main` push'ları GitHub Pages build'iyle otomatik yayınlanır.
   ZIP'i bilgisayarın istediğin klasörüne açabilirsin. Masaüstü
   uygulamasının Desktop/Downloads/Documents taraması yalnız yerel diff ve daha
   hızlı doğrulama içindir; klasör seçimi yayın için gerekli değildir. Private
   repo kullanımı IT tarafından ayrıca GitHub App/server credential ile açılır.

GitHub Pages yalnız statik önizlemedir; imzalı WordPress tema yayını ilk staging
kontrolüne kadar kapalı kalır. Kontakt sayfasındaki
`data-lw-wpforms="contact"` işaretli form otomatik onboarding sırasında typed
WPForms ayarına dönüşür; WordPress importu formu oluşturur ve başarılı gönderimi
native olarak Danke sayfasına yönlendirir. Şifre, SMTP parolası, API anahtarı,
WordPress yedeği veya müşteri verisi bu depoya konmaz.

## Tasarım aracı çıkışı

Fable/Vite benzeri araçtan final production export al. Her route gerçek HTML
dosyası olmalı; yalnızca `<div id="root"></div>` içeren SPA çıktısını kullanma.
Yerel `type="module"` girişleri desteklenir. `fetch`, worker, WASM veya 3D veri
dosyaları kullanılıyorsa merkezi profilde dar bir `source.pinnedAssets` deseni
tanımlanır.

Bu başlangıçtaki marka, metin ve hukuki içerik yer tutucudur; canlıya alınamaz.
