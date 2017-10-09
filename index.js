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

const request = require('request-promise')
const AWS = require('aws-sdk')
var config = {};

exports.config = (confParam) => {
    config = confParam;
};

exports.request = function(requestOptions) {
    if(config.byuClientId && config.byuClientSecret) {
        return makeRequest(requestOptions)
    } else if (process.env.BYU_CLIENT_ID && process.env.BYU_CLIENT_SECRET) {
        config.byuClientId = process.env.BYU_CLIENT_ID;
        config.byuClientSecret = process.env.BYU_CLIENT_SECRET;
        return makeRequest(requestOptions)
    } else {
        let parameterHeader;
        if (process.env.HANDEL_APP_NAME && process.env.HANDEL_ENVIRONMENT_NAME) {
            parameterHeader = `${process.env.HANDEL_APP_NAME}.${process.env.HANDEL_ENVIRONMENT_NAME}`
        } else {
            if(config.ssmParameterHeader) {
                parameterHeader = config.ssmParameterHeader
            } else {
                throw Error("When using ssm outside of a handel environment, the ssmParameterHeader parameter is required in config")
            }
        }
        return getParams(parameterHeader)
            .then(() => {
                return makeRequest(requestOptions)
            })
    }
}

function getParams(parameterHeader) {
    let SSM;
    if(config.awsRegion) {
        SSM = new AWS.SSM({ region: config.awsRegion , apiVersion: '2014-11-06'});
    } else {
        throw Error("When using ssm, the awsRegion parameter is required in config")
    }
    var params = {
    Names: [
        `${parameterHeader}.BYU_CLIENT_ID`,
        `${parameterHeader}.BYU_CLIENT_SECRET`
    ],
    WithDecryption: true
    };
    return SSM.getParameters(params).promise()
        .then((data) => {
            for (let i = 0; i < data.Parameters.length; i++) {
                if (data.Parameters[i].Name == `${parameterHeader}.BYU_CLIENT_ID`) {
                    config.byuClientId = data.Parameters[i].Value
                }
                if (data.Parameters[i].Name == `${parameterHeader}.BYU_CLIENT_SECRET`) {
                    config.byuClientSecret = data.Parameters[i].Value
                }
            }
            return;
        })
        .catch(error => {
            throw Error(`ssm.getParameters failed with error: ${error}`)
        })
}

function makeRequest(requestOptions) {
    if (config.accessToken && tokenValid(config.tokenExpires)) {
        if (!requestOptions.headers) {
            requestOptions.headers = {}
        }
        requestOptions.headers["Authorization"] = "Bearer " + config.accessToken;
        return request(requestOptions)
    } else {
        return newToken()
            .then(() => {
                return makeRequest(requestOptions)
            })
    }
}

function tokenValid(tokenExpires) {
    let now = new Date()
    if (now > tokenExpires) {
        return false;
    }
    return true;
}

function newToken() {
    return request({
        'url': 'https://api.byu.edu:443/token',
        'auth': {
            'user': config.byuClientId,
            'pass': config.byuClientSecret,
            'sendImmediately': true
        },
        'form': {
            'grant_type': 'client_credentials'
        },
        'method': 'POST'
    })
        .then((res) => {
            res = JSON.parse(res);
            config.accessToken = res.access_token;
            let now = new Date()
            config.tokenExpires = new Date(now.getTime() + res.expires_in * 1000);
            return;
        })
}
