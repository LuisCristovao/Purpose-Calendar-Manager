
var html=document.getElementsByTagName("html")[0];
var global_width=html.offsetWidth;
var global_height=html.offsetHeight;
var prev_width=global_width;
var prev_height=global_height;




var all_calendars=getCalendars()


function getCalendars(){
    if(localStorage["PCM"]!=null){
        CalculateDaysSelected()
        return JSON.parse(localStorage["PCM"])
    }
    else{
        localStorage["PCM"]=JSON.stringify({})
        return {}
    }
}    
function CalculateDaysSelected(){
    var pcm=JSON.parse(localStorage["PCM"])
    for(var calendar in pcm){
        var days_selected=0;
        if(localStorage[calendar]!=null){
            
            var cal_json=JSON.parse(localStorage[calendar])
            for(var month_index=0;month_index<cal_json.length;month_index++){
                var days=cal_json[month_index].days
                for(var day in days){
                    if(days[day]==true){
                        days_selected++
                    }
                } 
            }
        }
        pcm[calendar]="("+days_selected+"/365)"
    }
    localStorage["PCM"]=JSON.stringify(pcm)
}  
    
function range(initial,end){
    var array=[]
    for(var i=initial;i<end;i++){
        array.push(i)
    }
    return array
}

function Highlight(el){
    el.style["text-decoration"]="underline"
}
function NotHighLight(el){
    el.style["text-decoration"]=""
}

function titleSize(){
    return (global_height>global_width)?"10vh":"7vw"
}
function tableFontSize(){
    return (global_height>global_width)?"5vh":"8vh"
}
function inputFontSize(){
    return (global_height>global_width)?"6vw":"6vh"
}
function tablePadding(){
    return (global_height>global_width)?"5%":"0%"
}
function SubMenuFontSize(){
    return (global_height>global_width)?"4vh":"7vh"
}
function footerFontSize(){
    return (global_height>global_width)?"5vh":"8vh"
}
function hyperlinkStyle(color){
    return "text-decoration:underline;color:"+color+";"
}

function updatePrevWidthHeight(){
     //update prev_width and height to not use createPage()
    html=document.getElementsByTagName("html")[0];
    global_width=html.offsetWidth;
    global_height=html.offsetHeight;
    prev_width=global_width;
    prev_height=global_height;
}

function removeSubMenu(el){
    //el.get
    //CreatePage()
    
    var new_html='<td><ul><li onmouseover="Highlight(this)" onmouseout="NotHighLight(this)" was_clicked="false" onclick="clickAction(this)" style="cursor:pointer;">'+el.innerText.split("\n")[0]+"</li></ul></td>"
    new_html+="<td><ul>"+all_calendars[el.innerText.split("\n")[0]]+"</ul></td>"
    //changing row
    el.parentElement.parentElement.innerHTML=new_html
    
}
function addSubMenu(el){
    
    //el.parentElement.parentElement.innerHTML="<td colspan='2'><ul><li>ola</li></ul></td>"
    
    //change array to map of option_name:function_to_execute()
    var map={"Enter Calendar":"enterCalendar(this)","Import Calendar":"importCalendar(this)","Export Calendar":"exportCalendar(this)","Reset Calendar":"resetCalendar(this)","Remove Calendar":"removeCalendar(this)"}
    
    var new_html="<td colspan='2'><ul>"+el.innerHTML.split("</ul")[0]+"<div>"

    for(var key in map){
        new_html+='<ul onclick="'+map[key]+'"><li style="'+hyperlinkStyle('#0183D9')+';cursor:pointer;font-size:'+SubMenuFontSize()+'">'+key+'</li></ul>'
    }
    new_html+="</ul></div></td>"
    //changing row
    el.parentElement.parentElement.innerHTML=new_html
    
    /*var ul=document.createElement("ul")
    var li=document.createElement("li")
    
    ul.appendChild(li)
    el.appendChild(ul)
    
    li*/
}


