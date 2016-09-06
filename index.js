'use strict';
var Alexa = require('alexa-sdk');

var APP_ID = undefined; //OPTIONAL: replace with "amzn1.echo-sdk-ams.app.[your-unique-value-here]";
var SKILL_NAME = 'Space Facts';

var unirest = require('unirest');

var theEvent;
var theContext;

exports.handler = function(event, context, callback) {
    var alexa = Alexa.handler(event, context);
    alexa.APP_ID = APP_ID;
    theEvent = event;
    theContext = context;
    alexa.registerHandlers(handlers);
    alexa.execute();
};

var handlers = {
    'LaunchRequest': function () {
        console.log("Launch Request");
         this.emit(':askWithCard', "Who would you like me message?", SKILL_NAME)
    },
    'SendNewMessage': function () {
        console.log("Send Message 1");
        
        if(theEvent === null){
	        this.emit(':tellWithCard', "event null", SKILL_NAME);
        }else{
	        
	        var go = false;
	        var user = theEvent.request.intent.slots.User.value;
	        var msg  = theEvent.request.intent.slots.Message.value;
	        
	        //var reply = "Your message was sent to " + msg;
	        
	        /*unirest.post('http://gkortsaridis.noip.me:3000')
            	.headers({'Accept': 'application/json', 'Content-Type': 'application/json'})
				.send({ "to": "12345", "message": msg })
				.end(function (response) {
                	console.log(response.body);
					reply = reply + " " + response.body;
					go = true;
					
					
        		});*/
        		
        		var userId;
        	if(user === "George"){
	        	userId = "12345";	
        	}else if(user === "Bill"){
	        	userId = "54321";
        	}
        		
        	var request = require('sync-request');
			var res = request('POST', 'http://gkortsaridis.noip.me:3000', {
				json: {
					message : msg,
					to : userId
				}
			});

			var reply = "Message was sent to "+user;
        
			this.emit(':tellWithCard',reply, SKILL_NAME);
	      
        }
    },
    'GetMyMessages': function () {
        console.log("Send Message 2");
		
		var theReply = "You have 1 new message from George. I am on my way to your house. I already called 911"
        
        this.emit(':tellWithCard', theReply, SKILL_NAME)
    },
    
    'AMAZON.HelpIntent': function () {
        var speechOutput = "You can say tell me a space fact, or, you can say exit... What can I help you with?";
        var reprompt = "What can I help you with?";
        this.emit(':ask', speechOutput, reprompt);
    },
    
    'AMAZON.CancelIntent': function () {
        this.emit(':tell', 'Goodbye!');
    },
    
    'AMAZON.StopIntent': function () {
        this.emit(':tell', 'Goodbye!');
    }
};