// symptoms view page
import 'package:ephi_healthcare_worker_app/widgets/cardWidget.dart';

import '../../models/Symptom.dart';
import '../../models/symptom_activity.dart';
import 'package:flutter/material.dart';
import '../../widgets/hexColorGenerator.dart';
import '../people/person_detail.dart';

class SymptomView extends StatelessWidget {
  List<SymptomActivity> _curentActivity = [
    SymptomActivity(activityType: "Registered", person: "Mike"),
    SymptomActivity(activityType: "Recovered", person: "Abel"),
    SymptomActivity(activityType: "Registered", person: "Feysel"),
    SymptomActivity(activityType: "Recovered", person: "Mahlet"),
    SymptomActivity(activityType: "Registered", person: "Suha"),
    SymptomActivity(activityType: "Registered", person: "Minasie"),
    SymptomActivity(activityType: "Recovered", person: "Emre"),
    SymptomActivity(activityType: "Registered", person: "Michael"),
  ];
  List<Symptom> _latestSymptoms = [
    Symptom(
        name: "Dry cough", description: "Recovered", dateAdded: "20 min ago"),
  ];
  Widget _buildSymptomsView(int index) {
    Symptom currentView = _latestSymptoms[index];
    return Container(
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: <Widget>[Text(currentView.name), Text(currentView.dateAdded)],
      ),
    );
  }

  Future<void> _showMyDialog(context, String activity) async {
    return showDialog<void>(
      context: context,
      barrierDismissible: false, // user must tap button!
      builder: (BuildContext context) {
        return AlertDialog(
          shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.all(Radius.circular(15.0))),
          title: Text(
              activity == "Recovered"
                  ? 'Patient Recovered'
                  : 'Patient Registered',
              textAlign: TextAlign.center,
              style: TextStyle(
                color: activity == "Recovered" ? Colors.green : Colors.red,
              )),
          content: SingleChildScrollView(
              child: Column(
                  children: _latestSymptoms
                      .asMap()
                      .entries
                      .map((MapEntry map) => _buildSymptomsView(map.key))
                      .toList())),
          actions: <Widget>[
            FlatButton(
              child: Text(
                'Dismiss',
              ),
              onPressed: () {
                Navigator.of(context).pop();
              },
            ),
          ],
        );
      },
    );
  }

  @override
  Widget build(BuildContext context) {
    Size size = MediaQuery.of(context).size;
    return Container(
      decoration: BoxDecoration(color: HexColor("#F5F9FF")),
      child: ListView(
        padding: EdgeInsets.fromLTRB(0.0, size.height * 0.02, 0.0, 0.0),
        children: <Widget>[
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceEvenly,
            children: <Widget>[
              CardWidget(
                  sizeHeight: 0.10,
                  sizeWidth: 0.41,
                  color: Colors.lightBlue[700],
                  value: "1,453",
                  change: "+25",
                  text: "Active Symptoms",
                  title: "this.title",
                  press: null),
              CardWidget(
                  sizeHeight: 0.10,
                  sizeWidth: 0.41,
                  color: Colors.greenAccent[700],
                  value: "1,071",
                  change: "+12",
                  text: "Recovered Symptoms",
                  title: "this.title",
                  press: null),
            ],
          ),
          Container(
            margin: EdgeInsets.only(top: 20, bottom: 10, left: 10, right: 10),
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
            itemCount: _curentActivity.length,
            itemBuilder: (BuildContext context, int index) {
              return Container(
                padding: EdgeInsets.symmetric(horizontal: 10.0),
                margin: EdgeInsets.symmetric(vertical: 2.0, horizontal: 10.0),
                height: 50,
                decoration: BoxDecoration(
                    color: Colors.white,
                    borderRadius: BorderRadius.circular(5.0),
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
                      width: (size.width / 3),
                      child: Text(_curentActivity[index].acticityDate),
                    ),
                    Container(
                      width: (size.width / 3),
                      child: GestureDetector(
                        onTap: () {
                          _showMyDialog(
                              context, _curentActivity[index].activityType);
                        },
                        child: Text(
                          _curentActivity[index].activityType,
                          style: TextStyle(
                            color: _curentActivity[index].activityType ==
                                    "Recovered"
                                ? HexColor("#06c219")
                                : HexColor("#f51a0f"),
                          ),
                        ),
                      ),
                    ),
                    GestureDetector(
                      onTap: () => Navigator.push(
                          context,
                          MaterialPageRoute(
                            builder: (_) => PatientDetailView(),
                          )),
                      child: Text(
                        _curentActivity[index].person,
                        style: TextStyle(
                          color: Colors.blue,
                        ),
                      ),
                    ),
                  ],
                ),
              );
            },
          ),
        ],
      ),
    );
  }
}