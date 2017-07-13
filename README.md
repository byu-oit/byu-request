# byu-request
###### This is a simple npm module for making API calls to BYU.
## Usage
The following parameters are required either as environment variables or as parameters in the Parameter Store:

* BYU_CLIENT_ID
* BYU_CLIENT_SECRET

If they are included in the parameter store, include the parameter_header in the config (see below) and set the credential_method to aws_ssm.  For example, if I have a parameter named "lms-event-integration.dev.BYU_CLIENT_ID" and another named "lms-event-integration.dev.BYU_CLIENT_SECRET" then my parameter_header would be "lms-event-integration.dev".  

If you are not using the parameter store, you must have those values set as environment variables.

```
var byu = require('byu-request')
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
```
NOTE: "aws-ssm" is used to fetch parameters stored in the Amazon Parameter Store.  For more information, see http://docs.aws.amazon.com/systems-manager/latest/userguide/systems-manager-paramstore.html and http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/SSM.html.

For more information on BYU APIs see https://api.byu.edu/store



## Future Work
* There probably isn't a need to get the aws parameters every time.  Can you set them as enviroment variables?
