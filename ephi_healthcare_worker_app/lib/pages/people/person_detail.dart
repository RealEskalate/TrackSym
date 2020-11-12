// detail view page for cases and symptoms from symptom view page
//cases list page
import 'package:ephi_healthcare_worker_app/pages/symptoms/symptom_history.dart';
import 'package:ephi_healthcare_worker_app/widgets/hexColorGenerator.dart';
import 'package:flutter/material.dart';
import '../symptoms/symptom_history.dart';
import '../symptoms/current_symptoms.dart';
import '../../view_models/patientBloc.dart';
import '../../view_models/patientRepo.dart';
import '../../models/patientCase.dart';
import '../test_result/test_result_history_home.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:intl/intl.dart' as intl;

class PatientDetailView extends StatefulWidget {
  PatientCase patient;
  PatientDetailView({this.scrollController, this.patient});

  final ScrollController scrollController;

  @override
  PatientDetailViewState createState() =>
      PatientDetailViewState(this.scrollController, this.patient);
}

class PatientDetailViewState extends State<PatientDetailView> {
  PatientDetailViewState(this.scrollController, this.patient);
  PatientCase patient;
  //User user;
  final ScrollController scrollController;
  PatientBloc patientBloc = new PatientBloc(repo: PatientRepo());
  int age = 0;

  @override
  void initState() {
    super.initState();
    populateData();
  }

  populateData() {
    patientBloc.actionSink.add(FetchPatientDetail(patient.patientInfoId));
  }

  @override
  Widget build(BuildContext context) {
    return WillPopScope(
        onWillPop: () {
          Navigator.pop(context);
        },
        child: SafeArea(
            child: Scaffold(
                appBar: AppBar(
                  elevation: 1,
                  backgroundColor: Colors.white,
                  title: Center(
                    child: Text(
                      patient.patientFirstName + " " + patient.patientLastName,
                      style: TextStyle(
                        color: Colors.grey,
                      ),
                    ),
                  ),
                  leading: IconButton(
                    icon: Icon(Icons.arrow_back),
                    iconSize: 30.0,
                    color: Colors.grey,
                    onPressed: () {
                      Navigator.pop(context);
                    },
                  ),
                ),
                body: Container(
                    decoration: BoxDecoration(
                      color: HexColor("#F5F9FF"),
                    ),
                    margin: EdgeInsets.symmetric(horizontal: 5),
                    child: Column(
                      children: <Widget>[
                        content(context),
                      ],
                    )))));
  }

  Future<void> refresh() async {
    // userProvider = userProvider();
    // await userProvider.fetchArticleBookmarks();
  }

  content(BuildContext context) {
    return Expanded(
        child: RefreshIndicator(
      onRefresh: refresh,
      child: StreamBuilder(
          stream: patientBloc.patientDetailStream,
          builder: (context, snapshot) {
            if (snapshot.data == null) {
              return Center(child: CircularProgressIndicator());
            } else if (snapshot.hasData) {
              return ListView(
                children: <Widget>[
                  Container(
                    height: 160,
                    padding: EdgeInsets.only(top: 15),
                    decoration: BoxDecoration(
                      color: Colors.white,
                    ),
                    child: Row(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: <Widget>[
                          SizedBox(width: 10),
                          CircleAvatar(
                            backgroundImage:
                                AssetImage('assets/images/user1.jpg'),
                            maxRadius: 50,
                          ),
                          SizedBox(width: 15),
                          Expanded(
                              child: Container(
                            margin: EdgeInsets.only(left: 5),
                            decoration: BoxDecoration(
                              color: Colors.transparent,
                            ),
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: <Widget>[
                                SizedBox(height: 10),
                                Text(
                                    snapshot.data.firstName +
                                        " " +
                                        snapshot.data.lastName,
                                    style: TextStyle(
                                      fontSize: 20,
                                    )),
                                SizedBox(height: 13),
                                Text(
                                    (DateTime.now()
                                                    .difference(DateTime.parse(
                                                        snapshot
                                                            .data.dateOfBirth))
                                                    .inDays /
                                                365)
                                            .floor()
                                            .toString() +
                                        " years old",
                                    style: TextStyle(
                                      fontSize: 14,
                                    )),
                                SizedBox(height: 13),
                                Text(snapshot.data.gender,
                                    style: TextStyle(
                                      fontSize: 14,
                                    )),
                                SizedBox(height: 10),
                                Text(this.patient.currentNote,
                                    style: TextStyle(
                                      fontSize: 14,
                                    )),
                                SizedBox(height: 10),
                              ],
                            ),
                          )),
                          SizedBox(width: 20),
                        ]),
                  ),
                  Container(
                      height: 60,
                      decoration: BoxDecoration(
                        color: Colors.white,
                      ),
                      child: Row(
                        children: <Widget>[
                          Expanded(
                              child: FlatButton(
                                  shape: RoundedRectangleBorder(
                                    borderRadius: BorderRadius.circular(15.0),
                                  ),
                                  color: Theme.of(context).primaryColor,
                                  textColor: Colors.white,
                                  onPressed: () {},
                                  child: Text("Message"))),
                          SizedBox(width: 10),
                          Expanded(
                              child: FlatButton(
                                  shape: RoundedRectangleBorder(
                                    borderRadius: BorderRadius.circular(15.0),
                                  ),
                                  color: Theme.of(context).primaryColor,
                                  textColor: Colors.white,
                                  onPressed: () {},
                                  child: Text("Contact")))
                        ],
                      )),
                  SizedBox(height: 10),
                  Container(
                      child: Column(
                    children: <Widget>[
                      cardWidgetBuilder(context, "Current Symptoms"),
                      // cardWidgetBuilder(context, "Symptom History"),
                      SizedBox(height: 10),
                      cardWidgetBuilder(context, "Test Result History")
                      // SizedBox(height: 10),
                      // cardWidgetBuilder(context, "Symptom History")
                    ],
                  )),
                  SizedBox(height: 20.2),
                ],
              );
            }
          }),
    ));
  }

  cardWidgetBuilder(BuildContext context, String title) {
    return Container(
        height: 70,
        child: Card(
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(15.0),
            ),
            elevation: 2.0,
            child: Container(
                margin: EdgeInsets.all(3),
                child: ListTile(
                  onTap: () {
                    switch (title) {
                      case "Current Symptoms":
                        Navigator.push(
                            context,
                            MaterialPageRoute(
                              builder: (_) => CurrentSymptoms(
                                  patientId: this.patient.userId),
                            ));
                        break;
                      case "Symptom History":
                        Navigator.push(
                            context,
                            MaterialPageRoute(
                              builder: (_) => SymptomHistory(),
                            ));
                        break;
                      case "Test Result History":
                        Navigator.push(
                            context,
                            MaterialPageRoute(
                              builder: (_) => TestResultHistory(
                                  patientId: this.patient.userId),
                            ));
                        break;
                    }
                  },
                  title: Text(title,
                      style: TextStyle(
                        fontSize: 16,
                      )),
                  dense: false,
                  trailing: InkWell(child: Icon(Icons.arrow_forward_ios)),
                ))));
  }
}
