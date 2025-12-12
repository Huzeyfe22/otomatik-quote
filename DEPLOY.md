# Projeyi İnternete Taşıma ve Yayınlama Rehberi

Bu rehber, projenizi (Elite Quote Builder) internete taşıyarak hem evden hem de iş yerinden erişebilmenizi ve geliştirmeye devam edebilmenizi sağlayacaktır.

## 1. Hazırlık: Git Kurulumu
Şu an bilgisayarınızda "Git" versiyon kontrol sistemi yüklü görünmüyor. Kodlarınızı internete (GitHub'a) göndermek için buna ihtiyacınız var.

1.  **Git İndir:** [git-scm.com/download/win](https://git-scm.com/download/win) adresine gidin.
2.  **Kurulum:** "64-bit Git for Windows Setup" seçeneğini indirin ve varsayılan ayarlarla kurun.
3.  **Kontrol:** Kurulum bitince yeni bir terminal (PowerShell veya CMD) açıp `git --version` yazarak yüklendiğinden emin olun.

## 2. GitHub Hesabı ve Depo (Repository) Oluşturma
Kodlarınızı bulutta saklamak için GitHub kullanacağız.

1.  [github.com](https://github.com) adresinde ücretsiz bir hesap oluşturun (varsa giriş yapın).
2.  Sağ üstteki **+** ikonuna tıklayıp **New repository** seçin.
3.  **Repository name** kısmına `otomatik-quote` gibi bir isim verin.
4.  **Private** (Gizli) seçeneğini seçmenizi öneririm (şirket verileri içerdiği için).
5.  **Create repository** butonuna tıklayın.

## 3. Kodları GitHub'a Gönderme
Şimdi bilgisayarınızdaki kodları GitHub'a yükleyeceğiz. VS Code terminalinde şu komutları sırasıyla çalıştırın:

```bash
# 1. Git'i başlat
git init

# 2. Tüm dosyaları ekle
git add .

# 3. İlk kaydı oluştur
git commit -m "İlk sürüm: Otomatik Teklif Hazırlayıcı"

# 4. Ana dalı isimlendir
git branch -M main

# 5. Uzak sunucuyu ekle (KENDİ GITHUB LINKINIZI YAZIN)
# GitHub'da repo oluşturunca size verilen linki kullanın. Örnek:
# git remote add origin https://github.com/KULLANICI_ADINIZ/otomatik-quote.git

# 6. Kodları gönder
git push -u origin main
```

## 4. Uygulamayı Canlıya Alma (Vercel)
Uygulamayı tarayıcıdan kullanabilmek için Vercel en iyi ve en kolay seçenektir.

1.  [vercel.com](https://vercel.com) adresine gidin ve **GitHub ile giriş yapın**.
2.  **Add New...** -> **Project** butonuna tıklayın.
3.  GitHub hesabınızdaki `otomatik-quote` projesini listede göreceksiniz, yanındaki **Import** butonuna tıklayın.
4.  Ayarları değiştirmeden **Deploy** butonuna basın.
5.  Birkaç dakika içinde size `https://otomatik-quote.vercel.app` gibi bir link verecek.

## 5. İş Yerinden Çalışmaya Devam Etme
İş yerindeki bilgisayarınızda geliştirmeye devam etmek için:

1.  İş bilgisayarına da **Git** ve **Node.js** kurun.
2.  VS Code'u açın.
3.  Terminalde: `git clone https://github.com/KULLANICI_ADINIZ/otomatik-quote.git` yazarak projeyi indirin.
4.  Klasörün içine girin: `cd otomatik-quote`
5.  Gerekli paketleri yükleyin: `npm install`
6.  Çalıştırmak için: `npm run dev`

Artık hem evde hem iş yerinde çalışabilirsiniz! Bir yerde değişiklik yapınca:
1.  `git add .`
2.  `git commit -m "Yaptığınız değişiklik açıklaması"`
3.  `git push`
yaparak GitHub'a gönderin. Diğer bilgisayarda `git pull` diyerek güncel hali çekin.
