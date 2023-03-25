# chat聊天系统

## 项目介绍

>chat聊天系统是基于node.js的koa框架作为后端，使用vue3 + TypeScript + pinia作为前端页面，主要使用socket.io插件进行实时通讯 **(目前还在开发阶段)**

**一、 web目录为前端页面**

**1. 项目安装依赖**

``` shell
npm install
```

**2. 项目启动**

``` shell
npm run dev // 以生产模式启动
npm run pro // 以开发模式启动
```

**3. 项目编译**

``` shell
npm run build:dev // 以开发模式编译
npm run build:pro // 以生产模式编译
```

**4. 项目预览**

``` shell
npm run preview
```

**二、 server目录为后端页面**

>> 刚接触node.js不久，对node.js的配置还不是很熟练。目前只会简单的写一下接口，操作MongoDB数据库存储数据。还存在一些问题，希望大佬能够指出来，及时更改错误。

**1. 项目安装依赖**

``` shell
npm install
```

**2. 项目启动**

``` shell
npm start
```

**三、项目部署**

>> 作者对与项目部署还不是很熟悉，只会通过宝塔面板进行简单的部署操作

**(1) 前端项目部署**

1. 项目打包

``` shell
npm run build:pro // 部署到服务器上需要以生产模式编译
```

2. 项目部署到服务器
可以借助`WinSCP`工具进行上传到服务器中，把文件整体上传。上传到服务器后需要配置代理，如下：

``` Nginx
listen 8080; # 根据自己的需要开启监听的端口号
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

**1. socket.io部署问题**
使用`socket.io`完成及时通讯，在本地环境运行是没有问题的。但在服务器上会出现另一个问题，那就是在服务器上部署后端代码只能开启一个端口号，而`socket.io`会另外占用一个端口号，并且不能与`koa`的端口号合并。这样会出现一个问题就是前端页面可以正常的请求接口，一旦涉及到`socket.io`的有关请求，便会请求失败，导致项目在服务器上无法运行。在宝塔面板和服务器运营商的安全组也放开了。就是无法正常使用，在服务器上启动项目是正常的，使用`PM2`启动就会造成项目无法实现及时通讯。望给位大佬能指点迷津，万分感谢。

