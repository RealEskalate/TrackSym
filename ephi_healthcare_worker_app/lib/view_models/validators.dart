import 'dart:async';
import 'package:rxdart/rxdart.dart';
import 'package:ephi_healthcare_worker_app/view_models/patientRegistrationBloc.dart';

class Validators {
  final validateFirstName = StreamTransformer<String, String>.fromHandlers(
      handleData: (firstName, sink) {
    if (firstName != null && firstName.length > 0) {
      sink.add(firstName);
      formValues.firstName = firstName;
    } else {
      formValues.firstName = "";
      sink.addError("Required");
    }
  });

  final validateLastName = StreamTransformer<String, String>.fromHandlers(
      handleData: (lastName, sink) {
    if (lastName != null && lastName.length > 0) {
      sink.add(lastName);
      formValues.lastName = lastName;
    } else {
      formValues.lastName = "";
      sink.addError("Required");
    }
  });

  final validateGender =
      StreamTransformer<int, int>.fromHandlers(handleData: (gender, sink) {
    if (gender != null) {
      sink.add(gender);
      formValues.genderIndex = gender;
    } else {
      sink.addError("Required");
    }
  });

  bool validatePatientInfo(StreamController firstName,
      StreamController lastName, PublishSubject gender) {
    bool valid = true;

    if (formValues.firstName == null || formValues.firstName.length == 0) {
      firstName.addError("Required");
      valid = false;
    }
    if (formValues.lastName == null || formValues.lastName.length == 0) {
      lastName.addError("Required");
      valid = false;
    }
    if (formValues.genderIndex == null) {
      valid = false;
      gender.sink.addError("Required");
    }

    if (valid) {
      formValues.requireStop = false;
    } else {
      // Stops a user from going to the
      // next form tab before filling required inputs
      formValues.requireStop = true;
    }
    return valid;
  }
}
