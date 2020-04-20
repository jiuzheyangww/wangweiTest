/*
 * 处理路由
 */
var fs = require('fs')
var Pfile = require('./file')
var path = require('path');
var express = require('express')
var router = express.Router()
var crypto = require("crypto");
let mysql = require('mysql');
var session = require('express-session');
var cookieParser=require('cookie-parser')
var formidable=require('formidable');
let connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'mysql',
    database: 'information'
});
router.use(session({
    secret: 'film',
    resave: true,
    saveUninitialized: true,
    cookie: {
        maxAge: 1000 * 60 * 30  // harlf of hour
    }
}));

function get_accesslist(req){
    console.log("i am here")
    var sql1='SELECT commen_userroleinf.loginAcc,commen_userpowerinfo.property,commen_userpowerinfo.people_ctrol FROM commen_userroleinf,commen_userpowerinfo  WHERE commen_userroleinf.property = commen_userpowerinfo.property and  commen_userroleinf.loginAcc='+"\'"+req.session.username+"\'"
    console.log(sql1)
    return new Promise(resolve => {
    connection.query(sql1,function (err,result){
    if(err){
    	return err
    }
    result=JSON.stringify(result)    //先将result转化为String类型的数据
    result=JSON.parse(result)
    var access_list = result[0].people_ctrol
    console.log("get_accesslist "+access_list)
    resolve(access_list)
    })
    })
}

//照片上传
router.post('/resources/editor/kindeditor/jsp/upload_json.jsp',function(req,res,next){
        var form=new formidable.IncomingForm();
        form.keepExtensions=true;     //设置该属性为true可以使得上传的文件保持原来的文件的扩展名。
        
        //form.parse(request, [callback]) 该方法会转换请求中所包含的表单数据，callback会包含所有字段域和文件信息
       
       function mkdirs(dirpath) {
		    if (!fs.existsSync(path.dirname(dirpath))) {
		      mkdirs(path.dirname(dirpath));
		    }
//		    else{
//		    	fs.mkdirSync(dirpath);
//		    }
		}
		var data=new Date();
		var year=data.getFullYear();
		var month=data.getMonth()+1;
		 month = month < 10 ? '0' + month : month;  
		var day=data.getDate();
		day = day < 10 ? ('0' + day) : day;  
		var url=year.toString()+month.toString()+day.toString();
		var dir='./upload/'+url;
//		console.log(dir);
        var dir1='/upload/'+url+"\/"
		form.uploadDir=__dirname+dir1;   //设置上传文件存放的文件夹，默认为系统的临时文件夹，可以使用fs.rename()来改变上传文件的存放位置和文件名
		console.log(form.uploadDir)
		let myPath = path.resolve(dir);
//		console.log(mkdirs(myPath))
		if(fs.existsSync(myPath))
		{
			form.parse(req,function(err,fields,files){
            if(err){
                throw err;
            }
            var image=files.imgFile;  //这是整个files流文件对象,是转换成有利于传输的数据格式
            var path=image.path;      //从本地上传的资源目录加文件名:如E:\\web\\blog\\upload\\upload_0a14.jpg
            /*下面这里是通过分割字符串来得到文件名*/
            var arr=path.split('\\');//注split可以用字符或字符串分割
            var name=arr[arr.length-1];
            /*上面这里是通过分割字符串来得到文件名*/
            var url=dir1+name;
//          console.log(url);
            var info = {
                "error": 0,
                "url": url
            };
            //info是用来返回页面的图片地址
            return res.send(info);
        })
		}
		if(!fs.existsSync(myPath)){
//			fs.existsSync(myPath) == mkdirs(myPath);
			fs.mkdirSync(myPath);
			form.parse(req,function(err,fields,files){
            if(err){
                throw err;
            }
            var image=files.imgFile;  //这是整个files流文件对象,是转换成有利于传输的数据格式
            var path=image.path;      //从本地上传的资源目录加文件名:如E:\\web\\blog\\upload\\upload_0a14.jpg
            /*下面这里是通过分割字符串来得到文件名*/
            var arr=path.split('\\');//注split可以用字符或字符串分割
            var name=arr[arr.length-1];
            /*上面这里是通过分割字符串来得到文件名*/
            var url=dir1+name;
//          console.log(url);
            var info = {
                "error": 0,
                "url": url
            };
            //info是用来返回页面的图片地址
           return res.send(info);
        })
		}
    })





router.get('/views/detail/yhzx/jslb', function(req,res){
	var inform = req.body
//	console.log(2333)
//	console.log(inform)
req.session.type=req.body.property
var sql="SELECT property ,des FROM commen_userroleinf GROUP BY property"
connection.query(sql,function (err,inform) {
	  if(err){
	    return err;
	  }
	  	  inform=JSON.stringify(inform)    //先将result转化为String类型的数据
	  	  inform=JSON.parse(inform)
//	  console.log(people)
	return res.render('detail/yhzx/jslb.html', {
			inform:inform
		})
	})
	
})
router.get('/views/detail/yhzx/qxs', function(req,res){
//	console.log(req.query.type)
	req.session.type=req.query.type;
	console.log(req.session.type)
	return res.render("detail/yhzx/quanxianshu.html")
//	console.log(inform)
	
})
router.get('/week', function(req,res){
	var inform = req.body
//	console.log(inform)
	
})
router.post('/week', function(req,res){
	var inform = req.body
//	console.log(2333)
//	console.log(inform)
var week=inform.week
//console.log(typeof(week[0]))
console.log(week[week.length-1])
//var week1=week.split(",")
//console.log(inform.week1)
//console.log(week.toString())
	
var sql = 'update commen_userpowerinfo set people_ctrol =' +"\'"+week+"\'"+' where property =' + "\'"+req.session.type+"\'";
//console.log(sql)
connection.query(sql,function (err,people) {
	  if(err){
	    return err;
	  }
	  	  people=JSON.stringify(people)    //先将result转化为String类型的数据
	  	  people=JSON.parse(people)
//	  console.log(people)
	res.render('detail/yhzx/jslb.html', {	
		eople:people
		
		})
	})
	
})
/*
 * ******************************************************************************
 *                                    超管登录
 * **********************************************************************************
 */

router.get('/views/login', function(req,res) {
	var user=req.body;
//	console.log(req.user.username);
	res.render('login.html')
})
router.post('/admin-login', function(req,res) {
//	console.log(req.body)
	var admin = req.body
		//console.log(req.body);
    let loginAcc = admin.username;
    let password = admin.password;
    password+="123456"
    let md5 = crypto.createHash("md5");   //创建哈希
    let newPas = md5.update(password).digest("hex"); 
     req.session.username = loginAcc; // 登录成功，设置 session
      	  	  var sql2 = 'update commen_userroleinf set password ='+ "\'"+newPas+"\'"+ 'where loginAcc =' +"\'"+loginAcc+"\'" ;
//				console.log(sql2)
			     Pfile.selectSql(sql2, function(err, people) {
					if (err) {
						return res.status(500).send('Server error'+err.message)
					}
					})
//  console.log(newPas)
    
	var sql = "select * from commen_userroleinf where property='书记' " 
	Pfile.selectSql(sql, function(err, people) {
		if (err) {
			return res.status(500).send('Server error'+err.message)
		}
		  people=JSON.stringify(people)    //先将result转化为String类型的数据
	  	  people=JSON.parse(people)
//	  	  console.log(people)
	  	  for(var i=0;i<people.length;i++){
	  	  	if(((loginAcc == people[i].loginAcc) && (newPas == people[i].password))){
//	  	  		var sql2 = 'update commen_userroleinf set password ='+newPas+ 'where loginAcc =' +req.session.username ;
//	
//			     Pfile.selectSql(sql2, function(err, people) {
//					if (err) {
//						return res.status(500).send('Server error'+err.message)
//					}
//					})
//	  	  var sql1= 'select integration from people_information  where idCardNum =' +req.session.username ;
//	  	  Pfile.selectSql(sql1, function(err, people1) {
//			if (err) {
//				return res.status(500).send('Server error'+err.message)
//			}
//			  people1=JSON.stringify(people1)    //先将result转化为String类型的数据
//		  	  people1=JSON.parse(people1)
//		  	  var integration1=people1[0].integration+1;
////		  	  console.log(people1[0])
//		  	  var sql22= "update people_information set integration = "+"\ "+integration1 + ' where idCardNum =' +req.session.username ;
//		  	  Pfile.selectSql(sql22, function(err, people) {
//			if (err) {
//				return res.status(500).send('Server error'+err.message)
//			}
//	  	  	})
//	  	  }) 
//		  	  		console.log(req.session.username)
				return res.redirect('/views/admin.html')
			
			} else{
						if(i==people.lenth)
							{
								return res.render('login-fail.html')
							}
				  }
			
	  	  }
//	  	 return callback(err, people);
	})
})

   
   router.get('/views/center/center', function(req, res){
	var sql = 'SELECT * FROM people_information';
	Pfile.searchFile(sql, function(err, people){
		if(err){
			return res.status(500).send('Servor error'+err.message)
		}
		console.log(people)
		res.render(' center/center_right.html',{
			people:people
		})
	})
})
   
   
   
   /*
 * *********************************************************************************
 *                                个人资料
 * *********************************************************************************
 */
   
router.get('/views/interviews/userlogin/dfsj', function(req, res){
	var sql="select name from people_information where idCardNum="+"\'"+req.session.loginAcc+"\'"
	connection.query(sql,function (err,people) {
	  if(err){
	    return err;
	  }
	  	  people=JSON.stringify(people)    //先将result转化为String类型的数据
	  	  people=JSON.parse(people)
	  	  console.log(people[0])
		return res.render('interviews/userlogin/dfsj.html',{
			people:people[0]
		})
	})
})
router.get('/views/interviews/userlogin/zzgxzy', function(req, res){
	res.render('interviews/userlogin/zzgxzy.html')
})
router.get('/views/interviews/userlogin/jdbf', function(req, res){
	if(req.session.loginAcc)
	{
	var sql1 = 'SELECT name FROM people_information where idCardNum='+"\'"+req.session.loginAcc+"\'";
//	console.log(sql1)
	connection.query(sql1,function (err,people1) {
	  if(err){
	    return err;
	  }
	  	  people1=JSON.stringify(people1)    //先将result转化为String类型的数据
	  	  people1=JSON.parse(people1)
		var sql = 'SELECT * FROM heart_help_poorpeople where name='+ "\'"+people1[0].name+"\'";
//	console.log(sql)
	connection.query(sql,function (err,people) {
	  if(err){
	    return err;
	  }
	  	  people=JSON.stringify(people)    //先将result转化为String类型的数据
	  	  people=JSON.parse(people)
//	  console.log(people)
	res.render('interviews/userlogin/jdbf.html', {
			people:people
		})
	})
	})
	}else{
		res.render('interviews/userlogin/login.html')
	}
	
})
router.get('/views/interviews/userlogin/pyjjfz', function(req, res){
//	var sql = 'SELECT * FROM heart_help_poorpeople where name='+"\'"+"农夫山泉"+"\'";
if(req.session.loginAcc)
{
	var sql = 'SELECT * FROM heart_educatepovertypeople where idCardNum=' +"\'"+req.session.loginAcc+"\'";
//	console.log(sql)
	connection.query(sql,function (err,people) {
	  if(err){
	    return err;
	  }
	  	  people=JSON.stringify(people)    //先将result转化为String类型的数据
	  	  people=JSON.parse(people)
//	  console.log(people)
	res.render('interviews/userlogin/pyjjfz.html', {
			people:people
		})
	})
}else{
	res.render('interviews/userlogin/login.html')
}
	
})
router.get('/views/interviews/userlogin/pkhgl', function(req, res){
//	var sql = 'SELECT * FROM heart_help_poorpeople where name='+"\'"+"农夫山泉"+"\'";
	var sql = 'SELECT name FROM people_information where idCardNum='+"\'"+req.session.loginAcc+"\'";
//	console.log(sql)
	connection.query(sql,function (err,people1) {
	  if(err){
	    return err;
	  }
	  	  people1=JSON.stringify(people1)    //先将result转化为String类型的数据
	  	  people1=JSON.parse(people1)
//	  console.log(people)
var sql1="select * from heart_help_poorpeople where name="+"\'"+people1[0].name+"\'"
//console.log(sql1)
connection.query(sql1,function (err,people) {
	  if(err){
	    return err;
	  }
	  	  people=JSON.stringify(people)    //先将result转化为String类型的数据
	  	  people=JSON.parse(people)
	  	  console.log(people)
	res.render('interviews/userlogin/pkhgl.html', {
			people:people
		})
      })
	})
})
router.get('/views/interviews/userlogin/ztdr', function(req, res){
	var sql = 'SELECT * FROM vital_commitytday ';
//	console.log(sql)
	connection.query(sql,function (err,inform) {
	  if(err){
	    return err;
	  }
	  	  inform=JSON.stringify(inform)    //先将result转化为String类型的数据
	  	  inform=JSON.parse(inform)
//	  console.log(inform)
	res.render('interviews/userlogin/ztdr.html', {
			inform:inform
		})
	})
})
router.get('/views/interviews/userlogin/zszzsh', function(req, res){
	var sql = 'SELECT * FROM organazition_life ';
//	console.log(sql)
	connection.query(sql,function (err,inform) {
	  if(err){
	    return err;
	  }
	  	  inform=JSON.stringify(inform)    //先将result转化为String类型的数据
	  	  inform=JSON.parse(inform)
//	  console.log(inform)
	res.render('interviews/userlogin/zszzsh.html', {
			inform:inform
		})
	})
})
router.get('/views/interviews/userlogin/shyk', function(req, res){
	var sql = 'SELECT * FROM threeandone_activityinformation ';
//	console.log(sql)
	connection.query(sql,function (err,inform) {
	  if(err){
	    return err;
	  }
	  	  inform=JSON.stringify(inform)    //先将result转化为String类型的数据
	  	  inform=JSON.parse(inform)
//	  console.log(inform)
	res.render('interviews/userlogin/shyk.html', {
			inform:inform
		})
	})
})
router.get('/views/interviews/userlogin/jyjl', function(req, res){
	res.render('interviews/userlogin/jyjl.html')
})
router.get('/views/interviews/userlogin/jyxc', function(req, res){
	res.render('interviews/userlogin/jyxc.html')
})
router.post('/views/interviews/userlogin/jyxc', function(req, res){
	var people=req.body;
	console.log(people)
	var maxid = "select max(id) from web_ctrol_advice"
		//console.log(maxid)
		connection.query(maxid,function (err,result) {
		  if(err){
		    return err;
		  }
		  result=JSON.stringify(result)    //先将result转化为String类型的数据
	  	  result=JSON.parse(result)
	  	  var ret = result[0]
		  var peopleId = ret['max(id)'] + 1
			console.log(peopleId)
			var add="insert into web_ctrol_advice values("
			 +  peopleId + ","
			  + "\'" + people.title + "\'" + "," 
			   +"\'" + people.writepeople + "\'" + ","
			    +"\'" + "" + "\'" + ","
			   +"\'" + "" + "\'" + "," 
			   + "\'" + people.acceptdepartment + "\'" + ","
			   + "\'" + "已接受"+ "\'" +  ","
			     + "\'" + people.connectphonee + "\'" +  ","
			      + "\'" + people.address + "\'" +  ","
			      + "\'" + people.e_mail + "\'" +  ","
			        + "\'" + people.content + "\'" + ")"
//	console.log(add)
			connection.query(add,function (err,result) {
			  if(err){
			    return err;
			  }
			  res.render('interviews/dyzj/dyzj.html')
			})
	})
})
//党员之家积分统计
router.get('/views/interviews/dyzj/dyzj-jftj', function(req, res){
		var  sql1="SELECT name,integration FROM people_information  group by integration order by integration desc limit 10"
//	console.log(sql1)
	Pfile.selectSql( sql1,function(err, inform) {
		if(err){
			return res.status(500).send('Servor error')
		}
		 inform=JSON.stringify(inform)    //先将result转化为String类型的数据
	  	  inform=JSON.parse(inform)
	  	   var ret1 = inform
	  	   for(var i=0;i<inform.length;i++)
	  	   {
	  	   	ret=ret1[i];
	  	   	ret1[i].num=ret['integration']
	  	   	ret1[i].rank=i+1
//	  	   	delete inform[i]['count(integration)']
	  	   }
	  	var  sql2="SELECT belongorganazation,sum(integration) FROM people_information  group by belongorganazation order by sum(integration) desc"
//	console.log(sql1)
		Pfile.selectSql( sql2,function(err, inform1) {
		if(err){
			return res.status(500).send('Servor error')
		}
		 inform1=JSON.stringify(inform1)    //先将result转化为String类型的数据
	  	  inform1=JSON.parse(inform1)
	  	   var ret2 = inform1
	  	   for(var i=0;i<inform1.length;i++)
	  	   {
	  	   	ret22=ret2[i];
	  	   	inform1[i].totalscore=ret22['sum(integration)']
	  	  	inform1[i].rank1=i+1
	  	   	delete inform1[i]['sum(integration)']
//	  	   	delete inform[i]['count(integration)']
	  	   }
	  	   console.log(ret2)
//	  	   console.log(inform)
	  	   res.render('interviews/dyzj/dyzj-jftj.html',{
			inform: inform,
			inform1:inform1 
			})
		})
	 })   
	
//	res.render('interviews/dyzj/dyzj-jftj.html')
})
//router.get('/views/interviews/template/gd-ncdj', function(req, res){
//	res.render('interviews/template/gd-ncdj.html')
//})

   /*
 * *********************************************************************************
 *                                党建要问更多
 * *********************************************************************************
 */

router.get('/views/interviews/template/gd-ncdj', function(req, res){
	res.render('interviews/template/gd-ncdj.html')
})
router.get('/views/interviews/template/gd-djyw', function(req, res){
	res.render('interviews/template/gd-djyw.html')
})
router.get('/views/interviews/template/gd-sqdj', function(req, res){
	res.render('interviews/template/gd-sqdj.html')
})
router.get('/views/interviews/template/gd-fgdj', function(req, res){
	res.render('interviews/template/gd-fgdj.html')
})
router.get('/views/interviews/template/gd-shzzdj', function(req, res){
	res.render('interviews/template/gd-shzzdj.html')
})
router.get('/views/interviews/template/gd-xxdj', function(req, res){
	res.render('interviews/template/gd-xxdj.html')
})
router.get('/views/interviews/template/gd-yydj', function(req, res){
	res.render('interviews/template/gd-yydj.html')
})
router.get('/views/interviews/template/gd-jgdj', function(req, res){
	res.render('interviews/template/gd-jgdj.html')
})
router.get('/views/interviews/template/gd-gqdj', function(req, res){
	res.render('interviews/template/gd-gqdj.html')
})
   
/*
 * *********************************************************************************
 *                                数据统计的图片类型
 * *********************************************************************************
 */
router.get('/views/armcharts/samples/_usingThemes', function(req, res){
	res.render('armcharts/samples/_usingThemes.html')
})

//数据统计的图片类型
/*
 * *********************************************************************************
 *                                主页以及普通页面
 * *********************************************************************************
 */

//*******************************************地图****************

//router.get('/views/interviews/zzgl/map', function(req, res){
//	res.render('interviews/zzgl/map.html')
//})

router.get('/views/interviews/zzgl/login', function(req, res){
	res.render('interviews/zzgl/login.html')
})

router.get('/', function(req, res){
//	if(req.session.loginAcc){ //判断session 状态，如果有效，则返回主页，否则转到登录页面
//		
//		
//	var sql = 'SELECT * FROM people_information where idCardNum=' +req.session.loginAcc;
//	Pfile.searchFile(sql, function(err, people1){
//		if(err){
//			return res.status(500).send('Servor error'+err.message)
//		}
//		console.log(people1)
//		people1=JSON.stringify(people1)    //先将result转化为String类型的数据
//	  	people1=JSON.parse(people1)
//	  	console.log(people1)
//			res.render('interviews/userlogin/grzl.html',{
//				people1: people1[0]
//			});
//	})
//	}else{
			//res.redirect('interviews/userlogin/login.html');
			res.render('entrace.html')
//		}
	
})
/*
 * ****************************************************************************
 *                                  网站详细内容
 * ****************************************************************************
 */

/*
 * 
 * 
 */


router.get('/interviews/djzc/djzc', function(req, res){
	//党建要问
//	console.log('233')
	var sql = 'SELECT * FROM web_ctrol_resourcectrol';
	connection.query(sql,function (err,news) {
	  if(err){
	    return err;
	  }
	  news=JSON.stringify(news)    //先将result转化为String类型的数据
	  	  news=JSON.parse(news)
	  //console.log(news)
	res.render('interviews/djzc/djzc.html', {
			news: news
		})
	})
})
/*
 * ************************************************************************************
 *                                  页面渲染模板
 * *************************************************************************************
 */
//党建之窗上半部分的模板
router.get('/views/interviews/template/djzc-news', function(req, res){
	
	console.log(req.query.id)
	var sql = 'SELECT * FROM web_ctrol_resourcectrol where  id = ' + req.query.id;
	if(req.session.loginAcc)
	{
	Pfile.searchById(sql,parseInt(req.query.id), function (err, news) {
		if (err) {
			return err;
		}
		 	  news=JSON.stringify(news)    //先将result转化为String类型的数据
		  	  news=JSON.parse(news)
//		  	  console.log(news)
			var sql1= 'select integration from people_information  where idCardNum =' +req.session.loginAcc ;
	  	  Pfile.selectSql(sql1, function(err, people1) {
			if (err) {
				return res.status(500).send('Server error'+err.message)
			}
			  people1=JSON.stringify(people1)    //先将result转化为String类型的数据
		  	  people1=JSON.parse(people1)
		  	  var integration1=people1[0].integration+1;
//		  	  console.log(people1[0])
		  	 	  var sql2= 'update people_information set integration = ' + "\ "+integration1 + ' where idCardNUm =' +req.session.loginAcc ;
		  	  Pfile.selectSql(sql2, function(err, people) {
			if (err) {
				return err;
			}
	  	  	})
	  	  })
//		console.log(news)
		return res.render('interviews/template/djzc-news-template.html', {
			news:news 
		})
	})
	}else{
		Pfile.searchById(sql,parseInt(req.query.id), function (err, news) {
		if (err) {
			return err;
		}
		 	  news=JSON.stringify(news)    //先将result转化为String类型的数据
		  	  news=JSON.parse(news)
		  	  return res.render('interviews/template/djzc-news-template.html', {
			news:news 
		})
	})
	}
})
//党建之窗上半部分的模板的更多的模板
router.get('/views/interviews/template/djzc-gddjyw-djyw', function(req, res){
//	console.log(req.query);
	var sql = 'SELECT * FROM web_ctrol_resourcectrol where  belongName = '+"\'" + req.query.type+"\'";
	console.log(sql)
	
	connection.query(sql,function (err,news) {
	  if(err){
	    return err;
	  }
	  news=JSON.stringify(news)    //先将result转化为String类型的数据
	  news=JSON.parse(news)
//	  console.log(news)
	return res.render('interviews/template/djzc-gddjyw-djyw.html', {
			news: news
		})
	})
})
router.get('/views/interviews/template/jcdj', function(req, res){
//	console.log(req.query);
	var sql = "SELECT * FROM web_ctrol_resourcectrol where  belongName ='党建要闻' or belongName ='农村党建' or belongName ='社区党建' or belongName ='非公党建' or belongName ='社会组织党建' or belongName ='学校党建' or belongName ='医院党建' or belongName ='机关党建' or belongName ='国企党建'  ";
	console.log(sql)
	
	connection.query(sql,function (err,news) {
	  if(err){
	    return err;
	  }
	  news=JSON.stringify(news)    //先将result转化为String类型的数据
	  	  news=JSON.parse(news)
	  console.log(news)
	res.render('interviews/template/djzc-gddjyw-djyw.html', {
			news: news
		})
	})
})
//党建之窗----干部工作----模板
router.get('/views/interviews/template/djzc-gbgz', function(req, res){
	var sql = 'SELECT * FROM web_ctrol_resourcectrol where id = ' + req.query.id;
//	console.log(sql)
if(req.session.loginAcc)
{
	Pfile.searchById(sql,parseInt(req.query.id), function (err, inform) {
		if (err) {
			return res.status(500).send('Server error'+err.message)
		}
		 inform=JSON.stringify(inform)    //先将result转化为String类型的数据
		 inform=JSON.parse(inform)
		var sql1= 'select integration from people_information  where idCardNum =' +req.session.loginAcc ;
	  	  Pfile.selectSql(sql1, function(err, people1) {
			if (err) {
				return res.status(500).send('Server error'+err.message)
			}
			  people1=JSON.stringify(people1)    //先将result转化为String类型的数据
		  	  people1=JSON.parse(people1)
		  	  var integration1=people1[0].integration+1;
//		  	  console.log(people1[0])
		  	  	  var sql2= 'update people_information set integration = ' + "\ "+integration1 + ' where idCardNUm =' +req.session.loginAcc ;
		  	  Pfile.selectSql(sql2, function(err, people) {
			if (err) {
				return res.status(500).send('Server error'+err.message)
			}
	  	  	})
	  	  })
		res.render('interviews/template/djzc-gbgz-template.html', {
			inform:inform 
		})
	})
}else{
	Pfile.searchById(sql,parseInt(req.query.id), function (err, inform) {
		if (err) {
			return res.status(500).send('Server error'+err.message)
		}
		 inform=JSON.stringify(inform)    //先将result转化为String类型的数据
		 inform=JSON.parse(inform)
		 res.render('interviews/template/djzc-gbgz-template.html', {
			inform:inform 
		})
	})
}
})
//党建之窗----干部工作----更多模板
router.get('/views/interviews/template/djzc-gdgbgz-gbgz', function(req, res){
	var sql = 'SELECT * FROM web_ctrol_resourcectrol where  belongName = '+"\'" + req.query.type+"\'";
//	console.log(sql)
	
	connection.query(sql,function (err,news) {
	  if(err){
	    return err;
	  }
	  news=JSON.stringify(news)    //先将result转化为String类型的数据
	  	  news=JSON.parse(news)
	  //console.log(news)
	res.render('interviews/template/djzc-gdgbgz-gbgz.html', {
			news: news
		})
	})
})
router.get('/views/interviews/template/gdgbgz', function(req, res){
	var sql = "SELECT * FROM web_ctrol_resourcectrol where  belongName ='干部管理' or belongName ='干部教育' or belongName ='干部监督' ";
//	console.log(sql)
	
	connection.query(sql,function (err,news) {
	  if(err){
	    return err;
	  }
	  news=JSON.stringify(news)    //先将result转化为String类型的数据
	  	  news=JSON.parse(news)
	  //console.log(news)
	res.render('interviews/template/djzc-gdgbgz-gbgz.html', {
			news: news
		})
	})
})
//党建之窗----人才工作----模板
router.get('/views/interviews/template/djzc-rcgz', function(req, res){
	var sql = 'SELECT * FROM web_ctrol_resourcectrol where  id = ' + req.query.id;
//	console.log(sql)
if(req.session.loginAcc){
	Pfile.searchById(sql,parseInt(req.query.id), function (err, inform) {
		if (err) {
			return res.status(500).send('Server error'+err.message)
		}
		 inform=JSON.stringify(inform)    //先将result转化为String类型的数据
		 inform=JSON.parse(inform)
		var sql1= 'select integration from people_information  where idCardNum =' +req.session.loginAcc ;
	  	  Pfile.selectSql(sql1, function(err, people1) {
			if (err) {
				return res.status(500).send('Server error'+err.message)
			}
			  people1=JSON.stringify(people1)    //先将result转化为String类型的数据
		  	  people1=JSON.parse(people1)
		  	  var integration1=people1[0].integration+1;
//		  	  console.log(people1[0])
		  	 	  var sql2= 'update people_information set integration = ' + "\ "+integration1 + ' where idCardNUm =' +req.session.loginAcc ;
		  	  Pfile.selectSql(sql2, function(err, people) {
			if (err) {
				return res.status(500).send('Server error'+err.message)
			}
	  	  	})
	  	  })
		res.render('interviews/template/djzc-rcgz-template.html', {
			inform:inform 
		})
	})
}else{
	Pfile.searchById(sql,parseInt(req.query.id), function (err, inform) {
		if (err) {
			return res.status(500).send('Server error'+err.message)
		}
		 inform=JSON.stringify(inform)    //先将result转化为String类型的数据
		 inform=JSON.parse(inform)
		 res.render('interviews/template/djzc-rcgz-template.html', {
			inform:inform 
		})
	})
}
})
//党建之窗----人才工作----更多模板
router.get('/views/interviews/template/djzc-gdrcgz-rcgz', function(req, res){
	var sql = 'SELECT * FROM web_ctrol_resourcectrol where  belongName = '+"\'" + req.query.type+"\'";
//	console.log(sql)
	
	connection.query(sql,function (err,news) {
	  if(err){
	    return err;
	  }
	  news=JSON.stringify(news)    //先将result转化为String类型的数据
	  	  news=JSON.parse(news)
//	  console.log(news)
	res.render('interviews/template/djzc-gdrcgz-rcgz.html', {
			news: news
		})
	})
})
//人才工作
router.get('/views/interviews/template/gdrczc', function(req, res){
	var sql = "SELECT * FROM web_ctrol_resourcectrol where  belongName ='人才活动 ' or  belongName ='人才政策' or  belongName ='丹凤人才 ' ";
//	console.log(sql)
	
	connection.query(sql,function (err,news) {
	  if(err){
	    return err;
	  }
	  news=JSON.stringify(news)    //先将result转化为String类型的数据
	  	  news=JSON.parse(news)
	  console.log(news)
	res.render('interviews/template/djzc-gdrcgz-rcgz.html', {
			news: news
		})
	})
})
//党建之窗----目标考核----模板
router.get('/views/interviews/template/djzc-mbkh', function(req, res){
	var sql = 'SELECT * FROM web_ctrol_resourcectrol where id = ' + req.query.id;
//	console.log(sql)
if(req.session.loginAcc)
{
	Pfile.searchById(sql,parseInt(req.query.id), function (err, inform) {
		if (err) {
			return res.status(500).send('Server error'+err.message)
		}
		inform=JSON.stringify(inform)    //先将result转化为String类型的数据
		inform=JSON.parse(inform)
		var sql1= 'select integration from people_information  where idCardNum =' +req.session.loginAcc ;
	  	  Pfile.selectSql(sql1, function(err, people1) {
			if (err) {
				return res.status(500).send('Server error'+err.message)
			}
			  people1=JSON.stringify(people1)    //先将result转化为String类型的数据
		  	  people1=JSON.parse(people1)
		  	  var integration1=people1[0].integration+1;
//		  	  console.log(people1[0])
		  	  	  var sql2= 'update people_information set integration = ' + "\ "+integration1 + ' where idCardNUm =' +req.session.loginAcc ;
		  	  Pfile.selectSql(sql2, function(err, people) {
			if (err) {
				return res.status(500).send('Server error'+err.message)
			}
	  	  	})
	  	  })
		res.render('interviews/template/djzc-mbkh-template.html', {
			inform:inform 
		})
	})
}else{
	Pfile.searchById(sql,parseInt(req.query.id), function (err, inform) {
		if (err) {
			return res.status(500).send('Server error'+err.message)
		}
		inform=JSON.stringify(inform)    //先将result转化为String类型的数据
		inform=JSON.parse(inform)
		res.render('interviews/template/djzc-mbkh-template.html', {
			inform:inform 
		})
	})
}
})
//党建之窗----目标考核----更多模板
router.get('/views/interviews/template/djzc-gdmbkh-mbkh', function(req, res){
	var sql = 'SELECT * FROM web_ctrol_resourcectrol where  belongName = '+"\'" + req.query.type+"\'";
//	console.log(sql)
//	console.log(req.query.id)
	connection.query(sql,function (err,news) {
	  if(err){
	    return err;
	  }
	  news=JSON.stringify(news)    //先将result转化为String类型的数据
	  	  news=JSON.parse(news)
//	  console.log(news)
	res.render('interviews/template/djzc-gdmbkh-mbkh.html', {
			news: news
		})
	})
})
router.get('/views/interviews/template/gdmbkh', function(req, res){
	var sql = "SELECT * FROM web_ctrol_resourcectrol where  belongName ='考核文件' or  belongName ='考核指标' or  belongName ='结果通报' ";
//	console.log(sql)
	console.log(req.query.id)
	connection.query(sql,function (err,news) {
	  if(err){
	    return err;
	  }
	  news=JSON.stringify(news)    //先将result转化为String类型的数据
	  	  news=JSON.parse(news)
//	  console.log(news)
	res.render('interviews/template/djzc-gdmbkh-mbkh.html', {
			news: news
		})
	})
})
//党建之窗----三项机制----模板
router.get('/views/interviews/template/djzc-sxjz', function(req, res){
	var sql = 'SELECT * FROM web_ctrol_resourcectrol where id = ' + req.query.id;
//	console.log(sql)
if(req.session.loginAcc)
{
	Pfile.searchById(sql,parseInt(req.query.id), function (err, inform) {
		if (err) {
			return res.status(500).send('Server error'+err.message)
		}
		 inform=JSON.stringify(inform)    //先将result转化为String类型的数据
		 inform=JSON.parse(inform)
		var sql1= 'select integration from people_information  where idCardNum =' +req.session.loginAcc ;
	  	  Pfile.selectSql(sql1, function(err, people1) {
			if (err) {
				return res.status(500).send('Server error'+err.message)
			}
			  people1=JSON.stringify(people1)    //先将result转化为String类型的数据
		  	  people1=JSON.parse(people1)
		  	  var integration1=people1[0].integration+1;
//		  	  console.log(people1[0])
		  	 	  var sql2= 'update people_information set integration = ' + "\ "+integration1 + ' where idCardNUm =' +req.session.loginAcc ;
		  	  Pfile.selectSql(sql2, function(err, people) {
			if (err) {
				return res.status(500).send('Server error'+err.message)
			}
	  	  	})
	  	  })
		res.render('interviews/template/djzc-sxjz-template.html', {
			inform:inform 
		})
	})
}else{
	Pfile.searchById(sql,parseInt(req.query.id), function (err, inform) {
		if (err) {
			return res.status(500).send('Server error'+err.message)
		}
		 inform=JSON.stringify(inform)    //先将result转化为String类型的数据
		 inform=JSON.parse(inform)
		 res.render('interviews/template/djzc-sxjz-template.html', {
			inform:inform 
		})
	})
}
})
//党建之窗----三项机制----更多模板
router.get('/views/interviews/template/djzc-gdsxjz-zcjd', function(req, res){
//	console.log(2333)
//	console.log(req.query);
	var sql = 'SELECT * FROM web_ctrol_resourcectrol where  belongName = '+"\'" + req.query.type+"\'";
	console.log(sql)
	
	connection.query(sql,function (err,news) {
	  if(err){
	    return err;
	  }
	  news=JSON.stringify(news)    //先将result转化为String类型的数据
	  	  news=JSON.parse(news)
//	  console.log(news)
	res.render('interviews/template/djzc-gdsxjz-zcjd.html', {
			news: news
		})
	})
})
//三项机制
router.get('/views/interviews/template/gdsxjz', function(req, res){
//	console.log(2333)
//	console.log(req.query);
	var sql = "SELECT * FROM web_ctrol_resourcectrol where  belongName = '政策解读' or  belongName ='动态信息' or  belongName ='典型案例'";
	console.log(sql)
	
	connection.query(sql,function (err,news) {
	  if(err){
	    return err;
	  }
	  news=JSON.stringify(news)    //先将result转化为String类型的数据
	  	  news=JSON.parse(news)
//	  console.log(news)
	res.render('interviews/template/djzc-gdsxjz-zcjd.html', {
			news: news
		})
	})
})
//党建之窗----考核文件----模板
router.get('/views/interviews/template/djzc-xzzq', function(req, res){
//	console.log(req.query.id)
	var sql = 'SELECT * FROM web_ctrol_resourcectrol where id = ' + req.query.id;
//	console.log(sql)
if(req.session.loginAcc)
{
	Pfile.searchById(sql,parseInt(req.query.id), function (err, inform) {
		if (err) {
			return res.status(500).send('Server error'+err.message)
		}
		inform=JSON.stringify(inform)    //先将result转化为String类型的数据
		inform=JSON.parse(inform)
	var sql1= 'select integration from people_information  where idCardNum =' +req.session.loginAcc ;
	  	  Pfile.selectSql(sql1, function(err, people1) {
			if (err) {
				return res.status(500).send('Server error'+err.message)
			}
			  people1=JSON.stringify(people1)    //先将result转化为String类型的数据
		  	  people1=JSON.parse(people1)
		  	  var integration1=people1[0].integration+1;
//		  	  console.log(people1[0])
		  	  	  var sql2= 'update people_information set integration = ' + "\ "+integration1 + ' where idCardNUm =' +req.session.loginAcc ;
		  	  Pfile.selectSql(sql2, function(err, people) {
			if (err) {
				return res.status(500).send('Server error'+err.message)
			}
	  	  	})
	  	  })
		console.log(inform)
		res.render('interviews/template/djzc-xzzq-template.html', {
			inform:inform 
		})
	})
}else{
	Pfile.searchById(sql,parseInt(req.query.id), function (err, inform) {
		if (err) {
			return res.status(500).send('Server error'+err.message)
		}
		inform=JSON.stringify(inform)    //先将result转化为String类型的数据
		inform=JSON.parse(inform)
		res.render('interviews/template/djzc-xzzq-template.html', {
			inform:inform 
		})
	})
}
})
//党建之窗----考核文件----更多模板
router.get('/views/interviews/template/djzc-gdmbkh-mbkh', function(req, res){
//	console.log(2333)
//	console.log(req.query);
	var sql = 'SELECT * FROM web_ctrol_resourcectrol where  belongName = '+"\'" + req.query.type+"\'";
//	console.log(sql)
	
	connection.query(sql,function (err,news) {
	  if(err){
	    return err;
	  }
	  news=JSON.stringify(news)    //先将result转化为String类型的数据
	  	  news=JSON.parse(news)
//	  console.log(news)
	res.render('interviews/template/djzc-gdmbkh-mbkh.html', {
			news: news
		})
	})
})
//党建之窗----考核文件----更多模板
router.get('/views/interviews/template/djzc-gdmbkh', function(req, res){
	console.log(2333)
	console.log(req.query);
	var sql = 'SELECT * FROM web_ctrol_resourcectrol where  belongName = '+"\'" + req.query.belongName+"\'";
	console.log(sql)
	
	connection.query(sql,function (err,news) {
	  if(err){
	    return err;
	  }
	  news=JSON.stringify(news)    //先将result转化为String类型的数据
	  	  news=JSON.parse(news)
	  //console.log(news)
	return res.render('interviews/template/djzc-gdmbkh-mbkh.html', {
			news: news
		})
	})
})
//党建之窗----组织工作创新----模板
router.get('/views/interviews/template/djzc-zzgzcx', function(req, res){
	var sql = 'SELECT * FROM web_ctrol_resourcectrol where id = ' + req.query.id;
//	console.log(sql)
if(req.session.loginAcc)
{
	Pfile.searchById(sql,parseInt(req.query.id), function (err, inform) {
		if (err) {
			return res.status(500).send('Server error'+err.message)
		}
		 inform=JSON.stringify(inform)    //先将result转化为String类型的数据
		 inform=JSON.parse(inform)
		var sql1= 'select integration from people_information  where idCardNum =' +req.session.loginAcc ;
	  	  Pfile.selectSql(sql1, function(err, people1) {
			if (err) {
				return res.status(500).send('Server error'+err.message)
			}
			  people1=JSON.stringify(people1)    //先将result转化为String类型的数据
		  	  people1=JSON.parse(people1)
		  	  var integration1=people1[0].integration+1;
//		  	  console.log(people1[0])
		  	  var sql2= 'update people_information set integration = ' + "\ "+integration1 + ' where idCardNum =' +req.session.loginAcc ;
		  	  Pfile.selectSql(sql2, function(err, people) {
			if (err) {
				return res.status(500).send('Server error'+err.message)
			}
	  	  	})
	  	  })
		res.render('interviews/template/djzc-zzgzcx-template.html', {
			inform:inform 
		})
	})
}else{
	Pfile.searchById(sql,parseInt(req.query.id), function (err, inform) {
		if (err) {
			return res.status(500).send('Server error'+err.message)
		}
		 inform=JSON.stringify(inform)    //先将result转化为String类型的数据
		 inform=JSON.parse(inform)
		 console.log(inform)
		 res.render('interviews/template/djzc-zzgzcx-template.html', {
			inform:inform 
		})
	})
}
})
//党建之窗----组织工作创新----更多模板
router.get('/views/interviews/template/djzc-gdzzgzcx-zzgzcx', function(req, res){
	 
	var sql = 'SELECT * FROM web_ctrol_resourcectrol where belongName="组织工作创新" ';
	console.log(sql)
	
	connection.query(sql,function (err,news) {
	  if(err){
	    return err;
	  }
	  news=JSON.stringify(news)    //先将result转化为String类型的数据
	  	  news=JSON.parse(news)
	  console.log(news)
	res.render('interviews/template/djzc-gdzzgzcx-zzgzcx.html', {
			news: news
		})
	})
})


//党建之窗----下载专区----模板
router.get('/views/interviews/template/djzc-xzzq', function(req, res){
	var sql = 'SELECT * FROM web_ctrol_resourcectrol where id = ' + req.query.id;
//	console.log(sql)
	Pfile.searchById(sql,parseInt(req.query.id), function (err, inform) {
		if (err) {
			return res.status(500).send('Server error'+err.message)
		}
		res.render('interviews/template/djzc-xzzq-template.html', {
			inform:inform 
		})
	})
})
//党建之窗----下载专区----更多模板
router.get('/views/interviews/template/djzc-gdxzzq-xzzq', function(req, res){
	 
	var sql = 'SELECT * FROM web_ctrol_resourcectrol where  belongName = '+"\'" + req.query.type+"\'";
	console.log(sql)
	
	connection.query(sql,function (err,news) {
	  if(err){
	    return err;
	  }
	  news=JSON.stringify(news)    //先将result转化为String类型的数据
	  	  news=JSON.parse(news)
	  //console.log(news)
	res.render('interviews/template/djzc-gdxzzq-xzzq.html', {
			news: news
		})
	})
})
/*
 * 组织管理
 */
//router.get('/interviews/zzgl/zzgl', function(req, res){
//	var sql = 'SELECT * FROM threeandone_activityinformation'
//	Pfile.searchFile(sql, function(err, inform){
//		if(err){
//			return res.status(500).send('Servor error'+err.message)
//		}
////		console.log(inform)
//		res.render('interviews/zzgl/zzgl.html',{
//			inform:inform
//		})
//	})
//})
////党员大会
//router.get('/views/interviews/zzgl/shyk/dydh', function(req, res){
//	
//if(req.session.username)
//	{
//	var sql1='SELECT commen_userroleinf.loginAcc,commen_userpowerinfo.property,commen_userpowerinfo.people_ctrol FROM commen_userroleinf,commen_userpowerinfo  WHERE commen_userroleinf.property = commen_userpowerinfo.property and  commen_userroleinf.loginAcc='+"\'"+req.session.username+"\'"
//	console.log(sql1)
//	connection.query(sql1,function (err,result) {
//	  if(err){
//	    return err;
//	  }
//	  result=JSON.stringify(result)    //先将result转化为String类型的数据
//	  result=JSON.parse(result) 
// var aa=result[0].people_ctrol
//	var cc=aa.split(',')
//	for(var i=0;i<cc.length;i++)
//	{
//		if(cc!='11')
//		{
//			if(i==cc.length-1)
//			{
//				return res.send("你没有此权限")
//			}else{
//				continue
//			}
//		}else{
//			var sql = 'SELECT * FROM threeandone_activityinformation where type = ' +"\'" + "党员大会" +"\'"
//	//console.log(sql)
//	Pfile.searchFile(sql, function(err, inform){
//		if(err){
//			return res.status(500).send('Servor error'+err.message)
//		}
////		console.log(inform)
//		res.render('interviews/zzgl/shyk/dydh.html',{
//			inform:inform
//		})
//	})
//		}
//	}
//	})
//	}else{
//		res.render('login.html')
//	}
//	
//})
////支委会
//router.get('/views/interviews/zzgl/shyk/zwh', function(req, res){
//	var sql = 'SELECT * FROM threeandone_activityinformation where type = ' +"\'" + "支委会" +"\'"
//	//console.log(sql)
//	Pfile.searchFile(sql, function(err, inform){
//		if(err){
//			return res.status(500).send('Servor error'+err.message)
//		}
////		console.log(inform)
//		res.render('interviews/zzgl/shyk/zwh.html',{
//			inform:inform
//		})
//	})
//})
////党小组会
//router.get('/views/interviews/zzgl/shyk/dxzh', function(req, res){
//	var sql = 'SELECT * FROM threeandone_activityinformation where type = ' +"\'" + "党小组会" +"\'"
//	//console.log(sql)
//	Pfile.searchFile(sql, function(err, inform){
//		if(err){
//			return res.status(500).send('Servor error'+err.message)
//		}
////		console.log(inform)
//		res.render('interviews/zzgl/shyk/dxzh.html',{
//			inform:inform
//		})
//	})
//})
////讲党课
//router.get('/views/interviews/zzgl/shyk/jdk', function(req, res){
//	var sql = 'SELECT * FROM threeandone_activityinformation where type = ' +"\'" + "讲党课" +"\'"
//	//console.log(sql)
//	Pfile.searchFile(sql, function(err, inform){
//		if(err){
//			return res.status(500).send('Servor error'+err.message)
//		}
////		console.log(inform)
//		res.render('interviews/zzgl/shyk/jdk.html',{
//			inform:inform
//		})
//	})
//})
//*************************************换届选举*************************
router.get('views/interviews/zzgl/hjxj', function(req, res){
	res.render('interviews/zzgl/hjxj.html')
})
//**************************************民主生活会*******************
router.get('views/interviews/zzgl/mzshh', function(req, res){
	res.render('interviews/zzgl/mzshh.html')
})
//***************************************组织生活会*******************
router.get('views/interviews/zzgl/zzshh', function(req, res){
	console.log(2333)
	res.render('interviews/zzgl/zzshh.html')
})
//***************************************index_page
router.get('views/interviews/zzgl/index_page', function(req, res){
	res.render('interviews/zzgl/index_page.html')
})
//****************************************民主评议党员****************
router.get('views/interviews/zzgl/mzpydy', function(req, res){
	res.render('interviews/zzgl/mzpydy.html')
})
//*****************************************主题党日*******************
router.get('views/interviews/zzgl/ztdr', function(req, res){
	res.render('interviews/zzgl/ztdr.html')
})
//*****************************************特色党建******************
router.get('views/interviews/zzgl/tsdj', function(req, res){
	res.render('interviews/zzgl/tsdj.html')
})
//组织管理下半部分的图--------------党员队伍建设
router.get('/views/interviews/zzgl/dynldtj', function(req, res){
	var sql = 'SELECT * FROM people_information'
	Pfile.searchFile(sql, function(err, inform){
		if(err){
			return res.status(500).send('Servor error'+err.message)
		}
		inform=JSON.stringify(inform)    //先将result转化为String类型的数据
	  	  inform=JSON.parse(inform)
		console.log(inform)
		res.render('interviews/zzgl/dynldtj.html',{
			inform:inform
		})
	})
})
//组织管理下半部分的图---------------指标变更
router.get('/views/interviews/zzgl/zbbg', function(req, res){
	var sql = 'SELECT * FROM vitalproblem_indexchange'
	Pfile.searchFile(sql, function(err, inform){
		if(err){
			return res.status(500).send('Servor error'+err.message)
		}
		inform=JSON.stringify(inform)    //先将result转化为String类型的数据
	  	  inform=JSON.parse(inform)
		console.log(inform)
		res.render('interviews/zzgl/zbbg.html',{
			inform:inform
		})
	})
})
//组织管理下半部分的图---------------指标销号
router.get('/views/interviews/zzgl/zbxh', function(req, res){
	var sql = 'SELECT * FROM vitalproblem_indexdie'
	Pfile.searchFile(sql, function(err, inform){
		if(err){
			return res.status(500).send('Servor error'+err.message)
		}
		inform=JSON.stringify(inform)    //先将result转化为String类型的数据
	  	  inform=JSON.parse(inform)
		console.log(inform)
		res.render('interviews/zzgl/zbxh.html',{
			inform:inform
		})
	})
})
//组织管理下半部分的图---------------预警督办
router.get('/views/interviews/zzgl/yjdb', function(req, res){
	var sql = 'SELECT * FROM vitalproblem_predit'
	Pfile.searchFile(sql, function(err, inform){
		if(err){
			return res.status(500).send('Servor error'+err.message)
		}
		inform=JSON.stringify(inform)    //先将result转化为String类型的数据
	  	  inform=JSON.parse(inform)
		console.log(inform)
		res.render('interviews/zzgl/yjdb.html',{
			inform:inform
		})
	})
})
//组织管理下半部分的图---------------督察问题
router.get('/views/interviews/zzgl/dcwt', function(req, res){
	var sql = 'SELECT * FROM vitalproblem_supervise_problem'
	Pfile.searchFile(sql, function(err, inform){
		if(err){
			return res.status(500).send('Servor error'+err.message)
		}
		inform=JSON.stringify(inform)    //先将result转化为String类型的数据
	  	  inform=JSON.parse(inform)
		console.log(inform)
		res.render('interviews/zzgl/dcwt.html',{
			inform:inform
		})
	})
})
//组织管理----主题党日----模板
router.get('/views/interviews/template/zzgl-ztdr', function(req, res){
	var sql = 'SELECT * FROM vital_commitytday';
//	console.log(sql)
	Pfile.searchFile(sql, function (err, inform) {
		if (err) {
			return res.status(500).send('Server error'+err.message)
		}
		  inform=JSON.stringify(inform)    //先将result转化为String类型的数据
	  	  inform=JSON.parse(inform)
//		console.log(inform)
		res.render('interviews/template/zzgl-ztdr.html', {
			inform:inform
		})
	})
})

//组织管路----主题党日----更多模板
router.get('/views/interviews/template/zzgl-gdztdr-ztdr', function(req, res){
//	console.log(2333)
//	console.log(req.query);
//var id=parseInt(req.query.id)
//console.log(id)
	var sql = "SELECT * FROM vital_commitytday where id=" +req.query.id ;
//	console.log(sql)
	
	connection.query(sql,function (err,news) {
	  if(err){
	    return err;
	  }
	  news=JSON.stringify(news)    //先将result转化为String类型的数据
	  	  news=JSON.parse(news)
	  console.log(news)
	res.render('interviews/template/zzgl-gdztdr-ztdr.html', {
			news: news
		})
	})
})

/*
 * 党员之家
 */
router.get('/interviews/dyzj/dyzj', function(req, res){
	res.render('interviews/dyzj/dyzj.html')
})
/*
 * 为民服务
 */
router.get('/interviews/wmfw/wmfw', function(req, res){
	res.render('interviews/wmfw/wmfw.html')
})
/*
 * 互动交流
 */
router.get('/interviews/hdjl/hdjl', function(req, res){
	res.render('interviews/hdjl/hdjl.html')
})
router.get('/views/interviews/zzgl/zzgl', function(req, res){
	res.render('interviews/zzgl/zzgl.html')
})
router.get('/views/interviews/dyzj/dyzj', function(req, res){
	res.render('interviews/dyzj/dyzj.html')
})
router.get('/views/interviews/wmfw/wmfw', function(req, res){	 
	var sql="select *from people_information"
	Pfile.searchFile(sql, function(err, people){
		if(err){
			return res.status(500).send('Servor error'+err.message)
		}
		console.log(people)
		res.render('interviews/wmfw/wmfw.html',{
			people:people
		})
	})
//	res.render('interviews/wmfw/wmfw.html')
})
router.get('/views/interviews/hdjl/hdjl', function(req, res){
	res.render('interviews/hdjl/hdjl.html')
})
router.get('/views/entrace', function(req, res){
	res.render('interviews/views/entrace.html')
})
router.get('/views/interviews/djzc/djyw', function(req, res){
	res.render('interviews/djzc/djyw.html')
})
router.get('/views/interviews/djzc/ncdj', function(req, res){
	res.render('interviews/djzc/ncdj.html')
})
router.get('/views/interviews/djzc/fgdj', function(req, res){
	res.render('interviews/djzc/fgdj.html')
})
router.get('/views/interviews/djzc/gqdj', function(req, res){
	res.render('interviews/djzc/gqdj.html')
})
router.get('/views/interviews/djzc/jgdj', function(req, res){
	res.render('interviews/djzc/jgdj.html')
})
router.get('/views/interviews/djzc/shzzdj', function(req, res){
	res.render('interviews/djzc/shzzdj.html')
})
router.get('/views/interviews/djzc/sqdj', function(req, res){
	res.render('interviews/djzc/sqdj.html')
})
router.get('/views/interviews/djzc/xfmf', function(req, res){
	res.render('interviews/djzc/xfmf.html')
})
router.get('/views/interviews/djzc/xxdj', function(req, res){
	res.render('interviews/djzc/xxdj.html')
})
router.get('/views/interviews/djzc/xzzq', function(req, res){
	res.render('interviews/djzc/xzzq.html')
})
router.get('/views/interviews/djzc/ycjy', function(req, res){
	res.render('interviews/djzc/ycjy.html')
})
router.get('/views/interviews/djzc/ncdj', function(req, res){
	res.render('interviews/djzc/ncdj.html')
})
router.get('/views/interviews/djzc/yydj', function(req, res){
	res.render('interviews/djzc/yydj.html')
})
router.get('/views/interviews/djzc/gsgg', function(req, res){
	res.render('interviews/djzc/gsgg.html')
})
router.get('/views/interviews/djzc/zthd', function(req, res){
	res.render('interviews/djzc/zthd.html')
})
router.get('/views/interviews/djzc/zzgzcx', function(req, res){
	res.render('interviews/djzc/zzgzcx.html')
})
//*********************干部工作***************************************
router.get('/views/interviews/djzc/gbgz/gbgl', function(req, res){
	res.render('interviews/djzc/gbgz/gbgl.html')
})
router.get('/views/interviews/djzc/gbgz/gbjd', function(req, res){
	res.render('interviews/djzc/gbgz/gbjd.html')
})
router.get('/views/interviews/djzc/gbgz/gbjy', function(req, res){
	res.render('interviews/djzc/gbgz/gbjy.html')
})
router.get('/views/interviews/djzc/gbgz/gbgz', function(req, res){
	res.render('interviews/djzc/gbgz/gbgz.html')
})
//*****************************************************************
//**********************人才工作*************************************
router.get('/views/interviews/djzc/rcgz/dfrc', function(req, res){
	res.render('interviews/djzc/rcgz/dfrc.html')
})
router.get('/views/interviews/djzc/rcgz/rchd', function(req, res){
	res.render('interviews/djzc/rcgz/rchd.html')
})
router.get('/views/interviews/djzc/rcgz/rczc', function(req, res){
	res.render('interviews/djzc/rcgz/rczc.html')
})
router.get('/views/interviews/djzc/rcgz/rcgz', function(req, res){
	res.render('interviews/djzc/rcgz/rcgz.html')
})
//*****************************************************************
//**********************三项机制************************************
router.get('/views/interviews/djzc/sxjz/dtxx', function(req, res){
	res.render('interviews/djzc/sxjz/dtxx.html')
})
router.get('/views/interviews/djzc/sxjz/dxal', function(req, res){
	res.render('interviews/djzc/sxjz/dxal.html')
})
router.get('/views/interviews/djzc/sxjz/zcjd', function(req, res){
	res.render('interviews/djzc/sxjz/zcjd.html')
})
router.get('/views/interviews/djzc/sxjz/sxjz', function(req, res){
	res.render('interviews/djzc/sxjz/sxjz.html')
})
//*****************************************************************
//**********************目标考核************************************
router.get('/views/interviews/djzc/mbkh/jgtb', function(req, res){
	res.render('interviews/djzc/mbkh/jgtb.html')
})
router.get('/views/interviews/djzc/mbkh/khwj', function(req, res){
	res.render('interviews/djzc/mbkh/khwj.html')
})
router.get('/views/interviews/djzc/mbkh/khzb', function(req, res){
	res.render('interviews/djzc/mbkh/khzb.html')
})
router.get('/views/interviews/djzc/mbkh/mbkh', function(req, res){
	res.render('interviews/djzc/mbkh/mbkh.html')
})
router.get('/views/interviews/djzc/mbkh/jcdjjdpm', function(req, res){
	res.render('interviews/djzc/mbkh/jcdjjdpm.html')
})
//*****************************************************************
router.get('/views/interviews/wmfw/bmfw', function(req, res){
	res.render('interviews/wmfw/bmfw.html')
})
router.get('/views/interviews/wmfw/dycn', function(req, res){
	var sql="select *from inposition_admit where status = '审核通过'"
	Pfile.searchFile(sql, function(err, people){
		if(err){
			return res.status(500).send('Servor error'+err.message)
		}
		console.log(people)
		res.render('interviews/wmfw/dycn.html',{
			people:people
		})
	})
})
router.get('/views/interviews/wmfw/dyzsqdhd', function(req, res){
	res.render('interviews/wmfw/dyzsqdhd.html')
})
router.get('/views/interviews/wmfw/jyxc', function(req, res){
	res.render('interviews/wmfw/jyxc.html')
})
router.get('/views/interviews/hdjl/llls', function(req, res){
	res.render('interviews/hdjl/llls.html')
})
router.get('/views/interviews/hdjl/shmyddc', function(req, res){
	res.render('interviews/hdjl/shmyddc.html')
})
router.get('/views/interviews/hdjl/wspy', function(req, res){
	res.render('interviews/hdjl/wspy.html')
})
//************************************三会一课**************************
router.get('/views/interviews/zzgl/shyk', function(req, res){
	var sql = 'SELECT * FROM threeandone_activityinformation '
	connection.query(sql, function(err, inform){
		if(err){
			return res.status(500).send('Servor error'+err.message)
		}
		//console.log(people)
		res.render('interviews/zzgl/shyk.html',{
			inform:inform
		})
	})
//	res.render('interviews/zzgl/shyk.html')
})
router.get('/views/interviews/zzgl/shyk/shyk-templete', function(req, res){
	var sql = 'SELECT * FROM threeandone_activityinformation where id='+"\'"+req.query.id+"\'"
	console.log(sql)
	Pfile.searchFile(sql, function(err, inform){
		if(err){
			return res.status(500).send('Servor error'+err.message)
		}
//		console.log(inform)
		res.render('interviews/zzgl/shyk.html',{
			inform:inform
		})
	})
//	res.render('interviews/zzgl/shyk.html')
})
router.get('/views/interviews/zzgl/shyk1', function(req, res){
	var sql = 'SELECT * FROM threeandone_activityinformation '  ;
//	console.log(sql)
	Pfile.searchFile(sql, function(err, inform){
		if(err){
			return res.status(500).send('Servor error'+err.message)
		}
//		console.log(inform)
		res.render('interviews/zzgl/shyk1.html',{
			inform:inform
		})
	})
//	res.render('interviews/zzgl/shyk.html')
})

//****************************************党员队伍建设****************
router.get('views/interviews/zzgl/dydwjs', function(req, res){
	res.render('interviews/zzgl/dydwjs.html')
})
//*****************************************指标变更******************
router.get('views/interviews/zzgl/zbbg', function(req, res){
	res.render('interviews/zzgl/zbbg.html')
})
//*****************************************指标销号******************
router.get('views/interviews/zzgl/zbxh', function(req, res){
	res.render('interviews/zzgl/zbxh.html')
})
//*****************************************预警督办*****************
router.get('views/interviews/zzgl/yjdb', function(req, res){
	res.render('interviews/zzgl/yjdb.html')
})
//******************************************督察问题***************
router.get('views/interviews/zzgl/dcwt', function(req, res){
	res.render('interviews/zzgl/dcwt.html')
})
/*
 *党员之家
 */
//我要入党
router.get('views/interviews/dyzj/dyfz/wyrd', function(req, res){
	res.render('interviews/dyzj/dyfz/wyrd.html')
})
//我要入党提交申请
router.post('/views/interviews/dyzj/dyfz/wyrd', function(req, res){
 var maxid = "select max(id) from people_develope"
		//console.log(maxid)
		var people=req.body;
//		console.log(people)
		connection.query(maxid,function (err,result) {
		  if(err){
		    return err;
		  }
		  result=JSON.stringify(result)    //先将result转化为String类型的数据
	  	  result=JSON.parse(result)
	  	  var ret = result[0]
		  var peopleId = ret['max(id)'] + 1
		  console.log(peopleId)

			var add="insert into people_develope values("
			 +  peopleId + ","
			  + "\'" + people.name + "\'" + "," 
			   +"\'" + people.gender + "\'" + ","
			    +"\'" + people.nation + "\'" + ","
			   +"\'" + people.idCardNum + "\'" + "," 
			   + "\'" + people.phoneNum + "\'" + ","
			   + "\'" + people.birthDay + "\'" + ","
			     + "\'" + people.culture_level + "\'" +  ","
			      + "\'" + people.attribute + "\'" +  ","
			       + "\'" + people.onattribute + "\'" +  ","
			        + "\'" + people.positionIt + "\'" +  ","
			         + "\'" + "暂无数据" + "\'" +  ","
			    		+ "\'" + people.workTime + "\'" +  ","
			    		+ "\'" + people.partAndDuty + "\'" +  ","
			    		+ "\'" + people.belongorganazation + "\'" +  ","
						+ "\'" + people.status + "\'" +  ","
			      		+ "\'" + 123456+ "\'"+ ")"
			      console.log(add)
			connection.query(add,function (err,result) {
			  if(err){
			    return err;
			  }
			  return res.send(`<p>你的申请提交成功</p>
				<p>3 秒后返回主页面...</p>
				<script>setTimeout(()=>(location.pathname='/'), 3000)</script>`);
			
		})
	 })
 
})
//*********************************流动党员***********************
router.get('/views/interviews/dyzj/dyfz/lddy', function(req, res){
	res.render('interviews/dyzj/dyfz/lddy.html')
})
//流动党员提交申请
 router.post('/views/interviews/dyzj/dyfz/lddy', function(req, res){
 var maxid = "select max(id) from floatincommity"
		//console.log(maxid)
		var people=req.body;
//		console.log(people)
		connection.query(maxid,function (err,result) {
		  if(err){
		    return err;
		  }
		  result=JSON.stringify(result)    //先将result转化为String类型的数据
	  	  result=JSON.parse(result)
	  	  var ret = result[0]
		  var peopleId = ret['max(id)'] + 1
		  console.log(peopleId)
		  
		  //获取流动时间
		  var date = new Date();
	        var seperator1 = "-";
	        var year = date.getFullYear();
	        var month = date.getMonth() + 1;
	        var strDate = date.getDate();
	        if (month >= 1 && month <= 9) {
	            month = "0" + month;
	        }
	        if (strDate >= 0 && strDate <= 9) {
	            strDate = "0" + strDate;
	        }
	        var currentdate = year + seperator1 + month + seperator1 + strDate;

			var add="insert into floatincommity values("
			 +  peopleId + ","
			  + "\'" + people.name + "\'" + "," 
			  + "\'" + people.gender + "\'" + "," 
			  + "\'" + people.nation + "\'" + "," 
			  + "\'" + people.floatId + "\'" + "," 
			   +"\'" + people.idCardNum + "\'" + "," 
			   + "\'" + people.phoneNum + "\'" + ","
			   + "\'" + people.birthDay + "\'" + ","
			    + "\'" + people.culture_level + "\'" + ","
			    + "\'" + people.attribute + "\'" + ","
   			    + "\'" + people.onattribute + "\'" + ","
				+ "\'" + people.positionIt + "\'" + ","
				+ "\'" + people.partAndDuty + "\'" +  ","
				+ "\'" + people.joinTime + "\'" + ","
				+ "\'" + people.workTime + "\'" + ","
				+ "\'" + "请选择" + "\'" + ","
			     + "\'" + people.floatinname + "\'" +  ","
			      + "\'" + people.floatoutname + "\'" +  ","
			       + "\'" + people.floatinpart + "\'" +  ","
			        + "\'" + people.floatoutpart + "\'" +  ","
			         + "\'" + "请选择" + "\'" +  ","
			          + "\'" + "请选择" + "\'" +  ","
			    		+ "\'" + "未审核" + "\'" +  ","
			    		+ "\'" + people.connectpeople + "\'" +  ","
			    		+ "\'" + people.floatTime + "\'" +  ","
			    		+ "\'" + people.status + "\'" +  ","
						+ "\'" + " " + "\'" +  ","
						+ "\'" + " " + "\'" +  ","
						+ "\'" + people.floatreason + "\'" +  ","
						+ "\'" + people.floatType + "\'" +  ","
			      		+ "\'" + "123456" + "\'"+ ")"
			      console.log(add)
			connection.query(add,function (err,result) {
			  if(err){
			    return err;
			  }
			  return res.send("你的申请提交成功");
			
		})
	 })
 
})
 
 //*********************************党内关爱1***********************
 router.post('/views/interviews/userlogin/wysb-add', function(req, res){
	var people=req.body
	
			var maxid = "select max(id) from heart_help_poorpeople"
//			console.log(maxid)
			connection.query(maxid,function (err,inform) {
			  if(err){
			    return err;
			  }
			  inform=JSON.stringify(inform)    //先将result转化为String类型的数据
		  	  inform=JSON.parse(inform)
		  	  var ret = inform[0]
			  var id = ret['max(id)'] + 1
			var sql1='select name,phoneNum from people_information where idCardNum = '+req.session.loginAcc
			console.log(sql1)
			connection.query(sql1,function (err,people1) {
			  if(err){
			    return err;
			  }
			  people1=JSON.stringify(people1)    //先将result转化为String类型的数据
		  	  people1=JSON.parse(people1)
		  	  console.log(people)
		  	  //console.log(people1)
			var sql = "insert into heart_help_poorpeople values("
					 + id  + ","
					  + "\'" +people1[0].name + "\'" + "," 
					   +"\'" + people1[0].phoneNum + "\'" + ","
					   +"\'" + people.poorpeople + "\'" + "," 
					    + "\'" + people.time + "\'" +  ","
					     + "\'" + people.address + "\'" + ","
					      + "\'" + people.title+ "\'"+"," 
					      + "\'" + ""+ "\'"+"," 
					       + "\'" + ""+ "\'"+"," 
					        + "\'" + ""+ "\'" + ")"
//					         console.log(sql)
			Pfile.increaseSql(sql,  function (err, inform) {
				if (err) {
					return res.status(500).send('Server error'+err.message)
				}
				res.redirect("/views/interviews/userlogin/jdbf")
				})
			})
		})
})
//*********************************党内关爱***********************
router.get('views/interviews/dyzj/dyfz/dnga', function(req, res){
	
	res.render('interviews/dyzj/dyfz/dnga.html')
})
//*********************************组织关系转接*******************
//router.get('views/interviews/dyzj/dyfz/zzgxzj', function(req, res){
//	
//	res.render('interviews/dyzj/dyfz/zzgxzj.html')
//})
router.get('/views/interviews/userlogin/lddy-zzgxzj', function(req, res){
	
//	if(req.session.loginAcc){ //判断session 状态，如果有效，则返回主页，否则转到登录页面
		
		if(req.session.loginAcc)
		{
			var sql = "SELECT * FROM organazition_float ";
		connection.query(sql, function(err, people){
		if(err){
			return res.status(500).send('Servor error'+err.message)
		}
//		console.log(people1)
		people=JSON.stringify(people)    //先将result转化为String类型的数据
	  	people=JSON.parse(people)
	  	console.log(people)
			res.render('interviews/userlogin/zzgxzy.html',{
				people: people
			});
		
	
	})
		}else{
			res.render('interviews/userlogin/login.html')
		}
//	}else{
//			//res.redirect('interviews/userlogin/login.html');
//			res.redirect('interviews/userlogin/login.html')
//	}
})
//*********************************党费缴纳**********************
router.get('views/interviews/dyzj/dyfz/dfjn', function(req, res){
	res.render('interviews/dyzj/dyfz/dfjn.html')
})
//*********************************网上学院**********************
router.get('views/interviews/dyzj/dyfz/wsxy', function(req, res){
	res.render('interviews/dyzj/dyfz/wsxy.html')
})
//*********************************党务知识*********************
router.get('views/interviews/dyzj/dnzs/dwzh', function(req, res){
	res.render('interviews/dyzj/dnzs/dwzs.html')
})
//*********************************网上学院*********************
router.get('views/interviews/dyzj/dnzs/wsxy', function(req, res){
	res.render('interviews/dyzj/dnzs/wsxy.html')
})
//**********************************党报党刊********************
router.get('views/interviews/dyzj/dnzs/dbdk', function(req, res){
	res.render('interviews/dyzj/dnzs/dbdk.html')
})
//**********************************高层声音********************
router.get('views/interviews/dyzj/dnzs/gcsy', function(req, res){
	res.render('interviews/dyzj/dnzs/gcsy.html')
})
//***********************************在线考试********************
router.get('views/interviews/dyzj/dnzs/zxks', function(req, res){
	res.render('interviews/dyzj/dnzs/zxks.html')
})
//***********************************视频学习********************
router.get('views/interviews/dyzj/dnzs/spxx', function(req, res){
	res.render('interviews/dyzj/dnzs/spxx.html')
})
//***********************************在线资料********************
router.get('views/interviews/dyzj/dnzs/zxzl', function(req, res){
	res.render('interviews/dyzj/dnzs/zxzl.html')
})
//***********************************入党流程**********************
router.get('views/interviews/dyzj/dnzs/rdlc', function(req, res){
	res.render('interviews/dyzj/dnzs/rdlc.html')
})
//***********************************网上学院**********************
//***********************************党旗****************************
router.get('views/interviews/dyzj/dnzs/wsxy/dq', function(req, res){
	res.render('interviews/dyzj/dnzs/wsxy/dq.html')
})
//*************************************党徽*************************
router.get('views/interviews/dyzj/dnzs/wsxy/dh', function(req, res){
	res.render('interviews/dyzj/dnzs/wsxy/dh.html')
})
//*************************************党章************************
router.get('views/interviews/dyzj/dnzs/wsxy/dz', function(req, res){
	res.render('interviews/dyzj/dnzs/wsxy/dz.html')
})
//**************************************党员基本知识*****************
router.get('views/interviews/dyzj/dnzs/wsxy/dyjbzs', function(req, res){
	res.render('interviews/dyzj/dnzs/wsxy/dyjbzs.html')
})
//***************************************党员发展基础知识*************
router.get('views/interviews/dyzj/dnzs/wsxy/dyfzjczs', function(req, res){
	res.render('interviews/dyzj/dnzs/wsxy/dyfzjczs.html')
})
//*****************************************党支部基本工作知识**********
router.get('views/interviews/dyzj/dnzs/wsxy/dzbjbgzzs', function(req, res){
	res.render('interviews/dyzj/dnzs/wsxy/dzbjbgzzs.html')
})
//*****************************************党委基本知识****************
router.get('views/interviews/dyzj/dnzs/wsxy/dwjbzs', function(req, res){
	res.render('interviews/dyzj/dnzs/wsxy/dwjbzs.html')
})
//*****************************************党内关爱***************
router.get('views/interviews/dyzj/dnga/dnga', function(req, res){
	res.render('interviews/dyzj/dnga/dnga.html')
})
//******************************************相关政策***************
router.get('views/interviews/dyzj/dnga/xgzc', function(req, res){
	res.render('interviews/dyzj/dnga/xgzc.html')
})
//******************************************结对帮扶****************
router.get('/views/interviews/dyzj/dnga/jdbf', function(req, res){
	if(req.session.loginAcc){ //判断session 状态，如果有效，则返回主页，否则转到登录页面
		
		
	var sql = 'SELECT * FROM heart_help_poorpeople where idCardNUm=' +req.session.loginAcc;
	connection.query(sql, function(err, people){
		if(err){
			return res.status(500).send('Servor error'+err.message)
		}
//		console.log(people1)
		people=JSON.stringify(people)    //先将result转化为String类型的数据
	  	people=JSON.parse(people)
//	  	console.log(people1)
			res.render('interviews/userlogin/jdbf.html',{
				people: people
			});
	})
	}else{
			//res.redirect('interviews/userlogin/login.html');
			res.render('interviews/userlogin/login.html')
	}
})
//*******************************************关爱活动**************
router.get('/views/interviews/dyzj/dnga/gahd', function(req, res){
	res.render('interviews/dyzj/dnga/gahd.html')
})
//*******************************************培养积极分子**********
router.get('/views/interviews/dyzj/dnga/pyjjfz', function(req, res){
//	console.log(12133)
	if(req.session.loginAcc){ //判断session 状态，如果有效，则返回主页，否则转到登录页面
		
		
	var sql = 'SELECT * FROM heart_educatepovertypeople where idCardNUm= '+req.session.loginAcc;
	connection.query(sql, function(err, people){
		if(err){
			return res.status(500).send('Servor error'+err.message)
		}
//		console.log(people1)
		people=JSON.stringify(people)    //先将result转化为String类型的数据
	  	people=JSON.parse(people)
//	  	console.log(people1)
			res.render('interviews/userlogin/pyjjfz.html',{
				people: people
			});
	})
	}else{
			//res.redirect('interviews/userlogin/login.html');
			res.render('interviews/userlogin/login.html')
		}
	 
})
/*-------------------------------------------------------------
                        积极分子管理
-------------------------------------------------------------*/
router.get('/views/interviews/dyzj/userlogin/jjfzgl', function(req, res){
	var sql = 'SELECT * FROM heart_educatepovertypeople where idCardNUm= ' +req.session.loginAcc;
	console.log(sql)
	connection.query(sql,function (err,people) {
	  if(err){
	    return err;
	  }
	  	  people=JSON.stringify(people)    //先将result转化为String类型的数据
	  	  people=JSON.parse(people)
//	  console.log(people)
	res.render('interviews/userlogin/jjfz.html', {
			people:people
		})
	}) 

})

/*
 * *****************************************************************************
 * 									登录验证
 * *****************************************************************************
 */


router.get('/views/interviews/userlogin', function(req, res){
//	console.log(req.loginAcc)
	if(req.session.loginAcc)
	{
		var sql = 'SELECT * FROM people_information where idCardNUm= '+req.session.loginAcc;
				Pfile.searchFile(sql, function(err, people1){
					if(err){
						return res.status(500).send('Servor error'+err.message)
					}
					people1=JSON.stringify(people1)    //先将result转化为String类型的数据
	  	  			people1=JSON.parse(people1)
					res.render('interviews/userlogin/grzl.html',{
						people1:people1[0]
					})
				})  	  
	}else{
//		 res.sendFile(__dirname + '/login.html')
		return res.render('interviews/userlogin/login.html')
	}
});


router.post('/views/interviews/userlogin-search', function(req,res){
	
	//console.log(req.body);
    let loginAcc = req.body.loginAcc;
    let password = req.body.password;
    password+="123456"
    let md5 = crypto.createHash("md5");
    let newPas = md5.update(password).digest("hex");
	
//  console.log(newPas);
	var sql2 = 'update commen_userroleinf set password ='+ "\'"+newPas+"\'"+ 'where loginAcc =' +loginAcc ;
//				console.log(sql2)
			     Pfile.selectSql(sql2, function(err, people) {
					if (err) {
						return res.status(500).send('Server error'+err.message)
					}
					})
	var sql = "select * from commen_userroleinf " 
	Pfile.selectSql(sql, function(err, people) {
		if (err) {
			return res.status(500).send('Server error'+err.message)
		}
		  people=JSON.stringify(people)    //先将result转化为String类型的数据
	  	  people=JSON.parse(people)
//	  	  console.log(people)
	  	  for(var i=0;i<people.length;i++){
	  	  	if(loginAcc==people[i].loginAcc&&newPas==people[i].password){
//	  	  		 req.session.loginAcc = req.body.loginAcc; // ��¼�ɹ������� session
				req.session.loginAcc = req.body.loginAcc; // 登录成功，设置 session
//				var sql2 = 'update commen_userroleinf set password ='+ "\'"+newPas+"\'"+ 'where loginAcc =' +req.session.loginAcc ;
//				console.log(sql2)
//			     Pfile.selectSql(sql2, function(err, people) {
//					if (err) {
//						return res.status(500).send('Server error'+err.message)
//					}
//					})
	  	  		var sql = 'SELECT * FROM people_information where idCardNUm='+req.session.loginAcc;
				Pfile.searchFile(sql, function(err, people1){
					if(err){
						return res.status(500).send('Servor error'+err.message)
					}
					people1=JSON.stringify(people1)    //先将result转化为String类型的数据
	  	  			people1=JSON.parse(people1)
					res.render('interviews/userlogin/grzl.html',{
						people1:people1[0]
					})
				})  	  
			} 
	  	  }
		})
})
//// 获取主页
//router.get('/', function (req, res) {
//if(req.session.loginAcc){ //判断session 状态，如果有效，则返回主页，否则转到登录页面
//  res.render('interviews/userlogin/grzl.html');
//}else{
//  res.redirect('interviews/userlogin/login.html');
//}
//})
/*// 退出
router.get('/logout', function (req, res) {
  req.session.userName = null; // 删除session
  res.redirect('login');
});*/

//router.get('/views/interviews/userlogin-search',function(req,res){
////session 已经登陆
//if(req.session.sign){
//  console.log(req.session);
//  res.send('<strong>'+req.session.name+'</strong>'+'Nice to see you again');
//}
//else{
//  //未登陆过
//  req.session.sign=true;
//  req.session.name = 'Type Zero';
//  res.end('Welcome:'+'<strong>'+req.session.name+'</strong>');
//}
//});


/*router.get('/', function (req, res) {
    if(req.session.userName){  //�ж�session ״̬�������Ч���򷵻���ҳ������ת����¼ҳ��
     res.render('home',{username : req.session.userName});
console.log("客户的消息依然存在")
    }else{
        res.redirect('/views/interviews/userloging/login.html');
    }
})*/

////个人信息资料
//router.get('/views/interviews/userlogin/userlogin', function(req, res){
//	var sql = "SELECT * FROM people_information where name= '张华'";
//	Pfile.searchFile(sql, function(err, people){
//		if(err){
//			return res.status(500).send('Servor error'+err.message)
//		}
//		console.log(people)
//		res.render('/views/interviews/userlogin/right.html',{
//			people:people
//		})
//	})
//})

/*
 * ***********************************************************************************************
 *  * ********************************************************************************************
 * 									管理员页面
 * ***********************************************************************************************
 *  * ***********************************************************************************************
 */
router.get('/views', function(req, res){
//	 var sql = 'SELECT * FROM people_information';
//	Pfile.searchFile(sql, function(err, people){
//		if(err){
//			return res.status(500).send('Servor error'+err.message)
//		}
//		console.log(people)
//		res.render(' center/center_right.html',{
//			people:people
//		})
//	})

if(req.session.username)
{
	return res.render("admin.html")
}
else{res.render('login.html')}

})
/*
 * 组织管理
 */
router.get('/interviews/zzgl/zzgl', function(req, res){
	var sql = 'SELECT * FROM threeandone_activityinformation'
	Pfile.searchFile(sql, function(err, inform){
		if(err){
			return res.status(500).send('Servor error'+err.message)
		}
//		console.log(inform)
		res.render('interviews/zzgl/zzgl.html',{
			inform:inform
		})
	})
})
//党员大会
router.get('/views/interviews/zzgl/shyk/dydh', function(req, res){
	var sql = 'SELECT * FROM threeandone_activityinformation where type = ' +"\'" + "党员大会" +"\'"
	//console.log(sql)
	Pfile.searchFile(sql, function(err, inform){
		if(err){
			return res.status(500).send('Servor error'+err.message)
		}
//		console.log(inform)
		res.render('interviews/zzgl/shyk/dydh.html', {
			inform:inform
		})
	})
})
//支委会
router.get('/views/interviews/zzgl/shyk/zwh', function(req, res){
	var sql = 'SELECT * FROM threeandone_suportcommity where type = ' +"\'" + "支委会" +"\'"
	console.log(sql)
	Pfile.searchFile(sql, function(err, inform){
		if(err){
			return res.status(500).send('Servor error'+err.message)
		}
		console.log(inform)
		res.render('interviews/zzgl/shyk/zwh.html',{
			inform:inform
		})
	})
})
//党小组会
router.get('/views/interviews/zzgl/shyk/dxzh', function(req, res){
	var sql = 'SELECT * FROM threeandone_smallgroupmeeting where type = ' +"\'" + "党小组会" +"\'"
	//console.log(sql)
	Pfile.searchFile(sql, function(err, inform){
		if(err){
			return res.status(500).send('Servor error'+err.message)
		}
//		console.log(inform)
		res.render('interviews/zzgl/shyk/dxzh.html',{
			inform:inform
		})
	})
})
//讲党课
router.get('/views/interviews/zzgl/shyk/jdk', function(req, res){
	var sql = 'SELECT * FROM threeandone_activityspeech where type = ' +"\'" + "讲党课" +"\'"
	//console.log(sql)
	Pfile.searchFile(sql, function(err, inform){
		if(err){
			return res.status(500).send('Servor error'+err.message)
		}
//		console.log(inform)
		res.render('interviews/zzgl/shyk/jdk.html',{
			inform:inform
		})
	})
})
//*************************************换届选举*************************
router.get('views/interviews/zzgl/hjxj', function(req, res){
	res.render('interviews/zzgl/hjxj.html')
})
//**************************************民主生活会*******************
router.get('views/interviews/zzgl/mzshh', function(req, res){
	res.render('interviews/zzgl/mzshh.html')
})
//***************************************组织生活会*******************
router.get('views/interviews/zzgl/zzshh', function(req, res){
	console.log(2333)
	res.render('interviews/zzgl/zzshh.html')
})
//***************************************index_page
router.get('views/interviews/zzgl/index_page', function(req, res){
	res.render('interviews/zzgl/index_page.html')
})
//****************************************民主评议党员****************
router.get('views/interviews/zzgl/mzpydy', function(req, res){
	res.render('interviews/zzgl/mzpydy.html')
})
//*****************************************主题党日*******************
router.get('views/interviews/zzgl/ztdr', function(req, res){
	res.render('interviews/zzgl/ztdr.html')
})
//*****************************************特色党建******************
router.get('views/interviews/zzgl/tsdj', function(req, res){
	res.render('interviews/zzgl/tsdj.html')
})
//组织管理下半部分的图--------------党员队伍建设
router.get('/views/interviews/zzgl/dynldtj', function(req, res){
	var sql = 'SELECT * FROM people_information'
	Pfile.searchFile(sql, function(err, inform){
		if(err){
			return res.status(500).send('Servor error'+err.message)
		}
		inform=JSON.stringify(inform)    //先将result转化为String类型的数据
	  	  inform=JSON.parse(inform)
		console.log(inform)
		res.render('interviews/zzgl/dynldtj.html',{
			inform:inform
		})
	})
})
//组织管理下半部分的图---------------指标变更
router.get('/views/interviews/zzgl/zbbg', function(req, res){
	var sql = 'SELECT * FROM vitalproblem_indexchange'
	Pfile.searchFile(sql, function(err, inform){
		if(err){
			return res.status(500).send('Servor error'+err.message)
		}
		inform=JSON.stringify(inform)    //先将result转化为String类型的数据
	  	  inform=JSON.parse(inform)
		console.log(inform)
		res.render('interviews/zzgl/zbbg.html',{
			inform:inform
		})
	})
})
//组织管理下半部分的图---------------指标销号
router.get('/views/interviews/zzgl/zbxh', function(req, res){
	var sql = 'SELECT * FROM vitalproblem_indexdie'
	Pfile.searchFile(sql, function(err, inform){
		if(err){
			return res.status(500).send('Servor error'+err.message)
		}
		inform=JSON.stringify(inform)    //先将result转化为String类型的数据
	  	  inform=JSON.parse(inform)
		console.log(inform)
		res.render('interviews/zzgl/zbxh.html',{
			inform:inform
		})
	})
})
//组织管理下半部分的图---------------预警督办
router.get('/views/interviews/zzgl/yjdb', function(req, res){
	var sql = 'SELECT * FROM vitalproblem_predit'
	Pfile.searchFile(sql, function(err, inform){
		if(err){
			return res.status(500).send('Servor error'+err.message)
		}
		inform=JSON.stringify(inform)    //先将result转化为String类型的数据
	  	  inform=JSON.parse(inform)
		console.log(inform)
		res.render('interviews/zzgl/yjdb.html',{
			inform:inform
		})
	})
})
//组织管理下半部分的图---------------督察问题
router.get('/views/interviews/zzgl/dcwt', function(req, res){
	var sql = 'SELECT * FROM vitalproblem_supervise_problem'
	Pfile.searchFile(sql, function(err, inform){
		if(err){
			return res.status(500).send('Servor error'+err.message)
		}
		inform=JSON.stringify(inform)    //先将result转化为String类型的数据
	  	  inform=JSON.parse(inform)
		console.log(inform)
		res.render('interviews/zzgl/dcwt.html',{
			inform:inform
		})
	})
})
//组织管理----主题党日----模板
router.get('/views/interviews/template/zzgl-ztdr', function(req, res){
	var sql = 'SELECT * FROM vital_commitytday';
//	console.log(sql)
	Pfile.searchFile(sql, function (err, inform) {
		if (err) {
			return res.status(500).send('Server error'+err.message)
		}
		  inform=JSON.stringify(inform)    //先将result转化为String类型的数据
	  	  inform=JSON.parse(inform)
//		console.log(inform)
		res.render('interviews/template/zzgl-ztdr.html', {
			inform:inform
		})
	})
})

//组织管路----主题党日----更多模板
router.get('/views/interviews/template/zzgl-gdztdr-ztdr', function(req, res){
//	console.log(2333)
//	console.log(req.query);
//var id=parseInt(req.query.id)
//console.log(id)
	var sql = "SELECT * FROM vital_commitytday where id=" +req.query.id ;
//	console.log(sql)
	
	connection.query(sql,function (err,news) {
	  if(err){
	    return err;
	  }
	  news=JSON.stringify(news)    //先将result转化为String类型的数据
	  	  news=JSON.parse(news)
	  console.log(news)
	res.render('interviews/template/zzgl-gdztdr-ztdr.html', {
			news: news
		})
	})
})

/*
 * 党员之家
 */
router.get('/interviews/dyzj/dyzj', function(req, res){
	res.render('interviews/dyzj/dyzj.html')
})
/*
 * 为民服务
 */
router.get('/interviews/wmfw/wmfw', function(req, res){
	res.render('interviews/wmfw/wmfw.html')
})
/*
 * 互动交流
 */
router.get('/interviews/hdjl/hdjl', function(req, res){
	res.render('interviews/hdjl/hdjl.html')
})
router.get('/views/interviews/zzgl/zzgl', function(req, res){
	res.render('interviews/zzgl/zzgl.html')
})
router.get('/views/interviews/dyzj/dyzj', function(req, res){
	res.render('interviews/dyzj/dyzj.html')
})
router.get('/views/interviews/wmfw/wmfw', function(req, res){	 
	var sql="select *from people_information"
	Pfile.searchFile(sql, function(err, people){
		if(err){
			return res.status(500).send('Servor error'+err.message)
		}
		console.log(people)
		res.render('interviews/wmfw/wmfw.html',{
			people:people
		})
	})
//	res.render('interviews/wmfw/wmfw.html')
})
router.get('/views/interviews/hdjl/hdjl', function(req, res){
	res.render('interviews/hdjl/hdjl.html')
})
router.get('/views/entrace', function(req, res){
	res.render('interviews/views/entrace.html')
})
router.get('/views/interviews/djzc/djyw', function(req, res){
	res.render('interviews/djzc/djyw.html')
})
router.get('/views/interviews/djzc/ncdj', function(req, res){
	res.render('interviews/djzc/ncdj.html')
})
router.get('/views/interviews/djzc/fgdj', function(req, res){
	res.render('interviews/djzc/fgdj.html')
})
router.get('/views/interviews/djzc/gqdj', function(req, res){
	res.render('interviews/djzc/gqdj.html')
})
router.get('/views/interviews/djzc/jgdj', function(req, res){
	res.render('interviews/djzc/jgdj.html')
})
router.get('/views/interviews/djzc/shzzdj', function(req, res){
	res.render('interviews/djzc/shzzdj.html')
})
router.get('/views/interviews/djzc/sqdj', function(req, res){
	res.render('interviews/djzc/sqdj.html')
})
router.get('/views/interviews/djzc/xfmf', function(req, res){
	res.render('interviews/djzc/xfmf.html')
})
router.get('/views/interviews/djzc/xxdj', function(req, res){
	res.render('interviews/djzc/xxdj.html')
})
router.get('/views/interviews/djzc/xzzq', function(req, res){
	res.render('interviews/djzc/xzzq.html')
})
router.get('/views/interviews/djzc/ycjy', function(req, res){
	res.render('interviews/djzc/ycjy.html')
})
router.get('/views/interviews/djzc/ncdj', function(req, res){
	res.render('interviews/djzc/ncdj.html')
})
router.get('/views/interviews/djzc/yydj', function(req, res){
	res.render('interviews/djzc/yydj.html')
})
router.get('/views/interviews/djzc/gsgg', function(req, res){
	res.render('interviews/djzc/gsgg.html')
})
router.get('/views/interviews/djzc/zthd', function(req, res){
	res.render('interviews/djzc/zthd.html')
})
router.get('/views/interviews/djzc/zzgzcx', function(req, res){
	res.render('interviews/djzc/zzgzcx.html')
})
//*********************干部工作***************************************
router.get('/views/interviews/djzc/gbgz/gbgl', function(req, res){
	res.render('interviews/djzc/gbgz/gbgl.html')
})
router.get('/views/interviews/djzc/gbgz/gbjd', function(req, res){
	res.render('interviews/djzc/gbgz/gbjd.html')
})
router.get('/views/interviews/djzc/gbgz/gbjy', function(req, res){
	res.render('interviews/djzc/gbgz/gbjy.html')
})
router.get('/views/interviews/djzc/gbgz/gbgz', function(req, res){
	res.render('interviews/djzc/gbgz/gbgz.html')
})
//*****************************************************************
//**********************人才工作*************************************
router.get('/views/interviews/djzc/rcgz/dfrc', function(req, res){
	res.render('interviews/djzc/rcgz/dfrc.html')
})
router.get('/views/interviews/djzc/rcgz/rchd', function(req, res){
	res.render('interviews/djzc/rcgz/rchd.html')
})
router.get('/views/interviews/djzc/rcgz/rczc', function(req, res){
	res.render('interviews/djzc/rcgz/rczc.html')
})
router.get('/views/interviews/djzc/rcgz/rcgz', function(req, res){
	res.render('interviews/djzc/rcgz/rcgz.html')
})
//*****************************************************************
//**********************三项机制************************************
router.get('/views/interviews/djzc/sxjz/dtxx', function(req, res){
	res.render('interviews/djzc/sxjz/dtxx.html')
})
router.get('/views/interviews/djzc/sxjz/dxal', function(req, res){
	res.render('interviews/djzc/sxjz/dxal.html')
})
router.get('/views/interviews/djzc/sxjz/zcjd', function(req, res){
	res.render('interviews/djzc/sxjz/zcjd.html')
})
router.get('/views/interviews/djzc/sxjz/sxjz', function(req, res){
	res.render('interviews/djzc/sxjz/sxjz.html')
})
//*****************************************************************
//**********************目标考核************************************
router.get('/views/interviews/djzc/mbkh/jgtb', function(req, res){
	res.render('interviews/djzc/mbkh/jgtb.html')
})
router.get('/views/interviews/djzc/mbkh/khwj', function(req, res){
	res.render('interviews/djzc/mbkh/khwj.html')
})
router.get('/views/interviews/djzc/mbkh/khzb', function(req, res){
	res.render('interviews/djzc/mbkh/khzb.html')
})
router.get('/views/interviews/djzc/mbkh/mbkh', function(req, res){
	res.render('interviews/djzc/mbkh/mbkh.html')
})
router.get('/views/interviews/djzc/mbkh/jcdjjdpm', function(req, res){
	res.render('interviews/djzc/mbkh/jcdjjdpm.html')
})
//*****************************************************************
router.get('/views/interviews/wmfw/bmfw', function(req, res){
	res.render('interviews/wmfw/bmfw.html')
})
router.get('/views/interviews/wmfw/dycn', function(req, res){
	var sql="select *from people_information"
	Pfile.searchFile(sql, function(err, people){
		if(err){
			return res.status(500).send('Servor error'+err.message)
		}
		console.log(people)
		res.render('interviews/wmfw/dycn.html',{
			people:people
		})
	})
})
router.get('/views/interviews/wmfw/dyzsqdhd', function(req, res){
	res.render('interviews/wmfw/dyzsqdhd.html')
})
router.get('/views/interviews/wmfw/jyxc', function(req, res){
	res.render('interviews/wmfw/jyxc.html')
})
router.get('/views/interviews/hdjl/llls', function(req, res){
	res.render('interviews/hdjl/llls.html')
})
router.get('/views/interviews/hdjl/shmyddc', function(req, res){
	res.render('interviews/hdjl/shmyddc.html')
})
router.get('/views/interviews/hdjl/wspy', function(req, res){
	res.render('interviews/hdjl/wspy.html')
})
//************************************三会一课**************************
router.get('/views/interviews/zzgl/shyk', function(req, res){
	var sql = 'SELECT * FROM threeandone_activityinformation '
	console.log(req.query)
	Pfile.searchFile(sql, function(err, inform){
		if(err){
			return res.status(500).send('Servor error'+err.message)
		}
		//console.log(people)
		res.render('interviews/zzgl/shyk.html',{
			inform:inform
		})
	})
//	res.render('interviews/zzgl/shyk.html')
})
router.get('/views/interviews/zzgl/shyk1', function(req, res){
	var sql = 'SELECT * FROM threeandone_activityinformation '  ;
	console.log(sql)
	Pfile.searchFile(sql, function(err, inform){
		if(err){
			return res.status(500).send('Servor error'+err.message)
		}
		console.log(inform)
		res.render('interviews/zzgl/shyk1.html',{
			inform:inform
		})
	})
//	res.render('interviews/zzgl/shyk.html')
})

//****************************************党员队伍建设****************
router.get('views/interviews/zzgl/dydwjs', function(req, res){
	res.render('interviews/zzgl/dydwjs.html')
})
//*****************************************指标变更******************
router.get('views/interviews/zzgl/zbbg', function(req, res){
	res.render('interviews/zzgl/zbbg.html')
})
//*****************************************指标销号******************
router.get('views/interviews/zzgl/zbxh', function(req, res){
	res.render('interviews/zzgl/zbxh.html')
})
//*****************************************预警督办*****************
router.get('views/interviews/zzgl/yjdb', function(req, res){
	res.render('interviews/zzgl/yjdb.html')
})
//******************************************督察问题***************
router.get('views/interviews/zzgl/dcwt', function(req, res){
	res.render('interviews/zzgl/dcwt.html')
})
/*
 *党员之家
 */
//我要入党
router.get('views/interviews/dyzj/dyfz/wyrd', function(req, res){
	res.render('interviews/dyzj/dyfz/wyrd.html')
})
//我要入党提交申请
router.post('/views/interviews/dyzj/dyfz/wyrd', function(req, res){
 var maxid = "select max(id) from people_develope"
		//console.log(maxid)
		var people=req.body;
//		console.log(people)
		connection.query(maxid,function (err,result) {
		  if(err){
		    return err;
		  }
		  result=JSON.stringify(result)    //先将result转化为String类型的数据
	  	  result=JSON.parse(result)
	  	  var ret = result[0]
		  var peopleId = ret['max(id)'] + 1
		  console.log(peopleId)

			var add="insert into people_develope values("
			 +  peopleId + ","
			  + "\'" + people.name + "\'" + "," 
			   +"\'" + people.gender + "\'" + ","
			    +"\'" + people.nation + "\'" + ","
			   +"\'" + people.idCardNum + "\'" + "," 
			   + "\'" + people.phoneNum + "\'" + ","
			   + "\'" + people.birthDay + "\'" + ","
			     + "\'" + people.culture_level + "\'" +  ","
			      + "\'" + people.attribute + "\'" +  ","
			       + "\'" + people.onattribute + "\'" +  ","
			        + "\'" + people.positionIt + "\'" +  ","
			         + "\'" + people.personalimage + "\'" +  ","
			    		+ "\'" + people.workTime + "\'" +  ","
			    		+ "\'" + people.partAndDuty + "\'" +  ","
			    		+ "\'" + people.belongorganazation + "\'" +  ","
						+ "\'" + people.status + "\'" +  ","
			      		+ "\'" + 123456+ "\'"+ ")"
			      console.log(add)
			connection.query(add,function (err,result) {
			  if(err){
			    return err;
			  }
			 return res.send("你的申请提交成功");
			
		})
	 })
 
})
//*********************************流动党员***********************
router.get('/views/interviews/dyzj/dyfz/lddy', function(req, res){
	res.render('interviews/dyzj/dyfz/lddy.html')
})
//流动党员提交申请
 router.post('/views/interviews/dyzj/dyfz/lddy', function(req, res){
 var maxid = "select max(id) from floatincommity"
		//console.log(maxid)
		var people=req.body;
//		console.log(people)
		connection.query(maxid,function (err,result) {
		  if(err){
		    return err;
		  }
		  result=JSON.stringify(result)    //先将result转化为String类型的数据
	  	  result=JSON.parse(result)
	  	  var ret = result[0]
		  var peopleId = ret['max(id)'] + 1
		  console.log(peopleId)
		  
		  //获取流动时间
		  var date = new Date();
	        var seperator1 = "-";
	        var year = date.getFullYear();
	        var month = date.getMonth() + 1;
	        var strDate = date.getDate();
	        if (month >= 1 && month <= 9) {
	            month = "0" + month;
	        }
	        if (strDate >= 0 && strDate <= 9) {
	            strDate = "0" + strDate;
	        }
	        var currentdate = year + seperator1 + month + seperator1 + strDate;

			var add="insert into floatincommity values("
			 +  peopleId + ","
			  + "\'" + people.name + "\'" + "," 
			  + "\'" + people.gender + "\'" + "," 
			  + "\'" + people.nation + "\'" + "," 
			  + "\'" + people.floatId + "\'" + "," 
			   +"\'" + people.idCardNum + "\'" + "," 
			   + "\'" + people.phoneNum + "\'" + ","
			   + "\'" + people.birthDay + "\'" + ","
			    + "\'" + people.culture_level + "\'" + ","
			    + "\'" + people.attribute + "\'" + ","
   			    + "\'" + people.onattribute + "\'" + ","
				+ "\'" + people.positionIt + "\'" + ","
				+ "\'" + people.partAndDuty + "\'" +  ","
				+ "\'" + people.joinTime + "\'" + ","
				+ "\'" + people.workTime + "\'" + ","
				+ "\'" + people.rangeIt + "\'" + ","
			     + "\'" + people.floatinname + "\'" +  ","
			      + "\'" + people.floatoutname + "\'" +  ","
			       + "\'" + people.floatinpart + "\'" +  ","
			        + "\'" + people.floatoutpart + "\'" +  ","
			         + "\'" + currentdate+ "\'" +  ","
			          + "\'" + currentdate + "\'" +  ","
			    		+ "\'" + "未审核" + "\'" +  ","
			    		+ "\'" + people.connectpeople + "\'" +  ","
			    		+ "\'" + people.floatTime + "\'" +  ","
			    		+ "\'" + people.status + "\'" +  ","
						+ "\'" + people.LocationX + "\'" +  ","
						+ "\'" + people.LocationY + "\'" +  ","
						+ "\'" + people.floatreason + "\'" +  ","
						+ "\'" + people.floatType + "\'" +  ","
			      		+ "\'" + "123456" + "\'"+ ")"
			      console.log(add)
			connection.query(add,function (err,result) {
			  if(err){
			    return err;
			  }
			 return res.send("你的申请提交成功");
			
		})
	 })
 
})
 

//*********************************党内关爱***********************
router.get('views/interviews/dyzj/dyfz/dnga', function(req, res){
	
	res.render('interviews/dyzj/dyfz/dnga.html')
})
//*********************************组织关系转接*******************
//router.get('views/interviews/dyzj/dyfz/zzgxzj', function(req, res){
//	
//	res.render('interviews/dyzj/dyfz/zzgxzj.html')
//})
router.get('/views/interviews/userlogin/lddy-zzgxzj', function(req, res){
	
//	if(req.session.loginAcc){ //判断session 状态，如果有效，则返回主页，否则转到登录页面
		if(req.session.loginAcc)
		{
			var sql = "SELECT * FROM organazition_float ";
	connection.query(sql, function(err, people){
		if(err){
			return res.status(500).send('Servor error'+err.message)
		}
//		console.log(people1)
		people=JSON.stringify(people)    //先将result转化为String类型的数据
	  	people=JSON.parse(people)
	  	console.log(people)
			res.render('interviews/userlogin/zzgxzy.html',{
				people: people
			});
	})
		}else{
			res.render('interviews/userlogin/login.html')
		}
		
	
//	}else{
//			//res.redirect('interviews/userlogin/login.html');
//			res.redirect('interviews/userlogin/login.html')
//	}
})
//*********************************党费缴纳**********************
router.get('views/interviews/dyzj/dyfz/dfjn', function(req, res){
	res.render('interviews/dyzj/dyfz/dfjn.html')
})
//*********************************网上学院**********************
router.get('views/interviews/dyzj/dyfz/wsxy', function(req, res){
	res.render('interviews/dyzj/dyfz/wsxy.html')
})
//*********************************党务知识*********************
router.get('views/interviews/dyzj/dnzs/dwzh', function(req, res){
	res.render('interviews/dyzj/dnzs/dwzs.html')
})
//*********************************网上学院*********************
router.get('views/interviews/dyzj/dnzs/wsxy', function(req, res){
	res.render('interviews/dyzj/dnzs/wsxy.html')
})
//**********************************党报党刊********************
router.get('views/interviews/dyzj/dnzs/dbdk', function(req, res){
	res.render('interviews/dyzj/dnzs/dbdk.html')
})
//**********************************高层声音********************
router.get('views/interviews/dyzj/dnzs/gcsy', function(req, res){
	res.render('interviews/dyzj/dnzs/gcsy.html')
})
//***********************************在线考试********************
router.get('views/interviews/dyzj/dnzs/zxks', function(req, res){
	res.render('interviews/dyzj/dnzs/zxks.html')
})
//***********************************视频学习********************
router.get('views/interviews/dyzj/dnzs/spxx', function(req, res){
	res.render('interviews/dyzj/dnzs/spxx.html')
})
//***********************************在线资料********************
router.get('views/interviews/dyzj/dnzs/zxzl', function(req, res){
	res.render('interviews/dyzj/dnzs/zxzl.html')
})
//***********************************入党流程**********************
router.get('views/interviews/dyzj/dnzs/rdlc', function(req, res){
	res.render('interviews/dyzj/dnzs/rdlc.html')
})
//***********************************网上学院**********************
//***********************************党旗****************************
router.get('views/interviews/dyzj/dnzs/wsxy/dq', function(req, res){
	res.render('interviews/dyzj/dnzs/wsxy/dq.html')
})
//*************************************党徽*************************
router.get('views/interviews/dyzj/dnzs/wsxy/dh', function(req, res){
	res.render('interviews/dyzj/dnzs/wsxy/dh.html')
})
//*************************************党章************************
router.get('views/interviews/dyzj/dnzs/wsxy/dz', function(req, res){
	res.render('interviews/dyzj/dnzs/wsxy/dz.html')
})
//**************************************党员基本知识*****************
router.get('views/interviews/dyzj/dnzs/wsxy/dyjbzs', function(req, res){
	res.render('interviews/dyzj/dnzs/wsxy/dyjbzs.html')
})
//***************************************党员发展基础知识*************
router.get('views/interviews/dyzj/dnzs/wsxy/dyfzjczs', function(req, res){
	res.render('interviews/dyzj/dnzs/wsxy/dyfzjczs.html')
})
//*****************************************党支部基本工作知识**********
router.get('views/interviews/dyzj/dnzs/wsxy/dzbjbgzzs', function(req, res){
	res.render('interviews/dyzj/dnzs/wsxy/dzbjbgzzs.html')
})
//*****************************************党委基本知识****************
router.get('views/interviews/dyzj/dnzs/wsxy/dwjbzs', function(req, res){
	res.render('interviews/dyzj/dnzs/wsxy/dwjbzs.html')
})
//*****************************************党内关爱***************
router.get('views/interviews/dyzj/dnga/dnga', function(req, res){
	res.render('interviews/dyzj/dnga/dnga.html')
})
//******************************************相关政策***************
router.get('views/interviews/dyzj/dnga/xgzc', function(req, res){
	res.render('interviews/dyzj/dnga/xgzc.html')
})
//******************************************结对帮扶****************
router.get('/views/interviews/dyzj/dnga/jdbf', function(req, res){
	if(req.session.loginAcc){ //判断session 状态，如果有效，则返回主页，否则转到登录页面
		
		
	var sql = 'SELECT * FROM heart_help_poorpeople where idCardNum='+req.session.loginAcc;
	connection.query(sql, function(err, people){
		if(err){
			return res.status(500).send('Servor error'+err.message)
		}
//		console.log(people1)
		people=JSON.stringify(people)    //先将result转化为String类型的数据
	  	people=JSON.parse(people)
//	  	console.log(people1)
			res.render('interviews/userlogin/jdbf.html',{
				people: people
			});
	})
	}else{
			//res.redirect('interviews/userlogin/login.html');
			res.render('interviews/userlogin/login.html')
	}
})
//*******************************************关爱活动**************
router.get('/views/interviews/dyzj/dnga/gahd', function(req, res){
	res.render('interviews/dyzj/dnga/gahd.html')
})
//*******************************************培养积极分子**********
router.get('/views/interviews/dyzj/dnga/pyjjfz', function(req, res){
//	console.log(12133)
	if(req.session.loginAcc){ //判断session 状态，如果有效，则返回主页，否则转到登录页面
		
		
	var sql = 'SELECT * FROM heart_educatepovertypeople where idCardNUm=' +req.session.loginAcc;
	connection.query(sql, function(err, people){
		if(err){
			return res.status(500).send('Servor error'+err.message)
		}
		console.log(people1)
		people=JSON.stringify(people)    //先将result转化为String类型的数据
	  	people=JSON.parse(people)
//	  	console.log(people1)
			res.render('interviews/userlogin/pyjjfz.html',{
				people: people
			});
	})
	}else{
			//res.redirect('interviews/userlogin/login.html');
			res.render('interviews/userlogin/login.html')
		}
	 
})
/*-------------------------------------------------------------
                        积极分子管理
-------------------------------------------------------------*/
router.get('/views/interviews/dyzj/userlogin/jjfzgl', function(req, res){
	var sql = 'SELECT * FROM heart_educatepovertypeople where idCardNUm=' +req.session.loginAcc;
	console.log(sql)
	connection.query(sql,function (err,people) {
	  if(err){
	    return err;
	  }
	  	  people=JSON.stringify(people)    //先将result转化为String类型的数据
	  	  people=JSON.parse(people)
//	  console.log(people)
	res.render('interviews/userlogin/jjfz.html', {
			people:people
		})
	}) 

})

/*
 * *****************************************************************************
 * 									登录验证
 * *****************************************************************************
 */


router.get('/views/interviews/userlogin-search', function(req, res){
	if(req.session.loginAcc)
	{
		var sql = 'SELECT * FROM people_information where idCardNUm=' +req.session.loginAcc;
				Pfile.searchFile(sql, function(err, people1){
					if(err){
						return res.status(500).send('Servor error'+err.message)
					}
					people1=JSON.stringify(people1)    //先将result转化为String类型的数据
	  	  			people1=JSON.parse(people1)
					res.render('interviews/userlogin/grzl.html',{
						people1:people1[0]
			})
		})
	}else{
		res.render('interviews/userlogin/login.html')
	}
//res.sendFile(__dirname + '/login.html')
});


//router.post('/views/interviews/userlogin-search', function(req,res){
//	
//	//console.log(req.body);
//  let loginAcc = req.body.loginAcc;
//  let password = req.body.password;
//  let md5 = crypto.createHash("md5");
//  let newPas = md5.update(password).digest("hex");
////  console.log(newPas);
//	var sql = "select * from commen_userroleinf " 
//	Pfile.selectSql(sql, function(err, people) {
//		if (err) {
//			return res.status(500).send('Server error'+err.message)
//		}
//		  people=JSON.stringify(people)    //先将result转化为String类型的数据
//	  	  people=JSON.parse(people)
////	  	  console.log(people)
//	  	  for(var i=0;i<people.length;i++){
//	  	  	if(loginAcc==people[i].loginAcc&&newPas==people[i].password){
////	  	  		 req.session.loginAcc = req.body.loginAcc; // ��¼�ɹ������� session
//				req.session.loginAcc = req.body.loginAcc; // 登录成功，设置 session
//	  	  		var sql = 'SELECT * FROM people_information where idCardNUm=' +req.session.loginAcc;
//				Pfile.searchFile(sql, function(err, people1){
//					if(err){
//						return res.status(500).send('Servor error'+err.message)
//					}
//					people1=JSON.stringify(people1)    //先将result转化为String类型的数据
//	  	  			people1=JSON.parse(people1)
//					res.render('interviews/userlogin/grzl.html',{
//						people1:people1[0]
//					})
//				})  	  
//			} 
//	  	  }
//		})
//})
//// 获取主页
//router.get('/', function (req, res) {
//if(req.session.loginAcc){ //判断session 状态，如果有效，则返回主页，否则转到登录页面
//  res.render('interviews/userlogin/grzl.html');
//}else{
//  res.redirect('interviews/userlogin/login.html');
//}
//})
/*// 退出
router.get('/logout', function (req, res) {
  req.session.userName = null; // 删除session
  res.redirect('login');
});*/

//router.get('/views/interviews/userlogin-search',function(req,res){
////session 已经登陆
//if(req.session.sign){
//  console.log(req.session);
//  res.send('<strong>'+req.session.name+'</strong>'+'Nice to see you again');
//}
//else{
//  //未登陆过
//  req.session.sign=true;
//  req.session.name = 'Type Zero';
//  res.end('Welcome:'+'<strong>'+req.session.name+'</strong>');
//}
//});


/*router.get('/', function (req, res) {
    if(req.session.userName){  //�ж�session ״̬�������Ч���򷵻���ҳ������ת����¼ҳ��
     res.render('home',{username : req.session.userName});
console.log("客户的消息依然存在")
    }else{
        res.redirect('/views/interviews/userloging/login.html');
    }
})*/

////个人信息资料
//router.get('/views/interviews/userlogin/userlogin', function(req, res){
//	var sql = "SELECT * FROM people_information where name= '张华'";
//	Pfile.searchFile(sql, function(err, people){
//		if(err){
//			return res.status(500).send('Servor error'+err.message)
//		}
//		console.log(people)
//		res.render('/views/interviews/userlogin/right.html',{
//			people:people
//		})
//	})
//})

/*
 * ***********************************************************************************************
 *  * ********************************************************************************************
 * 									管理员页面
 * ***********************************************************************************************
 *  * ***********************************************************************************************
 */
router.get('/views', function(req, res){
//	 var sql = 'SELECT * FROM people_information';
//	Pfile.searchFile(sql, function(err, people){
//		if(err){
//			return res.status(500).send('Servor error'+err.message)
//		}
//		console.log(people)
//		res.render(' center/center_right.html',{
//			people:people
//		})
//	})

if(req.session.username)
{
	return res.render("admin.html")
}
else{res.render('login.html')}

})
/*
 * 人员管理
 */
//党员管理
router.get('/views/detail/rygl/dygl', function(req, res){
	var sql = 'SELECT * FROM people_information';
	Pfile.searchFile(sql, function(err, people){
		if(err){
			return res.status(500).send('Servor error'+err.message)
		}
		//console.log(people)
		res.render('detail/rygl/dygl.html',{
			people:people
		})
	})
})
//党员管理-------查询
router.post('/views/detail/rygl/dygl-search', function(req,res){
	var inform = req.body
	
	for(var key in inform){
		if(inform[key] == ''){
			delete inform[key]
		}
	}
	console.log(inform)
	if(JSON.stringify(inform) == '{}'){
		console.log('2333')
		res.redirect('/views/detail/rygl/dygl')
		return
	}
//	console.log(inform)
	var sql = "select * from people_information where " 
	var i = 0
	for(var key in inform){
		if (i == 0){
			sql += key + " like" + "\'"+"%"+inform[key]+"%"+"\'"
			i++
		} else {
			sql += "and " + key + " like" + "\'"+"%"+inform[key]+"%"+"\'"
		}
	}
//	console.log(sql)
	Pfile.selectSql(sql, function(err, people) {
		if (err) {
			return res.status(500).send('Server error'+err.message)
		}
		res.render('detail/rygl/dygl.html', {
			people: people
		})
	})
})
//人员管理党员管理——--  查看
router.get('/views/detail/rygl/dygl/detail', function(req, res){
 
if(req.session.username)
	{
	var sql1='SELECT commen_userroleinf.loginAcc,commen_userpowerinfo.property,commen_userpowerinfo.people_ctrol FROM commen_userroleinf,commen_userpowerinfo  WHERE commen_userroleinf.property = commen_userpowerinfo.property and  commen_userroleinf.loginAcc='+"\'"+req.session.username+"\'"
//	console.log(sql1)
	connection.query(sql1,function (err,result) {
	  if(err){
	    return err;
	  }
	  result=JSON.stringify(result)    //先将result转化为String类型的数据
	  result=JSON.parse(result) 
   var aa=result[0].people_ctrol
	 aa=aa.split(',')
//	 console.log(aa)
	for(var i=0;i<aa.length;i++)
	{
		if(aa[i]=='2')
			{
		var sql = 'SELECT * FROM people_information where id =' + req.query.id;
		Pfile.searchById(sql,parseInt(req.query.id), function (err, people) {
		if (err) {
			return res.status(500)
		}
		 res.render('detail/rygl/rygl-detail.html', {
			people: people
			})
		})
			break
			}else{
			if(i==aa.length-1)
			{
				return res.send("你没有此权限")
//			console.log("你没有此操作权限")
			}else{
				continue
			}
		    }
	}
	})
	}else{
		res.render('login.html')
	}
		
})
//党员管理-编辑
router.get('/views/detail/rygl/dygl/edit', function(req, res){
 if(req.session.username)
	{
	var sql1='SELECT commen_userroleinf.loginAcc,commen_userpowerinfo.property,commen_userpowerinfo.people_ctrol FROM commen_userroleinf,commen_userpowerinfo  WHERE commen_userroleinf.property = commen_userpowerinfo.property and  commen_userroleinf.loginAcc='+"\'"+req.session.username+"\'"
	console.log(sql1)
	connection.query(sql1,function (err,result) {
	  if(err){
	    return err;
	  }
	  result=JSON.stringify(result)    //先将result转化为String类型的数据
	  result=JSON.parse(result) 
   var aa=result[0].people_ctrol
	 aa=aa.split(',')
	for(var i=0;i<aa.length;i++)
	{
		if(aa[i]=='2')
			{
				var sql = 'SELECT * FROM people_information where id =' + req.query.id;
		Pfile.searchById(sql,parseInt(req.query.id), function (err, people) {
		if (err) {
			return res.status(500).send('Server error'+err.message)
		}
//		console.log(people)
		return res.render('detail/rygl/rygl-edit.html', {
			people: people
		})
		})
			break
			}
			else{
			if(i==aa.length-1)
			{
			 return res.send("你没有此权限")
//				console.log("你没有此操作权限")
			
			}else{
				continue
			}
		    }
	}
	})
	}else{
		res.render('login.html')
	}
})
router.post('/detail/rygl/dygl/edit', function(req, res){
	var people = req.body
	console.log(people)
	//var editsql = "update people_information set name=" +"\'" + people.name + "\'"+"where id=" + people.id;
	var editsql = "update people_information set name=" +"\'" + people.name + "\'"+ "," + "phoneNum=" +"\'" + people.phoneNum + "\'" 
	+ "," + "gender=" +"\'" + people.gender + "\'"
	+ "," + "nation=" +"\'" + people.nation + "\'"
+ "," + "idCardNum=" +"\'" + people.idCardNum + "\'"
+ "," + "phoneNum=" +"\'" + people.phoneNum + "\'"
+ "," + "birthDay=" +"\'" + people.birthDay + "\'"
+ "," + "culture_level=" +"\'" + people.culture_level + "\'"
+ "," + "attribute=" +"\'" + people.attribute + "\'"
+ "," + "onAttribute=" +"\'" + people.onAttribute + "\'"
+ "," + "profession=" +"\'" + people.profession + "\'"
+ "," + "workTime=" +"\'" + people.workTime + "\'"
+ "," + "positionIt=" +"\'" + people.positionIt + "\'"
+ "," + "type=" +"\'" + people.type + "\'"
+ "," + "joinTime=" +"\'" + people.joinTime + "\'"
+ "," + "property=" +"\'" + people.property + "\'"
+ "," + "isfloatpeople=" +"\'" + people.isfloatpeople + "\'"
+ "," + "isleader=" +"\'" + people.isleader + "\'"
+ "," + "isfloatcommityconect=" +"\'" + people.isfloatcommityconect + "\'"
+ "," + "locationX=" +"\'" + people.locationX + "\'"
+ "," + "locationY=" +"\'" + people.locationY + "\'"
+ "," + "personalimag=" +"\'" + people.personalimag + "\'"
+ "," + "famailypeople=" +"\'" + people.famailypeople + "\'"
+ "," + "remark=" +"\'" + people.remark + "\'"+"where id=" + people.id;
	console.log(editsql)
	Pfile.editById(editsql, function(err){
		if(err) {
			return res.status(500).send('Server error'+err.message)	
		}
		res.redirect('/views/detail/rygl/dygl')
	})
})
//党员管理目录树
router.get('/views/detail/rygl/dygl-tree', function(req, res){
	var sql = 'SELECT * FROM people_information where belongorganazation =' + "\'" + req.query.name + "\'";
	Pfile.searchFile(sql, function(err, people){
		if(err){
			return res.status(500).send('Servor error'+err.message)
		}
		//console.log(people)
		res.render('detail/rygl/dygl.html',{
			people:people
		})
	})
})
//党员管理-------初始化密码
router.get('/views/detail/rygl/dygl/default', function(req, res){
	if(req.session.username)
	{
	var sql1='SELECT commen_userroleinf.loginAcc,commen_userpowerinfo.property,commen_userpowerinfo.people_ctrol FROM commen_userroleinf,commen_userpowerinfo  WHERE commen_userroleinf.property = commen_userpowerinfo.property and  commen_userroleinf.loginAcc='+"\'"+req.session.username+"\'"
	console.log(sql1)
	connection.query(sql1,function (err,result) {
	  if(err){
	    return err;
	  }
	  result=JSON.stringify(result)    //先将result转化为String类型的数据
	  result=JSON.parse(result) 
   var aa=result[0].people_ctrol
	 aa=aa.split(',')
	for(var i=0;i<aa.length;i++)
	{
		if(aa[i]=='4')
			{
				var selectId = req.query.id.split(",")
			var editsql = "update people_information set defaultpassword = '111111' where id =";
		for(var i = 0; i < selectId.length; i++){
			if(i == 0){
				editsql += selectId[i]
			} else {
				editsql += " or id = " + selectId[i]
			}
		}
		console.log(editsql)
	connection.query(editsql,function (err,result) {
		  if(err){
		    return err
		  }
		  return null
		})
			return res.redirect('/views/detail/rygl/dygl')
			break
			}else{
			if(i==aa.length-1)
			{
				return res.send("你没有此权限")
			
			}else{
				continue
			}
		    }
	}
	})
	}else{
		res.render('login.html')
	}
})
//党员管理-删除
router.get('/views/detail/rygl/dygl/delete', function(req, res){
 if(req.session.username)
	{
	var sql1='SELECT commen_userroleinf.loginAcc,commen_userpowerinfo.property,commen_userpowerinfo.people_ctrol FROM commen_userroleinf,commen_userpowerinfo  WHERE commen_userroleinf.property = commen_userpowerinfo.property and  commen_userroleinf.loginAcc='+"\'"+req.session.username+"\'"
	console.log(sql1)
	connection.query(sql1,function (err,result) {
	  if(err){
	    return err;
	  }
	  result=JSON.stringify(result)    //先将result转化为String类型的数据
	  result=JSON.parse(result) 
   var aa=result[0].people_ctrol
	 aa=aa.split(',')
	for(var i=0;i<aa.length;i++)
	{
		if(aa[i]=='3')
			{
				var selectId = req.query.id.split(",")
		var delsql = 'DELETE FROM people_information where id ='
		for(var i = 0; i < selectId.length; i++){
			if(i == 0){
				delsql += selectId[i]
			} else {
				delsql += " or id = " + selectId[i]
			}
		}
		console.log(delsql)
		Pfile.deleteSql(delsql, req.query.id, function(err) {
		if(err) {
			return res.status(500).send('Server error')	
		}
		 return res.redirect('/views/detail/rygl/dygl')
	})
			break
			}else{
			if(i==aa.length-1)
			{
				return res.send("你没有此权限")
//				console.log("你没有此操作权限")
//				res.redirect("/views/detail/rygl/dygl")
			
			}else{
				continue
			}
		    }
	}
	})
	}else{
		res.render('login.html')
	}
})
//党员发展
router.get('/views/detail/rygl/dyfz', function(req, res){
	var sql = 'SELECT * FROM people_develope';
	Pfile.searchFile(sql, function(err, people){
		if(err){
			return res.status(500).send('Servor error'+err.message)
		}
		//console.log(people)
		res.render('detail/rygl/dyfz.html',{
			people:people
		})
	})
})
 

//党员发展----------审核
router.get('/views/detail/rygl/dyfz/examine', function(req, res){
	if(req.session.username)
	{
	var sql1='SELECT commen_userroleinf.loginAcc,commen_userpowerinfo.property,commen_userpowerinfo.people_ctrol FROM commen_userroleinf,commen_userpowerinfo  WHERE commen_userroleinf.property = commen_userpowerinfo.property and  commen_userroleinf.loginAcc='+"\'"+req.session.username+"\'"
	console.log(sql1)
	connection.query(sql1,function (err,result) {
	  if(err){
	    return err;
	  }
	  result=JSON.stringify(result)    //先将result转化为String类型的数据
	  result=JSON.parse(result) 
   var aa=result[0].people_ctrol
	 aa=aa.split(',')
	for(var i=0;i<aa.length;i++)
	{
		if(aa[i]=='11')
			{
				var selectId = req.query.id.split(",")
	console.log(selectId)
	
	for(var i = 0; i < selectId.length; i++){
		var reqId = selectId[i]
		var searchsql="select * from people_develope where id ="+reqId;
		connection.query(searchsql,function (err,infrom) {
		  if(err){
		    return err;
		  }
		  infrom=JSON.stringify(infrom)    //先将result转化为String类型的数据
		  infrom=JSON.parse(infrom) 
		  var people=infrom[0]
			
		 	var maxid = "select max(id) from people_isnocommitypeople"
			//console.log(maxid)
			connection.query(maxid,function (err,result) {
			  if(err){
			    return err;
			  }
			  result=JSON.stringify(result)    //先将result转化为String类型的数据
		  	  result=JSON.parse(result)
		  	  var ret = result[0]
			  var peopleId = ret['max(id)'] + 1
//				console.log(people)
				var add="insert into people_isnocommitypeople values("
				 +  peopleId + ","
				  + "\'" + people.name + "\'" + "," 
				   +"\'" + people.gender + "\'" + ","
				    +"\'" + people.nation + "\'" + ","
				   +"\'" + people.idCardNum + "\'" + "," 
				   + "\'" + people.phoneNum + "\'" + ","
				   + "\'" + people.birthDay + "\'" +  ","
				     + "\'" + people.culture_level + "\'" +  ","
				      + "\'" + people.attribute + "\'" +  ","
				      + "\'" + people.onattribute + "\'" +  ","
				        + "\'" + people.positionIt + "\'" +  "," 
				          + "\'" + people.personalimage + "\'" +  ","
				    		+ "\'" + people.workTime + "\'" +  ","
				    		+ "\'" + people.partAndDuty + "\'" +  ","
				    		+ "\'" + people.belongorganazition + "\'" +  ","
				    		+ "\'" + "暂无数据" + "\'" +  ","
							+ "\'" + people.status + "\'" +  ","
				      		+ "\'" + people.defaultpassword+ "\'"+ ")"
				console.log(add)
				connection.query(add,function (err,result) {
				  if(err){
				    return err;
				  }
				  return
				})
				console.log(add)
				var selectId = req.query.id.split(",")
				console.log(i)
				var delsql = 'DELETE FROM people_develope where id =' + reqId;
				console.log(delsql)
				connection.query(delsql,function (err,result) {
					if(err){
					    return err
					}
					return null
				})
				
				return res.redirect('/views/detail/rygl/dyfz')
			})
		 })
	}
			break
			}else{
			if(i==aa.length-1)
			{
				return res.send("你没有此权限")
			
			}else{
				continue
			}
		   }
	}
	})
	}else{
		res.render('login.html')
	}
})
//党员发展--------目录树
router.get('/views/detail/rygl/dyfz-tree', function(req, res){
	var sql = 'SELECT * FROM people_develope where belongorganazition =' + "\'" + req.query.name + "\'";
	Pfile.searchFile(sql, function(err, people){
		if(err){
			return res.status(500).send('Servor error'+err.message)
		}
		//console.log(people)
		res.render('detail/rygl/dyfz.html',{
			people:people
		})
	})
})

//console.log(people)
//数据更新
		// var addsql = "update people_isnocommitypeople set name=" +"\'" + people.name + "\'"+ "," + "phoneNum=" +"\'" + people.phoneNum + "\'" 
		// 	+ "," + "gender=" +"\'" + people.gender + "\'"
		// + "," + "idCardNum=" +"\'" + people.idCardNum + "\'"
		// + "," + "birthDay=" +"\'" + people.birthDay + "\'"+"where id=" + people.id;
		// console.log(addsql)


		// connection.query(addsql,function (err,results) {
		//   if(err){
		//     return err
		//   }
		// 	return results
		// })

//党员发展-删除
router.get('/views/detail/rygl/dyfz/delete', function(req, res){
 if(req.session.username)
	{
	var sql1='SELECT commen_userroleinf.loginAcc,commen_userpowerinfo.property,commen_userpowerinfo.people_ctrol FROM commen_userroleinf,commen_userpowerinfo  WHERE commen_userroleinf.property = commen_userpowerinfo.property and  commen_userroleinf.loginAcc='+"\'"+req.session.username+"\'"
	console.log(sql1)
	connection.query(sql1,function (err,result) {
	  if(err){
	    return err;
	  }
	  result=JSON.stringify(result)    //先将result转化为String类型的数据
	  result=JSON.parse(result) 
   var aa=result[0].people_ctrol
	 aa=aa.split(',')
	for(var i=0;i<aa.length;i++)
	{
		if(aa[i]=='11')
			{
				var selectId = req.query.id.split(",")
		var delsql = 'DELETE FROM people_develope where id ='
		for(var i = 0; i < selectId.length; i++){
			if(i == 0){
				delsql += selectId[i]
			} else {
				delsql += " or id = " + selectId[i]
			}
		}
			console.log(delsql)
			Pfile.deleteSql(delsql, req.query.id, function(err) {
			if(err) {
				return res.status(500).send('Server error')	
			}
			 return res.redirect('/views/detail/rygl/dyfz')
		})
			break
	  }else{
			if(i==aa.length-1)
			{
				return res.send("你没有此权限")
			
			}else{
				continue
			}
		    }
	}
	})
	}else{
		res.render('login.html')
	}
})
//党员发展-------查询
router.post('/views/detail/rygl/dyfz-search', function(req,res){
	var inform = req.body
	for(var key in inform){
		if(inform[key] == ''){
			delete inform[key]
		}
	}
	if(JSON.stringify(inform) == '{}'){
		console.log('2333')
		res.redirect('/views/detail/rygl/dyfz')
		return
	}
//	console.log(inform)
	var sql = "select * from people_develope where " 
	var i = 0
	for(var key in inform){
		if (i == 0){
			sql += key + " like" + "\'"+"%"+inform[key]+"%"+"\'"
			i++
		} else {
			sql += "and " + key + " like" + "\'"+"%"+inform[key]+"%"+"\'"
		}
	}
//	console.log(sql)
	Pfile.selectSql(sql, function(err, people) {
		if (err) {
			return res.status(500).send('Server error'+err.message)
		}
		res.render('detail/rygl/dyfz.html', {
			people: people
		})
	})
})
//非党管理
router.get('/views/detail/rygl/fdgl', function(req, res){
	var sql = 'SELECT * FROM people_isnocommitypeople';
	Pfile.searchFile(sql, function(err, people){
		if(err){
			return res.status(500).send('Servor error'+err.message)
		}
		//console.log(people)
		res.render('detail/rygl/fdgl.html',{
			people:people
		})
	})
})
//非党管理----转为入党积极分子
router.get('/views/detail/rygl/fdgl/examine', function(req, res){
	if(req.session.username)
	{
	var sql1='SELECT commen_userroleinf.loginAcc,commen_userpowerinfo.property,commen_userpowerinfo.people_ctrol FROM commen_userroleinf,commen_userpowerinfo  WHERE commen_userroleinf.property = commen_userpowerinfo.property and  commen_userroleinf.loginAcc='+"\'"+req.session.username+"\'"
	console.log(sql1)
	connection.query(sql1,function (err,result) {
	  if(err){
	    return err;
	  }
	  result=JSON.stringify(result)    //先将result转化为String类型的数据
	  result=JSON.parse(result) 
   var aa=result[0].people_ctrol
	 aa=aa.split(',')
	for(var i=0;i<aa.length;i++)
	{
		
		if(aa[i]=='12')
			{
				var searchsql="select * from people_isnocommitypeople where id ="+req.query.id;
	connection.query(searchsql,function (err,result) {
	  if(err){
	    return err;
	  }
	  result=JSON.stringify(result)    //先将result转化为String类型的数据
	  result=JSON.parse(result) 
	  var people=result[0]
		
	 	var maxid = "select max(id) from people_povertycommitypeople"
		//console.log(maxid)
		connection.query(maxid,function (err,result) {
		  if(err){
		    return err;
		  }
		  result=JSON.stringify(result)    //先将result转化为String类型的数据
	  	  result=JSON.parse(result)
	  	  var ret = result[0]
		  var peopleId = ret['max(id)'] + 1

			var add="insert into people_povertycommitypeople values("
			 +  peopleId + ","
			  + "\'" + people.name + "\'" + "," 
			   + "\'" + "暂无数据" + "\'" + "," 
			   +"\'" + people.gender + "\'" + ","
			    +"\'" + people.nation + "\'" + ","
			   +"\'" + people.idCardNum + "\'" + "," 
			   + "\'" + people.phoneNum + "\'" + ","
			     + "\'" + people.culture_level + "\'" +  ","
			      + "\'" + people.onattribute + "\'" +  ","
			       + "\'" + people.attribute + "\'" +  ","
			        + "\'" + people.positionIt + "\'" +  ","
			         + "\'" + people.birthDay + "\'" +  ","
			          + "\'" + people.personalimage + "\'" +  ","
			    		+ "\'" + people.workTime + "\'" +  ","
			    		+ "\'" + people.partAndDuty + "\'" +  ","
			    		+ "\'" + people.belongorganazation + "\'" +  ","
			    		+ "\'" + "暂无数据" + "\'" +  ","
						+ "\'" + people.status + "\'" +  ","
			      		+ "\'" + people.defaultpassword+ "\'"+ ")"
			      console.log(add)

			connection.query(add,function (err,result) {
			  if(err){
			    return err;
			  }
			})

			var delsql = 'DELETE FROM people_isnocommitypeople where id =' + req.query.id;

			connection.query(delsql,function (err,result) {
				  if(err){
				    return err
				  }
				return null
			})
			res.redirect('/views/detail/rygl/fdgl')
			})
	 })
		break
			}else{
			if(i==aa.length-1)
			{
				return res.send("你没有此权限")
			
			}else{
				continue
			}
		    }
	}
	})
	}else{
		res.render('login.html')
	}
})
//非党管理-------初始化密码
router.get('/views/detail/rygl/fdgl/default', function(req, res){
	if(req.session.username)
	{
	var sql1='SELECT commen_userroleinf.loginAcc,commen_userpowerinfo.property,commen_userpowerinfo.people_ctrol FROM commen_userroleinf,commen_userpowerinfo  WHERE commen_userroleinf.property = commen_userpowerinfo.property and  commen_userroleinf.loginAcc='+"\'"+req.session.username+"\'"
	console.log(sql1)
	connection.query(sql1,function (err,result) {
	  if(err){
	    return err;
	  }
	  result=JSON.stringify(result)    //先将result转化为String类型的数据
	  result=JSON.parse(result) 
   var aa=result[0].people_ctrol
	 aa=aa.split(',')
	for(var i=0;i<aa.length;i++)
	{
		if(aa[i]=='12')
			{
				var editsql = "update people_isnocommitypeople set defaultpassword = '111111' where id =" + req.query.id;
	console.log(editsql)
	connection.query(editsql,function (err,result) {
		  if(err){
		    return err
		  }
		})
	res.redirect('/views/detail/rygl/fdgl')
	break
			}else{
			if(i==aa.length-1)
			{
				return res.send("你没有此权限")
			
			}else{
				continue
			}
		    }
		}
	})
	}else{
		res.render('login.html')
		}
})
//非党管理-删除
router.get('/views/detail/rygl/fdgl/delete', function(req, res){
	if(req.session.username)
	{
	var sql1='SELECT commen_userroleinf.loginAcc,commen_userpowerinfo.property,commen_userpowerinfo.people_ctrol FROM commen_userroleinf,commen_userpowerinfo  WHERE commen_userroleinf.property = commen_userpowerinfo.property and  commen_userroleinf.loginAcc='+"\'"+req.session.username+"\'"
//	console.log(sql1)
	connection.query(sql1,function (err,result) {
	  if(err){
	    return err;
	  }
	  result=JSON.stringify(result)    //先将result转化为String类型的数据
	  result=JSON.parse(result) 
   var aa=result[0].people_ctrol
	 aa=aa.split(',')
	for(var i=0;i<aa.length;i++)
	{
		if(aa[i]=='12')
			{
				var selectId = req.query.id.split(",")
		var delsql = 'DELETE FROM people_isnocommitypeople where id ='
		for(var i = 0; i < selectId.length; i++){
			if(i == 0){
				delsql += selectId[i]
			} else {
				delsql += " or id = " + selectId[i]
			}
		}
//		console.log(delsql)
	Pfile.deleteSql(delsql, req.query.name, function(err) {
		if(err) {
			return res.status(500).send('Server error'+err.message)	
		}
		res.redirect('/views/detail/rygl/fdgl')
	})
			break
			}else{
			if(i==aa.length-1)
			{
				return res.send("你没有此权限")
			
			}else{
				continue
			}
		    }
	}
	})
	}else{
		res.render('login.html')
	}
})
//非党管理--------目录树
router.get('/views/detail/rygl/fdgl-tree', function(req, res){
	var sql = 'SELECT * FROM people_isnocommitypeople where belongorganazation =' + "\'" + req.query.name + "\'";
	Pfile.searchFile(sql, function(err, people){
		if(err){
			return res.status(500).send('Servor error'+err.message)
		}
		//console.log(people)
		res.render('detail/rygl/fdgl.html',{
			people:people
		})
	})
})
//非党管理-------查询
router.post('/views/detail/rygl/fdgl-search', function(req,res){
	var inform = req.body
	for(var key in inform){
		if(inform[key] == ''){
			delete inform[key]
		}
	}
	if(JSON.stringify(inform) == '{}'){
		console.log('2333')
		res.redirect('/views/detail/rygl/fdgl')
		return
	}
//	console.log(inform)
	var sql = "select * from people_isnocommitypeople where " 
	var i = 0
	for(var key in inform){
		if (i == 0){
			sql += key + " like" + "\'"+"%"+inform[key]+"%"+"\'"
			i++
		} else {
			sql += "and " + key + " like" + "\'"+"%"+inform[key]+"%"+"\'"
		}
	}
//	console.log(sql)
	Pfile.selectSql(sql, function(err, people) {
		if (err) {
			return res.status(500).send('Server error'+err.message)
		}
		res.render('detail/rygl/fdgl.html', {
			people: people
		})
	})
})
//入党积极分子
router.get('/views/detail/rygl/rdjjfz', function(req, res){
	var sql = 'SELECT * FROM people_povertycommitypeople';
	Pfile.searchFile(sql, function(err, people){
		if(err){
			return res.status(500).send('Servor error'+err.message)
		}
		//console.log(people)
		res.render('detail/rygl/rdjjfz.html',{
			people:people
		})
	})
})
//入党积极分子-删除
router.get('/views/detail/rygl/rdjjfz/delete', function(req, res){
	if(req.session.username)
	{
	var sql1='SELECT commen_userroleinf.loginAcc,commen_userpowerinfo.property,commen_userpowerinfo.people_ctrol FROM commen_userroleinf,commen_userpowerinfo  WHERE commen_userroleinf.property = commen_userpowerinfo.property and  commen_userroleinf.loginAcc='+"\'"+req.session.username+"\'"
	console.log(sql1)
	connection.query(sql1,function (err,result) {
	  if(err){
	    return err;
	  }
	  result=JSON.stringify(result)    //先将result转化为String类型的数据
	  result=JSON.parse(result) 
   var aa=result[0].people_ctrol
	 aa=aa.split(',')
	for(var i=0;i<aa.length;i++)
	{
		if(aa[i]=='13')
			{
				var selectId = req.query.id.split(",")
		var delsql = 'DELETE FROM people_povertycommitypeople where id ='
		for(var i = 0; i < selectId.length; i++){
			if(i == 0){
				delsql += selectId[i]
			} else {
				delsql += " or id = " + selectId[i]
			}
		}
		console.log(delsql)
	Pfile.deleteSql(delsql, req.query.name, function(err) {
		if(err) {
			return res.status(500).send('Server error'+err.message)	
		}
		res.redirect('/views/detail/rygl/rdjjfz')
	})
	break
			}else{
			if(i==aa.length-1)
			{
				return res.send("你没有此权限")
			
			}else{
				continue
			}
		    }
	}
	})
	}else{
		res.render('login.html')
	}

})
//入党积极分子-------查询
router.post('/views/detail/rygl/rdjjfz-search', function(req,res){
	var inform = req.body
	for(var key in inform){
		if(inform[key] == ''){
			delete inform[key]
		}
	}
	if(JSON.stringify(inform) == '{}'){
		console.log('2333')
		res.redirect('/views/detail/rygl/rdjjfz')
		return
	}
//	console.log(inform)
	var sql = "select * from people_povertycommitypeople where " 
	var i = 0
	for(var key in inform){
		if (i == 0){
			sql += key + " like" + "\'"+"%"+inform[key]+"%"+"\'"
			i++
		} else {
			sql += "and " + key + " like" + "\'"+"%"+inform[key]+"%"+"\'"
		}
	}
//	console.log(sql)
	Pfile.selectSql(sql, function(err, people) {
		if (err) {
			return res.status(500).send('Server error'+err.message)
		}
		res.render('detail/rygl/rdjjfz.html', {
			people: people
		})
	})
})
//入党积极分子-------初始化密码
router.get('/views/detail/rygl/rdjjfz/default', function(req, res){
	if(req.session.username)
	{
	var sql1='SELECT commen_userroleinf.loginAcc,commen_userpowerinfo.property,commen_userpowerinfo.people_ctrol FROM commen_userroleinf,commen_userpowerinfo  WHERE commen_userroleinf.property = commen_userpowerinfo.property and  commen_userroleinf.loginAcc='+"\'"+req.session.username+"\'"
	console.log(sql1)
	connection.query(sql1,function (err,result) {
	  if(err){
	    return err;
	  }
	  result=JSON.stringify(result)    //先将result转化为String类型的数据
	  result=JSON.parse(result) 
   var aa=result[0].people_ctrol
	 aa=aa.split(',')
	for(var i=0;i<aa.length;i++)
	{
		if(aa[i]=='13')
			{
				var editsql = "update people_povertycommitypeople set defaultpassword = '111111' where id =" + req.query.id;
	//console.log(editsql)
	connection.query(editsql,function (err,result) {
		  if(err){
		    return err
		  }
		})
	res.redirect('/views/detail/rygl/rdjjfz')
	break
			}else{
			if(i==aa.length-1)
			{
				return res.send("你没有此权限")
			
			}else{
				continue
			}
		    }
	}
	})
	}else{
		res.render('login.html')
	}
})
//入党积极分子--------目录树
router.get('/views/detail/rygl/rdjjfz-tree', function(req, res){
	var sql = 'SELECT * FROM people_povertycommitypeople where belongorganazation =' + "\'" + req.query.name + "\'";
	Pfile.searchFile(sql, function(err, people){
		if(err){
			return res.status(500).send('Servor error'+err.message)
		}
		//console.log(people)
		res.render('detail/rygl/rdjjfz.html',{
			people:people
		})
	})
})
//入党积极分子-------审核转为党员
router.get('/views/detail/rygl/rdjjfz/examine', function(req, res){
	if(req.session.username)
	{
	var sql1='SELECT commen_userroleinf.loginAcc,commen_userpowerinfo.property,commen_userpowerinfo.people_ctrol FROM commen_userroleinf,commen_userpowerinfo  WHERE commen_userroleinf.property = commen_userpowerinfo.property and  commen_userroleinf.loginAcc='+"\'"+req.session.username+"\'"
	console.log(sql1)
	connection.query(sql1,function (err,result) {
	  if(err){
	    return err;
	  }
	  result=JSON.stringify(result)    //先将result转化为String类型的数据
	  result=JSON.parse(result) 
   var aa=result[0].people_ctrol
	 aa=aa.split(',')
	for(var i=0;i<aa.length;i++)
	{
		if(aa[i]=='13')
			{
				var searchsql="select * from people_povertycommitypeople where id ="+req.query.id;
	connection.query(searchsql,function (err,result) {
	  if(err){
	    return err;
	  }
	  result=JSON.stringify(result)    //先将result转化为String类型的数据
	  result=JSON.parse(result) 
	  var people=result[0]
		
	 	var maxid = "select max(id) from people_information"
		//console.log(maxid)
		connection.query(maxid,function (err,result) {
		  if(err){
		    return err;
		  }
		  result=JSON.stringify(result)    //先将result转化为String类型的数据
	  	  result=JSON.parse(result)
	  	  var ret = result[0]
		  var peopleId = ret['max(id)'] + 1
		  
		  	  //获取当前时间
		  var date = new Date();
	        var seperator1 = "-";
	        var year = date.getFullYear();
	        var month = date.getMonth() + 1;
	        var strDate = date.getDate();
	        if (month >= 1 && month <= 9) {
	            month = "0" + month;
	        }
	        if (strDate >= 0 && strDate <= 9) {
	            strDate = "0" + strDate;
	        }
	        var currentdate = year + seperator1 + month + seperator1 + strDate;
	
		  

			var add="insert into people_information values("
			 +  peopleId + ","
			  + "\'" + people.name + "\'" + "," 
			  + "\'" + people.age + "\'" + "," 
			   +"\'" + people.gender + "\'" + ","
			   +"\'" + people.nation + "\'" + ","
			   +"\'" + people.idCardNum + "\'" + "," 
			   + "\'" + people.phoneNum + "\'" + ","
			   + "\'" + "暂无数据" + "\'" + ","
			   + "\'" + "暂无数据" + "\'" + ","  
			   + "\'" + "暂无数据" + "\'" + ","  
			   + "\'" + "暂无数据" + "\'" + ","  
			    + "\'" + people.culture_level + "\'" +  ","
			     + "\'" + people.onattribute + "\'" +  ","
			      + "\'" + currentdate + "\'" +  ","
			      + "\'" + "请选择" + "\'" +  ","
			      + "\'" + "请选择" + "\'" +  ","
			      + "\'" + people.belongorganazation + "\'" +  ","
			       + "\'" + "请选择" + "\'" +  ","
			        + "\'" + '预备党员' + "\'" +  ","
			         + "\'" + people.attribute + "\'" +  ","
			          + "\'" + "请选择" + "\'" +  ","
			          + "\'" + people.positionIt + "\'" +  ","
			           + "\'" + people.birthDay + "\'" +  ","
			             + "\'" + "否" + "\'" +  ","
			              + "\'" + "否" + "\'" +  ","
			               + "\'" + "否" + "\'" +  ","
			                + "\'" + "暂无数据" + "\'" +  ","
			                 + "\'" + "暂无数据" + "\'" +  ","
			                  + "\'" + "暂无数据" + "\'" +  ","
			                   + "\'" + "暂无数据" + "\'" +  ","
			                    + "\'" + "暂无数据" + "\'" +  ","
			                   + "\'" + "暂无数据" + "\'" +  ","
			                   + "\'" + "暂无数据" + "\'" +  ","
			                    + "\'" + "111111" + "\'" +  ","
			                    + "\'" + "暂无数据" + "\'" +  ","
			                      + "\'" + "0" + "\'" +  ","
			                      + "\'" + "0" + "\'" +  ","
			                      + "\'" + "暂无数据" + "\'" +  ","
			                     + "\'" + people.workTime + "\'" + ")"
			     
//			      console.log(add)

			connection.query(add,function (err,result) {
			  if(err){
			    return err;
			  }
			})
			var delsql = 'DELETE FROM people_povertycommitypeople where id =' + req.query.id;

			connection.query(delsql,function (err,result) {
				  if(err){
				    return err
				  }
				return null
			})
			res.redirect('/views/detail/rygl/rdjjfz')
			})
	 	})
			break
			}else{
			if(i==aa.length-1)
			{
				return res.send("你没有此权限")
			
			}else{
				continue
			}
		    }
		}
	})
	}else{
		res.render('login.html')
	}
})
//流动党员找组织
router.get('/views/detail/rygl/lddyzzz', function(req, res){
	var sql = 'SELECT * FROM floatincommity';
	Pfile.searchFile(sql, function(err, people){
		if(err){
			return res.status(500).send('Servor error'+err.message)
		}
		//console.log(people)
		res.render('detail/rygl/lddyzzz.html',{
			people:people
		})
	})
})
//流动党员找组织-------查询
router.post('/views/detail/rygl/lddyzzz-search', function(req,res){
	var inform = req.body
	for(var key in inform){
		if(inform[key] == ''){
			delete inform[key]
		}
	}
	if(JSON.stringify(inform) == '{}'){
		console.log('2333')
		res.redirect('/views/detail/rygl/lddyzzz')
		return
	}
//	console.log(inform)
	var sql = "select * from floatincommity where " 
	var i = 0
	for(var key in inform){
		if (i == 0){
			sql += key + " like" + "\'"+"%"+inform[key]+"%"+"\'"
			i++
		} else {
			sql += "and " + key + " like" + "\'"+"%"+inform[key]+"%"+"\'"
		}
	}
//	console.log(sql)
	Pfile.selectSql(sql, function(err, people) {
		if (err) {
			return res.status(500).send('Server error'+err.message)
		}
		res.render('detail/rygl/lddyzzz.html', {
			people: people
		})
	})
})
//流动党员找组织--------目录树
router.get('/views/detail/rygl/lddyzzz-tree', function(req, res){
	var sql = 'SELECT * FROM floatincommity where floatinpart =' + "\'" + req.query.name + "\'";
	console.log(sql)
	Pfile.searchFile(sql, function(err, people){
		if(err){
			return res.status(500).send('Servor error'+err.message)
		}
		//console.log(people)
		res.render('detail/rygl/lddyzzz.html',{
			people:people
		})
	})
})
//流动党员找组织-----审核
router.get('/views/detail/rygl/lddyzzz-examine', function(req, res){
if(req.session.username)
	{
	var sql1='SELECT commen_userroleinf.loginAcc,commen_userpowerinfo.property,commen_userpowerinfo.people_ctrol FROM commen_userroleinf,commen_userpowerinfo  WHERE commen_userroleinf.property = commen_userpowerinfo.property and  commen_userroleinf.loginAcc='+"\'"+req.session.username+"\'"
	console.log(sql1)
	connection.query(sql1,function (err,result) {
	  if(err){
	    return err;
	  }
	  result=JSON.stringify(result)    //先将result转化为String类型的数据
	  result=JSON.parse(result) 
   var aa=result[0].people_ctrol
	 aa=aa.split(',')
	for(var i=0;i<aa.length;i++)
	{
		if(aa[i]=='14')
			{
				var people = req.query
	var editsql = "update floatincommity set isfloat =" +"\'" + "确认审核" + "\'"
	+"where id=" + people.id;
//console.log(people.id)
console.log(editsql)
	Pfile.editById(editsql, function(err){
			if(err) {
				return res.status(500).send('Server error'+err.message)	
			}
			res.redirect('/views/detail/rygl/lddyzzz')
		})
	break
	  }else{
			if(i==aa.length-1)
			{
				return res.send("你没有此权限")
			
			}else{
				continue
			}
		   }
	}
	})
	}else{
		res.render('login.html')
	}
})
//流动党员找组织-------初始化密码
router.get('/views/detail/rygl/lddyzzz-default', function(req, res){
	if(req.session.username)
	{
	var sql1='SELECT commen_userroleinf.loginAcc,commen_userpowerinfo.property,commen_userpowerinfo.people_ctrol FROM commen_userroleinf,commen_userpowerinfo  WHERE commen_userroleinf.property = commen_userpowerinfo.property and  commen_userroleinf.loginAcc='+"\'"+req.session.username+"\'"
	console.log(sql1)
	connection.query(sql1,function (err,result) {
	  if(err){
	    return err;
	  }
	  result=JSON.stringify(result)    //先将result转化为String类型的数据
	  result=JSON.parse(result) 
   var aa=result[0].people_ctrol
	 aa=aa.split(',')
	for(var i=0;i<aa.length;i++)
	{
		if(aa[i]=='14')
			{
					var editsql = "update floatincommity set defaultpassword = '123456' where id =" + req.query.id;
		//console.log(editsql)
		connection.query(editsql,function (err,result) {
			  if(err){
			    return err
			  }
			})
		res.redirect('/views/detail/rygl/lddyzzz')
		break
		}else{
			if(i==aa.length-1)
			{
				return res.send("你没有此权限")
			
			}else{
				continue
			}
		   }
	}
	})
	}else{
		res.render('login.html')
	}
})
/*
 * 党员关爱
 */
//结对帮扶
router.get('/views/detail/dyga/jdbf', function(req, res){
	var sql = 'SELECT * FROM heart_help_poorpeople';
	Pfile.searchFile(sql, function(err, people){
		if(err){
			return res.status(500).send('Servor error'+err.message)
		}
		//console.log(people)
		res.render('detail/dyga/jdbf.html',{
			people:people
		})
	})
})
//结对帮扶-------查看
router.get('/views/detail/daga/jdbf/detail', function(req, res){
	if(req.session.username)
	{
	var sql1='SELECT commen_userroleinf.loginAcc,commen_userpowerinfo.property,commen_userpowerinfo.people_ctrol FROM commen_userroleinf,commen_userpowerinfo  WHERE commen_userroleinf.property = commen_userpowerinfo.property and  commen_userroleinf.loginAcc='+"\'"+req.session.username+"\'"
	console.log(sql1)
	connection.query(sql1,function (err,result) {
	  if(err){
	    return err;
	  }
	  result=JSON.stringify(result)    //先将result转化为String类型的数据
	  result=JSON.parse(result) 
   var aa=result[0].people_ctrol
	 aa=aa.split(',')
	for(var i=0;i<aa.length;i++)
	{
			if(aa[i]=='18')
				{
					  		var sql = 'SELECT * FROM heart_help_poorpeople where id =' + req.query.id;
		Pfile.searchById(sql,parseInt(req.query.id), function (err, people) {
			if (err) {
				return res.status(500).send('Server error'+err.message)
			}
			 return res.render('detail/dyga/jdbf-detail.html', {
				people: people
			})
		})
		break
		}else{
			if(i==aa.length-1)
			{
				return res.send("你没有此权限")
			
			}else{
				continue
			}
		    }
	}
	
	})
	}else{
		res.render('login.html')
	}
})
//结对帮扶-------修改
router.get('/views/detail/daga/jdbf/edit', function(req, res){
	if(req.session.username)
	{
	var sql1='SELECT commen_userroleinf.loginAcc,commen_userpowerinfo.property,commen_userpowerinfo.people_ctrol FROM commen_userroleinf,commen_userpowerinfo  WHERE commen_userroleinf.property = commen_userpowerinfo.property and  commen_userroleinf.loginAcc='+"\'"+req.session.username+"\'"
	console.log(sql1)
	connection.query(sql1,function (err,result) {
	  if(err){
	    return err;
	  }
	  result=JSON.stringify(result)    //先将result转化为String类型的数据
	  result=JSON.parse(result) 
   var aa=result[0].people_ctrol
	 aa=aa.split(',')
	 console.log(aa[10])
//console.log(aa.length)
	for(var i=0;i<aa.length;i++)
	{
			if(aa[i]=='16')
				{
						var sql = 'SELECT * FROM heart_help_poorpeople where id =' + req.query.id;
		Pfile.searchById(sql,parseInt(req.query.id), function (err, people) {
			if (err) {
				return res.status(500).send('Server error'+err.message)
			}
			return res.render('detail/dyga/jdbf-edit.html', {
				people: people
			})
		})
		break
		}else{
			if(i==aa.length-1)
			{
//				console.log(i)
//				return res.send("你没有此权限")
//				console.log("你没有此操作权限")
			
			}else{
				continue
			}
		    }
	}
	})
	}else{
		res.render('login.html')
	}
})
router.post('/views/detail/daga/jdbf/edit', function(req, res){
	var people = req.body
	//var editsql = "update people_information set name=" +"\'" + people.name + "\'"+"where id=" + people.id;
	var editsql = "update heart_help_poorpeople set id=" +"\'" + people.id + "\'"+ "," + "time=" +"\'" + people.time + "\'" 
	+ "," + "address=" +"\'" + people.address + "\'"
+ "," + "title=" +"\'" + people.title + "\'"
+ "," + "content=" +"\'" + people.content + "\'"
+"where id=" + people.id;
//	console.log(editsql)
	Pfile.editById(editsql, function(err){
		if(err) {
			return res.status(500).send('Server error'+err.message)	
		}
		res.redirect('/views/detail/dyga/jdbf')
	})
})
//结对帮扶-删除
router.get('/views/detail/dyga/jdbf/delete', function(req, res){
	if(req.session.username)
	{
	var sql1='SELECT commen_userroleinf.loginAcc,commen_userpowerinfo.property,commen_userpowerinfo.people_ctrol FROM commen_userroleinf,commen_userpowerinfo  WHERE commen_userroleinf.property = commen_userpowerinfo.property and  commen_userroleinf.loginAcc='+"\'"+req.session.username+"\'"
	console.log(sql1)
	connection.query(sql1,function (err,result) {
	  if(err){
	    return err;
	  }
	  result=JSON.stringify(result)    //先将result转化为String类型的数据
	  result=JSON.parse(result) 
   var aa=result[0].people_ctrol
	 aa=aa.split(',')
	for(var i=0;i<aa.length;i++)
	{
			if(aa[i]=='17')
				{
					var selectId = req.query.id.split(",")
			var delsql = 'DELETE FROM heart_help_poorpeople where id ='
			for(var i = 0; i < selectId.length; i++){
				if(i == 0){
					delsql += selectId[i]
				} else {
					delsql += " or id = " + selectId[i]
				}
			}
			console.log(delsql)
		Pfile.deleteSql(delsql, req.query.name, function(err) {
			if(err) {
				return res.status(500).send('Server error'+err.message)	
			}
			res.redirect('/views/detail/dyga/jdbf')
		})
		break
		}else{
			if(i==aa.length-1)
			{
				return res.send("你没有此权限")
			
			}else{
				continue
			}
		   }
	}
	})
	}else{
		res.render('login.html')
	}

})
//结对帮扶-------查询
router.post('/views/detail/dyga/jdbf-search', function(req,res){
	var inform = req.body
	for(var key in inform){
		if(inform[key] == ''){
			delete inform[key]
		}
	}
	if(JSON.stringify(inform) == '{}'){
		console.log('2333')
		res.redirect('/views/detail/dyga/jdbf')
		return
	}
//	console.log(inform)
	var sql = "select * from heart_help_poorpeople where " 
	var i = 0
	for(var key in inform){
		if (i == 0){
			sql += key + " like" + "\'"+"%"+inform[key]+"%"+"\'"
			i++
		} else {
			sql += "and " + key + " like" + "\'"+"%"+inform[key]+"%"+"\'"
		}
	}
//	console.log(sql)
	Pfile.selectSql(sql, function(err, people) {
		if (err) {
			return res.status(500).send('Server error'+err.message)
		}
		res.render('detail/dyga/jdbf.html', {
			people: people
		})
	})
})
//培养积极分子
router.get('/views/detail/dyga/pyjjfz', function(req, res){
	var sql = 'SELECT * FROM heart_educatepovertypeople';
	Pfile.searchFile(sql, function(err, people){
		if(err){
			return res.status(500).send('Servor error'+err.message)
		}
		//console.log(people)
		res.render('detail/dyga/pyjjfz.html',{
			people:people
		})
	})
})
//培养积极分子-------查看
router.get('/views/detail/dyga/pyjjfz/detail', function(req, res){
 if(req.session.username)
	{
	var sql1='SELECT commen_userroleinf.loginAcc,commen_userpowerinfo.property,commen_userpowerinfo.people_ctrol FROM commen_userroleinf,commen_userpowerinfo  WHERE commen_userroleinf.property = commen_userpowerinfo.property and  commen_userroleinf.loginAcc='+"\'"+req.session.username+"\'"
	console.log(sql1)
	connection.query(sql1,function (err,result) {
	  if(err){
	    return err;
	  }
	  result=JSON.stringify(result)    //先将result转化为String类型的数据
	  result=JSON.parse(result) 
   var aa=result[0].people_ctrol
	 aa=aa.split(',')
	for(var i=0;i<aa.length;i++)
	{
			if(aa[i]=='22')
				{
					  		var sql = 'SELECT * FROM heart_educatepovertypeople where id =' + req.query.id;
		Pfile.searchById(sql,parseInt(req.query.id), function (err, people) {
			if (err) {
				return res.status(500).send('Server error'+err.message)
			}
			res.render('detail/dyga/pyjjfz-detail.html', {
				people: people
			})
		})
		break
		}else{
			if(i==aa.length-1)
			{
				return res.send("你没有此权限")
			
			}else{
				continue
			}
		    }
	}
 	})
	}else{
		res.render('login.html')
	}
})
//培养基积极分子-------修改
router.get('/views/detail/dyga/pyjjfz/edit', function(req, res){
	if(req.session.username)
	{
	var sql1='SELECT commen_userroleinf.loginAcc,commen_userpowerinfo.property,commen_userpowerinfo.people_ctrol FROM commen_userroleinf,commen_userpowerinfo  WHERE commen_userroleinf.property = commen_userpowerinfo.property and  commen_userroleinf.loginAcc='+"\'"+req.session.username+"\'"
	console.log(sql1)
	connection.query(sql1,function (err,result) {
	  if(err){
	    return err;
	  }
	  result=JSON.stringify(result)    //先将result转化为String类型的数据
	  result=JSON.parse(result) 
   var aa=result[0].people_ctrol
	 aa=aa.split(',')
	for(var i=0;i<aa.length;i++)
	{
			if(aa[i]=='20')
				{
					var sql = 'SELECT * FROM heart_educatepovertypeople where id =' + req.query.id;
		Pfile.searchById(sql,parseInt(req.query.id), function (err, people) {
			if (err) {
				return res.status(500).send('Server error'+err.message)
			}
			res.render('detail/dyga/pyjjfz-edit.html', {
				people: people
			})
		})
		break
		}else{
			if(i==aa.length-1)
			{
				return res.send("你没有此权限")
			
			}else{
				continue
			}
		    }
	}
	})
	}else{
		res.render('login.html')
	}

})
router.post('/views/detail/dyga/pyjjfz/edit', function(req, res){
	var people = req.body
	//var editsql = "update people_information set name=" +"\'" + people.name + "\'"+"where id=" + people.id;
	var editsql = "update heart_educatepovertypeople set id=" +"\'" + people.id + "\'"+ "," + "time=" +"\'" + people.time + "\'" 
	+ "," + "address=" +"\'" + people.address + "\'"
+ "," + "title=" +"\'" + people.title + "\'"
+ "," + "content=" +"\'" + people.content + "\'"
+"where id=" + people.id;
//	console.log(editsql)
	Pfile.editById(editsql, function(err){
		if(err) {
			return res.status(500).send('Server error'+err.message)	
		}
		res.redirect('/views/detail/dyga/pyjjfz')
	})
})
//培养积极分子-删除
router.get('/views/detail/dyga/pyjjfz/delete', function(req, res){
	if(req.session.username)
	{
	var sql1='SELECT commen_userroleinf.loginAcc,commen_userpowerinfo.property,commen_userpowerinfo.people_ctrol FROM commen_userroleinf,commen_userpowerinfo  WHERE commen_userroleinf.property = commen_userpowerinfo.property and  commen_userroleinf.loginAcc='+"\'"+req.session.username+"\'"
	console.log(sql1)
	connection.query(sql1,function (err,result) {
	  if(err){
	    return err;
	  }
	  result=JSON.stringify(result)    //先将result转化为String类型的数据
	  result=JSON.parse(result) 
   var aa=result[0].people_ctrol
	 aa=aa.split(',')
	for(var i=0;i<aa.length;i++)
		{
			if(aa[i]=='21')
				{
					var selectId = req.query.id.split(",")
			var delsql = 'DELETE FROM heart_educatepovertypeople where id ='
			for(var i = 0; i < selectId.length; i++){
				if(i == 0){
					delsql += selectId[i]
				} else {
					delsql += " or id = " + selectId[i]
				}
			}
			console.log(delsql)
		Pfile.deleteSql(delsql, req.query.name, function(err) {
			if(err) {
				return res.status(500).send('Server error'+err.message)	
			}
			res.redirect('/views/detail/dyga/pyjjfz')
		})
		break
		}else{
			if(i==aa.length-1)
			{
				return res.send("你没有此权限")
			
			}else{
				continue
			}
		    }
	}
	})
	}else{
		res.render('login.html')
	}
})
//培养积极分子-------查询
router.post('/views/detail/dyga/pyjjfz-search', function(req,res){
	var inform = req.body
	for(var key in inform){
		if(inform[key] == ''){
			delete inform[key]
		}
	}
	if(JSON.stringify(inform) == '{}'){
		console.log('2333')
		res.redirect('/views/detail/dyga/pyjjfz')
		return
	}
//	console.log(inform)
	var sql = "select * from heart_educatepovertypeople where " 
	var i = 0
	for(var key in inform){
		if (i == 0){
			sql += key + " like" + "\'"+"%"+inform[key]+"%"+"\'"
			i++
		} else {
			sql += "and " + key + " like" + "\'"+"%"+inform[key]+"%"+"\'"
		}
	}
//	console.log(sql)
	Pfile.selectSql(sql, function(err, people) {
		if (err) {
			return res.status(500).send('Server error'+err.message)
		}
		res.render('detail/dyga/pyjjfz.html', {
			people: people
		})
	})
})
/*
 * 组织管理
 */
//领导干部
router.get('/views/detail/zzgl/ldgb', function(req, res){
	var sql = 'SELECT * FROM people_information where isleader ="是"';
	connection.query(sql,function (err,people) {
	  if(err){
	    return callback(err);
	  }
	res.render('detail/zzgl/ldgb.html', {
			people: people
		})
	})
})
//领导干部-------查看
router.get('/views/detail/zzgl/ldgb/detail', function(req, res){
	if(req.session)
	{
	var sql1='SELECT commen_userroleinf.loginAcc,commen_userpowerinfo.property,commen_userpowerinfo.people_ctrol FROM commen_userroleinf,commen_userpowerinfo  WHERE commen_userroleinf.property = commen_userpowerinfo.property and  commen_userroleinf.loginAcc='+"\'"+req.session.username+"\'"
	console.log(sql1)
	connection.query(sql1,function (err,result) {
	  if(err){
	    return err;
	  }
	  result=JSON.stringify(result)    //先将result转化为String类型的数据
	  result=JSON.parse(result) 
   var aa=result[0].people_ctrol
	aa=aa.split(',')
//	console.log(aa[aa.length-1])
	for(var i=0;i<aa.length;i++)
	{
		if(aa[i]=='25')
		{
			var sql = 'SELECT * FROM people_information where id =' + req.query.id;
	Pfile.searchById(sql,parseInt(req.query.id), function (err, people) {
		if (err) {
			return res.status(500).send('Server error'+err.message)
				}
		return res.render('detail/zzgl/detail.html', {
			people: people
			})
		})
	break
		}else{
			if(i==aa.length)
			{
			   return res.send("你没有此操作权限")
			}else{
				continue
			}
		}
	}
	})
	}else{
	res.render("login.html")
		}
})
////领导干部查看
//router.get('/views/detail/zzgl/ldgb/detail', function(req, res){
//	if(req.session.username)
//	{
//	var sql1='SELECT commen_userroleinf.loginAcc,commen_userpowerinfo.property,commen_userpowerinfo.people_ctrol FROM commen_userroleinf,commen_userpowerinfo  WHERE commen_userroleinf.property = commen_userpowerinfo.property and  commen_userroleinf.loginAcc='+"\'"+req.session.username+"\'"
//	console.log(sql1)
//	connection.query(sql1,function (err,result) {
//	  if(err){
//	    return err;
//	  }
//	  result=JSON.stringify(result)    //先将result转化为String类型的数据
//	  result=JSON.parse(result) 
// var aa=result[0].people_ctrol
////	aa.split(',')
//	var cc=aa.split(",")
////	for(var i=0;i<cc.length;i++)
////	{
////		console.log(i+"="+cc[i])
////	}
////	console.log(aa.split(','))
////	console.log(aa[aa.length-1])
//	for(var i=0;i<=cc.length;i++)
//	{
//// 		console.log(aa[i])
////		var bb=aa[i]+aa[i+1]
////		console.log(bb)
//console.log(cc[i])
//		if(cc[i]!='25')
//		{
//			if(i<aa.length)
//			{
//				continue
//			}else{
//				console.log("你没有此权限")
//			}
////			if(i<aa.length)
////			{console.log(bb)
////				return res.send("你没有此权限")
////				
////			}else{
////				continue
////			}
//		}else{
//			var sql = 'SELECT * FROM people_information where id =' + req.query.id;
//	Pfile.searchById(sql,parseInt(req.query.id), function (err, people) {
//		if (err) {
//			return res.status(500).send('Server error'+err.message)
//		}
//		res.render('detail/zzgl/detail.html', {
//			people: people
//		})
//	})
//		}
//	}
//	})
//	}else{
//		res.render('login.html')
//	}
//	
//})
//领导干部--------目录树
router.get('/views/detail/rygl/ldgb-tree', function(req, res){
	var sql = 'SELECT * FROM people_information where isleader = "是" and belongorganazation =' + "\'" + req.query.name + "\'";
	console.log(sql)
	Pfile.searchFile(sql, function(err, people){
		if(err){
			return res.status(500).send('Servor error'+err.message)
		}
		//console.log(people)
		res.render('detail/zzgl/ldgb.html',{
			people:people
		})
	})
})
//领导干部-------修改
router.get('/views/detail/zzgl/ldgb/edit', function(req, res){
	 if(req.session.username)
	{
	var sql1='SELECT commen_userroleinf.loginAcc,commen_userpowerinfo.property,commen_userpowerinfo.people_ctrol FROM commen_userroleinf,commen_userpowerinfo  WHERE commen_userroleinf.property = commen_userpowerinfo.property and  commen_userroleinf.loginAcc='+"\'"+req.session.username+"\'"
//	console.log(sql1)
	connection.query(sql1,function (err,result) {
	  if(err){
	    return err;
	  }
	  result=JSON.stringify(result)    //先将result转化为String类型的数据
	  result=JSON.parse(result) 
   var aa=result[0].people_ctrol
	aa=aa.split(',')
	console.log(aa.length)
	for(var i=0;i<aa.length;i++)
	{
		if(aa[i]=='23')
		{
			var sql = 'SELECT * FROM people_information where id =' + req.query.id;
	Pfile.searchById(sql,parseInt(req.query.id), function (err, people) {
		if (err) {
			return res.status(500).send('Server error'+err.message)
		}
			return res.render('detail/zzgl/edit.html', {
				people: people
			})
		})
		break
		}else{
			if(i==aa.length-1)
			{
				console.log(i)
			return res.send("你没有此权限")
//			console.log("你没有此操作权限")
				
				
			}else{
				continue
			}
		}
	}
	})
	}else{
	res.render("login.html")
		}
})
router.post('/views/detail/zzgl/ldgb/edit', function(req, res){
	var people = req.body
	
	console.log(req.body)
	//var editsql = "update people_information set name=" +"\'" + people.name + "\'"+"where id=" + people.id;
	var editsql = "update people_information set belongpart=" +"\'" + people.belongpart + "\'"+ "," + "positionIt=" +"\'" + people.positionIt + "\'" 
	+ "," + "startTime=" +"\'" + people.startTime + "\'"
+ "," + "endTime=" +"\'" + people.endTime + "\'"
+ "," + "workDuty=" +"\'" + people.workDuty + "\'"
+ "," + "profession=" +"\'" + people.profession + "\'"
+ "," + "des=" +"\'" + people.des + "\'"
+"where id=" + people.id;
//console.log(people.id)
	Pfile.editById(editsql, function(err){
		if(err) {
			return res.status(500).send('Server error'+err.message)	
		}
		res.redirect('/views/detail/zzgl/ldgb')
	})
})
//领导干部-删除
router.get('/views/detail/zzgl/ldgb/delete', function(req, res){
	if(req.session.username)
	{
	var sql1='SELECT commen_userroleinf.loginAcc,commen_userpowerinfo.property,commen_userpowerinfo.people_ctrol FROM commen_userroleinf,commen_userpowerinfo  WHERE commen_userroleinf.property = commen_userpowerinfo.property and  commen_userroleinf.loginAcc='+"\'"+req.session.username+"\'"
	console.log(sql1)
	connection.query(sql1,function (err,result) {
	  if(err){
	    return err;
	  }
	  result=JSON.stringify(result)    //先将result转化为String类型的数据
	  result=JSON.parse(result) 
   var aa=result[0].people_ctrol
	 aa=aa.split(',')
	for(var i=0;i<cc.length;i++)
	{
		if(aa[i]=='24')
			{
				var selectId = req.query.id.split(",")
		var delsql = 'update people_information set isleader = "否" where id ='
		for(var i = 0; i < selectId.length; i++){
			if(i == 0){
				delsql += selectId[i]
			} else {
				delsql += " or id = " + selectId[i]
			}
		}
		console.log(delsql)
	Pfile.editById(delsql, function(err){
		if(err) {
			return res.status(500).send('Server error'+err.message)	
		}
		res.redirect('/views/detail/zzgl/ldgb')
	})
	break
			}else{
			if(i==aa.length-1)
			{
				return res.send("你没有此权限")
			
			}else{
				continue
			}
		   }
	}
	})
	}else{
		res.render('login.html')
	}
	
})

//领导干部-------查询
router.post('/views/detail/zzgl/ldgb', function(req,res){
	var inform = req.body
	for(var key in inform){
		if(inform[key] == ''){
			delete inform[key]
		}
	}
	if(JSON.stringify(inform) == '{}'){
		console.log('2333')
		res.redirect('/views/detail/zzgl/ldgb')
		return
	}
//	console.log(inform)
	var sql = "select * from people_information where " 
	var i = 0
	for(var key in inform){
		if (i == 0){
			sql += key + " like" + "\'"+"%"+inform[key]+"%"+"\'"
			i++
		} else {
			sql += "and " + key + " like" + "\'"+"%"+inform[key]+"%"+"\'"
		}
	}
	sql += ' and isleader = "是"'
	//console.log(sql)
	Pfile.selectSql(sql, function(err, people) {
		if (err) {
			return res.status(500).send('Server error'+err.message)
		}
		res.render('detail/zzgl/ldgb.html', {
			people: people
		})
	})
})
/*
 * 流动党员
 */
//流入管理
router.get('/views/detail/lddy/lrgl', function(req, res){
	var sql = 'SELECT * FROM floatincommity where floatType ="流入"';
	connection.query(sql,function (err,people) {
	  if(err){
	    return callback(err);
	  }
	res.render('detail/lddy/lrgl.html', {
			people: people
		})
	})
})
//流入管理-------查看
router.get('/views/detail/lddy/lrgl-detail', function(req, res){
	if(req.session.username)
	{
	var sql1='SELECT commen_userroleinf.loginAcc,commen_userpowerinfo.property,commen_userpowerinfo.people_ctrol FROM commen_userroleinf,commen_userpowerinfo  WHERE commen_userroleinf.property = commen_userpowerinfo.property and  commen_userroleinf.loginAcc='+"\'"+req.session.username+"\'"
//	console.log(sql1)
	connection.query(sql1,function (err,result) {
	  if(err){
	    return err;
	  }
	  result=JSON.stringify(result)    //先将result转化为String类型的数据
	  result=JSON.parse(result) 
   var aa=result[0].people_ctrol
	aa=aa.split(',')
	console.log(aa)
	for(var i=0;i<aa.length;i++)
		if(aa=='31')
		{
			
			var sql = 'SELECT * FROM floatincommity where id =' + req.query.id;
	Pfile.searchById(sql,parseInt(req.query.id), function (err, people) {
		if (err) {
			return res.status(500).send('Server error'+err.message)
		}
		res.render('detail/lddy/lrgl-detail.html', {
			people: people
		})
	})	
	break
		}else{
			if(i==aa.length-1)
			{
				res.send("你没有此权限")
			}else{
				continue
			}
		}
	})
	}else{
		res.render('login.html')
	}
})
//流入管理--------目录树
router.get('/views/detail/lddy/lrgl-tree', function(req, res){
	var sql = 'SELECT * FROM floatincommity where floatinpart =' + "\'" + req.query.name + "\'";
	console.log(sql)
	console.log(sql)
	Pfile.searchFile(sql, function(err, people){
		if(err){
			return res.status(500).send('Servor error'+err.message)
		}
		//console.log(people)
		res.render('detail/lddy/lrgl.html',{
			people:people
		})
	})
})
//流入管理-------修改
router.get('/views/detail/lddy/lrgl-edit', function(req, res){
	if(req.session.username)
	{
	var sql1='SELECT commen_userroleinf.loginAcc,commen_userpowerinfo.property,commen_userpowerinfo.people_ctrol FROM commen_userroleinf,commen_userpowerinfo  WHERE commen_userroleinf.property = commen_userpowerinfo.property and  commen_userroleinf.loginAcc='+"\'"+req.session.username+"\'"
	console.log(sql1)
	connection.query(sql1,function (err,result) {
	  if(err){
	    return err;
	  }
	  result=JSON.stringify(result)    //先将result转化为String类型的数据
	  result=JSON.parse(result) 
   var aa=result[0].people_ctrol
	 aa=aa.split(',')
	for(var i=0;i<aa.length;i++)
	{
		if(aa[i]=='29')
			{
				var sql = 'SELECT * FROM floatincommity where id =' + req.query.id;
	var peopleSql = 'SELECT * FROM people_information';
	connection.query(peopleSql,function (err,peopleInform) {
	    if(err){
	       return callback(err);
	    }
		Pfile.searchById(sql,parseInt(req.query.id), function (err, people) {
			if (err) {
				return res.status(500).send('Server error'+err.message)
			}
			res.render('detail/lddy/lrgl-edit.html', {
				people: people,
				peopleInform: peopleInform
				})
			})	
		})
		break
		}else{
			if(i==aa.length-1)
			{
				return res.send("你没有此权限")
			
			}else{
				continue
			}
		}
	 }
	})
	}else{
		res.render('login.html')
	}
})
router.post('/views/detail/lddy/lrgl-edit', function(req, res){
	var people = req.body
//	console.log(req.body)
	console.log(people.rangeIt)
	//var editsql = "update people_information set name=" +"\'" + people.name + "\'"+"where id=" + people.id;
	var editsql = "update floatincommity set floatId=" +"\'" + people.floatId + "\'"
	+ "," + "connectpeople=" +"\'" + people.connectpeople + "\'"
	+ "," + "rangeIt=" +"\'" + people.rangeIt + "\'"
	+ "," + "floatoutname=" +"\'" + people.floatoutname + "\'"
	+ "," + "floatinpart=" +"\'" + people.floatinpart + "\'"
	+ "," + "isfloat=" +"\'" + people.isfloat + "\'"
	+ "," + "floatinTime=" +"\'" + people.floatinTime + "\'"
	+ "," + "floatoutTime=" +"\'" + people.floatouTtime + "\'"
	+ "," + "locationX=" +"\'" + people.locationX + "\'"
	+ "," + "locationX=" +"\'" + people.locationY + "\'"
+ "," + "floatreason=" +"\'" + people.floatreason + "\'"
+ "," + "status=" +"\'" + people.status + "\'"
+"where id=" + people.id;
//console.log(people.id)
console.log(editsql)
	Pfile.editById(editsql, function(err){
		if(err) {
			return res.status(500).send('Server error'+err.message)	
		}
		res.redirect('/views/detail/lddy/lrgl')
	})
})
//流入管理-删除
router.get('/views/detail/lddy/lrgl/delete', function(req, res){
	if(req.session.username)
	{
	var sql1='SELECT commen_userroleinf.loginAcc,commen_userpowerinfo.property,commen_userpowerinfo.people_ctrol FROM commen_userroleinf,commen_userpowerinfo  WHERE commen_userroleinf.property = commen_userpowerinfo.property and  commen_userroleinf.loginAcc='+"\'"+req.session.username+"\'"
	console.log(sql1)
	connection.query(sql1,function (err,result) {
	  if(err){
	    return err;
	  }
	  result=JSON.stringify(result)    //先将result转化为String类型的数据
	  result=JSON.parse(result) 
   var aa=result[0].people_ctrol
	 aa=aa.split(',')
	for(var i=0;i<aa.length;i++)
	{
		if(aa[i]=='30')
			{
				var selectId = req.query.id.split(",")
		var delsql = 'DELETE FROM floatincommity where id ='
		for(var i = 0; i < selectId.length; i++){
			if(i == 0){
				delsql += selectId[i]
			} else {
				delsql += " or id = " + selectId[i]
			}
		}
		console.log(delsql)
	Pfile.deleteSql(delsql, req.query.name, function(err) {
		if(err) {
			return res.status(500).send('Server error'+err.message)	
		}
		res.redirect('/views/detail/lddy/lrgl')
	})
	break
			}else{
			if(i==aa.length-1)
			{
				return res.send("你没有此权限")
			
			}else{
				continue
			}
	}
	}		
	})
	}else{
		res.render('login.html')
	}
	
})
//流入管理-------查询
router.post('/views/detail/lddy/lrgl-search', function(req,res){
	var inform = req.body
	for(var key in inform){
		if(inform[key] == ''){
			delete inform[key]
		}
	}
	if(JSON.stringify(inform) == '{}'){
		res.redirect('/views/detail/lddy/lrgl')
		return
	}
//	console.log(inform)
	var sql = "select * from floatincommity where " 
	var i = 0
	for(var key in inform){
		if (i == 0){
			sql += key + " like" + "\'"+"%"+inform[key]+"%"+"\'"
			i++
		} else {
			sql += "and " + key + " like" + "\'"+"%"+inform[key]+"%"+"\'"
		}
	}
	sql += ' and floatType ="流入"'
//	console.log(sql)
	Pfile.selectSql(sql, function(err, people) {
		if (err) {
			return res.status(500).send('Server error'+err.message)
		}
		res.render('detail/lddy/lrgl.html', {
			people: people
		})
	})
})
//流出管理
router.get('/views/detail/lddy/lcgl', function(req, res){
	var sql = 'SELECT * FROM floatincommity where floatType ="流出"';
	connection.query(sql,function (err,people) {
	  if(err){
	    return callback(err);
	  }
	res.render('detail/lddy/lcgl.html', {
			people: people
		})
	})
})
//流出管理-------查看
router.get('/views/detail/lddy/lcgl-detail', function(req, res){
	if(req.session.username)
	{
	var sql1='SELECT commen_userroleinf.loginAcc,commen_userpowerinfo.property,commen_userpowerinfo.people_ctrol FROM commen_userroleinf,commen_userpowerinfo  WHERE commen_userroleinf.property = commen_userpowerinfo.property and  commen_userroleinf.loginAcc='+"\'"+req.session.username+"\'"
	console.log(sql1)
	connection.query(sql1,function (err,result) {
	  if(err){
	    return err;
	  }
	  result=JSON.stringify(result)    //先将result转化为String类型的数据
	  result=JSON.parse(result) 
   var aa=result[0].people_ctrol
	 aa=aa.split(',')
	for(var i=0;i<aa.length;i++)
	{
		
		if(aa[i]=='28')
			{
				var sql = 'SELECT * FROM floatincommity where id =' + req.query.id;
	Pfile.searchById(sql,parseInt(req.query.id), function (err, people) {
		if (err) {
			return res.status(500).send('Server error'+err.message)
		}
		res.render('detail/lddy/lcgl-detail.html', {
			people: people
		})
	})
	break
			}else{
			if(i==aa.length-1)
			{
				return res.send("你没有此权限")
			
			}else{
				continue
			}
		   }	
	}
	})
	}else{
		res.render('login.html')
	}
	
})
//流出管理--------目录树
router.get('/views/detail/lddy/lcgl-tree', function(req, res){
	var sql = 'SELECT * FROM floatincommity where floatoutpart =' + "\'" + req.query.name + "\'";
	console.log(sql)
	console.log(sql)
	Pfile.searchFile(sql, function(err, people){
		if(err){
			return res.status(500).send('Servor error'+err.message)
		}
		console.log(people)
		res.render('detail/lddy/lcgl.html',{
			people:people
		})
	})
})
//流出管理-------修改
router.get('/views/detail/lddy/lcgl-edit', function(req, res){
	if(req.session.username)
	{
	var sql1='SELECT commen_userroleinf.loginAcc,commen_userpowerinfo.property,commen_userpowerinfo.people_ctrol FROM commen_userroleinf,commen_userpowerinfo  WHERE commen_userroleinf.property = commen_userpowerinfo.property and  commen_userroleinf.loginAcc='+"\'"+req.session.username+"\'"
	console.log(sql1)
	connection.query(sql1,function (err,result) {
	  if(err){
	    return err;
	  }
	  result=JSON.stringify(result)    //先将result转化为String类型的数据
	  result=JSON.parse(result) 
   var aa=result[0].people_ctrol
	 aa=aa.split(',')
	for(var i=0;i<aa.length;i++)
	{
		
		if(aa[i]=='26')
			{
				var sql = 'SELECT * FROM floatincommity where id =' + req.query.id;
	var peopleSql = 'SELECT * FROM people_information';
	connection.query(peopleSql,function (err,peopleInform) {
	    if(err){
	       return callback(err);
	    }
		Pfile.searchById(sql,parseInt(req.query.id), function (err, people) {
			if (err) {
				return res.status(500).send('Server error'+err.message)
			}
			res.render('detail/lddy/lcgl-edit.html', {
				people: people,
				peopleInform: peopleInform
			})
		})	
	})
	break
			}else{
			if(i==aa.length-1)
			{
				return res.send("你没有此权限")
			
			}else{
				continue
			}
		    }
	}
	})
	}else{
		res.render('login.html')
	}
	
})
router.post('/views/detail/lddy/lcgl-edit', function(req, res){
	var people = req.body
	var editsql = "update floatincommity set floatId=" +"\'" + people.floatId + "\'"
	+ "," + "connectpeople=" +"\'" + people.connectpeople + "\'"
	+ "," + "rangeIt=" +"\'" + people.rangeIt + "\'"
	+ "," + "floatinname=" +"\'" + people.floatinname+ "\'"
	+ "," + "floatoutpart=" +"\'" + people.floatoutpart+ "\'"
	+ "," + "isfloat=" +"\'" + people.isfloat + "\'"
	+ "," + "floatinTime=" +"\'" + people.floatinTime + "\'"
	+ "," + "floatoutTime=" +"\'" + people.floatoutTime + "\'"
	+ "," + "locationX=" +"\'" + people.locationX + "\'"
	+ "," + "locationX=" +"\'" + people.locationY + "\'"
+ "," + "floatreason=" +"\'" + people.floatreason + "\'"
+ "," + "status=" +"\'" + people.status + "\'"
+"where id=" + people.id;
	Pfile.editById(editsql, function(err){
		if(err) {
			return res.status(500).send('Server error'+err.message)	
		}
		res.redirect('/views/detail/lddy/lcgl')
	})
})
//流出管理-删除
router.get('/views/detail/lddy/lcgl/delete', function(req, res){
	if(req.session.username)
	{
	var sql1='SELECT commen_userroleinf.loginAcc,commen_userpowerinfo.property,commen_userpowerinfo.people_ctrol FROM commen_userroleinf,commen_userpowerinfo  WHERE commen_userroleinf.property = commen_userpowerinfo.property and  commen_userroleinf.loginAcc='+"\'"+req.session.username+"\'"
//	console.log(sql1)
	connection.query(sql1,function (err,result) {
	  if(err){
	    return err;
	  }
	  result=JSON.stringify(result)    //先将result转化为String类型的数据
	  result=JSON.parse(result) 
   var aa=result[0].people_ctrol
	 aa=aa.split(',')
	for(var i=0;i<aa.length;i++)
	{
		if(aa[i]=='27')
			{
				var selectId = req.query.id.split(",")
		var delsql = 'DELETE FROM floatincommity where id ='
		for(var i = 0; i < selectId.length; i++){
			if(i == 0){
				delsql += selectId[i]
			} else {
				delsql += " or id = " + selectId[i]
			}
		}
//		console.log(delsql)
	Pfile.deleteSql(delsql, req.query.name, function(err) {
		if(err) {
			return res.status(500).send('Server error'+err.message)	
		}
		res.redirect('/views/detail/lddy/lcgl')
	})
	break
			}else{
			if(i==aa.length-1)
			{
				return res.send("你没有此权限")
			
			}else{
				continue
			}
		    }
	}
	})
	}else{
		res.render('login.html')
	}
	
})
//流出管理-------查询
router.post('/views/detail/lddy/lcgl-search', function(req,res){
	var inform = req.body
	for(var key in inform){
		if(inform[key] == ''){
			delete inform[key]
		}
	}
	if(JSON.stringify(inform) == '{}'){
		res.redirect('/views/detail/lddy/lcgl')
		return
	}
//	console.log(inform)
	var sql = "select * from floatincommity where " 
	var i = 0
	for(var key in inform){
		if (i == 0){
			sql += key + " like" + "\'"+"%"+inform[key]+"%"+"\'"
			i++
		} else {
			sql += "and " + key + " like" + "\'"+"%"+inform[key]+"%"+"\'"
		}
	}
	sql += ' and floatType ="流出"'
//	console.log(sql)
	Pfile.selectSql(sql, function(err, people) {
		if (err) {
			return res.status(500).send('Server error'+err.message)
		}
		res.render('detail/lddy/lcgl.html', {
			people: people
		})
	})
})
/*
 * 组值关系转移
 */
//转出管理
router.get('/views/detail/zzgxzy/zcgl', function(req, res){
	var sql = 'SELECT * FROM organazition_float where Type ="转出"';
	connection.query(sql,function (err,people) {
	  if(err){
	    return callback(err);
	  }
	res.render('detail/zzgxzy/zcgl.html', {
			people: people
		})
	})
})
//转出管理-------查看
router.get('/views/detail/zzgxzy/zcgl-detail', function(req, res){
	if(req.session.username)
	{
	var sql1='SELECT commen_userroleinf.loginAcc,commen_userpowerinfo.property,commen_userpowerinfo.people_ctrol FROM commen_userroleinf,commen_userpowerinfo  WHERE commen_userroleinf.property = commen_userpowerinfo.property and  commen_userroleinf.loginAcc='+"\'"+req.session.username+"\'"
	console.log(sql1)
	connection.query(sql1,function (err,result) {
	  if(err){
	    return err;
	  }
	  result=JSON.stringify(result)    //先将result转化为String类型的数据
	  result=JSON.parse(result) 
   var aa=result[0].people_ctrol
	 aa=aa.split(',')
	for(var i=0;i<aa.length;i++)
	{
		if(aa[i]=='34')
			{
				var sql = 'SELECT * FROM organazition_float where id =' + req.query.id;
	Pfile.searchById(sql,parseInt(req.query.id), function (err, people) {
		if (err) {
			return res.status(500).send('Server error'+err.message)
		}
				res.render('detail/zzgxzy/zcgl-detail.html', {
					people: people
				})
			})
		break
			}else{
			if(i==aa.length-1)
			{
				return res.send("你没有此权限")
			
			}else{
				continue
			}
		}
		}	
	 })
	}else{
		res.render('login.html')
	}
	
})
//转出管理--------目录树
router.get('/views/detail/zzgxzy/zcgl-tree', function(req, res){
	var sql = 'SELECT * FROM organazition_float where rollname =' + "\'" + req.query.name + "\'";
	//console.log(sql)
	//console.log(sql)
	Pfile.searchFile(sql, function(err, people){
		if(err){
			return res.status(500).send('Servor error'+err.message)
		}
		//console.log(people)
		res.render('detail/zzgxzy/zcgl.html',{
			people:people
		})
	})
})
//转出管理-------修改
router.get('/views/detail/zzgxzy/zcgl-edit', function(req, res){
	if(req.session.username)
	{
	var sql1='SELECT commen_userroleinf.loginAcc,commen_userpowerinfo.property,commen_userpowerinfo.people_ctrol FROM commen_userroleinf,commen_userpowerinfo  WHERE commen_userroleinf.property = commen_userpowerinfo.property and  commen_userroleinf.loginAcc='+"\'"+req.session.username+"\'"
	console.log(sql1)
	connection.query(sql1,function (err,result) {
	  if(err){
	    return err;
	  }
	  result=JSON.stringify(result)    //先将result转化为String类型的数据
	  result=JSON.parse(result) 
   var aa=result[0].people_ctrol
	 aa=aa.split(',')
	for(var i=0;i<aa.length;i++)
	{
		if(aa[i]=='32')
			{
				var sql = 'SELECT * FROM organazition_float where id =' + req.query.id;
	Pfile.searchById(sql,parseInt(req.query.id), function (err, people) {
		if (err) {
			return res.status(500).send('Server error'+err.message)
		}
				res.render('detail/zzgxzy/zcgl-edit.html', {
					people: people
				})
			})
			break
			}else{
			if(i==aa.length-1)
			{
				return res.send("你没有此权限")
			
			}else{
				continue
			}
		    }
	}
	
	})
	}else{
		res.render('login.html')
	}
	
})
router.post('/views/detail/zzgxzy/zcgl-edit', function(req, res){
	var people = req.body
//	console.log(req.body)
	//var editsql = "update people_information set name=" +"\'" + people.name + "\'"+"where id=" + people.id;
	var editsql = "update   organazition_float set rollname =" +"\'" + people.rollname + "\'"
	+ "," + "rangeIt=" +"\'" + people.rangeIt + "\'"
	+ "," + "rollname=" +"\'" + people.rollname + "\'"
	+ "," + "status=" +"\'" + people.status + "\'"
	+ "," + "rollTime=" +"\'" + people.rollTime + "\'"
	+ "," + "rollreason=" +"\'" + people.rollreason + "\'"
+ "," + "remark=" +"\'" + people.remark + "\'"
+"where id=" + people.id;
//console.log(people.id)
//console.log(editsql)
	Pfile.editById(editsql, function(err){
		if(err) {
			return res.status(500).send('Server error'+err.message)	
		}
		res.redirect('/views/detail/zzgxzy/zcgl')
	})
})
//转出管理-删除
router.get('/views/detail/zzgxzy/zcgl/delete', function(req, res){
	if(req.session.username)
	{
	var sql1='SELECT commen_userroleinf.loginAcc,commen_userpowerinfo.property,commen_userpowerinfo.people_ctrol FROM commen_userroleinf,commen_userpowerinfo  WHERE commen_userroleinf.property = commen_userpowerinfo.property and  commen_userroleinf.loginAcc='+"\'"+req.session.username+"\'"
	console.log(sql1)
	connection.query(sql1,function (err,result) {
	  if(err){
	    return err;
	  }
	  result=JSON.stringify(result)    //先将result转化为String类型的数据
	  result=JSON.parse(result) 
   var aa=result[0].people_ctrol
	 aa=aa.split(',')
	for(var i=0;i<aa.length;i++)
	{
		if(aa[i]=='33')
			{
				var selectId = req.query.id.split(",")
		var delsql = 'DELETE FROM organazition_float where id ='
		for(var i = 0; i < selectId.length; i++){
			if(i == 0){
				delsql += selectId[i]
			} else {
				delsql += " or id = " + selectId[i]
			}
		}
//		console.log(delsql)
	Pfile.deleteSql(delsql, req.query.name, function(err) {
		if(err) {
			return res.status(500).send('Server error'+err.message)	
		}
		res.redirect('/views/detail/zzgxzy/zcgl/')
	})
	break
			}else{
			if(i==aa.length-1)
			{
				return res.send("你没有此权限")
			
			}else{
				continue
			}
		    }
	}
	})
	}else{
		res.render('login.html')
	}
	
})

//转出管理-查询
router.post('/views/detail/zzgxzy/zcgl-search', function(req,res){
	var inform = req.body
	for(var key in inform){
		if(inform[key] == ''){
			delete inform[key]
		}
	}
//	console.log(inform)
	var sql = "select * from organazition_float where " +"type="+"\'"+"转出"+"\'"
	var i = 0
	for(var key in inform){
		sql +="and " +key + " like" + "\'"+"%"+inform[key]+"%"+"\'"
		
	}
	//sql+"and"+"type="+"转入"
	console.log(sql)
	Pfile.selectSql(sql, function(err, people) {
		if (err) {
			return res.status(500).send('Server error'+err.message)
		}
		res.render('detail/zzgxzy/zcgl.html', {
			people: people
		})
	})
})
//转入管理
router.get('/views/detail/zzgxzy/zrgl', function(req, res){
	var sql = 'SELECT * FROM organazition_float where Type ="转入"';
	connection.query(sql,function (err,people) {
	  if(err){
	    return callback(err);
	  }
	res.render('detail/zzgxzy/zrgl.html', {
			people: people
		})
	})
})
//转入管理-------查看
router.get('/views/detail/zzgxzy/zrgl-detail', function(req, res){
	if(req.session.username)
	{
	var sql1='SELECT commen_userroleinf.loginAcc,commen_userpowerinfo.property,commen_userpowerinfo.people_ctrol FROM commen_userroleinf,commen_userpowerinfo  WHERE commen_userroleinf.property = commen_userpowerinfo.property and  commen_userroleinf.loginAcc='+"\'"+req.session.username+"\'"
	console.log(sql1)
	connection.query(sql1,function (err,result) {
	  if(err){
	    return err;
	  }
	  result=JSON.stringify(result)    //先将result转化为String类型的数据
	  result=JSON.parse(result) 
   var aa=result[0].people_ctrol
	 aa=aa.split(',')
	for(var i=0;i<aa.length;i++)
	{
		if(aa[i]=='37')
			{
				var sql = 'SELECT * FROM organazition_float where type ="转入"';
	Pfile.searchById(sql,parseInt(req.query.id), function (err, people) {
		if (err) {
			return res.status(500).send('Server error'+err.message)
		}
				res.render('detail/zzgxzy/zrgl-detail.html', {
					people: people
				})
			})
		break
			}else{
			if(i==aa.length-1)
			{
				return res.send("你没有此权限")
			
			}else{
				continue
			}
		    }
	}
	})
	}else{
		res.render('login.html')
	}

	
})
//转入管理--------目录树
router.get('/views/detail/zzgxzy/zrgl-tree', function(req, res){
	var sql = 'SELECT * FROM organazition_float where rollname =' + "\'" + req.query.name + "\'";
	console.log(sql)
	console.log(sql)
	Pfile.searchFile(sql, function(err, people){
		if(err){
			return res.status(500).send('Servor error'+err.message)
		}
		//console.log(people)
		res.render('detail/zzgxzy/zrgl.html',{
			people:people
		})
	})
})
//转入管理-------修改
router.get('/views/detail/zzgxzy/zrgl-edit', function(req, res){
	
if(req.session.username)
	{
	var sql1='SELECT commen_userroleinf.loginAcc,commen_userpowerinfo.property,commen_userpowerinfo.people_ctrol FROM commen_userroleinf,commen_userpowerinfo  WHERE commen_userroleinf.property = commen_userpowerinfo.property and  commen_userroleinf.loginAcc='+"\'"+req.session.username+"\'"
	console.log(sql1)
	connection.query(sql1,function (err,result) {
	  if(err){
	    return err;
	  }
	  result=JSON.stringify(result)    //先将result转化为String类型的数据
	  result=JSON.parse(result) 
   var aa=result[0].people_ctrol
	 aa=aa.split(',')
	for(var i=0;i<aa.length;i++)
	{
		if(aa[i]=='35')
			{
				var sql = 'SELECT * FROM organazition_float where id =' + req.query.id;
	Pfile.searchById(sql,parseInt(req.query.id), function (err, people) {
		if (err) {
			return res.status(500).send('Server error'+err.message)
		}
		res.render('detail/zzgxzy/zrgl-edit.html', {
			people: people
		})
	})
	break
			}else{
			if(i==aa.length-1)
			{
				return res.send("你没有此权限")
			
			}else{
				continue
			}
		    }
	}
	
	})
	}else{
		res.render('login.html')
	}
	
})
router.post('/views/detail/zzgxzy/zrgl-edit', function(req, res){
	var people = req.body
//	console.log(req.body)
	//var editsql = "update people_information set name=" +"\'" + people.name + "\'"+"where id=" + people.id;
	var editsql = "update   organazition_float set rollname =" +"\'" + people.rollname + "\'"
	+ "," + "rangeIt=" +"\'" + people.rangeIt + "\'"
	+ "," + "rollname=" +"\'" + people.rollname + "\'"
	+ "," + "status=" +"\'" + people.status + "\'"
	+ "," + "rollTime=" +"\'" + people.rollTime + "\'"
	+ "," + "rollreason=" +"\'" + people.rollreason + "\'"
+ "," + "remark=" +"\'" + people.remark + "\'"
+"where id=" + people.id;
	Pfile.editById(editsql, function(err){
		if(err) {
			return res.status(500).send('Server error'+err.message)	
		}
		res.redirect('/views/detail/zzgxzy/zrgl')
	})
})
//转入管理-删除
router.get('/views/detail/lddy/lrgl/delete', function(req, res){
	if(req.session.username)
	{
	var sql1='SELECT commen_userroleinf.loginAcc,commen_userpowerinfo.property,commen_userpowerinfo.people_ctrol FROM commen_userroleinf,commen_userpowerinfo  WHERE commen_userroleinf.property = commen_userpowerinfo.property and  commen_userroleinf.loginAcc='+"\'"+req.session.username+"\'"
	console.log(sql1)
	connection.query(sql1,function (err,result) {
	  if(err){
	    return err;
	  }
	  result=JSON.stringify(result)    //先将result转化为String类型的数据
	  result=JSON.parse(result) 
   var aa=result[0].people_ctrol
	 aa=aa.split(',')
	for(var i=0;i<aa.length;i++)
	{
		if(aa[i]=='36')
			{
				var selectId = req.query.id.split(",")
		var delsql = 'DELETE FROM organazition_float where id ='
		for(var i = 0; i < selectId.length; i++){
			if(i == 0){
				delsql += selectId[i]
			} else {
				delsql += " or id = " + selectId[i]
			}
		}
				console.log(delsql)
			Pfile.deleteSql(delsql, req.query.name, function(err) {
				if(err) {
					return res.status(500).send('Server error'+err.message)	
				}
				res.redirect('/views/detail/lddy/lrgl')
			})
			break
		}else{
			if(i==aa.length-1)
			{
				return res.send("你没有此权限")
			
			}else{
				continue
			}
		    }

	}
	})
	}else{
		res.render('login.html')
	}
	
})
//转入管理-查询
router.post('/views/detail/zzgxzy/zrgl-search', function(req,res){
	var inform = req.body
	for(var key in inform){
		if(inform[key] == ''){
			delete inform[key]
		}
	}
//	console.log(inform)
	var sql = "select * from organazition_float where " +"type="+"\'"+"转入"+"\'"
	var i = 0
	for(var key in inform){
			sql +="and " +key + " like" + "\'"+"%"+inform[key]+"%"+"\'"
	}
	//console.log(sql)
	Pfile.selectSql(sql, function(err, people) {
		if (err) {
			return res.status(500).send('Server error'+err.message)
		}
		res.render('detail/zzgxzy/zrgl.html', {
			people: people
		})
	})
})
/*
 * 三会一课
 */
//党员大会
router.get('/views/detail/shyk/dydh', function(req, res){
	var sql = 'SELECT * FROM threeandone_activityinformation where Type ="党员大会"';
	connection.query(sql,function (err,inform) {
	  if(err){
	    return err;
	  }
	res.render('detail/shyk/dydh.html', {
			inform: inform
		})
	})
})
//支委会
router.get('/views/detail/shyk/zwh', function(req, res){
	var sql = 'SELECT * FROM  threeandone_suportcommity where Type ="支委会"';
	connection.query(sql,function (err,inform) {
	  if(err){
	    return callback(err);
	  }
	res.render('detail/shyk/zwh.html', {
			inform: inform
		})
	})
})
//党小组会
router.get('/views/detail/shyk/dxzh', function(req, res){
	var sql = 'SELECT * FROM threeandone_smallgroupmeeting where Type ="党小组会"';
	connection.query(sql,function (err,inform) {
	  if(err){
	    return callback(err);
	  }
	res.render('detail/shyk/dxzh.html', {
			inform: inform
		})
	})
})
//讲党课
router.get('/views/detail/shyk/jdk', function(req, res){
	var sql = 'SELECT * FROM threeandone_activityspeech where Type ="讲党课"';
	connection.query(sql,function (err,inform) {
	  if(err){
	    return callback(err);
	  }
	res.render('detail/shyk/jdk.html', {
			inform: inform
		})
	})
})
//三会一课党员大会-------修改
router.get('/views/detail/shyk/dydh-edit', function(req, res){
	if(req.session.username)
	{
	var sql1='SELECT commen_userroleinf.loginAcc,commen_userpowerinfo.property,commen_userpowerinfo.people_ctrol FROM commen_userroleinf,commen_userpowerinfo  WHERE commen_userroleinf.property = commen_userpowerinfo.property and  commen_userroleinf.loginAcc='+"\'"+req.session.username+"\'"
	console.log(sql1)
	connection.query(sql1,function (err,result) {
	  if(err){
	    return err;
	  }
	  result=JSON.stringify(result)    //先将result转化为String类型的数据
	  result=JSON.parse(result) 
   var aa=result[0].people_ctrol
	 aa=aa.split(',')
	for(var i=0;i<aa.length;i++)
	{
		if(aa[i]=='39')
			{
				var sql = 'SELECT * FROM threeandone_activityinformation where id =' + req.query.id;
	Pfile.searchById(sql,parseInt(req.query.id), function (err, inform) {
		if (err) {
			return res.status(500).send('Server error'+err.message)
		}
				res.render('detail/shyk/dydh-edit.html', {
					inform: inform
				})
			})
		break
			}else{
			if(i==aa.length-1)
			{
				return res.send("你没有此权限")
			
			}else{
				continue
			}
		   }
	}
	})
	}else{
		res.render('login.html')
	}
})
router.post('/views/detail/shyk/dydh-edit', function(req, res){
	var inform = req.body
//	console.log(req.body)
	//var editsql = "update people_information set name=" +"\'" + people.name + "\'"+"where id=" + people.id;
		var editsql = "update   threeandone_activityinformation set title =" +"\'" + inform.title + "\'"+ "," + "holdperson=" +"\'" + inform.holdperson + "\'" 
		+ "," + "holdspeech=" +"\'" + inform.holdspeech + "\'"
	+ "," + "startTime=" +"\'" + inform.startTime + "\'"
	+ "," + "endTime=" +"\'" + inform.endTime + "\'"
	+ "," + "shouldgetPeople=" +"\'" + inform.shouldgetPeople + "\'"
	+ "," + "reactgetPeople=" +"\'" + inform.reactgetPeople + "\'"
	+ "," + "leaveNum=" +"\'" + inform.leaveNum + "\'"
	+ "," + "imageurl=" +"\'" + inform.imaegurl + "\'"
	+ "," + "resource=" +"\'" + inform.resource + "\'"
	+"where id=" + inform.id;
		Pfile.editById(editsql, function(err){
			if(err) {
				return res.status(500).send('Server error'+err.message)	
			}
			res.redirect('/views/detail/shyk/dydh')
		})
})
//三会一课支委会-------修改
router.get('/views/detail/shyk/zwh-edit', function(req, res){
	if(req.session.username)
	{
	var sql1='SELECT commen_userroleinf.loginAcc,commen_userpowerinfo.property,commen_userpowerinfo.people_ctrol FROM commen_userroleinf,commen_userpowerinfo  WHERE commen_userroleinf.property = commen_userpowerinfo.property and  commen_userroleinf.loginAcc='+"\'"+req.session.username+"\'"
	console.log(sql1)
	connection.query(sql1,function (err,result) {
	  if(err){
	    return err;
	  }
	  result=JSON.stringify(result)    //先将result转化为String类型的数据
	  result=JSON.parse(result) 
   var aa=result[0].people_ctrol
	 aa=aa.split(',')
	for(var i=0;i<aa.length;i++)
	{
		if(aa[i]=='42')
			{
				var sql = 'SELECT * FROM threeandone_suportcommity where id =' + req.query.id;
	Pfile.searchById(sql,parseInt(req.query.id), function (err, inform) {
		if (err) {
			return res.status(500).send('Server error'+err.message)
		}
			res.render('detail/shyk/zwh-edit.html', {
				inform: inform
			})
		})
	break
		}else{
			if(i==aa.length-1)
			{
				return res.send("你没有此权限")
			
			}else{
				continue
			}
		    }
	}
	})
	}else{
		res.render('login.html')
	}
})
router.post('/views/detail/shyk/zwh-edit', function(req, res){
	var inform = req.body
//	console.log(req.body)
	//var editsql = "update people_information set name=" +"\'" + people.name + "\'"+"where id=" + people.id;
		var editsql = "update   threeandone_suportcommity set title =" +"\'" + inform.title + "\'"+ "," + "holdperson=" +"\'" + inform.holdperson + "\'" 
		+ "," + "holdspeech=" +"\'" + inform.holdspeech + "\'"
	+ "," + "startTime=" +"\'" + inform.startTime + "\'"
	+ "," + "endTime=" +"\'" + inform.endTime + "\'"
	+ "," + "shouldgetPeople=" +"\'" + inform.shouldgetPeople + "\'"
	+ "," + "reactgetPeople=" +"\'" + inform.reactgetPeople + "\'"
	+ "," + "leaveNum=" +"\'" + inform.leaveNum + "\'"
	+ "," + "imageurl=" +"\'" + inform.imaegurl + "\'"
	+ "," + "resource=" +"\'" + inform.resource + "\'"
	+"where id=" + inform.id;
		Pfile.editById(editsql, function(err){
			if(err) {
				return res.status(500).send('Server error'+err.message)	
			}
			res.redirect('/views/detail/shyk/zwh')
		})
})
//三会一课党小组会-------修改
router.get('/views/detail/shyk/dxzh-edit', function(req, res){
	
if(req.session.username)
	{
	var sql1='SELECT commen_userroleinf.loginAcc,commen_userpowerinfo.property,commen_userpowerinfo.people_ctrol FROM commen_userroleinf,commen_userpowerinfo  WHERE commen_userroleinf.property = commen_userpowerinfo.property and  commen_userroleinf.loginAcc='+"\'"+req.session.username+"\'"
	console.log(sql1)
	connection.query(sql1,function (err,result) {
	  if(err){
	    return err;
	  }
	  result=JSON.stringify(result)    //先将result转化为String类型的数据
	  result=JSON.parse(result) 
   var aa=result[0].people_ctrol
	 aa=aa.split(',')
	for(var i=0;i<aa.length;i++)
	{
		if(aa[i]=='45')
			{
				var sql = 'SELECT * FROM threeandone_smallgroupmeeting where id =' + req.query.id;
	Pfile.searchById(sql,parseInt(req.query.id), function (err, inform) {
		if (err) {
			return res.status(500).send('Server error'+err.message)
		}
			res.render('detail/shyk/dxzh-edit.html', {
				inform: inform
			})
		})
		break
		}else{
			if(i==aa.length-1)
			{
				return res.send("你没有此权限")
			
			}else{
				continue
			}
		    }
	}
	})
	}else{
		res.render('login.html')
	}
})
router.post('/views/detail/shyk/dxzh-edit', function(req, res){
	var inform = req.body
//	console.log(req.body)
	//var editsql = "update people_information set name=" +"\'" + people.name + "\'"+"where id=" + people.id;
		var editsql = "update   threeandone_smallgroupmeeting set title =" +"\'" + inform.title + "\'"+ "," + "holdperson=" +"\'" + inform.holdperson + "\'" 
		+ "," + "holdspeech=" +"\'" + inform.holdspeech + "\'"
	+ "," + "startTime=" +"\'" + inform.startTime + "\'"
	+ "," + "endTime=" +"\'" + inform.endTime + "\'"
	+ "," + "shouldgetPeople=" +"\'" + inform.shouldgetPeople + "\'"
	+ "," + "reactgetPeople=" +"\'" + inform.reactgetPeople + "\'"
	+ "," + "leaveNum=" +"\'" + inform.leaveNum + "\'"
	+ "," + "imageurl=" +"\'" + inform.imaegurl + "\'"
	+ "," + "resource=" +"\'" + inform.resource + "\'"
	+"where id=" + inform.id;
		Pfile.editById(editsql, function(err){
			if(err) {
				return res.status(500).send('Server error'+err.message)	
			}
			res.redirect('/views/detail/shyk/dxzh')
		})
})
//三会一课讲党课-------修改
router.get('/views/detail/shyk/jdk-edit', function(req, res){
	if(req.session.username)
	{
	var sql1='SELECT commen_userroleinf.loginAcc,commen_userpowerinfo.property,commen_userpowerinfo.people_ctrol FROM commen_userroleinf,commen_userpowerinfo  WHERE commen_userroleinf.property = commen_userpowerinfo.property and  commen_userroleinf.loginAcc='+"\'"+req.session.username+"\'"
	console.log(sql1)
	connection.query(sql1,function (err,result) {
	  if(err){
	    return err;
	  }
	  result=JSON.stringify(result)    //先将result转化为String类型的数据
	  result=JSON.parse(result) 
   var aa=result[0].people_ctrol
	 aa=aa.split(',')
	for(var i=0;i<aa.length;i++)
	{
		if(aa[i]=='48')
			{
				var sql = 'SELECT * FROM threeandone_activityspeech where id =' + req.query.id;
	Pfile.searchById(sql,parseInt(req.query.id), function (err, inform) {
		if (err) {
			return res.status(500).send('Server error'+err.message)
		}
			res.render('detail/shyk/jdk-edit.html', {
				inform: inform
			})
		})
		break
		}else{
			if(i==aa.length-1)
			{
				return res.send("你没有此权限")
			
			}else{
				continue
			}
		    }
	}
	})
	}else{
		res.render('login.html')
	}
})
router.post('/views/detail/shyk/jdk-edit', function(req, res){
	var inform = req.body
//	console.log(req.body)
	//var editsql = "update people_information set name=" +"\'" + people.name + "\'"+"where id=" + people.id;
		var editsql = "update   threeandone_activityspeech set title =" +"\'" + inform.title + "\'"+ "," + "holdperson=" +"\'" + inform.holdperson + "\'" 
		+ "," + "holdspeech=" +"\'" + inform.holdspeech + "\'"
	+ "," + "startTime=" +"\'" + inform.startTime + "\'"
	+ "," + "endTime=" +"\'" + inform.endTime + "\'"
	+ "," + "shouldgetPeople=" +"\'" + inform.shouldgetPeople + "\'"
	+ "," + "reactgetPeople=" +"\'" + inform.reactgetPeople + "\'"
	+ "," + "leaveNum=" +"\'" + inform.leaveNum + "\'"
	+ "," + "imageurl=" +"\'" + inform.imaegurl + "\'"
	+ "," + "resource=" +"\'" + inform.resource + "\'"
	+"where id=" + inform.id;
		Pfile.editById(editsql, function(err){
			if(err) {
				return res.status(500).send('Server error'+err.message)	
			}
			res.redirect('/views/detail/shyk/jdk')
		})
})
//三会一课党员大会---------------详情
router.get('/views/detail/shyk/dydh-detail', function(req, res){
	var sql = 'SELECT * FROM threeandone_activityinformation where title =' + "\'"+req.query.title+"\'";
	console.log(sql)
	Pfile.searchById(sql,parseInt(req.query.id), function (err, inform) {
		if (err) {
			return res.status(500).send('Server error'+err.message)
		}
		res.render('detail/shyk/dydh-detail.html', {
			inform: inform
		})
	})
})
//三会一课支委会-----------------详情
router.get('/views/detail/shyk/zwh-detail', function(req, res){
	var sql = 'SELECT * FROM threeandone_suportcommity where id =' + req.query.id;
	console.log(sql)
	Pfile.searchById(sql,parseInt(req.query.id), function (err, inform) {
		if (err) {
			return res.status(500).send('Server error'+err.message)
		}
		res.render('detail/shyk/dydh-detail.html', {
			inform: inform
		})
	})
})
//三会一课党小组会-----------------详情
router.get('/views/detail/shyk/dxzh-detail', function(req, res){
	var sql = 'SELECT * FROM threeandone_smallgroupmeeting where id =' + req.query.id;
	console.log(sql)
	Pfile.searchById(sql,parseInt(req.query.id), function (err, inform) {
		if (err) {
			return res.status(500).send('Server error'+err.message)
		}
		res.render('detail/shyk/dydh-detail.html', {
			inform: inform
		})
	})
})
//三会一课降档了-----------------详情
router.get('/views/detail/shyk/jdk-detail', function(req, res){
	
	var sql = 'SELECT * FROM threeandone_activityspeech where id =' + req.query.id;
	console.log(sql)
	Pfile.searchById(sql,parseInt(req.query.id), function (err, inform) {
		if (err) {
			return res.status(500).send('Server error'+err.message)
		}
		res.render('detail/shyk/dydh-detail.html', {
			inform: inform
		})
	})
})
//三会一课党员大会-------增加
router.get('/views/detail/shyk/dydh-new', function(req, res){
//	console.log(req.query.judge)
if(req.session.username)
	{
	var sql1='SELECT commen_userroleinf.loginAcc,commen_userpowerinfo.property,commen_userpowerinfo.people_ctrol FROM commen_userroleinf,commen_userpowerinfo  WHERE commen_userroleinf.property = commen_userpowerinfo.property and  commen_userroleinf.loginAcc='+"\'"+req.session.username+"\'"
	console.log(sql1)
	connection.query(sql1,function (err,result) {
	  if(err){
	    return err;
	  }
	  result=JSON.stringify(result)    //先将result转化为String类型的数据
	  result=JSON.parse(result) 
   var aa=result[0].people_ctrol
	 aa=aa.split(',')
	for(var i=0;i<aa.length;i++)
	{
		if(aa[i]=='38')
			{
				res.render('detail/shyk/dydh-new.html',{
		judge:req.query.judge
			})
				break
		}
			else{
			if(i==aa.length-1)
			{
				return res.send("你没有此权限")
			
			}else{
				continue
			}
		   }
	}
	})
	}else{
		res.render('login.html')
	}

	
})
router.post('/views/detail/shyk/dydh-new', function(req, res){
//	console.log(req.body)
	var inform=req.body
			var maxid = "select max(id) from threeandone_activityinformation"
			//console.log(maxid)
			connection.query(maxid,function (err,result) {
			  if(err){
			    return err;
			  }
			  result=JSON.stringify(result)    //先将result转化为String类型的数据
		  	  result=JSON.parse(result)
		  	  var ret = result[0]
			  var id = ret['max(id)'] + 1
			  
			  //获取当前时间
		  var date = new Date();
	        var seperator1 = "-";
	        var year = date.getFullYear();
	        var month = date.getMonth() + 1;
	        var strDate = date.getDate();
	        if (month >= 1 && month <= 9) {
	            month = "0" + month;
	        }
	        if (strDate >= 0 && strDate <= 9) {
	            strDate = "0" + strDate;
	        }
	        var currentdate = year + seperator1 + month + seperator1 + strDate;
	
			var sql = "insert into threeandone_activityinformation values("
					 + id  + ","
					  + "\'" + inform.title + "\'" + "," 
					   +"\'" + inform.holdperson + "\'" + ","
					   +"\'" + inform.holdspeech + "\'" + "," 
					   + "\'" + '名称' + "\'" + ","
					    + "\'" + inform.startTime + "\'" +  ","
					     + "\'" + inform.endTime + "\'" + ","
					      + "\'" + currentdate+ "\'"+"," 
					      + "\'" + inform.shouldgetPeople+ "\'"+"," 
					       + "\'" + inform.shouldgetPeople+ "\'"+"," 
					        + "\'" + inform.leaveNum+ "\'"+"," 
					         + "\'" + inform.imageurl+ "\'"+"," 
					         + "\'" + inform.resource+ "\'"+"," 
					         + "\'" + '党员大会'+ "\'" + ")"
//					         console.log(sql)
			Pfile.increaseSql(sql,  function (err, inform) {
				if (err) {
					return res.status(500).send('Server error'+err.message)
				}
				res.redirect("/views/detail/shyk/dydh")
			})
		})
	})
//三会一课支委会-------增加
router.get('/views/detail/shyk/zwh-new', function(req, res){
	if(req.session.username)
	{
	var sql1='SELECT commen_userroleinf.loginAcc,commen_userpowerinfo.property,commen_userpowerinfo.people_ctrol FROM commen_userroleinf,commen_userpowerinfo  WHERE commen_userroleinf.property = commen_userpowerinfo.property and  commen_userroleinf.loginAcc='+"\'"+req.session.username+"\'"
	console.log(sql1)
	connection.query(sql1,function (err,result) {
	  if(err){
	    return err;
	  }
	  result=JSON.stringify(result)    //先将result转化为String类型的数据
	  result=JSON.parse(result) 
   var aa=result[0].people_ctrol
	 aa=aa.split(',')
	for(var i=0;i<aa.length;i++)
	{
		if(aa[i]=='41')
			{
				res.render('detail/shyk/zwh-new.html',{
		judge:req.query.judge
			})
				break
		}else{
			if(i==aa.length-1)
			{
				return res.send("你没有此权限")
			
			}else{
				continue
			}
		    }
	}
	})
	}else{
		res.render('login.html')
	}
//	console.log(req.query.judge)
	
})
router.post('/views/detail/shyk/zwh-new', function(req, res){
//	console.log(req.body)
	var inform=req.body
			var maxid = "select max(id) from  threeandone_suportcommity"
			//console.log(maxid)
			connection.query(maxid,function (err,result) {
			  if(err){
			    return err;
			  }
			  result=JSON.stringify(result)    //先将result转化为String类型的数据
		  	  result=JSON.parse(result)
		  	  var ret = result[0]
			  var id = ret['max(id)'] + 1
			  
			    //获取当前时间
		  var date = new Date();
	        var seperator1 = "-";
	        var year = date.getFullYear();
	        var month = date.getMonth() + 1;
	        var strDate = date.getDate();
	        if (month >= 1 && month <= 9) {
	            month = "0" + month;
	        }
	        if (strDate >= 0 && strDate <= 9) {
	            strDate = "0" + strDate;
	        }
	        var currentdate = year + seperator1 + month + seperator1 + strDate;
	
			var sql = "insert into  threeandone_suportcommity values("
					 + id  + ","
					  + "\'" + inform.title + "\'" + "," 
					   +"\'" + inform.holdperson + "\'" + ","
					   +"\'" + inform.holdspeech + "\'" + "," 
					   + "\'" + '名称' + "\'" + ","
					    + "\'" + inform.startTime + "\'" +  ","
					     + "\'" + inform.endTime + "\'" + ","
					      + "\'" +currentdate+ "\'"+"," 
					      + "\'" + inform.shouldgetPeople+ "\'"+"," 
					       + "\'" + inform.shouldgetPeople+ "\'"+"," 
					        + "\'" + inform.leaveNum+ "\'"+"," 
					         + "\'" + inform.imageurl+ "\'"+"," 
					         + "\'" + inform.resource+ "\'"+"," 
					         + "\'" + '支委会'+ "\'" + ")"
//					         console.log(sql)
			Pfile.increaseSql(sql,  function (err, inform) {
				if (err) {
					return res.status(500).send('Server error'+err.message)
				}
				res.redirect("/views/detail/shyk/zwh")
			})
		})
})
//三会一课党小组会-------增加
router.get('/views/detail/shyk/dxzh-new', function(req, res){
	if(req.session.username)
	{
	var sql1='SELECT commen_userroleinf.loginAcc,commen_userpowerinfo.property,commen_userpowerinfo.people_ctrol FROM commen_userroleinf,commen_userpowerinfo  WHERE commen_userroleinf.property = commen_userpowerinfo.property and  commen_userroleinf.loginAcc='+"\'"+req.session.username+"\'"
	console.log(sql1)
	connection.query(sql1,function (err,result) {
	  if(err){
	    return err;
	  }
	  result=JSON.stringify(result)    //先将result转化为String类型的数据
	  result=JSON.parse(result) 
   var aa=result[0].people_ctrol
	 aa=aa.split(',')
	for(var i=0;i<aa.length;i++)
	{
		if(aa[i]=='44')
			{
				res.render('detail/shyk/dxzh-new.html',{
		judge:req.query.judge
			})
				break
		}
			else{
			if(i==aa.length-1)
			{
				return res.send("你没有此权限")
			
			}else{
				continue
			}
		    }
	}
	})
	}else{
		res.render('login.html')
	}

//	console.log(req.query.judge)
	
})
router.post('/views/detail/shyk/dxzh-new', function(req, res){
//	console.log(req.body)
	var inform=req.body
			var maxid = "select max(id) from  threeandone_smallgroupmeeting"
			//console.log(maxid)
			connection.query(maxid,function (err,result) {
			  if(err){
			    return err;
			  }
			  result=JSON.stringify(result)    //先将result转化为String类型的数据
		  	  result=JSON.parse(result)
		  	  var ret = result[0]
			  var id = ret['max(id)'] + 1
			  
			    
			    //获取当前时间
		  var date = new Date();
	        var seperator1 = "-";
	        var year = date.getFullYear();
	        var month = date.getMonth() + 1;
	        var strDate = date.getDate();
	        if (month >= 1 && month <= 9) {
	            month = "0" + month;
	        }
	        if (strDate >= 0 && strDate <= 9) {
	            strDate = "0" + strDate;
	        }
	        var currentdate = year + seperator1 + month + seperator1 + strDate;
	
			var sql = "insert into  threeandone_smallgroupmeeting values("
					 + id  + ","
					  + "\'" + inform.title + "\'" + "," 
					   +"\'" + inform.holdperson + "\'" + ","
					   +"\'" + inform.holdspeech + "\'" + "," 
					   + "\'" + '名称' + "\'" + ","
					    + "\'" + inform.startTime + "\'" +  ","
					     + "\'" + inform.endTime + "\'" + ","
					      + "\'" + currentdate+ "\'"+"," 
					      + "\'" + inform.shouldgetPeople+ "\'"+"," 
					       + "\'" + inform.shouldgetPeople+ "\'"+"," 
					        + "\'" + inform.leaveNum+ "\'"+"," 
					         + "\'" + inform.imageurl+ "\'"+"," 
					         + "\'" + inform.resource+ "\'"+"," 
					         + "\'" + '党小组会'+ "\'" + ")"
//					         console.log(sql)
			Pfile.increaseSql(sql,  function (err, inform) {
				if (err) {
					return res.status(500).send('Server error'+err.message)
				}
				res.redirect("/views/detail/shyk/dxzh")
			})
		})
	})
//三会一课讲党课-------增加
router.get('/views/detail/shyk/jdk-new', function(req, res){
	if(req.session.username)
	{
	var sql1='SELECT commen_userroleinf.loginAcc,commen_userpowerinfo.property,commen_userpowerinfo.people_ctrol FROM commen_userroleinf,commen_userpowerinfo  WHERE commen_userroleinf.property = commen_userpowerinfo.property and  commen_userroleinf.loginAcc='+"\'"+req.session.username+"\'"
	console.log(sql1)
	connection.query(sql1,function (err,result) {
	  if(err){
	    return err;
	  }
	  result=JSON.stringify(result)    //先将result转化为String类型的数据
	  result=JSON.parse(result) 
   var aa=result[0].people_ctrol
	 aa=aa.split(',')
	for(var i=0;i<aa.length;i++)
	{
		
		if(aa[i]=='47')
			{
				res.render('detail/shyk/jdk-new.html',{
		judge:req.query.judge
			})
				break
		}
			else{
			if(i==aa.length-1)
			{
				return res.send("你没有此权限")
			
			}else{
				continue
			}
		    }
	}
	})
	}else{
		res.render('login.html')
	}
//	console.log(req.query.judge)
	 
})
router.post('/views/detail/shyk/jdk-new', function(req, res){
//	console.log(req.body)
	var inform=req.body
			var maxid = "select max(id) from threeandone_activityspeech"
//			console.log(maxid)
			connection.query(maxid,function (err,result) {
			  if(err){
			    return err;
			  }
			  result=JSON.stringify(result)    //先将result转化为String类型的数据
		  	  result=JSON.parse(result)
		  	  var ret = result[0]
			  var id = ret['max(id)'] + 1
			    
			    //获取当前时间
		  var date = new Date();
	        var seperator1 = "-";
	        var year = date.getFullYear();
	        var month = date.getMonth() + 1;
	        var strDate = date.getDate();
	        if (month >= 1 && month <= 9) {
	            month = "0" + month;
	        }
	        if (strDate >= 0 && strDate <= 9) {
	            strDate = "0" + strDate;
	        }
	        var currentdate = year + seperator1 + month + seperator1 + strDate;
	
			var sql = "insert into threeandone_activityspeech values("
					 + id  + ","
					  + "\'" + inform.title + "\'" + "," 
					   +"\'" + inform.holdperson + "\'" + ","
					   +"\'" + inform.holdspeech + "\'" + "," 
					   + "\'" + '名称' + "\'" + ","
					    + "\'" + inform.startTime + "\'" +  ","
					     + "\'" + inform.endTime + "\'" + ","
					      + "\'" + currentdate+ "\'"+"," 
					      + "\'" + inform.shouldgetPeople+ "\'"+"," 
					       + "\'" + inform.shouldgetPeople+ "\'"+"," 
					        + "\'" + inform.leaveNum+ "\'"+"," 
					         + "\'" + inform.imageurl+ "\'"+"," 
					         + "\'" + inform.resource+ "\'"+"," 
					         + "\'" + '讲党课'+ "\'" + ")"
//					         console.log(sql)
			Pfile.increaseSql(sql,  function (err, inform) {
				if (err) {
					return res.status(500).send('Server error'+err.message)
				}
				res.redirect("/views/detail/shyk/jdk")
			})
		})
})
//党员大会--------目录树
router.get('/views/detail/shyk/dydh-tree', function(req, res){
	var sql = 'SELECT * FROM threeandone_activityinformation where orgName =' + "\'" + req.query.name + "\'";
	//console.log(sql)
	console.log(sql)
	Pfile.searchFile(sql, function(err, inform){
		if(err){
			return res.status(500).send('Servor error'+err.message)
		}
		
		 inform=JSON.stringify(inform)    //先将result转化为String类型的数据
		  	  inform=JSON.parse(inform)
		  	  console.log(inform)
		res.render('detail/shyk/dydh.html',{
			inform:inform
		})
	})
})
//讲党课--------目录树
router.get('/views/detail/shyk/jdk-tree', function(req, res){
	var sql = 'SELECT * FROM threeandone_activityspeech where orgName =' + "\'" + req.query.name + "\'";
	console.log(sql)
	console.log(sql)
	Pfile.searchFile(sql, function(err, inform){
		if(err){
			return res.status(500).send('Servor error'+err.message)
		}
		console.log(inform)
		inform=JSON.stringify(inform)    //先将result转化为String类型的数据
		  	  inform=JSON.parse(inform)
		res.render('detail/shyk/jdk.html',{
			inform:inform
		})
	})
})
//党小组会--------目录树
router.get('/views/detail/shyk/dxzh-tree', function(req, res){
	var sql = 'SELECT * FROM threeandone_smallgroupmeeting where orgName =' + "\'" + req.query.name + "\'";
	Pfile.searchFile(sql, function(err, inform){
		if(err){
			return res.status(500).send('Servor error'+err.message)
		}
		inform=JSON.stringify(inform)    //先将result转化为String类型的数据
		  	  inform=JSON.parse(inform)
		//console.log(people)
		res.render('detail/shyk/dxzh.html',{
			inform:inform
		})
	})
})
//支委会--------目录树
router.get('/views/detail/shyk/zwh-tree', function(req, res){
	var sql = 'SELECT * FROM threeandone_suportcommity where orgName =' + "\'" + req.query.name + "\'";
	Pfile.searchFile(sql, function(err, inform){
		if(err){
			return res.status(500).send('Servor error'+err.message)
		}
		console.log(inform)
		 inform=JSON.stringify(inform)    //先将result转化为String类型的数据
		  	  inform=JSON.parse(inform)
		res.render('detail/shyk/zwh.html',{
			inform:inform
		})
	})
})
//三会一课 党员大会-删除
router.get('/views/detail/shyk/dydh-delete', function(req, res){
	
if(req.session.username)
	{
	var sql1='SELECT commen_userroleinf.loginAcc,commen_userpowerinfo.property,commen_userpowerinfo.people_ctrol FROM commen_userroleinf,commen_userpowerinfo  WHERE commen_userroleinf.property = commen_userpowerinfo.property and  commen_userroleinf.loginAcc='+"\'"+req.session.username+"\'"
	console.log(sql1)
	connection.query(sql1,function (err,result) {
	  if(err){
	    return err;
	  }
	  result=JSON.stringify(result)    //先将result转化为String类型的数据
	  result=JSON.parse(result) 
   var aa=result[0].people_ctrol
	 aa=aa.split(',')
	for(var i=0;i<aa.length;i++)
	{
		if(aa[i]=='40')
			{
		var selectId = req.query.id.split(",")
		var delsql = 'DELETE FROM threeandone_activityinformation where id ='
		for(var i = 0; i < selectId.length; i++){
			if(i == 0){
				delsql += selectId[i]
			} else {
				delsql += " or id = " + selectId[i]
			}
		}
//		console.log(delsql)
		Pfile.deleteSql(delsql, req.query.name, function(err) {
			if(err) {
				return res.status(500).send('Server error'+err.message)	
			}
			res.redirect('/views/detail/shyk/dydh')
			})
		break
		}else{
			if(i==aa.length-1)
			{
				return res.send("你没有此权限")
			
			}else{
				continue
			}
		   }
	}
	})
	}else{
		res.render('login.html')
	}
	})
//三会一课 支委会-删除
router.get('/views/detail/shyk/zwh-delete', function(req, res){
	if(req.session.username)
	{
	var sql1='SELECT commen_userroleinf.loginAcc,commen_userpowerinfo.property,commen_userpowerinfo.people_ctrol FROM commen_userroleinf,commen_userpowerinfo  WHERE commen_userroleinf.property = commen_userpowerinfo.property and  commen_userroleinf.loginAcc='+"\'"+req.session.username+"\'"
	console.log(sql1)
	connection.query(sql1,function (err,result) {
	  if(err){
	    return err;
	  }
	  result=JSON.stringify(result)    //先将result转化为String类型的数据
	  result=JSON.parse(result) 
   var aa=result[0].people_ctrol
	 aa=aa.split(',')
	for(var i=0;i<aa.length;i++)
	{
		if(aa[i]=='42')
			{
				var selectId = req.query.id.split(",")
		var delsql = 'DELETE FROM threeandone_suportcommity where id ='
		for(var i = 0; i < selectId.length; i++){
			if(i == 0){
				delsql += selectId[i]
			} else {
				delsql += " or id = " + selectId[i]
			}
		}
//		console.log(delsql)
		Pfile.deleteSql(delsql, req.query.name, function(err) {
			if(err) {
				return res.status(500).send('Server error'+err.message)	
			}
			res.redirect('/views/detail/shyk/zwh')
		})
		break
			}else{
			if(i==aa.length-1)
			{
				return res.send("你没有此权限")
			
			}else{
				continue
			}
		   }
	}
	
	})
	}else{
		res.render('login.html')
	}
	
	})
//三会一课 党小组会-删除
router.get('/views/detail/shyk/dxzh-delete', function(req, res){
	if(req.session.username)
	{
	var sql1='SELECT commen_userroleinf.loginAcc,commen_userpowerinfo.property,commen_userpowerinfo.people_ctrol FROM commen_userroleinf,commen_userpowerinfo  WHERE commen_userroleinf.property = commen_userpowerinfo.property and  commen_userroleinf.loginAcc='+"\'"+req.session.username+"\'"
	console.log(sql1)
	connection.query(sql1,function (err,result) {
	  if(err){
	    return err;
	  }
	  result=JSON.stringify(result)    //先将result转化为String类型的数据
	  result=JSON.parse(result) 
   var aa=result[0].people_ctrol
	 aa=aa.split(',')
	for(var i=0;i<aa.length;i++)
	{
		if(aa[i]=='45')
			{
				var selectId = req.query.id.split(",")
		var delsql = 'DELETE FROM threeandone_smallgroupmeeting where id ='
		for(var i = 0; i < selectId.length; i++){
			if(i == 0){
				delsql += selectId[i]
			} else {
				delsql += " or id = " + selectId[i]
			}
		}
//		console.log(delsql)
		Pfile.deleteSql(delsql, req.query.name, function(err) {
			if(err) {
				return res.status(500).send('Server error'+err.message)	
			}
			res.redirect('/views/detail/shyk/dxzh')
		})
		break
			}else{
			if(i==aa.length-1)
			{
				return res.send("你没有此权限")
			
			}else{
				continue
			}
		    }
	}
	})
	}else{
		res.render('login.html')
	}
	
	})
//三会一课 讲党课-删除
router.get('/views/detail/shyk/jdk-delete', function(req, res){
	if(req.session.username)
	{
	var sql1='SELECT commen_userroleinf.loginAcc,commen_userpowerinfo.property,commen_userpowerinfo.people_ctrol FROM commen_userroleinf,commen_userpowerinfo  WHERE commen_userroleinf.property = commen_userpowerinfo.property and  commen_userroleinf.loginAcc='+"\'"+req.session.username+"\'"
	console.log(sql1)
	connection.query(sql1,function (err,result) {
	  if(err){
	    return err;
	  }
	  result=JSON.stringify(result)    //先将result转化为String类型的数据
	  result=JSON.parse(result) 
   var aa=result[0].people_ctrol
	 aa=aa.split(',')
	for(var i=0;i<aa.length;i++)
	{
		if(aa[i]=='49')
			{
				var selectId = req.query.id.split(",")
		var delsql = 'DELETE FROM threeandone_activityspeech where id ='
		for(var i = 0; i < selectId.length; i++){
			if(i == 0){
				delsql += selectId[i]
			} else {
				delsql += " or id = " + selectId[i]
			}
		}
//		console.log(delsql)
		Pfile.deleteSql(delsql, req.query.name, function(err) {
			if(err) {
				return res.status(500).send('Server error'+err.message)	
			}
			res.redirect('/views/detail/shyk/jdk')
		})
		break
			}else{
			if(i==aa.length-1)
			{
				return res.send("你没有此权限")
			
			}else{
				continue
			}
		    }
	}
	})
	}else{
		res.render('login.html')
	}
})
router.post('/views/detail/shyk/dydh-search', function(req,res){
	//console.log(req.body)
	var inform = req.body
	for(var key in inform){
		if(inform[key] == ''){
			delete inform[key]
		}
	}
	if(JSON.stringify(inform) == '{}'){
		console.log('2333')
		res.redirect('/views/detail/shyk/dydh')
		return
	}
	var sql = "select * from threeandone_activityinformation where "
	//console.log(sql)
	var i = 0
	for(var key in inform){
		if (i == 0){
			sql +=  key + " like" + "\'"+"%"+inform[key]+"%"+"\'"
			i++
		} else {
			sql +="and " +key + " like" + "\'"+"%"+inform[key]+"%"+"\'"
		}
	}
	sql+=" and type="+"\'"+"党员大会"+"\'" 
	console.log(sql)
	Pfile.selectSql(sql, function(err, inform) {
		if (err) {
			return res.status(500).send('Server error'+err.message)
		}
		res.render('detail/shyk/dydh.html', {
			inform: inform
		})
	})
})
//三会一课 支委会-查询
router.post('/views/detail/shyk/zwh-search', function(req,res){
//	console.log(req.body)
	var inform = req.body
	
	for(var key in inform){
		if(inform[key] == ''){
			delete inform[key]
		}
	}
	if(JSON.stringify(inform) == '{}'){
		console.log('2333')
		res.redirect('/views/detail/shyk/zwh')
		return
	}
	var sql = "select * from threeandone_suportcommity where " +"type="+"\'"+"支委会"+"\'"
	//console.log(sql)
	var i = 0
	for(var key in inform){
		sql +="and " +key + " like" + "\'"+"%"+inform[key]+"%"+"\'"
	}
	//console.log(sql)
	Pfile.selectSql(sql, function(err, inform) {
		if (err) {
			return res.status(500).send('Server error'+err.message)
		}
		res.render('detail/shyk/zwh.html', {
			inform: inform
		})
	})
})
//三会一课 党小组会-查询
router.post('/views/detail/shyk/dxzh-search', function(req,res){
	//console.log(req.body)
	var inform = req.body
	for(var key in inform){
		if(inform[key] == ''){
			delete inform[key]
		}
	}
	if(JSON.stringify(inform) == '{}'){
		console.log('2333')
		res.redirect('/views/detail/shyk/dxzh')
		return
	}
	var sql = "select * from threeandone_smallgroupmeeting where "  +"type="+"\'"+"党小组会"+"\'"
	var i = 0
	for(var key in inform){
		sql +="and " +key + " like" + "\'"+"%"+inform[key]+"%"+"\'"
	}
	//console.log(sql)
	Pfile.selectSql(sql, function(err, inform) {
		if (err) {
			return res.status(500).send('Server error'+err.message)
		}
		res.render('detail/shyk/dxzh.html', {
			inform: inform
		})
	})
})
//三会一课 讲党课-查询
router.post('/views/detail/shyk/jdk-search', function(req,res){
	//console.log(req.body)
	var inform = req.body
	for(var key in inform){
		if(inform[key] == ''){
			delete inform[key]
		}
	}
	if(JSON.stringify(inform) == '{}'){
		console.log('2333')
		res.redirect('/views/detail/shyk/jdk')
		return
	}
	var sql = "select * from threeandone_activityspeech where " +"type="+"\'"+"讲党课"+"\'"
	var i = 0
	for(var key in inform){
			sql +="and " +key + " like" + "\'"+"%"+inform[key]+"%"+"\'"
	
	}
	//console.log(sql)
	Pfile.selectSql(sql, function(err, inform) {
		if (err) {
			return res.status(500).send('Server error'+err.message)
		}
		res.render('detail/shyk/jdk.html', {
			inform: inform
		})
	})
})
/*
 * 掌上组织生活
 */
//掌上组织生活
router.get('/views/detail/zszzsh/zszzsh', function(req, res){
	 var sql = 'SELECT * FROM organazition_life';
	connection.query(sql,function (err,inform) {
	  if(err){
	    return callback(err);
	  }
	res.render('detail/zszzsh/zszzsh.html', {
			inform: inform
		})
	})
})
//掌上组织生活-------修改
router.get('/views/detail/zszzsh/edit', function(req, res){
	if(req.session.username)
	{
	var sql1='SELECT commen_userroleinf.loginAcc,commen_userpowerinfo.property,commen_userpowerinfo.people_ctrol FROM commen_userroleinf,commen_userpowerinfo  WHERE commen_userroleinf.property = commen_userpowerinfo.property and  commen_userroleinf.loginAcc='+"\'"+req.session.username+"\'"
	console.log(sql1)
	connection.query(sql1,function (err,result) {
	  if(err){
	    return err;
	  }
	  result=JSON.stringify(result)    //先将result转化为String类型的数据
	  result=JSON.parse(result) 
   var aa=result[0].people_ctrol
	 aa=aa.split(',')
	for(var i=0;i<aa.length;i++)
	{
		if(aa[i]=='51')
			{
				var sql = 'SELECT * FROM organazition_life	 where id =' + req.query.id;
	Pfile.searchById(sql,parseInt(req.query.id), function (err, inform) {
		if (err) {
			return res.status(500).send('Server error'+err.message)
		}
				res.render('detail/zszzsh/edit.html', {
					inform: inform
				})
			})
	break
			}else{
			if(i==aa.length-1)
			{
				return res.send("你没有此权限")
			
			}else{
				continue
			}
		    }
	}
	})
	}else{
		res.render('login.html')
	}
	
})
router.post('/views/detail/zszzsh/edit', function(req, res){
	var inform = req.body
	//console.log(req.body)
	//var editsql = "update people_information set name=" +"\'" + people.name + "\'"+"where id=" + people.id;
	var editsql = "update    organazition_life set title =" +"\'" + inform.title + "\'"+ "," + "holdperson=" +"\'" + inform.holdperson + "\'" 
	+ "," + "holdspeech=" +"\'" + inform.holdspeech + "\'"
+ "," + "type=" +"\'" + inform.type + "\'"
+ "," + "startTime=" +"\'" + inform.startTime + "\'"
+ "," + "endTime=" +"\'" + inform.endTime + "\'"
+ "," + "shouldgetPeople=" +"\'" + inform.shouldgetPeople + "\'"
+ "," + "reactgetPeople=" +"\'" + inform.reactgetPeople + "\'"
+ "," + "leaveNum=" +"\'" + inform.leaveNum + "\'"
+ "," + "imageurl=" +"\'" + inform.imageurl + "\'"
+ "," + "specialArticles=" +"\'" + inform.specialArticles + "\'"
+"where id=" + inform.id;
//console.log(people.id)
//console.log(editsql)
	Pfile.editById(editsql, function(err){
		if(err) {
			return res.status(500).send('Server error'+err.message)	
		}
		res.redirect('/views/detail/zszzsh/zszzsh')
	})
})
//掌上组织生活-------新增
router.get('/views/detail/zszzsh/new', function(req, res) {
	if(req.session.username)
	{
	var sql1='SELECT commen_userroleinf.loginAcc,commen_userpowerinfo.property,commen_userpowerinfo.people_ctrol FROM commen_userroleinf,commen_userpowerinfo  WHERE commen_userroleinf.property = commen_userpowerinfo.property and  commen_userroleinf.loginAcc='+"\'"+req.session.username+"\'"
	console.log(sql1)
	connection.query(sql1,function (err,result) {
	  if(err){
	    return err;
	  }
	  result=JSON.stringify(result)    //先将result转化为String类型的数据
	  result=JSON.parse(result) 
   var aa=result[0].people_ctrol
	 aa=aa.split(',')
	for(var i=0;i<aa.length;i++)
	{
		if(aa[i]=='50')
			{
				res.render('detail/zszzsh/new.html')
				break
			}else{
			if(i==aa.length-1)
			{
				return res.send("你没有此权限")
			
			}else{
				continue
			}
		    }
	}
	})
	}else{
		res.render('login.html')
	}
	
})
router.post('/views/detail/zszzsh/new', function(req, res){
	//console.log(req.body)
	var inform=req.body
		var maxid = "select max(id) from organazition_life"
			//console.log(maxid)
			connection.query(maxid,function (err,result) {
			  if(err){
			    return err;
			  }
			  result=JSON.stringify(result)    //先将result转化为String类型的数据
		  	  result=JSON.parse(result)
		  	  var ret = result[0]
			  var id = ret['max(id)'] + 1
	
			var sql = "insert into organazition_life values("
					 + id  + ","
					  + "\'" + inform.title + "\'" + "," 
					   +"\'" + inform.holdperson + "\'" + ","	
					      + "\'" + inform.holdspeech+ "\'"+"," 
					   +"\'" + inform.shouldgetPeople+ "\'" + "," 
					   + "\'" + inform.reactgetPeople + "\'" + ","
					    + "\'" + inform.leaveNum + "\'" +  ","
					      + "\'" + inform.startTime+ "\'"+"," 
					        + "\'" + inform.endTime+ "\'"+"," 
					         + "\'" + inform.type+ "\'"+"," 
					          + "\'" + ''+ "\'"+"," 
					           + "\'" + inform.imageurl+ "\'"+"," 
					         + "\'" + inform.specialArticles+ "\'"+ ")"
					         console.log(sql)
			Pfile.increaseSql(sql,  function (err, inform) {
				if (err) {
					return res.status(500).send('Server error'+err.message)
				}
				res.redirect("/views/detail/zszzsh/zszzsh")
			})
		})	
})
//掌上组织生活-删除
router.get('/views/detail/zszzsh/delete', function(req, res){
	if(req.session.username)
	{
	var sql1='SELECT commen_userroleinf.loginAcc,commen_userpowerinfo.property,commen_userpowerinfo.people_ctrol FROM commen_userroleinf,commen_userpowerinfo  WHERE commen_userroleinf.property = commen_userpowerinfo.property and  commen_userroleinf.loginAcc='+"\'"+req.session.username+"\'"
	console.log(sql1)
	connection.query(sql1,function (err,result) {
	  if(err){
	    return err;
	  }
	  result=JSON.stringify(result)    //先将result转化为String类型的数据
	  result=JSON.parse(result) 
   var aa=result[0].people_ctrol
	 aa=aa.split(',')
	for(var i=0;i<aa.length;i++)
	{
		if(aa[i]=='52')
			{
				var selectId = req.query.id.split(",")
		var delsql = 'DELETE FROM organazition_life where id ='
		for(var i = 0; i < selectId.length; i++){
			if(i == 0){
				delsql += selectId[i]
			} else {
				delsql += " or id = " + selectId[i]
			}
		}
//		console.log(delsql)
	//console.log(delsql)
			Pfile.deleteSql(delsql, req.query.id, function(err) {
				if(err) {
					return res.status(500).send('Server error'+err.message)	
				}
				res.redirect('/views/detail/zszzsh/zszzsh')
			})
			break
			}else{
			if(i==aa.length-1)
			{
				return res.send("你没有此权限")
			
			}else{
				continue
			}
		    }
	}
	})
	}else{
		res.render('login.html')
	}
	
})
//掌上组织生活--------目录树
router.get('/views/detail/zszzsh/zszzsh-tree', function(req, res){
	var sql = 'SELECT * FROM organazition_life where postbranch =' + "\'" + req.query.name + "\'";
	Pfile.searchFile(sql, function(err, inform){
		if(err){
			return res.status(500).send('Servor error'+err.message)
		}
		inform=JSON.stringify(inform)    //先将result转化为String类型的数据
		  	  inform=JSON.parse(inform)
		  	  console.log(inform)
		res.render('detail/zszzsh/zszzsh.html',{
			inform:inform
		})
	})
})
//掌上组织生活-----查询
router.post('/views/detail/zszhsh/zszhsh-search', function(req,res){
var inform = req.body
	for(var key in inform){
		if(inform[key] == ''){
			delete inform[key]
		}
	}
	if(JSON.stringify(inform) == '{}'){
		console.log('2333')
		res.redirect('/views/detail/zszzsh/zszzsh')
		return
	}
	//console.log(inform)
	var sql = "select * from organazition_life where " 
	var i = 0
	for(var key in inform){
		if (i == 0){
			sql +=  key + " like" + "\'"+"%"+inform[key]+"%"+"\'"
			i++
		} else {
			sql +="and " +key + " like" + "\'"+"%"+inform[key]+"%"+"\'"
		}
	}
	//console.log(sql)
	Pfile.selectSql(sql, function(err, inform) {
		if (err) {
			return res.status(500).send('Server error'+err.message)
		}
		res.render('detail/zszzsh/zszzsh.html', {
			inform: inform
		})
	})
})
/*
 * 主题党日
 */
//主题党日
router.get('/views/detail/ztdr/ztdr', function(req, res){
	 var sql = 'SELECT * FROM vital_commitytday';
	connection.query(sql,function (err,inform) {
	  if(err){
	    return callback(err);
	  }
	res.render('detail/ztdr/ztdr.html', {
			inform: inform
		})
	})
})
//主题党日--------目录树
router.get('/views/detail/ztdr/ztdr-tree', function(req, res){
	var sql = 'SELECT * FROM vital_commitytday where name =' + "\'" + req.query.name + "\'";
	Pfile.searchFile(sql, function(err, inform){
		if(err){
			return res.status(500).send('Servor error'+err.message)
		}
		inform=JSON.stringify(inform)    //先将result转化为String类型的数据
		  	  inform=JSON.parse(inform)
		  	  console.log(inform)
		res.render('detail/ztdr/ztdr.html',{
			inform:inform
		})
	})
})
//主题党日-------查看
router.get('/views/detail/ztdr/detail', async(req, res) => {
       var access_list = await get_accesslist(req);
       var aa = access_list.split(',')
       for(var i=0;i<aa.length;i++){
       		if(aa[i]=='55'){
       		    var sql = 'SELECT * FROM vital_commitytday where id =' + req.query.id;
                	Pfile.searchById(sql,parseInt(req.query.id), function (err, inform) {
                		if (err) {
                			return res.status(500).send('Server error'+err.message)
                		}
                		res.render('detail/ztdr/detail.html', {
                			inform: inform
                		})
                	})
       		break
       		}else{
       		    if(i==aa.length-1){
                    return res.send("你没有此操作权限")
                }else{
                	continue
                }
       		}
       		}
})
//主题党日-------修改
router.get('/views/detail/ztdr/edit', async (req, res) => {
    var access_list = await get_accesslist(req);
	var aa = access_list.split(',')
        for(var i=0;i<aa.length;i++){
        console.log(aa[i])
        if(aa[i]=='53'){
	        var sql = 'SELECT * FROM vital_commitytday	 where id =' + req.query.id;
	        Pfile.searchById(sql,parseInt(req.query.id), function (err, inform) {
		    if (err) {
			    return res.status(500).send('Server error'+err.message)
		    }
		    res.render('detail/ztdr/edit.html', {
			    inform: inform
		})
	})
	break
	}else{
	    if(i==aa.length-1){
            return res.send("你没有此操作权限")
        }else{
            continue
        }
	}
	}
})
router.post('/views/detail/ztdr/edit', function(req, res){
	var inform = req.body
	//console.log(req.body)
	//var editsql = "update people_information set name=" +"\'" + people.name + "\'"+"where id=" + people.id;
	var editsql = "update vital_commitytday set title =" +"\'" + inform.title + "\'"
	+ "," + "startTime=" +"\'" + inform.startTime + "\'"
	+ "," + "endTime=" +"\'" + inform.endTime + "\'"
	+ "," + "reportNum=" +"\'" + inform.reportNum + "\'"
	+ "," + "connectpeople=" +"\'" + inform.connectpeople + "\'"
	+ "," + "connectphone=" +"\'" + inform.connectphone + "\'"
	+ "," + "attribute=" +"\'" + inform.attribute + "\'"
	+ "," + "imageurl=" +"\'" + inform.imageurl+ "\'"
	+ "," + "des=" +"\'" + inform.des + "\'"
	+ "," + "request=" +"\'" + inform.request + "\'"
	+ "," + "resource=" +"\'" + inform.resource + "\'"
	+"where id=" + inform.id;
//console.log(people.id)
console.log(editsql)
	Pfile.editById(editsql, function(err){
		if(err) {
			return res.status(500).send('Server error'+err.message)	
		}
		res.redirect('/views/detail/ztdr/ztdr')
	})
})
//主题党日---------审核
router.get('/views/detail/ztdr/examine', async(req, res) => {
    var access_list = await get_accesslist(req);
    var aa = access_list.split(',');
    for(var i=0;i<aa.length;i++){
         if(aa[i]=='56'){
	         var inform = req.query
	         //console.log(req.body)
	         //var editsql = "update people_information set name=" +"\'" + people.name + "\'"+"where id=" + people.id;
	         var editsql = "update vital_commitytday set status =" +"\'" + "审核通过" + "\'"
	         +"where id=" + inform.id;
             //console.log(people.id)
             console.log(editsql)
	        Pfile.editById(editsql, function(err){
		    if(err) {
			    return res.status(500).send('Server error'+err.message)
		    }
		    res.redirect('/views/detail/ztdr/ztdr')
	        })
	        break
	     }else{
	         if(i==aa.length-1){
                 return res.send("你没有此操作权限")
             }else{
                  continue
             }
	     }
	}
})
//主题党日---------撤销审核
router.get('/views/detail/ztdr/examineOff', async(req, res) => {
    var access_list = await get_accesslist(req);
    var aa = access_list.split(',')
    for(var i=0;i<aa.length;i++){
        if(aa[i]=='57'){
	        var inform = req.query
	        //console.log(req.body)
	        //var editsql = "update people_information set name=" +"\'" + people.name + "\'"+"where id=" + people.id;
	        var editsql = "update vital_commitytday set status =" +"\'" + "未审核" + "\'"
	        +"where id=" + inform.id;
            //console.log(people.id)
            console.log(editsql)
	        Pfile.editById(editsql, function(err){
		    if(err) {
			    return res.status(500).send('Server error'+err.message)
		    }
		    res.redirect('/views/detail/ztdr/ztdr')
	        })
	        break
	    }else{
	        if(i==aa.length-1){
                return res.send("你没有此操作权限")
            }else{
                continue
            }
	    }
	}
})
//主题党日-删除
router.get('/views/detail/ztdr/delete', async(req, res) => {
    var access_list = await get_accesslist(req);
    var aa = access_list.split(',')
    for(var i=0;i<aa.length;i++){
        if(aa[i]=='54'){
	        var selectId = req.query.id.split(",")
		    var delsql = 'DELETE FROM vital_commitytday where id ='
		    for(var i = 0; i < selectId.length; i++){
			    if(i == 0){
				    delsql += selectId[i]
			    }else{
				    delsql += " or id = " + selectId[i]
			    }
		    }
	        Pfile.deleteSql(delsql, req.query.id, function(err) {
		    if(err) {
			    return res.status(500).send('Server error'+err.message)
		    }
		    res.redirect('/views/detail/ztdr/ztdr')
	        })
	        break
	    }else{
	        if(i==aa.length-1){
                return res.send("你没有此操作权限")
            }else{
                continue
            }
	    }
	    }
})
//主题党日-----查询
router.post('/views/detail/ztdr/ztdr-search', function(req,res){
var inform = req.body
	for(var key in inform){
		if(inform[key] == ''){
			delete inform[key]
		}
	}
	if(JSON.stringify(inform) == '{}'){
		console.log('2333')
		res.redirect('/views/detail/ztdr/ztdr')
		return
	}
	console.log(inform)
	var sql = "select * from vital_commitytday where " 
	var i = 0
	for(var key in inform){
		if (i == 0){
			sql +=  key + " like" + "\'"+"%"+inform[key]+"%"+"\'"
			i++
		} else {
			sql +="and " +key + " like" + "\'"+"%"+inform[key]+"%"+"\'"
		}
	}
	console.log(sql)
	Pfile.selectSql(sql, function(err, inform) {
		if (err) {
			return res.status(500).send('Server error'+err.message)
		}
		res.render('detail/ztdr/ztdr.html', {
			inform: inform
		})
	})
})
/*
 * 在职党员进社区
 */
//在职党员进社区
router.get('/views/detail/zzdyjsq/zzdyjsq', function(req, res){
	 var sql = 'SELECT * FROM people_information';
	connection.query(sql,function (err,people) {
	  if(err){
	    return callback(err);
	  }
	res.render('detail/zzdyjsq/zzdyjsq.html', {
			people: people
		})
	})
})
//在职党员进社区-------修改
router.get('/views/detail/zzdyjsq/zzdyjsq-edit', function(req, res){
	var sql = 'SELECT * FROM people_information	 where id =' + req.query.id;
	Pfile.searchById(sql,parseInt(req.query.id), function (err, people) {
		if (err) {
			return res.status(500).send('Server error'+err.message)
		}
		res.render('detail/zzdyjsq/zzdyjsq-edit.html', {
			people: people 
		})
	})
})
router.post('/views/detail/zzdyjsq/zzdyjsq-edit', function(req, res){
	var people = req.body
	var editsql = "update people_information set reportTime =" +"\'" + people.reportTime + "\'"
	+"where id=" + people.id;
//console.log(people.id)
console.log(editsql)
	Pfile.editById(editsql, function(err){
		if(err) {
			return res.status(500).send('Server error'+err.message)	
		}
		res.redirect('views/detail/zzdyjsq/zzdyjsq')
	})
})
//在职党员进社区-----删除
router.get('/views/detail/zzdyjsq/delete', function(req, res){
	var delsql = 'DELETE FROM people_information where id =' + req.query.id;
	console.log(delsql)
	Pfile.deleteSql(delsql, req.query.id, function(err) {
		if(err) {
			return res.status(500).send('Server error'+err.message)	
		}
		res.redirect('/views/detail/zzdyjsq/zzdyjsq.html')
	})
})
//在职党员进社区--------目录树
router.get('/views/detail/zzdyjsq/zzdyjsq-tree', function(req, res){
	var sql = 'SELECT * FROM people_information where belongorganazation =' + "\'" + req.query.name + "\'";
	//console.log(sql)
	//console.log(sql)
	Pfile.searchFile(sql, function(err, people){
		if(err){
			return res.status(500).send('Servor error'+err.message)
		}
		people=JSON.stringify(people)    //先将result转化为String类型的数据
		  	  people=JSON.parse(people)
		  	  console.log(people)
		res.render('detail/zzdyjsq/zzdyjsq.html',{
			people:people
		})
	})
})
//在职党员进社区-----审核
router.get('/views/detail/zzdyjsq/examine', async(req, res) => {
	var access_list = await get_accesslist(req);
	var aa = access_list.split(',');
    for(var i=0;i<aa.length;i++){
	    if(aa[i]=='58'){
		    var people = req.query
		    console.log(people.id)
	        var editsql = "update people_information set reportStatusTime =" +"\'" + "已审核" + "\'"
	        +"where id= "+ people.id;
            console.log(editsql)
	        Pfile.editById(editsql, function(err){
		        if(err) {
			        return res.status(500).send('Server error'+err.message)
		        }
		        return res.redirect('/views/detail/zzdyjsq/zzdyjsq')
	        })
	        break
	    }else{
	        if(i==aa.length-1){
                return res.send("你没有此操作权限")
            }else{
                continue
            }
	    }
    }
})

//在职党员进社区-----查询
router.post('/views/detail/zzdyjsq/zzdyjsq-search', function(req,res){
var inform = req.body
	for(var key in inform){
		if(inform[key] == ''){
			delete inform[key]
		}
	}
	if(JSON.stringify(inform) == '{}'){
		console.log('2333')
		res.redirect('/views/detail/zzdyjsq/zzdyjsq')
		return
	}
	console.log(inform)
	var sql = "select * from people_information where " 
	var i = 0
	for(var key in inform){
		if (i == 0){
			sql +=  key + " like" + "\'"+"%"+inform[key]+"%"+"\'"
			i++
		} else {
			sql +="and " +key + " like" + "\'"+"%"+inform[key]+"%"+"\'"
		}
	}
	console.log(sql)
	Pfile.selectSql(sql, function(err, people) {
		if (err) {
			return res.status(500).send('Server error'+err.message)
		}
		res.render('detail/zzdyjsq/zzdyjsq.html', {
			people: people
		})
	})
})
//社区活动
router.get('/views/detail/zzdyjsq/sqhd', function(req, res){
	 var sql = 'SELECT * FROM inposition_activity';
	connection.query(sql,function (err,inform) {
	  if(err){
	    return err
	  }
	res.render('detail/zzdyjsq/sqhd.html', {
			inform: inform
		})
	})
})
//社区活动--------修改
router.get('/views/detail/zzdyjsq/sqhd-edit', async(req, res) => {
	var access_list = await get_accesslist(req);
	var aa = access_list.split(',')
for(var i=0;i<aa.length;i++)
{
	if(aa[i]=='59')
	{
		var sql = 'SELECT * FROM inposition_activity where id =' + req.query.id;
	Pfile.searchById(sql,parseInt(req.query.id), function (err, inform) {
		if (err) {
			return res.status(500).send('Server error'+err.message)
		}
		res.render('detail/zzdyjsq/sqhd-edit.html', {
			inform: inform 
		})
	})
	break
	}
	else
	{
		if(i==aa.length-1)
        			{
        			return res.send("你没有此操作权限")
        			}else{
        				continue
        			}
	}
}
})
router.post('/views/detail/zzdyjsq/sqhd-edit', function(req, res){
	var inform = req.body
	var editsql = "update inposition_activity set title =" +"\'" + inform.title + "\'"
	+ "," + "startTime=" +"\'" + inform.startTime + "\'"
	+ "," + "place=" +"\'" + inform.place + "\'"
	+ "," + "content=" +"\'" + inform.content + "\'"
	+"where id=" + inform.id;
//console.log(people.id)
console.log(editsql)
	Pfile.editById(editsql, function(err){
		if(err) {
			return res.status(500).send('Server error'+err.message)	
		}
		res.redirect('/views/detail/zzdyjsq/sqhd')
	})
})
//社区活动-----删除
router.get('/views/detail/zzdyjsq/sqhd-delete', async(req, res) => {
    var access_list = await get_accesslist(req);
	var aa = access_list.split(',');
    for(var i=0;i<aa.length;i++)
    {
	    if(aa[i]=='60'){
	        var selectId = req.query.id.split(",")
		    var delsql = 'DELETE FROM inposition_activity where id ='
		    for(var i = 0; i < selectId.length; i++){
			if(i == 0){
				delsql += selectId[i]
			} else {
				delsql += " or id = " + selectId[i]
			}
		}
		console.log(delsql)
	    Pfile.deleteSql(delsql, req.query.id, function(err) {
		if(err) {
			return res.status(500).send('Server error'+err.message)	
		}
		return res.redirect('/views/detail/zzdyjsq/sqhd')
	    })
	    break
	    }else{
	        if(i==aa.length-1){
                return res.send("你没有此操作权限")
            }else{
                continue
            }
	    }
	}
})
//社区活动-------查询
router.post('/views/detail/zzdyjsq/sqhd-search', function(req,res){
	var inform = req.body
	for(var key in inform){
		if(inform[key] == ''){
			delete inform[key]
		}
	}
	
	if(JSON.stringify(inform) == '{}'){
		console.log('2333')
		res.redirect('/views/detail/zzdyjsq/sqhd')
		return
	}
//	console.log(inform)
	var sql = "select * from inposition_activity where " 
	var i = 0
	for(var key in inform){
		if (i == 0){
			sql +=  key + " like" + "\'"+"%"+inform[key]+"%"+"\'"
			i++
		} else {
			sql +="and " +key + " like" + "\'"+"%"+inform[key]+"%"+"\'"
		}
	}
	//console.log(sql)
	Pfile.selectSql(sql, function(err, inform) {
		if (err) {
			return res.status(500).send('Server error'+err.message)
		}
		res.render('detail/zzdyjsq/sqhd.html', {
			inform: inform
		})
	})
})
//社区活动-------新增
router.get('/views/detail/zzdyjsq/sqhd-new', function(req, res) {
	res.render('detail/zzdyjsq/sqhd-new.html')
})
router.post('/views/detail/zzdyjsq/sqhd-new', function(req, res){
	//console.log(req.body)
	var inform=req.body
		var maxid = "select max(id) from inposition_activity"
			//console.log(maxid)
			connection.query(maxid,function (err,result) {
			  if(err){
			    return err;
			  }
			  result=JSON.stringify(result)    //先将result转化为String类型的数据
		  	  result=JSON.parse(result)
		  	  var ret = result[0]
			  var id = ret['max(id)'] + 1
	
			var sql = "insert into inposition_activity values("
					 + id  + ","
					  + "\'" + inform.title + "\'" + "," 
					   +"\'" + inform.startTime + "\'" + ","	
					      + "\'" + inform.place+ "\'"+"," 
					      +"\'" + inform.enterTime + "\'" + ","	
					   +"\'" + inform.content+ "\'" + ")"
					         console.log(sql)
			Pfile.increaseSql(sql,  function (err, inform) {
				if (err) {
					return res.status(500).send('Server error'+err.message)
				}
				res.redirect('/views/detail/zzdyjsq/sqhd')
			})
		})	
})
//社区活动-----查询
router.post('/views/detail/zzdyjsq/sqhd-search', function(req,res){
var inform = req.body
	for(var key in inform){
		if(inform[key] == ''){
			delete inform[key]
		}
	}
	console.log(inform)
	var sql = "select * from inposition_activity where " 
	var i = 0
	for(var key in inform){
		if (i == 0){
			sql +=  key + " like" + "\'"+"%"+inform[key]+"%"+"\'"
			i++
		} else {
			sql +="and " +key + " like" + "\'"+"%"+inform[key]+"%"+"\'"
		}
	}
	console.log(sql)
	Pfile.selectSql(sql, function(err, people) {
		if (err) {
			return res.status(500).send('Server error'+err.message)
		}
		res.render('detail/zzdyjsq/sqhd.html', {
			people: people
		})
	})
})
//承诺管理
router.get('/views/detail/zzdyjsq/cngl', function(req, res){
	 var sql = 'SELECT * FROM inposition_admit';
	connection.query(sql,function (err,inform) {
	  if(err){
	    return err
	  }
	res.render('detail/zzdyjsq/cngl.html', {
			inform: inform
		})
	})
})
//承诺管理--------修改
router.get('/views/detail/zzdyjsq/cngl-edit', async(req, res) => {
	var access_list = await get_accesslist(req);
	var aa = access_list.split(',');
    for(var i=0;i<aa.length;i++){
	    if(aa[i]=='61'){
		    var sql = 'SELECT * FROM inposition_admit where id =' + req.query.id;
	        Pfile.searchById(sql,parseInt(req.query.id), function (err, inform) {
		        if (err) {
			        return res.status(500).send('Server error'+err.message)
		        }
		        res.render('detail/zzdyjsq/cngl-edit.html', {
			        inform: inform
		        })
	        })
	        break
	    }else{
	        if(i == aa.length-1){
                return res.send("你没有此操作权限")
            }else{
                continue
            }
	    }
	}
})
router.post('/views/detail/zzdyjsq/cngl-edit', function(req, res){
	var inform = req.body
	var editsql = "update inposition_admit set name =" +"\'" + inform.name + "\'"
	+ "," + "content=" +"\'" + inform.content + "\'"
	+ "," + "phoneNum=" +"\'" + inform.phoneNum + "\'"
	+ "," + "enterTime=" +"\'" + inform.enterTime + "\'"
	+"where id=" + inform.id;
	console.log(editsql)
	Pfile.editById(editsql, function(err){
		if(err) {
			return res.status(500).send('Server error'+err.message)	
		}
		res.redirect('/views/detail/zzdyjsq/cngl')
	})
})
//承诺管理-----删除
router.get('/views/detail/zzdyjsq/cngl-delete', async(req, res) => {
	var access_list = await get_accesslist(req);
	var aa = access_list.split(',');
	for(var i=0;i<aa.length;i++){
		if(aa[i]=='62'){
	        var selectId = req.query.id.split(",")
		    var delsql = 'DELETE FROM inposition_admit where id ='
		    for(var i = 0; i < selectId.length; i++){
			    if(i == 0){
				    delsql += selectId[i]
			    } else {
				    delsql += " or id = " + selectId[i]
			    }
		    }
		    console.log(delsql)
	        Pfile.deleteSql(delsql, req.query.id, function(err) {
		    if(err) {
			    return res.status(500).send('Server error'+err.message)
		    }
		    return res.redirect('/views/detail/zzdyjsq/cngl')
	        })
	        break
	    }else{
	        if(i == aa.length-1){
                return res.send("你没有此操作权限")
            }else{
                continue
            }
	    }
	}
})
//承诺管理-------查询
router.post('/views/detail/zzdyjsq/cngl-search', function(req,res){
	var inform = req.body
	for(var key in inform){
		if(inform[key] == ''){
			delete inform[key]
		}
	}
	
	if(JSON.stringify(inform) == '{}'){
		console.log('2333')
		res.redirect('/views/detail/zzdyjsq/cngl')
		return
	}
//	console.log(inform)
	var sql = "select * from inposition_admit where " 
	var i = 0
	for(var key in inform){
		if (i == 0){
			sql +=  key + " like" + "\'"+"%"+inform[key]+"%"+"\'"
			i++
		} else {
			sql +="and " +key + " like" + "\'"+"%"+inform[key]+"%"+"\'"
		}
	}
	//console.log(sql)
	Pfile.selectSql(sql, function(err, inform) {
		if (err) {
			return res.status(500).send('Server error'+err.message)
		}
		res.render('detail/zzdyjsq/cngl.html', {
			inform: inform
		})
	})
})
//承诺管理-----审核通过
router.get('/views/detail/zzdyjsq/cngl-examine', function(req, res){
//	var sql1='SELECT commen_userroleinf.loginAcc,commen_userpowerinfo.property,commen_userpowerinfo.people_ctrol FROM commen_userroleinf,commen_userpowerinfo  WHERE commen_userroleinf.property = commen_userpowerinfo.property and  commen_userroleinf.loginAcc='+"\'"+req.session.username+"\'"
//	console.log(sql1)
//	connection.query(sql1,function (err,result) {
//	  if(err){
//	    return err;
//	  }
//	  result=JSON.stringify(result)    //先将result转化为String类型的数据
//	  result=JSON.parse(result) 
// var aa=result[0].people_ctrol
//	aa.split(',')
//for(var i=0;i<aa.length;i++)
//{
//	if(aa[i]=='63')
//	{
  		var people = req.query
	var editsql = "update inposition_admit set status =" +"\'" + "审核通过" + "\'"
	+"where id=" + people.id;
//console.log(people.id)
console.log(editsql)
	Pfile.editById(editsql, function(err){
		if(err) {
			return res.status(500).send('Server error'+err.message)	
		}
		return res.redirect('/views/detail/zzdyjsq/cngl')
	})
//	}
//	else
//	{
//		return res.send("你没有此权限")
//	}
//}
//	})
})
//承诺管理-----审核不通过
router.get('/views/detail/zzdyjsq/cngl-examineOff', function(req, res){
	var people = req.query
	var editsql = "update inposition_admit set status =" +"\'" + "审核未通过" + "\'"
	+"where id=" + people.id;
//console.log(people.id)
console.log(editsql)
	Pfile.editById(editsql, function(err){
		if(err) {
			return res.status(500).send('Server error'+err.message)	
		}
		res.redirect('/views/detail/zzdyjsq/cngl')
	})
})
//承诺管理-------新增
router.get('/views/detail/zzdyjsq/cngl-new', async(req, res) => {
   	var access_list = await get_accesslist(req);
   	var aa = access_list.split(',');
     for(var i=0;i<aa.length;i++){
    	if(aa[i]=='61'){
	        res.render('detail/zzdyjsq/cngl-new.html')
	        break
	    }else{
	        if(i == aa.length-1){
                return res.send("你没有此操作权限")
            }else{
                continue
            }
	    }
	 }
})
router.post('/views/detail/zzdyjsq/cngl-new', function(req, res){
	//console.log(req.body)
	var inform=req.body
		var maxid = "select max(id) from inposition_admit"
			//console.log(maxid)
			connection.query(maxid,function (err,result) {
			  if(err){
			    return err;
			  }
			  result=JSON.stringify(result)    //先将result转化为String类型的数据
		  	  result=JSON.parse(result)
		  	  var ret = result[0]
			  var id = ret['max(id)'] + 1
	
			var sql = "insert into inposition_admit values("
					 + id  + ","
					  + "\'" + inform.name + "\'" + "," 
					   +"\'" + inform.gender + "\'" + ","	
					      + "\'" + inform.phoneNum+ "\'"+"," 
					   +"\'" + inform.content+ "\'" + "," 
					   + "\'" + "未审核" + "\'" + ","
					    + "\'" + inform.enterTime + "\'"+ ")"
					         console.log(sql)
			Pfile.increaseSql(sql,  function (err, inform) {
				if (err) {
					return res.status(500).send('Server error'+err.message)
				}
				res.redirect('/views/detail/zzdyjsq/cngl')
			})
		})	
})
//点子管理
router.get('/views/detail/zzdyjsq/dzgl', function(req, res){
	 var sql = 'SELECT * FROM inposition_idea';
	connection.query(sql,function (err,inform) {
	  if(err){
	    return callback(err);
	  }
	res.render('detail/zzdyjsq/dzgl.html', {
			inform: inform
		})
	})
})
//点子管理--------修改
router.get('/views/detail/zzdyjsq/dzgl-edit', async(req, res) => {
	var access_list = await get_accesslist(req);
	var aa = access_list.split(',');
    for(var i=0;i<aa.length;i++){
	    if(aa[i]=='64'){
		    var sql = 'SELECT * FROM inposition_idea where id =' + req.query.id;
	        Pfile.searchById(sql,parseInt(req.query.id), function (err, inform) {
		        if (err) {
			        return res.status(500).send('Server error'+err.message)
		        }
		        return res.render('detail/zzdyjsq/dzgl-edit.html', {
			        inform: inform
		        })
	        })
	        break
	    }else{
	        if(i == aa.length-1){
                return res.send("你没有此操作权限")
            }else{
                continue
            }
	    }
    }
})
router.post('/views/detail/zzdyjsq/dzgl-edit', function(req, res){
	var inform = req.body
	var editsql = "update inposition_idea set name =" +"\'" + inform.name + "\'"
	+ "," + "idea=" +"\'" + inform.idea + "\'"
	+ "," + "time=" +"\'" + inform.time + "\'"
	+" where id=" + inform.id;
//	console.log(editsql)
	Pfile.editById(editsql, function(err){
		if(err) {
			return res.status(500).send('Server error'+err.message)	
		}
		res.redirect('/views/detail/zzdyjsq/dzgl')
	})
})
//点子管理-----删除
router.get('/views/detail/zzdyjsq/dzgl-delete', async(req, res) => {
	var access_list = await get_accesslist(req);
	var aa = access_list.split(',');
    for(var i=0;i<aa.length;i++){
	    if(aa[i]=='65'){
	        var selectId = req.query.id.split(",")
		    var delsql = 'DELETE FROM inposition_idea where id ='
		    for(var i = 0; i < selectId.length; i++){
			    if(i == 0){
				    delsql += selectId[i]
			    } else {
				    delsql += " or id = " + selectId[i]
			    }
		    }
	        Pfile.deleteSql(delsql, req.query.id, function(err) {
		    if(err) {
			    return res.status(500).send('Server error'+err.message)
		    }
		    return res.redirect('/views/detail/zzdyjsq/dzgl')
	        })
	        break
	    }else{
	        if(i == aa.length-1){
                return res.send("你没有此操作权限")
            }else{
                continue
            }
	    }
	}
})
//点子管理-------查询
router.post('/views/detail/zzdyjsq/dzgl-search', function(req,res){
	var inform = req.body
	for(var key in inform){
		if(inform[key] == ''){
			delete inform[key]
		}
	}
	if(JSON.stringify(inform) == '{}'){
//		console.log('2333')
		res.redirect('/views/detail/zzdyjsq/dzgl')
		return
	}
//	console.log(inform)
	var sql = "select * from inposition_idea where " 
	var i = 0
	for(var key in inform){
		if (i == 0){
			sql +=  key + " like" + "\'"+"%"+inform[key]+"%"+"\'"
			i++
		} else {
			sql +="and " +key + " like" + "\'"+"%"+inform[key]+"%"+"\'"
		}
	}
	//console.log(sql)
	Pfile.selectSql(sql, function(err, inform) {
		if (err) {
			return res.status(500).send('Server error'+err.message)
		}
		res.render('detail/zzdyjsq/dzgl.html', {
			inform: inform
		})
	})
})
//电子管理-----审核通过
router.get('/views/detail/zzdyjsq/dzgl-examine', function(req, res){
//	var sql1='SELECT commen_userroleinf.loginAcc,commen_userpowerinfo.property,commen_userpowerinfo.people_ctrol FROM commen_userroleinf,commen_userpowerinfo  WHERE commen_userroleinf.property = commen_userpowerinfo.property and  commen_userroleinf.loginAcc='+"\'"+req.session.username+"\'"
//	console.log(sql1)
//	connection.query(sql1,function (err,result) {
//	  if(err){
//	    return err;
//	  }
//	  result=JSON.stringify(result)    //先将result转化为String类型的数据
//	  result=JSON.parse(result) 
// var aa=result[0].people_ctrol
//	aa.split(',')
//for(var i=0;i<aa.length;i++)
//{
//	if(aa[i]=='66')
//	{
		var people = req.query
	var editsql = "update inposition_idea set status =" +"\'" + "审核通过" + "\'"
	+"where id=" + people.id;
//console.log(people.id)
//console.log(editsql)/
	Pfile.editById(editsql, function(err){
		if(err) {
			return res.status(500).send('Server error'+err.message)	
		}
		return res.redirect('/views/detail/zzdyjsq/dzgl')
	})
//	}
//	else
//	{
//		return res.send("你没有此权限")
//	}
//}
//	})
})
//点子管理-----审核不通过
router.get('/views/detail/zzdyjsq/dzgl-examineOff', function(req, res){
	var people = req.query
	var editsql = "update inposition_idea set status =" +"\'" + "审核未通过" + "\'"
	+"where id=" + people.id;
//console.log(people.id)
//console.log(editsql)
	Pfile.editById(editsql, function(err){
		if(err) {
			return res.status(500).send('Server error'+err.message)	
		}
		res.redirect('/views/detail/zzdyjsq/dzgl')
	})
})
//点子管理-------新增
router.get('/views/detail/zzdyjsq/dzgl-new', async(req, res) => {
    var access_list = await get_accesslist(req);
	var aa = access_list.split(',');
	for(var i=0;i<aa.length;i++){
    	if(aa[i]=='64'){
    	    res.render('detail/zzdyjsq/dzgl-new.html')
    	    break
    	}else{
    	    if(i == aa.length-1){
                return res.send("你没有此操作权限")
            }else{
                continue
            }
    	}
    }
})
router.post('/views/detail/zzdyjsq/dzgl-new', function(req, res){
	//console.log(req.body)
	var inform=req.body
		var maxid = "select max(id) from inposition_idea"
//			console.log(maxid)
			connection.query(maxid,function (err,result) {
			  if(err){
			    return err;
			  }
			  result=JSON.stringify(result)    //先将result转化为String类型的数据
		  	  result=JSON.parse(result)
		  	  var ret = result[0]
			  var id = ret['max(id)'] + 1
	
			var sql = "insert into inposition_idea values("
					 + id  + ","
					  + "\'" + inform.name + "\'" + "," 
					   +"\'" + inform.idea + "\'" + ","	
					      + "\'" + "未审核"+ "\'"+"," 
					   +"\'" + inform.time+ "\'"+ ")"
//					         console.log(sql)
			Pfile.increaseSql(sql,  function (err, inform) {
				if (err) {
					return res.status(500).send('Server error'+err.message)
				}
				res.redirect('/views/detail/zzdyjsq/dzgl')
			})
		})	
})
//反应问题
router.get('/views/detail/zzdyjsq/fywt', function(req, res){
	var sql = 'SELECT * FROM inposition_reactive';
	connection.query(sql,function (err,inform) {
	  if(err){
	    return callback(err);
	  }
	res.render('detail/zzdyjsq/fywt.html', {
			inform: inform
		})
	})
})
//反映问题--------修改
router.get('/views/detail/zzdyjsq/fywt-edit', async(req, res) => {
	var access_list = await get_accesslist(req);
	var aa = access_list.split(',');
    for(var i=0;i<aa.length;i++){
	    if(aa[i]=='67'){
			var sql = 'SELECT * FROM inposition_reactive where id =' + req.query.id;
	        Pfile.searchById(sql,parseInt(req.query.id), function (err, inform) {
		        if (err) {
			        return res.status(500).send('Server error'+err.message)
		        }
		        return res.render('detail/zzdyjsq/fywt-edit.html', {
			        inform: inform
		        })
	        })
	        break
	    }else{
	        if(i == aa.length-1){
                return res.send("你没有此操作权限")
            }else{
                continue
            }
	    }
	}
})
router.post('/views/detail/zzdyjsq/fywt-edit', function(req, res){
	var inform = req.body
	var editsql = "update inposition_reactive set title =" +"\'" + inform.title + "\'"
	+ "," + "content=" +"\'" + inform.content + "\'"
	+ "," + "reply=" +"\'" + inform.reply + "\'"
	+ "," + "replyTime=" +"\'" + inform.replyTime + "\'"
	+ "," + "startTime=" +"\'" + inform.startTime + "\'"
	+ "," + "status=" +"\'" + inform.status + "\'"
	+" where id=" + inform.id;
//	console.log(editsql)
	Pfile.editById(editsql, function(err){
		if(err) {
			return res.status(500).send('Server error'+err.message)	
		}
		res.redirect('/views/detail/zzdyjsq/fywt')
	})
})
//反映问题-----删除
router.get('/views/detail/zzdyjsq/fywt-delete', async(req, res) => {
	var access_list = await get_accesslist(req);
	var aa = access_list.split(',');
	for(var i=0;i<aa.length;i++){
		if(aa[i]=='68'){
	        var selectId = req.query.id.split(",")
		    var delsql = 'DELETE FROM inposition_reactive where id ='
		    for(var i = 0; i < selectId.length; i++){
			    if(i == 0){
				    delsql += selectId[i]
			    } else {
				    delsql += " or id = " + selectId[i]
			    }
		    }
	        Pfile.deleteSql(delsql, req.query.id, function(err) {
		        if(err) {
			        return res.status(500).send('Server error'+err.message)
		        }
		        return res.redirect('/views/detail/zzdyjsq/fywt')
	        })
	        break
	    }else{
	        if(i == aa.length-1){
                return res.send("你没有此操作权限")
            }else{
                continue
            }
	    }
	}
})
//反映问题-------查询
router.post('/views/detail/zzdyjsq/fywt-search', function(req,res){
	var inform = req.body
	for(var key in inform){
		if(inform[key] == ''){
			delete inform[key]
		}
	}
	if(JSON.stringify(inform) == '{}'){
//		console.log('2333')
		res.redirect('/views/detail/zzdyjsq/fywt')
		return
	}
//	console.log(inform)
	var sql = "select * from inposition_reactive where " 
	var i = 0
	for(var key in inform){
		if (i == 0){
			sql +=  key + " like" + "\'"+"%"+inform[key]+"%"+"\'"
			i++
		} else {
			sql +="and " +key + " like" + "\'"+"%"+inform[key]+"%"+"\'"
		}
	}
	//console.log(sql)
	Pfile.selectSql(sql, function(err, inform) {
		if (err) {
			return res.status(500).send('Server error'+err.message)
		}
		res.render('detail/zzdyjsq/fywt.html', {
			inform: inform
		})
	})
})
//反映问题-------新增
router.get('/views/detail/zzdyjsq/fywt-new', async(req, res) => {
    var access_list = await get_accesslist(req);
	var aa = access_list.split(',');
	for(var i=0;i<aa.length;i++){
    	if(aa[i]=='67'){
	        res.render('detail/zzdyjsq/fywt-new.html')
	        break
	    }else{
	        if(i == aa.length-1){
                return res.send("你没有此操作权限")
            }else{
                continue
            }
	    }
	}
})
router.post('/views/detail/zzdyjsq/fywt-new', function(req, res){
	//console.log(req.body)
	var inform=req.body
		var maxid = "select max(id) from inposition_reactive"
			//console.log(maxid)
			connection.query(maxid,function (err,result) {
			  if(err){
			    return err;
			  }
			  result=JSON.stringify(result)    //先将result转化为String类型的数据
		  	  result=JSON.parse(result)
		  	  var ret = result[0]
			  var id = ret['max(id)'] + 1
	
			var sql = "insert into inposition_reactive values("
					 + id  + ","
					  + "\'" + inform.title + "\'" + "," 
					   +"\'" + inform.content + "\'" + ","	
					      + "\'" + inform.reply+ "\'"+"," 
					   +"\'" + inform.replyTime+ "\'" + "," 
					   + "\'" + inform.startTime + "\'" + ","
					         + "\'" + inform.status+ "\'"+ ")"
//					         console.log(sql)
			Pfile.increaseSql(sql,  function (err, inform) {
				if (err) {
					return res.status(500).send('Server error'+err.message)
				}
				res.redirect('/views/detail/zzdyjsq/fywt')
			})
		})	
})
/*
 * 问题汇总
 */
//督察问题
router.get('/views/detail/wthz/dcwt', function(req, res){
	var sql = 'SELECT * FROM vitalproblem_supervise_problem';
	connection.query(sql,function (err,inform) {
	  if(err){
	    return callback(err);
	  }
	res.render('detail/wthz/dcwt.html', {
			inform: inform
		})
	})
})
//督察问题-------目录树
router.get('/views/detail/wthz/dcwt-tree', function(req, res){
	var sql = 'SELECT * FROM vitalproblem_supervise_problem where institution =' + "\'" + req.query.name + "\'";
	//console.log(sql)
	//onsole.log(sql)
	Pfile.searchFile(sql, function(err, inform){
		if(err){
			return res.status(500).send('Servor error'+err.message)
		}
		inform=JSON.stringify(inform)    //先将result转化为String类型的数据
		  	  inform=JSON.parse(inform)
//		  	  console.log(inform)
		res.render('detail/wthz/dcwt.html',{
			inform:inform
		})
	})
})
//督察问题--------修改
router.get('/views/detail/wthz/dcwt-edit', async(req, res) => {
    var access_list = await get_accesslist(req);
    var aa = access_list.split(',');
    for(var i=0;i<aa.length;i++){
    	if(aa[i]=='70'){
    	    var sql = 'SELECT * FROM vitalproblem_supervise_problem where id =' + req.query.id;
        	Pfile.searchById(sql,parseInt(req.query.id), function (err, inform) {
        	if (err) {
        		return res.status(500).send('Server error'+err.message)
        	}
        	res.render('detail/wthz/dcwt-edit.html', {
        		inform: inform
        	})
        	})
        	break
    	}else{
		    if(i == aa.length-1){
        		return res.send("你没有此操作权限")
        	}else{
        		continue
        	}
    	}
    }
})
router.post('/views/detail/wthz/dcwt-edit', function(req, res){
	var inform = req.body
	var editsql = "update vitalproblem_supervise_problem set category =" +"\'" + inform.category + "\'"
	+ "," + "question=" +"\'" + inform.question + "\'"
	+ "," + "deadline=" +"\'" + inform.deadline + "\'"
	+ "," + "meCondition=" +"\'" + inform.meCondition + "\'"
	+ "," + "measure=" +"\'" + inform.measure + "\'"
	+ "," + "chargePerson=" +"\'" + inform.chargePerson + "\'"
	+ "," + "checkTime=" +"\'" + inform.checkTime + "\'"
	+ "," + "institution=" +"\'" + inform.institution + "\'"
	+" where id=" + inform.id;
//	console.log(editsql)
	Pfile.editById(editsql, function(err){
		if(err) {
			return res.status(500).send('Server error'+err.message)	
		}
		res.redirect('/views/detail/wthz/dcwt')
	})
})
//督察问题-----删除
router.get('/views/detail/wthz/dcwt-delete', async(req, res) => {
	var access_list = await get_accesslist(req);
    var aa = access_list.split(',');
    for(var i=0;i<aa.length;i++){
    	if(aa[i]=='71'){
    	    var selectId = req.query.id.split(",")
            var delsql = 'DELETE FROM vitalproblem_supervise_problem where id ='
            for(var i = 0; i < selectId.length; i++){
                if(i == 0){
            	    delsql += selectId[i]
                } else {
            	    delsql += " or id = " + selectId[i]
                }
           	}
            Pfile.deleteSql(delsql, req.query.id, function(err) {
            	if(err) {
            		return res.status(500).send('Server error'+err.message)
            	}
            	res.redirect('/views/detail/wthz/dcwt')
            })
            break
    	}else{
    	    if(i == aa.length-1){
                return res.send("你没有此操作权限")
            }else{
                continue
            }
    	}
    }
})
//督察问题-------查询
router.post('/views/detail/wthz/dcwt-search', function(req,res){
	var inform = req.body
	for(var key in inform){
		if(inform[key] == ''){
			delete inform[key]
		}
	}
	if(JSON.stringify(inform) == '{}'){
//		console.log('2333')
		res.redirect('/views/detail/wthz/dcwt')
		return
	}
//	console.log(inform)
	var sql = "select * from vitalproblem_supervise_problem where " 
	var i = 0
	for(var key in inform){
		if (i == 0){
			sql += key + " like" + "\'"+"%"+inform[key]+"%"+"\'"
			i++
		} else {
			sql += "and " + key + " like" + "\'"+"%"+inform[key]+"%"+"\'"
		}
	}
	//console.log(sql)
	Pfile.selectSql(sql, function(err, inform) {
		if (err) {
			return res.status(500).send('Server error'+err.message)
		}
		res.render('detail/wthz/dcwt.html', {
			inform: inform
		})
	})
})
//督察问题-----审核通过
router.get('/views/detail/wthz/dcwt-examine', function(req, res){
	var people = req.query
	var editsql = "update vitalproblem_supervise_problem set status =" +"\'" + "已通过" + "\'"
	+"where id=" + people.id;
//console.log(people.id)
//console.log(editsql)
	Pfile.editById(editsql, function(err){
		if(err) {
			return res.status(500).send('Server error'+err.message)	
		}
		res.redirect('/views/detail/wthz/dcwt')
	})
})
//督察问题-----审核没通过
router.get('/views/detail/wthz/dcwt-examineOff', function(req, res){
	var people = req.query
	var editsql = "update vitalproblem_supervise_problem set status =" +"\'" + "未通过" + "\'"
	+"where id=" + people.id;
//console.log(people.id)
//console.log(editsql)
	Pfile.editById(editsql, function(err){
		if(err) {
			return res.status(500).send('Server error'+err.message)	
		}
		res.redirect('/views/detail/wthz/dcwt')
	})
})
//督察问题-------新增
router.get('/views/detail/wthz/dcwt-new', async(req, res) => {
    var access_list = await get_accesslist(req);
    var aa = access_list.split(',');
    for(var i=0;i<aa.length;i++){
    	if(aa[i]=='69'){
    	    res.render('detail/wthz/dcwt-new.html')
    	    break
    	}else{
    	    if(i == aa.length-1){
                return res.send("你没有此操作权限")
            }else{
                continue
            }
    	}
    }
})
router.post('/views/detail/wthz/dcwt-new', function(req, res){
	//console.log(req.body)
	var inform=req.body
		var maxid = "select max(id) from vitalproblem_supervise_problem"
			//console.log(maxid)
			connection.query(maxid,function (err,result) {
			  if(err){
			    return err;
			  }
			  result=JSON.stringify(result)    //先将result转化为String类型的数据
		  	  result=JSON.parse(result)
		  	  var ret = result[0]
			  var id = ret['max(id)'] + 1
	
			var sql = "insert into vitalproblem_supervise_problem values("
					 + id  + ","
					  + "\'" + inform.category + "\'" + "," 
					   +"\'" + inform.question + "\'" + ","	
					      + "\'" + inform.deadline+ "\'"+"," 
					      +"\'" + inform.measure+ "\'" + "," 
					   +"\'" + inform.meCondition+ "\'" + "," 
					   + "\'" + inform.chargePerson + "\'" + ","
					    + "\'" + inform.checkTime + "\'" +  ","
					    + "\'" + inform.institution + "\'" +  ","
					      + "\'" + "已受理"+ "\'"+ ")"
					         console.log(sql)
			Pfile.increaseSql(sql,  function (err, inform) {
				if (err) {
					return res.status(500).send('Server error'+err.message)
				}
				res.redirect('/views/detail/wthz/dcwt')
			})
		})	
})
//指标变更
router.get('/views/detail/wthz/zbbg', function(req, res){
	var sql = 'SELECT * FROM vitalproblem_indexchange';
	connection.query(sql,function (err,inform) {
	  if(err){
	    return callback(err);
	  }
	res.render('detail/wthz/zbbg.html', {
			inform: inform
		})
	})
})
//指标变更--------修改
router.get('/views/detail/wthz/zbbg-edit', async(req, res) => {
    var access_list = await get_accesslist(req);
	var aa = access_list.split(',');
    for(var i=0;i<aa.length;i++){
 	    if(aa[i]=='74'){
 		    var sql = 'SELECT * FROM vitalproblem_indexchange where id =' + req.query.id;
	        Pfile.searchById(sql,parseInt(req.query.id), function (err, inform) {
		    if (err) {
			    return res.status(500).send('Server error'+err.message)
		    }
		    return res.render('detail/wthz/zbbg-edit.html', {
			    inform: inform
		    })
	        })
	        break
	    }else{
	        if(i == aa.length-1){
                return res.send("你没有此操作权限")
            }else{
                continue
            }
	    }
	}
})
router.post('/views/detail/wthz/zbbg-edit', function(req, res){
	var inform = req.body
	var editsql = "update vitalproblem_indexchange set organizeName =" +"\'" + inform.organizeName + "\'"
	+ "," + "changeName=" +"\'" + inform.changeName + "\'"
	+ "," + "status=" +"\'" + inform.status + "\'"
	+" where id=" + inform.id;
//	console.log(editsql)
	Pfile.editById(editsql, function(err){
		if(err) {
			return res.status(500).send('Server error'+err.message)	
		}
		res.redirect('/views/detail/wthz/zbbg')
	})
})
//指标变更-----删除
router.get('/views/detail/wthz/zbbg-delete', async(req, res) => {
    var access_list = await get_accesslist(req);
	var aa = access_list.split(',')
    for(var i=0;i<aa.length;i++){
	    if(aa[i]=='75'){
	        var selectId = req.query.id.split(",")
		    var delsql = 'DELETE FROM vitalproblem_indexchange where id ='
		    for(var i = 0; i < selectId.length; i++){
			    if(i == 0){
				    delsql += selectId[i]
			    } else {
				    delsql += " or id = " + selectId[i]
			    }
		    }
	        Pfile.deleteSql(delsql, req.query.id, function(err) {
		    if(err) {
			    return res.status(500).send('Server error'+err.message)
		    }
		    return res.redirect('/views/detail/wthz/zbbg')
	        })
	        break
	    }else{
	        if(i == aa.length-1){
                return res.send("你没有此操作权限")
            }else{
                continue
            }
	    }
	}
})
//指标变更-------目录树
router.get('/views/detail/wthz/zbbg-tree', function(req, res){
	var sql = 'SELECT * FROM vitalproblem_indexchange where institution =' + "\'" + req.query.name + "\'";
	//console.log(sql)
	//onsole.log(sql)
	Pfile.searchFile(sql, function(err, inform){
		if(err){
			return res.status(500).send('Servor error'+err.message)
		}
		inform=JSON.stringify(inform)    //先将result转化为String类型的数据
		  	  inform=JSON.parse(inform)
//		  	  console.log(inform)
		res.render('detail/wthz/zbbg.html',{
			inform:inform
		})
	})
})
//指标变更-------查询
router.post('/views/detail/wthz/zbbg-search', function(req,res) {
    var inform = req.body
	for(var key in inform){
		if(inform[key] == ''){
			delete inform[key]
		}
	}
	if(JSON.stringify(inform) == '{}'){
		res.redirect('/views/detail/wthz/zbbg')
		return
	}
	var sql = "select * from vitalproblem_indexchange where "
	var i = 0
	for(var key in inform){
	if (i == 0){
		sql += key + " like" + "\'"+"%"+inform[key]+"%"+"\'"
		i++
	} else {
		sql += "and " + key + " like" + "\'"+"%"+inform[key]+"%"+"\'"
	}
	}
	Pfile.selectSql(sql, function(err, inform) {
		if (err) {
			return res.status(500).send('Server error'+err.message)
		}
		res.render('detail/wthz/zbbg.html', {
			inform: inform
		})
	})
})
//指标扁钢-----审核通过
router.get('/views/detail/wthz/zbbg-examine', function(req, res){
	var people = req.query
	var editsql = "update vitalproblem_indexchange set status =" +"\'" + "已通过" + "\'"
	+"where id=" + people.id;
//console.log(people.id)
//console.log(editsql)
	Pfile.editById(editsql, function(err){
		if(err) {
			return res.status(500).send('Server error'+err.message)	
		}
		res.redirect('/views/detail/wthz/zbbg')
	})
})
//指标扁钢-----审核没通过
router.get('/views/detail/wthz/zbbg-examineOff', function(req, res){
	var people = req.query
	var editsql = "update vitalproblem_indexchange set status =" +"\'" + "未通过" + "\'"
	+"where id=" + people.id;
//console.log(people.id)
//console.log(editsql)
	Pfile.editById(editsql, function(err){
		if(err) {
			return res.status(500).send('Server error'+err.message)	
		}
		res.redirect('/views/detail/wthz/zbbg')
	})
})
//指标变更-------新增
router.get('/views/detail/wthz/zbbg-new', async (req, res) => {
    var access_list = await get_accesslist(req);
    var aa = access_list.split(',');
    for(var i=0;i<aa.length;i++){
    	if(aa[i]=='73'){
	        res.render('detail/wthz/zbbg-new.html')
	        break
	    }else{
	        if(i == aa.length-1){
                return res.send("你没有此操作权限")
            }else{
                continue
            }
	    }
	}
})
router.post('/views/detail/wthz/zbbg-new', function(req, res){
//	var sql1='SELECT commen_userroleinf.loginAcc,commen_userpowerinfo.property,commen_userpowerinfo.people_ctrol FROM commen_userroleinf,commen_userpowerinfo  WHERE commen_userroleinf.property = commen_userpowerinfo.property and  commen_userroleinf.loginAcc='+"\'"+req.session.username+"\'"
//	console.log(sql1)
//	connection.query(sql1,function (err,result) {
//	  if(err){
//	    return err;
//	  }
//	  result=JSON.stringify(result)    //先将result转化为String类型的数据
//	  result=JSON.parse(result) 
// var aa=result[0].people_ctrol
//	aa.split(',')
//for(var i=0;i<aa.length;i++)
//{
//	if(aa[i]=='73')
//	{
//		//console.log(req.body)
	var inform=req.body
		var maxid = "select max(id) from vitalproblem_indexchange"
			//console.log(maxid)
			connection.query(maxid,function (err,result) {
			  if(err){
			    return err;
			  }
			  result=JSON.stringify(result)    //先将result转化为String类型的数据
		  	  result=JSON.parse(result)
		  	  var ret = result[0]
			  var id = ret['max(id)'] + 1
	
			var sql = "insert into vitalproblem_indexchange values("
					 + id  + ","
					  + "\'" + inform.organizeName + "\'" + "," 
					   +"\'" + inform.changeName + "\'" + ","
					         + "\'" + "未审核"+ "\'"+ ")"
//					         console.log(sql)
			Pfile.increaseSql(sql,  function (err, inform) {
				if (err) {
					return res.status(500).send('Server error'+err.message)
				}
				return res.redirect('/views/detail/wthz/zbbg')
			})
		})	
//  }
//	else
//	{
//		return res.send("你没有此权限")
//	}
//}
//	})
})
//指标销号
router.get('/views/detail/wthz/zbxh', function(req, res){
	var sql = 'SELECT * FROM vitalproblem_indexdie';
	connection.query(sql,function (err,inform) {
	  if(err){
	    return callback(err);
	  }
	res.render('detail/wthz/zbxh.html', {
			inform: inform
		})
	})
})
//指标销号--------修改
router.get('/views/detail/wthz/zbxh-edit', async(req, res) => {
	var access_list = await get_accesslist(req);
	var aa = access_list.split(',');
    for(var i=0;i<aa.length;i++){
	    if(aa[i]=='77'){
		    var sql = 'SELECT * FROM vitalproblem_indexdie where id =' + req.query.id;
	        Pfile.searchById(sql,parseInt(req.query.id), function (err, inform) {
		        if (err) {
			        return res.status(500).send('Server error'+err.message)
		        }
		    return res.render('detail/wthz/zbxh-edit.html', {
			    inform: inform
		    })
	        })
	        break
	    }else{
	        if(i == aa.length-1){
                return res.send("你没有此操作权限")
            }else{
                continue
            }
	    }
	}
})
router.post('/views/detail/wthz/zbxh-edit', function(req, res){
	var inform = req.body
	var editsql = "update vitalproblem_indexdie set organizeName =" +"\'" + inform.organizeName + "\'"
	+ "," + "changeName=" +"\'" + inform.changeName + "\'"
	+ "," + "status=" +"\'" + inform.status + "\'"
	+" where id=" + inform.id;
//	console.log(editsql)
	Pfile.editById(editsql, function(err){
		if(err) {
			return res.status(500).send('Server error'+err.message)	
		}
		res.redirect('/views/detail/wthz/zbxh')
	})
})
//指标销号-----删除
router.get('/views/detail/wthz/zbxh-delete', async(req, res) => {
    var access_list = await get_accesslist(req);
	var aa = access_list.split(',');
    for(var i=0;i<aa.length;i++){
	    if(aa[i]=='78'){
	        var selectId = req.query.id.split(",")
		    var delsql = 'DELETE FROM vitalproblem_indexdie where id ='
		    for(var i = 0; i < selectId.length; i++){
			    if(i == 0){
				    delsql += selectId[i]
			    } else {
				    delsql += " or id = " + selectId[i]
			    }
		    }
	    Pfile.deleteSql(delsql, req.query.id, function(err) {
		    if(err) {
			    return res.status(500).send('Server error'+err.message)
		    }
		    return res.redirect('/views/detail/wthz/zbxh')
	    })
	    break
	    }else{
	        if(i == aa.length-1){
                return res.send("你没有此操作权限")
            }else{
                continue
            }
	    }
	}
})

//指标销号-------目录树
router.get('/views/detail/wthz/zbxh-tree', function(req, res){
	var sql = 'SELECT * FROM vitalproblem_indexdie where organizeName =' + "\'" + req.query.name + "\'";
	//console.log(sql)
	//onsole.log(sql)
	Pfile.searchFile(sql, function(err, inform){
		if(err){
			return res.status(500).send('Servor error'+err.message)
		}
		inform=JSON.stringify(inform)    //先将result转化为String类型的数据
		  	  inform=JSON.parse(inform)
//		  	  console.log(inform)
		res.render('detail/wthz/zbxh.html',{
			inform:inform
		})
	})
})
//指标销号-------查询
router.post('/views/detail/wthz/zbxh-search', function(req,res){
	var inform = req.body
	for(var key in inform){
		if(inform[key] == ''){
			delete inform[key]
		}
	}
	if(JSON.stringify(inform) == '{}'){
//		console.log('2333')
		res.redirect('/views/detail/wthz/zbxh')
		return
	}
//	console.log(inform)
	var sql = "select * from vitalproblem_indexdie where " 
	var i = 0
	for(var key in inform){
		if (i == 0){
			sql += key + " like" + "\'"+"%"+inform[key]+"%"+"\'"
			i++
		} else {
			sql += "and " + key + " like" + "\'"+"%"+inform[key]+"%"+"\'"
		}
	}
//	console.log(sql)
	Pfile.selectSql(sql, function(err, inform) {
		if (err) {
			return res.status(500).send('Server error'+err.message)
		}
		res.render('detail/wthz/zbxh.html', {
			inform: inform
		})
	})
})
//指标销号-----审核
router.get('/views/detail/wthz/zbxh-examine', function(req, res){
	var people = req.query
	var editsql = "update vitalproblem_indexdie set status =" +"\'" + "已通过" + "\'"
	+"where id=" + people.id;
//console.log(people.id)
//console.log(editsql)
	Pfile.editById(editsql, function(err){
		if(err) {
			return res.status(500).send('Server error'+err.message)	
		}
		res.redirect('/views/detail/wthz/zbxh')
	})
})
//指标销号-----审核未通过
router.get('/views/detail/wthz/zbxh-examineOff', function(req, res){
	var people = req.query
	var editsql = "update vitalproblem_indexdie set status =" +"\'" + "未通过" + "\'"
	+"where id=" + people.id;
//console.log(people.id)
//console.log(editsql)
	Pfile.editById(editsql, function(err){
		if(err) {
			return res.status(500).send('Server error'+err.message)	
		}
		res.redirect('/views/detail/wthz/zbxh')
	})
})
//指标销号-------新增
router.get('/views/detail/wthz/zbxh-new', async(req, res) => {
    var access_list = await get_accesslist(req);
    var aa = access_list.split(',');
    for(var i=0;i<aa.length;i++){
    	if(aa[i]=='76'){
    	    res.render('detail/wthz/zbxh-new.html')
    	    break
    	}else{
    	    if(i == aa.length-1){
                return res.send("你没有此操作权限")
            }else{
                continue
            }
    	}
    }
})
router.post('/views/detail/wthz/zbxh-new', function(req, res){
//	var sql1='SELECT commen_userroleinf.loginAcc,commen_userpowerinfo.property,commen_userpowerinfo.people_ctrol FROM commen_userroleinf,commen_userpowerinfo  WHERE commen_userroleinf.property = commen_userpowerinfo.property and  commen_userroleinf.loginAcc='+"\'"+req.session.username+"\'"
//	console.log(sql1)
//	connection.query(sql1,function (err,result) {
//	  if(err){
//	    return err;
//	  }
//	  result=JSON.stringify(result)    //先将result转化为String类型的数据
//	  result=JSON.parse(result) 
// var aa=result[0].people_ctrol
//	aa.split(',')
//for(var i=0;i<aa.length;i++)
//{
//	if(aa[i]=='76')
//	{
		//console.log(req.body)
	var inform=req.body
		var maxid = "select max(id) from vitalproblem_indexdie"
			//console.log(maxid)
			connection.query(maxid,function (err,result) {
			  if(err){
			    return err;
			  }
			  result=JSON.stringify(result)    //先将result转化为String类型的数据
		  	  result=JSON.parse(result)
		  	  var ret = result[0]
			  var id = ret['max(id)'] + 1
	
			var sql = "insert into vitalproblem_indexdie values("
					 + id  + ","
					  + "\'" + inform.organizeName + "\'" + "," 
					   +"\'" + inform.changeName + "\'" + ","
					         + "\'" +  "未审核"+ "\'"+ ")"
//					         console.log(sql)
			Pfile.increaseSql(sql,  function (err, inform) {
				if (err) {
					return res.status(500).send('Server error'+err.message)
				}
				return res.redirect('/views/detail/wthz/zbxh')
			})
		})	
//	}
//	else
//	{
//		return res.send("你没有此权限")
//	}
//}
//	})
})
//预警督办
router.get('/views/detail/wthz/yjdb', function(req, res){
	var sql = 'SELECT * FROM vitalproblem_predit';
	connection.query(sql,function (err,inform) {
	  if(err){
	    return callback(err);
	  }
	res.render('detail/wthz/yjdb.html', {
			inform: inform
		})
	})
})
//预警督办--------修改
router.get('/views/detail/wthz/yjdb-edit', async(req, res) => {
	var access_list = await get_accesslist(req);
	var aa = access_list.split(',');
    for (var i=0;i<aa.length;i++){
        if(aa[i]=='80'){
	        var sql = 'SELECT * FROM vitalproblem_predit where id =' + req.query.id;
	        Pfile.searchById(sql,parseInt(req.query.id), function (err, inform) {
		    if (err) {
			    return res.status(500).send('Server error'+err.message)
		    }
		    return res.render('detail/wthz/yjdb-edit.html', {
			    inform: inform
		    })
	        })
	        break
	    }else{
	        if(i == aa.length-1){
                return res.send("你没有此操作权限")
            }else{
                continue
            }
	    }
	}
})
router.post('/views/detail/wthz/yjdb-edit', function(req, res){
	var inform = req.body
	var editsql = "update vitalproblem_predit set examine =" +"\'" + inform.examine + "\'"
	+ "," + "category=" +"\'" + inform.category + "\'"
	+ "," + "content=" +"\'" + inform.content + "\'"
	+ "," + "checkTime=" +"\'" + inform.checkTime	 + "\'"
	+ "," + "deadLine=" +"\'" + inform.deadLine + "\'"
	+ "," + "chargePerson=" +"\'" + inform.chargePerson + "\'"
	+ "," + "measure=" +"\'" + inform.measure + "\'"
	+ "," + "changeData=" +"\'" + inform.changeData + "\'"
	+" where id=" + inform.id;
//	console.log(editsql)
	Pfile.editById(editsql, function(err){
		if(err) {
			return res.status(500).send('Server error'+err.message)	
		}
		res.redirect('/views/detail/wthz/yjdb')
	})
})
//预警督办-----删除
router.get('/views/detail/wthz/yjdb-delete', async(req, res) => {
	var access_list = await get_accesslist(req);
	var aa = access_list.split(',');
	for(var i=0;i<aa.length;i++){
		if(aa[i]=='81'){
	        var selectId = req.query.id.split(",")
		    var delsql = 'DELETE FROM vitalproblem_predit where id ='
		    for(var i = 0; i < selectId.length; i++){
			    if(i == 0){
				    delsql += selectId[i]
			    } else {
				    delsql += " or id = " + selectId[i]
			    }
		    }
	        Pfile.deleteSql(delsql, req.query.id, function(err) {
		        if(err) {
			        return res.status(500).send('Server error'+err.message)
		        }
		        return res.redirect('/views/detail/wthz/yjdb')
	        })
	        break
        }else{
            if(i==aa.length-1){
                return res.send("你没有此操作权限")
            }else{
                continue
            }
        }
    }
})
//预警督办-------目录树
router.get('/views/detail/wthz/yjdb-tree', function(req, res){
	var sql = 'SELECT * FROM vitalproblem_predit where organizeName =' + "\'" + req.query.name + "\'";
	//console.log(sql)
	//onsole.log(sql)
	Pfile.searchFile(sql, function(err, inform){
		if(err){
			return res.status(500).send('Servor error'+err.message)
		}
		inform=JSON.stringify(inform)    //先将result转化为String类型的数据
		  	  inform=JSON.parse(inform)
//		  	  console.log(inform)
		res.render('detail/wthz/yjdb.html',{
			inform:inform
		})
	})
})
//预警督办-------查询
router.post('/views/detail/wthz/yjdb-search', function(req,res){
	var inform = req.body
	for(var key in inform){
		if(inform[key] == ''){
			delete inform[key]
		}
	}
	if(JSON.stringify(inform) == '{}'){
//		console.log('2333')
		res.redirect('/views/detail/wthz/yjdb')
		return
	}
//	console.log(inform)
	var sql = "select * from vitalproblem_predit where " 
	var i = 0
	for(var key in inform){
		if (i == 0){
			sql += key + " like" + "\'"+"%"+inform[key]+"%"+"\'"
			i++
		} else {
			sql += "and " + key + " like" + "\'"+"%"+inform[key]+"%"+"\'"
		}
	}
	//console.log(sql)
	Pfile.selectSql(sql, function(err, inform) {
		if (err) {
			return res.status(500).send('Server error'+err.message)
		}
		res.render('detail/wthz/yjdb.html', {
			inform: inform
		})
	})
})
//预警督办-----审核
router.get('/views/detail/wthz/yjdb-examine', function(req, res){
//	var sql1='SELECT commen_userroleinf.loginAcc,commen_userpowerinfo.property,commen_userpowerinfo.people_ctrol FROM commen_userroleinf,commen_userpowerinfo  WHERE commen_userroleinf.property = commen_userpowerinfo.property and  commen_userroleinf.loginAcc='+"\'"+req.session.username+"\'"
//	console.log(sql1)
//	connection.query(sql1,function (err,result) {
//	  if(err){
//	    return err;
//	  }
//	  result=JSON.stringify(result)    //先将result转化为String类型的数据
//	  result=JSON.parse(result) 
// var aa=result[0].people_ctrol
//	aa.split(',')
//	for(var i=0;i<aa.length;i++)
//	{
//		if(aa[i]=='82')
//		{
			var people = req.query
	var editsql = "update vitalproblem_predit set status =" +"\'" + "已通过" + "\'"
	+"where id=" + people.id;
//console.log(people.id)
//console.log(editsql)
	Pfile.editById(editsql, function(err){
		if(err) {
			return res.status(500).send('Server error'+err.message)	
		}
		return res.redirect('/views/detail/wthz/yjdb')
	})
//		}
//		else
//		{
//			return res.send("你没有此权限")
//		}
//	}
//	})
})
//预警督办-----审核没通过
router.get('/views/detail/wthz/yjdb-examineOff', function(req, res){
	var people = req.query
	var editsql = "update vitalproblem_predit set status =" +"\'" + "未通过" + "\'"
	+"where id=" + people.id;
//console.log(people.id)
//console.log(editsql)
	Pfile.editById(editsql, function(err){
		if(err) {
			return res.status(500).send('Server error'+err.message)	
		}
		res.redirect('/views/detail/wthz/yjdb')
	})
})
//预警督办-------新增
router.get('/views/detail/wthz/yjdb-new', async(req, res) => {
    var access_list = await get_accesslist(req);
    var aa = access_list.split(',');
    for(var i=0;i<aa.length;i++){
    	if(aa[i]=='79'){
	        res.render('detail/wthz/yjdb-new.html')
	        break
	    }else{
	        if(i == aa.length-1){
                return res.send("你没有此操作权限")
            }else{
                continue
            }
	    }
	}
})
router.post('/views/detail/wthz/yjdb-new', function(req, res){
//	var sql1='SELECT commen_userroleinf.loginAcc,commen_userpowerinfo.property,commen_userpowerinfo.people_ctrol FROM commen_userroleinf,commen_userpowerinfo  WHERE commen_userroleinf.property = commen_userpowerinfo.property and  commen_userroleinf.loginAcc='+"\'"+req.session.username+"\'"
//	console.log(sql1)
//	connection.query(sql1,function (err,result) {
//	  if(err){
//	    return err;
//	  }
//	  result=JSON.stringify(result)    //先将result转化为String类型的数据
//	  result=JSON.parse(result) 
// var aa=result[0].people_ctrol
//	aa.split(',')
//	for(var i=0;i<aa.length;i++)
//	{
//		if(aa[i]=='79')
//		{
			//console.log(req.body)
	var inform=req.body
		var maxid = "select max(id) from vitalproblem_predit"
			//console.log(maxid)
			connection.query(maxid,function (err,result) {
			  if(err){
			    return err;
			  }
			  result=JSON.stringify(result)    //先将result转化为String类型的数据
		  	  result=JSON.parse(result)
		  	  var ret = result[0]
			  var id = ret['max(id)'] + 1
	
			var sql = "insert into vitalproblem_predit values("
					 + id  + ","
					  + "\'" + inform.organizeName + "\'" + "," 
					   +"\'" + inform.category + "\'" + ","
					    +"\'" + inform.content + "\'" + ","
					     +"\'" + inform.checkTime + "\'" + ","
					      +"\'" + inform.deadLine + "\'" + ","
					       +"\'" + inform.chargePerson + "\'" + ","
					        +"\'" + inform.measure + "\'" + ","
					        +"\'" + inform.changeData + "\'" + ","
					        +"\'" + inform.examine + "\'" + ","
					         + "\'" + "未审核"+ "\'"+ ")"
//					         console.log(sql)
			Pfile.increaseSql(sql,  function (err, inform) {
				if (err) {
					return res.status(500).send('Server error'+err.message)
				}
				return res.redirect('/views/detail/wthz/yjdb')
			})
		})	
//		}
//		else
//		{
//			return res.send("你没有此权限")
//		}
//	}
//	})	
})
/*
 * 党费收缴
 */
//党费收缴
router.get('/views/detail/dfsj/dfsj', function(req, res){
	var sql = 'SELECT * FROM people_information';
	connection.query(sql,function (err,inform) {
	  if(err){
	    return callback(err);
	  }
	res.render('detail/dfsj/dfsj.html', {
			inform: inform
		})
	})
})
//党费收缴-------缴费记录
router.get('/views/detail/dfsj/dfsj-jfjl', function(req, res){
	var sql = 'SELECT * FROM fee_collection';
	connection.query(sql,function (err,inform) {
	  if(err){
	    return err
	  }
	res.render('detail/dfsj/dfsj-jfjl.html', {
			inform: inform
		})
	})
})
//党费收缴--------修改
router.get('/views/detail/dfsj/dfsj-edit', function(req, res){
	var sql = 'SELECT * FROM fee_collection where id =' + req.query.id;
	Pfile.searchById(sql,parseInt(req.query.id), function (err, inform) {
		if (err) {
			return res.status(500).send('Server error'+err.message)
		}
		res.render('detail/dfsj/dfsj-edit.html', {
			inform: inform 
		})
	})
})
router.post('/views/detail/dfsj/dfsj-edit', function(req, res){
	var inform = req.body
	console.log(inform)
	var editsql = "update fee_collection set name =" +"\'" + inform.name + "\'"
	+ "," + "idCardNum=" +"\'" + inform.idCardNum + "\'"
	+ "," + "payMonth=" +"\'" + inform.payMonth + "\'"
	+ "," + "amount=" +"\'" + inform.amount	 + "\'"
	+ "," + "source=" +"\'" + inform.source + "\'"
	+ "," + "status=" +"\'" + inform.status + "\'"
	+ "," + "payTime=" +"\'" + inform.payTime + "\'"
	+ "," + "enterTime=" +"\'" + inform.enterTime + "\'"
	+" where id=" + inform.id;
//	console.log(editsql)
	Pfile.editById(editsql, function(err){
		if(err) {
			return res.status(500).send('Server error'+err.message)	
		}
		res.redirect('/views/detail/dfsj/dfsj-jfjl')
	})
})
//党费收缴-------目录树
router.get('/views/detail/dfsj/dfsj-tree', function(req, res){
	var sql = 'SELECT * FROM people_information where belongorganazation =' + "\'" + req.query.name + "\'";
//	console.log(sql)
	//onsole.log(sql)
	Pfile.searchFile(sql, function(err, inform){
		if(err){
			return res.status(500).send('Servor error'+err.message)
		}
		inform=JSON.stringify(inform)    //先将result转化为String类型的数据
		  	  inform=JSON.parse(inform)
//		  	  console.log(inform)
		res.render('detail/dfsj/dfsj.html',{
			inform:inform
		})
	})
})
//党费收缴-------查询
router.post('/views/detail/dfsj/dfsj-search', function(req,res){
	var inform = req.body
	for(var key in inform){
		if(inform[key] == ''){
			delete inform[key]
		}
	}
	if(JSON.stringify(inform) == '{}'){
//		console.log('2333')
		res.redirect('/views/detail/dfsj/dfsj')
		return
	}
//	console.log(inform)
	var sql = "select * from people_information where " 
	var i = 0
	for(var key in inform){
		if (i == 0){
			sql += key + " like" + "\'"+"%"+inform[key]+"%"+"\'"
			i++
		} else {
			sql += "and " + key + " like" + "\'"+"%"+inform[key]+"%"+"\'"
		}
	}
//	console.log(sql)
	Pfile.selectSql(sql, function(err, inform) {
		if (err) {
			return res.status(500).send('Server error'+err.message)
		}
		res.render('detail/dfsj/dfsj.html', {
			inform: inform 
		})
	})
})
//党费收缴-----删除
router.get('/views/detail/dfsj/dfsj-delete', function(req, res){
	var selectId = req.query.id.split(",")
		var delsql = 'DELETE FROM fee_collection where id ='
		for(var i = 0; i < selectId.length; i++){
			if(i == 0){
				delsql += selectId[i]
			} else {
				delsql += " or id = " + selectId[i]
			}
		}
//	console.log(delsql)
	Pfile.deleteSql(delsql, req.query.id, function(err) {
		if(err) {
			return res.status(500).send('Server error'+err.message)	
		}
		res.redirect('/views/detail/dfsj/dfsj-jfjl')
	})
})
//党费收缴-------增加缴费记录
router.get('/views/detail/dfsj/dfsj-new', function(req, res) {
	var sql = 'SELECT * FROM people_information where id =' + req.query.id;
	Pfile.searchById(sql,parseInt(req.query.id), function (err, inform) {
		if (err) {
			return res.status(500).send('Server error'+err.message)
		}
		res.render('detail/dfsj/dfsj-new.html', {
			inform: inform 
		})
	})
})
router.post('/views/detail/dfsj/dfsj-new', function(req, res){
	//console.log(req.body)
	var inform=req.body
		var maxid = "select max(id) from fee_collection"
			//console.log(maxid)
			connection.query(maxid,function (err,result) {
			  if(err){
			    return err;
			  }
			  result=JSON.stringify(result)    //先将result转化为String类型的数据
		  	  result=JSON.parse(result)
		  	  var ret = result[0]
			  var id = ret['max(id)'] + 1
	
			var sql = "insert into fee_collection values("
					 + id  + ","
					  + "\'" + inform.name + "\'" + "," 
					   +"\'" + inform.gender + "\'" + ","
					    +"\'" + inform.idCardNum + "\'" + ","
					     +"\'" + inform.payMonth + "\'" + ","
					      +"\'" + inform.amount + "\'" + ","
					       +"\'" + inform.source + "\'" + ","
					        +"\'" + "已缴纳" + "\'" + ","
					        +"\'" + inform.payTime + "\'" + ","
					        +"\'" + inform.enterTime + "\'"+ ")"
//					         console.log(sql)
			Pfile.increaseSql(sql,  function (err, inform) {
				if (err) {
					return res.status(500).send('Server error'+err.message)
				}
				res.redirect('/views/detail/dfsj/dfsj-jfjl')
			})
		})	
})
/*
 * 积分管理
 */
//学习积分
router.get('/views/detail/jfgl/xxjf', function(req, res){
	var sql = 'SELECT * FROM people_information';
	connection.query(sql,function (err,inform) {
	  if(err){
	    return callback(err);
	  }
	res.render('detail/jfgl/xxjf.html', {
			inform: inform
		})
	})
})
//学习积分-------查询
router.post('/views/detail/jfgl/xxjf-search', function(req,res){
//	var sql1='SELECT commen_userroleinf.loginAcc,commen_userpowerinfo.property,commen_userpowerinfo.people_ctrol FROM commen_userroleinf,commen_userpowerinfo  WHERE commen_userroleinf.property = commen_userpowerinfo.property and  commen_userroleinf.loginAcc='+"\'"+req.session.username+"\'"
//	console.log(sql1)
//	connection.query(sql1,function (err,result) {
//	  if(err){
//	    return err;
//	  }
//	  result=JSON.stringify(result)    //先将result转化为String类型的数据
//	  result=JSON.parse(result) 
// var aa=result[0].people_ctrol
//	aa.split(',')
//for(var i=0;i<aa.length;i++)
//{
//	if(aa[i]=='83')
//	{
		var inform = req.body
	for(var key in inform){
		if(inform[key] == ''){
			delete inform[key]
		}
	}
	if(JSON.stringify(inform) == '{}'){
//		console.log('2333')
		res.redirect('/views/detail/jfgl/xxjf')
		return
	}
//	console.log(inform)
	var sql = "select * from people_information where " 
	var i = 0
	for(var key in inform){
		if (i == 0){
			sql += key + " like" + "\'"+"%"+inform[key]+"%"+"\'"
			i++
		} else {
			sql += "and " + key + " like" + "\'"+"%"+inform[key]+"%"+"\'"
		}
	}
//	console.log(sql)
	Pfile.selectSql(sql, function(err, inform) {
		if (err) {
			return res.status(500).send('Server error'+err.message)
		}
		return res.render('detail/jfgl/xxjf.html', {
			inform: inform 
		})
	})
//	}
//	else
//	{
//		return res.send("你没有此权限")
//	}
//}
//})
})
//学习积分-------目录树
router.get('/views/detail/jfgl/xxjf-tree', function(req, res){
	var sql = 'SELECT * FROM people_information where belongorganazation =' + "\'" + req.query.name + "\'";
//	console.log(sql)
	//onsole.log(sql)
	Pfile.searchFile(sql, function(err, inform){
		if(err){
			return res.status(500).send('Servor error'+err.message)
		}
		//RowDataPacket
//		console.log(inform)
		inform=JSON.stringify(inform)    //先将result转化为String类型的数据
		  	  inform=JSON.parse(inform)
//		  	  console.log(inform)
		res.render('detail/jfgl/xxjf.html',{
			inform:inform
		})
	})
})
//个人积分
router.get('/views/detail/jfgl/grjf', function(req, res){
//	var sql1='SELECT commen_userroleinf.loginAcc,commen_userpowerinfo.property,commen_userpowerinfo.people_ctrol FROM commen_userroleinf,commen_userpowerinfo  WHERE commen_userroleinf.property = commen_userpowerinfo.property and  commen_userroleinf.loginAcc='+"\'"+req.session.username+"\'"
//	console.log(sql1)
//	connection.query(sql1,function (err,result) {
//	  if(err){
//	    return err;
//	  }
//	  result=JSON.stringify(result)    //先将result转化为String类型的数据
//	  result=JSON.parse(result) 
// var aa=result[0].people_ctrol
//	aa.split(',')
//	for(var i=0;i<aa.length;i++)
//	 {
//	 	if(aa[i]=='84')
//	 	 {
	 	 	var sql = 'SELECT * FROM people_information';
	connection.query(sql,function (err,inform) {
	  if(err){
	    return callback(err);
	  }
	return res.render('detail/jfgl/grjf.html', {
			inform: inform
		})
	})
//	 	 }
//	 	 else
//	 	 {
//	 	 	return res.send("你没有此权限")
//	 	 }
//	 }
//	})
})
//个人积分-------目录树
router.get('/views/detail/jfgl/grjf-tree', function(req, res){
	var sql = 'SELECT * FROM people_information where belongorganazation =' + "\'" + req.query.name + "\'";
//	console.log(sql)
	//onsole.log(sql)
	Pfile.searchFile(sql, function(err, inform){
		if(err){
			return res.status(500).send('Servor error'+err.message)
		}
		inform=JSON.stringify(inform)    //先将result转化为String类型的数据
		  	  inform=JSON.parse(inform)
//		  	  console.log(inform)
		res.render('detail/jfgl/grjf.html',{
			inform:inform
		})
	})
})
//个人积分-------修改
router.get('/views/detail/jfgl/grjf-edit', function(req, res){
	var sql = 'SELECT * FROM people_information where id =' + req.query.id;
//	console.log(sql)
	Pfile.searchById(sql,parseInt(req.query.id), function (err, inform) {
		if (err) {
			return res.status(500).send('Server error'+err.message)
		}
		res.render('detail/jfgl/grjf-edit.html', {
			inform: inform
		})
	})
})
router.post('/views/detail/jfgl/grjf-edit', function(req, res){
	var people = req.body
	var editsql = "update people_information set id=" +"\'" + people.id + "\'"
+ "," + "personalInt=" +"\'" + people.personalInt + "\'"
+"where id=" + people.id;
//	console.log(editsql)
	Pfile.editById(editsql, function(err){
		if(err) {
			return res.status(500).send('Server error'+err.message)	
		}
		res.redirect('/views/detail/jfgl/grjf')
	})
})
//个人积分-------查询
router.post('/views/detail/jfgl/grjf-search', function(req,res){	
	var inform = req.body
	for(var key in inform){
		if(inform[key] == ''){
			delete inform[key]
		}
	}
	if(JSON.stringify(inform) == '{}'){
//		console.log('2333')
		res.redirect('/views/detail/jfgl/grjf')
		return
	}
//	console.log(inform)
	var sql = "select * from people_information where " 
	var i = 0
	for(var key in inform){
		if (i == 0){
			sql += key + " like" + "\'"+"%"+inform[key]+"%"+"\'"
			i++
		} else {
			sql += "and " + key + " like" + "\'"+"%"+inform[key]+"%"+"\'"
		}
	}
//	console.log(sql)
	Pfile.selectSql(sql, function(err, inform) {
		if (err) {
			return res.status(500).send('Server error'+err.message)
		}
		res.render('detail/jfgl/grjf.html', {
			inform: inform 
		})
	})
})
//基层党建季度积分
router.get('/views/detail/jfgl/jcdjjdjf', function(req, res){
	var sql = 'SELECT belongorganazation,sum(personalInt)  FROM people_information group by belongorganazation order by sum(personalInt) desc';
//	console.log(sql)
	connection.query(sql,function (err,inform) {
	  if(err){
	    return callback(err);
	  }
	  inform=JSON.stringify(inform)    //先将result转化为String类型的数据
	  inform=JSON.parse(inform)
	  var ret = inform
	  for(var i = 0; i < inform.length; i++){
	  	ret1=ret[i];
	  	   	inform[i].sum=ret1['sum(personalInt)']
   			delete inform[i]['sum(personalInt)']         
	  }
	  //var personalInt = inform.sum(personalInt)
//	  console.log(inform)
	res.render('detail/jfgl/jcdjjdjf.html', {
			inform: inform
		})
	})
})
//基层党建季度排名
router.get('/views/interviews/djzc/jfpm', function(req, res){
	  	var  sql2="SELECT belongorganazation,sum(integration) FROM people_information  group by belongorganazation order by sum(integration) desc "
//	console.log(sql1)
		Pfile.selectSql( sql2,function(err, inform1) {
		if(err){
			return res.status(500).send('Servor error')
		}
		 inform1=JSON.stringify(inform1)    //先将result转化为String类型的数据
	  	  inform1=JSON.parse(inform1)
	  	   var ret2 = inform1
	  	   for(var i=0;i<inform1.length;i++)
	  	   {
	  	   	ret22=ret2[i];
	  	   	inform1[i].totalscore=ret22['sum(integration)']
	  	  	inform1[i].rank1=i+1
	  	   	delete inform1[i]['sum(integration)']
//	  	   	delete inform[i]['count(integration)']
	  	   }
//	  	   console.log(ret2)
//	  	   console.log(inform)
	  	   res.render('interviews/djzc/jfpm.html',{
			inform1:inform1 
			})
		})
})

//基层党建季度积分---------------------查看
router.get('/views/detail/jfgl/jcdjjdjf-detail', async (req, res) => {
    var access_list = await get_accesslist(req);
	var aa = access_list.split(',')
    for(var i=0;i<aa.length;i++){
	    if(aa[i]=='85'){
		var sql = 'SELECT * FROM people_information where belongorganazation=' + "\'" + req.query.belongorganazation + "\'";
	    connection.query(sql,function (err,inform) {
	        if(err){
	            return err
	        }
	        res.render('detail/jfgl/jcdjjdjf-detail.html', {
			    inform: inform
		    })
	    })
	break
	}
	else
	{
		if(i==aa.length-1)
        			{
        			return res.send("你没有此操作权限")
        			}else{
        				continue
        			}
	}
}
})
//基层党建季度积分-------查询
router.post('/views/detail/jfgl/jcdjjdjf-search', function(req,res){
	var inform = req.body
	for(var key in inform){
		if(inform[key] == ''){
			delete inform[key]
		}
	}
	if(JSON.stringify(inform) == '{}'){
//		console.log('2333')
		res.redirect('/views/detail/jfgl/jcdjjdjf')
		return
	}
//	console.log(inform)
	var sql = "select * from people_information where " 
	var i = 0
	for(var key in inform){
		if (i == 0){
			sql += key + " like" + "\'"+"%"+inform[key]+"%"+"\'"
			i++
		} else {
			sql += "and " + key + " like" + "\'"+"%"+inform[key]+"%"+"\'"
		}
	}
	sql += ' group by belongorganazation';
	console.log(sql)
	Pfile.selectSql(sql, function(err, inform) {
		if (err) {
			return res.status(500).send('Server error'+err.message)
		}
		res.render('detail/jfgl/jcdjjdjf.html', {
			inform: inform 
		})
	})
})
/*
 * 数据统计
 */
//信息量统计
router.get('/views/detail/sjtj/xxltj', function(req, res){ 
//	var sql1='SELECT commen_userroleinf.loginAcc,commen_userpowerinfo.property,commen_userpowerinfo.people_ctrol FROM commen_userroleinf,commen_userpowerinfo  WHERE commen_userroleinf.property = commen_userpowerinfo.property and  commen_userroleinf.loginAcc='+"\'"+req.session.username+"\'"
//	console.log(sql1)
//	connection.query(sql1,function (err,result) {
//	  if(err){
//	    return err;
//	  }
//	  result=JSON.stringify(result)    //先将result转化为String类型的数据
//	  result=JSON.parse(result) 
// 	 var aa=result[0].people_ctrol
//	 aa.split(',')
//   for(var i=0;i<aa.length;i++)
//   {
//   	if(aa[i]=='111')
//   	{
     		var sql1 ='SELECT  belongPart, COUNT(belongPart),STATUS FROM web_ctrol_resourcectrol  WHERE STATUS="未审核"  GROUP BY belongPart'      
    var sql2= 'SELECT  belongPart, COUNT(belongPart),STATUS FROM web_ctrol_resourcectrol  WHERE STATUS="已审核"  GROUP BY belongPart'  
     var sql3='SELECT  belongPart, COUNT(belongPart),STATUS FROM web_ctrol_resourcectrol  WHERE STATUS="已发布"  GROUP BY belongPart'
	var sql4 ='SELECT  belongPart, COUNT(belongPart),STATUS FROM web_ctrol_resourcectrol  GROUP BY belongPart'      
     
	 connection.query(sql1,function (err,inform1) {
	  if(err){
	    return callback(err);
	  }
	  	  inform1=JSON.stringify(inform1)    //先将result转化为String类型的数据
	  	  inform1=JSON.parse(inform1)
	  connection.query(sql2,function (err,inform2) {
	  if(err){
	    return callback(err);
	  }
	  	  inform2=JSON.stringify(inform2)    //先将result转化为String类型的数据
	  	  inform2=JSON.parse(inform2)
	  connection.query(sql3,function (err,inform3) {
	  if(err){
	    return callback(err);
	  }
	  	  inform3=JSON.stringify(inform3)    //先将result转化为String类型的数据
	  	  inform3=JSON.parse(inform3)
	  connection.query(sql4,function (err,inform4) {
	  if(err){
	    return callback(err);
	  }
	  	  inform4=JSON.stringify(inform4)    //先将result转化为String类型的数据
	  	  inform4=JSON.parse(inform4)
	var ret1 = inform1
	  	   for(var i=0;i<inform1.length;i++)
	  	   {
	  	   	ret=ret1[i];
	  	   	ret1[i].count1=ret['COUNT(belongPart)']
	  	   	for(var j=0;j<inform4.length;j++)
	  	    { 
	  	    	if(inform4[j].belongPart==inform1[i].belongPart)
	  	    	{
	  	    		inform4[j].count1=inform1[i].count1
	  	    	}
	  	    }
	  	   }
	var ret2 = inform2
	  	   for(var i=0;i<inform2.length;i++)
	  	   {
	  	   	ret11=ret2[i];
	  	   	ret2[i].count2=ret11['COUNT(belongPart)']
	  	   	for(var j=0;j<inform4.length;j++)
	  	    {
	  	    	if(inform4[j].belongPart==inform2[i].belongPart)
	  	    	{
	  	    		inform4[j].count2=inform2[i].count2
	  	    	}
	  	    }
	  	   }
	var ret3 = inform3
	  	   for(var i=0;i<inform3.length;i++)
	  	   {
	  	   	ret12=ret3[i];
	  	   	ret3[i].count3=ret12['COUNT(belongPart)']
	  	    for(var j=0;j<inform4.length;j++)
	  	    {
	  	    	if(inform4[j].belongPart==inform3[i].belongPart)
	  	    	{
	  	    		inform4[j].count3=inform3[i].count3
	  	    	}
	  	    }
	  	   	
	  	   }
//	  	  console.log(inform3)
	  	   var ret4 = inform4
	  	   for(var i=0;i<ret4.length;i++)
	  	   {
	  	   	ret13=ret4[i];
	  	   	inform4[i].count=ret13['COUNT(belongPart)'];
//	  	   	console.log(ret4[i].belongPart)
//	  	   	console.log(inform3[i].belongPart)
	  	   }
//	  	 console.log(inform4)
	return res.render('detail/sjtj/xxltj.html', {
			inform4: inform4
					})
				})
			})
		})
	})
//   	}
//   	else
//   	{
//   		return res.send("你没有此操作权限")
//
//   	}
//   }
//
//	})
})
//信箱管理统计
router.get('/views/detail/sjtj/xxgltj', function(req, res){
//	var sql1='SELECT commen_userroleinf.loginAcc,commen_userpowerinfo.property,commen_userpowerinfo.people_ctrol FROM commen_userroleinf,commen_userpowerinfo  WHERE commen_userroleinf.property = commen_userpowerinfo.property and  commen_userroleinf.loginAcc='+"\'"+req.session.username+"\'"
//	console.log(sql1)
//	connection.query(sql1,function (err,result) {
//	  if(err){
//	    return err;
//	  }
//	  result=JSON.stringify(result)    //先将result转化为String类型的数据
//	  result=JSON.parse(result) 
// var aa=result[0].people_ctrol
//	aa.split(',')
//  for(var i=0;i<aa.length;i++)
//      {
//      	if(aa[i]=='112')
//      	{
        		Pfile.find(function(err, people) {
		if(err){
			return res.status(500).send('Servor error')
		}
		return res.render('detail/sjtj/xxgltj.html',{
			people:people
		})
	})
//      	}
//      	else{
//      		return res.send("你没有此操作权限")
//
//      	}
//      }
//	//res.render('center/center_left.html')
//	//res.render('center.html')
//	//res.render('admin.html')
//	})
})
//党员流入流出统计
//流出统计
router.get('/views/detail/sjtj/dylrlctj-lctj', function(req, res){
//	var sql1='SELECT commen_userroleinf.loginAcc,commen_userpowerinfo.property,commen_userpowerinfo.people_ctrol FROM commen_userroleinf,commen_userpowerinfo  WHERE commen_userroleinf.property = commen_userpowerinfo.property and  commen_userroleinf.loginAcc='+"\'"+req.session.username+"\'"
//	console.log(sql1)
//	connection.query(sql1,function (err,result) {
//	  if(err){
//	    return err;
//	  }
//	  result=JSON.stringify(result)    //先将result转化为String类型的数据
//	  result=JSON.parse(result) 
// var aa=result[0].people_ctrol
//	aa.split(',')
// for(var i=0;i<aa.length;i++)
//{
//	if(aa[i]=='113')
//	{
  		var  sql2="SELECT floatoutname,count(2) FROM floatincommity WHERE floatType='流出' group by floatoutname "
	Pfile.selectSql( sql2,function(err, people2) {
		if(err){
			return res.status(500).send('Servor error')
		}
		 people2=JSON.stringify(people2)    //先将result转化为String类型的数据
	  	  people2=JSON.parse(people2)
	  	  var ret2 = people2
	  	   for(var i=0;i<people2.length;i++)
	  	   {
	  	   	ret11=ret2[i];
	  	   	ret2[i].litres=ret11['count(2)']
	  	   }
//	  	   console.log(people2)
		return res.render('detail/sjtj/dylrlctj-lctj.html',{
			people2: people2
		})
	})
//	}
//	else
//	{
//		return res.send("你没有此权限")
//	}
//	 
//}
//	 })
})
//流出统计图标渲染
router.get('/views/armcharts/samples/lctj', function(req, res){
	var  sql2="SELECT floatoutname,count(2) FROM floatincommity WHERE floatType='流出' group by floatoutname "
	Pfile.selectSql( sql2,function(err, inform) {
		if(err){
			return res.status(500).send('Servor error')
		}
		 inform=JSON.stringify(inform)    //先将result转化为String类型的数据
	  	  inform=JSON.parse(inform)
	  	  var ret2 = inform
	  	   for(var i=0;i<inform.length;i++)
	  	   {
	  	   	ret11=ret2[i];
	  	   	ret2[i].litres=ret11['count(2)']
	  	   	delete inform[i]['count(2)']
	  	   }
//	  	   console.log(inform)
		res.render('armcharts/samples/lctj.html',{
			inform: inform
		})
	})
})
//流入统计
router.get('/views/detail/sjtj/dylrlctj-lrtj', function(req, res){
	
	var  sql1="SELECT floatoutname,count(1) FROM floatincommity WHERE floatType= '流入'  group by floatoutname "
//	console.log(sql1)
	Pfile.selectSql( sql1,function(err, people1) {
		if(err){
			return res.status(500).send('Servor error')
		}
		 people1=JSON.stringify(people1)    //先将result转化为String类型的数据
	  	  people1=JSON.parse(people1)
	  	   var ret1 = people1
	  	   for(var i=0;i<people1.length;i++)
	  	   {
	  	   	ret=ret1[i];
	  	   	ret1[i].lrNum=ret['count(1)']
	  	   }
//	  	   console.log(people1)
	  	   res.render('detail/sjtj/dylrlctj-lrtj.html',{
			people1: people1
		})
	 })   
})
//流入统计图标渲染
router.get('/views/armcharts/samples/lrtj', function(req, res){
	var  sql1="SELECT floatoutname,count(1) FROM floatincommity WHERE floatType= '流入'  group by floatoutname "
//	console.log(sql1)
	Pfile.selectSql( sql1,function(err, inform) {
		if(err){
			return res.status(500).send('Servor error')
		}
		 inform=JSON.stringify(inform)    //先将result转化为String类型的数据
	  	  inform=JSON.parse(inform)
	  	   var ret1 = inform
	  	   for(var i=0;i<inform.length;i++)
	  	   {
	  	   	ret=ret1[i];
	  	   	ret1[i].litres=ret['count(1)']
	  	   		delete inform[i]['count(1)']
	  	   }
//	  	   console.log(inform)
	  	   res.render('armcharts/samples/lctj.html',{
			inform: inform
		})
	 })   
})
//党员队伍建设分析-----文化程度
router.get('/views/detail/sjtj/dydwjsfx-whcd', function(req, res){
	var  sql1="SELECT culture_level,count(1) FROM people_information  group by culture_level"
//	console.log(sql1)
	Pfile.selectSql( sql1,function(err, inform) {
		if(err){
			return res.status(500).send('Servor error')
		}
		 inform=JSON.stringify(inform)    //先将result转化为String类型的数据
	  	  inform=JSON.parse(inform)
	  	   var ret1 = inform
	  	   for(var i=0;i<inform.length;i++)
	  	   {
	  	   	ret=ret1[i];
	  	   	ret1[i].num=ret['count(1)']
	  	   }
//	  	   console.log(inform)
	  	   res.render('detail/sjtj/dydwjsfx-whcd.html',{
			inform: inform
		})
	 })   
})
//党员队伍建设分析-----文化程度图标渲染
router.get('/views/armcharts/samples/whcd', function(req, res){
	var  sql1="SELECT culture_level,count(1) FROM people_information  group by culture_level"
//	console.log(sql1)
	Pfile.selectSql( sql1,function(err, inform) {
		if(err){
			return res.status(500).send('Servor error')
		}
		 inform=JSON.stringify(inform)    //先将result转化为String类型的数据
	  	  inform=JSON.parse(inform)
	  	   var ret1 = inform
	  	   for(var i=0;i<inform.length;i++)
	  	   {
	  	   	ret=ret1[i];
	  	   	ret1[i].num=ret['count(1)']
	  	   delete inform[i]['count(1)']
	  	   }
//	  	   console.log(inform)
	  	   res.render('armcharts/samples/whcd.html',{
			inform: inform
		})
	 })   
})
//党员队伍建设分析-----年龄统计
router.get('/views/detail/sjtj/dydwjsfx-nltj', function(req, res){
//	var sql1="SELECT gender,COUNT(1) FROM people_information  group by gender"
	var sql1="SELECT gender,COUNT(1) FROM people_information where age<35 group by gender"
	var sql2="SELECT gender,COUNT(2) FROM people_information where age<35 group by gender"
	
	var sql3='SELECT gender,COUNT(3) FROM people_information WHERE age BETWEEN 36 AND 45 and gender="男" GROUP BY gender'
	var sql4='SELECT gender,COUNT(4) FROM people_information WHERE age BETWEEN 36 AND 45 and gender="女" GROUP BY gender'
	
	var sql5='SELECT gender,COUNT(5) FROM people_information WHERE age BETWEEN 46 AND 60 and gender="男" GROUP BY gender'
	var sql6='SELECT gender,COUNT(6) FROM people_information WHERE age BETWEEN 46 AND 60 and gender="女" GROUP BY gender'
	var sql7='SELECT gender,COUNT(7) FROM people_information WHERE age>60 and gender="男" GROUP BY gender'
	var sql8='SELECT gender,COUNT(8) FROM people_information WHERE age>60 and gender="女" GROUP BY gender'
	
	
//	console.log(sql1)
	Pfile.selectSql( sql1,function(err, inform1) {
		if(err){
			return res.status(500).send('Servor error')
		}
		 inform1=JSON.stringify(inform1)    //先将result转化为String类型的数据
	  	  inform1=JSON.parse(inform1)
//	  	  console.log(inform1)
	  	 Pfile.selectSql( sql2,function(err, inform2) {
		if(err){
			return res.status(500).send('Servor error')
		}
		 inform2=JSON.stringify(inform2)    //先将result转化为String类型的数据
	  	  inform2=JSON.parse(inform2)
	  	  
		  	 Pfile.selectSql( sql3,function(err, inform3) {
			if(err){
				return res.status(500).send('Servor error')
			}
			 inform3=JSON.stringify(inform3)    //先将result转化为String类型的数据
		  	  inform3=JSON.parse(inform3)
//		  	  console.log(inform3)
		  	Pfile.selectSql( sql4,function(err, inform4) {
			if(err){
				return res.status(500).send('Servor error')
			}
			inform4=JSON.stringify(inform4)    //先将result转化为String类型的数据
		  	  inform4=JSON.parse(inform4)
			Pfile.selectSql( sql5,function(err, inform5) {
			if(err){
				return res.status(500).send('Servor error')
			}
			inform5=JSON.stringify(inform5)    //先将result转化为String类型的数据
		  	  inform5=JSON.parse(inform5)
			Pfile.selectSql( sql6,function(err, inform6) {
			if(err){
				return res.status(500).send('Servor error')
			}
			inform6=JSON.stringify(inform6)    //先将result转化为String类型的数据
		  	  inform6=JSON.parse(inform6)
			Pfile.selectSql( sql7,function(err, inform7) {
			if(err){
				return res.status(500).send('Servor error')
			}
			inform7=JSON.stringify(inform7)    //先将result转化为String类型的数据
		  	  inform7=JSON.parse(inform7)
			 Pfile.selectSql( sql8,function(err, inform8) {
			if(err){
				return res.status(500).send('Servor error')
			}
			inform8=JSON.stringify(inform8)    //先将result转化为String类型的数据
		  	  inform8=JSON.parse(inform8)
		  	   if(inform1.length==0)
		  	    {
		  	    	inform1[0].count1=0;
		  	    }
		  	    else{
		  	    	var ret1 = inform1 
			  	   	ret11=ret1[0];
			  	   	inform1[0].count1=ret11['COUNT(1)']
		  	    }
		  	    if(inform2.length==0)
		  	    {
		  	    	inform1[0].count2=0;
		  	    }else{
		  	    	var ret2 = inform2
			  	   	ret22=ret2[0];
			  	   	inform1[0].count2=ret22['COUNT(2)']
		  	    }
		  	    if(inform3.length==0)
		  	    {
		  	    	inform1[0].count3=0;
		  	    }else{
		  	    	var ret3 = inform3
		  	    	ret33=ret3[0];
			  	   	inform1[0].count3=ret33['COUNT(3)']
		  	    }
		  	     if(inform4.length==0)
		  	    {
		  	    	inform1[0].count4=0;
		  	    }else{
		  	    	var ret4 = inform4
		  	    	ret44=ret4[0];
			  	   	inform1[0].count4=ret44['COUNT(4)']
		  	    }
		  	     if(inform5.length==0)
		  	    {
		  	    	inform1[0].count5=0;
		  	    }else{
		  	    	var ret5 = inform5
		  	    	ret55=ret5[0];
			  	   	inform1[0].count5=ret55['COUNT(5)']
		  	    }
		  	     if(inform6.length==0)
		  	    {
		  	    	inform1[0].count6=0;
		  	    }else{
		  	    	var ret6 = inform6
		  	    	ret66=ret6[0];
			  	   	inform1[0].count6=ret66['COUNT(6)']
		  	    }
		  	     if(inform7.length==0)
		  	    {
		  	    	inform1[0].count7=0;
		  	    }else{
		  	    	var ret7 = inform7
		  	    	ret77=ret7[0];
			  	   	inform1[0].count7=ret77['COUNT(7)']
		  	    }
		  	     if(inform8.length==0)
		  	    {
		  	    	inform1[0].count8=0;
		  	    }else{
		  	    	var ret8 = inform8
		  	    	ret88=ret8[0];
			  	   	inform1[0].count8=ret88['COUNT(8)']
		  	    }
//		  	    console.log(inform1[0])
		  	   res.render('detail/sjtj/dydwjsfx-nltj.html',{
				inform1: inform1[0]
			  			})	
		  	   		  })
		 			})   
		  		})
			})
	  	})   
	 })
   })
 })   
})
//党员队伍建设分析-----年龄统计
router.get('/views/armcharts/samples/nltj', function(req, res){
//	var sql1="SELECT gender,COUNT(1) FROM people_information  group by gender"
	var sql1="SELECT gender,COUNT(1) FROM people_information where age<35 group by gender"
	var sql2="SELECT gender,COUNT(2) FROM people_information where age<35 group by gender"
	
	var sql3='SELECT gender,COUNT(3) FROM people_information WHERE age BETWEEN 36 AND 45 and gender="男" GROUP BY gender'
	var sql4='SELECT gender,COUNT(4) FROM people_information WHERE age BETWEEN 36 AND 45 and gender="女" GROUP BY gender'
	
	var sql5='SELECT gender,COUNT(5) FROM people_information WHERE age BETWEEN 46 AND 60 and gender="男" GROUP BY gender'
	var sql6='SELECT gender,COUNT(6) FROM people_information WHERE age BETWEEN 46 AND 60 and gender="女" GROUP BY gender'
	var sql7='SELECT gender,COUNT(7) FROM people_information WHERE age>60 and gender="男" GROUP BY gender'
	var sql8='SELECT gender,COUNT(8) FROM people_information WHERE age>60 and gender="女" GROUP BY gender'
	
	
//	console.log(sql1)
	Pfile.selectSql( sql1,function(err, inform1) {
		if(err){
			return res.status(500).send('Servor error')
		}
		 inform1=JSON.stringify(inform1)    //先将result转化为String类型的数据
	  	  inform1=JSON.parse(inform1)
//	  	  console.log(inform1)
	  	 Pfile.selectSql( sql2,function(err, inform2) {
		if(err){
			return res.status(500).send('Servor error')
		}
		 inform2=JSON.stringify(inform2)    //先将result转化为String类型的数据
	  	  inform2=JSON.parse(inform2)
	  	  
		  	 Pfile.selectSql( sql3,function(err, inform3) {
			if(err){
				return res.status(500).send('Servor error')
			}
			 inform3=JSON.stringify(inform3)    //先将result转化为String类型的数据
		  	  inform3=JSON.parse(inform3)
//		  	  console.log(inform3)
		  	Pfile.selectSql( sql4,function(err, inform4) {
			if(err){
				return res.status(500).send('Servor error')
			}
			inform4=JSON.stringify(inform4)    //先将result转化为String类型的数据
		  	  inform4=JSON.parse(inform4)
			Pfile.selectSql( sql5,function(err, inform5) {
			if(err){
				return res.status(500).send('Servor error')
			}
			inform5=JSON.stringify(inform5)    //先将result转化为String类型的数据
		  	  inform5=JSON.parse(inform5)
			Pfile.selectSql( sql6,function(err, inform6) {
			if(err){
				return res.status(500).send('Servor error')
			}
			inform6=JSON.stringify(inform6)    //先将result转化为String类型的数据
		  	  inform6=JSON.parse(inform6)
			Pfile.selectSql( sql7,function(err, inform7) {
			if(err){
				return res.status(500).send('Servor error')
			}
			inform7=JSON.stringify(inform7)    //先将result转化为String类型的数据
		  	  inform7=JSON.parse(inform7)
			 Pfile.selectSql( sql8,function(err, inform8) {
			if(err){
				return res.status(500).send('Servor error')
			}
			inform8=JSON.stringify(inform8)    //先将result转化为String类型的数据
		  	  inform8=JSON.parse(inform8)
		  	   if(inform1.length==0)
		  	    {
		  	    	inform1[0].count1=0;
		  	    }
		  	    else{
		  	    	var ret1 = inform1 
			  	   	ret11=ret1[0];
			  	   	inform1[0].count1=ret11['COUNT(1)']
		  	    }
		  	    if(inform2.length==0)
		  	    {
		  	    	inform1[0].count2=0;
		  	    }else{
		  	    	var ret2 = inform2
			  	   	ret22=ret2[0];
			  	   	inform1[0].count2=ret22['COUNT(2)']
		  	    }
		  	    if(inform3.length==0)
		  	    {
		  	    	inform1[0].count3=0;
		  	    }else{
		  	    	var ret3 = inform3
		  	    	ret33=ret3[0];
			  	   	inform1[0].count3=ret33['COUNT(3)']
		  	    }
		  	     if(inform4.length==0)
		  	    {
		  	    	inform1[0].count4=0;
		  	    }else{
		  	    	var ret4 = inform4
		  	    	ret44=ret4[0];
			  	   	inform1[0].count4=ret44['COUNT(4)']
		  	    }
		  	     if(inform5.length==0)
		  	    {
		  	    	inform1[0].count5=0;
		  	    }else{
		  	    	var ret5 = inform5
		  	    	ret55=ret5[0];
			  	   	inform1[0].count5=ret55['COUNT(5)']
		  	    }
		  	     if(inform6.length==0)
		  	    {
		  	    	inform1[0].count6=0;
		  	    }else{
		  	    	var ret6 = inform6
		  	    	ret66=ret6[0];
			  	   	inform1[0].count6=ret66['COUNT(6)']
		  	    }
		  	     if(inform7.length==0)
		  	    {
		  	    	inform1[0].count7=0;
		  	    }else{
		  	    	var ret7 = inform7
		  	    	ret77=ret7[0];
			  	   	inform1[0].count7=ret77['COUNT(7)']
		  	    }
		  	     if(inform8.length==0)
		  	    {
		  	    	inform1[0].count8=0;
		  	    }else{
		  	    	var ret8 = inform8
		  	    	ret88=ret8[0];
			  	   	inform1[0].count8=ret88['COUNT(8)']
		  	    }
		  	    delete inform1[0]['COUNT(1)']
//		  	    console.log(inform1[0])
		  	   res.render('armcharts/samples/nltj.html',{
				inform1: inform1[0]
			  			})	
		  	   		  })
		 			})   
		  		})
			})
	  	})   
	 })
   })
 })   
})
//党员队伍建设分析-----职业统计
router.get('/views/detail/sjtj/dydwjsfx-zytj', function(req, res){
	var  sql1="SELECT profession,count(profession) FROM people_information  group by profession"
//	console.log(sql1)
	Pfile.selectSql( sql1,function(err, people) {
		if(err){
			return res.status(500).send('Servor error')
		}
		 people=JSON.stringify(people)    //先将result转化为String类型的数据
	  	  people=JSON.parse(people)
	  	   var ret1 = people
	  	   for(var i=0;i<people.length;i++)
	  	   {
	  	   	ret=ret1[i];
	  	   	ret1[i].num=ret['count(profession)']
	  	   	delete people[i]['count(profession)']
	  	   }
//	  	   console.log(people)
	  	   res.render('detail/sjtj/dydwjsfx-zytj.html',{
			people: people
		})
	 })   
})
//职业统计渲染图
router.get('/views/armcharts/samples/zytj', function(req, res){
	var  sql1="SELECT profession,count(profession) FROM people_information  group by profession"
//	console.log(sql1)
	Pfile.selectSql( sql1,function(err, people) {
		if(err){
			return res.status(500).send('Servor error')
		}
		 people=JSON.stringify(people)    //先将result转化为String类型的数据
	  	  people=JSON.parse(people)
	  	   var ret1 = people
	  	   for(var i=0;i<people.length;i++)
	  	   {
	  	   	ret=ret1[i];
	  	   	ret1[i].num=ret['count(profession)']
	  	   	delete people[i]['count(profession)']
	  	   }
//	  	   console.log(people)
	  	   res.render('armcharts/samples/zytj.html',{
			people: people
		})
	 })   
})
//党员队伍建设分析-----党员类别
router.get('/views/detail/sjtj/dydwjsfx-dylb', function(req, res){
	var  sql1="SELECT type,count(type) FROM people_information  group by type"
//	console.log(sql1)
	Pfile.selectSql( sql1,function(err, inform) {
		if(err){
			return res.status(500).send('Servor error')
		}
		 inform=JSON.stringify(inform)    //先将result转化为String类型的数据
	  	  inform=JSON.parse(inform)
	  	   var ret1 = inform
	  	   for(var i=0;i<inform.length;i++)
	  	   {
	  	   	ret=ret1[i];
	  	   	ret1[i].num=ret['count(type)']
	  	   	delete inform[i]['count(type)']
	  	   }
//	  	   console.log(inform)
	  	   res.render('detail/sjtj/dydwjsfx-dylb.html',{
			inform: inform
		})
	 })   
})
//党员类别渲染图
router.get('/views/armcharts/samples/dylb', function(req, res){
	var  sql1="SELECT type,count(type) FROM people_information  group by type"
//	console.log(sql1)
	Pfile.selectSql( sql1,function(err, inform) {
		if(err){
			return res.status(500).send('Servor error')
		}
		 inform=JSON.stringify(inform)    //先将result转化为String类型的数据
	  	  inform=JSON.parse(inform)
	  	   var ret1 = inform
	  	   for(var i=0;i<inform.length;i++)
	  	   {
	  	   	ret=ret1[i];
	  	   	ret1[i].num=ret['count(type)']
	  	   	delete inform[i]['count(type)']
	  	   }
//	  	   console.log(inform)
	  	   res.render('armcharts/samples/dylb.html',{
			inform: inform
		})
	 })   
})
//党员队伍建设分析-----党员性质
router.get('/views/detail/sjtj/dydwjsfx-dyxz', function(req, res){
	var  sql1="SELECT property,count(property) FROM people_information  group by property"
//	console.log(sql1)
	Pfile.selectSql( sql1,function(err, inform) {
		if(err){
			return res.status(500).send('Servor error')
		}
		 inform=JSON.stringify(inform)    //先将result转化为String类型的数据
	  	  inform=JSON.parse(inform)
	  	   var ret1 = inform
	  	   for(var i=0;i<inform.length;i++)
	  	   {
	  	   	ret=ret1[i];
	  	   	ret1[i].num=ret['count(property)']
	  	   	delete inform[i]['count(property)']
	  	   }
//	  	   console.log(inform)
	  	   res.render('detail/sjtj/dydwjsfx-dyxz.html',{
			inform: inform
		})
	 })   
})
//党员性质渲染图
router.get('/views/armcharts/samples/dyxz', function(req, res){
	var  sql1="SELECT property,count(property) FROM people_information  group by property"
//	console.log(sql1)
	Pfile.selectSql( sql1,function(err, inform) {
		if(err){
			return res.status(500).send('Servor error')
		}
		 inform=JSON.stringify(inform)    //先将result转化为String类型的数据
	  	  inform=JSON.parse(inform)
	  	   var ret1 = inform
	  	   for(var i=0;i<inform.length;i++)
	  	   {
	  	   	ret=ret1[i];
	  	   	ret1[i].num=ret['count(property)']
	  	   	delete inform[i]['count(property)']
	  	   }
//	  	   console.log(inform)
	  	   res.render('armcharts/samples/dyxz.html',{
			inform: inform
		})
	 })   
})
//党员关爱统计
router.get('/views/detail/sjtj/dygatj', function(req, res){
	var  sql1="SELECT count(1) FROM heart_help_poorpeople "
	var  sql2="SELECT count(2) FROM heart_educatepovertypeople "
	var  sql3="SELECT count(3) FROM vitalproblem_supervise_problem"
	
//	console.log(sql1)
	Pfile.selectSql( sql1,function(err, inform1) {
		if(err){
			return res.status(500).send('Servor error')
		}
		 inform1=JSON.stringify(inform1)    //先将result转化为String类型的数据
	  	  inform1=JSON.parse(inform1)
	Pfile.selectSql( sql2,function(err, inform2) {
		if(err){
			return res.status(500).send('Servor error')
		}
		 inform2=JSON.stringify(inform2)    //先将result转化为String类型的数据
	  	  inform2=JSON.parse(inform2)
	Pfile.selectSql( sql3,function(err, inform3) {
		if(err){
			return res.status(500).send('Servor error')
		}
		 inform3=JSON.stringify(inform3)    //先将result转化为String类型的数据
	  	  inform3=JSON.parse(inform3)
	  	    if(inform1.length==0)
		  	    {
		  	    	inform1[0].count1=0;
		  	    }
		  	    else{
		  	    	var ret1 = inform1 
			  	   	ret11=ret1[0];
			  	   	inform1[0].count1=ret11['count(1)']
		  	    }
		  	    if(inform2.length==0)
		  	    {
		  	    	inform1[0].count2=0;
		  	    }
		  	    else{
		  	    	var ret2 = inform2 
			  	   	ret22=ret2[0];
			  	   	inform1[0].count2=ret22['count(2)']
		  	    }
		  	    if(inform3.length==0)
		  	    {
		  	    	inform1[0].count3=0;
		  	    }
		  	    else{
		  	    	var ret3 = inform3
			  	   	ret33=ret3[0];
			  	   	inform1[0].count3=ret33['count(3)']
		  	    }
		  	    delete inform1[0]['count(1)']
//		  	    console.log(inform1[0])
	  	   res.render('detail/sjtj/dygatj.html',{
					inform1: inform1
				})
	 		})   
		})
	 })   
})
//党员关爱统计渲染图
router.get('/views/armcharts/samples/dygatj', function(req, res){
	var  sql1="SELECT count(1) FROM heart_help_poorpeople "
	var  sql2="SELECT count(2) FROM heart_educatepovertypeople "
	var  sql3="SELECT count(3) FROM vitalproblem_supervise_problem"
	
//	console.log(sql1)
	Pfile.selectSql( sql1,function(err, inform1) {
		if(err){
			return res.status(500).send('Servor error')
		}
		 inform1=JSON.stringify(inform1)    //先将result转化为String类型的数据
	  	  inform1=JSON.parse(inform1)
	Pfile.selectSql( sql2,function(err, inform2) {
		if(err){
			return res.status(500).send('Servor error')
		}
		 inform2=JSON.stringify(inform2)    //先将result转化为String类型的数据
	  	  inform2=JSON.parse(inform2)
	Pfile.selectSql( sql3,function(err, inform3) {
		if(err){
			return res.status(500).send('Servor error')
		}
		 inform3=JSON.stringify(inform3)    //先将result转化为String类型的数据
	  	  inform3=JSON.parse(inform3)
	  	    if(inform1.length==0)
		  	    {
		  	    	inform1[0].count1=0;
		  	    }
		  	    else{
		  	    	var ret1 = inform1 
			  	   	ret11=ret1[0];
			  	   	inform1[0].count1=ret11['count(1)']
		  	    }
		  	    if(inform2.length==0)
		  	    {
		  	    	inform1[0].count2=0;
		  	    }
		  	    else{
		  	    	var ret2 = inform2 
			  	   	ret22=ret2[0];
			  	   	inform1[0].count2=ret22['count(2)']
		  	    }
		  	    if(inform3.length==0)
		  	    {
		  	    	inform1[0].count3=0;
		  	    }
		  	    else{
		  	    	var ret3 = inform3
			  	   	ret33=ret3[0];
			  	   	inform1[0].count3=ret33['count(3)']
		  	    }
		  	    delete inform1[0]['count(1)']
//		  	    console.log(inform1[0])
	  	   res.render('armcharts/samples/dygatj.html',{
					inform1: inform1
				})
	 		})   
		})
	 })   
})
//党费缴纳统计
router.get('/views/detail/sjtj/dfjntj', function(req, res){
	var sql='SELECT belongPart FROM fee_collection GROUP BY belongPart '
	var sql1='SELECT belongPart,SUM(amount),COUNT(1) FROM fee_collection  WHERE STATUS="已缴纳" GROUP BY belongPart '
	var sql2='SELECT belongPart,SUM(amount),COUNT(2) FROM fee_collection  WHERE STATUS="未缴纳" GROUP BY belongPart '
//	console.log(sql1)
	Pfile.selectSql( sql,function(err, inform) {
		if(err){
			return res.status(500).send('Servor error')
		}
		  inform=JSON.stringify(inform)    //先将result转化为String类型的数据
	  	  inform=JSON.parse(inform)
	  	   
	  	Pfile.selectSql( sql1,function(err, inform1) {
		if(err){
			return res.status(500).send('Servor error')
		}
		  inform1=JSON.stringify(inform1)    //先将result转化为String类型的数据
	  	  inform1=JSON.parse(inform1)
	  	  var ret1 = inform1
	  	   for(var i=0;i<inform1.length;i++)
	  	   {
	  	   	ret=ret1[i];
	  	   	ret1[i].sum1=ret['SUM(amount)']
	  	   	ret1[i].count1=ret['COUNT(1)']
	  	   	for(var j=0;j<inform.length;j++)
	  	    { 
	  	    	if(inform[j].belongPart==inform1[i].belongPart)
	  	    	{
	  	    		inform[j].sum1=inform1[i].sum1
	  	    		inform[j].count1=inform1[i].count1
	  	    	}else{
	  	    		inform[j].sum1=0
	  	    		inform[j].count1=0
	  	    	}
	  	    }
	  	   }
	  	  console.log(inform1)
		 Pfile.selectSql( sql2,function(err, inform2) {
		if(err){
			return res.status(500).send('Servor error')
		}
		inform2=JSON.stringify(inform2)    //先将result转化为String类型的数据
	  	  inform2=JSON.parse(inform2)
	  	  var ret2 = inform2
	  	   for(var i=0;i<inform2.length;i++)
	  	   {
	  	   	ret=ret2[i];
	  	   	ret2[i].sum2=ret['SUM(amount)']
	  	   	ret2[i].count2=ret['COUNT(2)']
	  	   	for(var j=0;j<inform.length;j++)
	  	    { 
	  	    	if(inform[j].belongPart==inform2[i].belongPart)
	  	    	{
	  	    		inform[j].sum2=inform2[i].sum2
	  	    		inform[j].count2=inform2[i].count2
	  	    	}else{
	  	    		inform[j].sum2=0
	  	    		inform[j].count2=0
	  	    	}
	  	    }
	  	   }
	  	   console.log(inform2)
	  	   console.log(inform)
	  	   res.render('detail/sjtj/dfjntj.html',{
			inform: inform
			  })
	  	   })
	    })
	 })   
})
router.post('/views/detail/sjtj/dfjntj-search', function(req,res){
	res.redirect('/views/detail/sjtj/dfjntj')
})
//积分统计
router.get('/views/detail/sjtj/jftj', function(req, res){
		var  sql1="SELECT positionIt,name,integration,count(integration) FROM people_information  group by integration desc"
	console.log(sql1)
	Pfile.selectSql( sql1,function(err, inform) {
		if(err){
			return res.status(500).send('Servor error')
		}
		 inform=JSON.stringify(inform)    //先将result转化为String类型的数据
	  	  inform=JSON.parse(inform)
	  	   var ret1 = inform
	  	   for(var i=0;i<inform.length;i++)
	  	   {
	  	   	ret=ret1[i];
	  	   	ret1[i].num=ret['integration']
	  	   	delete inform[i]['count(integration)']
	  	   }
//	  	   console.log(inform)
	  	   res.render('detail/sjtj/jftj.html',{
			inform: inform
		})
	 })   
})
//干部培训统计
router.get('/views/detail/sjtj/gbpxtj', function(req, res){
	//res.render('center/center_left.html')
	//res.render('center.html')
	//res.render('admin.html')
	Pfile.find(function(err, people) {
		if(err){
			return res.status(500).send('Servor error')
		}
		res.render('detail/sjtj/gbpxtj.html',{
			people:people
		})
	})
})
//督察问题
router.get('/views/detail/sjtj/dcwt', function(req, res){
	var  sql1="SELECT category,institution,count(category) FROM vitalproblem_supervise_problem  group by institution"
//	console.log(sql1)
	Pfile.selectSql( sql1,function(err, inform) {
		if(err){
			return res.status(500).send('Servor error')
		}
		 inform=JSON.stringify(inform)    //先将result转化为String类型的数据
	  	  inform=JSON.parse(inform)  
	  	   var ret1 = inform
	  	   for(var i=0;i<inform.length;i++)
	  	   {
	  	   	ret=ret1[i];
	  	   	ret1[i].num=ret['count(category)']
	  	   	delete inform[i]['count(category)']
	  	   }
//	  	   console.log(inform)
	  	   res.render('detail/sjtj/dcwt.html',{
			inform: inform
		})
	 })   
})
//督察问题的图标渲染
router.get('/views/armcharts/samples/dcwt', function(req, res){
	var  sql1="SELECT category,institution,count(category) FROM vitalproblem_supervise_problem  group by institution"
//	console.log(sql1)
	Pfile.selectSql( sql1,function(err, inform) {
		if(err){
			return res.status(500).send('Servor error')
		}
		 inform=JSON.stringify(inform)    //先将result转化为String类型的数据
	  	  inform=JSON.parse(inform)  
	  	   var ret1 = inform
	  	   for(var i=0;i<inform.length;i++)
	  	   {
	  	   	ret=ret1[i];
	  	   	ret1[i].num=ret['count(category)']
	  	   	delete inform[i]['count(category)']
	  	   }
//	  	   console.log(inform)
	  	   res.render('armcharts/samples/dcwt.html',{
			inform: inform
		})
	 })   
})
/*
 * 网站管理
 */
//内容管理
router.get('/views/detail/wzgl/nrgl', function(req, res){
	var sql = 'SELECT * FROM web_ctrol_resourcectrol where type = "正文内容" order by id';
	Pfile.searchFile(sql,function(err, inform){
		if(err){
			return res.status(500).send('Servor error')
		}
		res.render('detail/wzgl/nrgl.html',{
			inform:inform
		})
	})	
})
//内容管理-------查询
router.post('/views/detail/wzgl/nrgl-search', function(req,res){
	var inform = req.body
	for(var key in inform){
		if(inform[key] == ''){
			delete inform[key]
		}
	}
	if(JSON.stringify(inform) == '{}'){
//		console.log('2333')
		res.redirect('/views/detail/wzgl/nrgl')
		return
	}
//	console.log(inform)
	var sql = "select * from web_ctrol_resourcectrol where " 
	var i = 0
	for(var key in inform){
		if (i == 0){
			sql += key + " like" + "\'"+"%"+inform[key]+"%"+"\'"
			i++
		} else {
			sql += "and " + key + " like" + "\'"+"%"+inform[key]+"%"+"\'"
		}
	}
//	console.log(sql)
	Pfile.selectSql(sql, function(err, inform) {
		if (err) {
			return res.status(500).send('Server error'+err.message)
		}
		res.render('detail/wzgl/nrgl.html', {
			inform: inform 
		})
	})
})
//网站管理-------目录树
router.get('/views/detail/wzgl/wzgl-tree', function(req, res){
	var sql = 'SELECT * FROM web_ctrol_resourcectrol where belongName ='  + req.query.name ;
//	console.log(sql)
	//onsole.log(sql)
	Pfile.searchFile(sql, function(err, inform){
		if(err){
			return res.status(500).send('Servor error'+err.message)
		}
		inform=JSON.stringify(inform)    //先将result转化为String类型的数据
		  	  inform=JSON.parse(inform)
//		  	  console.log(inform)
		res.render('detail/wzgl/nrgl.html',{
			inform:inform
		})
	})
})
//内容管理--------分类筛选-------推荐
router.get('/views/detail/wzgl/nrgl-tuijian', function(req, res){
	var sql = 'SELECT * FROM web_ctrol_resourcectrol where articleProperty = "推荐" and type = "正文内容"';
	Pfile.searchFile(sql,function(err, inform){
		if(err){
			return res.status(500).send('Servor error')
		}
		res.render('detail/wzgl/nrgl-tuijian.html',{
			inform:inform
		})
	})	
})
//内容管理--------分类筛选-------滚动
router.get('/views/detail/wzgl/nrgl-gundong', function(req, res){
	var sql = 'SELECT * FROM web_ctrol_resourcectrol where articleProperty = "滚动" and type = "正文内容"';
	Pfile.searchFile(sql,function(err, inform){
		if(err){
			return res.status(500).send('Servor error')
		}
		res.render('detail/wzgl/nrgl-gundong.html',{
			inform:inform
		})
	})	
})
//内容管理--------分类筛选-------幻灯
router.get('/views/detail/wzgl/nrgl-huandneg', function(req, res){
	var sql = 'SELECT * FROM web_ctrol_resourcectrol where articleProperty = "幻灯" and type = "正文内容"';
	Pfile.searchFile(sql,function(err, inform){
		if(err){
			return res.status(500).send('Servor error')
		}
		res.render('detail/wzgl/nrgl-huandeng.html',{
			inform:inform
		})
	})	
})
//内容管理--------分类筛选-------热门
router.get('/views/detail/wzgl/nrgl-remen', function(req, res){
	var sql = 'SELECT * FROM web_ctrol_resourcectrol where articleProperty = "热门" and type = "正文内容"';
	Pfile.searchFile(sql,function(err, inform){
		if(err){
			return res.status(500).send('Servor error')
		}
		res.render('detail/wzgl/nrgl-remen.html',{
			inform:inform
		})
	})	
})
//内容管理--------分类筛选-------头条
router.get('/views/detail/wzgl/nrgl-toutiao', function(req, res){
	var sql = 'SELECT * FROM web_ctrol_resourcectrol where articleProperty = "头条" and type = "正文内容"';
	Pfile.searchFile(sql,function(err, inform){
		if(err){
			return res.status(500).send('Servor error')
		}
		res.render('detail/wzgl/nrgl-toutiao.html',{
			inform:inform
		})
	})	
})
//内容管理--------分类筛选-------置顶
router.get('/views/detail/wzgl/nrgl-zhiding', function(req, res){
	var sql = 'SELECT * FROM web_ctrol_resourcectrol where articleProperty = "置顶" and type = "正文内容"';
	Pfile.searchFile(sql,function(err, inform){
		if(err){
			return res.status(500).send('Servor error')
		}
		res.render('detail/wzgl/nrgl-zhiding.html',{
			inform:inform
		})
	})	
})
//内容管理--------分类筛选-------外部链接
router.get('/views/detail/wzgl/nrgl-waibulianjie', function(req, res){
	var sql = 'SELECT * FROM web_ctrol_resourcectrol where articleProperty = "外部链接" and type = "正文内容"';
	Pfile.searchFile(sql,function(err, inform){
		if(err){
			return res.status(500).send('Servor error')
		}
		res.render('detail/wzgl/nrgl-waibulianjie.html',{
			inform:inform
		})
	})	
})
//内容管理--------分类筛选-------标题图片
router.get('/views/detail/wzgl/nrgl-biaotitupian', function(req, res){
	var sql = 'SELECT * FROM web_ctrol_resourcectrol where articleProperty = "标题图片" and type = "正文内容"';
	Pfile.searchFile(sql,function(err, inform){
		if(err){
			return res.status(500).send('Servor error')
		}
		res.render('detail/wzgl/nrgl-biaotitupian.html',{
			inform:inform
		})
	})	
})
//编辑新闻
router.get('/views/detail/wzgl/bluePencil', async(req,res)=>{
	var access_list = await get_accesslist(req);
	var aa=access_list.split(',')
	var i=0;
 	for(i=0;i<aa.length;i++)
	{
			console.log(aa[i]+"这是权限"+" " +"这是第"+i+"个权限"+"  "+aa.length)
			if(aa[i]=="87") {
//	var sql1='SELECT commen_userroleinf.loginAcc,commen_userpowerinfo.property,commen_userpowerinfo.people_ctrol FROM commen_userroleinf,commen_userpowerinfo  WHERE commen_userroleinf.property = commen_userpowerinfo.property and  commen_userroleinf.loginAcc='+"\'"+req.session.username+"\'"
//	console.log(sql1)
//	connection.query(sql1,function (err,result) {
//	  if(err){
//	    return err;
//	  }
//	  result=JSON.stringify(result)    //先将result转化为String类型的数据
//	  result=JSON.parse(result) 
// var aa=result[0].people_ctrol
//	aa.split(',')
//	for(var i=0;i<aa.length;i++)
//	{
//		if(aa[i]=='97')
//		{
//			console.log(req.query)
	var sql = 'SELECT * FROM web_ctrol_resourcectrol where id = '+req.query.id;
	Pfile.searchById(sql, parseInt(req.query.id), function (err, inform) {
		if (err) {
			return res.status(500).send('Server error')
		}
		//console.log(inform)
		res.render('detail/wzgl/bluePencil.html', {
			inform: inform,
			data: ''
		})
	})
//		}
//		else
//		{
//			return res.send("你没有此权限")
//		}
//	}
//	})
				break;
            }
	}

                if (i == (aa.length)) {
                    return res.send("你没有此操作权限")
                }
})
router.post('/views/detail/wzgl/bluePencil', function(req, res){
	var inform = req.body
	var editsql = "update web_ctrol_resourcectrol set belongPart =" +"\'" + inform.belongPart + "\'"
	+ "," + "belongName=" +"\'" + inform.belongName + "\'"
	+ "," + "upTitle=" +"\'" + inform.upTitle + "\'"
	+ "," + "downTitle=" +"\'" + inform.downTitle + "\'"
	+ "," + "title=" +"\'" + inform.title + "\'"
	+ "," + "author=" +"\'" + inform.author + "\'"
	+ "," + "webEdit=" +"\'" + inform.webEdit + "\'"
	+ "," + "originUrl=" +"\'" + inform.originUrl + "\'"
	+ "," + "origin=" +"\'" + inform.origin + "\'"
	+ "," + "keywords=" +"\'" + inform.keywords + "\'"
	+ "," + "des=" +"\'" + inform.des + "\'"
	+ "," + "showTime=" +"\'" + inform.showTime+ "\'"
	+ "," + "enterTime=" +"\'" + inform.enterTime + "\'"
	+ "," + "replyOrg=" +"\'" + inform.repyOrg + "\'"
	+ "," + "articleProperty=" +"\'" + inform.articleProperty + "\'"
	+ "," + "status=" +"\'" + "未审核" + "\'"
	+ "," + "clickCount=" +"\'" + 0 + "\'"
	+ "," + "content=" +"\'" + inform.content + "\'"
	+ "," + "type=" +"\'" + "正文内容" + "\'"
	+ "," + "shareIt=" +"\'" + inform.shareIt + "\'"
//	/+ "," + "titleImg=" +"\'" + inform.titleImg + "\'"
	+"where id=" + inform.id;
//console.log(people.id)
//console.log(editsql)
	Pfile.editById(editsql, function(err){
		if(err) {
			return res.status(500).send('Server error'+err.message)	
		}
		res.redirect('/views/detail/wzgl/nrgl')
	})
})
////编辑完成
//router.get('/views/detail/wzgl/nrgl/edit', function(req, res){
//	var editsql = "update web_ctrol_resourcectrol set content="+"\'"+req.query.data+"\'"
// +"where id=" + req.query.id 
//	Pfile.editById(editsql, function(err, inform) {
//		if(err){
//			return res.status(500).send('Servor error')
//		}
//		res.redirect('/views/detail/wzgl/nrgl')
//	})
//})
//新闻预览
router.get('/views/interviews/zzgl/new-template', function(req, res){
	var getId = parseInt(req.query.id)
	var sql = 'SELECT * FROM web_ctrol_resourcectrol where id = ' + getId;
//	console.log(sql)
	Pfile.searchById(sql, getId,function(err, inform) {
		if(err){
			return res.status(500).send('Servor error')
		}
		res.render('interviews/zzgl/news-template.html',{
			inform: inform
		})
	})
})
//删除
router.get('/views/detail/wzgl/delete', async(req,res)=>{
	var access_list = await get_accesslist(req);
	var aa=access_list.split(',')
	var i=0;
 	for(i=0;i<aa.length;i++)
	{
			console.log(aa[i]+"这是权限"+" " +"这是第"+i+"个权限"+"  "+aa.length)
			if(aa[i]=="88") {

//	var sql1='SELECT commen_userroleinf.loginAcc,commen_userpowerinfo.property,commen_userpowerinfo.people_ctrol FROM commen_userroleinf,commen_userpowerinfo  WHERE commen_userroleinf.property = commen_userpowerinfo.property and  commen_userroleinf.loginAcc='+"\'"+req.session.username+"\'"
//	console.log(sql1)
//	connection.query(sql1,function (err,result) {
//	  if(err){
//	    return err;
//	  }
//	  result=JSON.stringify(result)    //先将result转化为String类型的数据
//	  result=JSON.parse(result) 
// var aa=result[0].people_ctrol
//	aa.split(',')
//  for(var i=0;i<aa.length;i++)
//  {
//  	if(aa[i]=='98')
//  	{
	var selectId = req.query.id.split(",")
		var delsql = 'DELETE FROM web_ctrol_resourcectrol where id ='
		for(var i = 0; i < selectId.length; i++){
			if(i == 0){
				delsql += selectId[i]
			} else {
				delsql += " or id = " + selectId[i]
			}
		}
//	console.log(delsql)
	Pfile.deleteSql(delsql, getId,function(err, inform) {
		if(err){
			return res.status(500).send('Servor error')
		}
		return res.redirect('/views/detail/wzgl/nrgl')
	})
//  	}
//  	else
//  	{
//  		return res.send("你没有此权限")
//  	}
//  }
//	})
				break;
            }
	}

                if (i == (aa.length)) {
                    return res.send("你没有此操作权限")
                }
})
//保存到草稿箱/views/detail/wzgl/nrgl-passOnDraft
router.post('/views/detail/wzgl/nrgl-passOnDraft', function(req, res){
	var inform = req.body
	var editsql = "update web_ctrol_resourcectrol set type =" +"\'" + "草稿箱" + "\'"
	+"where id=" + inform.id;
//console.log(people.id)
//console.log(editsql)
	Pfile.editById(editsql, function(err){
		if(err) {
			return res.status(500).send('Server error'+err.message)	
		}
		res.redirect('/views/detail/wzgl/nrgl')
	})
})
//新增
router.get('/views/detail/wzgl/new', async(req,res)=>{
	var access_list = await get_accesslist(req);
	var aa=access_list.split(',')
	var i=0;
 	for(i=0;i<aa.length;i++)
	{
			console.log(aa[i]+"这是权限"+" " +"这是第"+i+"个权限"+"  "+aa.length)
			if(aa[i]=="86") {
	res.render('detail/wzgl/nrgl-new.html')
				break;
            }
	}

                if (i == (aa.length)) {
                    return res.send("你没有此操作权限")
                }
})
router.post('/views/detail/wzgl/new', function(req, res){
	var inform = req.body
	var maxid = "select max(id) from web_ctrol_resourcectrol"
		//console.log(maxid)
		connection.query(maxid,function (err,result) {
		  if(err){
		    return err;
		  }
		  result=JSON.stringify(result)    //先将result转化为String类型的数据
	  	  result=JSON.parse(result)
	  	  var ret = result[0]
		  var peopleId = ret['max(id)'] + 1
//		  	console.log('233')

			var editsql = "insert into web_ctrol_resourcectrol values("
					 + peopleId  + ","
					  + "\'" + inform.belongPart + "\'" + "," 
					   +"\'" + inform.belongName + "\'" + ","	
					   + "\'" + inform.upTitle+ "\'"+"," 
					   + "\'" + inform.downTitle+ "\'"+"," 
					   +"\'" + inform.title+ "\'" + "," 
					   + "\'" + inform.author + "\'" + ","
					    + "\'" + inform.webEdit + "\'" +  ","
					      + "\'" + inform.originUrl+ "\'"+"," 
					        + "\'" + inform.origin+ "\'"+"," 
					         + "\'" + inform.keywords+ "\'"+"," 
					          + "\'" + inform.des+ "\'"+"," 
					           + "\'" + "暂未发布"+ "\'"+"," 
					            + "\'" + inform.enterTime+ "\'"+"," 
					             + "\'" + inform.replyOrg+ "\'"+"," 
					              + "\'" + inform.articleProperty+ "\'"+"," 
					              + "\'" + "未审核"+ "\'"+"," 
					              + "\'" + inform.clickCount+ "\'"+","
					              + "\'" + inform.content+ "\'"+"," 
					              + "\'" + "正文内容"+ "\'"+"," 
					              + "\'" + inform.shareIt+ "\'"+"," 
					         	  + "\'" + inform.titleImg+ "\'"+ ")"
		//console.log(people.id)
//		console.log(editsql)
			Pfile.increaseSql(editsql, function(err){
				if(err) {
					return res.status(500).send('Server error'+err.message)	
				}
				res.redirect('/views/detail/wzgl/nrgl')
			})
					 
		})
})
//新增保存到草稿箱
router.post('/views/detail/wzgl/nrgl-draft', function(req, res){
	var inform = req.body
	var maxid = "select max(id) from web_ctrol_resourcectrol"
		//console.log(maxid)
		connection.query(maxid,function (err,result) {
		  if(err){
		    return err;
		  }
		  result=JSON.stringify(result)    //先将result转化为String类型的数据
	  	  result=JSON.parse(result)
	  	  var ret = result[0]
		  var peopleId = ret['max(id)'] + 1
//		  	console.log('233')

			var editsql = "insert into web_ctrol_resourcectrol values("
					 + peopleId  + ","
					  + "\'" + inform.belongPart + "\'" + "," 
					   +"\'" + inform.belongName + "\'" + ","	
					   + "\'" + inform.upTitle+ "\'"+"," 
					   + "\'" + inform.downTitle+ "\'"+"," 
					   +"\'" + inform.title+ "\'" + "," 
					   + "\'" + inform.author + "\'" + ","
					    + "\'" + inform.webEdit + "\'" +  ","
					      + "\'" + inform.originUrl+ "\'"+"," 
					        + "\'" + inform.origin+ "\'"+"," 
					         + "\'" + inform.keywords+ "\'"+"," 
					          + "\'" + inform.des+ "\'"+"," 
					           + "\'" + "暂未发布"+ "\'"+"," 
					            + "\'" + inform.enterTime+ "\'"+"," 
					             + "\'" + inform.replyOrg+ "\'"+"," 
					              + "\'" + inform.articleProperty+ "\'"+"," 
					              + "\'" + "未审核"+ "\'"+"," 
					              + "\'" + inform.clickCount+ "\'"+","
					              + "\'" + inform.content+ "\'"+"," 
					              + "\'" + "草稿箱"+ "\'"+"," 
					              + "\'" + inform.shareIt+ "\'"+"," 
					         	  + "\'" + inform.titleImg+ "\'"+ ")"
		//console.log(people.id)
//		console.log(editsql)
			Pfile.increaseSql(editsql, function(err){
				if(err) {
					return res.status(500).send('Server error'+err.message)	
				}
				res.redirect('/views/detail/wzgl/nrgl')
			})
					 
		})
})
//审核
router.get('/views/detail/wzgl/nrgl-exam', async(req,res)=>{
	var access_list = await get_accesslist(req);
	var aa=access_list.split(',')
	var i=0;
 	for(i=0;i<aa.length;i++)
	{
			console.log(aa[i]+"这是权限"+" " +"这是第"+i+"个权限"+"  "+aa.length)
			if(aa[i]=="89") {
	var getId = req.query.id
	var editsql = "update web_ctrol_resourcectrol set status=" +"\'" + "已审核" + "\'" + "where id=" + getId;
//	console.log(editsql)
	Pfile.editById(editsql, function(err, inform) {
		if(err){
			return res.status(500).send('Servor error')
		}
		res.redirect('/views/detail/wzgl/nrgl')
	})
				break;
            }
	}

                if (i == (aa.length)) {
                    return res.send("你没有此操作权限")
                }
})
//撤销审核
router.get('/views/detail/wzgl/nrgl-noexam', async(req,res)=>{
	var access_list = await get_accesslist(req);
	var aa=access_list.split(',')
	var i=0;
 	for(i=0;i<aa.length;i++)
	{
			console.log(aa[i]+"这是权限"+" " +"这是第"+i+"个权限"+"  "+aa.length)
			if(aa[i]=="90") {
	var getId = req.query.id
	var editsql = "update web_ctrol_resourcectrol set status=" +"\'" + "未审核" + "\'" + "where id=" + getId;
//	console.log(editsql)
	Pfile.editById(editsql, function(err, inform) {
		if(err){
			return res.status(500).send('Servor error')
		}
		res.redirect('/views/detail/wzgl/nrgl')
	})
				break;
            }
	}

                if (i == (aa.length)) {
                    return res.send("你没有此操作权限")
                }
})
//发布
router.get('/views/detail/wzgl/nrgl-publish', async(req,res)=>{
	var access_list = await get_accesslist(req);
	var aa=access_list.split(',')
	var i=0;
 	for(i=0;i<aa.length;i++)
	{
			console.log(aa[i]+"这是权限"+" " +"这是第"+i+"个权限"+"  "+aa.length)
			if(aa[i]=="91") {

	var getId = req.query.id
	 //获取流动时间
		  var date = new Date();
	        var seperator1 = "-";
	        var year = date.getFullYear();
	        var month = date.getMonth() + 1;
	        var strDate = date.getDate();
	        if (month >= 1 && month <= 9) {
	            month = "0" + month;
	        }
	        if (strDate >= 0 && strDate <= 9) {
	            strDate = "0" + strDate;
	        }
	        var currentdate = year + seperator1 + month + seperator1 + strDate;
	
	var editsql = "update web_ctrol_resourcectrol set status=" +"\'" + "已发布" + "\'"
	+ "," + "showTime=" +"\'" + currentdate + "\'"
	+ "where id=" + getId;
//	console.log(editsql)
	Pfile.editById(editsql, function(err, inform) {
		if(err){
			return res.status(500).send('Servor error')
		}
		res.redirect('/views/detail/wzgl/nrgl')
	})
				break;
            }
	}

                if (i == (aa.length)) {
                    return res.send("你没有此操作权限")
                }
})
//撤销发布
router.get('/views/detail/wzgl/nrgl-publishOff', async(req,res)=>{
	var access_list = await get_accesslist(req);
	var aa=access_list.split(',')
	var i=0;
 	for(i=0;i<aa.length;i++)
	{
			console.log(aa[i]+"这是权限"+" " +"这是第"+i+"个权限"+"  "+aa.length)
			if(aa[i]=="92") {

	var getId = req.query.id
	var editsql = "update web_ctrol_resourcectrol set status=" +"\'" + "已审核" + "\'" + "where id=" + getId;
//	console.log(editsql)
	Pfile.editById(editsql, function(err, inform) {
		if(err){
			return res.status(500).send('Servor error')
		}
		res.redirect('/views/detail/wzgl/nrgl')
	})
				break;
            }
	}

                if (i == (aa.length)) {
                    return res.send("你没有此操作权限")
                }
})
//草稿箱
router.get('/views/detail/wzgl/cgx', function(req, res){
	var sql = 'SELECT * FROM web_ctrol_resourcectrol where type="草稿箱"';
//	console.log(sql)
	Pfile.searchFile(sql,function(err, inform){
		if(err){
			return res.status(500).send('Servor error')
		}
		res.render('detail/wzgl/draft.html',{
			inform:inform
		})
	})	
})
//草稿箱------------查询
router.post('/views/detail/wzgl/draft-search', function(req,res){
	var inform = req.body
	for(var key in inform){
		if(inform[key] == ''){
			delete inform[key]
		}
	}
	if(JSON.stringify(inform) == '{}'){
//		console.log('2333')
		res.redirect('/views/detail/wzgl/cgx')
		return
	}
//	console.log(inform)
	var sql = "select * from web_ctrol_resourcectrol where " 
	var i = 0
	for(var key in inform){
		if (i == 0){
			sql += key + " like" + "\'"+"%"+inform[key]+"%"+"\'"
			i++
		} else {
			sql += "and " + key + " like" + "\'"+"%"+inform[key]+"%"+"\'"
		}
	}
	sql += ' and type = "草稿箱"'
	//console.log(sql)
	Pfile.selectSql(sql, function(err, inform) {
		if (err) {
			return res.status(500).send('Server error'+err.message)
		}
		res.render('detail/wzgl/draft.html', {
			inform: inform 
		})
	})
})
//草稿箱--------分类筛选-------推荐
router.get('/views/detail/wzgl/draft-tuijian', function(req, res){
	var sql = 'SELECT * FROM web_ctrol_resourcectrol where articleProperty = "推荐" and type = "草稿箱"';
	Pfile.searchFile(sql,function(err, inform){
		if(err){
			return res.status(500).send('Servor error')
		}
		res.render('detail/wzgl/draft-tuijian.html',{
			inform:inform
		})
	})	
})
//草稿箱--------分类筛选-------滚动
router.get('/views/detail/wzgl/draft-gundong', function(req, res){
	var sql = 'SELECT * FROM web_ctrol_resourcectrol where articleProperty = "滚动" and type = "草稿箱"';
	Pfile.searchFile(sql,function(err, inform){
		if(err){
			return res.status(500).send('Servor error')
		}
		res.render('detail/wzgl/draft-gundong.html',{
			inform:inform
		})
	})	
})
//草稿箱--------分类筛选-------幻灯
router.get('/views/detail/wzgl/draft-huandeng', function(req, res){
	var sql = 'SELECT * FROM web_ctrol_resourcectrol where articleProperty = "幻灯" and type = "草稿箱"';
	Pfile.searchFile(sql,function(err, inform){
		if(err){
			return res.status(500).send('Servor error')
		}
		res.render('detail/wzgl/draft-huandeng.html',{
			inform:inform
		})
	})	
})
//草稿箱--------分类筛选-------热门
router.get('/views/detail/wzgl/draft-remen', function(req, res){
	var sql = 'SELECT * FROM web_ctrol_resourcectrol where articleProperty = "热门" and type = "草稿箱"';
	Pfile.searchFile(sql,function(err, inform){
		if(err){
			return res.status(500).send('Servor error')
		}
		res.render('detail/wzgl/draft-remen.html',{
			inform:inform
		})
	})	
})
//草稿箱--------分类筛选-------头条
router.get('/views/detail/wzgl/draft-toutiao', function(req, res){
	var sql = 'SELECT * FROM web_ctrol_resourcectrol where articleProperty = "头条" and type = "草稿箱"';
	Pfile.searchFile(sql,function(err, inform){
		if(err){
			return res.status(500).send('Servor error')
		}
		res.render('detail/wzgl/draft-toutiao.html',{
			inform:inform
		})
	})	
})
//草稿箱--------分类筛选-------置顶
router.get('/views/detail/wzgl/draft-zhiding', function(req, res){
	var sql = 'SELECT * FROM web_ctrol_resourcectrol where articleProperty = "置顶" and type = "草稿箱"';
	Pfile.searchFile(sql,function(err, inform){
		if(err){
			return res.status(500).send('Servor error')
		}
		res.render('detail/wzgl/draft-zhiding.html',{
			inform:inform
		})
	})	
})
//草稿箱--------分类筛选-------外部链接
router.get('/views/detail/wzgl/draft-waibulianjie', function(req, res){
	var sql = 'SELECT * FROM web_ctrol_resourcectrol where articleProperty = "外部链接" and type = "草稿箱"';
	Pfile.searchFile(sql,function(err, inform){
		if(err){
			return res.status(500).send('Servor error')
		}
		res.render('detail/wzgl/draft-waibulianjie.html',{
			inform:inform
		})
	})	
})
//草稿箱--------分类筛选-------标题图片
router.get('/views/detail/wzgl/draft-biaotitupian', function(req, res){
	var sql = 'SELECT * FROM web_ctrol_resourcectrol where articleProperty = "标题图片" and type = "草稿箱"';
	Pfile.searchFile(sql,function(err, inform){
		if(err){
			return res.status(500).send('Servor error')
		}
		res.render('detail/wzgl/draft-biaotitupian.html',{
			inform:inform
		})
	})	
})
//草稿箱-------从草稿箱删除
router.get('/views/detail/wzgl/draft-delete', function(req, res){
	var selectId = req.query.id.split(",")
		var delsql = 'DELETE FROM web_ctrol_resourcectrol where id ='
		for(var i = 0; i < selectId.length; i++){
			if(i == 0){
				delsql += selectId[i]
			} else {
				delsql += " or id = " + selectId[i]
			}
		}
//	console.log(delsql)
	Pfile.deleteSql(delsql, req.query.id, function(err) {
		if(err) {
			return res.status(500).send('Server error'+err.message)	
		}
		res.redirect('/views/detail/wzgl/cgx')
	})
})
//经验交流
router.get('/views/detail/wzgl/jyjl', function(req, res){
	var sql = 'SELECT * FROM web_ctrol_experience';
	connection.query(sql,function (err,inform) {
	  if(err){
	    return callback(err);
	  }
	res.render('detail/wzgl/jyjl.html', {
			inform: inform
		})
	})
})
//经验交流--------修改
router.get('/views/detail/wzgl/jyjl-edit', function(req, res){
	var sql = 'SELECT * FROM web_ctrol_experience where id =' + req.query.id;
	Pfile.searchById(sql,parseInt(req.query.id), function (err, inform) {
		if (err) {
			return res.status(500).send('Server error'+err.message)
		}
		res.render('detail/wzgl/jyjl-edit.html', {
			inform: inform 
		})
	})
})
router.post('/views/detail/wzgl/jyjl-edit', function(req, res){
	var inform = req.body
	var editsql = "update web_ctrol_experience set name =" +"\'" + inform.name + "\'"
	+ "," + "gender=" +"\'" + inform.gender + "\'"
	+ "," + "idCardNum=" +"\'" + inform.idCardNum + "\'"
	+ "," + "phoneNum=" +"\'" + inform.phoneNum	 + "\'"
	+ "," + "title=" +"\'" + inform.title + "\'"
	+ "," + "createTime=" +"\'" + inform.createTime + "\'"
	+ "," + "content=" +"\'" + inform.content + "\'"
	+" where id=" + inform.id;
//	console.log(editsql)
	Pfile.editById(editsql, function(err){
		if(err) {
			return res.status(500).send('Server error'+err.message)	
		}
		res.redirect('/views/detail/wzgl/jyjl')
	})
})
//经验交流-----删除
router.get('/views/detail/wzgl/jyjl-delete', function(req, res){
	var selectId = req.query.id.split(",")
		var delsql = 'DELETE FROM web_ctrol_experience where id ='
		for(var i = 0; i < selectId.length; i++){
			if(i == 0){
				delsql += selectId[i]
			} else {
				delsql += " or id = " + selectId[i]
			}
		}
//	console.log(delsql)
	Pfile.deleteSql(delsql, req.query.id, function(err) {
		if(err) {
			return res.status(500).send('Server error'+err.message)	
		}
		res.redirect('/views/detail/wzgl/jyjl')
	})
})
//经验交流-------查询
router.post('/views/detail/wzgl/jyjl-search', function(req,res){
	var inform = req.body
	for(var key in inform){
		if(inform[key] == ''){
			delete inform[key]
		}
	}
	if(JSON.stringify(inform) == '{}'){
//		console.log('2333')
		res.redirect('/views/detail/wzgl/jyjl')
		return
	}
//	console.log(inform)
	var sql = "select * from web_ctrol_experience where " 
	var i = 0
	for(var key in inform){
		if (i == 0){
			sql += key + " like" + "\'"+"%"+inform[key]+"%"+"\'"
			i++
		} else {
			sql += "and " + key + " like" + "\'"+"%"+inform[key]+"%"+"\'"
		}
	}
//	console.log(sql)
	Pfile.selectSql(sql, function(err, inform) {
		if (err) {
			return res.status(500).send('Server error'+err.message)
		}
		res.render('detail/wzgl/jyjl.html', {
			inform: inform 
		})
	})
})
//信息共享--------分类筛选-------推荐
router.get('/views/detail/wzgl/xxgx-tuijian', function(req, res){
	var sql = 'SELECT * FROM web_ctrol_sharing where articleProperty = "推荐"';
	Pfile.searchFile(sql,function(err, inform){
		if(err){
			return res.status(500).send('Servor error')
		}
		res.render('detail/wzgl/xxgx-tuijian.html',{
			inform:inform
		})
	})	
})
//信息共享--------分类筛选-------滚动
router.get('/views/detail/wzgl/xxgx-gundong', function(req, res){
	var sql = 'SELECT * FROM web_ctrol_sharing where articleProperty = "滚动"';
	Pfile.searchFile(sql,function(err, inform){
		if(err){
			return res.status(500).send('Servor error')
		}
		res.render('detail/wzgl/xxgx-gundong.html',{
			inform:inform
		})
	})	
})
//信息共享--------分类筛选-------幻灯
router.get('/views/detail/wzgl/xxgx-huandeng', function(req, res){
	var sql = 'SELECT * FROM web_ctrol_sharing where articleProperty = "幻灯"';
	Pfile.searchFile(sql,function(err, inform){
		if(err){
			return res.status(500).send('Servor error')
		}
		res.render('detail/wzgl/xxgx-huandeng.html',{
			inform:inform
		})
	})	
})
//信息共享--------分类筛选-------热门
router.get('/views/detail/wzgl/xxgx-remen', function(req, res){
	var sql = 'SELECT * FROM web_ctrol_sharing where articleProperty = "热门"';
	Pfile.searchFile(sql,function(err, inform){
		if(err){
			return res.status(500).send('Servor error')
		}
		res.render('detail/wzgl/xxgx-remen.html',{
			inform:inform
		})
	})	
})
//信息共享--------分类筛选-------头条
router.get('/views/detail/wzgl/xxgx-toutiao', function(req, res){
	var sql = 'SELECT * FROM web_ctrol_sharing where articleProperty = "头条"';
	Pfile.searchFile(sql,function(err, inform){
		if(err){
			return res.status(500).send('Servor error')
		}
		res.render('detail/wzgl/xxgx-toutiao.html',{
			inform:inform
		})
	})	
})
//信息共享--------分类筛选-------置顶
router.get('/views/detail/wzgl/xxgx-zhiding', function(req, res){
	var sql = 'SELECT * FROM web_ctrol_sharing where articleProperty = "置顶"';
	Pfile.searchFile(sql,function(err, inform){
		if(err){
			return res.status(500).send('Servor error')
		}
		res.render('detail/wzgl/xxgx-zhiding.html',{
			inform:inform
		})
	})	
})
//信息共享--------分类筛选-------外部链接
router.get('/views/detail/wzgl/xxgx-waibulianjie', function(req, res){
	var sql = 'SELECT * FROM web_ctrol_sharing where articleProperty = "外部链接"';
	Pfile.searchFile(sql,function(err, inform){
		if(err){
			return res.status(500).send('Servor error')
		}
		res.render('detail/wzgl/xxgx-waibulianjie.html',{
			inform:inform
		})
	})	
})
//信息共享--------分类筛选-------标题图片
router.get('/views/detail/wzgl/xxgx-biaotitupian', function(req, res){
	var sql = 'SELECT * FROM web_ctrol_sharing where articleProperty = "标题图片"';
	Pfile.searchFile(sql,function(err, inform){
		if(err){
			return res.status(500).send('Servor error')
		}
		res.render('detail/wzgl/xxgx-biaotitupian.html',{
			inform:inform
		})
	})	
})
//经验交流-------审核
router.get('/views/detail/wzgl/jyjl-examine', function(req, res){
	var people = req.query
	var editsql = "update web_ctrol_experience set status =" +"\'" + "已审核" + "\'"
	+"where id=" + people.id;
//console.log(people.id)
//console.log(editsql)
	Pfile.editById(editsql, function(err){
		if(err) {
			return res.status(500).send('Server error'+err.message)	
		}
		res.redirect('/views/detail/wzgl/jyjl')
	})
})
//经验交流-------新增
router.get('/views/detail/wzgl/jyjl-new', function(req, res) {
	res.render('detail/wzgl/jyjl-new.html')
})
router.post('/views/detail/wzgl/jyjl-new', function(req, res){
	//console.log(req.body)
	var inform=req.body
		var maxid = "select max(id) from web_ctrol_experience"
			//console.log(maxid)
			connection.query(maxid,function (err,result) {
			  if(err){
			    return err;
			  }
			  result=JSON.stringify(result)    //先将result转化为String类型的数据
		  	  result=JSON.parse(result)
		  	  var ret = result[0]
			  var id = ret['max(id)'] + 1
	
			var sql = "insert into web_ctrol_experience values("
					 + id  + ","
					  + "\'" + inform.name + "\'" + "," 
					   +"\'" + inform.gender + "\'" + ","
					    +"\'" + inform.idCardNum + "\'" + ","
					     +"\'" + inform.phoneNum + "\'" + ","
					      +"\'" + inform.title + "\'" + ","
					       +"\'" + inform.createTime + "\'" + ","
					        +"\'" + "未审核" + "\'" + ","
					        +"\'" + inform.content + "\'"+ ")"
//					         console.log(sql)
			Pfile.increaseSql(sql,  function (err, inform) {
				if (err) {
					return res.status(500).send('Server error'+err.message)
				}
				res.redirect('/views/detail/wzgl/jyjl')
			})
		})	
})
//信息共享
router.get('/views/detail/wzgl/xxgx', function(req, res){
	var sql = 'SELECT * FROM web_ctrol_resourcectrol where shareIt = "是"';
	connection.query(sql,function (err,inform) {
	  if(err){
	    return callback(err);
	  }
	res.render('detail/wzgl/xxgx.html', {
			inform: inform
		})
	})
})
//信息共享--------修改
router.get('/views/detail/wzgl/xxgx-edit', function(req, res){
	var sql = 'SELECT * FROM web_ctrol_resourcectrol where id =' + req.query.id;
	Pfile.searchById(sql,parseInt(req.query.id), function (err, inform) {
		if (err) {
			return res.status(500).send('Server error'+err.message)
		}
		res.render('detail/wzgl/xxgx-edit.html', {
			inform: inform 
		})
	})
})
router.post('/views/detail/wzgl/xxgx-edit', function(req, res){
	var inform = req.body
	var editsql = "update web_ctrol_resourcectrol set title =" +"\'" + inform.title + "\'"
	+ "," + "belongName=" +"\'" + inform.belongName + "\'"
	+ "," + "webEdit=" +"\'" + inform.webEdit + "\'"
	+ "," + "showTime=" +"\'" + inform.showTime	 + "\'"
	+ "," + "enterTime=" +"\'" + inform.enterTime + "\'"
	+ "," + "articleProperty=" +"\'" + inform.articleProperty + "\'"
	+ "," + "status=" +"\'" + "未审核" + "\'"
	+ "," + "clickCount=" +"\'" + 0 + "\'"
	+ "," + "content=" +"\'" + inform.content + "\'"
	+" where id=" + inform.id;
//	console.log(editsql)
	Pfile.editById(editsql, function(err){
		if(err) {
			return res.status(500).send('Server error'+err.message)	
		}
		res.redirect('/views/detail/wzgl/xxgx')
	})
})
//信息共享-----删除
router.get('/views/detail/wzgl/xxgx-delete', function(req, res){
	var selectId = req.query.id.split(",")
		var delsql = 'DELETE FROM web_ctrol_resourcectrol where id ='
		for(var i = 0; i < selectId.length; i++){
			if(i == 0){
				delsql += selectId[i]
			} else {
				delsql += " or id = " + selectId[i]
			}
		}
//	console.log(delsql)
	Pfile.deleteSql(delsql, req.query.id, function(err) {
		if(err) {
			return res.status(500).send('Server error'+err.message)	
		}
		res.redirect('/views/detail/wzgl/xxgx')
	})
})
//信息共享-------初审
router.get('/views/detail/wzgl/xxgx-examine', function(req, res){
	var people = req.query
	var editsql = "update web_ctrol_resourcectrol set status =" +"\'" + "已初审" + "\'"
	+"where id=" + people.id;
//console.log(people.id)
//console.log(editsql)
	Pfile.editById(editsql, function(err){
		if(err) {
			return res.status(500).send('Server error'+err.message)	
		}
		res.redirect('/views/detail/wzgl/xxgx')
	})
})
//信息共享-------撤销初审
router.get('/views/detail/wzgl/xxgx-examineOff', function(req, res){
	var people = req.query
	var editsql = "update web_ctrol_resourcectrol set status =" +"\'" + "未审核" + "\'"
	+"where id=" + people.id;
//console.log(people.id)
//console.log(editsql)
	Pfile.editById(editsql, function(err){
		if(err) {
			return res.status(500).send('Server error'+err.message)	
		}
		res.redirect('/views/detail/wzgl/xxgx')
	})
})
//信息共享-------查询
router.post('/views/detail/wzgl/xxgx-search', function(req,res){
	var inform = req.body
	for(var key in inform){
		if(inform[key] == ''){
			delete inform[key]
		}
	}
	if(JSON.stringify(inform) == '{}'){
//		console.log('2333')
		res.redirect('/views/detail/wzgl/xxgx')
		return
	}
//	console.log(inform)
	var sql = "select * from web_ctrol_resourcectrol where shareIt = '是' and " 
	var i = 0
	for(var key in inform){
		if (i == 0){
			sql += key + " like" + "\'"+"%"+inform[key]+"%"+"\'"
			i++
		} else {
			sql += "and " + key + " like" + "\'"+"%"+inform[key]+"%"+"\'"
		}
	}
//	console.log(sql)
	Pfile.selectSql(sql, function(err, inform) {
		if (err) {
			return res.status(500).send('Server error'+err.message)
		}
		res.render('detail/wzgl/xxgx.html', {
			inform: inform 
		})
	})
})
////信息共享-------新增
//router.get('/views/detail/wzgl/xxgx-new', function(req, res) {
//	res.render('detail/wzgl/xxgx-new.html')
//})
//router.post('/views/detail/wzgl/xxgx-new', function(req, res){
//	//console.log(req.body)
//	var inform=req.body
//		var maxid = "select max(id) from web_ctrol_experience"
//			//console.log(maxid)
//			connection.query(maxid,function (err,result) {
//			  if(err){
//			    return err;
//			  }
//			  result=JSON.stringify(result)    //先将result转化为String类型的数据
//		  	  result=JSON.parse(result)
//		  	  var ret = result[0]
//			  var id = ret['max(id)'] + 1
//	
//			var sql = "insert into web_ctrol_experience values("
//					 + id  + ","
//					  + "\'" + inform.name + "\'" + "," 
//					   +"\'" + inform.gender + "\'" + ","
//					    +"\'" + inform.idCardNum + "\'" + ","
//					     +"\'" + inform.phoneNum + "\'" + ","
//					      +"\'" + inform.title + "\'" + ","
//					       +"\'" + inform.createTime + "\'" + ","
//					        +"\'" + "未审核" + "\'" + ","
//					        +"\'" + inform.content + "\'"+ ")"
//					         console.log(sql)
//			Pfile.increaseSql(sql,  function (err, inform) {
//				if (err) {
//					return res.status(500).send('Server error'+err.message)
//				}
//				res.redirect('/views/detail/wzgl/xxgx')
//			})
//		})	
//})
//建言献策
router.get('/views/detail/wzgl/jyxc', function(req, res){
	var sql = 'SELECT * FROM web_ctrol_advice';
	connection.query(sql,function (err,inform) {
	  if(err){
	    return callback(err);
	  }
	res.render('detail/wzgl/jyxc.html', {
			inform: inform
		})
	})
})
//建言献策-------查询
router.post('/views/detail/wzgl/jyxc-search', function(req,res){
	var inform = req.body
	for(var key in inform){
		if(inform[key] == ''){
			delete inform[key]
		}
	}
	if(JSON.stringify(inform) == '{}'){
//		console.log('2333')
		res.redirect('/views/detail/wzgl/jyxc')
		return
	}
//	console.log(inform)
	var sql = "select * from web_ctrol_advice where " 
	var i = 0
	for(var key in inform){
		if (i == 0){
			sql += key + " like" + "\'"+"%"+inform[key]+"%"+"\'"
			i++
		} else {
			sql += "and " + key + " like" + "\'"+"%"+inform[key]+"%"+"\'"
		}
	}
//	console.log(sql)
	Pfile.selectSql(sql, function(err, inform) {
		if (err) {
			return res.status(500).send('Server error'+err.message)
		}
		res.render('detail/wzgl/jyxc.html', {
			inform: inform 
		})
	})
})
//建言献策-----删除
router.get('/views/detail/wzgl/jyxc-delete', function(req, res){
//	var sql1='SELECT commen_userroleinf.loginAcc,commen_userpowerinfo.property,commen_userpowerinfo.people_ctrol FROM commen_userroleinf,commen_userpowerinfo  WHERE commen_userroleinf.property = commen_userpowerinfo.property and  commen_userroleinf.loginAcc='+"\'"+req.session.username+"\'"
//	console.log(sql1)
//	connection.query(sql1,function (err,result) {
//	  if(err){
//	    return err;
//	  }
//	  result=JSON.stringify(result)    //先将result转化为String类型的数据
//	  result=JSON.parse(result) 
// var aa=result[0].people_ctrol
//	aa.split(',')
// for(var i=0;i<aa.length;i++)
// {
// 	if(aa[i]=='103')
// 	{
	
	var selectId = req.query.id.split(",")
		var delsql = 'DELETE FROM web_ctrol_advice where id ='
		for(var i = 0; i < selectId.length; i++){
			if(i == 0){
				delsql += selectId[i]
			} else {
				delsql += " or id = " + selectId[i]
			}
		}
//	console.log(delsql)
	Pfile.deleteSql(delsql, req.query.id, function(err) {
		if(err) {
			return res.status(500).send('Server error'+err.message)	
		}
		res.redirect('/views/detail/wzgl/jyxc')
	})
 //  	}
// 	else
// 	{
// 		return res.send("你没有此权限");
// 	}
// }
//	})
})
//建言献策-------审核
router.get('/views/detail/wzgl/jyxc-examine', function(req, res){
	var sql1='SELECT commen_userroleinf.loginAcc,commen_userpowerinfo.property,commen_userpowerinfo.people_ctrol FROM commen_userroleinf,commen_userpowerinfo  WHERE commen_userroleinf.property = commen_userpowerinfo.property and  commen_userroleinf.loginAcc='+"\'"+req.session.username+"\'"
//	console.log(sql1)
	connection.query(sql1,function (err,result) {
	  if(err){
	    return err;
	  }
	  result=JSON.stringify(result)    //先将result转化为String类型的数据
	  result=JSON.parse(result) 
 var aa=result[0].people_ctrol
	aa.split(',')
   for(var i=0;i<aa.length;i++)
   {
   	if(aa[i]=='104')
   	{
   		var people = req.query
	var editsql = "update web_ctrol_advice set status =" +"\'" + "已发布" + "\'"
	+"where id=" + people.id;
//console.log(people.id)
//console.log(editsql)
	Pfile.editById(editsql, function(err){
		if(err) {
			return res.status(500).send('Server error'+err.message)	
		}
		return res.redirect('/views/detail/wzgl/jyxc')
	})
   	}
   	else
   	{
   		return res.send("你没有此权限")
   	}
   }
	})
})
//建言献策-------撤销
router.get('/views/detail/wzgl/jyxc-examineOff', function(req, res){
	var sql1='SELECT commen_userroleinf.loginAcc,commen_userpowerinfo.property,commen_userpowerinfo.people_ctrol FROM commen_userroleinf,commen_userpowerinfo  WHERE commen_userroleinf.property = commen_userpowerinfo.property and  commen_userroleinf.loginAcc='+"\'"+req.session.username+"\'"
//	console.log(sql1)
	connection.query(sql1,function (err,result) {
	  if(err){
	    return err;
	  }
	  result=JSON.stringify(result)    //先将result转化为String类型的数据
	  result=JSON.parse(result) 
 var aa=result[0].people_ctrol
	aa.split(',')
  for(var i=0;i<aa.length;i++)
  {
  	if(aa[i]=='102')
  	{
  		var people = req.query
	var editsql = "update web_ctrol_advice set status =" +"\'" + "未发布" + "\'"
	+"where id=" + people.id;
//console.log(people.id)
//console.log(editsql)
	Pfile.editById(editsql, function(err){
		if(err) {
			return res.status(500).send('Server error'+err.message)	
		}
		res.redirect('/views/detail/wzgl/jyxc')
	})
  	}
  	else
  	{
  		return res.send("你没有此权限")
  	}
  }
	})
})
//互动交流
router.get('/views/detail/wzgl/hdjl', function(req, res){
//	var sql = 'SELECT * FROM web_ctrol_sharing';
//	connection.query(sql,function (err,inform) {
//	  if(err){
//	    return callback(err);
//	  }
//	res.render('detail/wzgl/xxgx.html', {
//			inform: inform
//		})
//	})
	res.render('detail/wzgl/hdjl.html')
})

 

router.get('/views/detail/wzgl/jyjl', function(req, res){
	res.render('detail/wzgl/jyjl.html')
})
router.get('/views/detail/wzgl/zxks', function(req, res){
	var sql = 'SELECT * FROM web_ctrol_inexam';
	connection.query(sql,function (err,inform) {
	  if(err){
	    return err;
	  }
	  	  inform=JSON.stringify(inform)    //先将result转化为String类型的数据
	  	  inform=JSON.parse(inform)
//	  console.log(people)
	return res.render('detail/wzgl/zxks.html', {
			inform:inform
		})
	})
//	res.render('detail/wzgl/zxks.html')
})
router.get('/views/detail/wzgl/lmgl', function(req, res){
	res.render('detail/wzgl/lmgl.html')
})

router.get('/views/detail/yhzx/yhlb', function(req, res){
	
	var sql = 'SELECT * from commen_userroleinf';
	var sql1="select * from  people_information"
	connection.query(sql,function (err,inform) {
	  if(err){
	    return err;
	  }
	  	  inform=JSON.stringify(inform)    //先将result转化为String类型的数据
	  	  inform=JSON.parse(inform)
//	  console.log(inform)
	connection.query(sql1,function (err,inform1) {
		  if(err){
		    return err;
		  }
		  	  inform1=JSON.stringify(inform1)    //先将result转化为String类型的数据
		  	  inform1=JSON.parse(inform1)
		  	  
		for(var i=0;i<inform.length;i++)
		{
			for(var j=0;j<inform1.length;j++)
			{
				if(inform[i].loginAcc==inform1[j].idCardNum)
				{
						  inform[i].name=inform1[j].name;
						  inform[i].phoneNum=inform1[j].phoneNum
						  inform[i].belongpart=inform1[j].belongpart; 
				}
			}
		}
		console.log(inform)
	return res.render('detail/yhzx/yhlb.html', {
			inform:inform
			})
		})
	})
})


//用户添加
router.post('/views/detail/yhzx/yhtj', async(req,res)=>{
	var access_list = await get_accesslist(req);
	var aa=access_list.split(',')
	var i=0;
 	for(i=0;i<aa.length;i++)
	{
			console.log(aa[i]+"这是权限"+" " +"这是第"+i+"个权限"+"  "+aa.length)
			if(aa[i]=="125") {
	var people = req.body
//	console.log(people)
	var add="insert into commen_userroleinf values("
			 +people.loginAcc + ","
			  + "\'" + "123456" + "\'" + "," 
			   +"\'" + "普通用户" + "\'" + ","
			    +"\'" + people.name + "\'" + ","
			   +"\'" + people.phoneNum + "\'" + "," 
			   + "\'" + people.des + "\'" + ","
			   + "\'" +"所属支部" + "\'" +  ","
			     + "\'" + people.status + "\'" +")"
console.log(add)
connection.query(add,function (err,people) {
	  if(err){
	    return err;
	  }
	  	  
	return res.redirect('/views/detail/yhzx/yhlb')
		
	})
				break;
            }
	}

                if (i == (aa.length)) {
                    return res.send("你没有此操作权限")
                }
	
})


////用户添加
//router.post('/views/detail/yhzx/yhtj', function(req,res){
//	var people = req.body
//	console.log(2333)
//	var add="insert into commen_userroleinf values("
//			 +people.loginAcc + ","
//			  + "\'" + "123456" + "\'" + "," 
//			   +"\'" + "普通用户" + "\'" + ","
//			    +"\'" + people.name + "\'" + ","
//			   +"\'" + people.phoneNum + "\'" + "," 
//			   + "\'" + people.des + "\'" + ","
//			   + "\'" +"所属支部" + "\'" +  ","
//			     + "\'" + people.status + "\'" +")"
////console.log(sql)
//connection.query(add,function (err,people) {
//	  if(err){
//	    return err;
//	  }
//	  	  
//	return res.redirect('/views/detail/yhzx/yhlb')
//		
//	})
//	
//})


//游客界面  申请转移
router.post('/views/interviews/userlogin/sqzy', function(req, res){
	if(req.session.loginAcc){
	var people=req.body
//	console.log(people)
	var maxid = "select max(id) from organazition_float"
		//console.log(maxid)
		connection.query(maxid,function (err,result) {
		  if(err){
		    return err;
		  }
		  result=JSON.stringify(result)    //先将result转化为String类型的数据
	  	  result=JSON.parse(result)
	  	  var ret = result[0]
		  var peopleId = ret['max(id)'] + 1
		  var sql1="select * from people_information where idCardNum="+"\'"+req.session.loginAcc+"\'"
//		  console.log(sql1)
		  connection.query(sql1,function (err,people1) {
		  if(err){
		    return err;
		  }
		   people1=JSON.stringify(people1)    //先将result转化为String类型的数据
	  	  people1=JSON.parse(people1)
		var sql="insert into organazition_float values("
			 +peopleId + ","
			  + "\'" + people.name + "\'" + "," 
			   +"\'" + people.range + "\'" + ","
			    +"\'" + people1[0].idCardNum + "\'" + ","
			   +"\'" + people1[0].phoneNum + "\'" + "," 
			   + "\'" + people.rollname + "\'" + ","
			   + "\'" +"是"+ "\'" +  ","
			    + "\'" +people.rollTime+ "\'" + ","
			   + "\'" + people.rollreason + "\'" + ","
			   + "\'" + people.status + "\'" + ","
			   + "\'" + people.remark + "\'" + ","
			     + "\'" + "转出" + "\'" +")"
//			     console.log(sql)
					connection.query(sql,function (err,result) {
				  if(err){
				    return err;
				  }
				return res.redirect("/views/interviews/userlogin/lddy-zzgxzj")
			})
		})
	})
	}else{
			res.render("interviews/userlogin/login.html")
		}
})
//修改密码
router.get('/views/interviews/userlogin/xgmm', function(req, res){
	res.render('detail/wzgl/lmgl.html')
})
//我要退出
router.get('/views/interviews/userlogin/wytc', function(req, res){
		req.session.loginAcc=null
		res.render("interviews/userlogin/login.html")
})
//我要退出-超管界面
router.get('/views/interviews/userlogin/wytc-cgjm', function(req, res){
		req.session.username=null
		res.render('login.html')
})
//掌上组织生活
router.get('/views/interviews/userlogin/cy-zszzsh', function(req, res){
		var sql="select title from organazition_life where id="+req.query.id
		connection.query(sql,function (err,people1) {
		  if(err){
		    return err;
		  }
		  var sql="select name from people_information where idCar"
		res.render("interviews/userlogin/login.html")
		})
})
//贫困户管理——修改
router.get('/views/interviews/userlogin/pkhgl-edit', function(req, res){
		var sql="select * from heart_help_poorpeople where id="+req.query.id
//		console.log(sql)
		connection.query(sql,function (err,people) {
		  if(err){
		    return err;
		  }
		  res.render("interviews/userlogin/pkhxg.html",{
		  	people:people
		  }) 
		})
})
router.post('/views/interviews/userlogin/pkhgl-pkhgl', function(req, res){
	var people=req.body
//	console.log(people)
	var editsql = "update heart_help_poorpeople set address =" +"\'" + people.address + "\'"
	+ "," + "time=" +"\'" + people.time + "\'"
	+ "," + "content=" +"\'" + people.content + "\'"
	+ "," + "content=" +"\'" + people.content + "\'"
	+" where id=" + people.id;
//	console.log(editsql)
	Pfile.editById(editsql, function(err){
		if(err) {
			return res.status(500).send('Server error'+err.message)	
		}
		res.redirect('/views/interviews/userlogin/pkhgl')
	})
})
//贫困户管理删除
router.get('/views/interviews/userlogin/pkhgl-delete', function(req, res){
		var sql="select name,idCardNum people_information where idCardNum="+"\'"+req.session.loginAcc+"\'"
		connection.query(sql,function (err,people1) {
		  if(err){
		    return err;
		  }
//		  console.log(people1)
//		res.redirect("/views/interviews/userlogin/pkhgl")
		})
})
//培养积极分子-我要上报
router.post('/views/interviews/userlogin/wysb/pyjjfz', function(req, res){
	var people=req.body
//	console.log(people)
	var sql="select name,idCardNum ,phoneNum,onAttribute from people_information where idCardNum="+"\'"+req.session.loginAcc+"\'"
	connection.query(sql,function (err,people1) {
		  if(err){
		    return err;
		  }
		   people1=JSON.stringify(people1)    //先将result转化为String类型的数据
	  	  people1=JSON.parse(people1)
//		  console.log(people1)
		  var maxid = "select max(id) from heart_educatepovertypeople"
		//console.log(maxid)
		connection.query(maxid,function (err,result) {
		  if(err){
		    return err;
		  }
//		  console.log(people)
		  result=JSON.stringify(result)    //先将result转化为String类型的数据
	  	  result=JSON.parse(result)
	  	  var ret = result[0]
		  var peopleId = ret['max(id)'] + 1
		  var add="insert into heart_educatepovertypeople values("
			 +  peopleId + ","
			  + "\'" + people1[0].name + "\'" + "," 
			   +"\'" + people1[0].idCardNum + "\'" + ","
			    +"\'" + people.povertyName + "\'" + ","
			   +"\'" +people.time + "\'" + "," 
			    + "\'" + people.address + "\'" +  ","
			     + "\'" + people.content+ "\'" +  ","
			     + "\'" + people.content + "\'" +  ","
			        + "\'" + people1[0].phoneNum + "\'" + ")"
//			        console.log(add)
	 connection.query(add,function (err,result) {
		  if(err){
		    return err;
		  }
//	console.log(add)
//		res.redirect("/views/interviews/userlogin/pkhgl")
		res.redirect("/views/interviews/userlogin/pyjjfz")
		})
	})
})
	 
})
//主题党日参与详情
router.get('/views/interviews/userlogin/ztdr-cyxq', function(req, res){
	if(req.session.loginAcc)
	{
		var sql="select name from people_information where idCardNum="+"\'"+req.session.loginAcc+"\'"
		connection.query(sql,function (err,people) {
		  if(err){
		    return err;
		  }
		  people=JSON.stringify(people)    //先将result转化为String类型的数据
	  	  people=JSON.parse(people)
//		  console.log(people)
		  var sql1="select title from vital_commitytday where id="+req.query.id
		  console.log(sql1)
		  connection.query(sql1,function (err,inform) {
		  if(err){
		    return err;
		  }
		   inform=JSON.stringify(inform)    //先将result转化为String类型的数据
	  	  inform=JSON.parse(inform)
	  	  inform[0].name=people[0].name
//	  	  console.log(inform)
		  var maxid = "select max(id) from people_activitypeople"
		//console.log(maxid)
		connection.query(maxid,function (err,result) {
		  if(err){
		    return err;
		  }
		  result=JSON.stringify(result)    //先将result转化为String类型的数据
	  	  result=JSON.parse(result)
	  	  var ret = result[0]
		  var peopleId = ret['max(id)'] + 1
	  	  var add="insert into people_activitypeople values("
			 +  peopleId + ","
			  + "\'" + inform[0].name + "\'" + ","
			    + "\'" + inform[0].title + "\'" + ","
			    + "\'" +"主题党日" + "\'" + ")"
			    connection.query(add,function (err,result) {
					  if(err){
					    return err;
					  }
					res.redirect("/views/interviews/userlogin/ztdr")
				})
			})
		})
	})
		}else{
			res.render("interviews/userlogin/login.html")
		}
})
//三会一课参与活动
router.get('/views/interviews/userlogin/syyk-cyxq', function(req, res){
	if(req.session.loginAcc)
	{
		var sql="select name from people_information where idCardNum="+"\'"+req.session.loginAcc+"\'"
		connection.query(sql,function (err,people) {
		  if(err){
		    return err;
		  }
		  people=JSON.stringify(people)    //先将result转化为String类型的数据
	  	  people=JSON.parse(people)
//		  console.log(people)
		  var sql1="select title,type from threeandone_activityinformation where id="+req.query.id
//		  console.log(sql1)
		  connection.query(sql1,function (err,inform) {
		  if(err){
		    return err;
		  }
		  inform=JSON.stringify(inform)    //先将result转化为String类型的数据
	  	  inform=JSON.parse(inform)
	  	  inform[0].name=people[0].name
//	  	  console.log(inform)
		  var maxid = "select max(id) from people_activitypeople"
		connection.query(maxid,function (err,result) {
		  if(err){
		    return err;
		  }
		  result=JSON.stringify(result)    //先将result转化为String类型的数据
	  	  result=JSON.parse(result)
	  	  var ret = result[0]
		  var peopleId = ret['max(id)'] + 1
	  	  var add="insert into people_activitypeople values("
			 +  peopleId + ","
			  + "\'" + inform[0].name + "\'" + ","
			  + "\'" + inform[0].title + "\'" + ","
			    + "\'" +inform[0].type + "\'" + ")"
			   connection.query(add,function (err,result) {
					  if(err){
					    return err;
					  }
					res.redirect("/views/interviews/userlogin/shyk")
				})
			})
		})
	})
		}else{
			res.render("interviews/userlogin/login.html")
		}
})

//党员管理-------查询
router.post('/views/detail/sjtj/sjtj-jftj', function(req,res){
	var inform = req.body
	
	for(var key in inform){
		if(inform[key] == ''){
			delete inform[key]
		}
	}
//	console.log(inform)
	if(JSON.stringify(inform) == '{}'){
		console.log('2333')
		res.redirect('/views/detail/sjtj/jftj')
		return
	}
//	console.log(inform)
	var sql = "select * from people_information where " 
	var i = 0
	for(var key in inform){
		if (i == 0){
			sql += key + " like" + "\'"+"%"+inform[key]+"%"+"\'"
			i++
		} else {
			sql += "and " + key + " like" + "\'"+"%"+inform[key]+"%"+"\'"
		}
	}
//	console.log(sql)
	Pfile.selectSql(sql, function(err, inform) {
		if (err) {
			return res.status(500).send('Server error'+err.message)
		}
//		console.log(people)
		 inform=JSON.stringify(inform)    //先将result转化为String类型的数据
	  	  inform=JSON.parse(inform)
		res.render('detail/sjtj/jftj.html', {
			inform: inform
		})
	})
})
//组织机构-------目录树
router.get('/views/detail/yhzx/zzjg-tree', function(req, res){
	var sql = 'SELECT * FROM common_organazition where organazitionName =' + "\'" + req.query.name + "\'";
	console.log(sql)
	//onsole.log(sql)
	Pfile.searchFile(sql, function(err, inform){
		if(err){
			return res.status(500).send('Servor error'+err.message)
		}
		inform=JSON.stringify(inform)    //先将result转化为String类型的数据
		inform=JSON.parse(inform)
		console.log(inform)
		res.render('detail/yhzx/zzjg.html',{
				inform:inform
		})
	})
})
  //用户中心组织机构修改
router.get('/views/detail/yhzx/orga',function(req,res){
	res.render('/views/detail/yhzx/orga')
})
 router.post('/views/detail/yhzx/orga',function(req,res){
 	var people = req.body
 	console.log(people)
 	var sql = "update common_organazition set "
 			  +"conectPeople="+"\'"+people.conectPeople+"\'"+","
 			  +"phoneNum="+"\'"+people.phoneNum+"\'"+","
 			  +"address="+"\'"+people.address+"\'"+","
 			  +"organazitionType="+"\'"+people.organazitionType+"\'"+","
 			  +"defaultPassword="+"\'"+people.defaultPassword+"\'"+","
 			  +"Unit_situation="+"\'"+people.Unit_situation+"\'"+","
 			  +"Unit_type="+"\'"+people.Unit_type+"\'"+","
 			  +"Unit_condition="+"\'"+people.Unit_condition+"\'"+","
 			  +"code="+"\'"+people.code+"\'"+","
 			  +"secretaryName="+"\'"+people.secretaryName+"\'"+","
 			  +"video_system="+"\'"+people.video_system+"\'"+","
 			  +"activityImag="+"\'"+people.activityImag+"\'"+","
 			  +"video_meeting="+"\'"+people.video_meeting+"\'"+","
 			  +"true_imag="+"\'"+people.true_imag+"\'"+","
 			  +"brief="+"\'"+people.brief+"\'"+","
 			  +"locationX="+"\'"+people.locationX+"\'"+","
 			  +"locationY="+"\'"+people.locationY+"\'"
 			  +"where organazitionName="+"\'"+people.organazitionName+"\'";
// 	var sql = "insert into common_organazition values ("
// 				+ "\'" + people.organazitionName + "\'" + "," 
//			  	+ "\'" + people.conectPeople + "\'" + "," 
//			  	+ "\'" + people.phoneNum + "\'" + "," 
//			  	+ "\'" + people.address + "\'" + "," 
//			  	+ "\'" + people.organazitionType + "\'" + "," 
//			  	+ "\'" + people.defaultPassword + "\'" + "," 
//			  	+ "\'" + people.Unit_situation + "\'" + "," 
//			  	+ "\'" + people.Unit_type + "\'" + "," 
//			  	+ "\'" + people.Unit_condition+ "\'" + "," 
//			  	+ "\'" + people.secretaryName + "\'" + "," 
//			  	+ "\'" + people.video_system + "\'" + "," 
//			  	+ "\'" + people.activityImag + "\'" + "," 
//			  	+ "\'" + people.video_meeting + "\'" + "," 
//			  	+ "\'" + people.true_imag + "\'" + "," 
//			  	+ "\'" + people.describe + "\'" + "," 
//			  	+ "\'" + people.locationX + "\'" + "," 
//			  	+ "\'" + people.locationY + "\'" + ")";
			  	console.log(sql);
	connection.query(sql,function(err,inform){
		if(err){
			return err;
		}
		res.render('detail/yhzx/zzjg.html',{
	  	inform:inform
	 	  })
	})

 })
 //用户中心角色添加
 router.post('/views/detail/yhzx/jstj', async(req,res)=>{
 	var access_list = await get_accesslist(req);
	var aa=access_list.split(',')
	var i=0;
 	for(i=0;i<aa.length;i++)
	{
			console.log(aa[i]+"这是权限"+" " +"这是第"+i+"个权限"+"  "+aa.length)
			if(aa[i]=="121") {

	var people=req.body
//	console.log(people)
	var add="insert into commen_userroleinf values("
			 + "\'" + "" + "\'" + "," 
			  + "\'" + "" + "\'" + "," 
			   +"\'" + people.property + "\'" + ","
			    + "\'" + people.des + "\'"  + ")"
	connection.query(add,function (err,inform) {
	  if(err){
	    return err;
	  }
	  	  inform=JSON.stringify(inform)    //先将result转化为String类型的数据
	  	  inform=JSON.parse(inform)
//	  console.log(people)
	 res.redirect("/views/detail/yhzx/jslb")
	})
				break;
            }
	}

                if (i == (aa.length)) {
                    return res.send("你没有此操作权限")
                }
			        
})
 
 //组织管理地图打点
 router.get('/views/interviews/zzgl/map',async(req,res)=>
{
	var access_list = await get_accesslist(req);
	var aa=access_list.split(',')
	var i=0;
 	for(i=0;i<aa.length;i++)
	{
			console.log(aa[i]+"这是权限"+" " +"这是第"+i+"个权限"+"  "+aa.length)
			if(aa[i]=="120") {

//	console.log("233")
	var sql = 'SELECT * FROM commity';
	connection.query(sql,function (err,result) {
	  if(err){
	    return err;
	  }
	  result=JSON.stringify(result)    //先将result转化为String类型的数据
	  result=JSON.parse(result)
//	  console.log(result);
	  res.render('interviews/zzgl/map.html',{
	  	result:result
	  })
	 })
				break;
            }
	}

                if (i == (aa.length)) {
                    return res.send("你没有此操作权限")
                }
})
 //用户中心角色修改
 router.get('/views/detail/yhzx/jsxg-edit',async(req,res)=>
{
	var access_list = await get_accesslist(req);
	var aa=access_list.split(',')
	var i=0;
 	for(i=0;i<aa.length;i++)
	{
			console.log(aa[i]+"这是权限"+" " +"这是第"+i+"个权限"+"  "+aa.length)
			if(aa[i]=="122") {
	var property=req.query.type
	var sql = 'SELECT * FROM commen_userroleinf where property='+"\'"+property+"\'" +"group by property";
	connection.query(sql,function (err,result) {
	  if(err){
	    return err;
	  }
	  result=JSON.stringify(result)    //先将result转化为String类型的数据
	  result=JSON.parse(result)
//	  console.log(result);
	  res.render('detail/yhzx/jsxg.html',{
	  	result:result
	  })
	 })
				break;
            }
	}

                if (i == (aa.length)) {
                    return res.send("你没有此操作权限")
                }
})
  router.post('/views/detail/yhzx/jsxg-edit',function(req,res)
{
	var property=req.body;
//	console.log(property)
	var sql = 'update commen_userroleinf set property =' +"\'"+property.property+"\'"+","+"des="+"\'"+property.des+"\'"+" where property =" + "\'"+property.property+"\'";
	console.log(sql)
	var sql1="select * from commen_userroleinf group by property"
	connection.query(sql,function (err,result) {
	  if(err){
	    return err;
	  }
	  result=JSON.stringify(result)    //先将result转化为String类型的数据
	  result=JSON.parse(result)
//	  console.log(result);
	  connection.query(sql1,function (err,inform) {
	  if(err){
	    return err;
	  }
	  inform=JSON.stringify(inform)    //先将result转化为String类型的数据
	  inform=JSON.parse(inform)
//	  console.log(inform)
	  res.render('detail/yhzx/jslb.html',{
	  	inform:inform
	 	  })
	   })
	 })
})
 //用户中心角色列表-----删除
router.get('/views/detail/yhzx/jslb-delete', async(req,res)=>{
	var access_list = await get_accesslist(req);
	var aa=access_list.split(',')
	var i=0;
 	for(i=0;i<aa.length;i++)
	{
			console.log(aa[i]+"这是权限"+" " +"这是第"+i+"个权限"+"  "+aa.length)
			if(aa[i]=="123") {

	var selectId = req.query.type.split(",")
		var delsql = 'DELETE FROM commen_userroleinf where property ='
		for(var i = 0; i < selectId.length; i++){
			if(i == 0){
				delsql +="\'" +selectId[i]+"\'"
			} else {
				delsql += " or property = " + "\'"+selectId[i]+"\'"
			}
		}
		console.log(delsql)
		Pfile.deleteSql(delsql, req.query.name, function(err) {
			if(err) {
				return res.status(500).send('Server error'+err.message)	
			}
			res.redirect('/views/detail/yhzx/jslb')
		})
				break;
            }
	}

                if (i == (aa.length)) {
                    return res.send("你没有此操作权限")
                }
	})
//用户列表修改
router.get('/views/detail/yhzx/yhlb-edit', async(req,res)=>{
	var access_list = await get_accesslist(req);
	var aa=access_list.split(',')
	var i=0;
 	for(i=0;i<aa.length;i++)
	{
			console.log(aa[i]+"这是权限"+" " +"这是第"+i+"个权限"+"  "+aa.length)
			if(aa[i]=="126") {

	var loginAcc=req.query.loginAcc;
	var sql="select * from commen_userroleinf where loginAcc="+loginAcc
	var sql1="select * from people_information where idCardNum="+ parseInt(loginAcc)
	console.log(sql)
	connection.query(sql,function (err,inform) {
	  if(err){
	    return err;
	  }
	  inform=JSON.stringify(inform)    //先将result转化为String类型的数据
	  inform=JSON.parse(inform)
//	  console.log(inform)
connection.query(sql1,function (err,inform1) {
	  if(err){
	    return err;
	  }
	  inform1=JSON.stringify(inform1)    //先将result转化为String类型的数据
	  inform1=JSON.parse(inform1)
//	  console.log(inform1)
	  inform[0].name=inform1[0].name;
	  inform[0].phoneNum=inform1[0].phoneNum
	  inform[0].belongpart=inform1[0].belongpart;
//	  console.log(inform)
	  return res.render('detail/yhzx/yhxg.html', {
			inform:inform
			})
		})
    })
				break;
            }
	}

                if (i == (aa.length)) {
                    return res.send("你没有此操作权限")
                }
})
router.post('/views/detail/yhzx/yhlb-edit', function(req, res){
//	console.log(2222)
	var people=req.body;
	console.log(people)
	var sql='update commen_userroleinf set des='+"\'"+people.des+"\'"+"where loginAcc="+"\'"+people.loginAcc+"\'"
	var sql1='update people_information set name='+"\'"+people.name+"\'"+","+"phoneNum="+"\'"+people.phoneNum+"\'"+","+"idCardNum="+"\'"+people.loginAcc+"\'"+"where idCardNum="+"\'"+people.loginAcc+"\'" 
//	console.log(sql)
	connection.query(sql,function (err,inform) {
	  if(err){
	    return err;
	  }
	  inform=JSON.stringify(inform)    //先将result转化为String类型的数据
	  inform=JSON.parse(inform)
	  connection.query(sql1,function (err,inform1) {
	  if(err){
	    return err;
	  }
	  inform1=JSON.stringify(inform1)    //先将result转化为String类型的数据
	  inform1=JSON.parse(inform1)
	  res.redirect("/views/detail/yhzx/yhlb")
//	  console.log(inform)
//	  return res.render('detail/yhzx/yhxg.html', {
//			inform:inform
//			})
		})
    })
})
//用户中心用户列表-----删除
router.get('/views/detail/yhzx/yhlb-delete', async(req,res)=>{
	var access_list = await get_accesslist(req);
	var aa=access_list.split(',')
	var i=0;
 	for(i=0;i<aa.length;i++)
	{
			console.log(aa[i]+"这是权限"+" " +"这是第"+i+"个权限"+"  "+aa.length)
			if(aa[i]=="127") {

	var selectId = req.query.loginAcc.split(",")
		var delsql = 'DELETE FROM commen_userroleinf where loginAcc ='
		for(var i = 0; i < selectId.length; i++){
			if(i == 0){
				delsql +="\'" +selectId[i]+"\'"
			} else {
				delsql += " or property = " + "\'"+selectId[i]+"\'"
			}
		}
		console.log(delsql)
		Pfile.deleteSql(delsql, req.query.name, function(err) {
			if(err) {
				return res.status(500).send('Server error'+err.message)	
			}
			res.redirect('/views/detail/yhzx/yhlb')
		})
				break;
            }
	}

                if (i == (aa.length)) {
                    return res.send("你没有此操作权限")
                }
	})
router.get('/views/detail/yhzx/yhlb-fpjs', function(req, res){
	var loginAcc=req.query.loginAcc
	var sql='select * from commen_userroleinf where loginAcc='+"\'"+loginAcc+"\'"
	connection.query(sql,function (err,inform) {
	  if(err){
	    return err;
	  }
	console.log(inform)
	req.session.property=inform[0].property
	res.render("detail/yhzx/quanxianshu.html")
	})
		 
})
router.get('/views/detail/yhzx/yhzx-cshmm', function(req, res){
	console.log(2333)
	var loginAcc=req.query.loginAcc
	var password="123456123456"
	 let md5 = crypto.createHash("md5");   //创建哈希
    let newPas = md5.update(password).digest("hex"); 
	var sql='update people_information set defaultpassword='+"\'"+newPas+"\'"+"where idCardNum="+"\'"+loginAcc+"\'"
	var sql1='update commen_userroleinf set password='+"\'"+newPas+"\'"+"where loginAcc="+"\'"+loginAcc+"\'"
	connection.query(sql,function (err,inform) {
	  if(err){
	    return err;
	  }
	  connection.query(sql1,function (err,inform) {
	  if(err){
	    return err;
	  }
	 res.redirect("/views/detail/yhzx/yhlb")
		})
	})
		 
})
//友情链接
router.get('/views/detail/fzsz/yqljfl', function(req, res){


	var sql="select * from assit_link_friend"
	connection.query(sql,function (err,inform) {
	  if(err){
	    return err;
	  }
	 res.render("detail/fzsz/yqljfl.html",{
	 	inform:inform
		})
	})

		 
})
//广告位链接
router.get('/views/detail/fzsz/ggwlb', function(req, res){
	var sql="select * from assit_link_ad"
	connection.query(sql,function (err,inform) {
	  if(err){
	    return err;
	  }
	  
	 res.render("detail/fzsz/ggwlb.html",{
	 	inform:inform
		})
	})
		 
})
//友情链接-----新增
router.post('/views/detail/fzsz/yqljfl', async(req,res)=>{
	var access_list = await get_accesslist(req);
	var aa=access_list.split(',')
	var i=0;
 	for(i=0;i<aa.length;i++)
	{
			console.log(aa[i]+"这是权限"+" " +"这是第"+i+"个权限"+"  "+aa.length)
			if(aa[i]=="133") {
	var inform=req.body
		var maxid = "select max(id) from assit_link_friend"
		//console.log(maxid)
		connection.query(maxid,function (err,result) {
		  if(err){
		    return err;
		  }
		  result=JSON.stringify(result)    //先将result转化为String类型的数据
	  	  result=JSON.parse(result)
	  	  var ret = result[0]
		  var informId = ret['max(id)'] + 1
		  var sql = "insert into assit_link_friend values("
					 + informId  + ","
					  + "\'" + inform.type + "\'" + "," 
					   +"\'" + inform.recordTime + "\'" + ","	
					      +"\'" + "链接管理" + "\'" + ","	
					      + "\'" + inform.des+ "\'"  + ")"
					   connection.query(sql,function(err,inform)
					   {
					   	if(err){
							    return err;
							  }
							 res.redirect("/views/detail/fzsz/yqljfl")
						 })
					})
				break;
            }
	}

                if (i == (aa.length)) {
                    return res.send("你没有此操作权限")
                }
})
//广告位链接-----新增
router.post('/views/detail/fzsz/ggwlb', async(req,res)=>{
	var access_list = await get_accesslist(req);
	var aa=access_list.split(',')
	var i=0;
 	for(i=0;i<aa.length;i++)
	{
			console.log(aa[i]+"这是权限"+" " +"这是第"+i+"个权限"+"  "+aa.length)
			if(aa[i]=="138") {
	console.log(2333)
	var inform=req.body
		var maxid = "select max(id) from assit_link_ad"
		console.log(inform)
		connection.query(maxid,function (err,result) {
		  if(err){
		    return err;
		  }
		  result=JSON.stringify(result)    //先将result转化为String类型的数据
	  	  result=JSON.parse(result)
	  	  var ret = result[0]
		  var informId = ret['max(id)'] + 1
		  var sql = "insert into assit_link_ad values("
					 + informId  + ","
					  + "\'" + inform.name + "\'" + "," 
					   +"\'" + inform.linkaddress + "\'" + ","	
					      +"\'" + 100 + "\'" + ","	
					      + "\'" + 40+ "\'" + "," 
					       + "\'" + "广告类型"+ "\'" + "," 
					       + "\'" + "显示状态"+ "\'" + "," 
					        + "\'" + inform.linkimag+ "\'" + "," 
					         + "\'" + inform.des+ "\'" + "," 
					          + "\'" + inform.recordTime+ "\'" + ")"
					          console.log(sql)
					   connection.query(sql,function(err,inform)
					   {
					   	if(err){
							    return err;
							  }
							 res.redirect("/views/detail/fzsz/ggwlb")
						 })
					})
				break;
            }
	}

                if (i == (aa.length)) {
                    return res.send("你没有此操作权限")
                }
		 
})
//友情链接修改
router.get('/views/detail/fzsz/yhljfl-edit', async(req,res)=>{
	var access_list = await get_accesslist(req);
	var aa=access_list.split(',')
	var i=0;
 	for(i=0;i<aa.length;i++)
	{
			console.log(aa[i]+"这是权限"+" " +"这是第"+i+"个权限"+"  "+aa.length)
			if(aa[i]=="134") {
    console.log("for test.........")
	var id=req.query.id;
	var sql="select * from assit_link_friend where id="+id
	connection.query(sql,function (err,inform) {
	  if(err){
	    return err;
	  }
	  inform=JSON.stringify(inform)    //先将result转化为String类型的数据
	  inform=JSON.parse(inform)
	   res.render("detail/fzsz/yqljxg.html",{
	   	inform:inform
	   })
	})
				break;
            }
	}

                if (i == (aa.length)) {
                    return res.send("你没有此操作权限")
                }
	
})
router.post('/views/detail/fzsz/yhljfl-edit', function(req, res){ 
	var inform=req.body
	console.log(inform)
	var sql = "update assit_link_friend set type=" +"\'" + inform.type + "\'"
	+ "," + "recordTime=" +"\'" + inform.recordTime + "\'"
	+ "," + "des=" +"\'" + inform.des + "\'"
	+"where id=" + inform.id;
	console.log(sql)
	connection.query(sql,function (err,inform1) {
	  if(err){
	    return err;
	  }
	  inform1=JSON.stringify(inform1)    //先将result转化为String类型的数据
	  inform1=JSON.parse(inform1)
	  res.redirect("/views/detail/fzsz/yqljfl")
	})
		 
})
//友情链接删除
router.get('/views/detail/fzsz/yhljfl-delete', async(req,res)=>{
	var access_list = await get_accesslist(req);
	var aa=access_list.split(',')
	var i=0;
 	for(i=0;i<aa.length;i++)
	{
			console.log(aa[i]+"这是权限"+" " +"这是第"+i+"个权限"+"  "+aa.length)
			if(aa[i]=="135") {

	var selectId = req.query.id.split(",")
		var delsql = 'DELETE FROM assit_link_friend where id ='
		for(var i = 0; i < selectId.length; i++){
			if(i == 0){
				delsql +="\'" +selectId[i]+"\'"
			} else {
				delsql += " or property = " + "\'"+selectId[i]+"\'"
			}
		}
//		console.log(delsql)
		Pfile.deleteSql(delsql, req.query.name, function(err) {
			if(err) {
				return res.status(500).send('Server error'+err.message)	
			}
			res.redirect('/views/detail/fzsz/yqljfl')
		})
				break;
            }
	}

                if (i == (aa.length)) {
                    return res.send("你没有此操作权限")
                }
		 
})
//广告位链接修改
router.get('/views/detail/fzsz/ggwlb-edit', async(req,res)=>{
	var access_list = await get_accesslist(req);
	var aa=access_list.split(',')
	var i=0;
 	for(i=0;i<aa.length;i++)
	{
			console.log(aa[i]+"这是权限"+" " +"这是第"+i+"个权限"+"  "+aa.length)
			if(aa[i]=="137") {
	var id=req.query.id
	console.log(id)
	var sql=" select * from assit_link_ad where id= " +id
	connection.query(sql,function (err,inform1) {
	  if(err){
	    return err;
	  }
	  inform1=JSON.stringify(inform1)    //先将result转化为String类型的数据
	  inform1=JSON.parse(inform1)
	 res.render("detail/fzsz/yqljglxg.html",{
	 	inform:inform1 
	 })
	})
				break;
            }
	}

                if (i == (aa.length)) {
                    return res.send("你没有此操作权限")
                }
})
router.post('/views/detail/fzsz/ggwlb-edit', function(req, res){
	var inform=req.body
	console.log(inform)
	var sql = "update assit_link_ad set name=" +"\'" + inform.name + "\'"
	+ "," + "linkaddress=" +"\'" + inform.linkaddress + "\'"
	+ "," + "recordTime=" +"\'" + inform.recordTime + "\'"
	+ "," + "linkimag=" +"\'" + inform.linkimag + "\'"
	+ "," + "des=" +"\'" + inform.des + "\'"
	+" where id=" + inform.id;
	console.log(sql)
	connection.query(sql,function (err,inform) {
	  if(err){
	    return err;
	  }
	  
	 res.redirect("/views/detail/fzsz/ggwlb")
	})
		 
})
//广告位链接删除
router.get('/views/detail/fzsz/ggwlb-delete', async(req,res)=>{
	var access_list = await get_accesslist(req);
	var aa=access_list.split(',')
	var i=0;
 	for(i=0;i<aa.length;i++)
	{
			console.log(aa[i]+"这是权限"+" " +"这是第"+i+"个权限"+"  "+aa.length)
			if(aa[i]=="138") {

	var selectId = req.query.id.split(",")
		var delsql = 'DELETE FROM assit_link_ad where id ='
		for(var i = 0; i < selectId.length; i++){
			if(i == 0){
				delsql += selectId[i]
			} else {
				delsql += " or id = " + selectId[i]
			}
		}
		console.log(delsql)
		Pfile.deleteSql(delsql, req.query.id, function(err) {
		if(err) {
			return res.status(500).send('Server error')	
		}
		res.redirect('/views/detail/fzsz/ggwlb')
	})
				break;
            }
	}

                if (i == (aa.length)) {
                    return res.send("你没有此操作权限")
                }
})
module.exports = router2
