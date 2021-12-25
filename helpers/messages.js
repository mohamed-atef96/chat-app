const moment = require('moment');
function getMessage (user , text){
    return{
        user:user,
        message:text,
        time:moment().format('h:mm a')
    }
}


module.exports = getMessage