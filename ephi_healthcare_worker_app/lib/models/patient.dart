class Patient {
  String id;
  String firstName;
  String lastName;
  String phoneNumber;
  String createdAt;
  String updatedAt;
  String dateOfBirth;
  String status;
  List<dynamic> history;
  String email;
  String woreda;
  String userId;
  String language;
  String gender;
  Patient(
      {this.id,
      this.firstName,
      this.lastName,
      this.phoneNumber,
      this.createdAt,
      this.updatedAt,
      this.history,
      this.email,
      this.woreda,
      this.userId,
      this.dateOfBirth,
      this.status,
      this.language,
      this.gender});
  factory Patient.fromJson(Map<String, dynamic> json) {
    return Patient(
      id: json['_id'] as String,
      firstName: json['first_name'] as String,
      gender: json['gender'] as String,
      lastName: json['last_name'] as String,
      phoneNumber: json['phone_number'] as String,
      createdAt: json['created_at'] as String,
      updatedAt: json['updated_at'] as String,
      status: json['status'] as String,
      language: json['language'] as String,
      dateOfBirth: json['dob'] as String,
      //history: List.from(json['history']),
      email: json['email'] as String,
      woreda: json['woreda'] as String,
      userId: json['user_id'] as String,
    );
  }
}
