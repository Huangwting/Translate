<template>
  <div class="main">
    <div class="container">
      <el-form :model="dataForm"
        ref="dataForm"
        @keyup.enter.native="dataFormSubmit()"
        label-width="80px">

        <div>
          <span class="gradient-text">文本翻译：</span>
            <el-button plain @click="toHome()">返回主页</el-button>
          </div>
          <div style="height: 40px;"></div>

        <div >
          <el-form-item label="输入文本：" prop="txtInput">
            <textarea id="txtInput" v-model="dataForm.txtInput">
            </textarea>
          </el-form-item>
        </div>

        <div class="radio-button-container">
          <el-form-item label="选择翻译方式：">
            <div style="height: 20px;"></div>
            <el-radio-group v-model="dataForm.styleType">
              <el-radio :label="1">中译英</el-radio>
              <el-radio :label="0">英译中</el-radio>
            </el-radio-group>
            <div style="height: 20px;"></div>
            <el-button type="primary" plain @click="dataFormSubmit()">翻译</el-button>
          </el-form-item>
        </div>

        <div style="height: 40px;"></div>
        <div >
          <el-form-item label="翻译文本：">
            <textarea name="txtOutput" id="txtOutput"  v-model="dataForm.txtOutput">
            </textarea>
          </el-form-item>
        </div>

      </el-form>
    </div>
  </div>
</template>

<script>

  export default {
    data () {
      return {
        dataForm: {
          txtInput: "",
          styleType: 1,
          txtOutput: ""
        }
      }
    },
    methods: {
      init () {

      },
      // 表单提交
      dataFormSubmit () {
        this.dataForm.txtOutput = ""
        var fromParam
        var toParam
        if(this.dataForm.styleType == 1) {
          fromParam = 'zh'
          toParam = 'en'
        } else {
          fromParam = 'en'
          toParam = 'zh'
        }

        this.$http({
          url: this.$http.adornUrl('/textTrans'),
          method: 'get',
          params: this.$http.adornParams({
            'orgLangTxt' : this.dataForm.txtInput,
            'fromParam' : fromParam,
            'toParam' : toParam
          })
        }).then(({ data }) => {
          console.info(data)
          console.info(data["translated_text"])
          if(data["translated_text"] != undefined && data["translated_text"] != '' ) {
            this.dataForm.txtOutput = data["translated_text"]
          }
        })
      },
      toHome() {
        this.$router.push({
          path: '/'
        })
      }
    }
  }
</script>

<style>
.main {
  height: 100%;
  width: 100%;
  font: 16px Arial;
  color:darkslategray;
}

#txtInput {
  height: 200px;
  width: 600px;
  background-color:floralwhite
}

#txtOutput {
  height: 200px;
  width: 600px;
  background-color:floralwhite
}

.container {
  display: flex;
  align-items: center;
  display: flex;
  justify-content: center;
}

.radio-button-container {
  display: flex;
  align-items: center;
  gap: 20px; /* 使用gap来设置元素之间的间隔 */
  padding-top: 50px;
}

.container button {
  /* 按钮样式 */
  padding: 5px 20px;
  border: 1px solid #ccc;
  background-color: #f8f8f8;
  cursor: pointer;
  transition: background-color 0.3s;
  border-radius: 10px; /* 设置圆角大小 */
}

.container textarea{
  font-size: 18px;
}
</style>



