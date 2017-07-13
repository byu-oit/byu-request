var byu = require('./index.js') // byu-request
var byu_config = {
    'credential_method': 'aws_ssm', // Either aws_ssm or env_vars
    'aws': { // include if using aws_ssm
        'parameter_header': 'lms-event-integration.dev',
        'region': 'us-west-2',
        'aws_params_location': 'file' // Either file (~/.aws/credentials) or env_vars
    }
}

var requestOptions = {
    'url': 'https://y-stg.byu.edu/ae/prod/class_schedule/cgi/courseSection.cgi/json/20175/psych/350/001',
    'method': 'GET',
    'headers': {
        'Accept': 'application/json'
    }
}

byu(requestOptions, byu_config, function(err, res, body) {
    if(err) {
        console.log(err)
    } else {
        console.log(body)
    }
})
