src='http://code.jquery.com/jquery-1.9.1.min.js'>
function myFunct (){
    //nothing just test
};

var uid;
var pwd;
var courseListName = new Array();;
var needCourseList = new Array();;

let tabName = ['cou_name','cou_date']
var myData = new Array();

function getCourse(){
    cname = document.getElementById("couName").value;
    dept = document.getElementById("dept").value;
    gen = document.getElementById("gen").value
    if (cname == '' && gen == '%' ){
        alert('請輸入課程名稱');
    }else{
        document.getElementById("loadingBtn").hidden=false;
        document.getElementById("searchBtn").disabled=true;
        document.getElementById('courseList').innerHTML = '';
        if (cname == "" && gen != '%'){
            cname = "%";
        }

    $.ajax({
        url: "https://api.nasss.ml:5002/?name="+cname + "&dept=" +dept + "&gen=" + gen,
        type: "GET",
        cache:false,
        dataType: 'json',
        contentType: "application/json",
        crossDomain: true,
        success: function (data) {
            myData=data;
            var ul = document.getElementById("courseList");
            for (i=0 ; i<data.length ;i++) {

                var li = document.createElement("tr");
                li.setAttribute("id", "course"+i);
                ul.appendChild(li)
                var nTable = document.getElementById("course"+i);

                for (var j = 0 ; j<2 ; j++){
                    var nTableid = document.createElement("td");
                    nTableid.setAttribute("CouID","course0"+i);
                    nTableid.innerHTML = data[i][tabName[j]];
                    nTable.appendChild(nTableid);
                }

                var nButton = document.createElement("td");

                nButton.innerHTML = "<button class=\"btn btn-primary\" type=\"button\" onclick=\"addCourseNEW("+i+");\" id=\"addBtn"+data[i]["cou_id"]+"\" style=\" \">新增</button>";
                
                nTable.appendChild(nButton);

                nButton = document.createElement("td");
                nButton.innerHTML = "<button class=\"btn btn-primary\" type=\"button\" onclick=\"viewDetial('"+i+"');\" data-toggle=\"modal\" data-target=\"#coudetial\" id=\"detial"+data[i]["cou_id"]+"\" style=\"background: rgb(89,90,94)\"> 詳細 </button>";
                nTable.appendChild(nButton);
                myData[i]['indID']=i;

            }
            document.getElementById("loadingBtn").hidden=true;
            document.getElementById("searchBtn").disabled=false;
        },

    });
    }
};
let nameList = ["cou_name","cou_id","cou_score","cou_class","cou_dept","cou_times","cou_requ","cou_teach","cou_room","cou_info","canselect"];
let need_print = ["課程名稱：","課程代號：","學分數：","開課班級：","開課系所：","時數：","必選修：","授課教師：","授課教室：","備註：","可選人數："];

function viewDetial(ind){
    document.getElementById('coudtlList').innerHTML = '';
    let nTable = document.getElementById("coudtlList");
    for (j=0;j<11;j++){
        var nTableid = document.createElement("p");
        nTableid.innerHTML = need_print[j]+myData[ind][nameList[j]];
        nTable.appendChild(nTableid);
    }
}

function addCourse(id){
    let courseID = myData[id]['cou_id']
    needCourseList[courseID]=(myData[id]);
    var chgbtn = document.getElementById("addBtn"+courseID);
    chgbtn.setAttribute("onclick","delCourse('"+courseID+"','"+needCourseList[courseID]['indID']+"');");
    chgbtn.setAttribute("style","background: rgb(238,45,88)");
    chgbtn.innerHTML="移除";
    updateNeedList();
}

function addCourseNEW(id){
    let courseID = myData[id]['cou_id']
    needCourseList[courseID]=(myData[id]);
    var chgbtn = document.getElementById("addBtn"+courseID);
    chgbtn.setAttribute("onclick","delCourse('"+courseID+"','"+needCourseList[courseID]['indID']+"');");
    chgbtn.setAttribute("style","background: rgb(238,45,88)");
    chgbtn.innerHTML="移除";
    updateNeedList();
    updateTable();
}

