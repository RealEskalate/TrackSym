import 'package:equatable/equatable.dart';
import 'symptomRepo.dart';
import '../models/patientSymptomActivity.dart';
import 'dart:async';

class SymptomActivityEvent extends Equatable {
  @override
  // TODO: implement props
  List<Object> get props => [];
}

class FetchActivity extends SymptomActivityEvent {
  final healthCareWorkerId;
  FetchActivity(this.healthCareWorkerId);
  @override
  // TODO: implement props
  List<Object> get props => [healthCareWorkerId];
}

class ReloadActivities extends SymptomActivityEvent {
  final healthCareWorkerId;
  ReloadActivities(this.healthCareWorkerId);
  @override
  // TODO: implement props
  List<Object> get props => [healthCareWorkerId];
}

class SymptomActivityBloc {
  bool loading = false;
  List<PatientSymptomActivity> caseList = [];
  final _activityStreamController =
      StreamController<List<PatientSymptomActivity>>();
  StreamSink<List<PatientSymptomActivity>> get _activitySink =>
      _activityStreamController.sink;
  Stream<List<PatientSymptomActivity>> get activityStream =>
      _activityStreamController.stream;

  var _actionStreamController = StreamController<SymptomActivityEvent>();
  StreamSink<SymptomActivityEvent> get actionSink =>
      _actionStreamController.sink;
  Stream<SymptomActivityEvent> get _actionStream =>
      _actionStreamController.stream;

  SymptomRepo symptomRepo;

  SymptomActivityBloc({SymptomRepo repo}) {
    symptomRepo = repo;
    _actionStream.listen((event) async {
      if (event is FetchActivity) {
        try {
          caseList =
              await symptomRepo.getSymptomActivities(event.healthCareWorkerId);
          _activitySink.add(caseList);
        } on Exception catch (e) {
          _activitySink.addError("Couldn't connect to server");
        }
      } else if (event is ReloadActivities) {
        caseList = [];
        _activitySink.add(null);
      }
    });
  }

  void dispose() {
    _activityStreamController.close();
    _actionStreamController.close();
  }
}
