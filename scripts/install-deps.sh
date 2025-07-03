#!/bin/bash

# Install Node.js types if not already installed
echo "Installing Node.js types..."
npm install --save-dev @types/node@^22.10.2

echo "Dependencies installed successfully!"
echo "You can now run: npm run build"
