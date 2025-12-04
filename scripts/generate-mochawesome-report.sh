#!/bin/bash

# OPERATION SENTINEL - Report Generation Script
# Merges individual test reports and generates HTML dashboard

echo "🎯 OPERATION SENTINEL: Generating Test Dashboard"
echo ""

# Create reports directory if it doesn't exist
mkdir -p cypress/reports/mochawesome

# Merge all JSON reports into one
echo "📊 Merging test reports..."
npx mochawesome-merge "cypress/reports/mochawesome/*.json" > cypress/reports/mochawesome/merged-report.json

if [ $? -eq 0 ]; then
  echo "✅ Reports merged successfully"
else
  echo "❌ Failed to merge reports"
  exit 1
fi

# Generate HTML report
echo "📈 Generating HTML dashboard..."
npx marge cypress/reports/mochawesome/merged-report.json \
  --reportDir cypress/reports/mochawesome \
  --reportFilename index.html \
  --reportTitle "Operation Sentinel - E2E Test Dashboard" \
  --reportPageTitle "Sentinel Test Results" \
  --inline \
  --charts \
  --showPassed true \
  --showFailed true \
  --showPending true \
  --showSkipped false

if [ $? -eq 0 ]; then
  echo "✅ Dashboard generated successfully"
  echo ""
  echo "🎉 View your dashboard at: cypress/reports/mochawesome/index.html"
  echo ""
else
  echo "❌ Failed to generate dashboard"
  exit 1
fi
