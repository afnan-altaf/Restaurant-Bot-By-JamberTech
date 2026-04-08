# 🍔 Restaurant Bot By JamberTech 🇵🇰

  > **Ek complete Pakistani Restaurant System** — WhatsApp Bot + Customer App + Admin Panel, sab ek jagah!

  ![GitHub Actions](https://img.shields.io/badge/GitHub%20Actions-Automated-blue?logo=github-actions)
  ![Firebase](https://img.shields.io/badge/Firebase-Realtime%20Database-orange?logo=firebase)
  ![WhatsApp](https://img.shields.io/badge/WhatsApp-Bot-green?logo=whatsapp)
  ![PHP](https://img.shields.io/badge/InfinityFree-Free%20Hosting-purple)

  ---

  ## 📋 Is System Mein Kya Hai?

  | File | Kaam |
  |------|------|
  | `index.php` | Customer App — Login, Menu, Cart, Order, Tracking |
  | `admin.php` | Admin Panel — Orders, Menu, Restaurants Manage Karo |
  | `index.js` | WhatsApp AI Bot — Orders WhatsApp se lega |
  | `package.json` | Bot ki dependencies |
  | `bot-workflow.yml` | GitHub Actions — Bot auto-run hoga |

  ---

  ## 🚀 STEP BY STEP SETUP GUIDE

  ---

  ### ✅ STEP 1 — Firebase Project Banao

  1. [firebase.google.com](https://firebase.google.com) par jao
  2. **"Add Project"** click karo, naam rakho (e.g. `restaurant-bot`)
  3. Google Analytics OFF karo, project create karo
  4. Left menu mein **"Realtime Database"** click karo
  5. **"Create Database"** → Location: `us-central1` → **Test Mode** select karo → Enable
  6. Ab **Project Settings** (gear icon) mein jao → **"Your apps"** → Web icon `</>` click karo
  7. App register karo, **Firebase config copy karo** — yeh kuch aisa dikhega:

  ```javascript
  const firebaseConfig = {
    apiKey: "AIzaSy...",
    authDomain: "your-project.firebaseapp.com",
    databaseURL: "https://your-project-default-rtdb.firebaseio.com",
    projectId: "your-project",
    storageBucket: "your-project.firebasestorage.app",
    messagingSenderId: "123456789",
    appId: "1:123:web:abc123"
  };
  ```

  8. **Authentication** → Sign-in method → **Email/Password** aur **Google** — dono Enable karo

  ---

  ### ✅ STEP 2 — InfinityFree Par Website Upload Karo

  > InfinityFree free PHP hosting deta hai — perfect hai hamare liye!

  1. [infinityfree.com](https://www.infinityfree.com) par account banao
  2. **"Create Account"** → Free hosting select karo
  3. Ek naya hosting account banao
  4. **cPanel** kholo → **File Manager** → `htdocs` folder mein jao
  5. `index.php` aur `admin.php` dono files upload karo
  6. **Dono files mein Firebase config replace karo:**
     - File open karo → `YOUR_API_KEY_HERE` ki jagah apni real values daalo
     - Yeh PHP file ke top par hai:

  ```php
  $firebaseConfig = [
    "apiKey" => "APNI_REAL_API_KEY",
    "authDomain" => "aapka-project.firebaseapp.com",
    "databaseURL" => "https://aapka-project-default-rtdb.firebaseio.com",
    "projectId" => "aapka-project",
    "storageBucket" => "aapka-project.firebasestorage.app",
    "messagingSenderId" => "REAL_SENDER_ID",
    "appId" => "REAL_APP_ID"
  ];
  ```

  7. Save karo — ab aapki website live hai! 🎉
     - Customer App: `http://yoursite.infinityfreeapp.com/index.php`
     - Admin Panel: `http://yoursite.infinityfreeapp.com/admin.php`

  ---

  ### ✅ STEP 3 — GitHub Repository Setup Karo

  > WhatsApp Bot GitHub Actions se run hoga — bilkul free!

  1. Is repository ko **Fork** karo ya apna naya repo banao
  2. **Settings** → **Secrets and variables** → **Actions** mein jao
  3. **"New repository secret"** click karo:
     - Name: `FIREBASE_URL`
     - Value: Apni Firebase Realtime Database URL, e.g.:
       `https://your-project-default-rtdb.firebaseio.com`
  4. **Save** karo

  ---

  ### ✅ STEP 4 — GitHub Actions Workflow Setup Karo

  1. Is repo mein `bot-workflow.yml` file hai
  2. GitHub par yeh file `.github/workflows/main.yml` par honi chahiye
  3. **GitHub par yeh karo:**
     - Repo mein `Add file` → `Create new file`
     - File ka naam rakho: `.github/workflows/main.yml`
     - `bot-workflow.yml` ka content copy karke paste karo
     - Commit karo

  Ab GitHub Actions automatically bot ko har 5 ghante mein restart karega! ✅

  ---

  ### ✅ STEP 5 — WhatsApp Bot Connect Karo (QR Scan)

  1. GitHub repo mein **Actions** tab par jao
  2. **"JavaGoat-WhatsApp-Bot"** workflow ko manually run karo (**"Run workflow"** button)
  3. Run hone ke baad **"View raw logs"** click karo
  4. **QR Code** dikhega — **WhatsApp** se scan karo:
     - WhatsApp → **Linked Devices** → **Link a Device** → QR scan karo
  5. ✅ **"JAMBERTECH RESTAURANT BOT ONLINE HA!"** message aane par bot ready hai!

  > ⚠️ **Important:** Bot session `session_data/` folder mein save hota hai. Har 5 ghante mein GitHub Action restart hoti hai aur session use hota hai.

  ---

  ## 💬 WhatsApp Bot Commands

  | Customer Likhega | Bot Ka Jawab |
  |------------------|--------------|
  | `salam` / `hi` | Khush aamdeed message |
  | `menu` | Live Firebase menu dikhega |
  | `order pizza` | Pizza order shuru hoga |
  | `order burger` | Burger order shuru hoga |
  | `contact` | Restaurant contact info |
  | `shukriya` | Thank you response |

  ---

  ## 🛡️ Admin Panel Kaise Use Karein

  1. `admin.php` kholo browser mein
  2. Firebase Authentication se email/password se login karo
  3. Dashboard mein:
     - 📊 **Overview** — Total revenue, orders, dishes
     - 🛍️ **Orders** — Sab orders aur status update
     - 🍕 **Menu Items** — Dishes add/delete karo
     - 🏪 **Partners** — Restaurants add/delete karo

  ---

  ## 🔧 Customer App Features

  - ✅ Email/Password aur Google login
  - ✅ Live menu Firebase se
  - ✅ Cart system quantity ke saath
  - ✅ GPS location detection
  - ✅ Email OTP verification checkout par
  - ✅ Real-time order tracking
  - ✅ Notifications
  - ✅ Mobile-friendly design

  ---

  ## 🗂️ Database Structure (Firebase)

  ```
  Firebase Realtime Database
  ├── dishes/
  │   └── {dishId}/
  │       ├── name: "Chicken Biryani"
  │       ├── price: "350"
  │       └── imageUrl: "https://..."
  ├── restaurants/
  │   └── {restId}/
  │       ├── name: "Al-Baik"
  │       ├── rating: "4.5"
  │       └── imageUrl: "https://..."
  └── orders/
      └── {orderId}/
          ├── userId, userEmail, phone
          ├── address, location
          ├── items[], total
          ├── status: "Placed/Preparing/Out for Delivery/Delivered"
          └── timestamp
  ```

  ---

  ## ❓ Common Problems aur Solutions

  | Problem | Solution |
  |---------|----------|
  | Bot scan nahi ho raha | "View raw logs" par click karein, QR wahan hoga |
  | Website database se connect nahi | Firebase config check karein — sab values sahi honi chahiye |
  | Admin login nahi ho raha | Firebase Authentication mein us email ka account banao |
  | Bot band ho jata hai | GitHub Actions har 5 ghante mein restart karti hai |
  | Orders nahi aa rahe | Firebase Database rules check karein — Test Mode mein hona chahiye |

  ---

  ## 📞 Support

  > **JamberTech** ke saath koi bhi masla ho to GitHub Issues mein report karein.

  Made with ❤️ by **JamberTech** 🇵🇰
  