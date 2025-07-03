#!/usr/bin/env node

/**
 * Pre-deployment check script
 * Runs various checks to ensure the app is ready for deployment
 */

import { execSync } from 'child_process';
import { existsSync } from 'fs';
import chalk from 'chalk';

const checks = [
  {
    name: 'TypeScript Check',
    command: 'npm run type-check',
    description: 'Checking for TypeScript errors...'
  },
  {
    name: 'ESLint Check',
    command: 'npm run lint',
    description: 'Running ESLint...'
  },
  {
    name: 'Build Check',
    command: 'npm run build',
    description: 'Building for production...'
  }
];

const requiredFiles = [
  'vercel.json',
  'package.json',
  'vite.config.ts',
  'src/main.tsx',
  'index.html'
];

console.log(chalk.blue.bold('🚀 Pre-deployment checks\n'));

// Check required files
console.log(chalk.yellow('📁 Checking required files...'));
let filesOk = true;
for (const file of requiredFiles) {
  if (existsSync(file)) {
    console.log(chalk.green(`✓ ${file}`));
  } else {
    console.log(chalk.red(`✗ ${file} - Missing!`));
    filesOk = false;
  }
}

if (!filesOk) {
  console.log(chalk.red('\n❌ Some required files are missing!'));
  process.exit(1);
}

// Run checks
let allPassed = true;
for (const check of checks) {
  console.log(chalk.yellow(`\n${check.description}`));
  try {
    execSync(check.command, { stdio: 'inherit' });
    console.log(chalk.green(`✓ ${check.name} passed`));
  } catch (error) {
    console.log(chalk.red(`✗ ${check.name} failed`));
    allPassed = false;
  }
}

if (allPassed) {
  console.log(chalk.green.bold('\n🎉 All checks passed! Ready for deployment.'));
  console.log(chalk.blue('\nTo deploy to Vercel:'));
  console.log(chalk.gray('  vercel --prod'));
} else {
  console.log(chalk.red.bold('\n❌ Some checks failed. Please fix the issues before deploying.'));
  process.exit(1);
}
