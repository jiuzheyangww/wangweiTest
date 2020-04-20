/*
 * 处理路由
 */
var fs = require('fs')
var Pfile = require('./file')
var path = require('path');
var express = require('express')
var router3 = express.Router()
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
router3.use(session({
    secret: 'film',
    resave: true,
    saveUninitialized: true,
    cookie: {
        maxAge: 1000 * 60 * 30  // harlf of hour
    }
}));

 

//照片上传
router3.post('/resources/editor/kindeditor/jsp/upload_json.jsp',function(req,res,next){
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


 
 router3.get('/views/personnal/top', function(req,res){
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
 
 //个人主页
 router3.get('/views/personnal/top', function(req,res){
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
 router3.get('/views/personnal/teacher/teacher_list', function(req,res){
 	var id=req.query.id;
   	console.log(id);
   	var sql='select * from user_inform,position_type where user_inform.position_type=position_type.id and user_inform.position_type='+req.query.id+" and user_inform.college_type="+req.session.college_type;
   	console.log(sql)
 	connection.query(sql,function(err,people){
 		people=JSON.stringify(people)    //先将result转化为String类型的数据
	  	people=JSON.parse(people)
// 		console.log(people)
 		res.render('personnal/teacher/teacher_list.html',{
 			people:people
 		})
 	})
 	  
})
 
  
 
  //行政人员列表
 router3.get('/views/personnal/admin_staff/admin_staff_list', function(req,res){
 	var id=req.query.id;
// 	console.log(id);
   	var sql='select * from user_inform,position_type where user_inform.position_type=position_type.id and user_inform.position_type=' +req.query.id+" and user_inform.college_type="+req.session.college_type;
   	console.log(sql)
   	connection.query(sql,function(err,people){
   		people=JSON.stringify(people)    //先将result转化为String类型的数据
	  	people=JSON.parse(people)
// 		console.log(people)
   		res.render('personnal/admin_staff/admin_staff_list.html',{
   			people:people
   		})
   	})
 	  
})
 
 
 //center页面的iframe
 //行政人员列表
 router3.get('/views/personnal/center_frame', function(req,res){
	var sql="select * from user_inform where college_type="+req.session.college_type
   	connection.query(sql,function(err,people){
   		people=JSON.stringify(people)    //先将result转化为String类型的数据
	  	people=JSON.parse(people)
	  	 res.render("personnal/people_list.html",{
	  	 	people:people
	  	 })
   	})
})
  
  //职工工资管理显示
 router3.get('/views/personnal/templete/commen_salary', function(req,res){
   	var id=req.query.id;
	req.session.position_type=id
	console.log(req.session.position_type)
	var sql="select Job_Num,name,position_type from user_inform where position_type="+id+" and user_inform.college_type="+req.session.college_type;
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
				res.render("personnal/templete/commen_salary.html",{
					people:people
				})
				})
   			})
	
   		})
   	})
   	  
})
 
  
 //***********************工资补助规则***************************88*/


 //基本工资
    router3.get('/views/personnal/salary_rule/base_pay', function(req,res){
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
   		 res.render("personnal/salary_rule/base_pay.html",{
   		 	inform:inform
   		 })
   	})
})
 
 //固定补助
    router3.get('/views/personnal/salary_rule/fixed_bill', function(req,res){
	var sql="select * from fixed_bill"
   	connection.query(sql,function(err,inform){
   		inform=JSON.stringify(inform)    //先将result转化为String类型的数据
	  	inform=JSON.parse(inform)
   		 res.render("personnal/salary_rule/fixed_bill.html",{
   		 	inform:inform
   		 })
   	})
})
     
    //效益补助
 router3.get('/views/personnal/salary_rule/unfixed_bill', function(req,res){
	var sql="select * from unfixed_bill"
   	connection.query(sql,function(err,inform){
   		inform=JSON.stringify(inform)    //先将result转化为String类型的数据
	  	inform=JSON.parse(inform)
// 		console.log(inform)
   		 res.render("personnal/salary_rule/unfixed_bill.html",{
   		 	inform:inform
   		 })
   	})
})
 
 
 
  //***********************工资扣除细则***************************88*/

  router3.get('/views/personnal/salary_rule/deduct_bill', function(req,res){
//	var sql1="select * from "
// 	connection.query(sql,function(err,people){
// 		people=JSON.stringify(people)    //先将result转化为String类型的数据
//	  	people=JSON.parse(people)
//// 		console.log(people)
// 		res.render('admin_staff/admin_staff_list.html',{
// 			people:people
// 		})
// 	})
 	  res.render("personnal/salary_rule/deduct_bill.html")
})
  
  //扣除费用明细
