# byu-request
## Usage
The byu-request module looks for the BYU client id and the BYU client secret in the following order:

1. In the config as byuClientId and byuClientSecret
2. Environment variables called BYU_CLIENT_ID and BYU_CLIENT_SECRET
3. In the parameter store as part of a handel environment (handel.readthedocs.io)
4. In the parameter store with an ssmParameterHeader supplied in the config


``` javascript
var byuRequest = require('byu-request')

/* Config Option 1 */
/* byuRequest.config({
    "byuClientId": "a1b2c3d45f",
    "byuClientSecret": "123456789abcdefghijklmn"
}) */

/* Config Options 2 and 3 do not require the config object */

/* Config Option 4 */
/* byuRequest.config({
    "ssmParameterHeader": "myapp.dev",
    "awsRegion": "us-west-2"
}) */

const byu = byuRequest.request;

var requestOptions = {
    'url': 'https://y-stg.byu.edu/ae/prod/class_schedule/cgi/courseSection.cgi/json/20175/psych/350/001',
    'method': 'GET',
    'headers': {
        'Accept': 'application/json'
    }
}

return byu(requestOptions)
    .then((res) => {
        console.log(res);
    })
```
NOTE: "aws-ssm" is used to fetch parameters stored in the Amazon Parameter Store.  For more information, see http://docs.aws.amazon.com/systems-manager/latest/userguide/systems-manager-paramstore.html and http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/SSM.html.

For more information on BYU APIs see https://api.byu.edu/store