function enterCalendar(el){
    var calendar=el.parentElement.parentElement.innerText.split("\n")[0];
    window.location.href="PurposeCalendar.html?"+calendar
}
function resetCalendar(el){
    var calendar=el.parentElement.parentElement.innerText.split("\n")[0];
    if(localStorage[calendar]!=null){
        delete localStorage[calendar]
        el.innerHTML='<li style="'+hyperlinkStyle('#2AB30E')+';font-size:'+SubMenuFontSize()+'">Reseted calendar with success!</li>'
    }
    else{
        el.innerHTML='<li style="'+hyperlinkStyle('#497964')+';font-size:'+SubMenuFontSize()+'">Already at initial state!</li>'
    }
    
    var f=function(element){
        element.innerHTML='<li style="'+hyperlinkStyle('#0183D9')+';cursor:pointer;font-size:'+SubMenuFontSize()+'">Reset Calendar</li>'
        updatePrevWidthHeight()
    }
    setTimeout(function(){f(el)},2000)
    updatePrevWidthHeight()
    //CreatePage()
}
function removeCalendar(el){
    if(confirm("Are you sure?")){
        
        var calendar=el.parentElement.parentElement.innerText.split("\n")[0];
        delete localStorage[calendar]
        var aux=JSON.parse(localStorage["PCM"])
        delete aux[calendar]
        localStorage["PCM"]=JSON.stringify(aux)
        all_calendars=aux
        CreatePage()
    }
    
}
function importCalendarUndo(input){

    input.parentElement.parentElement.outerHTML='<ul onclick="importCalendar(this)"><li style="'+hyperlinkStyle('#0183D9')+';font-size:'+SubMenuFontSize()+'">Import Calendar</li></ul>'
    updatePrevWidthHeight()
 
}
function importCalendarActionBtn(input){
    
    
    // Do something
    //alert(document.getElementsByTagName("input")[0].value);
    input=input.parentElement.children[0]
    if(input.value!=""){
        var _calendar=input.parentElement.parentElement.parentElement.parentElement.innerText.split("\n")[0];

        localStorage[_calendar]=input.value
        var ul=input.parentElement.parentElement
        input.parentElement.parentElement.innerHTML='<li style="'+hyperlinkStyle('#2AB30E')+'">Imported calendar with success!</li>'
        var f=function(ele){
            ele.outerHTML='<ul onclick="importCalendar(this)"><li style="'+hyperlinkStyle('#0183D9')+';font-size:'+SubMenuFontSize()+'">Import Calendar</li></ul>'
            updatePrevWidthHeight()
        }

        setTimeout(function(){f(ul)},2000)
        updatePrevWidthHeight()
    }
    else{
        input.placeholder="Must not be empty!"
    }
    
}
function importCalendarAction(event,input){
    //press enter
    if (event.keyCode == 13 ) {
        // Do something
        //alert(document.getElementsByTagName("input")[0].value);
        if(input.value!=""){
            var _calendar=input.parentElement.parentElement.parentElement.parentElement.innerText.split("\n")[0];
            
            localStorage[_calendar]=input.value
            var ul=input.parentElement.parentElement
            input.parentElement.parentElement.innerHTML='<li style="'+hyperlinkStyle('#2AB30E')+'">Imported calendar with success!</li>'
            var f=function(ele){
                ele.outerHTML='<ul onclick="importCalendar(this)"><li style="'+hyperlinkStyle('#0183D9')+'">Import Calendar</li></ul>'
                updatePrevWidthHeight()
            }

            setTimeout(function(){f(ul)},2000)
            updatePrevWidthHeight()
        }
        else{
            input.placeholder="Must not be empty!"
        }
    }
}
function importCalendar(el){
    
    var calendar=el.parentElement.parentElement.innerText.split("\n")[0];

    openInput(el,'Insert JSON','importCalendarAction(event,this)',okBtn('importCalendarActionBtn(this)'),crossBtn('importCalendarUndo(this)'))
    updatePrevWidthHeight()
}
const copyToClipboard = str => {
  const el = document.createElement('textarea');
  el.value = str;
  el.setAttribute('readonly', '');
  el.style.position = 'absolute';
  el.style.left = '-9999px';
  document.body.appendChild(el);
  el.select();
  document.execCommand('copy');
  document.body.removeChild(el);
  
    
};
function exportCalendar(el){
    //need to put the json text in clipboard can see an example in site copy contact
    //put setimeout to warning the user of the json in clipboard and change back to normal view.
    var calendar=el.parentElement.parentElement.innerText.split("\n")[0];
    if(localStorage[calendar]!=null){
        var calendar_json=localStorage[calendar]
        copyToClipboard(calendar_json)
        el.innerHTML='<li style="'+hyperlinkStyle('#2AB30E')+';font-size:'+SubMenuFontSize()+'">Copy JSON to clip board!</li>'
    }
    else{
        el.innerHTML='<li style="'+hyperlinkStyle('#497964')+';font-size:'+SubMenuFontSize()+'">Never entered in calendar!</li>'
    }
    
    var f=function(ele){
        ele.innerHTML='<li style="'+hyperlinkStyle('#0183D9')+';cursor:pointer;font-size:'+SubMenuFontSize()+'">Export Calendar</li>'
        updatePrevWidthHeight()
    }
    
    setTimeout(function(){f(el)},2000)
    updatePrevWidthHeight()
}


