# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Korean Chrome Extension called "돌림판 확장프로그램" (Spinning Wheel Extension) that provides a simple decision-making tool. The extension creates an interactive spinning wheel where users can add custom items and spin to randomly select one.

## Architecture

The project uses a simple, vanilla JavaScript architecture:

- **popup.html**: Main UI structure with input fields, item list display, canvas wheel, and controls
- **popup.js**: Core application logic implemented as a `WheelSpinner` class
- **popup.css**: Complete styling with gradient backgrounds, animations, and responsive design
- **manifest.json**: Chrome Extension v3 configuration
- **icons/**: Extension icons in multiple sizes (16px, 48px, 128px)

### Core Components

- **WheelSpinner Class**: Main application class that manages:
  - Item management (add/remove items with 8-item limit)
  - Canvas-based wheel rendering with dynamic colors
  - Spinning animation with easeOut physics
  - Result calculation and display

- **Canvas Rendering**: The wheel is drawn using HTML5 Canvas with:
  - Dynamic sector calculation based on item count
  - 8 predefined colors that cycle for visual variety
  - Text rotation to match sector angles
  - Real-time rotation updates during spin

- **Event System**: Event listeners handle:
  - Item addition (button click or Enter key)
  - Item removal (click on × button)
  - Wheel spinning with disabled state during animation
  - Reset functionality

## Development

This is a standalone Chrome Extension with no build process or dependencies. All code is vanilla HTML/CSS/JavaScript.

### Testing the Extension

1. Open Chrome and navigate to `chrome://extensions/`
2. Enable "Developer mode" in the top right
3. Click "Load unpacked" and select this directory
4. The extension icon will appear in the toolbar
5. Click the icon to open the spinning wheel popup

### Key Features

- **Item Management**: Add up to 8 custom items, remove items individually
- **Visual Feedback**: Smooth animations, hover effects, and result celebrations
- **Responsive Design**: 320px width popup optimized for extension constraints
- **Default Items**: Starts with Korean food examples (피자, 치킨, 햄버거)
- **Auto-reset**: Maintains minimum of 3 items when all are removed

### Animation Details

- Spin duration: 3-5 seconds random
- Rotation: 5-10 full rotations with easeOut curve
- Result calculation accounts for 12 o'clock pointer position
- Bounce animation for result display

### Limitations

- Maximum 8 items to maintain readability
- 20 character limit per item
- No persistent storage (items reset on popup close)
- Korean language interface