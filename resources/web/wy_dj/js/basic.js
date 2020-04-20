

//切换菜单
function nav(thisObj,Num){
if(thisObj.className == "at")return;
var tabObj = thisObj.parentNode.id;
var tabList = document.getElementById(tabObj).getElementsByTagName("li");
for(i=0; i <tabList.length; i++)
{
  if (i == Num)
  {
   thisObj.className = "at"; 
      document.getElementById(tabObj+"_c_"+i).style.display = "block";
  }else{
   tabList[i].className = "not"; 
   document.getElementById(tabObj+"_c_"+i).style.display = "none";
  }
} 
}
function tts(thisObj,Num){
if(thisObj.className == "at")return;
var tabObj = thisObj.parentNode.id;
var tabList = document.getElementById

(tabObj).getElementsByTagName("li");
for(i=0; i <tabList.length; i++)
{
  if (i == Num)
  {
   thisObj.className = "at"; 
      document.getElementById(tabObj+"_c_"+i).style.display = 

"block";
  }else{
   tabList[i].className = "lis"; 
   document.getElementById(tabObj+"_c_"+i).style.display = 

"none";
  }
} 
}





