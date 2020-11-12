// test result history of a person page
import 'package:flutter/material.dart';
import '../../widgets/hexColorGenerator.dart';
import '../../view_models/patientBloc.dart';
import '../../view_models/patientRepo.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:intl/intl.dart' as intl;

class TestResultHistoryAppBar extends StatefulWidget {
  String patientId;
  TestResultHistoryAppBar({this.patientId});
  @override
  _TestResultHistoryAppBarState createState() =>
      _TestResultHistoryAppBarState(patientId: patientId);
}

class _TestResultHistoryAppBarState extends State<TestResultHistoryAppBar> {
  String patientId;
  _TestResultHistoryAppBarState({this.patientId});
  @override
  Widget build(BuildContext context) {
    //SystemChrome.setSystemUIOverlayStyle(SystemUiOverlayStyle.dark.copyWith(statusBarColor: Colors.green));
    return Scaffold(
      appBar: AppBar(
        title: Text("Test Result History"),
        leading: IconButton(
          icon: Icon(Icons.arrow_back),
          onPressed: () {},
        ),
      ),
      body: TestResultHistory(),
    );
  }
}

class TestResultHistory extends StatefulWidget {
  String patientId;
  TestResultHistory({this.patientId});
  @override
  _TestResultHistoryState createState() =>
      _TestResultHistoryState(patientId: patientId);
}

class _TestResultHistoryState extends State<TestResultHistory> {
  //
  String patientId;
  _TestResultHistoryState({this.patientId});

  PatientBloc patientBloc = new PatientBloc(repo: PatientRepo());
  @override
  void initState() {
    super.initState();
    populateData();
  }

  populateData() {
    patientBloc.actionSink.add(FetchTestResultHistory(patientId));
  }

  @override
  Widget build(BuildContext context) {
    Size size = MediaQuery.of(context).size;
    return Scaffold(
      appBar: AppBar(
        elevation: 1,
        backgroundColor: Colors.white,
        title: Center(
          child: Text(
            "Test Report History",
            style: TextStyle(
              color: Colors.black,
            ),
          ),
        ),
        leading: IconButton(
          icon: Icon(Icons.arrow_back),
          iconSize: 30.0,
          color: Colors.black,
          onPressed: () {
            Navigator.pop(context);
          },
        ),
      ),
      body: Container(
          height: size.height,
          decoration: BoxDecoration(
            color: HexColor("#F5F9FF"),
          ),
          child: StreamBuilder(
              stream: patientBloc.testResultHistoryStream,
              builder: (context, snapshot) {
                if (snapshot.data == null) {
                  return Center(child: CircularProgressIndicator());
                } else if (snapshot.hasData) {
                  return ListView(children: <Widget>[
                    Container(
                      width: MediaQuery.of(context).size.width,
                      decoration: BoxDecoration(
                        color: Colors.transparent,
                      ),
                      padding: EdgeInsets.symmetric(
                          horizontal: 15.0, vertical: 10.0),
                      child: Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: <Widget>[
                          Row(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: <Widget>[
                              Container(
                                alignment: Alignment.center,
                                padding: EdgeInsets.symmetric(
                                    horizontal: 10.0, vertical: 10.0),
                                child: Text("Report Date",
                                    style: TextStyle(color: Colors.black)),
                              ),
                              SizedBox(
                                width: 5.0,
                              ),
                            ],
                          ),
                          Container(
                            alignment: Alignment.center,
                            padding: EdgeInsets.symmetric(
                                horizontal: 10.0, vertical: 10.0),
                            child: Text("Result",
                                style: TextStyle(color: Colors.black)),
                          ),
                        ],
                      ),
                    ),
                    ListView.builder(
                      itemCount: snapshot.data.length,
                      scrollDirection: Axis.vertical,
                      primary: false,
                      shrinkWrap: true,
                      physics: NeverScrollableScrollPhysics(),
                      itemBuilder: (BuildContext context, int index) =>
                          Container(
                        width: MediaQuery.of(context).size.width,
                        padding: EdgeInsets.symmetric(
                            horizontal: 5.0, vertical: 5.0),
                        child: Card(
                          elevation: 2.0,
                          shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(15.0),
                          ),
                          child: Container(
                            width: MediaQuery.of(context).size.width,
                            padding: EdgeInsets.symmetric(
                                horizontal: 10.0, vertical: 10.0),
                            child: Row(
                              mainAxisAlignment: MainAxisAlignment.spaceBetween,
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: <Widget>[
                                Row(
                                  crossAxisAlignment: CrossAxisAlignment.start,
                                  children: <Widget>[
                                    Container(
                                      alignment: Alignment.center,
                                      padding: EdgeInsets.symmetric(
                                          horizontal: 10.0, vertical: 10.0),
                                      child: Text(
                                          new intl.DateFormat("MMM d, yyyy")
                                              .format(DateTime.parse(snapshot
                                                  .data[index].updatedAt)),
                                          style:
                                              TextStyle(color: Colors.black)),
                                    ),
                                    SizedBox(
                                      width: 5.0,
                                    ),
                                  ],
                                ),
                                Container(
                                  alignment: Alignment.center,
                                  padding: EdgeInsets.symmetric(
                                      horizontal: 10.0, vertical: 10.0),
                                  child: Text(snapshot.data[index].testStatus,
                                      style: TextStyle(color: Colors.black)),
                                ),
                              ],
                            ),
                          ),
                        ),
                      ),
                    ),
                  ]);
                }
              })),
    );
  }
}
