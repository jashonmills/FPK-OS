# Production Logging Configuration

## Overview

FPK University uses a centralized logging system with environment-aware filtering.
In production, only errors are logged by default to reduce noise and protect user privacy.

## Environment Variables

```bash
# Production (default: 'error')
VITE_LOG_LEVEL=error

# Development (default: 'debug')  
VITE_LOG_LEVEL=debug

# Available levels (in order of severity):
# - debug: Everything (development only)
# - info: Info, warnings, and errors
# - warn: Warnings and errors only
# - error: Errors only (production default)
```

## Usage

### Basic Logging
```typescript
import { logger } from '@/utils/logger';

// Simple logs
logger.info('User logged in', { userId: '123' });
logger.error('Failed to load data', { error });
logger.warn('Deprecated API used', { endpoint });
logger.debug('Processing items', { count: items.length });
```

### Domain-Specific Logging
```typescript
// AI system logs
logger.ai.info('Starting AI chat session', { toolId });
logger.ai.error('AI response failed', { error });

// Course operations
logger.courses.info('Course published', { courseId });
logger.courses.debug('Loading course data', { slug });

// Authentication
logger.auth.warn('Failed login attempt', { email });
logger.auth.info('User session refreshed');

// Analytics
logger.analytics.info('Dashboard loaded', { orgId });

// Navigation
logger.navigation.debug('Route changed', { from, to });

// Storage
logger.storage.info('File uploaded', { fileSize });

// Real-time
logger.realtime.debug('Subscription created', { table });

// Messaging
logger.messaging.info('Message sent', { conversationId });

// Governance
logger.governance.info('Rule applied', { ruleId });
```

### Categorized Logging (Alternative Pattern)
```typescript
// 3-argument pattern: message, category, payload
logger.info('Operation completed', 'CUSTOM_CATEGORY', { data });
```

## Security Features

### PII Sanitization (Production Only)

In production, the logger automatically redacts common PII fields:
- email
- password
- ssn
- phone
- address
- dob / dateOfBirth

```typescript
// In development: logs full payload
// In production: { email: '[REDACTED]', action: 'login' }
logger.info('User action', { email: 'user@example.com', action: 'login' });
```

## Best Practices

1. **Use domain loggers** for categorization: `logger.ai.info()` instead of `logger.info()`
2. **Include context** in payloads: `{ courseId, userId, orgId }`
3. **Use appropriate levels**:
   - `error`: Actual failures that need attention
   - `warn`: Unusual but non-breaking situations
   - `info`: Significant business events
   - `debug`: Development-time debugging info
4. **Never log raw passwords** or sensitive data
5. **Use structured payloads** instead of string concatenation

## Migration from console.log

Replace:
```typescript
// Before
console.log('[AI] Starting session:', sessionId);
console.error('Failed to load:', error);

// After
logger.ai.info('Starting session', { sessionId });
logger.error('Failed to load', { error });
```

## Checking Current Configuration

```typescript
const config = logger.getConfig();
// { level: 'error', isProduction: true }
```
