import 'package:equatable/equatable.dart';
import 'patientRepo.dart';
import '../models/patient.dart';
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

class ReloadPatients extends PatientEvent {}

class PatientBloc {
  bool loading = false;
  List<Patient> patientList = [];
  final _patientStreamController = StreamController<List<Patient>>();
  StreamSink<List<Patient>> get _patientSink => _patientStreamController.sink;
  Stream<List<Patient>> get patientStream => _patientStreamController.stream;

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
      }
    });
  }

  void dispose() {
    _patientStreamController.close();
    _actionStreamController.close();
  }
}
