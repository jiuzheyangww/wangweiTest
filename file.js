/*
 * 负责数据文件的操作
 */
let mysql = require('mysql');

let connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'mysql',
    database: 'information'
});

var fs = require('fs')
var dbPath = './db.json'
var XWPath = './views/detail/wzgl/bluePencil.json'

exports.find = function (callback) {
	fs.readFile(dbPath, 'utf8', function(err, data){
		if(err){
			return callback(err)
		}
		callback(null,JSON.parse(data).people)
	})
}
exports.findXW = function (callback) {
		fs.readFile(XWPath, 'utf8', function(err, data){
			if(err){
				return callback(err)
			}
			callback(null,JSON.parse(data).inform)
		})
}
exports.searchFile = function(sql,callback){
	connection.query(sql, function (err,result) {
	  if(err){
	    return callback(err)
	  }
	  callback(null,result)
	})
}
//权限函数
exports.get_accesslist= function (callback) {
	 var sql1='SELECT commen_userroleinf.loginAcc,commen_userpowerinfo.property,commen_userpowerinfo.people_ctrol FROM commen_userroleinf,commen_userpowerinfo  WHERE commen_userroleinf.property = commen_userpowerinfo.property and  commen_userroleinf.loginAcc='+"\'"+req.session.username+"\'"
//	console.log(sql1)
	connection.query(sql1,function (err,result) {
	  if(err){
	    return err;
	  }
	  result=JSON.stringify(result)    //先将result转化为String类型的数据
	  result=JSON.parse(result) 
   	 var aa=result[0].people_ctrol
   	 callback(null,result[0].people_ctrol)
   })
}

//根据id获取信息
exports.findById = function(id, callback) {
	fs.readFile(dbPath, 'utf8', function(err, data){
		if(err){
			return callback(err)
		}
		var people = JSON.parse(data).people
		var ret = people.find(function(item) {
			return item.id === parseInt(id)
		})
		console.log(ret)
		callback(null, ret)
	})
}
exports.findXWById = function(id, callback) {
	fs.readFile(XWPath, 'utf8', function(err, data){
		if(err){
			return callback(err)
		}
		var inform = JSON.parse(data).inform
		var ret = inform.find(function(item) {
			return item.id === parseInt(id)
		})
		callback(null, ret)
	})
}
exports.searchById = function(sql, getId, callback){
	connection.query(sql,function (err,result) {
	  if(err){
	    //console.log('error');
	    return callback(err)
	  }
	  result=JSON.stringify(result)    //先将result转化为String类型的数据
	  //console.log(result);
	  result=JSON.parse(result)   //再将result类型的数据转化为JOSN对象，得到的是一个对象数组
	  callback(null,result[0])  //  将得到的数据返回给调用它的地方
	})
}
/*
 * 更新条目
 */
exports.updateById = function (peopleData, callback) {
	fs.readFile(dbPath, 'utf8', function(err, data){
		if(err){
			return callback(err)
		}
		var people = JSON.parse(data).people
		
		peopleData.id = parseInt(peopleData.id)
		
		var peo = people.find(function(item) {
			return item.id === peopleData.id
		})
		
		for(var key in peopleData) {
			peo[key] = peopleData[key]
		}
		
		//把对象数据转换为字符串
		var fileData = JSON.stringify({
			people: people
		})
		//把字符串保存到文件中
		fs.writeFile(dbPath, fileData, function(err) {
			if (err) {
				//错误就是把错误对象传递给他
				return callback(err)
			}
			//成功就没错，所以错误对象是null
			callback(null)
		})
	})
}
exports.editById = function(editsql, callback){
	connection.query(editsql,function(err,result){
    if (err) {
    	return callback(err);
    };
    //console.log(result)
    callback(null, result)
	})
}

/*
 * 删除条目
 */
exports.deleteById = function (id, callback) {
	fs.readFile(dbPath, 'utf8', function(err, data){
		if(err){
			return callback(err)
		}
		var people = JSON.parse(data).people

		var deleteId = people.findIndex(function (item) {
			return item.id === parseInt(id)
		})
		
		people.splice(deleteId, 1)
		
		var fileData = JSON.stringify({
			people: people
		})
		fs.writeFile(dbPath, fileData, function(err) {
			if (err) {
				return callback(err)
			}
			callback(null)
		})
	})
}

exports.deleteSql = function(delsql, getId, callback){
	connection.query(delsql,function (err,result) {
	  if(err){
	    return callback(err);
	  }
	callback(null, result)
	})
}

/*
 * 新增条目
 */
exports.increaseSql = function(sql, callback){
	connection.query(sql,function (err,result) {
	  if(err){
	    return callback(err);
	  }
	callback(null)
	})
}

/*
 * 查询
 */
exports.selectSql = function(sql,callback){
	connection.query(sql,function (err,result) {
	  if(err){
	    return callback(err);
	  }
	callback(null,result)
	})
}
