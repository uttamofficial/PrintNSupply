#!/bin/bash

# Cloudinary Upload Preset Checker
# This script checks if your Cloudinary upload preset is configured correctly

CLOUD_NAME="dcwzukqqw"
UPLOAD_PRESET="printnsupply"

echo "🔍 Checking Cloudinary Upload Preset Configuration..."
echo "=========================================="
echo ""

# Check if curl is available
if ! command -v curl &> /dev/null; then
    echo "❌ curl is not installed. Please install it first."
    exit 1
fi

# Check if jq is available (for pretty JSON)
if command -v jq &> /dev/null; then
    HAS_JQ=true
else
    HAS_JQ=false
    echo "⚠️  jq not found - output will not be pretty formatted"
    echo "   Install it with: sudo apt-get install jq"
    echo ""
fi

# Test upload preset
echo "Testing upload preset: $UPLOAD_PRESET"
echo "Cloud name: $CLOUD_NAME"
echo ""

RESPONSE=$(curl -s "https://api.cloudinary.com/v1_1/$CLOUD_NAME/upload_presets/$UPLOAD_PRESET")

# Check if response contains error
if echo "$RESPONSE" | grep -q "error"; then
    echo "❌ FAILED: Upload preset not found or not accessible"
    echo ""
    echo "Response:"
    if [ "$HAS_JQ" = true ]; then
        echo "$RESPONSE" | jq '.'
    else
        echo "$RESPONSE"
    fi
    echo ""
    echo "📝 Action Required:"
    echo "   1. Go to: https://cloudinary.com/console/settings/upload"
    echo "   2. Create an upload preset named: $UPLOAD_PRESET"
    echo "   3. Set it to 'Unsigned' mode"
    echo "   4. Set access mode to 'Public'"
    echo ""
    echo "See CLOUDINARY_401_FIX.md for detailed instructions"
    exit 1
fi

# Parse response
if [ "$HAS_JQ" = true ]; then
    UNSIGNED=$(echo "$RESPONSE" | jq -r '.unsigned // false')
    ACCESS_MODE=$(echo "$RESPONSE" | jq -r '.settings.access_mode // "not set"')
    RESOURCE_TYPE=$(echo "$RESPONSE" | jq -r '.settings.resource_type // "auto"')
else
    UNSIGNED=$(echo "$RESPONSE" | grep -o '"unsigned":[^,}]*' | cut -d':' -f2 | tr -d ' ')
    ACCESS_MODE="unknown"
fi

echo "✅ Upload preset found!"
echo ""
echo "Configuration:"
echo "--------------------"
if [ "$HAS_JQ" = true ]; then
    echo "$RESPONSE" | jq '{name, unsigned, settings: {access_mode: .settings.access_mode, resource_type: .settings.resource_type}}'
else
    echo "$RESPONSE"
fi
echo ""

# Check if unsigned
if [ "$UNSIGNED" = "true" ]; then
    echo "✅ Signing mode: UNSIGNED (Good - allows browser uploads)"
else
    echo "❌ Signing mode: SIGNED (Bad - will cause upload errors)"
    echo "   Fix: Change preset to 'Unsigned' in Cloudinary dashboard"
fi

# Check access mode (only if jq is available)
if [ "$HAS_JQ" = true ]; then
    if [ "$ACCESS_MODE" = "public" ]; then
        echo "✅ Access mode: PUBLIC (Good - files are accessible)"
    else
        echo "❌ Access mode: $ACCESS_MODE (Bad - will cause 401 errors)"
        echo "   Fix: Change access mode to 'Public' in Cloudinary dashboard"
    fi
else
    echo "⚠️  Cannot check access mode (install jq for full check)"
fi

echo ""
echo "=========================================="

# Final verdict
if [ "$UNSIGNED" = "true" ] && ([ "$ACCESS_MODE" = "public" ] || [ "$HAS_JQ" = false ]); then
    echo "🎉 Configuration looks good!"
    echo ""
    echo "Next steps:"
    echo "   1. Restart your frontend server"
    echo "   2. Try uploading a PDF"
    echo "   3. Check if preview works"
else
    echo "⚠️  Configuration needs fixes!"
    echo ""
    echo "Action Required:"
    echo "   1. Go to: https://cloudinary.com/console/settings/upload"
    echo "   2. Edit preset: $UPLOAD_PRESET"
    if [ "$UNSIGNED" != "true" ]; then
        echo "   3. Change 'Signing Mode' to 'Unsigned'"
    fi
    if [ "$ACCESS_MODE" != "public" ] && [ "$HAS_JQ" = true ]; then
        echo "   4. Change 'Access Control' to 'Public'"
    fi
    echo "   5. Save the preset"
    echo ""
    echo "See CLOUDINARY_401_FIX.md for step-by-step instructions"
fi

echo ""
