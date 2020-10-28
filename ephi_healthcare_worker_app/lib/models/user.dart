class User {
  String id;
  String username;
  String gender;
  String ageGroup;
  String currentCountry;
  String email;
  User({
    this.id,
    this.username,
    this.gender,
    this.ageGroup,
    this.currentCountry,
    this.email,
  });
  factory User.fromJson(Map<String, dynamic> json) {
    return User(
      id: json['_id'] as String,
      username: json['username'] as String,
      gender: json['gender'] as String,
      ageGroup: json['age_group'] as String,
      currentCountry: json['current_country'] as String,
      //email: json['email'] as String,
    );
  }
}