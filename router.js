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
    database: 'salary'
});
router.use(session({
    secret: 'film',
    resave: true,
    saveUninitialized: true,
    cookie: {
        maxAge: 1000 * 60 * 30  // harlf of hour
    }
}));

 

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





 
 router.get('/', function(req,res){
 	if(req.session.LoginAcc)
 	{
 		res.render('admin.html')
 	}
 	else{
 		 res.render('login.html')
 	}
})
 //登陆完成之后进入到主页面
router.post('/views/login', function(req,res){
	var inform = req.body
	var LoginAcc=inform.LoginAcc;
    let pwd = inform.pwd;
    let md5 = crypto.createHash("md5");   //创建哈希
    let newPas = md5.update(pwd).digest("hex"); 
//  console.log(newPas)
//  console.log(newPas)
// var sql2 = 'update user set pwd ='+ "\'"+newPas+"\'"+ 'where LoginAcc =' +"\'"+LoginAcc+"\'" ;
//	connection.query(sql2,function (err,inform2) {
//	  if(err){
//	    return err;
//	  }
// })	
 var sql1='SELECT * from user_inform where Job_Num='+"\'"+inform.LoginAcc+"\'"
 var sql3='SELECT * from user where LoginAcc='+"\'"+inform.LoginAcc+"\'"
 connection.query(sql3,function (err,user) {
	  if(err){
	    return err;
	  }
	  else{
	  	 user=JSON.stringify(user)    //先将result转化为String类型的数据
	  	 user=JSON.parse(user)
	  	if(user[0]!=null||user[0]!=undefined)
	  	{
	connection.query(sql1,function (err,people) {
	  if(err){
	    return err;
	  }
	  req.session.college_type=people[0].college_type
	  console.log(req.session.college_type)
 })
		var sql='SELECT * from user where LoginAcc='+"\'"+inform.LoginAcc+"\'" +"and pwd="+"\'"+newPas+"\'";
//		console.log(sql)
		connection.query(sql,function (err,inform1) {
	  		if(err){
	    			return err;
	  			}
	  
	else{
		 inform1=JSON.stringify(inform1)    //先将result转化为String类型的数据
	  	 inform1=JSON.parse(inform1)
//	  	 console.log(inform1[0])
		if(inform1[0]!=null||inform1[0]!=undefined)
		{
			if(inform1[0].identity==1)
	  			{
	  			req.session.LoginAcc=req.body.LoginAcc
	  			res.render('admin.html')
	  			}
	  			req.session.LoginAcc=req.body.LoginAcc
	  			res.render("personnal/personnal.html")
		}else{
		var sql2='SELECT * from user where LoginAcc='+"\'"+inform.LoginAcc+"\'" +"and pwd="+"\'"+pwd+"\'";
//		console.log(sql2)
		connection.query(sql2,function (err,inform2) {
	  if(err){
	    return err;
	  }
	 	inform2=JSON.stringify(inform2)    //先将result转化为String类型的数据
	  	inform2=JSON.parse(inform2)
	  	 if(inform2[0]==null||inform2[0]==undefined)
	  	{
		res.redirect('fail.html')
	  	}
	  	else{
	  		if(inform2[0].identity==1)
	  			{
	  			req.session.LoginAcc=req.body.LoginAcc
	  			res.render('admin.html')
	  			}
	  			req.session.LoginAcc=req.body.LoginAcc
	  			res.render("personnal/personnal.html")
	  	}
	})
		}
		
}		
})
	  	}else{
	  		res.render("login_judge.html")
	  	}
	  }
 })
 

})
// //登陆完成之后进入到主页面
//router.post('/views/login', function(req,res){
//	var inform = req.body
//	var LoginAcc=inform.LoginAcc;
//  let pwd = inform.pwd;
//  let md5 = crypto.createHash("md5");   //创建哈希
//  let newPas = md5.update(pwd).digest("hex"); 
////  console.log(newPas)
////  console.log(newPas)
//// var sql2 = 'update user set pwd ='+ "\'"+newPas+"\'"+ 'where LoginAcc =' +"\'"+LoginAcc+"\'" ;
////	connection.query(sql2,function (err,inform2) {
////	  if(err){
////	    return err;
////	  }
//// })	
// var sql1='SELECT * from user_inform where Job_Num='+"\'"+inform.LoginAcc+"\'"
// connection.query(sql1,function (err,people) {
//	  if(err){
//	    return err;
//	  }
//	  req.session.college_type=people[0].college_type
//	  console.log(req.session.college_type)
// })	
//var sql='SELECT * from user where LoginAcc='+"\'"+inform.LoginAcc+"\'" +"and pwd="+"\'"+newPas+"\'";
//console.log(sql)
//connection.query(sql,function (err,inform1) {
//	  if(err){
//	    return err;
//	  }
//	  
//	else{
//		 inform1=JSON.stringify(inform1)    //先将result转化为String类型的数据
//	  	 inform1=JSON.parse(inform1)
//	  	 console.log(inform1[0])
//		if(inform1[0]!=null||inform1[0]!=undefined)
//		{
//			if(inform1[0].identity==1)
//	  			{
//	  			req.session.LoginAcc=req.body.LoginAcc
//	  			res.render('admin.html')
//	  			}
//	  			req.session.LoginAcc=req.body.LoginAcc
//	  			res.render("personnal/personnal.html")
//		}else{
//		var sql2='SELECT * from user where LoginAcc='+"\'"+inform.LoginAcc+"\'" +"and pwd="+"\'"+123456+"\'";
////		console.log(sql2)
//		connection.query(sql2,function (err,inform2) {
//	  if(err){
//	    return err;
//	  }
//	 	inform2=JSON.stringify(inform2)    //先将result转化为String类型的数据
//	  	inform2=JSON.parse(inform2)
//	  	 if(inform2[0]==null||inform2[0]==undefined)
//	  	{
//		res.redirect('fail.html')
//	  	}
//	  	else{
//	  		if(inform2[0].identity==1)
//	  			{
//	  			req.session.LoginAcc=req.body.LoginAcc
//	  			res.render('admin.html')
//	  			}
//	  			req.session.LoginAcc=req.body.LoginAcc
//	  			res.render("personnal/personnal.html")
//	  	}
//	})
//		}
//		
//}		
//})
//})

