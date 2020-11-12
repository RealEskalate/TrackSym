class TestReport {
  String id;
  String userId;
  String healthCareWorkerName;
  String healthCareWorkerGender;
  String healthCareWorkerAgeGroup;
  String healthCareWorkerId;
  String healthCareWorkerCountry;
  String createdAt;
  String updatedAt;
  String testStatus;
  TestReport({
    this.id,
    this.healthCareWorkerName,
    this.healthCareWorkerGender,
    this.healthCareWorkerAgeGroup,
    this.healthCareWorkerCountry,
    this.healthCareWorkerId,
    this.createdAt,
    this.updatedAt,
    this.testStatus,
  });
  factory TestReport.fromJson(Map<String, dynamic> json) {
    return TestReport(
      id: json['_id'] as String,
      healthCareWorkerName: json['healthcare_worker_id']['username'] as String,
      healthCareWorkerId: json['healthcare_worker_id']['_id'] as String,
      healthCareWorkerGender: json['healthcare_worker_id']['gender'] as String,
      healthCareWorkerAgeGroup:
          json['healthcare_worker_id']['age_group'] as String,
      healthCareWorkerCountry:
          json['healthcare_worker_id']['current_country'] as String,
      createdAt: json['created_at'] as String,
      updatedAt: json['updated_at'] as String,
      testStatus: json['test_status'] as String,
    );
  }
}
