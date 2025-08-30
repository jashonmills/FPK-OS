// SCORM 1.2 API Implementation
export function createScorm12API(initialData: any = {}, handlers: any = {}) {
  let cmiData = { ...initialData };
  let initialized = false;
  let terminated = false;
  let errorCode = "0";
  let errorMessage = "";

  const setError = (code: string, message: string) => {
    errorCode = code;
    errorMessage = message;
  };

  const validateInitialized = () => {
    if (!initialized) {
      setError("301", "Not initialized");
      return false;
    }
    if (terminated) {
      setError("101", "Already terminated");
      return false;
    }
    return true;
  };

  const API = {
    LMSInitialize: (parameter: string) => {
      if (parameter !== "" && parameter !== null) {
        setError("201", "Invalid argument");
        return "false";
      }
      
      if (initialized) {
        setError("101", "Already initialized");
        return "false";
      }

      initialized = true;
      terminated = false;
      setError("0", "No error");
      return "true";
    },

    LMSFinish: (parameter: string) => {
      if (parameter !== "" && parameter !== null) {
        setError("201", "Invalid argument");
        return "false";
      }

      if (!validateInitialized()) {
        return "false";
      }

      terminated = true;
      initialized = false;
      
      // Call finish handler if provided
      if (handlers.onFinish) {
        handlers.onFinish(cmiData);
      }
      
      setError("0", "No error");
      return "true";
    },

    LMSGetValue: (element: string) => {
      if (!validateInitialized()) {
        return "";
      }

      if (!element || typeof element !== 'string') {
        setError("201", "Invalid argument");
        return "";
      }

      // Handle SCORM 1.2 CMI elements
      const value = cmiData[element];
      
      if (value === undefined) {
        // Return appropriate defaults for SCORM 1.2
        switch (element) {
          case "cmi.core.lesson_status":
            return "not attempted";
          case "cmi.core.lesson_location":
            return "";
          case "cmi.core.score.raw":
            return "";
          case "cmi.core.score.max":
            return "100";
          case "cmi.core.score.min":
            return "0";
          case "cmi.core.session_time":
            return "00:00:00";
          case "cmi.core.total_time":
            return "00:00:00";
          case "cmi.suspend_data":
            return "";
          case "cmi.launch_data":
            return "";
          case "cmi.comments":
            return "";
          case "cmi.student_id":
            return "student_001";
          case "cmi.student_name":
            return "Student, Test";
          default:
            setError("401", "Not implemented error");
            return "";
        }
      }

      setError("0", "No error");
      return value.toString();
    },

    LMSSetValue: (element: string, value: string) => {
      if (!validateInitialized()) {
        return "false";
      }

      if (!element || typeof element !== 'string') {
        setError("201", "Invalid argument");
        return "false";
      }

      // Validate writeable elements in SCORM 1.2
      const writeableElements = [
        "cmi.core.lesson_status",
        "cmi.core.lesson_location", 
        "cmi.core.score.raw",
        "cmi.core.score.max",
        "cmi.core.score.min",
        "cmi.core.session_time",
        "cmi.suspend_data",
        "cmi.comments"
      ];

      if (!writeableElements.includes(element)) {
        setError("402", "Invalid set value, element is read only");
        return "false";
      }

      // Validate lesson_status values
      if (element === "cmi.core.lesson_status") {
        const validStatuses = ["passed", "completed", "failed", "incomplete", "browsed", "not attempted"];
        if (!validStatuses.includes(value)) {
          setError("405", "Incorrect data type");
          return "false";
        }
      }

      // Store the value
      cmiData[element] = value;
      setError("0", "No error");
      return "true";
    },

    LMSCommit: (parameter: string) => {
      if (parameter !== "" && parameter !== null) {
        setError("201", "Invalid argument");
        return "false";
      }

      if (!validateInitialized()) {
        return "false";
      }

      // Call commit handler if provided
      if (handlers.onCommit) {
        handlers.onCommit(cmiData);
      }

      setError("0", "No error");
      return "true";
    },

    LMSGetLastError: () => {
      return errorCode;
    },

    LMSGetErrorString: (errorCode: string) => {
      const errorStrings: { [key: string]: string } = {
        "0": "No error",
        "101": "General exception",
        "201": "Invalid argument error",
        "202": "Element cannot have children",
        "203": "Element not an array - cannot have count",
        "301": "Not initialized",
        "401": "Not implemented error",
        "402": "Invalid set value, element is read only",
        "403": "Element is write only",
        "404": "Incorrect data type",
        "405": "Incorrect data type"
      };
      
      return errorStrings[errorCode] || "Unknown error";
    },

    LMSGetDiagnostic: (errorCode: string) => {
      return `SCORM 1.2 API Diagnostic for error ${errorCode}`;
    }
  };

  return API;
}