//退出
 router.get('/views/exit', function(req,res){
 	 req.session.LoginAcc=null;
 	// console.log(req.session.LoginAcc)
 	 res.redirect('/')
})
 router.get('/views/top', function(req,res){
 	var sql="select * from user_inform where Job_Num="+"\'"+req.session.LoginAcc+"\'";
// 	console.log(sql)
 	connection.query(sql,function(err,inform3){
 		inform3=JSON.stringify(inform3)    //先将result转化为String类型的数据
	  	inform3=JSON.parse(inform3)
// 		console.log(inform3)
 		res.render('top1.html',{
 			inform3:inform3
 		})
 	})
 	  
})
 
 //个人主页
 router.get('/views/personnal/top', function(req,res){
 	var sql="select * from user_inform where Job_Num="+"\'"+req.session.LoginAcc+"\'";
// 	console.log(sql)
 	connection.query(sql,function(err,inform3){
 		inform3=JSON.stringify(inform3)    //先将result转化为String类型的数据
	  	inform3=JSON.parse(inform3)
// 		console.log(inform3)
 		res.render('personnal/top1.html',{
 			inform3:inform3
 		})
 	})
 	  
})
 
 
 //教师列表
 router.get('/views/teacher/teacher_list', function(req,res){
 	var id=req.query.id;
   	console.log(id);
   	var sql='select * from user_inform,position_type where user_inform.position_type=position_type.id and user_inform.position_type=' +req.query.id + " and user_inform.college_type="+req.session.college_type;
   	console.log(sql)
 	connection.query(sql,function(err,people){
 		people=JSON.stringify(people)    //先将result转化为String类型的数据
	  	people=JSON.parse(people)
// 		console.log(people)
 		res.render('teacher/teacher_list.html',{
 			people:people
 		})
 	})
 	  
})
 
  //教师信息修改
 router.get('/views/teacher/teacher_edit', function(req,res){
   	var Job_Num=req.query.Job_Num;
   	console.log(Job_Num);
   	var sql='select * from user_inform where user_inform.Job_Num='+"\'"+Job_Num+"\'";
// 	console.log(sql)
   	connection.query(sql,function(err,people){
   		people=JSON.stringify(people)    //先将result转化为String类型的数据
	  	people=JSON.parse(people)
   		res.render('teacher/teacher_edit.html',{
   			people:people[0]
   		})
   	})
 	  
})
 //行政人员修改
 router.get('/views/admin_staff/admin_staff_edit', function(req,res){
   	var Job_Num=req.query.Job_Num;
   	console.log(Job_Num);
   	var sql='select * from user_inform where user_inform.Job_Num='+"\'"+Job_Num+"\'";
// 	console.log(sql)
   	connection.query(sql,function(err,people){
   		people=JSON.stringify(people)    //先将result转化为String类型的数据
	  	people=JSON.parse(people)
   		res.render('admin_staff/admin_staff_edit.html',{
   			people:people[0]
   		})
   	})
 	  
})
 //人员修改
 router.get('/views/people_edit', function(req,res){
   	var Job_Num=req.query.Job_Num;
   	console.log(Job_Num);
   	var sql='select * from user_inform where user_inform.Job_Num='+"\'"+Job_Num+"\'";
// 	console.log(sql)
   	connection.query(sql,function(err,people){
   		people=JSON.stringify(people)    //先将result转化为String类型的数据
	  	people=JSON.parse(people)
   		res.render('people_edit.html',{
   			people:people[0]
   		})
   	})
 	  
})
 //教师删除
 router.get('/views/teacher/teacher_delete', function(req,res){
   	var Job_Num=req.query.Job_Num;
// 	console.log(Job_Num);
	var position_type=req.query.position_type;
   	var sql='delete from user_inform where user_inform.Job_Num='+"\'"+Job_Num+"\'";
// 	console.log(sql)
	var sql1='delete from user where LoginAcc='+"\'"+Job_Num+"\'";
   	connection.query(sql,function(err,people){
   	 connection.query(sql1,function(err,people){
   	 if(position_type==1)
   		{
   			res.redirect("/views/teacher/teacher_list?id=1")
   		}
	  	else{
	  		res.redirect("/views/teacher/teacher_list?id=2")
	  	}
   	})
   	})
 	  
})
 //人员删除
 router.get('/views/people/people_delete', function(req,res){
   	var Job_Num=req.query.Job_Num;
// 	console.log(Job_Num);
	var position_type=req.query.position_type;
   	var sql='delete from user_inform where user_inform.Job_Num='+"\'"+Job_Num+"\'";
// 	console.log(sql)
	var sql1='delete from user where LoginAcc='+"\'"+Job_Num+"\'";
   	connection.query(sql,function(err,people){
   	 connection.query(sql1,function(err,people){
   	 res.redirect("/views/center/center_frame")
   	})
   	})
 	  
})
 //人员修改
  router.post('/views/people_edit', function(req,res){
   	var inform=req.body;
// 	console.log(inform)
	var sql = "update user_inform set phone=" +"\'" + inform.phone + "\'"+ 
	"," + "credit_card=" +"\'" + inform.credit_card + "\'"
+"where Job_Num=" +"\'"+ inform.Job_Num+"\'";
// 	var sql='update user_inform set phone=' +"\'"+inform.phone+"\'" + "," +id_card=" + "\'" + inform.id_card + "\'" + "where Job_Num=" + "\'" + inform.Job_Num + "\'";
   	console.log(sql)
   	connection.query(sql,function(err,people){
   		 res.redirect("/views/center/center_frame")
   	})
 	  
})
  //教师人员修改
  router.post('/views/teacher/teacher_edit', function(req,res){
   	var inform=req.body;
// 	console.log(inform)
	var sql = "update user_inform set phone=" +"\'" + inform.phone + "\'"+ 
	"," + "credit_card=" +"\'" + inform.credit_card + "\'"
+"where Job_Num=" +"\'"+ inform.Job_Num+"\'";
// 	var sql='update user_inform set phone=' +"\'"+inform.phone+"\'" + "," +id_card=" + "\'" + inform.id_card + "\'" + "where Job_Num=" + "\'" + inform.Job_Num + "\'";
   	console.log(sql)
   	connection.query(sql,function(err,people){
   		 res.redirect("/views/teacher/teacher_list?id=1")
   	})
 	  
})
  //行政人员修改
  router.post('/views/admin_staff/admin_staff_edit', function(req,res){
   	var inform=req.body;
// 	console.log(inform)
	var sql = "update user_inform set phone=" +"\'" + inform.phone + "\'"+ 
	"," + "credit_card=" +"\'" + inform.credit_card + "\'"
+"where Job_Num=" +"\'"+ inform.Job_Num+"\'";
// 	var sql='update user_inform set phone=' +"\'"+inform.phone+"\'" + "," +id_card=" + "\'" + inform.id_card + "\'" + "where Job_Num=" + "\'" + inform.Job_Num + "\'";
   	console.log(sql)
   	connection.query(sql,function(err,people){
   		 res.redirect("/views/admin_staff/admin_staff_list?id=2")
   	})
 	  
})
 
  //行政人员列表
 router.get('/views/admin_staff/admin_staff_list', function(req,res){
 	var id=req.query.id;
// 	console.log(id);
   	var sql='select * from user_inform,position_type where user_inform.position_type=position_type.id and user_inform.position_type='+req.query.id+ " and user_inform.college_type="+req.session.college_type;
   	connection.query(sql,function(err,people){
   		people=JSON.stringify(people)    //先将result转化为String类型的数据
	  	people=JSON.parse(people)
// 		console.log(people)
   		res.render('admin_staff/admin_staff_list.html',{
   			people:people
   		})
   	})
 	  
})
 
 
 //center页面的iframe
 //人员列表
 router.get('/views/center/center_frame', function(req,res){
	var sql="select * from user_inform where college_type="+"\'"+req.session.college_type+"\'"
   	connection.query(sql,function(err,people){
   		people=JSON.stringify(people)    //先将result转化为String类型的数据
	  	people=JSON.parse(people)
	  	 res.render("people_list.html",{
	  	 	people:people
	  	 })
   	})
})
 
 //人员列表详细信息
 
 router.get('/views/people_list_detail', function(req,res){
 	var name=req.query.name
	var sql='select * from user_inform where name='+"\'"+name+"\'"
	console.log(sql)
   	connection.query(sql,function(err,people){
   		people=JSON.stringify(people)    //先将result转化为String类型的数据
	  	people=JSON.parse(people)
	  	console.log(people[0])
	  	 res.render("templete/people_list_detail.html",{
	  	 	people:people[0]
	  	 })
   	})
})
 
 //行政人员详细信息
  router.get('/views/admin_staff/admin_staff_list_detail', function(req,res){
 	var name=req.query.name
	var sql='select * from user_inform where name='+"\'"+name+"\'"
	console.log(sql)
   	connection.query(sql,function(err,people){
   		people=JSON.stringify(people)    //先将result转化为String类型的数据
	  	people=JSON.parse(people)
	  	console.log(people[0])
	  	 res.render("admin_staff/admin_staff_list_detail.html",{
	  	 	people:people[0]
	  	 })
   	})
})
  //教师人员详细信息
  router.get('/views/teacher/teacher_list_detail', function(req,res){
 	var name=req.query.name
	var sql='select * from user_inform where name='+"\'"+name+"\'"
	console.log(sql)
   	connection.query(sql,function(err,people){
   		people=JSON.stringify(people)    //先将result转化为String类型的数据
	  	people=JSON.parse(people)
	  	console.log(people[0])
	  	 res.render("teacher/teacher_list_detail.html",{
	  	 	people:people[0]
	  	 })
   	})
})
  
  //职工工资管理显示
 router.get('/views/templete/commen_salary', function(req,res){
   	var id=req.query.id;
// 	console.log(id)
	req.session.position_type=id
	console.log(req.session.position_type)
	var sql="select Job_Num,name,position_type from user_inform where position_type="+id+ " and user_inform.college_type="+req.session.college_type;
//	console.log(sql)
	var sql1="select sum(allowance_bill) fixed_bill from fixed_bill";
	var sql2="select id,base_pay,position from position";
//	console.log(sql1)
	var sql3="select * from deduct_bill"
	connection.query(sql,function(err,people){
		people=JSON.stringify(people)    //先将result转化为String类型的数据
	  	people=JSON.parse(people)
// 		 console.log(people)
	connection.query(sql1,function(err,inform1){
		inform1=JSON.stringify(inform1)    //先将result转化为String类型的数据
	  	inform1=JSON.parse(inform1)
// 		 console.log(people)
	connection.query(sql2,function(err,inform2){
		inform2=JSON.stringify(inform2)    //先将result转化为String类型的数据
	  	inform2=JSON.parse(inform2)
   		 console.log(inform2)
	connection.query(sql3,function(err,inform3){
		inform3=JSON.stringify(inform3)    //先将result转化为String类型的数据
	  	inform3=JSON.parse(inform3)
//	  	console.log(inform3)
	var length=inform2.length;
	var length1=inform3.length;
	var aa=new Array(length-1);
	var bb=new Array(length1-1)
	var dd=new Array(length-1)
	var cc=0;
		for(var i=0;i<inform2.length;i++)
		{
			aa[i]=inform2[i].base_pay
			dd[i]=inform2[i].position
		}
		console.log(dd)
		for(var i=0;i<inform3.length;i++)
		{
			bb[i]=inform3[i].decult_bill
			cc=cc+inform3[i].decult_bill
		}
		console.log(cc)
		for(var i=0;i<people.length;i++)
		{
			if(people[i].position_type==1){
				people[i].base_pay=aa[0]
				people[i].position=dd[0]
				people[i].fixed_bill=inform1[0].fixed_bill
				people[i].deduct_bill=(people[i].base_pay)*cc/100
				people[i].total_bill=people[i].base_pay+people[i].fixed_bill-people[i].deduct_bill
			}else if(people[i].position_type==2){
				people[i].base_pay=aa[1]
				people[i].position=dd[1]
				people[i].fixed_bill=inform1[0].fixed_bill
				people[i].deduct_bill=(people[i].base_pay)*cc/100
				people[i].total_bill=people[i].base_pay+people[i].fixed_bill-people[i].deduct_bill
			}
			else if(people[i].position_type==3){
				people[i].base_pay=aa[2]
				people[i].position=dd[2]
				people[i].fixed_bill=inform1[0].fixed_bill
				people[i].deduct_bill=people[i].base_pay*cc/100
				people[i].total_bill=people[i].base_pay+people[i].fixed_bill-people[i].deduct_bill
			}
			else if(people[i].position_type==4){
				people[i].base_pay=aa[3]
				people[i].position=dd[3]
				people[i].fixed_bill=inform1[0].fixed_bill
				people[i].deduct_bill=people[i].base_pay*cc/100
				people[i].total_bill=people[i].base_pay+people[i].fixed_bill-people[i].deduct_bill
			}
			else if(people[i].position_type==5){
				people[i].base_pay=aa[4]
				people[i].position=dd[4]
				people[i].fixed_bill=inform1[0].fixed_bill
				people[i].deduct_bill=people[i].base_pay*cc/100
				people[i].total_bill=people[i].base_pay+people[i].fixed_bill-people[i].deduct_bill
			}
		}
				console.log(people)
				res.render("templete/commen_salary.html",{
					people:people
				})
				})
   			})
	
   		})
   	})
   	  
})
 
  
 //***********************工资补助规则***************************88*/
 
 //基本工资
    router.get('/views/salary_rule/base_pay', function(req,res){
	var sql="select * from position"
   	connection.query(sql,function(err,inform){
   		inform=JSON.stringify(inform)    //先将result转化为String类型的数据
	  	inform=JSON.parse(inform)
// 		console.log(inform)
		for(var i=0;i<inform.length;i++)
		{
			if(inform[i].position_type==1){
				inform[i].type='教师'
			}else{
				inform[i].type="行政人员"
			}
		}
//		console.log(inform)
   		 res.render("salary_rule/base_pay.html",{
   		 	inform:inform
   		 })
   	})
})
    //基本工资修改
   router.get('/views/salary_rule/base_pay_edit', function(req,res){
     	var id=req.query.id;
	var sql="select * from position where id="+id
   	connection.query(sql,function(err,inform){
   		inform=JSON.stringify(inform)    //先将result转化为String类型的数据
	  	inform=JSON.parse(inform)
   		console.log()
   		 res.render("salary_rule/base_pay_edit.html",{
   		 	inform:inform[0]
   		 })
   	})
})
   router.post('/views/salary_rule/base_pay_edit', function(req,res){
   	var inform=req.body
	var sql="update position set base_pay="+inform.base_pay+" where id="+inform.id
	console.log(sql)
   	connection.query(sql,function(err,inform1){
   		 res.redirect("/views/salary_rule/base_pay")
   	})
})
 //固定补助
    router.get('/views/salary_rule/fixed_bill', function(req,res){
	var sql="select * from fixed_bill"
   	connection.query(sql,function(err,inform){
   		inform=JSON.stringify(inform)    //先将result转化为String类型的数据
	  	inform=JSON.parse(inform)
// 		console.log(inform)
//		var length=inform.length;
//		var inform1=new Array(length-1)
//		for(var i=0;i<inform.length;i++)
//		{
//			inform1[i]=inform[i].allowance_bill;
//		}
		console.log(inform)
   		 res.render("salary_rule/fixed_bill.html",{
   		 	inform:inform
   		 })
   	})
})
    //固定补助修改
     router.get('/views/salary_rule/fixed_bill_edit', function(req,res){
     	var id=req.query.id
	var sql="select * from fixed_bill where id="+id
   	connection.query(sql,function(err,inform){
   		inform=JSON.stringify(inform)    //先将result转化为String类型的数据
	  	inform=JSON.parse(inform)
// 		console.log(inform)
//		var length=inform.length;
//		var inform1=new Array(length-1)
//		for(var i=0;i<inform.length;i++)
//		{
//			inform1[i]=inform[i].allowance_bill;
//		}
//		console.log(inform1)
   		 res.render("salary_rule/fixed_bill_edit.html",{
   		 	inform:inform
   		 })
   	})
})
      //固定补助修改
     router.post('/views/salary_rule/fixed_bill_edit', function(req,res){
     	var inform=req.body;
//   	console.log(inform)
     		var sql1='update fixed_bill set allowance_bill='+ inform.allowance_bill + ' where id='+inform.id;
	 connection.query(sql1,function(err,inform){
   		 
   })
res.redirect('/views/salary_rule/fixed_bill')

})
    //效益补助
 router.get('/views/salary_rule/unfixed_bill', function(req,res){
	var sql="select * from unfixed_bill"
   	connection.query(sql,function(err,inform){
   		inform=JSON.stringify(inform)    //先将result转化为String类型的数据
	  	inform=JSON.parse(inform)
// 		console.log(inform)
//		var length=inform.length;
//		var inform1=new Array(length-1)
//		for(var i=0;i<inform.length;i++)
//		{
//			inform1[i]=inform[i].allowance_bill;
//		}
//		console.log(inform1)
   		 res.render("salary_rule/unfixed_bill.html",{
   		 	inform:inform
   		 })
   	})
})
 
 //效益补助修改
 router.get('/views/salary_rule/unfixed_bill_edit', function(req,res){
 	var id=req.query.id
	var sql="select * from unfixed_bill where id="+id
   	connection.query(sql,function(err,inform){
   		inform=JSON.stringify(inform)    //先将result转化为String类型的数据
	  	inform=JSON.parse(inform)
//// 		console.log(inform)
//		var length=inform.length;
//		var inform1=new Array(length-1)
//		var sql=new Array(inform.length-1)
//		for(var i=0;i<inform.length;i++)
//		{
//			inform1[i]=inform[i].allowance_bill;
//		}
//		console.log(inform1)
   		 res.render("salary_rule/unfixed_bill_edit.html",{
   		 	inform:inform
   		 })
   	})
})
 //效益补助修改
 router.post('/views/salary_rule/unfixed_bill_edit', function(req,res){
 var inform=req.body;
//   	console.log(inform)
     		sql1='update unfixed_bill set allowance_bill='+ inform.allowance_bill + ' where id='+inform.id;
	 connection.query(sql1,function(err,inform){
   		 
   })
res.redirect('/views/salary_rule/unfixed_bill')
})
 
  //***********************工资扣除细则***************************88*/

  router.get('/views/salary_rule/deduct_bill', function(req,res){
//	var sql1="select * from "
// 	connection.query(sql,function(err,people){
// 		people=JSON.stringify(people)    //先将result转化为String类型的数据
//	  	people=JSON.parse(people)
//// 		console.log(people)
// 		res.render('admin_staff/admin_staff_list.html',{
// 			people:people
// 		})
// 	})
 	  res.render("salary_rule/deduct_bill.html")
})
  
  //扣除费用明细
