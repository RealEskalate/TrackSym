class Statistics {
  int totalPatientCount;
  int totalPatientChange;
  int recoveredCount;
  int recoveredChange;
  int confirmedCount;
  int confirmedChange;
  int diedCount;
  int diedChange;
  int activeSymptomsCount;
  Statistics(
      {this.totalPatientChange,
      this.totalPatientCount,
      this.recoveredChange,
      this.recoveredCount,
      this.confirmedCount,
      this.confirmedChange,
      this.diedChange,
      this.diedCount,
      this.activeSymptomsCount});
  factory Statistics.fromJson(Map<String, dynamic> json) {
    return Statistics(
      totalPatientChange: json['total']['change'] as int,
      totalPatientCount: json['total']['count'] as int,
      recoveredChange: json['Recovered']['change'] as int,
      recoveredCount: json['Recovered']['count'] as int,
      confirmedChange: json['Confirmed']['change'] as int,
      confirmedCount: json['Confirmed']['count'] as int,
      diedCount: json['Died']['count'] as int,
      diedChange: json['Died']['change'] as int,
      activeSymptomsCount: json['active_symptoms']['count'] as int,
    );
  }
}
