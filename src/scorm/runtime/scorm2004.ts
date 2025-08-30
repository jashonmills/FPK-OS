import { ErrorCode2004, CMI2004Data, ERROR_STRINGS_2004 } from '@/types/cmi2004';
import { getValue2004, setValue2004 } from '@/utils/validators/cmi2004';

export class Scorm2004Runtime {
  private initialized = false;
  private terminated = false;
  private lastError: ErrorCode2004 = "0";
  private cmi: CMI2004Data;
  private commitHandler?: (cmi: CMI2004Data) => Promise<void>;
  private terminateHandler?: (cmi: CMI2004Data) => Promise<void>;

  constructor(
    initialData?: Partial<CMI2004Data>,
    handlers?: {
      onCommit?: (cmi: CMI2004Data) => Promise<void>;
      onTerminate?: (cmi: CMI2004Data) => Promise<void>;
    }
  ) {
    this.cmi = this.createInitialCMI(initialData);
    this.commitHandler = handlers?.onCommit;
    this.terminateHandler = handlers?.onTerminate;
  }

  private createInitialCMI(initialData?: Partial<CMI2004Data>): CMI2004Data {
    return {
      learner_id: initialData?.learner_id || "",
      learner_name: initialData?.learner_name || "",
      learner_preference: {
        audio_level: initialData?.learner_preference?.audio_level || "1",
        language: initialData?.learner_preference?.language || "",
        delivery_speed: initialData?.learner_preference?.delivery_speed || "1",
        audio_captioning: initialData?.learner_preference?.audio_captioning || "0"
      },
      location: initialData?.location || "",
      completion_status: initialData?.completion_status || "not attempted",
      success_status: initialData?.success_status || "unknown",
      credit: initialData?.credit || "credit",
      entry: initialData?.entry || "",
      exit: initialData?.exit || "",
      mode: initialData?.mode || "normal",
      progress_measure: initialData?.progress_measure || "",
      score: {
        scaled: initialData?.score?.scaled || "",
        raw: initialData?.score?.raw || "",
        min: initialData?.score?.min || "",
        max: initialData?.score?.max || ""
      },
      total_time: initialData?.total_time || "PT0S",
      session_time: initialData?.session_time || "PT0S",
      max_time_allowed: initialData?.max_time_allowed || "",
      time_limit_action: initialData?.time_limit_action || "continue,no message",
      scaled_passing_score: initialData?.scaled_passing_score || "",
      suspend_data: initialData?.suspend_data || "",
      launch_data: initialData?.launch_data || "",
      objectives: initialData?.objectives || [],
      interactions: initialData?.interactions || [],
      comments_from_learner: initialData?.comments_from_learner || [],
      comments_from_lms: initialData?.comments_from_lms || []
    };
  }

  private setError(error: ErrorCode2004): void {
    this.lastError = error;
    console.log(`SCORM 2004 Error ${error}: ${ERROR_STRINGS_2004[error]}`);
  }

  // SCORM 2004 API Implementation
  public Initialize = (param: string = ""): string => {
    console.log('SCORM 2004: Initialize called with', param);
    
    if (this.initialized) {
      this.setError("103"); // Already initialized
      return "false";
    }

    if (this.terminated) {
      this.setError("104"); // Content instance terminated
      return "false";
    }

    try {
      // Set entry mode
      if (this.cmi.completion_status === "not attempted") {
        this.cmi.entry = "ab-initio";
      } else {
        this.cmi.entry = "resume";
      }

      this.initialized = true;
      this.setError("0");
      return "true";
    } catch (error) {
      console.error('Initialize error:', error);
      this.setError("102"); // General initialization failure
      return "false";
    }
  };

  public Terminate = (param: string = ""): string => {
    console.log('SCORM 2004: Terminate called with', param);
    
    if (!this.initialized) {
      this.setError("112"); // Termination before initialization
      return "false";
    }

    if (this.terminated) {
      this.setError("113"); // Termination after termination
      return "false";
    }

    try {
      // Calculate total time
      if (this.cmi.session_time && this.cmi.session_time !== "PT0S") {
        this.cmi.total_time = this.addTimeIntervals(this.cmi.total_time, this.cmi.session_time);
      }

      // Set exit if not already set
      if (!this.cmi.exit) {
        this.cmi.exit = "normal";
      }

      // Call terminate handler
      if (this.terminateHandler) {
        this.terminateHandler(this.cmi).catch(error => {
          console.error('Terminate handler error:', error);
        });
      }

      this.terminated = true;
      this.initialized = false;
      this.setError("0");
      return "true";
    } catch (error) {
      console.error('Terminate error:', error);
      this.setError("111"); // General termination failure
      return "false";
    }
  };

