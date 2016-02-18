/////////////////////////// Adjustment accounts-ui //////////////////////////////
Accounts.ui.config({
  passwordSignupFields: "USERNAME_AND_EMAIL"
});


/////////////////////////////////////// routing ////////////////////////////

Router.configure({
  layoutTemplate: 'ApplicationLayout'
});

Router.route('/', function () {
  this.render('welcome', {
    to:"main"
  });
});

Router.route('/landing', function () {
  this.render('navbar', {
    to:"navbar"
  });
  this.render('landing', {
    to:"main"
  });
});

Router.route('/menu', function () {
  this.render('navbar', {
    to:"navbar"
  });
  this.render('menu', {
    to:"main"
  });
});

Router.route('/groups/:_id', function () {
  this.render('navbar', {
    to:"navbar"
  });
  this.render('groupe', {
    to:"main", 
    data:function(){
      return Groups.findOne({_id:this.params._id});
    }
  });
});


//////////////////////////////////////////////  Helpers //////////////////////////
Template.userlist.helpers({
  user:function(){       
    return  Userlist.find();
  }
});

Template.menu.helpers({
  menu:function(){       
    return  Menu.find();
  }
});

Template.Pizzaday.helpers({
  menu:function(){       
    return  Menu.find();
  }
});    


Template.groupeList.helpers({
  groupeNames:function(){      
    return Groups.find({});
  }
});


Template.groupe.helpers({
  isAdmin:function(){    
    if ( Meteor.userId() == this.creator ) {
      return true;
    }
    else return false;
  },
  statusBuying:function(){
    if (this.eventstatus == "Buying food...") {
      return true;
    }
    else return false;
  }
});  


//////////////////////////////// Events /////////////////////////////////////
Template.buttons.events({
  "submit .createGroupe": function(event) {
    event.preventDefault();
    var text = event.target.text.value;

    Groups.insert({
      groupName: text,
      creator: Meteor.userId(),
      eventdate: "",
      isevent: false,
      eventstatus: "wating for event..."
    });
    // Clear form
    event.target.text.value = "";  
  }
});


Template.groupeList.events({
  "click .delete": function () {
    Groups.remove(this._id);
  },

  "click .idadd": function (event){      
    Session.set("idgroupe", this._id);          
  }     
});


Template.dishadd_form.events({
  "click .js-toggle-form":function(event){
    $("#dishadd_form").toggle('slow');
  }, 

  "submit .js-form":function(event){
    event.preventDefault();
    var dishname = event.target.dishname.value;
    var price = event.target.price.value;
         
    Menu.insert({
      dish:dishname, 
      price:price        
    });     
    $("#dishadd_form").toggle('hide');  
    return false;
  }
});


Template.addEvent.events({
  "submit .js-addevent-form":function(event){
    event.preventDefault();
    var eventdate = event.target.eventdate.value;    
    Groups.update({ _id: Session.get("idgroupe") },{ 
      $set: { eventdate: eventdate,
              isevent: true,
              eventstatus: "Event announced"
            }
    });
    event.target.eventdate.value = "";
  }
});  




Template.userlist.events({
  "click .addtogroupe": function (event) {                
    Groups.update({ _id: Session.get("idgroupe") },{ $push: { user: this.id }});

    Userlist.update({_id: this._id},{   
      $push: {groups: Session.get("idgroupe")}
    });

  }
}); 


Template.groupe.events({
  "click .statusBuying": function (event) {                
    Groups.update({ _id: Session.get("idgroupe") },{ 
      $set: { eventstatus: "Buying food..." }
    });
  },
  "click .endEvent": function (event) {                
    Groups.update({ _id: Session.get("idgroupe") },{ 
      $set: { 
              eventstatus: "wating for event...",
              isevent: false
            }
    });
  }
}); 


