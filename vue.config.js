/*
 * @Author: simon
 * @Description: 
 * @LastEditors: simon
 */
const dotenv = require('dotenv') 
const { GitRevisionPlugin } = require('git-revision-webpack-plugin')
const gitRevisionPlugin = new GitRevisionPlugin({
  commithashCommand: 'rev-parse --short HEAD', // 短哈希
  versionCommand: 'status -s', // 占用 version， 获取是否有当前有改动
});

const path = require('path');
function resolve(dir) {
  return path.join(__dirname, dir)
}

module.exports = {
  configureWebpack: {
    module: {
      rules: [
        {
          test: /\.vue$/,
          use: {
            // loader: "vue-inset-loader",
            // 针对 HBuilder 工具创建的uni-app项目
            loader: path.resolve(__dirname,"./node_modules/vue-inset-loader")
          },
        },
      ],
    },
    resolve: {
      alias: {
        '@': resolve('src'),
        '@mixins': resolve('src/mixins'),
        '@utils': resolve('src/utils'),
        '@api': resolve('src/api'),
        '@store': resolve('src/store'),
        '@pages': resolve('src/pages'),
        '@components': resolve('src/components'),
        '@assets': resolve('src/assets'),
      }
    },
  },
  chainWebpack: config => {  
    config  
      .plugin('define')  
      .tap(args => {  
        args[0]['process.env']['G_C_HASH'] = JSON.stringify(gitRevisionPlugin.commithash())
        args[0]['process.env']['G_WIP'] = gitRevisionPlugin.version() ? true : false
        return args  
      })  
  } 
}




/**  
 * 从.env中获取  
 * 使用了dotenv依赖  
 * 模仿vue-cli-service，不是APP_VUE*这个开头的全局变量就会被过滤掉  
 */  
function getEnvsByDot(){  
  const prefixRE = /^VUE_APP_/  
  let dotEnvs = {}  
  //1.先加载通用环境变量  
  const envPath0 = __dirname+'/.env'  
  const dotEnvsConfig0 = dotenv.config({path:envPath0})  
  console.log(dotEnvsConfig0)  

  if(!dotEnvsConfig0.error){  
      Object.keys(dotEnvsConfig0.parsed).forEach(key => {  
        if (prefixRE.test(key) ) {  
          dotEnvs[key] = dotEnvsConfig0.parsed[key]  
        }  
      })  
  }  
  //2.再加载专属环境变量  
  let env='local'  
  if (process.env.NODE_ENV === 'development') {  
      env='dev'  
  } else if (process.env.NODE_ENV === 'production') {  
      env='prod'  
  }else{  
      env=process.env.NODE_ENV  
  }  

  const envPath = __dirname+'/.env.'+env  
  const dotEnvsConfig = dotenv.config({path:envPath})  
  console.log(dotEnvsConfig)  
  if(!dotEnvsConfig.error){  
      Object.keys(dotEnvsConfig.parsed).forEach(key => {  
        if (prefixRE.test(key) ) {  
          dotEnvs[key] = dotEnvsConfig.parsed[key]  
        }  
      })  
  }  

  return dotEnvs  
}