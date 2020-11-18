//API end points
class UserEndPoints {
  static String getSignInEndpoint() {
    return "https://a2sv-api-wtupbmwpnq-uc.a.run.app/api/auth/login?demo=true";
  }
}

class StatisticsEndPoints {
  static String getTotalStats(String healthCareWorkerId) {
    return "https://a2sv-api-wtupbmwpnq-uc.a.run.app/api/case_investigations/status_count/?assigned_to=" +
        healthCareWorkerId +
        "&demo=true";
  }
}

class CaseEndPoints {
  static String getCases(String healthCareWorkerId) {
    return "https://a2sv-api-wtupbmwpnq-uc.a.run.app/api/case_investigations?demo=true&assignee=" +
        healthCareWorkerId;
  }

  static String getCaseDetails(String caseId) {
    return "https://a2sv-api-wtupbmwpnq-uc.a.run.app/api/case_investigations/" +
        caseId;
  }
}

class SymptomEndPoints {
  static String getSymptomActivity(String healthCareWorkerId) {
    return "https://a2sv-api-wtupbmwpnq-uc.a.run.app/api/symptom_statistics/logs/assigned_to/" +
        healthCareWorkerId +
        "?demo=true&start_date=2020-10-11";
  }

  static String getSymptoms(String healthCareWorkerId) {
    return "https://a2sv-api-wtupbmwpnq-uc.a.run.app/api/symptom_statistics/logs?page=1&size=10";
  }

  static String getCurrentSymptoms(String patientId) {
    return "https://a2sv-api-wtupbmwpnq-uc.a.run.app/api/symptomuser/user/" +
        patientId;
  }

  static String getSymptomHistory(String patientId) {
    return "https://a2sv-api-wtupbmwpnq-uc.a.run.app/api/symptomuserhistory/user/" +
        patientId;
  }
}

class PatientsEndPoints {
  static String getPatientDetails(String patientId) {
    // return "https://a2sv-api-wtupbmwpnq-uc.a.run.app/api/patients/5f9b87bffd32b93334d70ac1?demo=true";
    return "https://a2sv-api-wtupbmwpnq-uc.a.run.app/api/patients/" +
        patientId +
        "?demo=true";
  }

  static String getPatientCurrentSymptoms(String patientId) {
    return "https://a2sv-api-wtupbmwpnq-uc.a.run.app/api/symptomuser/user/" +
        patientId +
        "?demo=true";
  }

  static String getPatientTestReportHistory(String patientId) {
    return "https://a2sv-api-wtupbmwpnq-uc.a.run.app/api/test-report?user_id=" +
        patientId +
        "&demo=true";
  }

  static String getPatientSymptomHistory(String patientId) {
    return "https://a2sv-api-wtupbmwpnq-uc.a.run.app/api/patients/" +
        patientId +
        "?demo=true";
  }

  static String registerNewPatient() {
    return "https://a2sv-api-wtupbmwpnq-uc.a.run.app/api/patients/?demo=true";
  }
}
