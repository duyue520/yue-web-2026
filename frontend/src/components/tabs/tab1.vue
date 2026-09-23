<template>
    <!-- <span>使用cokie存储保存数据</span> -->
    <div class="mx-auto rounded" style="background: transparent;">
        <v-form fast-fail @submit.prevent>
            <v-text-field
                v-model="color.themecolor"
                label="主题颜色"
                @click="selectcolor='themecolor';colordialog = true"
                readonly
                variant="outlined"
            ></v-text-field>
            <v-text-field
                v-model="color.welcometitlecolor"
                label="标题颜色"
                @click="selectcolor='welcometitlecolor';colordialog = true"
                readonly
                variant="outlined"
            ></v-text-field>
            <v-slider
                class="ml-5 mr-8"
                label="背景亮度"
                color=var(--leleo-vcard-color)
                :max="100"
                :min="50"
                :step="0.5"
                :thumb-size="xs?15:18"
                v-model="brightness"
                thumb-label="always"
            ></v-slider>
            <v-slider
                class="ml-5 mr-8"
                label="模糊度"
                color=var(--leleo-vcard-color)
                :max="20"
                :min="0"
                :thumb-size="xs?15:18"
                :step="0.2"
                v-model="blur"
                thumb-label="always"
            ></v-slider>
            
            <div style="display: flex;justify-content: center;align-items: center;">
                <v-btn :loading="loading1" variant="tonal" class="ma-2" @click="redefault()">恢复</v-btn>
                <v-btn variant="tonal" class="ma-2" @click="cancel()">取消</v-btn>
                <v-btn :loading="loading2" variant="tonal" class="ma-2" @click="submitdata()">确认</v-btn>
            </div>
     
            <v-dialog
                v-model="colordialog"
                width="auto"
                >
                <v-card title="颜色选择器">                   
                    <div class="d-flex flex-column">
                        <v-color-picker
                            v-model="color[selectcolor]"
                            v-model:mode="mode"
                        ></v-color-picker>
                    </div>
                    <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn
                        text="确认"
                        variant="elevated"
                        @click="colordialog = false"
                    ></v-btn>
                    </v-card-actions>
                </v-card>
             </v-dialog>
        </v-form>
    </div>

    <v-snackbar
      :timeout="2000"
      variant="tonal"
      color=var(--leleo-vcard-color)
      rounded="pill"
      v-model="snackbar"
    >
      {{snackbartext}}
    </v-snackbar>
</template>

<script>
import { setCookie, getCookie, eraseCookie } from '../../utils/cookieUtils.js';
import config from '../../config.js';
import { useDisplay } from 'vuetify';
export default {
  emits: ['cancel'],
  setup() {
        const { xs } = useDisplay();
        return { xs };
    },
  data() {
    return {
        loading1: false,
        loading2: false,
        snackbar: false,
        configdata:config,
        snackbartext: '',
        color:{
            "themecolor":'',
            "welcometitlecolor": '',
        },
        brightness: 78,
        blur: 0,
        selectcolor: "themecolor",
        colordialog: false,
        mode: 'hex',
    };
  },
  mounted() {
    if(import.meta.env.VITE_CONFIG){
        this.configdata = JSON.parse(import.meta.env.VITE_CONFIG);
    }
    
    let leleodata = this.getCookie("leleodata");
    if(leleodata){
        this.color = leleodata.color;
        this.brightness = leleodata.brightness;
        this.blur = leleodata.blur;
    }else{
        this.color = this.configdata.color;
        this.brightness = this.configdata.brightness;
        this.blur = this.configdata.blur;
    }
  },
  methods: {
    setCookie,
    getCookie,
    eraseCookie,
    submitdata() {      
        this.loading2 = true
        setTimeout(() => {
            this.loading2 = false;
            // 注意数字String格式化
            this.setCookie('leleodata', {color:this.color,brightness:String(this.brightness),blur:String(this.blur)},0.005);
            location.reload();
        }, 800)   
    },
    redefault(){              
        this.loading1 = true
        setTimeout(() => {
            this.loading2 = false;
            this.eraseCookie('leleodata');
            location.reload();
        }, 800) 
          
    },
    cancel() {
        this.$emit('cancel');
    },
  },
  
};

</script>