router.get('/views/salary_rule/deduct_bill_detail', function(req,res){
	var sql="select * from deduct_bill"
   	connection.query(sql,function(err,inform){
   		inform=JSON.stringify(inform)    //先将result转化为String类型的数据
	  	inform=JSON.parse(inform)
// 		console.log(people)
//		console.log(inform)
//		var inform1=new Array(inform.length-1)
//		for(var i=0;i<inform.length;i++)
//		{
//			inform1[i]=inform[i].decult_bill
//		}
//		console.log(inform1)
   		res.render('salary_rule/deduct_bill_detail.html',{
   			inform:inform
   		})
   	})
})

//扣除费用修改
 router.get('/views/salary_rule/deduct_bill_edit', function(req,res){
 	var id=req.query.id
	var sql="select * from deduct_bill where id="+id
   	connection.query(sql,function(err,inform){
   		inform=JSON.stringify(inform)    //先将result转化为String类型的数据
	  	inform=JSON.parse(inform)
//// 		console.log(inform)
//		var length=inform.length;
//		var inform1=new Array(length-1)
//		var sql=new Array(inform.length-1)
//		for(var i=0;i<inform.length;i++)
//		{
//			inform1[i]=inform[i].decult_bill;
//		}
////		console.log(inform1)
   		 res.render("salary_rule/deduct_bill_edit.html",{
   		 	inform:inform
   		 })
   	})
})
 //扣除费用修改
 
 router.post('/views/salary_rule/deduct_bill_edit', function(req,res){
 var inform=req.body;
     sql1='update deduct_bill set decult_bill='+ inform.decult_bill + ' where id='+inform.id; 
	 connection.query(sql1,function(err,inform){
   		 
   })
res.redirect('/views/salary_rule/deduct_bill_detail')
})

