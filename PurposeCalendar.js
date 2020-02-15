var html=document.getElementById("html");
var global_width=html.offsetWidth;
var global_height=html.offsetHeight;
var prev_width=global_width;
var prev_height=global_height;
var body=document.getElementById("body");
//var purpose=document.title;
//purpose="Ola"



  function getLastDayOfEachMonth(){
    var out={}
    var date=new Date()
    var year=date.getFullYear()
    for(i=1;i<13;i++){
        var month_date=new Date(year,i,0)
        var last_day=month_date.getDate()
        out[i]=last_day

    }
    return out
}

  

var months=["Jan","Fev","Mar","Apr","May","Jun","Jul","Ago","Set","Out","Nov","Dez"]
//var days={1:31,2:28,3:31,4:30,5:31,6:30,7:31,8:30,9:31,10:31,11:30,12:31}
var days=getLastDayOfEachMonth()
var lines=31
var columns=12


class LocalStorageManager{
    
    constructor(){
        this.calendar_purpose=this.getTitle()
        this.JsonData=this.getData()
        localStorage[this.calendar_purpose]=JSON.stringify(this.JsonData)
    }
    
    getTitle(){
        if(window.location.search!=""){
            var p=window.location.search;
            p=p.substr(1,p.length)
            document.title=p
            return p
        }
        else{
            return document.title;
        }
        
    }
    
    createDays(month){
        var d={}
        for(var i=1;i<=days[month];i++){
            d[i]=false
        }
        
        return d
    }
    
    createData(){
        var out=[]
        
        for(var i=0;i<months.length;i++)
        {
            var month={
                "month_number":i+1,
                "month_name":months[i],
                "days":this.createDays(i+1)
            }
            out.push(month)
        }
        
        
        return out
    }
    
    getData(){
        //if data already exists
        if(localStorage[this.calendar_purpose]!=null){
            return JSON.parse(localStorage[this.calendar_purpose])
        }
        else{
            //localStorage[this.calendar_purpose]=this.createData()
            return this.createData()
        }
    }
    
    setDay(month,day,val){
        this.JsonData[month-1].days[day]=val
        localStorage[this.calendar_purpose]=JSON.stringify(this.JsonData)
    }
    
    getDay(month,day){
        return this.JsonData[month-1].days[day]
    }
    
}








function columnWidth(){
    return global_width*((global_height>global_width)?0.5:0.1)
}
function headerHeight(){
    return global_height*0.1
}

function columnHeight(){
    return global_height*((global_height>global_width)?0.25:0.35)
}

function setStyle(element,atributes){
    var properties=""
    for(key in atributes){
        properties+=key+":"+atributes[key]+";"
    }
    element.setAttribute("style",properties)        
}

function CreateDiv(left,top,width,height,color,position){
    var div=document.createElement("div");
    var body=document.getElementById("body");
    var atributes={"top":top,
                   "left":left,
                   "width":width,
                   "height":height,
                   //"background":color,
                   "position":position
                  }
    setStyle(div,atributes)
    
    return div
    //body.appendChild(hex)
}

function btnChangeColor(btn){
    if(btn.getAttribute("isActive")=="true"){
        btn.style.background="hsl(0,100%,100%)"
    }
    else{
        var color=btn.style.border.split(" ")[2]+btn.style.border.split(" ")[3]+btn.style.border.split(" ")[4]
        btn.style.background=color
    }
}

function btnClick(btn){
    
    var d,m;
    d=btn.getAttribute("id").split("/")[0]
    m=btn.getAttribute("id").split("/")[1]
    
    if(btn.getAttribute("isActive")=="false"){
        btn.style.background="hsl(0,100%,100%)"
        btn.setAttribute("isActive","true")
        lsm.setDay(m,d,true)
        
    }else{
        var color=btn.style.border.split(" ")[2]+btn.style.border.split(" ")[3]+btn.style.border.split(" ")[4]
        btn.style.background=color
        btn.setAttribute("isActive","false")
        lsm.setDay(m,d,false)
    }
}



