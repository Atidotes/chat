# chat聊天系统

## 项目介绍

>chat聊天系统是基于`node.js`的`koa`框架作为后端，使用`vue3 + TypeScript + pinia`作为前端页面，主要使用`socket.io`插件进行实时通讯 **(目前还在开发阶段)**

**一、 web目录为前端页面**

**1. 项目安装依赖**

``` shell
npm install
```

**2. 项目启动**

``` shell
npm run dev # 以生产模式启动
npm run pro # 以开发模式启动
```

**3. 项目编译**

``` shell
npm run build:dev # 以开发模式编译
npm run build:pro # 以生产模式编译
```

**4. 项目预览**

``` shell
npm run preview
```

**二、 server目录为后端页面**

>> 刚接触`node.js`不久，对`node.js`的配置还不是很熟练。目前只会简单的写一下接口，操作`MongoDB`数据库存储数据。还存在一些问题，希望大佬能够指出来，及时更改错误。

**1. 项目安装依赖**

``` shell
npm install
```

**2. 项目启动**

``` shell
npm start  # 为生产环境启动命令
npm run serve # 为开发环境启动命令(需要全局安装nodemon)
```

**3. 项目配置**

因为这个项目中使用到了邮箱验证，所以，需要申请邮箱验证的 POP3/SMTP服务。此项目使用的是QQ邮箱验证，因此需要前往QQ邮箱开启 POP3/SMTP服务 后，获取到授权码，需要在根目录下创建`.env`文件，文件内容如下：

``` env
# 邮箱
APP_MAIL = '××××××××××@qq.com'

# 邮箱授权码
APP_KEY = '××××××××××××××××'
```

**三、项目部署**

>> 作者对与项目部署还不是很熟悉，只会通过宝塔面板进行简单的部署操作

**(1) 前端项目部署**

1. 项目打包

``` shell
npm run build:pro # 部署到服务器上需要以生产模式编译
```

2. 项目部署到服务器

可以借助`WinSCP`工具进行上传到服务器中，把文件整体上传。上传到服务器后需要配置代理，如下：

``` Nginx
listen 80; # 根据自己的需要开启监听的端口号
server_name 127.0.0.1; # 项目地址 这里就先用本地地址代替
index index.php index.html index.htm default.php default.htm default.html; # 项目首先匹配的首页文件
root /www/wwwroot/admin; # 项目运行目录

# 请求中带上/api的都会被转发到我们的后端地址
location /admin {
  add_header 'Access-Control-Allow-Origin' '*';
  # 这里是你要代理的地址
  proxy_pass http://127.0.0.1:3001; # 这里就先用本地地址代替
}
```

**(2) 后端部署**

1. 项目部署到服务器

目前不知道`node.js`怎么打包上传到服务器上，只知道一种解决方案。首先需要把项目中的`node_modules`目录去除，然后把剩下的项目整体上传到服务器，再通过`Xshell 7`工具，在服务器中安装依赖包。再通过宝塔面板的`PM2`管理器(PM2需要在商店下载)进行启动项目

**四、项目问题**

**(1) socket.io部署问题**

1. 问题说明  

使用`socket.io`完成及时通讯，在本地环境运行是没有问题的。但在服务器上会出现另一个问题，那就是在服务器上部署后端代码只能开启一个端口号，而`socket.io`会另外占用一个端口号，并且不能与`koa`的端口号合并。这样会出现一个问题就是前端页面可以正常的请求接口，一旦涉及到`socket.io`的有关请求，便会请求失败，导致项目在服务器上无法运行。在宝塔面板和服务器运营商的安全组也放开了。就是无法正常使用，在服务器上启动项目是正常的，使用`PM2`启动就会造成项目无法实现及时通讯。望给位大佬能指点迷津，万分感谢。

2. 解决方案

不知道这样解决问题是否正确，但通过验证，他确实可以解决我目前的这个问题，就是修改配置文件即可解决。配置如下：
``` Nginx
listen 80; # 根据自己的需要开启监听的端口号
server_name 127.0.0.1; # 项目地址 这里就先用本地地址代替
index index.php index.html index.htm default.php default.htm default.html; # 项目首先匹配的首页文件
root /www/wwwroot/admin; # 项目运行目录

# 请求中带上/admin的都会被转发到我们的后端地址
location /admin {
  add_header 'Access-Control-Allow-Origin' '*';
  # 这里是你要代理的地址
  proxy_pass http://127.0.0.1:3001; # 这里就先用本地地址代替
}

# 配置添加以下，即可解决上述问题
# 请求中带上/socket.io的都会被转发到我们的后端地址
location /socket.io {
  add_header 'Access-Control-Allow-Origin' '*';
  # 这里是你要代理的地址
  proxy_pass http://127.0.0.1:3030; # 这里就先用本地地址代替
}
```
**(2) 前端项目：ElMessage和ElMessageBox组件找不到问题**

1. 问题说明

在启动项目或编译打包项目时，终端可能会提示如下图所示问题：

![01](./assets/01.png '01')

2. 解决方案

目前项目使用的解决方案，是在`main.ts`文件中进行手动引入，代码如下：

``` TypeScript
import { ElMessage, ElMessageBox } from "element-plus"
import 'element-plus/es/components/message/style/css';
import 'element-plus/es/components/message-box/style/css';

// 挂载全局UI库
app.config.globalProperties.$message = ElMessage
app.config.globalProperties.$messageBox = ElMessageBox
```
在组件中使用方法如下：
``` TypeScript
import { getCurrentInstance } from "vue";

const { proxy } = getCurrentInstance() as any;

proxy.$message({type: "success",message: result.message,});
```
