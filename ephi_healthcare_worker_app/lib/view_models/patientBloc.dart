import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:equatable/equatable.dart';
import 'patientRepo.dart';
import '../models/patient.dart';

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

class PatientState extends Equatable {
  @override
  // TODO: implement props
  List<Object> get props => [];
}

//initial state
class PatientsNotLoaded extends PatientState {}

//when cases are being loaded
class PatientsLoading extends PatientState {}

//when cases are loaded
class PatientsLoaded extends PatientState {
  final List<Patient> patientsList;
  PatientsLoaded(this.patientsList);
  @override
  // TODO: implement props
  List<Object> get props => [patientsList];
}

//when errors happen
class PatientError extends PatientState {}

//our Bloc
class PatientBloc extends Bloc<PatientEvent, PatientState> {
  final PatientRepo patientRepo;
  PatientBloc(this.patientRepo) : super(PatientsNotLoaded());
  @override
  Stream<PatientState> mapEventToState(PatientEvent event) async* {
    // TODO: implement mapEventToState
    if (event is FetchPatients) {
      yield PatientsLoading();
      //we fetch our cases using our api provider
      try {
        List<Patient> caseList =
            patientRepo.getListOfPatients(event.healthCareWorkerId);
        yield PatientsLoaded(caseList);
      } catch (_) {
        yield PatientError();
      }
    } else if (event is ReloadPatients) {
      yield PatientsNotLoaded();
    }
  }
}
