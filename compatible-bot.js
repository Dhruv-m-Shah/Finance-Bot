// NOTE: This version is compatible in google assistant, slack, twitter, and messenger 
//   card was removed from original version to enable compatibility with messaging API's

// See https://github.com/dialogflow/dialogflow-fulfillment-nodejs
// for Dialogflow fulfillment library docs, samples, and to report issues
'use strict';
const functions = require('firebase-functions');
const {WebhookClient} = require('dialogflow-fulfillment');
const {Card, Suggestion} = require('dialogflow-fulfillment');
const admin = require('firebase-admin');

admin.initializeApp({
  credential: admin.credential.applicationDefault(),
  databaseURL: "ws://financial-advisor-ftvfvy.firebaseio.com"
});

function check(current, startdate, enddate){
  console.log(current);
  if(Number(startdate.substring(0,4))<Number(enddate.substring(0, 4)))
  {
    if(Number(startdate.substring(0,4))<Number(current.substring(0, 4))<Number(enddate.substring(0, 4))){
      return true;
    }
    if(Number(current.substring(0, 4))>Number(enddate.substring(0, 4))){
      return false;
    }
    if(Number(current.substring(0, 4))<Number(startdate.substrings(0, 4))){
      return false;
    }
    if(Number(current.substring(0, 4))==Number(startdate.substring(0, 4)))
    {
      if(Number(current.substring(5, 7))>Number(startdate.substring(5, 7))){
        return true;
      }
      if(Number(current.substring(5, 7))<Number(startdate.substring(5, 7))){
        return true;
      }
      if(Number(current.substring(5, 7))==Number(startdate.substring(5, 7))){
        if(Number(current.substring(8, 10))>Number(startdate.substring(8, 10))){
           	return true;
           }
        if(Number(current.substring(8, 10))==Number(startdate.substring(8, 10))){
          return true;
        }
        if(Number(current.substring(8, 10))<Number(startdate.substring(8, 10))){
          return false;
        }
      }
    }
  }
    if(Number(startdate.substring(0,4))==Number(enddate.substring(0, 4))){
      if(Number(current.substring(0, 4)) != Number(enddate.substring(0, 4))){
         return false;
         }
       console.log("HERE");
      if(Number(current.substring(5, 7))<Number(startdate.substring(5,7)))
      {
        return false;
      }
      if(Number(current.substring(5, 7))>Number(enddate.substring(5,7)))
      {
        return false;
      }
      if(Number(enddate.substring(5, 7)) > Number(current.substring(5, 7)) > Number(startdate.substring(5,7)))
      {
        return true;
      }
      if(Number(startdate.substring(5, 7)) == Number(enddate.substring(5, 7))){
        
        if(Number(startdate.substring(8, 10))<=Number(current.substring(8, 10)) && Number(current.substring(8, 10))<=Number(enddate.substring(8, 10))){
          console.log("ASDAS");
          console.log(current.substring(8, 10));
          console.log(startdate);
          console.log(startdate.substring(8, 10));
          console.log(enddate.substring(8, 10));
          return true;
        }
          else{
            return false;
          }
        }
      if(Number(current.substring(5, 7))==Number(startdate.substring(5, 7))){
        if(Number(current.substring(8, 10)) >= Number(startdate.substring(8, 10))){
          return true;
        }
        else{
          return false;
        }
     
      }
      if(Number(current.substring(5, 7))==Number(enddate.substring(5, 7))){
        if(Number(current.substring(8, 10)) <= Number(enddate.substring(8, 10))){
          return true;
        }
        else{
          return false;
        }
      }
    }
  }
function transactions(agent){
  var startdate = agent.parameters['date-period']['startDate'];
  var enddate = agent.parameters['date-period']['endDate'];
  return admin.database().ref('financial-advisor-ftvfvy').once("value").then((snapshot) => {
    snapshot.forEach(function(child) {
      var d = child.child('d').child('date');
      if(check(JSON.stringify(d).slice(1, 11), startdate, enddate)){
       
     	agent.add("$" + JSON.stringify(child.child('d').child('amount')) + " was spent at " + JSON.stringify(child.child('d').child('name')) + " on " + JSON.stringify(child.child('d').child('date')));
      }
    });
  });
}

