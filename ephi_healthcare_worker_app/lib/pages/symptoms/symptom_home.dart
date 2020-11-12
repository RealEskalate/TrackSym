// symptoms view page
//cases list page
import 'package:ephi_healthcare_worker_app/widgets/cardWidget.dart';
import 'package:flutter/material.dart';
import '../../widgets/caseWidget.dart';
import '../../models/case.dart';
import '../../widgets/hexColorGenerator.dart';
import '../../view_models/symptomActivityBloc.dart';
import '../../view_models/symptomRepo.dart';
import 'package:flutter/scheduler.dart';
import '../../widgets/blurredDrawer.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:intl/intl.dart' as intl;

class SymptomView extends StatefulWidget {
  SymptomView({this.scrollController});
  final ScrollController scrollController;
  @override
  SymptomViewState createState() => SymptomViewState(this.scrollController);
}

class SymptomViewState extends State<SymptomView> {
  SymptomViewState(this.scrollController);

  //User user;
  final ScrollController scrollController;
  SymptomActivityBloc symptomActivityBloc =
      SymptomActivityBloc(repo: SymptomRepo());
  bool loading = false;

  @override
  void initState() {
    super.initState();
    populateData();

    // SchedulerBinding.instance.addPostFrameCallback((_) {
    //   BlocProvider.of<symptomActivityBloc>(context).add(FetchCases(""));
    // });
  }

  populateData() async {
    SharedPreferences prefs = await SharedPreferences.getInstance();
    symptomActivityBloc.actionSink
        .add(FetchActivity(prefs.getString('UserId')));
  }

  @override
  void dispose() {
    // TODO: implement dispose
    super.dispose();
    symptomActivityBloc.dispose();
  }

  @override
  Widget build(BuildContext context) {
    Size size = MediaQuery.of(context).size;
    return WillPopScope(
        onWillPop: () {
          Navigator.pop(context);
        },
        child: SafeArea(
            child: Scaffold(
                drawerScrimColor: Colors.black.withOpacity(0.2),
                drawer: BlurredDrawer(),
                appBar: PreferredSize(
                  preferredSize: Size.fromHeight(size.height * 0.068),
                  child: AppBar(
                      centerTitle: true,
                      elevation: 1,
                      backgroundColor: Colors.white,
                      iconTheme: new IconThemeData(
                        color: Colors.blue,
                      ),
                      title: Text(
                        "Symptom Activities",
                        style: TextStyle(
                          color: Colors.blue,
                        ),
                      ),
                      actions: <Widget>[
                        IconButton(
                          icon: Icon(
                            Icons.refresh,
                            color: Colors.lightBlueAccent[900],
                          ),
                          onPressed: () async {
                            SharedPreferences prefs =
                                await SharedPreferences.getInstance();
                            symptomActivityBloc.actionSink.add(
                                ReloadActivities(prefs.getString('UserId')));
                            symptomActivityBloc.actionSink
                                .add(FetchActivity(prefs.getString('UserId')));
                          },
                        )
                      ]),
                ),
                body: Container(
                    decoration: BoxDecoration(color: HexColor("#F5F9FF")),
                    margin: EdgeInsets.symmetric(horizontal: 5),
                    child: Column(
                      children: <Widget>[
                        mainList(context),
                      ],
                    )))));
  }

  Future<void> refresh() async {
    SharedPreferences prefs = await SharedPreferences.getInstance();
    symptomActivityBloc.actionSink
        .add(ReloadActivities(prefs.getString('UserId')));
    symptomActivityBloc.actionSink
        .add(FetchActivity(prefs.getString('UserId')));
  }

