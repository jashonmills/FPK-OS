import { ErrorCode, CMI12Data, ERROR_STRINGS } from '@/types/cmi12';
import { getValue12, setValue12 } from '@/utils/validators/cmi12';

export class Scorm12Runtime {
  private initialized = false;
  private lastError: ErrorCode = "0";
  private cmi: CMI12Data;
  private commitHandler?: (cmi: CMI12Data) => Promise<void>;
  private finishHandler?: (cmi: CMI12Data) => Promise<void>;

  constructor(
    initialData?: Partial<CMI12Data>,
    handlers?: {
      onCommit?: (cmi: CMI12Data) => Promise<void>;
      onFinish?: (cmi: CMI12Data) => Promise<void>;
    }
  ) {
    this.cmi = this.createInitialCMI(initialData);
    this.commitHandler = handlers?.onCommit;
    this.finishHandler = handlers?.onFinish;
  }

  private createInitialCMI(initialData?: Partial<CMI12Data>): CMI12Data {
    return {
      core: {
        student_id: initialData?.core?.student_id || "",
        student_name: initialData?.core?.student_name || "",
        lesson_location: initialData?.core?.lesson_location || "",
        lesson_status: initialData?.core?.lesson_status || "not attempted",
        credit: initialData?.core?.credit || "credit",
        entry: initialData?.core?.entry || "",
        exit: initialData?.core?.exit || "",
        score: {
          raw: initialData?.core?.score?.raw || "",
          min: initialData?.core?.score?.min || "0",
          max: initialData?.core?.score?.max || "100"
        },
        total_time: initialData?.core?.total_time || "00:00:00",
        session_time: initialData?.core?.session_time || "00:00:00"
      },
      suspend_data: initialData?.suspend_data || "",
      launch_data: initialData?.launch_data || "",
      comments: initialData?.comments || "",
      comments_from_lms: initialData?.comments_from_lms || "",
      objectives: initialData?.objectives || [],
      interactions: initialData?.interactions || []
    };
  }

  private setError(error: ErrorCode): void {
    this.lastError = error;
    console.log(`SCORM 1.2 Error ${error}: ${ERROR_STRINGS[error]}`);
  }

  // SCORM 1.2 API Implementation
  public LMSInitialize = (param: string = ""): string => {
    console.log('SCORM 1.2: LMSInitialize called with', param);
    
    if (this.initialized) {
      this.setError("101"); // General exception - already initialized
      return "false";
    }

    try {
      // Set entry mode
      if (this.cmi.core.lesson_status === "not attempted") {
        this.cmi.core.entry = "ab-initio";
      } else {
        this.cmi.core.entry = "resume";
      }

      this.initialized = true;
      this.setError("0");
      return "true";
    } catch (error) {
      console.error('LMSInitialize error:', error);
      this.setError("101");
      return "false";
    }
  };

  public LMSFinish = (param: string = ""): string => {
    console.log('SCORM 1.2: LMSFinish called with', param);
    
    if (!this.initialized) {
      this.setError("301"); // Not initialized
      return "false";
    }

    try {
      // Calculate total time
      if (this.cmi.core.session_time && this.cmi.core.session_time !== "00:00:00") {
        this.cmi.core.total_time = this.addTimes(this.cmi.core.total_time, this.cmi.core.session_time);
      }

      // Set exit if not already set
      if (!this.cmi.core.exit) {
        this.cmi.core.exit = "";
      }

      // Call finish handler
      if (this.finishHandler) {
        this.finishHandler(this.cmi).catch(error => {
          console.error('Finish handler error:', error);
        });
      }

      this.initialized = false;
      this.setError("0");
      return "true";
    } catch (error) {
      console.error('LMSFinish error:', error);
      this.setError("101");
      return "false";
    }
  };

  public LMSGetValue = (element: string): string => {
    console.log('SCORM 1.2: LMSGetValue called for', element);
    
    if (!this.initialized) {
      this.setError("301"); // Not initialized
      return "";
    }

    const result = getValue12(this.cmi, element);
    if (result.ok) {
      this.setError("0");
      return String(result.value ?? "");
    } else {
      this.setError(result.error!);
      return "";
    }
  };

  public LMSSetValue = (element: string, value: string): string => {
    console.log('SCORM 1.2: LMSSetValue called', element, value);
    
    if (!this.initialized) {
      this.setError("301"); // Not initialized
      return "false";
    }

    const result = setValue12(this.cmi, element, value);
    if (result.ok) {
      this.setError("0");
      return "true";
    } else {
      this.setError(result.error!);
      return "false";
    }
  };

  public LMSCommit = (param: string = ""): string => {
    console.log('SCORM 1.2: LMSCommit called with', param);
    
    if (!this.initialized) {
      this.setError("301"); // Not initialized
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
      console.error('LMSCommit error:', error);
      this.setError("351"); // Commit failure
      return "false";
    }
  };

  public LMSGetLastError = (): string => {
    return this.lastError;
  };

  public LMSGetErrorString = (code: string): string => {
    return ERROR_STRINGS[(code as ErrorCode)] || "Unknown error";
  };

  public LMSGetDiagnostic = (code: string): string => {
    // Return diagnostic information for the error code
    return `Diagnostic information for error ${code}: ${this.LMSGetErrorString(code)}`;
  };

  // Utility methods
  private addTimes(time1: string, time2: string): string {
    const parseTime = (time: string) => {
      const parts = time.split(':');
      return {
        hours: parseInt(parts[0], 10),
        minutes: parseInt(parts[1], 10),
        seconds: parseFloat(parts[2])
      };
    };

    const t1 = parseTime(time1);
    const t2 = parseTime(time2);

    let totalSeconds = t1.seconds + t2.seconds;
    let totalMinutes = t1.minutes + t2.minutes + Math.floor(totalSeconds / 60);
    let totalHours = t1.hours + t2.hours + Math.floor(totalMinutes / 60);

    totalSeconds = totalSeconds % 60;
    totalMinutes = totalMinutes % 60;

    const formatNumber = (num: number, digits: number = 2) => {
      return Math.floor(num).toString().padStart(digits, '0');
    };

    const secondsStr = totalSeconds % 1 === 0 ? 
      formatNumber(totalSeconds) : 
      totalSeconds.toFixed(2).padStart(5, '0');

    return `${formatNumber(totalHours)}:${formatNumber(totalMinutes)}:${secondsStr}`;
  }

  // Get current CMI data (for debugging/inspection)
  public getCMI(): CMI12Data {
    return { ...this.cmi };
  }

  // Reset for new attempt
  public reset(initialData?: Partial<CMI12Data>): void {
    this.initialized = false;
    this.lastError = "0";
    this.cmi = this.createInitialCMI(initialData);
  }
}

// Global API object for SCORM content
export function createScorm12API(
  initialData?: Partial<CMI12Data>,
  handlers?: {
    onCommit?: (cmi: CMI12Data) => Promise<void>;
    onFinish?: (cmi: CMI12Data) => Promise<void>;
  }
) {
  const runtime = new Scorm12Runtime(initialData, handlers);
  
  return {
    LMSInitialize: runtime.LMSInitialize,
    LMSFinish: runtime.LMSFinish,
    LMSGetValue: runtime.LMSGetValue,
    LMSSetValue: runtime.LMSSetValue,
    LMSCommit: runtime.LMSCommit,
    LMSGetLastError: runtime.LMSGetLastError,
    LMSGetErrorString: runtime.LMSGetErrorString,
    LMSGetDiagnostic: runtime.LMSGetDiagnostic,
    // Additional methods for debugging
    getCMI: runtime.getCMI,
    reset: runtime.reset
  };
}