import 'package:ephi_healthcare_worker_app/pages/patient_registry_page/patientRegistryForm.dart';
import 'package:ephi_healthcare_worker_app/view_models/patientRegistrationBloc.dart';
import 'package:flutter/material.dart';

class PatientRegistryPage extends StatefulWidget {
  @override
  _PatientRegistryPageState createState() => _PatientRegistryPageState();
}

class _PatientRegistryPageState extends State<PatientRegistryPage> {
  final bloc = PatientRegistrationBloc();

  @override
  void dispose() {
    // TODO: implement dispose
    bloc.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    Size size = MediaQuery.of(context).size;
    return StreamBuilder<Object>(
        stream: bloc.loadingPostStream,
        builder: (context, snapshot) {
          return Scaffold(
            appBar: PreferredSize(
              preferredSize: Size.fromHeight(size.height * 0.068),
              child: AppBar(
                centerTitle: true,
                backgroundColor: Colors.white,
                iconTheme: new IconThemeData(
                  color: Colors.blue,
                ),
                title: Text(
                  "Patient Registration",
                  style: TextStyle(
                    color: Colors.blue,
                  ),
                ),
              ),
            ),
            body: snapshot.hasError
                ? Center(child: Text("Couldn't Connect to the Server"))
                : snapshot.data != null
                    ? snapshot.data == "Loading"
                        ? Center(child: CircularProgressIndicator())
                        : Center(
                            child: Icon(
                            Icons.done_rounded,
                            color: Colors.blue,
                            size: 100,
                          ))
                    : ListView(
                        padding: const EdgeInsets.all(8),
                        children: <Widget>[PatientRegistryForm(bloc: bloc)]),
          );
        });
  }
}
