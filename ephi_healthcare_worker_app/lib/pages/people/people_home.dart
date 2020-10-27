//cases list page
import 'package:ephi_healthcare_worker_app/widgets/cardWidget.dart';
import 'package:ephi_healthcare_worker_app/widgets/hexColorGenerator.dart';
import 'package:flutter/material.dart';
import '../../widgets/patientCardWidget.dart';
import '../../models/case.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import '../../view_models/patientBloc.dart';
import 'package:flutter/scheduler.dart';

class PatientsHome extends StatefulWidget {
  PatientsHome({this.scrollController});

  final ScrollController scrollController;

  @override
  PatientsHomeState createState() => PatientsHomeState(this.scrollController);
}

class PatientsHomeState extends State<PatientsHome> {
  PatientsHomeState(this.scrollController);

  //User user;
  final ScrollController scrollController;

  @override
  void initState() {
    super.initState();
    // SchedulerBinding.instance.addPostFrameCallback((_) {
    //   BlocProvider.of<PatientBloc>(context).add(FetchPatients(""));
    // });
  }

  List<Case> patientsDemoList = [
    Case(
        patientName: "Michael Mulatu",
        patientPhone: "+251987674521",
        activeSymptoms: "Dry Cough, Ansomia, Fever",
        createdAt: "Jan 19,2020",
        creationTime: "5:30 pm",
        currentTestResult: "Positive"),
    Case(
        patientName: "Daniel Debebe",
        patientPhone: "+251987674521",
        activeSymptoms: "Low Fever, Sneezing,  Dry Cough",
        createdAt: "Jan 20,2020",
        creationTime: "3:30 pm",
        currentTestResult: "Negative"),
    Case(
        patientName: "Sentayehu Natnael",
        patientPhone: "+251987674521",
        activeSymptoms: "High Fever, Ansomia, Sneezing",
        createdAt: "Jan 21,2020",
        creationTime: "4:30 pm",
        currentTestResult: "Positive"),
    Case(
        patientName: "Natnael Hailu",
        patientPhone: "+251987674521",
        activeSymptoms: "Dry Cough, Shivering, Fever",
        createdAt: "Jan 22,2020",
        creationTime: "8:30 pm",
        currentTestResult: "Negative"),
    Case(
        patientName: "Hailu  Merga",
        patientPhone: "+251987674521",
        activeSymptoms: "High Fever, Sneezing, Dry Cough",
        createdAt: "Jan 25,2020",
        creationTime: "7:30 pm",
        currentTestResult: "Positive"),
    Case(
        patientName: "Hailu  Merga",
        patientPhone: "+251987674521",
        activeSymptoms: "High Fever, Sneezing, Dry Cough",
        createdAt: "Jan 25,2020",
        creationTime: "7:30 pm",
        currentTestResult: "Positive"),
    Case(
        patientName: "Natnael  Sisay",
        patientPhone: "+251987674521",
        activeSymptoms: "High Fever, Sneezing, Dry Cough",
        createdAt: "Jan 25,2020",
        creationTime: "7:30 pm",
        currentTestResult: "Positive")
  ];

  @override
  Widget build(BuildContext context) {
    return WillPopScope(
        onWillPop: () {
          Navigator.pop(context);
        },
        child: SafeArea(
            child: Scaffold(
                body: Container(
                    decoration: BoxDecoration(color: HexColor("#F5F9FF")),
                    margin: EdgeInsets.symmetric(horizontal: 5),
                    child: Column(
                      children: <Widget>[
                        mainList(context),
                      ],
                    )))));
  }

  Future<void> refresh() async {}

  mainList(BuildContext context) {
    Size size = MediaQuery.of(context).size;
    return Expanded(
        child: RefreshIndicator(
            onRefresh: refresh,
            child: ListView(
              padding: EdgeInsets.fromLTRB(0.0, size.height * 0.02, 0.0, 0.0),
              children: <Widget>[
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                  children: <Widget>[
                    CardWidget(
                        sizeHeight: 0.10,
                        sizeWidth: 0.41,
                        color: Colors.purple[700],
                        value: "1,453",
                        change: "+25",
                        text: "Total Patients",
                        title: "this.title",
                        press: null),
                    CardWidget(
                        sizeHeight: 0.10,
                        sizeWidth: 0.41,
                        color: Colors.orange[700],
                        value: "1,071",
                        change: "+12",
                        text: "Active Patients",
                        title: "this.title",
                        press: null),
                  ],
                ),
                SizedBox(height: 15),
                Container(
                    child: Text("Your patients",
                        style: TextStyle(
                          fontSize: 16,
                          color: HexColor("#0a6dc9"),
                        ))),
                SizedBox(height: 10),
                BlocBuilder<PatientBloc, PatientState>(
                    builder: (context, state) {
                  if (state is PatientsNotLoaded) {
                    Container(
                        margin: EdgeInsets.only(top: 100),
                        child: Align(
                            alignment: Alignment.center,
                            child: Column(
                                mainAxisAlignment: MainAxisAlignment.center,
                                children: <Widget>[
                                  Icon(Icons.people_outline,
                                      size: 80,
                                      color: Theme.of(context).primaryColor),
                                  Text(
                                      "You haven't been assigned to any case yet!",
                                      style: TextStyle(
                                        fontSize: 22,
                                        color: Theme.of(context).primaryColor,
                                      ))
                                ])));
                  } else if (state is PatientsLoading) {
                    return Center(child: CircularProgressIndicator());
                  } else if (state is PatientsLoaded) {
                    return ListView.builder(
                      //key: animatedListKey,
                      primary: false,
                      shrinkWrap: true,
                      physics: NeverScrollableScrollPhysics(),
                      scrollDirection: Axis.vertical,
                      itemCount: state.patientsList.length,
                      itemBuilder: (BuildContext context, int index) {
                        return PatientCard(
                          patient: state.patientsList[index],
                        );
                      },
                    );
                  } else if (state is PatientError) {
                    return Container(
                        margin: EdgeInsets.only(top: 100),
                        child: Align(
                            alignment: Alignment.center,
                            child: Column(
                                mainAxisAlignment: MainAxisAlignment.center,
                                children: <Widget>[
                                  Icon(Icons.people_outline,
                                      size: 80,
                                      color: Theme.of(context).primaryColor),
                                  Text(
                                      "Sorry,Couldn't connect to Server. Please pull to refresh the page!",
                                      style: TextStyle(
                                        fontSize: 22,
                                        color: Theme.of(context).primaryColor,
                                      ))
                                ])));
                  }
                }),
                SizedBox(height: 20.2),
              ],
            )));
  }
}
