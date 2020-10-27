import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:equatable/equatable.dart';
import 'caseRepo.dart';
import '../models/patientCase.dart';

class CaseEvent extends Equatable {
  @override
  // TODO: implement props
  List<Object> get props => [];
}

class FetchCases extends CaseEvent {
  final healthCareWorkerId;
  FetchCases(this.healthCareWorkerId);
  @override
  // TODO: implement props
  List<Object> get props => [healthCareWorkerId];
}

class ReloadCases extends CaseEvent {}

class CaseState extends Equatable {
  @override
  // TODO: implement props
  List<Object> get props => [];
}

//initial state
class CasesNotLoaded extends CaseState {}

//when cases are being loaded
class CasesLoading extends CaseState {}

//when cases are loaded
class CasesLoaded extends CaseState {
  final List<PatientCase> caseList;
  CasesLoaded(this.caseList);
  @override
  // TODO: implement props
  List<Object> get props => [caseList];
}

//when errors happen
class CasesError extends CaseState {}

//our Bloc
class CaseBloc extends Bloc<CaseEvent, CaseState> {
  final CaseRepo caseRepo;
  CaseBloc(this.caseRepo) : super(CasesNotLoaded());
  @override
  Stream<CaseState> mapEventToState(CaseEvent event) async* {
    // TODO: implement mapEventToState
    if (event is FetchCases) {
      yield CasesLoading();
      //we fetch our cases using our api provider
      try {
        List<PatientCase> caseList =
            caseRepo.getCases(event.healthCareWorkerId);
        yield CasesLoaded(caseList);
      } catch (_) {
        yield CasesError();
      }
    } else if (event is ReloadCases) {
      yield CasesNotLoaded();
    }
  }
}
