<template>
  <div class="main">
    <div class="content">
      <div class="showDiv">
      </div>
      <div style="height: 50px;"></div>
      
      <el-form :model="dataForm"
        ref="dataForm"
        @keyup.enter.native="dataFormSubmit()"
        label-width="80px">
        <div class="button-group">
          <el-form-item>
            <el-row>
              <span class="gradient-text">语音翻译：</span>
              <el-button plain @click="toHome()">返回主页</el-button>
              <el-button type="primary" plain @click="startRecording()">开始录音</el-button>
              <el-button type="primary" plain @click="stopRecording()">停止录音</el-button>
              <el-button type="primary" plain @click="dataFormSubmit()">翻译</el-button>
            </el-row>
          </el-form-item>
        </div>
        <div class="showArea">
          <el-form-item>
            <textarea id="txtInput" v-model="dataForm.txtInput" v-show="false"></textarea>
            <textarea id="txtOutput" v-model="dataForm.txtOutput"></textarea>
          </el-form-item>
        </div>
      </el-form>
    </div>
  </div>
</template>

<script>

  let mediaRecorder
  let chunks = [];
  export default {
    data () {
      return {
        dataForm: {
          txtInput: "",
          txtOutput: ""
        }
      }
    },
    methods: {
      init () {

      },
      toHome() {
        this.$router.push({
          path: '/'
        })
      },
      // 表单提交
      dataFormSubmit () {
        this.dataForm.txtOutput = ""
        this.$http({
          url: this.$http.adornUrl('/audioTrans'),
          method: 'post',
          data: this.$http.adornData({
            'audioText': this.dataForm.txtInput
          })
        }).then(({ data }) => {
          console.info(data)
          if(data != undefined && data["translated_text"] != undefined && data["translated_text"] != '' ) {
            this.dataForm.txtOutput = data["translated_text"]
          }
        })
      },
      startRecording() {
        navigator.mediaDevices
          .getUserMedia({ audio: true })
          .then((stream) => {
            mediaRecorder = new MediaRecorder(stream);
            mediaRecorder.start();

            mediaRecorder.ondataavailable = (event) => {
              chunks.push(event.data);
            };
          })
          .catch((error) => {
            console.error("Error starting recording:", error);
          });
      },
      stopRecording() {
        var dataFromParam = this.dataForm
        console.info(dataFromParam)
        mediaRecorder.stop();

        mediaRecorder.onstop = () => {
          const blob = new Blob(chunks, { type: "audio/ogg" });

          //将Blob 对象转换成字符串
          var reader = new FileReader();

          // 监听reader的load事件，转换完成后会触发
          reader.addEventListener('load', function() {
            // 此时reader.result包含了Base64编码的字符串
            console.info(reader.result)
            dataFromParam.txtInput = reader.result
          });

          // 使用readAsDataURL方法开始转换Blob为Base64
          reader.readAsDataURL(blob);

          chunks = [];
          const audioURL = URL.createObjectURL(blob);
          const audio = new Audio(audioURL);
          audio.play();

          
        };
      }
    }
  }
</script>

<style>
.main {
  height: 100%;
  width: 100%;
  font-size: 20px;
  color: #fff;
}

#txtInput {
  height: 200px;
  width: 600px;
  background-color:lightskyblue
}

#txtOutput {
  height: 200px;
  width: 600px;
  background-color:lightgray
}

.button-group {
  display: flex;
  justify-content: center; /* 水平居中 */
  align-items: center; /* 垂直居中 */
  gap: 20px; /* 按钮间隔 */
}

.button-group button {
  /* 按钮样式 */
  padding: 10px 20px;
  border: 1px solid #ccc;
  background-color: #f8f8f8;
  cursor: pointer;
  transition: background-color 0.3s;
  margin: 0 15px; /* 调整这个值来设置按钮之间的间隔 */
  border-radius: 10px; /* 设置圆角大小 */
}

.content button {
  /* 按钮样式 */
  padding: 10px 20px;
  border: 1px solid #ccc;
  background-color: #f8f8f8;
  cursor: pointer;
  transition: background-color 0.3s;
  margin: 0 15px; /* 调整这个值来设置按钮之间的间隔 */
  border-radius: 10px; /* 设置圆角大小 */
}

.showArea {
  display: flex;
  align-items: center;
  display: flex;
  justify-content: center;
  padding-top: 100px;
}

.showDiv {
  display: flex;
  align-items: center;
  display: flex;
  justify-content: center;
}

</style>



