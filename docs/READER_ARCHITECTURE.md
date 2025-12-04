
# Document Reader Architecture v2.0

## Overview

The Neurodiversity Learning Platform now features a modular, future-proof document reader architecture that supports multiple engines, telemetry, offline capabilities, and easy extensibility.

## Architecture Components

### 1. Core Interfaces (`src/interfaces/DocumentReader.ts`)

- **DocumentReader**: Main interface for all reader engines
- **DocumentIngestionService**: Interface for content sources
- **DocumentMetadata**: Standardized document information
- **DocumentTelemetryEvent**: Performance and usage tracking

### 2. Universal Reader (`src/services/UniversalDocumentReader.ts`)

The main entry point that:
- Routes documents to appropriate engines based on format and feature flags
- Provides consistent API across all document types
- Handles telemetry collection automatically
- Manages engine lifecycle

### 3. Engine Selection

#### PDF Engines
- **Enhanced PDF Viewer**: Advanced features, better performance
- **Standard PDF Viewer**: Fallback with basic functionality

#### EPUB Engines  
- **Optimized EPUB Renderer**: Improved performance and memory usage
- **Standard EPUB Renderer**: Reliable fallback option

### 4. Feature Flag System (`src/services/FeatureFlagService.ts`)

Enables safe rollouts and A/B testing:
- Percentage-based rollouts
- User-agent targeting
- Version-specific flags
- Runtime configuration updates

### 5. Telemetry System (`src/services/DocumentTelemetryService.ts`)

Comprehensive monitoring:
- Load performance metrics
- User interaction tracking
- Error reporting with context
- Offline-capable event queuing
- Analytics integration

### 6. Ingestion Service (`src/services/DocumentIngestionService.ts`)

Modular content acquisition:
- **OPDS Processor**: Project Gutenberg and similar feeds
- **Internet Archive Processor**: Archive.org integration
- **Local Processor**: User uploads and local files
- Extensible architecture for new sources

### 7. PWA & Offline Support

#### Service Worker (`public/sw.js`)
- Document caching for offline reading
- PDF.js asset pre-caching
- Network-first with cache fallback
- Size-limited smart caching

#### Web App Manifest (`public/manifest.json`)
- Native app-like experience
- File association handling
- Custom protocol support
- Responsive design optimization

## Configuration

### Reader Config (`src/config/readerConfig.ts`)

```typescript
const config: DocumentReaderConfig = {
  enableTelemetry: true,
  enableOfflineCache: true,
  maxCacheSize: 100, // MB
  telemetryEndpoint: 'your-analytics-endpoint',
  featureFlags: { /* ... */ },
  readerVersion: '2.0.0'
}
```

### Feature Flags

| Flag | Description | Default | Rollout % |
|------|-------------|---------|-----------|
| `enhanced_pdf_viewer` | Use enhanced PDF engine | true | 100% |
| `optimized_epub_renderer` | Use optimized EPUB engine | true | 80% |
| `offline_cache` | Enable service worker caching | false | 30% |
| `advanced_telemetry` | Detailed performance tracking | true | 100% |
| `experimental_reader_ui` | New UI components | false | 10% |

## Usage Examples

### Basic Implementation

```typescript
import { UniversalDocumentReader } from '@/services/UniversalDocumentReader';
import { defaultReaderConfig } from '@/config/readerConfig';

const reader = new UniversalDocumentReader(defaultReaderConfig);

// Load any document type
await reader.loadDocument(url, {
  title: 'Document Title',
  author: 'Author Name',
  format: 'pdf', // or 'epub'
  fileSize: 1024000
});

// Set up event handlers
reader.onLoadProgress(progress => {
  console.log(`Loading: ${progress.percentage}%`);
});

reader.onTelemetryEvent(event => {
  console.log('Telemetry:', event);
});
```

### Adding New Content Sources

```typescript
import { SourceProcessor } from '@/services/DocumentIngestionService';

class CustomSourceProcessor implements SourceProcessor {
  async validate(config: Record<string, any>): Promise<boolean> {
    // Validate source configuration
    return true;
  }

  async ingest(config: Record<string, any>): Promise<DocumentMetadata[]> {
    // Fetch and process documents
    return documents;
  }
}

// Register new source
documentIngestionService.addSource({
  id: 'custom_source',
  name: 'Custom Source',
  type: 'remote',
  processor: new CustomSourceProcessor(),
  enabled: true
});
```

### Custom Telemetry Integration

```typescript
reader.onTelemetryEvent(event => {
  // Send to your analytics service
  analytics.track(event.type, {
    ...event.metadata,
    performance: event.performance
  });
});
```

## Performance Monitoring

### Key Metrics Tracked

1. **Load Performance**
   - Initial load time
   - Engine initialization time
   - First page render time
   - Memory usage patterns

2. **User Interactions**
   - Page navigation frequency
   - Zoom/font size changes
   - Search usage
   - Time spent reading

3. **Error Tracking**
   - Load failures with context
   - Rendering errors
   - Network timeouts
   - Engine-specific issues

### Alerts & Monitoring

Set up alerts for:
- Load times > 10 seconds
- Error rates > 5%
- Memory usage > 100MB
- Cache hit rate < 70%

## Rollout Strategy

### Phase 1: Internal Testing (v2.0.0-beta)
- Enable for admin users only
- Feature flag: `reader_v2_enabled: false`
- Rollout: 0%

### Phase 2: Limited Release (v2.0.0-rc)
- Gradually increase rollout percentage
- Monitor telemetry for issues
- Rollout: 10% → 25% → 50%

### Phase 3: Full Release (v2.0.0)
- Complete rollout to all users
- Deprecate old reader components
- Rollout: 100%

## Maintenance

### Adding New Document Formats

1. Create new engine implementing `DocumentReader`
2. Add format detection in `UniversalDocumentReader`
3. Update `supportedFormats` configuration
4. Add feature flag for gradual rollout

### Engine Updates

1. Version engines independently
2. Use feature flags for A/B testing
3. Maintain backward compatibility
4. Monitor performance metrics

### Troubleshooting

Common issues and solutions:
- **High memory usage**: Check cache size limits
- **Slow load times**: Verify CDN performance
- **Engine failures**: Check feature flag rollouts
- **Cache issues**: Clear service worker cache

## Security Considerations

- Validate all document URLs before loading
- Sanitize metadata to prevent XSS
- Use HTTPS for all external requests
- Implement Content Security Policy headers
- Regular security audits of PDF.js versions

## Future Enhancements

- **Machine Learning**: Smart pre-caching based on reading patterns
- **Collaborative Features**: Shared annotations and highlights
- **Advanced Analytics**: Reading comprehension insights
- **Accessibility**: Enhanced screen reader support
- **Mobile Optimization**: Touch gesture improvements
