/**
 * Global registry to prevent duplicate Supabase realtime subscriptions
 * This ensures only one channel per unique identifier exists at any time
 */

import { RealtimeChannel } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

class RealtimeChannelRegistry {
  private channels = new Map<string, RealtimeChannel>();
  private pendingSubscriptions = new Set<string>();

  /**
   * Get or create a channel with deduplication
   */
  getOrCreateChannel(
    channelKey: string,
    createChannelFn: () => RealtimeChannel
  ): RealtimeChannel {
    // Check if already exists
    const existingChannel = this.channels.get(channelKey);
    if (existingChannel) {
      console.log(`📡 Reusing existing channel: ${channelKey}`);
      return existingChannel;
    }

    // Prevent concurrent subscription attempts
    if (this.pendingSubscriptions.has(channelKey)) {
      console.warn(`⚠️ Subscription already pending for: ${channelKey}`);
      // Return a dummy channel to prevent errors
      return supabase.channel(`dummy-${Date.now()}`);
    }

    console.log(`🆕 Creating new channel: ${channelKey}`);
    this.pendingSubscriptions.add(channelKey);
    
    const channel = createChannelFn();
    this.channels.set(channelKey, channel);
    
    // Clean up pending after a short delay
    setTimeout(() => {
      this.pendingSubscriptions.delete(channelKey);
    }, 1000);

    return channel;
  }

  /**
   * Remove a channel from registry
   */
  removeChannel(channelKey: string): void {
    const channel = this.channels.get(channelKey);
    if (channel) {
      try {
        console.log(`🧹 Removing channel: ${channelKey}`);
        supabase.removeChannel(channel);
        this.channels.delete(channelKey);
        this.pendingSubscriptions.delete(channelKey);
      } catch (error) {
        console.warn(`Error removing channel ${channelKey}:`, error);
      }
    }
  }

  /**
   * Remove all channels (for cleanup)
   */
  removeAllChannels(): void {
    console.log('🧹 Cleaning up all realtime channels');
    this.channels.forEach((channel, key) => {
      try {
        supabase.removeChannel(channel);
      } catch (error) {
        console.warn(`Error removing channel ${key}:`, error);
      }
    });
    this.channels.clear();
    this.pendingSubscriptions.clear();
  }

  /**
   * Get current channel count for debugging
   */
  getChannelCount(): number {
    return this.channels.size;
  }

  /**
   * Get all channel keys for debugging
   */
  getChannelKeys(): string[] {
    return Array.from(this.channels.keys());
  }
}

// Global singleton instance
export const channelRegistry = new RealtimeChannelRegistry();