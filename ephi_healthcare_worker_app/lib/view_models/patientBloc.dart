import 'package:equatable/equatable.dart';
import 'patientRepo.dart';
import '../models/patient.dart';
import '../models/patientSymptom.dart';
import '../models/testReport.dart';
import 'dart:async';

class PatientEvent extends Equatable {
  @override
  // TODO: implement props
  List<Object> get props => [];
}

class FetchPatients extends PatientEvent {
  final healthCareWorkerId;
  FetchPatients(this.healthCareWorkerId);
  @override
  // TODO: implement props
  List<Object> get props => [healthCareWorkerId];
}

class FetchPatientDetail extends PatientEvent {
  final patientId;
  FetchPatientDetail(this.patientId);
  @override
  // TODO: implement props
  List<Object> get props => [patientId];
}

class FetchPatientCurrentSymptoms extends PatientEvent {
  final patientId;
  FetchPatientCurrentSymptoms(this.patientId);
  @override
  // TODO: implement props
  List<Object> get props => [patientId];
}

class FetchTestResultHistory extends PatientEvent {
  final patientId;
  FetchTestResultHistory(this.patientId);
  @override
  // TODO: implement props
  List<Object> get props => [patientId];
}

class ReloadPatients extends PatientEvent {}

class PatientBloc {
  bool loading = false;
  List<Patient> patientList = [];
  final _patientStreamController = StreamController<List<Patient>>();
  StreamSink<List<Patient>> get _patientSink => _patientStreamController.sink;
  Stream<List<Patient>> get patientStream => _patientStreamController.stream;

  final _patientDetailStreamController = StreamController<Patient>();
  StreamSink<Patient> get _patientDetailSink =>
      _patientDetailStreamController.sink;
  Stream<Patient> get patientDetailStream =>
      _patientDetailStreamController.stream;

  final _currentSymptomStreamController =
      StreamController<List<PatientSymptom>>();
  StreamSink<List<PatientSymptom>> get _currentSymptomSink =>
      _currentSymptomStreamController.sink;
  Stream<List<PatientSymptom>> get currentSymptomStream =>
      _currentSymptomStreamController.stream;

  final _testResultHistoryStreamController =
      StreamController<List<TestReport>>();
  StreamSink<List<TestReport>> get _testResultHistorySink =>
      _testResultHistoryStreamController.sink;
  Stream<List<TestReport>> get testResultHistoryStream =>
      _testResultHistoryStreamController.stream;

  var _actionStreamController = StreamController<PatientEvent>();
  StreamSink<PatientEvent> get actionSink => _actionStreamController.sink;
  Stream<PatientEvent> get _actionStream => _actionStreamController.stream;

  PatientRepo patientRepo;

  PatientBloc({PatientRepo repo}) {
    patientRepo = repo;
    _actionStream.listen((event) async {
      if (event is FetchPatients) {
        try {
          // patientList =
          //     await patientRepo.getListOfPatients(event.healthCareWorkerId);
          _patientSink.add(patientList);
        } on Exception catch (e) {
          _patientSink.addError("Couldn't connect to server");
        }
      } else if (event is ReloadPatients) {
        patientList = [];
        _patientSink.add(null);
      } else if (event is FetchPatientDetail) {
        Patient patient = await patientRepo.getPatientDetails(event.patientId);
        _patientDetailSink.add(patient);
      } else if (event is FetchPatientCurrentSymptoms) {
        List<PatientSymptom> symptomList =
            await patientRepo.getPatientCurrentSymptom(event.patientId);
        _currentSymptomSink.add(symptomList);
      } else if (event is FetchTestResultHistory) {
        List<TestReport> symptomList =
            await patientRepo.getPatientTestReportHistory(event.patientId);
        _testResultHistorySink.add(symptomList);
      }
    });
  }

  void dispose() {
    _patientStreamController.close();
    _actionStreamController.close();
    _patientDetailStreamController.close();
    _currentSymptomStreamController.close();
    _testResultHistoryStreamController.close();
  }
}
