class PatientSymptomActivity {
  String id;
  String status;
  String patientFirstName;
  String patientLastName;
  String date;
  PatientSymptomActivity(
      {this.id,
      this.status,
      this.patientFirstName,
      this.patientLastName,
      this.date});
  factory PatientSymptomActivity.fromJson(Map<String, dynamic> json) {
    return PatientSymptomActivity(
        id: json['_id'] as String,
        status: json['status'] as String,
        patientFirstName:
            json['user_id']['patient_info']['first_name'] as String,
        patientLastName: json['user_id']['patient_info']['last_name'] as String,
        date: json['current_symptoms']['date'] as String);
  }
}
