//cases list page
import 'package:ephi_healthcare_worker_app/widgets/cardWidget.dart';
import 'package:flutter/material.dart';
import '../../widgets/caseWidget.dart';
import '../../models/case.dart';
import '../../widgets/hexColorGenerator.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import '../../view_models/caseBloc.dart';
import 'package:flutter/scheduler.dart';

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
    // SchedulerBinding.instance.addPostFrameCallback((_) {
    //   BlocProvider.of<CaseBloc>(context).add(FetchCases(""));
    // });
  }

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
                BlocBuilder<CaseBloc, CaseState>(
                  builder: (context, state) {
                    if (state is CasesNotLoaded) {
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
                                        "You haven't been assigned to any case yet!",
                                        style: TextStyle(
                                          fontSize: 22,
                                          color: Theme.of(context).primaryColor,
                                        ))
                                  ])));
                    } else if (state is CasesLoading) {
                      return Center(child: CircularProgressIndicator());
                    } else if (state is CasesLoaded) {
                      ListView.builder(
                        //key: animatedListKey,
                        primary: false,
                        shrinkWrap: true,
                        physics: NeverScrollableScrollPhysics(),
                        scrollDirection: Axis.vertical,
                        itemCount: state.caseList.length,
                        itemBuilder: (BuildContext context, int index) {
                          return CaseWidget(
                            patient_case: state.caseList[index],
                          );
                        },
                      );
                    } else if (state is CasesError) {
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
                  },
                ),
              ],
            )));
  }
}
