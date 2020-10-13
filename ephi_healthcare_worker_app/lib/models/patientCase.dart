class PatientCase {
  String id;
  String patientFirstName;
  String patientLastName;
  String createdAt;
  String updatedAt;
  String notes;
  PatientCase({
    this.id,
    this.patientFirstName,
    this.patientLastName,
    this.createdAt,
    this.updatedAt,
    this.notes,
  });
  factory PatientCase.fromJson(Map<String, dynamic> json) {
    return PatientCase(
      id: json['_id'] as String,
      patientFirstName: json['patient_id']['first_name'] as String,
      patientLastName: json['patient_id']['last_name'] as String,
      createdAt: json['created_at'] as String,
      updatedAt: json['updated_at'] as String,
      notes: json['notes'] as String,
    );
  }
}
