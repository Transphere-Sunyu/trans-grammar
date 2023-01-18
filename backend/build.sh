#!/bin/bash

# Navigate to the trans-grammar directory
cd /trans-grammar

# Pull the latest changes from the GitHub repository
git pull

# Navigate to the frontend directory
cd /frontend

# Install dependencies
npm install

# Build the React app
npm run build

# Restart the server
systemctl restart caddy