//***********************历史工资记录***************************88*/

router.get('/views/history_salary/history_salary', function(req,res){
//	var sql1="select * from "
// 	connection.query(sql,function(err,people){
// 		people=JSON.stringify(people)    //先将result转化为String类型的数据
//	  	people=JSON.parse(people)
//// 		console.log(people)
// 		res.render('admin_staff/admin_staff_list.html',{
// 			people:people
// 		})
// 	})
 	  res.render("history_salary/history_salary.html")
})

router.post('/views/staff/staff_add', function(req,res){
	var people1=req.body;
//	 console.log(people1);
	var sql1='select * from user_inform where Job_Num='+"\'"+people1.Job_Num+"\'"
		connection.query(sql1,function(err,people){
   		 people=JSON.stringify(people)    //先将result转化为String类型的数据
	  	people=JSON.parse(people)
	  	console.log(people1)
   		if(people[0]!=undefined||people[0]!=null)
   		{
   			res.render("staff/staff_add_judge.html")
	
   	}else{
   		var position_type=people1.position_type;
	var sql="insert into user_inform values("
			  + "\'" + people1.Job_Num + "\'" + "," 
			   +"\'" + people1.name + "\'" + ","
			   + "\'" + people1.gender + "\'" + ","
			     + "\'" + people1.age + "\'" +  ","
			      + "\'" + people1.id_card + "\'" +  ","
			      + "\'" + people1.phone + "\'" +  ","
			        + "\'" + people1.credit_card + "\'"+  ","
			        + "\'" + people1.entry_time + "\'"+  ","
			         + position_type + "," 
			        + req.session.college_type + ")"
//			         console.log(sql)
			        
   	connection.query(sql,function(err,people2){
   		if(position_type==1)
   		{
   			res.render("staff/staff_add_success.html")
// 			res.redirect("/views/teacher/teacher_list?id=1")
   		}
	  	else{
	  		res.render("staff/staff_add_success1.html")
//	  		res.redirect("/views/teacher/teacher_list?id=2")
	  	}
   	})
   	}
   		})
 	  
})