function updateTable(){
        createTable()
        for (var key in needCourseList){
            var courseDateSplit = needCourseList[key].cou_date.split("(");
            delete (courseDateSplit[0])

            courseDateSplit.forEach(function(myList){
 
                var cousID = "Tcourse";
                switch (myList[0]){
                    case "一" : cousID += "1"; break;
                    case "二" : cousID += "2"; break;
                    case "三" : cousID += "3"; break;
                    case "四" : cousID += "4"; break;
                    case "五" : cousID += "5"; break;
                }
                var startTime = 0
                var endTime = 0
                if (myList.length >= 5){
                    startTime = myList[2]
                    endTime = myList[4]
                }else{
                    startTime = myList[2]
                    endTime = myList[2]
                }
                for (var i = startTime ; i<=endTime;i++){
                    var idTemp = cousID
                    idTemp += i
                    findID = document.getElementById(idTemp)
                    var needInner = "<strong>"+needCourseList[key].cou_name + "</strong><br>" + needCourseList[key].cou_teach + "<br>" + needCourseList[key].cou_room;
                    if (findID.innerHTML != ""){
                        needInner += "<br><br>" + findID.innerHTML + "<br>";
                        findID.style.color = 'red';
                    }
                    findID.innerHTML =  needInner
                }                
            });

        }
    }

function delCourse(cId,indID){
    var chgbtn = document.getElementById("addBtn"+cId);
    delete needCourseList[cId];
    chgbtn.setAttribute("onclick","addCourseNEW('"+indID+"');");
    chgbtn.setAttribute("style"," ");
    chgbtn.innerHTML="新增";
    updateNeedList();
    updateTable();
}

let updList = ['cou_name','cou_id'];

function updateNeedList(){
    document.getElementById('selCourseList').innerHTML = '';
    var updateList = document.getElementById("selCourseList");
    var selCountInt = 0;
    for (var key in needCourseList){
        selCountInt += parseInt(needCourseList[key].cou_score);
        var li = document.createElement("tr");
        li.setAttribute("id", "needCourse"+key);
        updateList.appendChild(li)
        var nTable = document.getElementById("needCourse"+key);

        for (var j = 0 ; j<2 ; j++){
            var nTableid = document.createElement("td");
            nTableid.setAttribute("CouID","needCourse0"+key);
            nTableid.innerHTML = needCourseList[key][updList[j]];
            nTable.appendChild(nTableid);
        }

        var nButton = document.createElement("button");
        nButton.setAttribute("class","btn btn-primary");
        nButton.setAttribute("type","button");
        nButton.setAttribute("onclick","delCourse('"+needCourseList[key]["cou_id"]+"','"+needCourseList[key]['indID']+"');");
        nButton.setAttribute("id","addBtn"+needCourseList[key]["cou_id"]);
        nButton.setAttribute("style","background: rgb(238,45,88)");
        nButton.innerHTML = "移除";
        nTable.appendChild(nButton);
    }
    var selCount = document.getElementById("selectCount");
    selCount.innerHTML = "已選學分數："+selCountInt

}


window.onload = function ctb(){
    createTable()
}

function createTable(){
    var ul = document.getElementById("TableList");
    document.getElementById("TableList").innerHTML = ""
    for (i=0 ; i<9 ;i++) {
        var li = document.createElement("tr");
        li.setAttribute("id", "time"+i);
        ul.appendChild(li)
        var nTable = document.getElementById("time"+i);
        for (var j = 0 ; j<=5 ; j++){
            var nTableid = document.createElement("td");
            nTableid.setAttribute("id","Tcourse"+j+(i+1));
            if (j == 0){
                nTableid.innerHTML = "第"+(i+1)+"節"
            }else{
                nTableid.innerHTML = "";
            }
            nTable.appendChild(nTableid);
        }
    }
}

