#!/bin/bash

# Android Studio launcher script
ANDROID_STUDIO_PATH="/opt/android-studio-2025.1.1/android-studio/bin/studio"

# Check if the Android Studio binary exists
if [ ! -f "$ANDROID_STUDIO_PATH" ]; then
    echo "Error: Android Studio not found at $ANDROID_STUDIO_PATH"
    exit 1
fi

# Launch Android Studio and send output to background
echo "Launching Android Studio..."
"$ANDROID_STUDIO_PATH" &>/dev/null &

# Exit the script
exit 0
