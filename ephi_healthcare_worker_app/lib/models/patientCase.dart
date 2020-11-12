class PatientCase {
  String id;
  String patientFirstName;
  String patientLastName;
  String createdAt;
  String updatedAt;
  String patientInfoId;
  String notes;
  String currentNoteDate;
  String currentNote;
  String healthCareWorkerId;
  String userId;
  PatientCase(
      {this.id,
      this.patientFirstName,
      this.patientLastName,
      this.patientInfoId,
      this.createdAt,
      this.updatedAt,
      this.notes,
      this.healthCareWorkerId,
      this.currentNote,
      this.currentNoteDate,
      this.userId});
  factory PatientCase.fromJson(Map<String, dynamic> json) {
    return PatientCase(
      id: json['_id'] as String,
      patientFirstName: json['user_id']['patient_info']['first_name'] as String,
      patientLastName: json['user_id']['patient_info']['last_name'] as String,
      patientInfoId: json['user_id']['patient_info']['_id'] as String,
      userId: json['user_id']['_id'] as String,
      healthCareWorkerId: json['assigned_to']['_id'] as String,
      currentNote: json['current_note']['note'] as String,
      currentNoteDate: json['current_note']['date'] as String,
      createdAt: json['created_at'] as String,
      updatedAt: json['updated_at'] as String,
      notes: json['current_note']['note'] as String,
    );
  }
}