//查询
//人员信息查询
router.post('/views/people_list_search', function(req,res){
	var inform = req.body
	
	for(var key in inform){
		if(inform[key] == ''){
			delete inform[key]
		}
	}
	console.log(inform)
	if(JSON.stringify(inform) == '{}'){
		res.redirect('/views/center/center_frame')
		return
	}
	var sql = "select * from user_inform where " 
	var i = 0
	for(var key in inform){
		if (i == 0){
			sql += key + " like" + "\'"+"%"+inform[key]+"%"+"\'"
			i++
		} else {
			sql += "and " + key + " like" + "\'"+"%"+inform[key]+"%"+"\'"
		}
	}
	sql=sql+" and user_inform.college_type="+req.session.college_type
	console.log(sql)
	connection.query(sql, function(err, people) {
		if (err) {
			return res.status(500).send('Server error'+err.message)
		}
		res.render('people_list.html', {
			people: people
		})
	})
})


//教师信息查询
router.post('/views/teacher/teacher_list_search', function(req,res){
	var inform = req.body
	var position_type=req.query.id
	console.log(position_type)
	for(var key in inform){
		if(inform[key] == ''){
			delete inform[key]
		}
	}
	console.log(inform)
	if(JSON.stringify(inform) == '{}'){
		res.redirect('/views/center/center_frame')
		return
	}
	var sql = "select * from user_inform where " 
	var i = 0
	for(var key in inform){
		if (i == 0){
			sql += key + " like" + "\'"+"%"+inform[key]+"%"+"\'"
			i++
		} else {
			sql += "and " + key + " like" + "\'"+"%"+inform[key]+"%"+"\'"
		}
	}
	sql=sql+" and position_type="+position_type+ " and user_inform.college_type="+req.session.college_type
	console.log(sql)
	connection.query(sql, function(err, people) {
		if (err) {
			return res.status(500).send('Server error'+err.message)
		}
		res.render('teacher/teacher_list.html', {
			people: people
		})
	})
})

