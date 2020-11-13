import 'package:equatable/equatable.dart';
import 'statisticsRepo.dart';
import '../models/statistics.dart';
import 'dart:async';

class StatisticsEvent extends Equatable {
  @override
  // TODO: implement props
  List<Object> get props => [];
}

class FetchStats extends StatisticsEvent {
  String healthCareWorkerId;
  FetchStats(String hcwID) {
    healthCareWorkerId = hcwID;
  }
}

class ReloadStats extends StatisticsEvent {}

class Loading extends StatisticsEvent {}

class StatisticsBloc {
  bool loading = false;
  final _statStreamController = StreamController<Statistics>();
  StreamSink<Statistics> get _statSink => _statStreamController.sink;
  Stream<Statistics> get statStream => _statStreamController.stream;

  var _actionStreamController = StreamController<FetchStats>();
  StreamSink<StatisticsEvent> get actionSink => _actionStreamController.sink;
  Stream<StatisticsEvent> get _actionStream => _actionStreamController.stream;

  StatisticsRepo statRepo;

  StatisticsBloc({StatisticsRepo repo}) {
    statRepo = repo;
    _actionStream.listen((event) async {
      if (event is FetchStats) {
        try {
          Statistics stat =
              await statRepo.getStatistics(event.healthCareWorkerId);
          _statSink.add(stat);
        } on Exception catch (e) {
          _statSink.addError("Couldn't connect to server");
        }
      } else if (event is ReloadStats) {
        _statSink.add(null);
      }
    });
  }

  void dispose() {
    _statStreamController.close();
    _actionStreamController.close();
  }
}
