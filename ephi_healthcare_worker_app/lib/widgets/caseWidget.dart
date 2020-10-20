import 'package:flutter/material.dart';
import '../models/case.dart';
import '../pages/details/detail_view.dart';

class CaseWidget extends StatefulWidget {
  Case patient_case;

  CaseWidget({@required this.patient_case});

  @override
  _CaseWidgetState createState() =>
      _CaseWidgetState(patient_case: this.patient_case);
}

class _CaseWidgetState extends State<CaseWidget> {
  _CaseWidgetState({this.patient_case});

  //Reply sampleReply;
  Case patient_case;

  @override
  void initState() {
    super.initState();
  }

  @override
  void dispose() {
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    var sizeH = MediaQuery.of(context).size.height;
    var sizeW = MediaQuery.of(context).size.width;
    return Container(
        // margin: EdgeInsets.only(bottom: 5),
        child: Card(
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(15.0),
            ),
            elevation: 2.0,
            child: Container(
                // margin: EdgeInsets.all(3),
                child: ListTile(
              onTap: () => Navigator.push(
                context,
                MaterialPageRoute(
                  builder: (_) => DetailView(),
                ),
              ),
              // Mike's Address
              // leading: CircleAvatar(
              //   backgroundImage: AssetImage('assets/images/user1.jpg'),
              //   maxRadius: 25,
              // ),
              title: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: <Widget>[
                  Text(patient_case.currentTestResult,
                      style: TextStyle(
                        fontSize: 14,
                        color: patient_case.currentTestResult == "Positive"
                            ? Colors.red
                            : Colors.green,
                      )),
                  SizedBox(height: 5),
                  Text(patient_case.patientName,
                      style: TextStyle(
                        fontSize: 14,
                      )),
                  SizedBox(height: 5),
                ],
              ),
              dense: false,
              subtitle: Text(patient_case.activeSymptoms),
              // isThreeLine: true,
              trailing: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: <Widget>[
                  Text(patient_case.createdAt,
                      style: TextStyle(
                        fontSize: 12,
                      )),
                  SizedBox(height: 5),
                  Text(patient_case.creationTime,
                      style: TextStyle(
                        fontSize: 12,
                      ))
                ],
              ),
            ))));
  }
}
