#!/usr/bin/env node

/**
 * OPERATION SENTINEL - Performance Analysis Tool
 * Analyzes performance metrics and detects regressions
 */

const fs = require('fs');
const path = require('path');

const METRICS_FILE = path.join(__dirname, '..', 'cypress', 'reports', 'performance', 'metrics.jsonl');
const THRESHOLD_INCREASE = 0.20; // Alert if metrics increase by >20%

console.log('🎯 OPERATION SENTINEL: Performance Analysis\n');

if (!fs.existsSync(METRICS_FILE)) {
  console.log('⚠️  No performance metrics found. Run tests first.');
  process.exit(0);
}

// Read and parse metrics
const metricsData = fs.readFileSync(METRICS_FILE, 'utf-8')
  .split('\n')
  .filter(line => line.trim())
  .map(line => JSON.parse(line));

if (metricsData.length === 0) {
  console.log('⚠️  No metrics to analyze');
  process.exit(0);
}

// Group metrics by test and metric type
const grouped = {};
metricsData.forEach(entry => {
  const test = entry.test;
  if (!grouped[test]) grouped[test] = {};
  
  Object.entries(entry.metrics).forEach(([metric, values]) => {
    if (!grouped[test][metric]) grouped[test][metric] = [];
    grouped[test][metric].push(...values);
  });
});

// Analyze trends
console.log('📊 Performance Trends:\n');

const alerts = [];

Object.entries(grouped).forEach(([test, metrics]) => {
  console.log(`📝 ${test}:`);
  
  Object.entries(metrics).forEach(([metric, values]) => {
    if (values.length === 0) return;
    
    const avg = values.reduce((a, b) => a + b, 0) / values.length;
    const min = Math.min(...values);
    const max = Math.max(...values);
    const latest = values[values.length - 1];
    
    console.log(`  ${metric}:`);
    console.log(`    Average: ${avg.toFixed(0)}ms`);
    console.log(`    Min: ${min}ms | Max: ${max}ms | Latest: ${latest}ms`);
    
    // Check for regression (latest is >20% slower than average)
    if (latest > avg * (1 + THRESHOLD_INCREASE)) {
      const increase = ((latest - avg) / avg * 100).toFixed(1);
      alerts.push({
        test,
        metric,
        increase: `${increase}%`,
        avg: avg.toFixed(0),
        latest
      });
    }
  });
  
  console.log('');
});

// Report regressions
if (alerts.length > 0) {
  console.log('\n⚠️  PERFORMANCE REGRESSIONS DETECTED:\n');
  alerts.forEach(alert => {
    console.log(`❌ ${alert.test} - ${alert.metric}`);
    console.log(`   Latest: ${alert.latest}ms (${alert.increase} slower than avg ${alert.avg}ms)`);
  });
  console.log('');
  process.exit(1);
} else {
  console.log('✅ No performance regressions detected\n');
  process.exit(0);
}
