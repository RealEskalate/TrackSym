// Basic custom card widget
import 'dart:ffi';

import 'package:flutter/material.dart';

class CardWidget extends StatelessWidget {
  final String text, title;
  final Function press;
  final String value, change, iconPath;
  final Color color;
  final num sizeWidth, sizeHeight;

  CardWidget(
      {this.color,
      this.sizeWidth,
      this.sizeHeight,
      this.iconPath,
      this.value,
      this.change,
      this.text,
      this.title,
      this.press});

  @override
  Widget build(BuildContext context) {
    Size size = MediaQuery.of(context).size;
    return Container(
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(15),
        color: Colors.transparent,
        boxShadow: <BoxShadow>[
          BoxShadow(
              offset: Offset(0.0, 2.0),
              blurRadius: 5.0,
              color: color.withOpacity(0.1)),
        ],
      ),
      child: Center(
        child: Card(
          // elevation: 1.0,
          shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(15.0),
              side: new BorderSide(color: color, width: 0.35)),
          child: Container(
            height: size.height * sizeHeight,
            width: size.width * sizeWidth,
            margin: EdgeInsets.all(size.width * 0.02),
            // padding: EdgeInsets.all(size.width * 0.01),
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: <Widget>[
                // SizedBox(height: size.height * 0.03),
                Text(text,
                    textAlign: TextAlign.center,
                    style: TextStyle(
                      color: color,
                      fontSize: 15.0,
                    )),
                iconPath != null
                    ? Image.asset(iconPath,
                        width: size.width * 0.1, height: size.height * 0.05)
                    : SizedBox(height: size.height * 0.005),

                change != null
                    ? Container(
                        margin:
                            EdgeInsets.symmetric(vertical: size.height * 0.005),
                        child: Text(change,
                            textAlign: TextAlign.center,
                            style: TextStyle(
                              color: color,
                              fontSize: 15.0,
                            )))
                    : Text(""),

                Text(value,
                    textAlign: TextAlign.center,
                    style: TextStyle(
                        color: color,
                        fontSize: 20.0,
                        fontWeight: FontWeight.bold)),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
