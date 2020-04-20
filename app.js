/*
 * 挂载路由，监听端口启动
 */
var router3 = require('./router3')
var express = require('express')
var router = require('./router')
var bodyParser = require('body-parser')
var session = require('express-session');
var cookieParser=require('cookie-parser')
var app = express()
var crypto = require("crypto");

app.use('/views/',express.static('./views/'))
app.use('/resources/',express.static('./resources/'))
app.use('/node_modules/',express.static('./node_modules/'))
app.use('/upload/',express.static('./upload/'))
//app.use('/armcharts/',express.static('./armcharts/'))
app.use(cookieParser());

app.engine('html', require('express-art-template'))

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
//app.use(cookieParser('sessiontest'));
//app.use(session({
//  secret :  'sessiontest', // ��session id ��ص�cookie ����ǩ��
//  resave : true,
//  saveUninitialized: false, // �Ƿ񱣴�δ��ʼ���ĻỰ
//  cookie : {
//      maxAge : 1000 * 60 * 60, // ���� session ����Чʱ�䣬��λ����
//  }
//}));
// 获取主页
//app.get('/', function (req, res) {
//	
//if(req.session.loginAcc){ //判断session 状态，如果有效，则返回主页，否则转到登录页面
//  res.render('interviews/userlogin/grzl.html');
//}else{
//  res.redirect('interviews/userlogin/login.html');
//}
//})
app.use(router)
app.use("/",router3)
app.listen(3000, function() {
	console.log('running at 3000...')
})

//app.get('/', function (req, res) {
//// 如果请求中的 cookie 存在 isVisit, 则输出 cookie
//// 否则，设置 cookie 字段 isVisit, 并设置过期时间为1分钟
//if (req.cookies.isVisit) {
//  console.log(req.cookies.id);
//  res.send("再次欢迎访问");
//} else {
//  res.cookie('isVisit', 1, {maxAge: 60 * 1000});
//  res.send("欢迎第一次访问");
//}
//});

module.exports = app

