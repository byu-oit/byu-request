/*
 * Copyright 2017 Brigham Young University
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * Created by Spencer Holman (saholman)
 * spencer.a.holman@gmail.com
 */

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
