# 🎯 Spinning Wheel Chrome Extension

A simple and elegant Chrome extension that helps you make decisions with a beautiful spinning wheel interface.

## ✨ Features

- 🎲 **Interactive Spinning Wheel**: Smooth animations with physics-based easing
- ➕ **Custom Items**: Add up to 8 personalized options
- 🎨 **Beautiful Design**: Gradient backgrounds with modern UI elements
- ⚡ **Instant Results**: Quick decision-making with visual feedback
- 🔄 **Easy Management**: Add/remove items with simple controls
- 📱 **Responsive**: Optimized 320px popup interface

## 🚀 Installation

### From Source (Developer Mode)

1. Clone or download this repository
2. Open Chrome and navigate to `chrome://extensions/`
3. Enable **Developer mode** in the top right corner
4. Click **Load unpacked** and select the extension directory
5. The Spinning Wheel icon will appear in your toolbar

## 🎮 How to Use

1. **Click the extension icon** in your Chrome toolbar
2. **Add items** by typing in the input field and clicking "Add" (or press Enter)
3. **Remove items** by clicking the × button on any item chip
4. **Spin the wheel** by clicking the "Spin! 🎲" button
5. **View results** displayed with a celebration animation
6. **Reset** to default items anytime with the Reset button

## 🎨 Default Items

The extension comes with sample food options:
- Pizza
- Chicken  
- Burger

## ⚙️ Technical Details

- **Manifest Version**: 3 (latest Chrome Extension format)
- **Permissions**: None required
- **Technology**: Vanilla HTML5, CSS3, and JavaScript
- **Canvas Rendering**: HTML5 Canvas for smooth wheel graphics
- **Animation**: RequestAnimationFrame with easeOut physics

## 🔧 Development

This extension uses no build process or external dependencies. All code is vanilla JavaScript for maximum compatibility and simplicity.

### File Structure

```
spinning-wheel/
├── manifest.json       # Extension configuration
├── popup.html         # Main UI structure
├── popup.css          # Styling and animations
├── popup.js           # Core application logic
├── CLAUDE.md          # Development guidance
└── README.md          # This file
```

### Key Components

- **WheelSpinner Class**: Main application controller
- **Canvas Rendering**: Dynamic wheel with color-coded sections
- **Animation System**: Smooth spinning with realistic physics
- **Event Handling**: User interactions and item management

## 🎯 Limitations

- Maximum 8 items (for optimal readability)
- 20 character limit per item
- No persistent storage (resets on popup close)
- Requires Chrome browser

## 📝 License

This project is open source and available under the MIT License.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit issues or pull requests.

---

**Made with ❤️ for better decision making**