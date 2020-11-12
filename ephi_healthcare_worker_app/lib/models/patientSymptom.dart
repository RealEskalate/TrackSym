class PatientSymptom {
  String id;
  String name;
  String description;
  String relevance;
  String userId;
  String gender;
  String ageGroup;
  String timestamp;
  String symptomId;

  PatientSymptom(
      {this.id,
      this.name,
      this.description,
      this.relevance,
      this.userId,
      this.gender,
      this.ageGroup,
      this.timestamp,
      this.symptomId});
  factory PatientSymptom.fromJson(Map<String, dynamic> json) {
    return PatientSymptom(
      id: json['_id'] as String,
      name: json['Symptom']['name'] as String,
      description: json['Symptom']['description'] as String,
      relevance: json['Symptom']['relevance'] as String,
      userId: json['user_id'] as String,
      gender: json['gender'] as String,
      ageGroup: json['age_group'] as String,
      timestamp: json['timestamp'] as String,
      symptomId: json['symptom_id'] as String,
    );
  }
}