//行政人员信息查询
router.post('/views/admin_staff/admin_staff_list_search', function(req,res){
	var inform = req.body
	var position_type=req.query.id
	console.log(position_type)
	for(var key in inform){
		if(inform[key] == ''){
			delete inform[key]
		}
	}
	console.log(inform)
	if(JSON.stringify(inform) == '{}'){
		res.redirect('/views/center/center_frame')
		return
	}
	var sql = "select * from user_inform where " 
	var i = 0
	for(var key in inform){
		if (i == 0){
			sql += key + " like" + "\'"+"%"+inform[key]+"%"+"\'"
			i++
		} else {
			sql += "and " + key + " like" + "\'"+"%"+inform[key]+"%"+"\'"
		}
	}
	sql=sql+" and position_type="+position_type+ " and user_inform.college_type="+req.session.college_type
	console.log(sql)
	connection.query(sql, function(err, people) {
		if (err) {
			return res.status(500).send('Server error'+err.message)
		}
		res.render('admin_staff/admin_staff_list.html', {
			people: people
		})
	})
})
//行政人员列表
router.post('/views/admin_staff/admin_staff_list_search', function(req,res){
	var inform = req.body
	var position_type=req.query.position_type
	console.log(position_type)
	for(var key in inform){
		if(inform[key] == ''){
			delete inform[key]
		}
	}
	console.log(inform)
	if(JSON.stringify(inform) == '{}'){
		res.redirect('/views/admin_staff/admin_staff_list')
		return
	}
	var sql = "select * from user_inform where " 
	var i = 0
	for(var key in inform){
		if (i == 0){
			sql += key + " like" + "\'"+"%"+inform[key]+"%"+"\'"
			i++
		} else {
			sql += "and " + key + " like" + "\'"+"%"+inform[key]+"%"+"\'"
		}
	}
	sql=sql+"and position_type= "+position_type
	console.log(sql)
	connection.query(sql, function(err, people) {
		if (err) {
			return res.status(500).send('Server error'+err.message)
		}
		res.render('admin_staff/admin_staff_list.html', {
			people: people
		})
	})
})
//教职工和行政人员工资查询
router.post('/views/templete/commen_salary_search', function(req,res){
	var inform = req.body
//	console.log(position_type)
	for(var key in inform){
		if(inform[key] == ''){
			delete inform[key]
		}
	}
	console.log(inform)
	if(JSON.stringify(inform) == '{}'){
		res.redirect('/views/admin_staff/admin_staff_list')
		return
	}
	var sql = "select * from user_inform where " 
	var i = 0
	for(var key in inform){
		if (i == 0){
			sql += key + " like" + "\'"+"%"+inform[key]+"%"+"\'"
			i++
		} else {
			sql += "and " + key + " like" + "\'"+"%"+inform[key]+"%"+"\'"
		}
	}
	sql=sql+"and position_type= "+req.session.position_type+ " and user_inform.college_type="+req.session.college_type
	console.log(sql)
	connection.query(sql, function(err, people) {
		if (err) {
			return res.status(500).send('Server error'+err.message)
		}
		people=JSON.stringify(people)    //先将result转化为String类型的数据
	  	people=JSON.parse(people)
//	var sql0="select Job_Num,name,position_type from user_inform where position_type="+;
//	console.log(sql)
	var sql1="select sum(allowance_bill) fixed_bill from fixed_bill";
	var sql2="select id,base_pay,position from position";
//	console.log(sql1)
	var sql3="select * from deduct_bill"
	connection.query(sql1,function(err,inform1){
		inform1=JSON.stringify(inform1)    //先将result转化为String类型的数据
	  	inform1=JSON.parse(inform1)
// 		 console.log(people)
	connection.query(sql2,function(err,inform2){
		inform2=JSON.stringify(inform2)    //先将result转化为String类型的数据
	  	inform2=JSON.parse(inform2)
// 		 console.log(inform2)
	connection.query(sql3,function(err,inform3){
		inform3=JSON.stringify(inform3)    //先将result转化为String类型的数据
	  	inform3=JSON.parse(inform3)
//	  	console.log(inform3)
	var length=inform2.length;
	var length1=inform3.length;
	var aa=new Array(length-1);
	var bb=new Array(length1-1)
	var dd=new Array(length-1)
	var cc=0;
		for(var i=0;i<inform2.length;i++)
		{
			aa[i]=inform2[i].base_pay
			dd[i]=inform2[i].position
		}
//		console.log(dd)
		for(var i=0;i<inform3.length;i++)
		{
			bb[i]=inform3[i].decult_bill
			cc=cc+inform3[i].decult_bill
		}
//		console.log(cc)
		for(var i=0;i<people.length;i++)
		{
			if(people[i].position_type==1){
				people[i].base_pay=aa[0]
				people[i].position=dd[0]
				people[i].fixed_bill=inform1[0].fixed_bill
				people[i].deduct_bill=(people[i].base_pay)*cc/100
				people[i].total_bill=people[i].base_pay+people[i].fixed_bill-people[i].deduct_bill
			}else if(people[i].position_type==2){
				people[i].base_pay=aa[1]
				people[i].position=dd[1]
				people[i].fixed_bill=inform1[0].fixed_bill
				people[i].deduct_bill=(people[i].base_pay)*cc/100
				people[i].total_bill=people[i].base_pay+people[i].fixed_bill-people[i].deduct_bill
			}
			else if(people[i].position_type==3){
				people[i].base_pay=aa[2]
				people[i].position=dd[2]
				people[i].fixed_bill=inform1[0].fixed_bill
				people[i].deduct_bill=people[i].base_pay*cc/100
				people[i].total_bill=people[i].base_pay+people[i].fixed_bill-people[i].deduct_bill
			}
			else if(people[i].position_type==4){
				people[i].base_pay=aa[3]
				people[i].position=dd[3]
				people[i].fixed_bill=inform1[0].fixed_bill
				people[i].deduct_bill=people[i].base_pay*cc/100
				people[i].total_bill=people[i].base_pay+people[i].fixed_bill-people[i].deduct_bill
			}
			else if(people[i].position_type==5){
				people[i].base_pay=aa[4]
				people[i].position=dd[4]
				people[i].fixed_bill=inform1[0].fixed_bill
				people[i].deduct_bill=people[i].base_pay*cc/100
				people[i].total_bill=people[i].base_pay+people[i].fixed_bill-people[i].deduct_bill
			}
		}
				console.log(people)
				res.render("templete/commen_salary.html",{
					people:people
				})
				})
   		})
   	})
		
	})
})
//人员批量删除
router.get('/views/people_list/delete_more', function(req,res){
	 var selectId = req.query.id.split(",")
		var delsql1 = 'DELETE FROM user where LoginAcc ='
		for(var i = 0; i < selectId.length; i++){
			if(i == 0){
				delsql1 += "\'"+selectId[i]+"\'"
			} else {
				delsql1 += ' or LoginAcc = ' +"\'"+ selectId[i]+"\'"
			}
		}
		console.log(delsql1)
		var delsql2 = 'DELETE FROM user_inform where Job_Num ='
		for(var i = 0; i < selectId.length; i++){
			if(i == 0){
				delsql2 += "\'"+ selectId[i]+"\'"
			} else {
				delsql2 += " or Job_Num = " + "\'"+selectId[i]+"\'"
			}
		}
		console.log(delsql2)
   	connection.query(delsql1,function(err,inform1){
   		 connection.query(delsql2,function(err,inform2){
   		 		res.redirect("/views/center/center_frame")
   	})
   	})
})
//教师人员批量删除
router.get('/views/teacher_list/delete_more', function(req,res){
	 var selectId = req.query.id.split(",")
		var delsql1 = 'DELETE FROM user where LoginAcc ='
		for(var i = 0; i < selectId.length; i++){
			if(i == 0){
				delsql1 += "\'"+ selectId[i]+"\'"
			} else {
				delsql1 += ' or LoginAcc = ' + "\'"+selectId[i]+"\'"
			}
		}
		console.log(delsql1)
		var delsql2 = 'DELETE FROM user_inform where Job_Num ='
		for(var i = 0; i < selectId.length; i++){
			if(i == 0){
				delsql2 +="\'" + selectId[i] +"\'"
			} else {
				delsql2 += " or Job_Num = " + selectId[i]
			}
		}
		console.log(delsql2)
   	connection.query(delsql1,function(err,inform1){
   		 connection.query(delsql2,function(err,inform2){
   		 res.redirect("/views/teacher/teacher_list?id=1")
   	})
   	})
})
//行政人员批量删除
router.get('/views/admin_staff_list/delete_more', function(req,res){
	 var selectId = req.query.id.split(",")
		var delsql1 = 'DELETE FROM user where LoginAcc ='
		for(var i = 0; i < selectId.length; i++){
			if(i == 0){
				delsql1 += "\'"+selectId[i]+"\'"
			} else {
				delsql1 += ' or LoginAcc = ' + " \'"+selectId[i]+"\'"
			}
		}
		console.log(delsql1)
		var delsql2 = 'DELETE FROM user_inform where LoginAcc ='
		for(var i = 0; i < selectId.length; i++){
			if(i == 0){
				delsql2 += "\'"+selectId[i]+"\'"
			} else {
				delsql2 += ' or Job_Num = ' +"\'"+ selectId[i]+"\'"
			}
		}
		console.log(delsql2)
   	connection.query(delsql1,function(err,inform1){
   		 connection.query(delsql2,function(err,inform2){
   		 res.redirect("/views/admin_staff/admin_staff_list?id=2")
   	})
   	})
})
	
	
//教职工资修改
router.get('/views/templete/commen_salary_edit', function(req,res){
   	var Job_Num=req.query.Job_Num;
   	console.log(Job_Num)
	console.log(req.session.position_type)
//	var sql="select Job_Num,name,position_type from user_inform where position_type="+id+ " and user_inform.college_type="+req.session.college_type;
////	console.log(sql)
//	var sql1="select sum(allowance_bill) fixed_bill from fixed_bill";
//	var sql2="select id,base_pay,position from position";
////	console.log(sql1)
//	var sql3="select * from deduct_bill"
//	connection.query(sql,function(err,people){
//		people=JSON.stringify(people)    //先将result转化为String类型的数据
//	  	people=JSON.parse(people)
//// 		 console.log(people)
//	connection.query(sql1,function(err,inform1){
//		inform1=JSON.stringify(inform1)    //先将result转化为String类型的数据
//	  	inform1=JSON.parse(inform1)
//// 		 console.log(people)
//	connection.query(sql2,function(err,inform2){
//		inform2=JSON.stringify(inform2)    //先将result转化为String类型的数据
//	  	inform2=JSON.parse(inform2)
// 		 console.log(inform2)
//	connection.query(sql3,function(err,inform3){
//		inform3=JSON.stringify(inform3)    //先将result转化为String类型的数据
//	  	inform3=JSON.parse(inform3)
////	  	console.log(inform3)
//	var length=inform2.length;
//	var length1=inform3.length;
//	var aa=new Array(length-1);
//	var bb=new Array(length1-1)
//	var dd=new Array(length-1)
//	var cc=0;
//		for(var i=0;i<inform2.length;i++)
//		{
//			aa[i]=inform2[i].base_pay
//			dd[i]=inform2[i].position
//		}
//		console.log(dd)
//		for(var i=0;i<inform3.length;i++)
//		{
//			bb[i]=inform3[i].decult_bill
//			cc=cc+inform3[i].decult_bill
//		}
//		console.log(cc)
//		for(var i=0;i<people.length;i++)
//		{
//			if(people[i].position_type==1){
//				people[i].base_pay=aa[0]
//				people[i].position=dd[0]
//				people[i].fixed_bill=inform1[0].fixed_bill
//				people[i].deduct_bill=(people[i].base_pay)*cc/100
//				people[i].total_bill=people[i].base_pay+people[i].fixed_bill-people[i].deduct_bill
//			}else if(people[i].position_type==2){
//				people[i].base_pay=aa[1]
//				people[i].position=dd[1]
//				people[i].fixed_bill=inform1[0].fixed_bill
//				people[i].deduct_bill=(people[i].base_pay)*cc/100
//				people[i].total_bill=people[i].base_pay+people[i].fixed_bill-people[i].deduct_bill
//			}
//			else if(people[i].position_type==3){
//				people[i].base_pay=aa[2]
//				people[i].position=dd[2]
//				people[i].fixed_bill=inform1[0].fixed_bill
//				people[i].deduct_bill=people[i].base_pay*cc/100
//				people[i].total_bill=people[i].base_pay+people[i].fixed_bill-people[i].deduct_bill
//			}
//			else if(people[i].position_type==4){
//				people[i].base_pay=aa[3]
//				people[i].position=dd[3]
//				people[i].fixed_bill=inform1[0].fixed_bill
//				people[i].deduct_bill=people[i].base_pay*cc/100
//				people[i].total_bill=people[i].base_pay+people[i].fixed_bill-people[i].deduct_bill
//			}
//			else if(people[i].position_type==5){
//				people[i].base_pay=aa[4]
//				people[i].position=dd[4]
//				people[i].fixed_bill=inform1[0].fixed_bill
//				people[i].deduct_bill=people[i].base_pay*cc/100
//				people[i].total_bill=people[i].base_pay+people[i].fixed_bill-people[i].deduct_bill
//			}
//		}
//				console.log(people)
//				res.render("templete/commen_salary.html",{
//					people:people
//				})
//				})
// 			})
//	
// 		})
// 	})
   	  
})


module.exports = router
