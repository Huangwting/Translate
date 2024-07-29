import copy
import sys
from urllib.parse import unquote


class HttpRequest:
    def __init__(self, method="", url="", headers=None, body=""):
        self.method = method
        spl = url.split("://", 1)
        scheme = 'http'
        if len(spl) > 1:
            scheme = spl[0]
            url = spl[1]
        query = {}
        spl = url.split('?', 1)
        url = spl[0]
        if len(spl) > 1:
            for kv in spl[1].split("&"):
                spl = kv.split("=", 1)
                key = spl[0]
                value = ""
                if len(spl) > 1:
                    value = spl[1]
                if key != '':
                    key = unquote(key)
                    value = unquote(value)
                    if key in query:
                        query[key].append(value)
                    else:
                        query[key] = [value]
        spl = url.split('/', 1)
        host = spl[0]
        if len(spl) > 1:
            url = '/' + spl[1]
        else:
            url = '/'

        self.scheme = scheme
        self.host = host
        self.uri = url
        self.query = query
        if headers is None:
            self.headers = {}
        else:
            self.headers = copy.deepcopy(headers)
        if sys.version_info.major < 3:
            self.body = body
        else:
            self.body = body.encode("utf-8")