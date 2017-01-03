'use strict';

exports = module.exports = function (options) {

    return {
        protocol: 'oauth2',
        useParamsAuth: true,
        auth: 'https://graph.qq.com/oauth2.0/authorize',
        token: 'https://graph.qq.com/oauth2.0/token',
        profile: function (credentials, params, get, callback) {

            const query = {
                access_token: params.access_token
            };

            get('https://graph.qq.com/oauth2.0/me', query, (data) => {

                const result = JSON.parse(data.substring(data.indexOf('{'), data.lastIndexOf('}') + 1));
                const qs = {
                    access_token: params.access_token,
                    oauth_consumer_key: result.client_id,
                    openid: result.openid,
                    format: 'json'
                };

                get('https://graph.qq.com/user/get_user_info', qs, (body) => {

                    try {
                        const json = JSON.parse(body);
                        credentials.profile = {
                            id: result.openid,
                            nickname: json.nickname,
                            raw: body
                        };

                        return callback();
                    }
                    catch (e) {
                        return callback(e);
                    }
                });
            });
        }
    };
};
