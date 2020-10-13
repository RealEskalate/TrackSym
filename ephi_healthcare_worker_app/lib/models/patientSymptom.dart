class PatientSymptom {
  String id;
  String name;
  String description;
  String relevance;
  PatientSymptom({
    this.id,
    this.name,
    this.description,
    this.relevance,
  });
  factory PatientSymptom.fromJson(Map<String, dynamic> json) {
    return PatientSymptom(
      id: json['_id'] as String,
      name: json['name'] as String,
      description: json['description'] as String,
      relevance: json['relevance'] as String,
    );
  }
}
