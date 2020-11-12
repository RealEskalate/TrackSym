//cases list page
import 'package:ephi_healthcare_worker_app/widgets/cardWidget.dart';
import 'package:flutter/material.dart';
import '../../widgets/caseWidget.dart';
import '../../models/case.dart';
import '../../widgets/hexColorGenerator.dart';
import '../../view_models/caseBloc.dart';
import '../../view_models/caseRepo.dart';
import 'package:flutter/scheduler.dart';
import '../../widgets/blurredDrawer.dart';
import 'package:shared_preferences/shared_preferences.dart';

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
  CaseBloc caseBloc = CaseBloc(repo: CaseRepo());
  bool loading = false;

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
    caseBloc.actionSink.add(FetchCases(prefs.getString('UserId')));
  }

  @override
  void dispose() {
    // TODO: implement dispose
    super.dispose();
    caseBloc.dispose();
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
                        "Cases",
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
                            caseBloc.actionSink
                                .add(ReloadCases(prefs.getString('UserId')));
                            caseBloc.actionSink
                                .add(FetchCases(prefs.getString('UserId')));
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
    caseBloc.actionSink.add(ReloadCases(prefs.getString('UserId')));
    caseBloc.actionSink.add(FetchCases(prefs.getString('UserId')));
  }

  mainList(BuildContext context) {
    Size size = MediaQuery.of(context).size;
    return Expanded(
        child: RefreshIndicator(
            onRefresh: refresh,
            child: StreamBuilder(
              stream: caseBloc.caseStream,
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
                                        Text(
                                            "You haven't been assigned to any case yet!",
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
                                        sizeHeight: 0.08,
                                        sizeWidth: 0.35,
                                        color: Colors.lightBlueAccent[700],
                                        value: snapshot.data.length.toString(),
                                        //change: "+",
                                        text: "Total Cases",
                                        title: "this.title",
                                        press: null),
                                    CardWidget(
                                        sizeHeight: 0.08,
                                        sizeWidth: 0.35,
                                        color: Colors.greenAccent[700],
                                        value: snapshot.data.length.toString(),
                                        //change: "+12",
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
                              ListView.builder(
                                //key: animatedListKey,
                                primary: false,
                                shrinkWrap: true,
                                physics: NeverScrollableScrollPhysics(),
                                scrollDirection: Axis.vertical,
                                itemCount: snapshot.data.length,
                                itemBuilder: (BuildContext context, int index) {
                                  return CaseWidget(
                                    patient_case: snapshot.data[index],
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
