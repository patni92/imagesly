var helper = require('sendgrid').mail;
var key = require("../config.json").mail.key;


module.exports = {

  sendmail: function(req, res) {
    console.log(req.query);
    var from_email = new helper.Email(req.query.mail);
    var to_email = new helper.Email('patriknilsson1992@gmail.com');
    var subject = "" + req.query.title;
    var content = new helper.Content('text/plain', req.query.subject);
    var mail = new helper.Mail(from_email, subject, to_email, content);
    var sg = require('sendgrid')(key);
    var request = sg.emptyRequest({
      method: 'POST',
      path: '/v3/mail/send',
      body: mail.toJSON(),
    });

    sg.API(request, function(error, response) {
      console.log(response.statusCode);
      console.log(response.body);
      console.log(response.headers);
      res.send("ok");
    });
  }
}
