import 'package:ephi_healthcare_worker_app/widgets/ChartWidget.dart';

import '../../widgets/cardWidget.dart';
import '../../widgets/hexColorGenerator.dart';
import 'package:fl_chart/fl_chart.dart';
import 'package:flutter/material.dart';
import '../../view_models/statisticsBloc.dart';
import '../../view_models/statisticsRepo.dart';
import 'package:shared_preferences/shared_preferences.dart';

class HomePage extends StatefulWidget {
  @override
  _HomePageState createState() => _HomePageState();
}

class _HomePageState extends State<HomePage> {
  StatisticsBloc statisticsBloc = StatisticsBloc(repo: StatisticsRepo());

  @override
  void initState() {
    super.initState();
    populateData();

    // SchedulerBinding.instance.addPostFrameCallback((_) {
    //   BlocProvider.of<CaseBloc>(context).add(FetchCases(""));
    // });
  }

  populateData() async {
    SharedPreferences prefs = await SharedPreferences.getInstance();
    statisticsBloc.actionSink.add(FetchStats(prefs.getString('UserId')));
  }

  @override
  void dispose() {
    // TODO: impleme nt dispose
    super.dispose();
    statisticsBloc.dispose();
  }

  Future<void> refresh() async {
    SharedPreferences prefs = await SharedPreferences.getInstance();
    statisticsBloc.actionSink.add(ReloadStats());
    statisticsBloc.actionSink.add(FetchStats(prefs.getString('UserId')));
  }

  @override
  Widget build(BuildContext context) {
    Size size = MediaQuery.of(context).size;
    return Container(
        decoration: BoxDecoration(
            color: HexColor("#F5F9FF")), // 0xff ... color hex code
        child: RefreshIndicator(
            onRefresh: refresh,
            child: StreamBuilder(
                stream: statisticsBloc.statStream,
                builder: (context, snapshot) {
                  if (snapshot.data == null) {
                    return Center(child: CircularProgressIndicator());
                  } else if (snapshot.hasData) {
                    return ListView(
                      padding: EdgeInsets.fromLTRB(
                          0.0, size.height * 0.02, 0.0, 0.0),
                      children: <Widget>[
                        Container(
                          margin: EdgeInsets.symmetric(horizontal: 20),
                          child: Text("Your Covid Trends",
                              style: TextStyle(
                                color: HexColor("#0a6dc9"),
                                fontSize: 18.0,
                              )),
                        ),
                        SizedBox(height: size.height * 0.02),
                        Row(
                          mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                          children: <Widget>[
                            CardWidget(
                                sizeHeight: 0.15,
                                sizeWidth: 0.25,
                                color: Colors.lightBlueAccent[700],
                                iconPath: "assets/images/covid.png",
                                value:
                                    snapshot.data.totalPatientCount.toString(),
                                change: "+" +
                                    snapshot.data.totalPatientChange.toString(),
                                text: "Covid+",
                                title: "this.title",
                                press: null),
                            CardWidget(
                                sizeHeight: 0.15,
                                sizeWidth: 0.25,
                                color: Colors.green,
                                iconPath: "assets/images/recovered.png",
                                value: snapshot.data.recoveredCount.toString(),
                                change: "+" +
                                    snapshot.data.recoveredChange.toString(),
                                text: "Recovered",
                                title: "this.title",
                                press: null),
                            CardWidget(
                                sizeHeight: 0.15,
                                sizeWidth: 0.25,
                                color: Colors.red[300],
                                iconPath: "assets/images/deceased.png",
                                value: snapshot.data.diedCount.toString(),
                                change:
                                    "+" + snapshot.data.diedChange.toString(),
                                text: "Deceased",
                                title: "this.title",
                                press: null),
                          ],
                        ),
                        SizedBox(height: size.height * 0.01),
                        Row(
                          mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                          children: <Widget>[
                            CardWidget(
                                sizeHeight: 0.15,
                                sizeWidth: 0.35,
                                color: Colors.orange[800],
                                iconPath: "assets/images/cases.png",
                                value: snapshot.data.confirmedCount.toString(),
                                change: "+" +
                                    snapshot.data.confirmedChange.toString(),
                                text: "Active Cases",
                                title: "this.title",
                                press: null),
                            CardWidget(
                                sizeHeight: 0.15,
                                sizeWidth: 0.35,
                                color: Colors.purple,
                                iconPath: "assets/images/symptoms.png",
                                value: snapshot.data.activeSymptomsCount
                                    .toString(),
                                change: "",
                                text: "Active Symptoms",
                                title: "this.title",
                                press: null),
                          ],
                        ),
                        SizedBox(height: size.height * 0.03),
                        Container(
                          margin: EdgeInsets.symmetric(horizontal: 20),
                          child: Text("Your patients' recovery so far",
                              style: TextStyle(
                                color: HexColor("#0a6dc9"),
                                fontSize: 18.0,
                              )),
                        ),
                        LineChartSample2(),
                      ],
                    );
                  }
                })));
  }
}
