var Userdb = require('../model/model');
const nodemailer = require('nodemailer');


// create and save new user
exports.create = (req,res)=>{
    // validate request
    if(!req.body){
        res.status(400).send({ message : "Content can not be emtpy!"});
        return;
    }

    // new user
    const user = new Userdb({
        name : req.body.name,
        email : req.body.email,
        gender: req.body.gender,
        status : req.body.status
    })
    ///////////email sending request//////////
    const output =
  `  <p>You have a new contact request </p>
  <h3>Contact details</h3>
  <ul>
      <li>Name : ${req.body.name}</li>
      <li>Name : ${req.body.email}</li>
      <li>Name : ${req.body.gender}</li>
      <li>Name : ${req.body.status}</li>
  </ul>
  <h3>Message</h3>
  <p>Welcome to Insofe</p>`;


  // create reusable transporter object using the default SMTP transport
  let mailTransporter = nodemailer.createTransport({
    service: 'smpt@gmail.com',
    port: 587,
    secure: false,
    requireTLS:true,
    auth: {
        user: 'k.rushi15108@gmail.com', // generated ethereal user
        pass: 'irfnehfhtuffhgeu'  // generated ethereal password
    }

  });

  // setup email data with unicode symbols
  let details = {
      from: "k.rushi15108@gmail.com", // sender address
      to: req.body.email, // list of receivers
      subject: 'Node Contact Request', // Subject line
      text: 'Hello world?',
      html: output // plain text body
       // html body
  };

  // send mail with defined transport object
  mailTransporter.sendMail(details,(err)=>{
    if(err){
      console.log(err)
    }
    else{
      console.log("email is sent")
    }
  })
;
  ////////////////////////////


    // save user in the database
    user
        .save(user)
        .then(data => {
            //res.send(data)
            res.redirect('/');
        })
        .catch(err =>{
            res.status(500).send({
                message : err.message || "Some error occurred while creating a create operation"
            });
        });

}




// retrieve and return all users/ retrive and return a single user
exports.find = (req, res)=>{

    if(req.query.id){
        const id = req.query.id;

        Userdb.findById(id)
            .then(data =>{
                if(!data){
                    res.status(404).send({ message : "Not found user with id "+ id})
                }else{
                    res.send(data)
                }
            })
            .catch(err =>{
                res.status(500).send({ message: "Erro retrieving user with id " + id})
            })

    }else{
        Userdb.find()
            .then(user => {
                res.send(user)
            })
            .catch(err => {
                res.status(500).send({ message : err.message || "Error Occurred while retriving user information" })
            })
    }


}

// Update a new idetified user by user id
exports.update = (req, res)=>{
    if(!req.body){
        return res
            .status(400)
            .send({ message : "Data to update can not be empty"})
    }

    const id = req.params.id;
    Userdb.findByIdAndUpdate(id, req.body, { useFindAndModify: false})
        .then(data => {
            if(!data){
                res.status(404).send({ message : `Cannot Update user with ${id}. Maybe user not found!`})
            }else{
                res.send(data)
            }
        })
        .catch(err =>{
            res.status(500).send({ message : "Error Update user information"})
        })
}

// Delete a user with specified user id in the request
exports.delete = (req, res)=>{
    const id = req.params.id;

    Userdb.findByIdAndDelete(id)
        .then(data => {
            if(!data){
                res.status(404).send({ message : `Cannot Delete with id ${id}. Maybe id is wrong`})
            }else{
                res.send({
                    message : "User was deleted successfully!"
                })
            }
        })
        .catch(err =>{
            res.status(500).send({
                message: "Could not delete User with id=" + id
            });
        });
}

