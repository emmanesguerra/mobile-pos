
# Mobile POS (Point of Sale) App

The Mobile POS (Point of Sale) app is a mobile application built with React Native and the Expo framework, designed to help businesses efficiently manage sales transactions. The app utilizes an external barcode scanner to scan items and track sales in real-time. It features a local database to store transaction records and will support syncing data for business continuity.

## Table of Contents

- [Tech Stack](#tech-stack)
- [Installation](#installation)
- [Folder Structure](#folder-structure)
- [Features](#features)
- [Future Development](#future-development)

## Tech Stack

The app is built using the following technologies:

- **React Native**: Framework for building cross-platform mobile apps.
- **Expo**: Platform for building and running React Native apps.
- **Expo SQLite**: Local database for storing POS records.
- **React Drawer Navigation**: Navigation library for routing between screens.
- **Expo Router**: For routing management.

## Installation

### Prerequisites

Before running the app, ensure the following are installed:

- Node.js (version 16 or above)
- Expo CLI (for running the app)

To install Expo CLI:

```bash
npm install -g expo-cli
```

### Steps to Run the App

1. **Clone the repository:**

   ```bash
   git clone https://github.com/emmanesguerra/mobile-pos.git
   ```

2. **Navigate to the project folder:**

   ```bash
   cd mobile-pos
   ```

3. **Install dependencies:**

   ```bash
   npm install
   ```

4. **Start the Expo project:**

   ```bash
   npx expo start
   ```


## Folder Structure

Here's the folder structure for the Mobile POS App:

```
/app                          # For navigation setup
/components                   # Reusable UI components
/screens                      # App screens
/src
├── /context                  # Contexts for state management
├── /database                 # Database-related files
│   ├── init.ts               # Initialize SQLite database
│   ├── product.ts            # Handle product record operations
│   └── orders.ts             # Handle sales record operations
├── /hooks                    # Custom hooks
├── /interfaces               # TypeScript interfaces
├── /services                 # External services
│   ├── dateService           # Handle date formats
│   └── refNoService          # Handle reference number format
```

## Features

- **Barcode Scanning**: Use an external barcode scanner to scan items and add them to the sales record.
- **Sales Screen**: Add sales records by scanning products and inputting quantities. This screen also allows users to review and complete sales transactions.
- **Built-in calculator**: For quickly calculating the total sales amount, paid amount, and change during a transaction
- **Sales History**: View a list of sales records, including product names, quantities, and timestamps.
- **Product Inventory**: Maintain an up-to-date list of products
- **Local Storage**: Store sales and product data in a local SQLite database.

## Future Development

The following features and improvements are planned for future releases:

- **Cloud Syncing**: Implement cloud syncing for backup and multi-device access to sales records. Probably integrate this with Sales Tracker App
- **User Authentication**: Introduce user login and account management.
- **Offline Mode Enhancements**: Improve offline functionality and automatic syncing when back online.
- **Multi-Language Support**: Provide language options for wider accessibility.
- **Nativewind Integration**: Enhance styling efficiency by leveraging Nativewind to reduce CSS input and improve performance.