  mainList(BuildContext context) {
    Size size = MediaQuery.of(context).size;
    return Expanded(
        child: RefreshIndicator(
            onRefresh: refresh,
            child: StreamBuilder(
              stream: symptomActivityBloc.activityStream,
              builder: (context, snapshot) {
                if (snapshot.data == null) {
                  return Center(child: CircularProgressIndicator());
                } else if (snapshot.hasData) {
                  return snapshot.data.length == 0
                      ? Center(
                          child: Container(
                              margin: EdgeInsets.symmetric(horizontal: 20),
                              child: Align(
                                  alignment: Alignment.center,
                                  child: Column(
                                      mainAxisAlignment:
                                          MainAxisAlignment.center,
                                      children: <Widget>[
                                        Icon(Icons.people_outline,
                                            size: 80,
                                            color:
                                                Theme.of(context).primaryColor),
                                        Text("No Activities!",
                                            textAlign: TextAlign.center,
                                            style: TextStyle(
                                              fontSize: 22,
                                              color: Theme.of(context)
                                                  .primaryColor,
                                            ))
                                      ]))))
                      : ListView(
                          padding: EdgeInsets.fromLTRB(
                              0.0, size.height * 0.02, 0.0, 0.0),
                          children: <Widget>[
                              Container(
                                child: Row(
                                  mainAxisAlignment:
                                      MainAxisAlignment.spaceEvenly,
                                  children: <Widget>[
                                    CardWidget(
                                        sizeHeight: 0.10,
                                        sizeWidth: 0.41,
                                        color: Colors.lightBlueAccent[700],
                                        value: snapshot.data.length.toString(),
                                        //change: "+25",
                                        text: "Active Symptoms",
                                        title: "this.title",
                                        press: null),
                                    CardWidget(
                                        sizeHeight: 0.10,
                                        sizeWidth: 0.41,
                                        color: Colors.greenAccent[700],
                                        value: snapshot.data.length.toString(),
                                        //change: "+12",
                                        text: "Recovered Symptoms",
                                        title: "this.title",
                                        press: null),
                                  ],
                                ),
                              ),
                              Container(
                                margin: EdgeInsets.only(
                                    top: 20, bottom: 10, left: 10, right: 10),
                                padding: EdgeInsets.symmetric(horizontal: 20.0),
                                child: Row(
                                  children: <Widget>[
                                    Container(
                                      width: (size.width / 3),
                                      child: Text(
                                        "Date ",
                                        style: TextStyle(
                                          color: Colors.grey,
                                          fontSize: 14.0,
                                          fontWeight: FontWeight.w400,
                                        ),
                                        overflow: TextOverflow.ellipsis,
                                        maxLines: 1,
                                      ),
                                    ),
                                    Container(
                                      width: (size.width / 3),
                                      child: Text(
                                        "Activity",
                                        style: TextStyle(
                                          color: Colors.grey,
                                          fontSize: 14.0,
                                          fontWeight: FontWeight.w400,
                                        ),
                                      ),
                                    ),
                                    Text(
                                      "Patient",
                                      style: TextStyle(
                                        color: Colors.grey,
                                        fontSize: 14.0,
                                        fontWeight: FontWeight.w400,
                                      ),
                                    ),
                                  ],
                                ),
                              ),
                              ListView.builder(
                                scrollDirection: Axis.vertical,
                                primary: false,
                                shrinkWrap: true,
                                physics: NeverScrollableScrollPhysics(),
                                itemCount: snapshot.data.length,
                                itemBuilder: (BuildContext context, int index) {
                                  return Container(
                                    padding:
                                        EdgeInsets.symmetric(horizontal: 10.0),
                                    margin: EdgeInsets.symmetric(
                                        vertical: 2.0, horizontal: 10.0),
                                    height: 50,
                                    decoration: BoxDecoration(
                                        color: Colors.white,
                                        borderRadius:
                                            BorderRadius.circular(15.0),
                                        boxShadow: [
                                          BoxShadow(
                                            color: Colors.black26,
                                            offset: Offset(0.0, 0.2),
                                            blurRadius: 2.0,
                                          )
                                        ]),
                                    child: Row(
                                      children: <Widget>[
                                        Container(
                                          width: (size.width / 4),
                                          child: Text(new intl.DateFormat(
                                                  "MMM d, yy")
                                              .format(DateTime.parse(
                                                  snapshot.data[index].date))),
                                        ),
                                        Container(
                                          width: (size.width / 4),
                                          child: GestureDetector(
                                            onTap: () {
                                              // _showMyDialog(
                                              //     context,
                                              //     _curentActivity[index]
                                              //         .activityType);
                                            },
                                            child: Text(
                                              snapshot.data[index].status !=
                                                      "SYMPTOM_SUBMITTED"
                                                  ? snapshot.data[index]
                                                              .status ==
                                                          "SYMPTOM_UPDATED"
                                                      ? "Updated"
                                                      : "Recovered"
                                                  : "Registered",
                                              textAlign: TextAlign.end,
                                              style: TextStyle(
                                                color: snapshot.data[index]
                                                            .status !=
                                                        "SYMPTOM_SUBMITTED"
                                                    ? snapshot.data[index]
                                                                .status ==
                                                            "SYMPTOM_UPDATED"
                                                        ? HexColor("#f51a0f")
                                                        : HexColor("#06c219")
                                                    : HexColor("#f51a0f"),
                                              ),
                                            ),
                                          ),
                                        ),
                                        Container(
                                            width: (size.width / 3),
                                            child: GestureDetector(
                                              // onTap: () => Navigator.push(
                                              //     context,
                                              //     MaterialPageRoute(
                                              //       builder: (_) =>
                                              //           PatientDetailView(),
                                              //     )),
                                              child: Text(
                                                snapshot.data[index]
                                                        .patientFirstName +
                                                    " " +
                                                    snapshot.data[index]
                                                        .patientLastName,
                                                textAlign: TextAlign.end,
                                                style: TextStyle(
                                                  color: Colors.blue,
                                                ),
                                              ),
                                            )),
                                      ],
                                    ),
                                  );
                                },
                              )
                            ]);
                } else if (snapshot.hasError) {
                  return Container(
                      margin: EdgeInsets.only(top: 100),
                      child: Align(
                          alignment: Alignment.center,
                          child: Column(
                              mainAxisAlignment: MainAxisAlignment.center,
                              children: <Widget>[
                                Icon(Icons.error, size: 80, color: Colors.red),
                                Text(
                                    "Sorry, couldn't connect to Server. Please refresh the page!",
                                    textAlign: TextAlign.center,
                                    style: TextStyle(
                                      fontSize: 20,
                                      color: Colors.red,
                                    ))
                              ])));
                }
                return Container(
                    margin: EdgeInsets.only(top: 100),
                    child: Align(
                        alignment: Alignment.center,
                        child: Column(
                            mainAxisAlignment: MainAxisAlignment.center,
                            children: <Widget>[
                              Icon(Icons.error, size: 80, color: Colors.red),
                              Text(
                                "",
                              )
                            ])));
              },
            )));
  }
}
