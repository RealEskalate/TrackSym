import 'package:flutter/material.dart';

class FormInputField extends StatelessWidget {
  final double width;
  final double height;
  final Color backgroundColor;
  final String text;
  final String errorText;
  final onChanged;

  const FormInputField(
      {Key key,
      this.width,
      this.height,
      this.backgroundColor,
      this.text,
      this.errorText,
      this.onChanged})
      : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Container(
      alignment: Alignment.centerLeft,
      width: width,
      height: height,
      padding: EdgeInsets.symmetric(horizontal: 20, vertical: 5),
      decoration: BoxDecoration(
          color: backgroundColor, borderRadius: BorderRadius.circular(15)),
      child: TextField(
        onChanged: onChanged,
        decoration: InputDecoration(
            hintText: text, border: InputBorder.none, errorText: errorText),
      ),
    );
  }
}