function balance(agent){
  agent.add("Select a bank account.");
  return admin.database().ref('Balance').once("value").then((snapshot) => {
    snapshot.forEach(function(child) {
      agent.add(JSON.stringify(child.child('d').child('name')));
    });
                     });
  
}
process.env.DEBUG = 'dialogflow:debug'; // enables lib debugging statements
 
exports.dialogflowFirebaseFulfillment = functions.https.onRequest((request, response) => {
  const agent = new WebhookClient({ request, response });
  console.log('Dialogflow Request headers: ' + JSON.stringify(request.headers));
  console.log('Dialogflow Request body: ' + JSON.stringify(request.body));

  function welcome(agent) {
    agent.add(`Welcome to my agent!`);
  }
 
  function fallback(agent) {
    agent.add(`I didn't understand`);
    agent.add(`I'm sorry, can you try again?`);
  }
  
  function setmybudget(agent){
    agent.add("Enter budget name");
  }
  function BudgetName(agent){
  	var Budget_Name = agent.query;
    agent.add("Enter budget time");
  }
  function BudgetTime(agent){
    var Budget_time = agent.query();
    agent.add("Enter how you wish to budget your money. Example: Utilities: $1000, Entertainment: $3000, Electronics: $500 ...")
  }
  function Typeofbank(agent){
    var d = agent.query;
      return admin.database().ref('Balance').once("value").then((snapshot) => {
     var marker = 0;
    snapshot.forEach(function(child) {
      if(JSON.stringify(agent.query) == JSON.stringify(child.child('d').child('name'))){
        marker = 1;
        agent.add("Your balance for " + JSON.stringify(child.child('d').child('name')) + " is: $" + JSON.stringify(child.child('d').child('balances').child('current')));
      }
    });
        if(marker === 0){
          agent.add("Enter a correct banking account");
        }
  });
  }
                                                                  
  // // Uncomment and edit to make your own intent handler
  // // uncomment `intentMap.set('your intent name here', yourFunctionHandler);`
  // // below to get this function to be run when a Dialogflow intent is matched
  // function yourFunctionHandler(agent) {
  //   agent.add(`This message is from Dialogflow's Cloud Functions for Firebase editor!`);
  //   agent.add(new Card({
  //       title: `Title: this is a card title`,
  //       imageUrl: 'https://developers.google.com/actions/images/badges/XPM_BADGING_GoogleAssistant_VER.png',
  //       text: `This is the body text of a card.  You can even use line\n  breaks and emoji! 💁`,
  //       buttonText: 'This is a button',
  //       buttonUrl: 'https://assistant.google.com/'
  //     })
  //   );
  //   agent.add(new Suggestion(`Quick Reply`));
  //   agent.add(new Suggestion(`Suggestion`));
  //   agent.setContext({ name: 'weather', lifespan: 2, parameters: { city: 'Rome' }});
  // }

  // // Uncomment and edit to make your own Google Assistant intent handler
  // // uncomment `intentMap.set('your intent name here', googleAssistantHandler);`
  // // below to get this function to be run when a Dialogflow intent is matched
  // function googleAssistantHandler(agent) {
  //   let conv = agent.conv(); // Get Actions on Google library conv instance
  //   conv.ask('Hello from the Actions on Google client library!') // Use Actions on Google library
  //   agent.add(conv); // Add Actions on Google library responses to your agent's response
  // }
  // // See https://github.com/dialogflow/dialogflow-fulfillment-nodejs/tree/master/samples/actions-on-google
  // // for a complete Dialogflow fulfillment library Actions on Google client library v2 integration sample

  // Run the proper function handler based on the matched Dialogflow intent name
  let intentMap = new Map();
  intentMap.set('Default Welcome Intent', welcome); 
  intentMap.set('Default Fallback Intent', fallback);
  intentMap.set('Transaction', transactions);
  intentMap.set('Balance', balance);
  intentMap.set('Typeofbank', Typeofbank);
  intentMap.set('SetmyBudget', setmybudget);
  intentMap.set('BudgetName', BudgetName);
  intentMap.set('BudgetTime', BudgetTime);
  // intentMap.set('your intent name here', yourFunctionHandler);
  // intentMap.set('your intent name here', googleAssistantHandler);
  agent.handleRequest(intentMap);
  
});