function CreateButton(_text,_color,_month){
    
    var btn=document.createElement("div");
    //btn.setAttribute("valign","center")
    var width_height=80;
    var middle=(100-width_height)/2;
    
    setStyle(btn,{"position":"inherit","background":"hsla("+_color+",100%,60%,1)","border-radius":"50%","width":width_height+"%","height":width_height+"%","top":middle+"%","left":middle+"%","border":"5px solid hsla("+_color+",100%,60%,1)","cursor":"pointer"})
    
    var text=document.createElement("p")
    
    text.appendChild(document.createTextNode(_text))
    
    
    btn.appendChild(text)
    if(global_height>global_width){
        setStyle(text,{"text-align":"center","position":"relative","font-size":"12vw","top":"0%"})
    }
    else{
        setStyle(text,{"text-align":"center","position":"relative","font-size":"2.5vw","top":"0%"})
    }
    
    
    
    btn.setAttribute("id",_text+"/"+(_month+1));
    btn.setAttribute("isActive",lsm.getDay(_month+1,_text))
    btn.setAttribute("onclick","btnClick(this)")
    btnChangeColor(btn)
    //btn.addEventListener("click",btnClick(btn))
    
    return btn
}

function CreateHeader(){
    var body=document.getElementById("body");
    body.innerHTML="";
    var header=CreateDiv(0,0,global_width,headerHeight(),"rgb(255,255,255)","absolute")
    for(var j=0;j<columns;j++){
        
        var headerblock=CreateDiv(j*columnWidth(),0,columnWidth(),headerHeight(),"rgb(255,255,255)","absolute")
        var h1=document.createElement("h1")
        h1.appendChild(document.createTextNode(months[j]))
        headerblock.appendChild(h1)
        if(global_height>global_width){
                h1.setAttribute("style","font-size:15vw;margin-top:0px;")
        }
        else{
                h1.setAttribute("style","font-size:4vw;margin-top:0px;")
        }

        headerblock.setAttribute("align","center")
        header.appendChild(headerblock)
        
    }
    
    body.appendChild(header)
}


function CreateColumns(lines, columns){
    var body=document.getElementById("body");
    
    var table=CreateDiv(0,headerHeight(),global_width,global_height,"rgb(255,255,255)","absolute")
    
    var width_factor=columnWidth()
    var height_factor=columnWidth()
    
    
    var lines_elements=[];
    for(var i=0;i<lines;i++){
        
        for(var j=0;j<columns;j++){
            var column=CreateDiv(j*width_factor,i*height_factor,width_factor,height_factor,"rgba("+Math.random()*255+","+Math.random()*255+","+Math.random()*255+","+Math.random()+")","absolute")
            
            column.setAttribute("align","center")
            
            if(i<days[j+1]){
                var btn=CreateButton(i+1,j*20,j)
                column.appendChild(btn)
            }
            
            //line.appendChild(column)
            table.appendChild(column)
        }
    }
    
    body.appendChild(table)
}

function highLightDay(index){
    var date=new Date()
    var d=date.getDate()
    var m=date.getMonth()+1
    
    var id=d+"/"+m
    var btn=document.getElementById(id)
    
    if(btn.getAttribute("isActive")=="false"){
        animation(btn,index)
    }
   
    
}

function animation(btn,index){
    btn.style.background="hsla("+index%360+",100%,60%,1)"
    var color=btn.style.border.split(" ")[2]+btn.style.border.split(" ")[3]+btn.style.border.split(" ")[4]
    //btn.style.border=(index%10).toString()+"px "+"solid "+"hsl("+color+",100%,60%)"; 
    //var w=parseInt(btn.style.width.substr(0,btn.style.width.length-1))  
    //btn.style.width=(w+(index%10))+"%";
}


window.onload=function(){
    //alert("hello");
    
    
    
    
    global_width=html.offsetWidth;
    global_height=html.offsetHeight;
    prev_width=global_width;
    prev_height=global_height;
    
    CreateHeader()    
    CreateColumns(lines,columns)
    
    //setStyle(body,{"width":global_width,"height":global_height,"top":"0px","left":"0px","position":"absolute"})
    var date=new Date()
    var d=date.getDate()
    var m=date.getMonth()+1
    
    var id=d+"/"+m
     //go to actual button in page
    window.location.href="#"+id
    requestAnimationFrame(Main);
}

//Main-------------------


var lsm=new LocalStorageManager();
var index=0;

function Main(){
    var html=document.getElementById("body");
    global_width=html.offsetWidth;
    global_height=html.offsetHeight;
    //console.log("with: "+global_width)
    //console.log("height: "+global_height)
    if(prev_width!=global_width || prev_height!=global_height){
        console.log("change")
        prev_height=global_height
        prev_width=global_width
        
        CreateHeader()
        CreateColumns(lines,columns)
        
        //var body=document.getElementById("html");
        //setStyle(body,{"width":global_width,"height":global_height,"top":"0px","left":"0px","position":"absolute"})
    }
    
    //Highlight actual day
    
    highLightDay(index)
    index=(index+10)%1000;
    
    //setTimeout(Main,100);
    requestAnimationFrame(Main)
}
