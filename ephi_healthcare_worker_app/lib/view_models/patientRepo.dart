//sample file of our case view provider
import '../models/patient.dart';
import 'package:flutter/cupertino.dart';
import '../util/api_end_points.dart' as API;
import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:shared_preferences/shared_preferences.dart';
import 'package:retry/retry.dart';
import 'dart:io';
import 'dart:async';

class PatientRepo {
  //get the details of a list of patients from backend
  getListOfPatients(String healthCareWorkerId) async {
    SharedPreferences prefs = await SharedPreferences.getInstance();
    if (prefs.getString('Token') != null) {
      var headers = {
        "Accept": "application/json",
        "Content-Type": "application/json",
        "Authorization": "Bearer " + prefs.getString('Token')
      };

      var response = await retry(
        () => http
            .get(API.PatientsEndPoints.getPatients(healthCareWorkerId),
                headers: headers)
            .timeout(Duration(seconds: 10)),
        retryIf: (e) => e is SocketException || e is TimeoutException,
      );
      ////print(response.body);
      List<Patient> caseList = [];
      var caseListResponse = json.decode(response.body);
      if (response.statusCode == 200) {
        for (int index = 0; index < caseListResponse['data'].length; index++) {
          //print(articlesListResponse['data'][index]['title']);
          caseList.add(Patient.fromJson(caseListResponse['data'][index]));
        }
      } else {
        print("Status code fail " + response.statusCode.toString());
      }
      return caseList;
    }
  }

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
      ////print(response.body);
      Patient patient;
      if (response.statusCode == 200) {
        patient = Patient.fromJson(json.decode(response.body));
      } else {
        //print("Status code fail " + response.statusCode.toString());
      }
      return patient;
    }
  }
}
