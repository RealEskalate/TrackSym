//cases list page
import 'package:ephi_healthcare_worker_app/widgets/cardWidget.dart';
import 'package:flutter/material.dart';
import '../../widgets/caseWidget.dart';
import '../../models/case.dart';
import '../../widgets/hexColorGenerator.dart';

class CasesList extends StatefulWidget {
  CasesList({this.scrollController});

  final ScrollController scrollController;

  @override
  CasesListState createState() => CasesListState(this.scrollController);
}

class CasesListState extends State<CasesList> {
  CasesListState(this.scrollController);

  //User user;
  final ScrollController scrollController;

  @override
  void initState() {
    super.initState();
  }

  List<Case> casesList = [
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
                Container(
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                    children: <Widget>[
                      CardWidget(
                          sizeHeight: 0.10,
                          sizeWidth: 0.35,
                          color: Colors.lightBlueAccent[700],
                          value: "1,453",
                          change: "+25",
                          text: "Total Cases",
                          title: "this.title",
                          press: null),
                      CardWidget(
                          sizeHeight: 0.10,
                          sizeWidth: 0.35,
                          color: Colors.greenAccent[700],
                          value: "1,071",
                          change: "+12",
                          text: "Active Cases",
                          title: "this.title",
                          press: null),
                    ],
                  ),
                ),
                SizedBox(height: 15),
                Container(
                    margin: EdgeInsets.symmetric(horizontal: 20),
                    child: Text("Your cases",
                        style: TextStyle(
                          fontSize: 18,
                          color: HexColor("#0a6dc9"),
                        ))),
                SizedBox(height: 10),
                casesList.length == 0
                    ? Container(
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
                                ])))
                    : ListView.builder(
                        //key: animatedListKey,
                        primary: false,
                        shrinkWrap: true,
                        physics: NeverScrollableScrollPhysics(),
                        scrollDirection: Axis.vertical,
                        itemCount: casesList.length,
                        itemBuilder: (BuildContext context, int index) {
                          return CaseWidget(
                            patient_case: casesList[index],
                          );
                        },
                      ),
              ],
            )));
  }
}