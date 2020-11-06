const AccessControl = require('accesscontrol');

const ac = new AccessControl();    

module.exports = (function() {

    ac.grant('basic')
        .readOwn('profile')
        .updateOwn('profile')
      .grant('ephi_user')      
        .create('local_policy')
        .create("invite_user")
        .updateOwn('password')
        .updateAny('local_policy')
        .deleteAny('local_policy')
        .deleteAny('message')
      .grant('healthcare_worker')      
        .create('local_policy')
        .create("invite_user")
        .updateOwn('password')
        .updateAny('local_policy')
        .deleteAny('local_policy')
      .grant("sysadmin")
        .readAny("comment")
        .deleteAny("message")
        
    return ac;

})();