function clickAction(el){
    if(el.getAttribute("was_clicked")=="true"){
        el.setAttribute("was_clicked","false")
        removeSubMenu(el.parentElement)
    }
    else{
        el.setAttribute("was_clicked","true")
        addSubMenu(el.parentElement)
    }
    //update prev_width and height so that main does not createPage() again
    updatePrevWidthHeight()
}

function CreateTableRow(string){
    var row=document.createElement("tr")
    var column=document.createElement("td")
    var column2=document.createElement("td")
    
    row.appendChild(column)
    row.appendChild(column2)
    
    var ul=document.createElement("ul")
    var li=document.createElement("li")
    ul.appendChild(li)
    column.appendChild(ul)
    
    var text=document.createTextNode(string)
    li.appendChild(text)
    li.setAttribute("onmouseover","Highlight(this)")
    li.setAttribute("onmouseout","NotHighLight(this)")
    li.setAttribute("was_clicked","false")
    li.setAttribute("onclick","clickAction(this)")
    li.setAttribute("style","cursor:pointer")
    
    column2.innerHTML="<ul>"+all_calendars[string]+"</ul>"
    
    
    
    return row
    
    
}
String.prototype.replaceAll = function(search, replacement) {
            var target = this;
            return target.replace(new RegExp(search, 'g'), replacement);
        };
        function checkRoomName(){
            var input=document.getElementById("roomName")
            input.value=input.value.replaceAll(" ","-")
        }
function createPC(event,input){
    if (event.keyCode == 13 ) {
        // Do something
        //alert(document.getElementsByTagName("input")[0].value);
        if(input.value!=""){
            input.value=input.value.replaceAll(" ","-")
            all_calendars[input.value]="(0/365)"
            localStorage["PCM"]=JSON.stringify(all_calendars)
            setTimeout(CreatePage,500)
        }
        else{
            input.placeholder="Must not be empty!"
        }
    }
    
}
function createPCBtn(el){
    var input=el.parentElement.children[0]
    
    if(input.value!=""){
        input.value=input.value.replaceAll(" ","-")    
        all_calendars[input.value]="(0/365)"
        localStorage["PCM"]=JSON.stringify(all_calendars)
        setTimeout(CreatePage,500)
    }
    else{
        input.placeholder="Must not be empty!"
    }
}
function undoCreatePC(el){
    el.parentElement.parentElement.parentElement.innerHTML='<ul onclick="openInput(this,\'Insert PC Name\',\'createPC(event,this)\',okBtn(\'createPCBtn(this)\'),crossBtn(\'undoCreatePC(this)\'))"><li style="'+hyperlinkStyle('#0183D9')+'">+ create purpose calendar</li></ul>'
}
function okBtn(onclick_function){
    return '<button onclick="'+onclick_function+'" style="border-radius:50%;background:green;color:white;font-size:'+inputFontSize()+';margin-left:2%;">&#160;&#10004&#160;</button>';
}
function crossBtn(onclick_function){
    return '<button onclick="'+onclick_function+'" style="border-radius:50%;background:red;color:white;margin-left:2%;font-size:'+inputFontSize()+'">&#160;&#10006&#160;</button>'
}
function openInput(el,placeholder,on_key_press_function,okBtn_function,crossBtn_function){
    var prev_html=el.innerHTML
    el.setAttribute("onclick","")
    el.innerHTML='<li><input onkeypress="'+on_key_press_function+'" type="text" placeholder="'+placeholder+'" style="width:70%;height:auto;font-size:'+inputFontSize()+';">'+okBtn_function+crossBtn_function+'</li>'
    
    //update prev_width and height so that main does not createPage() again
    updatePrevWidthHeight()
}

