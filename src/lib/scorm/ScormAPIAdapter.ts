import { createScorm12API } from '@/scorm/runtime/scorm12';
import { createScorm2004API } from '@/scorm/runtime/scorm2004';
import { supabase } from '@/integrations/supabase/client';

export type DebugEventType = 'info' | 'success' | 'error' | 'warning';

export interface ScormAPIAdapter {
  initialize: () => void;
  cleanup: () => void;
  getDebugLogs: () => string[];
}

export class Scorm12Adapter implements ScormAPIAdapter {
  private api: any;
  private debugLogs: string[] = [];
  private enrollmentId: string;
  private scoId: string;
  private onDebugEvent: (type: DebugEventType, message: string) => void;

  constructor(
    enrollmentId: string,
    scoId: string,
    onDebugEvent: (type: DebugEventType, message: string) => void
  ) {
    this.enrollmentId = enrollmentId;
    this.scoId = scoId;
    this.onDebugEvent = onDebugEvent;
    this.createAPI();
  }

  private createAPI() {
    const handleCommit = async (cmiData: any) => {
      try {
        this.onDebugEvent('info', `SCORM 1.2 Commit: ${JSON.stringify(cmiData).substring(0, 100)}...`);
        
        const { error } = await supabase.functions.invoke('scorm-runtime-advanced', {
          body: {
            action: 'commit',
            enrollmentId: this.enrollmentId,
            scoId: this.scoId,
            cmiData
          }
        });
        
        if (error) throw error;
        this.onDebugEvent('success', 'SCORM 1.2 data committed successfully');
      } catch (error: any) {
        this.onDebugEvent('error', `SCORM 1.2 Commit failed: ${error.message}`);
        throw error;
      }
    };

    const handleFinish = async (cmiData: any) => {
      try {
        this.onDebugEvent('info', 'SCORM 1.2 Finishing session...');
        
        const { error } = await supabase.functions.invoke('scorm-runtime-advanced', {
          body: {
            action: 'terminate',
            enrollmentId: this.enrollmentId,
            scoId: this.scoId,
            cmiData
          }
        });
        
        if (error) throw error;
        this.onDebugEvent('success', 'SCORM 1.2 session finished successfully');
      } catch (error: any) {
        this.onDebugEvent('error', `SCORM 1.2 Finish failed: ${error.message}`);
        throw error;
      }
    };

    this.api = createScorm12API({}, {
      onCommit: handleCommit,
      onFinish: handleFinish
    });
  }

  initialize() {
    try {
      // Expose API on window for iframe discovery
      (window as any).API = this.api;
      this.onDebugEvent('success', 'SCORM 1.2 API initialized and exposed on window.API');
    } catch (error: any) {
      this.onDebugEvent('error', `SCORM 1.2 API initialization failed: ${error.message}`);
    }
  }

  cleanup() {
    delete (window as any).API;
    this.onDebugEvent('info', 'SCORM 1.2 API cleaned up');
  }

  getDebugLogs() {
    return this.debugLogs;
  }
}

export class Scorm2004Adapter implements ScormAPIAdapter {
  private api: any;
  private debugLogs: string[] = [];
  private enrollmentId: string;
  private scoId: string;
  private onDebugEvent: (type: DebugEventType, message: string) => void;

  constructor(
    enrollmentId: string,
    scoId: string,
    onDebugEvent: (type: DebugEventType, message: string) => void
  ) {
    this.enrollmentId = enrollmentId;
    this.scoId = scoId;
    this.onDebugEvent = onDebugEvent;
    this.createAPI();
  }

  private createAPI() {
    const handleCommit = async (cmiData: any) => {
      try {
        this.onDebugEvent('info', `SCORM 2004 Commit: ${JSON.stringify(cmiData).substring(0, 100)}...`);
        
        const { error } = await supabase.functions.invoke('scorm-runtime-advanced', {
          body: {
            action: 'commit',
            enrollmentId: this.enrollmentId,
            scoId: this.scoId,
            cmiData
          }
        });
        
        if (error) throw error;
        this.onDebugEvent('success', 'SCORM 2004 data committed successfully');
      } catch (error: any) {
        this.onDebugEvent('error', `SCORM 2004 Commit failed: ${error.message}`);
        throw error;
      }
    };

    const handleTerminate = async (cmiData: any) => {
      try {
        this.onDebugEvent('info', 'SCORM 2004 Terminating session...');
        
        const { error } = await supabase.functions.invoke('scorm-runtime-advanced', {
          body: {
            action: 'terminate',
            enrollmentId: this.enrollmentId,
            scoId: this.scoId,
            cmiData
          }
        });
        
        if (error) throw error;
        this.onDebugEvent('success', 'SCORM 2004 session terminated successfully');
      } catch (error: any) {
        this.onDebugEvent('error', `SCORM 2004 Terminate failed: ${error.message}`);
        throw error;
      }
    };

    this.api = createScorm2004API({}, {
      onCommit: handleCommit,
      onTerminate: handleTerminate
    });
  }

  initialize() {
    try {
      // Expose API on window for iframe discovery
      (window as any).API_1484_11 = this.api;
      this.onDebugEvent('success', 'SCORM 2004 API initialized and exposed on window.API_1484_11');
    } catch (error: any) {
      this.onDebugEvent('error', `SCORM 2004 API initialization failed: ${error.message}`);
    }
  }

  cleanup() {
    delete (window as any).API_1484_11;
    this.onDebugEvent('info', 'SCORM 2004 API cleaned up');
  }

  getDebugLogs() {
    return this.debugLogs;
  }
}