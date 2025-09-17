#!/usr/bin/env bash

set -e

PUPPETEER_EXECUTABLE_PATH=$(npm run -s puppeteer:get-executable)

export PUPPETEER_EXECUTABLE_PATH

echo "Found Puppeteer executable at: $PUPPETEER_EXECUTABLE_PATH"

node server.js
