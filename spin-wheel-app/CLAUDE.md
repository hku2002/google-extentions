# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Chrome extension called "Connie Spin Wheel" - a decision-making tool that displays a spinning wheel interface to help users make choices. The extension opens in a new tab when the browser action is clicked.

## Architecture

**Core Components:**
- `index.html` - Main UI with two-panel layout (controls on left, wheel on right)
- `app.js` - Contains the `WheelSpinner` class that handles all wheel logic, canvas rendering, and user interactions
- `styles.css` - Complete styling with responsive design and animations
- `background.js` - Service worker that handles extension icon clicks and installation
- `menifest.json` - Chrome extension manifest (note: filename has typo - should be "manifest.json")

**Internationalization:**
- Supports English and Korean languages via Chrome extension i18n API
- Language files located in `_locales/en/messages.json` and `_locales/kr/messages.json`
- All UI text is localized using `chrome.i18n.getMessage()` and `data-i18n` attributes

**Key Features:**
- Canvas-based spinning wheel with HTML5 Canvas API
- Support for up to 8 items (originally 8, recently increased to 10 based on git history)
- Smooth easing animation with confetti effects
- Responsive design that adjusts canvas size based on viewport
- Keyboard shortcuts (Space bar to spin)
- Item management (add/remove with validation)

## File Structure

```
/
├── index.html          # Main application UI
├── app.js              # Core WheelSpinner class and logic
├── styles.css          # All styling and responsive design
├── background.js       # Chrome extension service worker
├── menifest.json       # Extension manifest (typo in filename)
└── _locales/           # Internationalization
    ├── en/messages.json
    └── kr/messages.json
```

## Development Commands

This is a client-side Chrome extension with no build process or dependencies. No npm, webpack, or other build tools are used.

**Testing the Extension:**
1. Open Chrome and navigate to `chrome://extensions/`
2. Enable "Developer mode"
3. Click "Load unpacked" and select this directory
4. Click the extension icon to test

**No build/lint/test commands** - this is a vanilla JavaScript Chrome extension.

## Key Implementation Details

**Canvas Rendering:** The wheel is drawn using HTML5 Canvas with mathematical calculations for sectors, text positioning, and rotation. The canvas size is fixed at 500x500 but scales via CSS for responsiveness.

**Animation System:** Uses `requestAnimationFrame` with custom easing function (`1 - Math.pow(1 - progress, 4)`) for smooth spinning animation.

**Item Limits:** Currently supports maximum 8 items (check app.js:88 and app.js:95 for limit logic). Recent commits suggest this was increased to 10.

**Localization Pattern:** Uses Chrome extension i18n API with `data-i18n` and `data-i18n-placeholder` attributes for automatic translation of DOM elements.

## Recent Changes

Based on git history:
- Maximum items increased from 8 to 10 
- Korean text converted to English
- Comprehensive internationalization added
- Name changes in recent commits

## Common Modifications

When modifying item limits, update:
- `app.js:88` - condition check for adding items
- `app.js:95` - alert message condition  
- Corresponding message in `_locales/*/messages.json`

When adding new UI text, add entries to both language files in `_locales/` and use `data-i18n` attributes in HTML or `chrome.i18n.getMessage()` in JavaScript.