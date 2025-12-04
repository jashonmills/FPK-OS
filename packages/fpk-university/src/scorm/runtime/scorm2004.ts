// SCORM 2004 API Implementation
export function createScorm2004API(initialData: any = {}, handlers: any = {}) {
  const cmiData = { ...initialData };
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
      setError("142", "Termination before initialization");
      return false;
    }
    if (terminated) {
      setError("143", "Termination after termination");
      return false;
    }
    return true;
  };

  const API_1484_11 = {
    Initialize: (parameter: string) => {
      if (parameter !== "" && parameter !== null) {
        setError("201", "General argument error");
        return "false";
      }
      
      if (initialized) {
        setError("103", "Already initialized");
        return "false";
      }

      initialized = true;
      terminated = false;
      setError("0", "No error");
      return "true";
    },

    Terminate: (parameter: string) => {
      if (parameter !== "" && parameter !== null) {
        setError("201", "General argument error");
        return "false";
      }

      if (!validateInitialized()) {
        return "false";
      }

      terminated = true;
      initialized = false;
      
      // Call terminate handler if provided
      if (handlers.onTerminate) {
        handlers.onTerminate(cmiData);
      }
      
      setError("0", "No error");
      return "true";
    },

    GetValue: (element: string) => {
      if (!validateInitialized()) {
        return "";
      }

      if (!element || typeof element !== 'string') {
        setError("201", "General argument error");
        return "";
      }

      // Handle SCORM 2004 CMI elements
      const value = cmiData[element];
      
      if (value === undefined) {
        // Return appropriate defaults for SCORM 2004
        switch (element) {
          case "cmi.completion_status":
            return "incomplete";
          case "cmi.success_status":
            return "unknown";
          case "cmi.location":
            return "";
          case "cmi.score.raw":
            return "";
          case "cmi.score.max":
            return "100";
          case "cmi.score.min":
            return "0";
          case "cmi.score.scaled":
            return "";
          case "cmi.session_time":
            return "PT0H0M0S";
          case "cmi.total_time":
            return "PT0H0M0S";
          case "cmi.suspend_data":
            return "";
          case "cmi.launch_data":
            return "";
          case "cmi.learner_id":
            return "learner_001";
          case "cmi.learner_name":
            return "Learner, Test";
          case "cmi.mode":
            return "normal";
          case "cmi.credit":
            return "credit";
          case "cmi.entry":
            return "ab-initio";
          case "cmi.progress_measure":
            return "";
          default:
            setError("401", "Undefined data model element");
            return "";
        }
      }

      setError("0", "No error");
      return value.toString();
    },

    SetValue: (element: string, value: string) => {
      if (!validateInitialized()) {
        return "false";
      }

      if (!element || typeof element !== 'string') {
        setError("201", "General argument error");
        return "false";
      }

      // Validate writeable elements in SCORM 2004
      const writeableElements = [
        "cmi.completion_status",
        "cmi.success_status",
        "cmi.location", 
        "cmi.score.raw",
        "cmi.score.max",
        "cmi.score.min",
        "cmi.score.scaled",
        "cmi.session_time",
        "cmi.suspend_data",
        "cmi.progress_measure",
        "cmi.exit"
      ];

      if (!writeableElements.includes(element)) {
        setError("404", "Data model element not writeable");
        return "false";
      }

      // Validate completion_status values
      if (element === "cmi.completion_status") {
        const validStatuses = ["completed", "incomplete", "not_attempted", "unknown"];
        if (!validStatuses.includes(value)) {
          setError("406", "Data model element type mismatch");
          return "false";
        }
      }

      // Validate success_status values
      if (element === "cmi.success_status") {
        const validStatuses = ["passed", "failed", "unknown"];
        if (!validStatuses.includes(value)) {
          setError("406", "Data model element type mismatch");
          return "false";
        }
      }

      // Validate score.scaled (must be between -1 and 1)
      if (element === "cmi.score.scaled") {
        const scaledValue = parseFloat(value);
        if (isNaN(scaledValue) || scaledValue < -1 || scaledValue > 1) {
          setError("407", "Data model element value out of range");
          return "false";
        }
      }

      // Store the value
      cmiData[element] = value;
      setError("0", "No error");
      return "true";
    },

    Commit: (parameter: string) => {
      if (parameter !== "" && parameter !== null) {
        setError("201", "General argument error");
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

    GetLastError: () => {
      return errorCode;
    },

    GetErrorString: (errorCode: string) => {
      const errorStrings: { [key: string]: string } = {
        "0": "No error",
        "101": "General exception",
        "102": "General initialization failure",
        "103": "Already initialized",
        "104": "Content instance terminated",
        "111": "General termination failure",
        "112": "Termination before initialization",
        "113": "Termination after termination",
        "122": "Retrieve data before initialization",
        "123": "Retrieve data after termination",
        "132": "Store data before initialization",
        "133": "Store data after termination",
        "142": "Commit before initialization",
        "143": "Commit after termination",
        "201": "General argument error",
        "301": "General get failure",
        "351": "General set failure",
        "391": "General commit failure",
        "401": "Undefined data model element",
        "402": "Unimplemented data model element",
        "403": "Data model element value not initialized",
        "404": "Data model element is read only",
        "405": "Data model element is write only",
        "406": "Data model element type mismatch",
        "407": "Data model element value out of range",
        "408": "Data model dependency not established"
      };
      
      return errorStrings[errorCode] || "Unknown error";
    },

    GetDiagnostic: (errorCode: string) => {
      return `SCORM 2004 API Diagnostic for error ${errorCode}`;
    }
  };

  return API_1484_11;
}