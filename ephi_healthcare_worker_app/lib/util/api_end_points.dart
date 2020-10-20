//API end points
class CaseEndPoints {
  static String getCases(String healthCareWorkerId) {
    return "https://api.tracksym.app/api/case_investigations/" +
        healthCareWorkerId;
  }

  static String getCaseDetails(String caseId) {
    return "https://api.tracksym.app/api/case_investigations/" + caseId;
  }
}

class SymptomEndPoints {
  static String getSymptoms(String healthCareWorkerId) {
    return "https://api.tracksym.app/api/symptom_statistics/logs?page=1&size=10";
  }

  static String getCurrentSymptoms(String patientId) {
    return "https://api.tracksym.app/api/symptomuser/user/" + patientId;
  }

  static String getSymptomHistory(String patientId) {
    return "https://api.tracksym.app/api/symptomuserhistory/user/" + patientId;
  }
}

class PatientsEndPoints {
  static String getPatients(String healthCareWorkerId) {
    return "https://api.tracksym.app/api/patients/" + healthCareWorkerId;
  }

  static String getPatientDetails(String patientId) {
    return "https://api.tracksym.app/api/patients/" + patientId;
  }
}
