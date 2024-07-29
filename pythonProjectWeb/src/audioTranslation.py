import requests
import json

from src import customRequest
from src import translation


def audioTrans(orgAudioLangTxt):

    print(orgAudioLangTxt)
    temp_txt = str(orgAudioLangTxt).replace("data:audio/ogg;base64,", "")
    print(temp_txt)
    result = {'code': '9999'}
    # 获得华为api的token
    req = customRequest.HttpRequest('post', "https://iam.cn-north-4.myhuaweicloud.com/v3/auth/tokens")
    req.headers = {"content-type": "application/json"}
    req.body = {
        "auth": {
            "identity": {
                "methods": [
                    "password"
                ],
                "password": {
                    "user": {
                        "name": "wzh",
                        "password": "Apple0216",
                        "domain": {
                            "name": "hid_iv1vizfp23cb8ii"
                        }
                    }
                }
            },
            "scope": {
                "project": {
                    "name": "cn-north-4"
                }
            }
        }
    }

    resp = requests.request(req.method, req.scheme + "://" + req.host + req.uri, headers=req.headers, json=req.body)
    if resp.status_code != 200 and resp.status_code != 201:
        print("error!! status_code is: " + str(resp.status_code))
        result["msg"] = "error"
    else:
        trans_url = ("https://sis-ext.cn-north-4.myhuaweicloud.com/v1/bbde78f5b167455e8dd99c120e820e14/asr/short-audio")
        token_api_resp = resp.headers.get("X-Subject-Token").strip()
        print(token_api_resp)

        trans_headers = {
            'Content-Type': 'application/json',
            'X-Auth-Token': token_api_resp
        }

        body = {
            "config":
            {
                "audio_format": "auto",
                "property": "chinese_8k_common",
                "add_punc": "yes",
                "need_word_info": "yes"
            },
            "data": temp_txt
        }
        resp_trans = requests.post(trans_url, data=json.dumps(body), headers=trans_headers)
        if resp_trans.status_code != 200 and resp_trans.status_code != 201:
            print("resp_trans error!! status_code is: " + str(resp_trans.status_code))
            result["msg"] = "error"
        else:
            resp_json = resp_trans.json()
            result = resp_json
            result["code"] = '0000'
            orgTxt = result["result"]["text"]

            result = translation.trans(orgTxt, "zh", "en")
            print(result)
    return result
