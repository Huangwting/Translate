import json
from flask import Flask, request
from src import translation, audioTranslation
from flask_cors import CORS


app = Flask(__name__)
CORS(app, resources=r'/*')


# 文本翻译接口
@app.route('/api/textTrans', methods=['GET'])
def textTrans():
    orgLangTxt = request.args.get('orgLangTxt')
    fromParam = request.args.get('fromParam')
    toParam = request.args.get('toParam')
    txt = translation.trans(orgLangTxt, fromParam, toParam)
    return txt


# 语音翻译接口
@app.route('/api/audioTrans', methods=['POST'])
def audioTrans():

    data = request.get_data()
    json_data = json.loads(data.decode("UTF-8"))
    audioText = json_data['audioText']
    txt = audioTranslation.audioTrans(audioText)
    return txt

# 启动这个WEB服务
if __name__ == '__main__':
    # app.config['DEBUG'] = True
    app.config.from_file("config.json", load=json.load)
    # 默认为5000端口
    app.run()  # app.run(port=5000)
