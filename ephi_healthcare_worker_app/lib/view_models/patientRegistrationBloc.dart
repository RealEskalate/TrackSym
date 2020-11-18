import 'dart:async';
import 'dart:math';
import 'package:ephi_healthcare_worker_app/models/patient.dart';
import 'package:rxdart/rxdart.dart';
import 'validators.dart';
import 'package:ephi_healthcare_worker_app/view_models/patientRepo.dart';

enum stepperValidate {
  PatientInfoValidate,
  ContactValidate,
  AddressValidate,
}

class FormValues {
  String firstName;
  String lastName;
  String dob;
  int genderIndex;
  bool requireStop;
}

var formValues = FormValues();

class PatientRegistrationBloc with Validators {
  int _myStepsLength = 3;
  int currentStep = 0;

  // Patient Information Tab
  final _firstName = StreamController<String>.broadcast();
  final _lastName = StreamController<String>.broadcast();
  final _dob = PublishSubject<String>();
  final _gender = PublishSubject<int>();

  // Contact Information Tab
  final _phoneNumber = PublishSubject<String>();
  final _email = PublishSubject<String>();

  // Address Tab
  final _address = PublishSubject<String>();

  // StreamController for the counter that controls the stepper
  final _stepCounter = PublishSubject<int>();

  // StreamController for submitting the form
  final _loadingPost = PublishSubject<String>();

  get firstNameStream => _firstName.stream.transform(validateFirstName);
  get lasttNameStream => _lastName.stream.transform(validateLastName);
  get dobStream => _dob.stream;
  get genderStream => _gender.stream.transform(validateGender);

  get phoneNumberStream => _phoneNumber.stream;
  get emailStream => _email.stream;

  get addressStream => _address.stream;
  get stepCounterStream => _stepCounter.stream;
  get loadingPostStream => _loadingPost.stream;

  // Sinks
  Function(String) get addFirstName => _firstName.sink.add;
  Function(String) get addLastName => _lastName.sink.add;
  Function(String) get addDob => _dob.sink.add;
  Function(int) get addGender => _gender.sink.add;
  Function(String) get addPhoneNumber => _phoneNumber.sink.add;
  Function(String) get addEmail => _email.sink.add;
  Function(String) get addAddress => _address.sink.add;

  Function(int) get changeStepCounter => _stepCounter.sink.add;

  final _eventStreamController = StreamController();
  StreamSink get eventSink => _eventStreamController.sink;
  Stream get eventStream => _eventStreamController.stream;

  PatientRegistrationBloc() {
    eventStream.listen((event) {
      if (event == stepperValidate.PatientInfoValidate) {
        validatePatientInfo(_firstName, _lastName, _gender);

        // freeze the continue button if all required
        // are not filled
        if (formValues.requireStop != true) {
          increaseStepCounter();
        }
      }
      if (event == stepperValidate.ContactValidate) {
        increaseStepCounter();
      }
      if (event == stepperValidate.AddressValidate) {
        _loadingPost.sink.add("Loading");
        submitForm();
        _stepCounter.sink.add(0);
      }
    });
  }

  void increaseStepCounter() {
    print("currentStep => $currentStep");
    currentStep = min(_myStepsLength - 1, currentStep + 1);
    _stepCounter.sink.add(currentStep);
  }

  void decreaseStepCounter() {
    currentStep = max(0, currentStep - 1);
    _stepCounter.sink.add(currentStep);
  }

  void changeStep(int new_step) {
    // currentStep = new_step;
    _stepCounter.sink.add(currentStep);
  }

  void changeGenderCard(index) {
    formValues.genderIndex = index;
    _gender.sink.add(formValues.genderIndex);
  }

  String getGender(int index) {
    List<String> genderChoice = ['MALE', 'FEMALE', 'UNDISCLOSED'];
    return genderChoice[index];
  }

  void submitForm() async {
    String gender = getGender(formValues.genderIndex);
    // final Logic and http post request after pushing loading screen here
    final newPatient = Patient(
      firstName: formValues.firstName,
      lastName: formValues.lastName,
      dateOfBirth: formValues.dob,
      gender: gender,
    );

    // await post htttp request
    try {
      await PatientRepo.registerPatient(newPatient);
      _loadingPost.sink.add("Completed");
    } on Exception catch (e) {
      _loadingPost.addError("Couldn't connect to server");
    }
  }

  void dispose() {
    _firstName.close();
    _lastName.close();
    _dob.close();
    _gender.close();
    _phoneNumber.close();
    _email.close();
    _address.close();
    _eventStreamController.close();
    _stepCounter.close();
    _loadingPost.close();

    // The dispose function doesn't seem to
    // reset formValues so tried to instantiate a new instance
    // to delete the info after the page is destroyed
    formValues = new FormValues();
  }
}
