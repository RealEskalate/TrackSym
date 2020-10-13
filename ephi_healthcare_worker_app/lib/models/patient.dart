class Patient {
  String id;
  String firstName;
  String lastName;
  String phoneNumber;
  String createdAt;
  String updatedAt;
  bool smsStatus;
  String status;
  List<dynamic> history;
  String emergencyContactFirstName;
  String emergencyContactLastName;
  String emergencyContactRelationship;
  String emergencyContactCity;
  String emergencyContactPhoneNumber;
  Patient(
      {this.id,
      this.firstName,
      this.lastName,
      this.phoneNumber,
      this.createdAt,
      this.updatedAt,
      this.history,
      this.emergencyContactCity,
      this.emergencyContactFirstName,
      this.emergencyContactLastName,
      this.emergencyContactRelationship,
      this.emergencyContactPhoneNumber,
      this.smsStatus,
      this.status});
  factory Patient.fromJson(Map<String, dynamic> json) {
    return Patient(
      id: json['_id'] as String,
      firstName: json['first_name'] as String,
      lastName: json['last_name'] as String,
      phoneNumber: json['phone_number'] as String,
      createdAt: json['created_at'] as String,
      updatedAt: json['updated_at'] as String,
      status: json['status'] as String,
      smsStatus: json['sms_status'] as bool,
      //history: List.from(json['history']),
      emergencyContactFirstName:
          json['emergency_contact']['first_name'] as String,
      emergencyContactLastName:
          json['emergency_contact']['last_name'] as String,
      emergencyContactRelationship:
          json['emergency_contact']['relationship'] as String,
      emergencyContactCity: json['emergency_contact']['city'] as String,
      emergencyContactPhoneNumber:
          json['emergency_contact']['phone_number'] as String,
    );
  }
}