router3.get('/views/personal/salary_rule/deduct_bill_detail', function(req,res){
	var sql="select * from deduct_bill"
   	connection.query(sql,function(err,inform){
   		inform=JSON.stringify(inform)    //先将result转化为String类型的数据
	  	inform=JSON.parse(inform)
// 		console.log(inform)
////		console.log(inform)
//		var inform1=new Array(inform.length-1)
//		for(var i=0;i<inform.length;i++)
//		{
//			inform1[i]=inform[i].decult_bill
//		}
////		console.log(inform1)
   		res.render('personnal/salary_rule/deduct_bill_detail.html',{
   			inform:inform
   		})
   	})
})

 
//***********************历史工资记录***************************88*/

router3.get('/views/history_salary/history_salary', function(req,res){
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

//添加职工  默认情况下添加的是普通用户

router3.post('/views/staff/staff_add', function(req,res){
	var people1=req.body;
//	 console.log(people1);
	var position_type=people1.position_type;
	console.log(position_type);
	var sql="insert into user_inform values("
			  + "\'" + people1.Job_Num + "\'" + "," 
			   +"\'" + people1.name + "\'" + ","
			   + "\'" + people1.gender + "\'" + ","
			     + "\'" + people1.age + "\'" +  ","
			      + "\'" + people1.id_card + "\'" +  ","
			      + "\'" + people1.phone + "\'" +  ","
			        + "\'" + people1.credit_card + "\'"+  ","
			        + "\'" + people1.entry_time + "\'"+  ","
			         + position_type + ")"
			         console.log(sql)
			        
   	connection.query(sql,function(err,people){
   		if(position_type==1)
   		{
   			res.redirect("/views/teacher/teacher_list?id=1")
   		}
	  	else{
	  		res.redirect("/views/teacher/teacher_list?id=2")
	  	}
   	})
 	  
})

//教职工和行政人员工资查询
router3.post('/views/personnal/templete/commen_salary_search', function(req,res){
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
	sql=sql+"and position_type= "+req.session.position_type+" and user_inform.college_type="+req.session.college_type
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
				res.render("personnal/templete/commen_salary.html",{
					people:people
				})
				})
   		})
   	})
		
	})
})
//人员信息查询
router3.post('/views/personnal/people_list_search', function(req,res){
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
router3.post('/views/personnal/teacher/teacher_list_search', function(req,res){
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
	sql=sql+" and position_type="+position_type+" and user_inform.college_type="+req.session.college_type
	console.log(sql)
	connection.query(sql, function(err, people) {
		if (err) {
			return res.status(500).send('Server error'+err.message)
		}
		res.render('personnal/teacher/teacher_list.html', {
			people: people
		})
	})
})

//行政人员信息查询
router3.post('/views/personnal/admin_staff/admin_staff_list_search', function(req,res){
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
	sql=sql+" and position_type="+position_type+" and user_inform.college_type="+req.session.college_type
	console.log(sql)
	connection.query(sql, function(err, people) {
		if (err) {
			return res.status(500).send('Server error'+err.message)
		}
		res.render('personnal/admin_staff/admin_staff_list.html', {
			people: people
		})
	})
})

//密码修改
router3.post('/views/personnal/pwd_edit', function(req,res){
	 var inform = req.body
    let pwd = inform.new_pwd;
    let md5 = crypto.createHash("md5");   //创建哈希
    let newPas = md5.update(pwd).digest("hex"); 
    console.log(newPas)
    var sql= 'update user set pwd ='+ "\'"+newPas+"\'"+ 'where LoginAcc =' +"\'"+ req.session.LoginAcc+"\'" ;
    console.log(newPas)
   	connection.query(sql,function(err,inform){
   		 
   		res.render('login_pwd_edit.html')
   	})
})


 //center页面的iframe
 //人员列表
 router3.get('/views/personnal/center/center_frame', function(req,res){
	var sql="select * from user_inform where college_type="+"\'"+req.session.college_type+"\'"
   	connection.query(sql,function(err,people){
   		people=JSON.stringify(people)    //先将result转化为String类型的数据
	  	people=JSON.parse(people)
	  	 res.render("personnal/people_list.html",{
	  	 	people:people
	  	 })
   	})
})
module.exports = router3