  public GetValue = (element: string): string => {
    console.log('SCORM 2004: GetValue called for', element);
    
    if (!this.initialized) {
      this.setError("122"); // Retrieve data before initialization
      return "";
    }

    if (this.terminated) {
      this.setError("123"); // Retrieve data after termination
      return "";
    }

    const result = getValue2004(this.cmi, element);
    if (result.ok) {
      this.setError("0");
      return String(result.value ?? "");
    } else {
      this.setError(result.error!);
      return "";
    }
  };

  public SetValue = (element: string, value: string): string => {
    console.log('SCORM 2004: SetValue called', element, value);
    
    if (!this.initialized) {
      this.setError("132"); // Store data before initialization
      return "false";
    }

    if (this.terminated) {
      this.setError("133"); // Store data after termination
      return "false";
    }

    const result = setValue2004(this.cmi, element, value);
    if (result.ok) {
      this.setError("0");
      return "true";
    } else {
      this.setError(result.error!);
      return "false";
    }
  };

  public Commit = (param: string = ""): string => {
    console.log('SCORM 2004: Commit called with', param);
    
    if (!this.initialized) {
      this.setError("142"); // Commit before initialization
      return "false";
    }

    if (this.terminated) {
      this.setError("143"); // Commit after termination
      return "false";
    }

    try {
      // Call commit handler
      if (this.commitHandler) {
        this.commitHandler(this.cmi).catch(error => {
          console.error('Commit handler error:', error);
        });
      }

      this.setError("0");
      return "true";
    } catch (error) {
      console.error('Commit error:', error);
      this.setError("391"); // General commit failure
      return "false";
    }
  };

  public GetLastError = (): string => {
    return this.lastError;
  };

  public GetErrorString = (code: string): string => {
    return ERROR_STRINGS_2004[(code as ErrorCode2004)] || "Unknown error";
  };

  public GetDiagnostic = (code: string): string => {
    // Return diagnostic information for the error code
    return `Diagnostic information for error ${code}: ${this.GetErrorString(code)}`;
  };

  // Utility methods
  private addTimeIntervals(time1: string, time2: string): string {
    const parseTimeInterval = (time: string): number => {
      // Parse PT[#H][#M][#S] format and return total seconds
      const match = time.match(/^PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+(?:\.\d+)?)S)?$/);
      if (!match) return 0;
      
      const hours = parseInt(match[1] || "0", 10);
      const minutes = parseInt(match[2] || "0", 10);
      const seconds = parseFloat(match[3] || "0");
      
      return hours * 3600 + minutes * 60 + seconds;
    };

    const formatTimeInterval = (totalSeconds: number): string => {
      const hours = Math.floor(totalSeconds / 3600);
      const minutes = Math.floor((totalSeconds % 3600) / 60);
      const seconds = totalSeconds % 60;
      
      let result = "PT";
      if (hours > 0) result += `${hours}H`;
      if (minutes > 0) result += `${minutes}M`;
      if (seconds > 0) {
        if (seconds % 1 === 0) {
          result += `${Math.floor(seconds)}S`;
        } else {
          result += `${seconds.toFixed(2)}S`;
        }
      }
      
      return result === "PT" ? "PT0S" : result;
    };

    const total1 = parseTimeInterval(time1);
    const total2 = parseTimeInterval(time2);
    
    return formatTimeInterval(total1 + total2);
  }

  // Get current CMI data (for debugging/inspection)
  public getCMI(): CMI2004Data {
    return { ...this.cmi };
  }

  // Reset for new attempt
  public reset(initialData?: Partial<CMI2004Data>): void {
    this.initialized = false;
    this.terminated = false;
    this.lastError = "0";
    this.cmi = this.createInitialCMI(initialData);
  }
}

// Global API object for SCORM content
export function createScorm2004API(
  initialData?: Partial<CMI2004Data>,
  handlers?: {
    onCommit?: (cmi: CMI2004Data) => Promise<void>;
    onTerminate?: (cmi: CMI2004Data) => Promise<void>;
  }
) {
  const runtime = new Scorm2004Runtime(initialData, handlers);
  
  return {
    Initialize: runtime.Initialize,
    Terminate: runtime.Terminate,
    GetValue: runtime.GetValue,
    SetValue: runtime.SetValue,
    Commit: runtime.Commit,
    GetLastError: runtime.GetLastError,
    GetErrorString: runtime.GetErrorString,
    GetDiagnostic: runtime.GetDiagnostic,
    // Additional methods for debugging
    getCMI: runtime.getCMI,
    reset: runtime.reset
  };
}