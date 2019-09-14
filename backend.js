//PLAID authentication and setup
const plaid = require('plaid');
const plaidClient = new plaid.Client('', '', '', plaid.environments.sandbox, {
  version: '2018-05-22'
});
//PLAID authentication and setup

var latest_transaction = 0;
//firebase authentication and setup
var admin = require("firebase-admin");
var serviceAccount = require("C:/Users/darshana/Downloads/financial-advisor-ftvfvy-firebase-adminsdk-u9mhv-f3bd56f746.json");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://financial-advisor-ftvfvy.firebaseio.com"
});
//firebase authentication and setup

//Remove previously stored data
var db = admin.database();
var ref = db.ref("balance");
ref.remove();
var db = admin.database();
var ref = db.ref("financial-advisor-ftvfvy");
ref.remove();
//Remove previously stored data


//Store current balance in firebase
function updateBalance() {
  plaidClient.getBalance('access-sandbox-490ae7e2-252d-4610-8d2f-28f5351002fe', (err, res) => {
    var db = admin.database();
    var ref = db.ref("Balance");
    for (i = 0; i < res.accounts.length; i++) {
      ref.push({
        d: res.accounts[i]

      });
    }
  });
}
//Store current balance in firebase

//add new transactions to database
function add_new_transaction(ids) {
  plaidClient.getTransactions('access-sandbox-490ae7e2-252d-4610-8d2f-28f5351002fe', '2001-01-01', '2019-08-10', (err, res) => {
    var db = admin.database();
    var ref = db.ref("financial-advisor-ftvfvy");
    var marker = 0;
    for (i = 0; i < res.transactions.length; i++) {
      if (res.transactions[i]['transaction_ids'] != ids) {
        var marker = 1;
        console.log(res.transactions[i]['transaction_id']);
        if (i == 0) {
          latest_transaction = res.transactions[0]['transaction_ids'];
        }
        ref.push({
          d: res.transactions[i]
        });
      }
       else {
        break;
      }
    }
    if(marker == 1){
      check_new_balance();
    }
  });
}
//add new transactions to database 

var db = admin.database();
var ref = db.ref("Balance");
ref.remove();



//check new balance
function check_new_balance() {
  var db = admin.database();
  var ref = db.ref("Balance");
  ref.remove();
  plaidClient.getBalance('access-sandbox-490ae7e2-252d-4610-8d2f-28f5351002fe', (err, res) => {
    var db = admin.database();
    var ref = db.ref("Balance");
    for (i = 0; i < res.accounts.length; i++) {
      ref.push({
        d: res.accounts[i]
      });
    }
  });
}



//check new balance


//Main while loop for updating information

console.log(latest_transaction);
  setInterval(function () {
    add_new_transaction(latest_transaction);
  }, 10000);

//Main while loop for updating information
