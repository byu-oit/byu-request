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

/*
First, will check to see if client id and client secret were passed in in the config.
if not, will check for environment variables BYU_CLIENT_ID and BYU_CLIENT_SECRET
If not present in either, will see if they are in the parameter store.  If the application is a handel application, them the names will be automaticly found in the env vars.  If not, then the parameter_header is required in the config.
*/

const byuRequest = require('./index.js')
byuRequest.config({
    // "ssmParameterHeader": "lms-event-integration.dev",
    "awsRegion": "us-west-2"
})
const byu = byuRequest.request;

var requestOptions = {
    'url': 'https://api.byu.edu:443/domains/legacy/academic/registration/studentlog/v1/LOGID/123431242142',
    'method': 'GET',
    'headers': {
        'Accept': 'application/json'
    }
}

return byu(requestOptions)
    .then((res) => {
        console.log(res);
    })
