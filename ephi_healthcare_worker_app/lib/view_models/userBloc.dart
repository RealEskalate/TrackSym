import 'package:equatable/equatable.dart';
import 'userRepo.dart';
import '../models/user.dart';
import 'dart:async';

class UserEvent extends Equatable {
  @override
  // TODO: implement props
  List<Object> get props => [];
}

class SignIn extends UserEvent {
  static String username;
  static String password;
  SignIn(String uname, String pass) {
    username = uname;
    password = pass;
  }
}

class Loading extends UserEvent {}

class UserBloc {
  bool loading = false;
  final _userStreamController = StreamController<User>();
  StreamSink<User> get _userSink => _userStreamController.sink;
  Stream<User> get userStream => _userStreamController.stream;

  var _actionStreamController = StreamController<SignIn>();
  StreamSink<UserEvent> get actionSink => _actionStreamController.sink;
  Stream<UserEvent> get _actionStream => _actionStreamController.stream;

  UserRepo userRepo;

  UserBloc({UserRepo repo}) {
    userRepo = repo;
    _actionStream.listen((event) async {
      if (event is SignIn) {
        try {
          User user =
              await userRepo.signInUser(SignIn.username, SignIn.password);
          _userSink.add(user);
        } on Exception catch (e) {
          _userSink.addError("Couldn't connect to server");
        }
      }
    });
  }

  void dispose() {
    _userStreamController.close();
    _actionStreamController.close();
  }
}
