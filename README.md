# 💍 Mani & Priya – Our Journey

A beautiful, premium, glassmorphism-styled React web application built with **Vite, React 18, Tailwind CSS v3, Framer Motion**, and **Firebase**. 
This is a secure, private digital gallery to showcase the romantic journey of Mani and Priya across multiple events.

## 🚀 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment Variables
Copy `.env.example` to `.env` and fill in your Firebase connection details.
```bash
cp .env.example .env
```

### 3. Run Development Server
```bash
npm run dev
```

## 🔥 Firebase Setup Instructions

### 1. Create a Firebase Project
1. Go to the [Firebase Console](https://console.firebase.google.com/).
2. Click **Add Project** and follow the steps.
3. Once created, click on the **Web** icon (</>) to register a web app.
4. Copy the `firebaseConfig` object and populate the `.env` file of this project using the variable names shown in `.env.example`.

### 2. Set Up Firestore Database
1. In the console, navigate to **Firestore Database** and click **Create Database**.
2. Start in **Test Mode** (or Production Mode) and choose your region.
3. Go to the **Rules** tab and set the rules as requested:
   ```javascript
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       match /{document=**} {
         allow read: if true;
         allow write: if false;
       }
     }
   }
   ```
4. **How to add new Events**:
   - In Firestore, click **Start Collection** and name it `events`.
   - Add a document with matching ID to your event (e.g., `ashirwad`). Use fields:
     - `title` (string): "Ashirwad Ceremony"
     - `emoji` (string): "🎉"
     - `date` (string): "22 February 2026"
     - `status` (string): "active" (use "coming-soon" to disable viewing)
     - `coverGradient` (string): "from-rose-500 to-pink-400"
     - `description` (string): "The beginning of forever..."

### 3. Set Up Firebase Storage
1. Navigate to **Storage** and click **Get Started**.
2. Choose **Test Mode** and select your region.
3. Go to the **Rules** tab and set:
   ```javascript
   rules_version = '2';
   service firebase.storage {
     match /b/{bucket}/o {
       match /{allPaths=**} {
         allow read: if true;
         allow write: if false;
       }
     }
   }
   ```

### 4. Folder Creation & File Upload
Firebase Storage UI allows creating folders.

**Folder structure requirement:**
```text
/music/bg.mp3          (Mandatory: Background audio file for the app)
/ashirwad/photos/      (Upload .jpg / .png here)
/ashirwad/videos/      (Upload .mp4 here)
/prewedding/photos/    (Upload .jpg / .png here)
/prewedding/videos/    (Upload .mp4 here)
/marriage/photos/      (Upload .jpg / .png here)
/marriage/videos/      (Upload .mp4 here)
```

**How to upload photos/videos:**
1. In the Firebase Storage console, create your root event folder (e.g., `ashirwad`).
2. Inside that folder, create `photos` and `videos` subfolders.
3. Open `ashirwad/photos/` and click **Upload File** to add your `.jpg` images.
4. The React application uses `listAll()` to fetch whatever files exist under `/{eventId}/photos/` and `/{eventId}/videos/`.
5. For music, create a `music` folder at the root and upload `bg.mp3`.
