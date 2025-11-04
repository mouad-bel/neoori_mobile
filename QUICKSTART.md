# Neoori - Quick Start Guide

## 🚀 Get Started in 3 Steps

### Step 1: Start the Development Server
```bash
npm start
```

### Step 2: Open on Your Device
- **Option A**: Scan QR code with Expo Go app
- **Option B**: Press `a` for Android emulator
- **Option C**: Press `i` for iOS simulator (macOS only)

### Step 3: Login and Explore
- Enter any email and password
- The app will use mock authentication
- Start swiping through videos!

---

## 📱 Key Features to Try

### 1. Login Screen
- **Action**: Enter any credentials (e.g., test@neoori.com / password123)
- **Result**: You'll be logged in as "Hajar Fahmani"

### 2. Main Flow (TikTok-style Feed)
- **Swipe Up**: Next video
- **Swipe Down**: Previous video
- **Tap Heart**: Like a video (turns red, count increases)
- **Tap Bookmark**: Save video (turns teal)
- **Tap Share**: Share video (alert shown)
- **Tap AI Button**: AI assistant (coming soon)

### 3. Navigation Drawer
- **Open**: Tap menu icon or swipe from left edge
- **Profile**: Tap your profile to expand options
- **Navigate**: Try different sections (Flow, Jeux, Rooms, etc.)
- **Logout**: Scroll to bottom and tap logout

### 4. Explore Screens
- **Flow Neoori**: Main video feed (working)
- **Jeux & Tests**: Games placeholder
- **Rooms**: Discussion rooms placeholder
- **Capsules**: Learning content placeholder
- **Formations**: Training courses placeholder
- **Offres**: Job offers placeholder
- **À propos**: About page with app info

---

## 🎨 What You'll See

### Design
- **Dark navy background** (#0A0F1E)
- **Teal accent color** (#22D3EE)
- **Modern, clean UI** with rounded corners
- **Smooth animations** and transitions

### Content
- **10 sample videos** about professional development
- **Categories**: Tech, Career, Leadership, Marketing, Design, Business
- **French content** with realistic engagement numbers
- **Match percentages** from 85% to 98%

---

## 💾 Data Persistence

Your interactions are saved locally:
- ❤️ **Likes**: Persist between sessions
- 🔖 **Bookmarks**: Saved to storage
- 👤 **Login state**: Auto-login on restart

---

## 🔧 Troubleshooting

### App won't start?
```bash
npm start -- --clear
```

### Need to reinstall?
```bash
rm -rf node_modules
npm install
npm start
```

### Can't connect?
- Ensure phone and computer are on **same WiFi**
- Check firewall isn't blocking Expo

---

## 📚 Learn More

- **Full documentation**: See README.md
- **Architecture details**: See PROJECT_SUMMARY.md
- **Code structure**: Explore src/ folder

---

## ✨ Demo Flow

1. **Start** → Login screen appears
2. **Login** → Enter any credentials
3. **Main Feed** → See first video card
4. **Interact** → Like, bookmark, share
5. **Swipe** → Navigate through videos
6. **Menu** → Open drawer, explore sections
7. **Logout** → Return to login

---

**Tip**: Use Expo Go app for the best mobile experience! 📱

Enjoy exploring Neoori! 🎉

