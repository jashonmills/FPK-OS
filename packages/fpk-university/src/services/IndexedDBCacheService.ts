
/**
 * IndexedDB Cache Service
 * Provides smart caching for book metadata, covers, and content
 */

interface CacheEntry {
  id: string;
  data: any;
  timestamp: number;
  lastAccessed: number;
  size: number;
  type: 'metadata' | 'cover' | 'content' | 'toc';
}

interface CacheStats {
  totalSize: number;
  entryCount: number;
  hitRate: number;
  lastCleanup: number;
}

class IndexedDBCacheService {
  private dbName = 'BookCacheDB';
  private version = 1;
  private db: IDBDatabase | null = null;
  private isInitialized = false;
  private maxCacheSize = 100 * 1024 * 1024; // 100MB
  private maxEntryAge = 7 * 24 * 60 * 60 * 1000; // 7 days
  private stats: CacheStats = {
    totalSize: 0,
    entryCount: 0,
    hitRate: 0,
    lastCleanup: 0
  };

  async initialize(): Promise<boolean> {
    if (this.isInitialized) return true;

    try {
      console.log('🗄️ Initializing IndexedDB cache service...');
      
      this.db = await this.openDatabase();
      await this.loadStats();
      await this.performMaintenanceIfNeeded();
      
      this.isInitialized = true;
      console.log('✅ IndexedDB cache service initialized');
      return true;
    } catch (error) {
      console.error('❌ Failed to initialize IndexedDB cache:', error);
      return false;
    }
  }

