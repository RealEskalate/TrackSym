class TestReport {
  String id;
  String patientName;
  String patientGender;
  String patientAgeGroup;
  String patientLastSymptomUpdate;
  String patientId;
  String patientCountry;
  String healthCareWorkerName;
  String healthCareWorkerGender;
  String healthCareWorkerAgeGroup;
  String healthCareWorkerId;
  String healthCareWorkerCountry;
  String createdAt;
  String updatedAt;
  String result;
  TestReport({
    this.id,
    this.patientName,
    this.patientGender,
    this.patientAgeGroup,
    this.patientLastSymptomUpdate,
    this.patientId,
    this.patientCountry,
    this.healthCareWorkerName,
    this.healthCareWorkerGender,
    this.healthCareWorkerAgeGroup,
    this.healthCareWorkerCountry,
    this.healthCareWorkerId,
    this.createdAt,
    this.updatedAt,
    this.result,
  });
  factory TestReport.fromJson(Map<String, dynamic> json) {
    return TestReport(
      id: json['_id'] as String,
      patientName: json['user_id']['username'] as String,
      patientId: json['user_id']['id'] as String,
      patientAgeGroup: json['user_id']['age_group'] as String,
      patientGender: json['user_id']['gender'] as String,
      patientCountry: json['user_id']['current_country'] as String,
      patientLastSymptomUpdate:
          json['user_id']['last_symptom_update'] as String,
      healthCareWorkerName: json['healthcare_worker_id']['username'] as String,
      healthCareWorkerId: json['healthcare_worker_id']['_id'] as String,
      healthCareWorkerGender: json['healthcare_worker_id']['gender'] as String,
      healthCareWorkerAgeGroup:
          json['healthcare_worker_id']['age_group'] as String,
      healthCareWorkerCountry:
          json['healthcare_worker_id']['current_country'] as String,
      createdAt: json['created_at'] as String,
      updatedAt: json['updated_at'] as String,
      result: json['test_status'] as String,
    );
  }
}
