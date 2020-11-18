//sample file of our case view provider
import '../models/patient.dart';
import '../models/patientSymptom.dart';
import '../models/testReport.dart';
import 'package:flutter/cupertino.dart';
import '../util/api_end_points.dart' as API;
import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:shared_preferences/shared_preferences.dart';
import 'package:retry/retry.dart';
import 'dart:io';
import 'dart:async';

class PatientRepo {
  //get the details of a specific specific from backend
  getPatientDetails(String patientId) async {
    SharedPreferences prefs = await SharedPreferences.getInstance();
    if (prefs.getString('Token') != null) {
      var headers = {
        "Accept": "application/json",
        "Content-Type": "application/json",
        "Authorization": "Bearer " + prefs.getString('Token')
      };

      var response = await retry(
        () => http
            .get(API.PatientsEndPoints.getPatientDetails(patientId),
                headers: headers)
            .timeout(Duration(seconds: 10)),
        retryIf: (e) => e is SocketException || e is TimeoutException,
      );
      //print(" >>>>>>>>>>> " + response.body.toString());
      Patient patient;
      if (response.statusCode == 200) {
        patient = Patient.fromJson(json.decode(response.body));
      } else {
        //print("Status code fail " + response.statusCode.toString());
      }
      return patient;
    }
  }

//get the list of current symptom of patient from backend
  getPatientCurrentSymptom(String patientUserId) async {
    SharedPreferences prefs = await SharedPreferences.getInstance();
    if (prefs.getString('Token') != null) {
      var headers = {
        "Accept": "application/json",
        "Content-Type": "application/json",
        "Authorization": "Bearer " + prefs.getString('Token')
      };

      var response = await retry(
        () => http
            .get(API.PatientsEndPoints.getPatientCurrentSymptoms(patientUserId),
                headers: headers)
            .timeout(Duration(seconds: 10)),
        retryIf: (e) => e is SocketException || e is TimeoutException,
      );
      print(response.body);
      List<PatientSymptom> symptomList = [];
      if (response.statusCode == 200) {
        var symptomListResponse = json.decode(response.body);
        for (int index = 0; index < symptomListResponse.length; index++) {
          //print(articlesListResponse['data'][index]['title']);
          symptomList.add(PatientSymptom.fromJson(symptomListResponse[index]));
        }
      } else {
        print("Status code fail " + response.statusCode.toString());
      }
      return symptomList;
    }
  }

  //get the list of test report history of patient from backend
  getPatientTestReportHistory(String patientUserId) async {
    SharedPreferences prefs = await SharedPreferences.getInstance();
    if (prefs.getString('Token') != null) {
      var headers = {
        "Accept": "application/json",
        "Content-Type": "application/json",
        "Authorization": "Bearer " + prefs.getString('Token')
      };

      var response = await retry(
        () => http
            .get(
                API.PatientsEndPoints.getPatientTestReportHistory(
                    patientUserId),
                headers: headers)
            .timeout(Duration(seconds: 10)),
        retryIf: (e) => e is SocketException || e is TimeoutException,
      );
      print(response.body);
      List<TestReport> testReportList = [];
      if (response.statusCode == 200) {
        var testReportListResponse = json.decode(response.body);
        for (int index = 0;
            index < testReportListResponse['data'].length;
            index++) {
          //print(articlesListResponse['data'][index]['title']);
          testReportList
              .add(TestReport.fromJson(testReportListResponse['data'][index]));
        }
      } else {
        print("Status code fail " + response.statusCode.toString());
      }
      return testReportList;
    }
  }

  static registerPatient(Patient newPatient) async {
    SharedPreferences prefs = await SharedPreferences.getInstance();
    if (prefs.getString('Token') != null) {
      var headers = {
        "Accept": "application/json",
        "Content-Type": "application/json",
        "Authorization": "Bearer " + prefs.getString('Token')
      };

      String url = API.PatientsEndPoints.registerNewPatient();
      var response = await retry(
        () => http
            .post(url, body: jsonEncode(newPatient.toJson()), headers: headers)
            .timeout(Duration(seconds: 10)),
        retryIf: (e) => e is SocketException || e is TimeoutException,
      );

      print("response => " + response.body);
    }
  }
}
