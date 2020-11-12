import 'package:flutter/material.dart';
import '../models/patientCase.dart';
import '../pages/details/detail_view.dart';
import '../pages/people/person_detail.dart';

class PatientCard extends StatefulWidget {
  PatientCase patient;

  PatientCard({@required this.patient});
  @override
  _PatientCardState createState() => _PatientCardState(patient: this.patient);
}

class _PatientCardState extends State<PatientCard> {
  _PatientCardState({this.patient});
  PatientCase patient;

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
                  builder: (_) => PatientDetailView(patient: this.patient),
                ),
              ),
              // leading: CircleAvatar(
              //   backgroundImage: AssetImage('assets/images/user1.jpg'),
              //   maxRadius: 25,
              // ),
              title: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: <Widget>[
                  // Text("Test Result",
                  //     style: TextStyle(fontSize: 16, color: Colors.grey
                  //         // color: patient.currentTestResult == "Positive"
                  //         //     ? Colors.red
                  //         //     : Colors.green,
                  //         )),
                  SizedBox(height: 5),
                  Text(
                      patient.patientFirstName + " " + patient.patientLastName),
                  SizedBox(height: 5),
                ],
              ),
              dense: false,
              trailing: InkWell(
                  onTap: () => Navigator.push(
                        context,
                        MaterialPageRoute(
                          builder: (_) =>
                              PatientDetailView(patient: this.patient),
                        ),
                      ),
                  child: Icon(Icons.arrow_forward_ios)),
            ))));
  }
}
