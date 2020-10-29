import 'package:equatable/equatable.dart';
import 'caseRepo.dart';
import '../models/patientCase.dart';
import 'dart:async';

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

class ReloadCases extends CaseEvent {
  final healthCareWorkerId;
  ReloadCases(this.healthCareWorkerId);
  @override
  // TODO: implement props
  List<Object> get props => [healthCareWorkerId];
}

class CaseBloc {
  bool loading = false;
  List<PatientCase> caseList = [];
  final _caseStreamController = StreamController<List<PatientCase>>();
  StreamSink<List<PatientCase>> get _caseSink => _caseStreamController.sink;
  Stream<List<PatientCase>> get caseStream => _caseStreamController.stream;

  var _actionStreamController = StreamController<CaseEvent>();
  StreamSink<CaseEvent> get actionSink => _actionStreamController.sink;
  Stream<CaseEvent> get _actionStream => _actionStreamController.stream;

  CaseRepo caseRepo;

  CaseBloc({CaseRepo repo}) {
    caseRepo = repo;
    _actionStream.listen((event) async {
      if (event is FetchCases) {
        try {
          caseList = await caseRepo.getCases(event.healthCareWorkerId);
          _caseSink.add(caseList);
        } on Exception catch (e) {
          _caseSink.addError("Couldn't connect to server");
        }
      } else if (event is ReloadCases) {
        caseList = [];
        _caseSink.add(null);
      }
    });
  }

  void dispose() {
    _caseStreamController.close();
    _actionStreamController.close();
  }
}
