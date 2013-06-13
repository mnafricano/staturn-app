/*jslint undef: true*/
var Bot = require('ttapi');
var AUTH = 'xxxxxxxxxxxxxxxxxxxxxxxx';
var USERID = 'xxxxxxxxxxxxxxxxxxxxxxxx';
var ROOMID = 'xxxxxxxxxxxxxxxxxxxxxxxx';
var bot = new Bot(AUTH, USERID, ROOMID);

// Command Delimiter
var cd = '.';

// Commands
var voteup = 'up';
var votedown = 'down';
var getup = 'on';
var getdown = 'off';
var snag = 'snag';
var speak = 'say';

// Splitter
var splt = ' *** ';

// Responses
var msgvoteup = 'You know it! @' + data.userid;
var msgvotedown = 'This is terrible music!';
var msggetup = "I'll spin some good tracks for you all!";
var msggetdown = "I've played a lot of good music, but it's time for me to leave the stage.";
var msgsnag = "Woo! Can't wait to play this for some others!";

// Runtime Variables
var mods = [];
var name;

// Functions
var getName = function (userid) {
    'use strict';
    
    bot.getProfile(userid, function (data) {
        name = data.profile.name;
    });
};

bot.on('roomChanged', function (data) {
    'use strict';
    
    mods = data.room.metadata.moderator_id;
    bot.speak("Restart me, I didn't collect the roomChanged data correctly.");
});

bot.on('new_moderator', function (data) {
    'use strict';
    var success = data.success, userid = data.userid;
    
    if (success === false) {
        bot.speak('Un-mod them and re-mod that user, I had an error. Thanks!');
    } else {
        getName(userid);
        bot.speak('Welcome to the club. @' + name);
        mods.push(userid);
    }
});



bot.on('speak', function (data) {
    'use strict';
    
    var text = data.text, userid = data.userid;
    
    if (text === cd + voteup) {
        bot.vote('up');
        bot.speak();
    } else if (text === cd + votedown) {
        bot.vote('down');
    }
    
    if (mods.indexOf(userid) !== -1) {
        if (text === cd + getup) {
            bot.addDj();
        } else if (text === cd + getdown) {
            bot.remDj();
        } else if (text === cd + snag) {
            bot.snag();
        } else if (text.split(splt)[0] === speak) {
            bot.speak(text.split(splt)[1]);
        }
    }
});