function addNewPurposeCalendarRow(){
    var row=document.createElement("tr")
    var column=document.createElement("td")
    row.appendChild(column)
    column.setAttribute("colspan","2")
    column.innerHTML='<ul onclick="openInput(this,\'Insert PC Name\',\'createPC(event,this)\',okBtn(\'createPCBtn(this)\'),crossBtn(\'undoCreatePC(this)\'))"><li style="'+hyperlinkStyle('#0183D9')+';cursor:pointer">+ create purpose calendar</li></ul>'
    
    return row
    
}
function CreatePage(){
    var title=document.getElementById("title")
    title.style["font-size"]=titleSize()
    
    var table=document.getElementsByTagName("table")[0]
    table.style["font-size"]=tableFontSize()
    
    table.style["padding-left"]=tablePadding()
    
    var tbody=document.getElementsByTagName("tbody")[0]
    tbody.innerHTML="";
    for(var key in all_calendars){
        tbody.appendChild(CreateTableRow(key))    
    }
    //Add create new purpose calendar row
    tbody.appendChild(addNewPurposeCalendarRow())
    
    //create footer
    CreateFooter()
}

function CreateFooter(){
    var footer=document.getElementById("footer")
    
    //change footer div
    footer.style.width=(global_height>global_width)?"100%":"50%"
    
    
    //change block
    footer.children[0].style.height=(global_height>global_width)?"10px":"5px"
    
    //change table
    footer.children[1].style['font-size']=tableFontSize()
    
    /*var innerhtml='<ul style="font-size:'+footerFontSize()+'"><li style="'+hyperlinkStyle('#0183D9')+'">Export PCM</li></ul>'
    innerhtml+='<ul style="font-size:'+footerFontSize()+'"><li style="'+hyperlinkStyle('#0183D9')+'text-align:center;">Import PCM</li></ul>'
    footer.innerHTML=innerhtml*/
}




function DetectinputBox(){
    if(document.getElementsByTagName("input").length!=0){
        return true
    }
    else{
        return false
    }
}

//------Main------------
var update_prev_width_height=false;
window.onload=function(){
    CreatePage()
    
    html=document.getElementsByTagName("html")[0];
    global_width=html.offsetWidth;
    global_height=html.offsetHeight;
    prev_width=global_width;
    prev_height=global_height;
    requestAnimationFrame(Main)
}


function Main(){
    var html=document.getElementsByTagName("html")[0];
    
    global_width=html.offsetWidth;
    global_height=html.offsetHeight;
    //just update prev with/heigth after page resize
    if(update_prev_width_height){
        prev_height=global_height
        prev_width=global_width 
        update_prev_width_height=false
    }
    
    
    //console.log("with: "+global_width)
    //console.log("height: "+global_height)
    if((prev_width!=global_width || prev_height!=global_height)&& !DetectinputBox()){
        console.log("change")
        CreatePage()
        update_prev_width_height=true
        
        
        
    }
    requestAnimationFrame(Main)
}

