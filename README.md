# Finance-Bot

This application allows users to talk or text with an assitant to discuss banking questions. Some questions you can ask are:

* "Transactions in the past month"
* "My Bank Balance"
* "Balance in my savings account"
* "Balance in my 401K account"
* "Transactions from July 7 2014 to September 7 2014"

### How it works
Every time a user transaction is made, the PLAID API updates the Firebase server. This server is then called by DialogFlow to answer user queries.
### Installing
node js:
```
npm install plaid
npm install --save firebase
```
API keys:
* Sign up for a [Plaid API key](https://plaid.com/products/auth/)
* Get a [firebase API key](https://firebase.google.com/)

### Usage

Can be used on:

* Twitter
* Slack
* Dialogflow's text interface
* Facebook Messenger 
* Twitter