  private openDatabase(): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.version);
      
      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result);
      
      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        
        // Create object stores
        if (!db.objectStoreNames.contains('cache')) {
          const cacheStore = db.createObjectStore('cache', { keyPath: 'id' });
          cacheStore.createIndex('type', 'type', { unique: false });
          cacheStore.createIndex('timestamp', 'timestamp', { unique: false });
          cacheStore.createIndex('lastAccessed', 'lastAccessed', { unique: false });
        }
        
        if (!db.objectStoreNames.contains('stats')) {
          db.createObjectStore('stats', { keyPath: 'id' });
        }
      };
    });
  }

  async get(key: string): Promise<any | null> {
    if (!this.isInitialized || !this.db) return null;

    try {
      const transaction = this.db.transaction(['cache'], 'readwrite');
      const store = transaction.objectStore('cache');
      const request = store.get(key);

      return new Promise((resolve) => {
        request.onsuccess = async () => {
          const entry: CacheEntry | undefined = request.result;
          
          if (!entry) {
            resolve(null);
            return;
          }

          // Check if entry is expired
          const now = Date.now();
          if (now - entry.timestamp > this.maxEntryAge) {
            await this.delete(key);
            resolve(null);
            return;
          }

          // Update last accessed time
          entry.lastAccessed = now;
          store.put(entry);

          console.log(`🎯 Cache hit for key: ${key}`);
          resolve(entry.data);
        };

        request.onerror = () => resolve(null);
      });
    } catch (error) {
      console.warn('Cache get error:', error);
      return null;
    }
  }

  async set(key: string, data: any, type: CacheEntry['type'] = 'content'): Promise<boolean> {
    if (!this.isInitialized || !this.db) return false;

    try {
      const size = this.calculateSize(data);
      
      // Check if we need to make space
      if (this.stats.totalSize + size > this.maxCacheSize) {
        await this.evictOldEntries(size);
      }

      const entry: CacheEntry = {
        id: key,
        data,
        timestamp: Date.now(),
        lastAccessed: Date.now(),
        size,
        type
      };

      const transaction = this.db.transaction(['cache'], 'readwrite');
      const store = transaction.objectStore('cache');
      
      return new Promise((resolve) => {
        const request = store.put(entry);
        
        request.onsuccess = () => {
          this.stats.totalSize += size;
          this.stats.entryCount++;
          console.log(`💾 Cached ${type} for key: ${key} (${this.formatSize(size)})`);
          resolve(true);
        };

        request.onerror = () => resolve(false);
      });
    } catch (error) {
      console.warn('Cache set error:', error);
      return false;
    }
  }

  async delete(key: string): Promise<boolean> {
    if (!this.isInitialized || !this.db) return false;

    try {
      const transaction = this.db.transaction(['cache'], 'readwrite');
      const store = transaction.objectStore('cache');
      
      // Get entry size first
      const getRequest = store.get(key);
      
      return new Promise((resolve) => {
        getRequest.onsuccess = () => {
          const entry: CacheEntry | undefined = getRequest.result;
          
          const deleteRequest = store.delete(key);
          
          deleteRequest.onsuccess = () => {
            if (entry) {
              this.stats.totalSize -= entry.size;
              this.stats.entryCount--;
            }
            console.log(`🗑️ Deleted cache entry: ${key}`);
            resolve(true);
          };

          deleteRequest.onerror = () => resolve(false);
        };

        getRequest.onerror = () => resolve(false);
      });
    } catch (error) {
      console.warn('Cache delete error:', error);
      return false;
    }
  }

  async clear(): Promise<boolean> {
    if (!this.isInitialized || !this.db) return false;

    try {
      const transaction = this.db.transaction(['cache'], 'readwrite');
      const store = transaction.objectStore('cache');
      
      return new Promise((resolve) => {
        const request = store.clear();
        
        request.onsuccess = () => {
          this.stats.totalSize = 0;
          this.stats.entryCount = 0;
          console.log('🧹 Cache cleared');
          resolve(true);
        };

        request.onerror = () => resolve(false);
      });
    } catch (error) {
      console.warn('Cache clear error:', error);
      return false;
    }
  }

  private async evictOldEntries(spaceNeeded: number): Promise<void> {
    if (!this.db) return;

    console.log('🧹 Evicting old cache entries...');

    const transaction = this.db.transaction(['cache'], 'readwrite');
    const store = transaction.objectStore('cache');
    const index = store.index('lastAccessed');
    
    const request = index.openCursor();
    let freedSpace = 0;

    return new Promise((resolve) => {
      request.onsuccess = (event) => {
        const cursor = (event.target as IDBRequest).result;
        
        if (cursor && freedSpace < spaceNeeded) {
          const entry: CacheEntry = cursor.value;
          
          // Delete old or large entries first
          const age = Date.now() - entry.lastAccessed;
          if (age > this.maxEntryAge / 2 || entry.size > 5 * 1024 * 1024) {
            cursor.delete();
            freedSpace += entry.size;
            this.stats.totalSize -= entry.size;
            this.stats.entryCount--;
          }
          
          cursor.continue();
        } else {
          console.log(`✅ Freed ${this.formatSize(freedSpace)} of cache space`);
          resolve();
        }
      };

      request.onerror = () => resolve();
    });
  }

  private async loadStats(): Promise<void> {
    if (!this.db) return;

    try {
      const transaction = this.db.transaction(['stats'], 'readonly');
      const store = transaction.objectStore('stats');
      const request = store.get('main');

      return new Promise((resolve) => {
        request.onsuccess = () => {
          if (request.result) {
            this.stats = { ...this.stats, ...request.result.data };
          }
          resolve();
        };

        request.onerror = () => resolve();
      });
    } catch (error) {
      console.warn('Failed to load cache stats:', error);
    }
  }

  private async saveStats(): Promise<void> {
    if (!this.db) return;

    try {
      const transaction = this.db.transaction(['stats'], 'readwrite');
      const store = transaction.objectStore('stats');
      
      store.put({
        id: 'main',
        data: this.stats,
        updated: Date.now()
      });
    } catch (error) {
      console.warn('Failed to save cache stats:', error);
    }
  }

  private async performMaintenanceIfNeeded(): Promise<void> {
    const now = Date.now();
    const timeSinceLastCleanup = now - this.stats.lastCleanup;
    
    // Perform maintenance every 24 hours
    if (timeSinceLastCleanup > 24 * 60 * 60 * 1000) {
      console.log('🔧 Performing cache maintenance...');
      
      await this.evictOldEntries(0); // Clean up expired entries
      this.stats.lastCleanup = now;
      await this.saveStats();
      
      console.log('✅ Cache maintenance completed');
    }
  }

  private calculateSize(data: any): number {
    try {
      return new Blob([JSON.stringify(data)]).size;
    } catch {
      return 1024; // Default 1KB if calculation fails
    }
  }

  private formatSize(bytes: number): string {
    const units = ['B', 'KB', 'MB', 'GB'];
    let size = bytes;
    let unitIndex = 0;
    
    while (size >= 1024 && unitIndex < units.length - 1) {
      size /= 1024;
      unitIndex++;
    }
    
    return `${size.toFixed(1)} ${units[unitIndex]}`;
  }

  getStats(): CacheStats {
    return { ...this.stats };
  }

  async getCachedKeys(type?: CacheEntry['type']): Promise<string[]> {
    if (!this.isInitialized || !this.db) return [];

    try {
      const transaction = this.db.transaction(['cache'], 'readonly');
      const store = transaction.objectStore('cache');
      
      let request: IDBRequest;
      if (type) {
        const index = store.index('type');
        request = index.getAllKeys(type);
      } else {
        request = store.getAllKeys();
      }

      return new Promise((resolve) => {
        request.onsuccess = () => resolve(request.result as string[]);
        request.onerror = () => resolve([]);
      });
    } catch (error) {
      console.warn('Failed to get cached keys:', error);
      return [];
    }
  }
}

// Global instance
export const indexedDBCache = new IndexedDBCacheService();
