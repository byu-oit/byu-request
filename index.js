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

const request = require('request');
var byu_access_token;
var BYU_CLIENT_ID;
var BYU_CLIENT_SECRET;
var AWS;
var parameter_header;
var ssm;

module.exports = function(requestOptions, config, callback) {
    // try{
        if(config.credential_method == 'aws_ssm') {
            AWS = require('aws-sdk');
            parameter_header = config.aws.parameter_header
            var aws_config = { region: config.aws.region };
            ssm = new AWS.SSM(aws_config);
            if(config.aws.aws_params_location == 'file') {
                var credentials = new AWS.SharedIniFileCredentials({profile: 'default'});
                AWS.config.credentials = credentials;
            } else if (config.aws.aws_params_location == 'env_vars') {
                if (!(process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY)) {
                    throw("AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY not set as environment variables")
                }
            } else {
                throw("Invalid aws_params_location");
            }
            getBYUParams(requestOptions, callback)
        } else if(config.credential_method == 'env_vars') {
            if(process.env.BYU_CLIENT_ID && process.env.BYU_CLIENT_SECRET) {
                BYU_CLIENT_ID = process.env.BYU_CLIENT_ID;
                BYU_CLIENT_SECRET = process.env.BYU_CLIENT_SECRET;
            } else {
                throw("BYU environment variables not found. Expection BYU_CLIENT_ID and BYU_CLIENT_SECRET")
            }
            byuProcessRequest(requestOptions, callback)
        } else {
            throw("Invalid credential_method");
        }
    // } catch(err) {
    //     throw("BAD CONFIG: " + err)
    // }
}

function getBYUParams(requestOptions, callback) {
    var params = {
      Names: [
        'lms-event-integration.dev.BYU_CLIENT_ID',
        'lms-event-integration.dev.BYU_CLIENT_SECRET'
      ],
      WithDecryption: true
    };
    ssm.getParameters(params, function(err, data) {
        if (err) {
            console.log(err, err.stack);
            callback("ssm.getParameters failed")
        }
        else {
          for (i = 0; i < data.Parameters.length; i++) {
              if (data.Parameters[i].Name == "lms-event-integration.dev.BYU_CLIENT_ID") {
                  BYU_CLIENT_ID = data.Parameters[i].Value
                  // console.log(BYU_CLIENT_ID)
              }
              if (data.Parameters[i].Name == "lms-event-integration.dev.BYU_CLIENT_SECRET") {
                  BYU_CLIENT_SECRET = data.Parameters[i].Value
              }
          }
          byuProcessRequest(requestOptions, callback);
        }
    })
}

function byuProcessRequest(requestOptions, callback) {
    if (byu_access_token) {
        makeRequest(requestOptions, callback);
    }
    else {
        getNewAccessToken(requestOptions, callback)
    }
}

function getNewAccessToken(requestOptions, callback) {
    request({
        'url': 'https://api.byu.edu:443/token',
        'auth': {
            'user': BYU_CLIENT_ID,
            'pass': BYU_CLIENT_SECRET,
            'sendImmediately': true
        },
        'form': {
            'grant_type': 'client_credentials'
        },
        'method': 'POST'
    }, function(error, response, body) {
        if(error) {
            console.log(error)
            callback(error)
        }
        body = JSON.parse(body) ;
        byu_access_token = body.access_token;
        makeRequest(requestOptions, callback)
    })
}

function makeRequest(requestOptions, callback) {
    if (!requestOptions.headers) {
        requestOptions.headers = {}
    }
    requestOptions.headers["Authorization"] = "Bearer " + byu_access_token;
    request(requestOptions, callback)
    // Here error handling could be added for status codes and html error pages
}
