# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Chrome extension called "Group Randomizer" that randomly divides items into balanced groups. It's a Manifest V3 extension with internationalization support for English and Korean.

## Architecture

### Core Components
- **manifest.json**: Chrome extension configuration (Manifest V3)
- **background.js**: Service worker that handles extension icon clicks and opens the main interface
- **index.html**: Main UI with input for items and group configuration
- **app.js**: Core GroupRandomizer class that handles all randomization logic
- **styles.css**: UI styling with animations and responsive design
- **_locales/**: Internationalization files for English and Korean

### Key Features
- Balanced group distribution algorithm that ensures even group sizes
- 10-color cycling system for visual group differentiation
- Confetti animation on successful randomization
- Auto-resizing textarea for item input
- Maximum of 100 items with up to 20 groups
- Chrome i18n integration for localization

## Development

### Testing the Extension
1. Load unpacked extension in Chrome developer mode
2. Point to the project directory
3. Click the extension icon to test functionality

### Key Classes and Methods
- **GroupRandomizer**: Main class in app.js:712
  - `distributeItemsEvenly()`: Core algorithm for balanced group creation
  - `validateInput()`: Input validation logic
  - `initializeLocalization()`: Chrome i18n setup

### Localization
- Messages defined in `_locales/en/messages.json` and `_locales/kr/messages.json`
- Automatic text replacement using `data-i18n` attributes
- Placeholder text localization via `data-i18n-placeholder` attributes

## Important Constraints
- Minimum 2 groups required
- Group count cannot exceed item count
- Duplicate items are detected and must be removed before creating groups
- Uses Chrome Extension Manifest V3 service worker pattern
