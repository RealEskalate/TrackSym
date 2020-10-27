import 'textFieldContainer.dart';
import 'package:flutter/material.dart';

class RoundedPasswordField extends StatelessWidget {
  final bool signIn;
  final ValueChanged<String> onChanged;
  final IconData icon;
  final Color color;
  final TextEditingController controller;

  const RoundedPasswordField(
      {Key key,
      this.icon,
      this.onChanged,
      this.color,
      this.signIn = true,
      this.controller})
      : super(key: key);

  @override
  Widget build(BuildContext context) {
    return TextFieldContainer(
      signIn: this.signIn,
      child: TextField(
        controller: this.controller,
        obscureText: true,
        onChanged: onChanged,
        decoration: InputDecoration(
            hintText: "Password",
            icon: Icon(
              Icons.lock,
              color: color,
            ),
            suffixIcon: Icon(
              Icons.visibility,
              color: color,
            ),
            border: InputBorder.none),
      ),
    );
  }
}
