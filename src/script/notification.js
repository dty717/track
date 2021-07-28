
//curl -s   --form-string "token=aa1fn1dy4uhxs5bc5ez5y8o2cseqk3"   --form-string "user=ud4eitjy6yqtoc9dmgabnkfhig4op8"   --form-string "message=hello world"   https://api.pushover.net/1/messages.json

var token="aa1fn1dy4uhxs5bc5ez5y8o2cseqk3";
var user="ud4eitjy6yqtoc9dmgabnkfhig4op8"
var url="https://api.pushover.net/1/messages.json"
        function __getTime(time){
            var s=time+"";
            if(time!=undefined&&(s.trim()!="")){
                time=parseFloat(s+"");
                if(time==NaN){
                    time=20000;
                }else{
                    time*=1000;
                }
                if(s.endsWith('m')){
                    time*=60;
                }else if(s.endsWith('h')){
                    time*=3600;
                }
            }else{
                time=20000;
            }
            return parseInt(time);
        }
        var Human=function(name){
            this.people=[];
            this.thinkings=[];
            this.originThinkings=[];
            this.addNextThinkingTimes=0;
            this.showLinksTimes=0;
            this.returnBeforeThinkingTimes=0;
            this.currentThinkingIndex=0;
            this.talkTopicLimit=40;
            this.talkList=[];
        }
        Human.prototype.newBaby=function(id,sex){
            this.people.push({id:id,sex:sex});
        }
        Human.prototype.somebodyDead=function(id){
            this.people = this.people.filter(function( obj ) {
                return obj.id !== id;
            });
        }
        
        Human.prototype.talkAbout=function(word){
            var similarMost=0;
            var similarWordIndex=-1;
            var list=[];
            for (var i = this.thinkings.length; i--; ) {
                if(this.talkList.indexOf(i)!=-1){
                    continue;
                }
                var similar=this.similarText(word,this.thinkings[i].thing);
                if(similar>similarMost){
                    similarMost=similar;
                    similarWordIndex=i;
                }
            }
            if(similarWordIndex!=-1){
                this.talkList.push(similarWordIndex);
                if(this.talkList.length>this.talkTopicLimit){
                    this.talkList.shift();
                }
                return this.thinkings[similarWordIndex].thing;    
            }else{
                return "";
            }
        }
        
        Human.prototype.similarText=function(first, second){
            // Calculates the similarity between two strings  
            // discuss at: http://phpjs.org/functions/similarText
            if (first === null || second === null || typeof first === 'undefined' || typeof second === 'undefined') {
                return 0;
            }
        
            first += '';
            second += '';
        
            var pos1 = 0,
                pos2 = 0,
                max = 0,
                firstLength = first.length,
                secondLength = second.length,
                p, q, l, sum;
        
            max = 0;
        
            for (p = 0; p < firstLength; p++) {
                for (q = 0; q < secondLength; q++) {
                    for (l = 0;
                    (p + l < firstLength) && (q + l < secondLength) && (first.charAt(p + l) === second.charAt(q + l)); l++);
                    if (l > max) {
                        max = l;
                        pos1 = p;
                        pos2 = q;
                    }
                }
            }
        
            sum = max;
        
            if (sum) {
                if (pos1 && pos2) {
                    sum += this.similarText(first.substr(0, pos2), second.substr(0, pos2));
                }
        
                if ((pos1 + max < firstLength) && (pos2 + max < secondLength)) {
                    sum += this.similarText(first.substr(pos1 + max, firstLength - pos1 - max), second.substr(pos2 + max, secondLength - pos2 - max));
                }
            }
        
            return sum;
        }
        
        
        Human.prototype.loadHistoryContent=function(){
            var _this=this;
            $.ajax({
                url: '/C:/Users/18751/Desktop/新建工程/关于网站设计开发-2/代码/script/ai/human.txt',
                method: "GET",
                async: false,
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                cache: false,
                success: function (response) {
                    response=retrocycle(response)
                    for(var c in response){
                        _this[c]=response[c]
                    }
                }
            });
        }
        Human.prototype.loadHistoryContentStr=function(str){
            var obj = retrocycle(str)
            for (var c in obj) {
                this[c] = obj[c]
            }
        }
        Human.prototype.getEfficiency=function(){
            if((this.showLinksTimes==1)&&
                (this.addNextThinkingTimes==0)&&(this.returnBeforeThinkingTimes==0)){
                return "80%";
            }else if(this.showLinksTimes+this.returnBeforeThinkingTimes+this.addNextThinkingTimes>20){
                return "100%"
            }else if(this.showLinksTimes+this.returnBeforeThinkingTimes+this.addNextThinkingTimes>5){
                return "90%"
            }else if((this.addNextThinkingTimes==0)&&(this.showLinksTimes+this.returnBeforeThinkingTimes
                <5)&&(this.showLinksTimes+this.returnBeforeThinkingTimes>2)){
                return "45%";
            }else if((this.addNextThinkingTimes==0)&&(this.showLinksTimes+this.returnBeforeThinkingTimes>=5)){
                return "65%";
            }else if((this.addNextThinkingTimes==1)&&(this.showLinksTimes+this.returnBeforeThinkingTimes>=2)){
                return "70%";
            }
            var efficiency=parseFloat(this.calculateEfficiencyList[this.calculateEfficiencyList.length-1].efficiency)/2;
            if(efficiency<20){
                var formData=new FormData();
                formData.append("token",token);
                formData.append("user",user);
                formData.append("html",1);
                formData.append("message","你已经处于低效率"+efficiency+"中,请立刻休息5分钟,"
                    +"addNextThinkingTimes:"+this.addNextThinkingTimes+
                    "showLinksTimes:"+this.showLinksTimes+
                    "returnBeforeThinkingTimes:"+this.returnBeforeThinkingTimes);
                new Promise((resolve, reject) => {
                    $.ajax({
                        url: url,
                        data: formData,
                        cache: false,
                        contentType: false,
                        processData: false,
                        method: 'POST',
                        type: 'POST', // For jQuery < 1.9
                        success: function (response) {
                            resolve(response);
                        }
                    });
                })
            }
            return efficiency+"%"
        }
        
        Human.prototype.showEfficiency=function(){
            this.calculateEfficiencyList.forEach((e)=>{console.log(e.efficiency)})
        }

        Human.prototype.calculateEfficiency=function(){
            var _this=this;
            if(!this.calculateEfficiencyList){
               this.calculateEfficiencyList=[]; 
            }            
            this.calculateEfficiencyTimer=setInterval(function(){
                var efficiency=_this.getEfficiency();
                console.log({
                    "addNextThinkingTimes":_this.addNextThinkingTimes,
                    "showLinksTimes":_this.showLinksTimes,
                    "returnBeforeThinkingTimes":_this.returnBeforeThinkingTimes,
                    "time":new Date(),
                    "efficiency":efficiency
                });
                _this.calculateEfficiencyList.push({
                    "addNextThinkingTimes":_this.addNextThinkingTimes,
                    "showLinksTimes":_this.showLinksTimes,
                    "returnBeforeThinkingTimes":_this.returnBeforeThinkingTimes,
                    "time":new Date(),
                    "efficiency":efficiency
                });
                _this.addNextThinkingTimes=0
                _this.showLinksTimes=0;
                _this.returnBeforeThinkingTimes=0;
            },20*60*1000)
            
        }
        //human.saveContent()
        Human.prototype.saveContent=function(str){
            if(str!=undefined){
                if(str!="true"){
                    return;
                }
            }
            // var targetPath="C:/Users/18751/Desktop/apache-tomcat-9.0.0.M22 - 副本/webapps/ROOT/"
            if(!this.thinkings.length){
                return;
            }
            
            var formData=new FormData();
            formData.append("file",JSON.stringify(decycle(this)));
            formData.append("path","C:/Users/18751/Desktop/新建工程/关于网站设计开发-2/代码/script/ai/human.txt");
            $.ajax({
                url: '/saveFile',
                data: formData,
                cache: false,
                contentType: false,
                processData: false,
                method: 'POST',
                type: 'POST', // For jQuery < 1.9
                success: function (response) {
                },
                error:function(error){
                    console.log("error")
                    m=error;
                    set("e",error);
                }
            })
        }

        
        // var human=new Human();
        
        
        Human.prototype.addThinking=function(thing){
            var think={thing:thing,time:new Date()};
            this.originThinkings.push(think)
            this.thinkings.push(think);
            this.beforeThinkingIndex=this.currentThinkingIndex;
            this.currentThinkingIndex=this.thinkings.length-1;
            this.thinkingTimes=0;
        }

        Human.prototype.returnBeforeThinking=function(){
            this.returnBeforeThinkingTimes++;
            var index=this.beforeThinkingIndex;
            this.beforeThinkingIndex=this.currentThinkingIndex;
            this.currentThinkingIndex=index;
            this.findThinkOrigin().thinkingTimes++;
            return this.thinkings[index];
        }
        Human.prototype.searchThinkingWithoutChildren=function(){
            var listChildren = [];
            for (var i = this.thinkings.length; i--; ) {
                if(!this.thinkings[i].children){
                    listChildren.push(this.thinkings[i].thing);
                    console.log(this.thinkings[i].thing+'\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t'+i);
                }
            }
            return listChildren;
        }
        Human.prototype.like=function(str){
            if(str instanceof RegExp){
                for (var i = this.thinkings.length; i--; ) {
                    if(this.thinkings[i].thing.match(str)){
                        console.log(this.thinkings[i].thing+'\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t'+i);
                    }
                }
            }else{
                for (var i = this.thinkings.length; i--; ) {
                    if(this.thinkings[i].thing.indexOf(str)!=-1||
                        (this.thinkings[i].thing.indexOf(str.toLowerCase())!=-1)||
                        (this.thinkings[i].thing.indexOf(str.toUpperCase())!=-1)){
                        console.log(this.thinkings[i].thing+'\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t'+i);
                    }
                }
                
            }
        }
        
        Human.prototype.pauseThinking=function(index){
            if(!index){
                index=this.currentThinkingIndex;
            }
            var internalId=this.thinkings[index].internalId;
            var think=this.thinkings[index];
            if(think.isInterval){
                clearInterval(internalId);
                delete think.isInterval;
            }else{
                clearTimeout(internalId);
            }
            delete think.internalId;
        }
        Human.prototype.repeatThinking=function(time,isInterval,index,isSendMesage){
            if(!index){
                index=this.currentThinkingIndex;
            }else{
                /*this.beforeThinkingIndex=this.currentThinkingIndex;
                this.currentThinkingIndex=index;*/
            }
            this.findThinkOrigin(index).thinkingTimes++;

            var think=this.thinkings[index];
            if(!time){
                time='5m'
            }
            var thinkIndex=this.thinkings.indexOf(think);
            if(isInterval){
                think.internalId=setInterval(function(){
                    console.log(think.thing+'\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t'+thinkIndex)
                    if(isSendMesage){
                        var formData=new FormData();
                        formData.append("token",token);
                        formData.append("user",user);
                        formData.append("html",1);
                        formData.append("message",think.thing+'\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t'+thinkIndex);
                        new Promise((resolve, reject) => {
                            $.ajax({
                                url: url,
                                data: formData,
                                cache: false,
                                contentType: false,
                                processData: false,
                                method: 'POST',
                                type: 'POST', // For jQuery < 1.9
                                success: function (response) {
                                    resolve(response);
                                }
                            });
                        })
                    }
                    
                },__getTime(time));
                think.isInterval=true;
            }else{
                think.internalId=setTimeout(function(){
                    delete think.internalId;
                    console.log(think.thing+'\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t'+thinkIndex)
                    if(isSendMesage){
                        var formData=new FormData();
                        formData.append("token",token);
                        formData.append("user",user);
                        formData.append("html",1);
                        formData.append("message",think.thing+'\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t'+thinkIndex);
                        new Promise((resolve, reject) => {
                            $.ajax({
                                url: url,
                                data: formData,
                                cache: false,
                                contentType: false,
                                processData: false,
                                method: 'POST',
                                type: 'POST', // For jQuery < 1.9
                                success: function (response) {
                                    resolve(response);
                                }
                            });
                        })
                    }
                    
                },__getTime(time))
            }
            
        }
        Human.prototype.addNextThinking=function(thing,time,isInterval,index){
            this.addNextThinkingTimes++;
            if(!index){
                index=this.currentThinkingIndex;
            }else{
                this.beforeThinkingIndex=this.currentThinkingIndex;
                this.currentThinkingIndex=index;
            }
            
            var think={thing:thing,time:new Date()};
            think.parent=this.thinkings[index];
            if(this.thinkings[index].children){
                this.thinkings[index].children.push(think);    
            }else{
                this.thinkings[index].children=[think];    
            }
            this.thinkings.push(think);
            this.currentThinkingIndex=this.thinkings.length-1;
            this.findThinkOrigin().thinkingTimes++;

            if(time){
                var thinkIndex=this.currentThinkingIndex;
                if(isInterval){
                    think.internalId=setInterval(function(){
                        console.log(think.thing+'\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t'+thinkIndex)
                    },__getTime(time));
                    think.isInterval=true;
                }else{
                    think.internalId=setTimeout(function(){
                        delete think.internalId;
                        console.log(think.thing+'\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t'+thinkIndex)
                    },__getTime(time))
                }
            }
        }
        
        Human.prototype.findThinkOrigin=function(index){
            if(!index){
                index=this.currentThinkingIndex;
            }
            var think=this.thinkings[index];
            while(think){
                if(think.parent){
                    think=think.parent;
                }else{
                    return think;
                }
            }
        }
        
        
        // Human.
        
        Human.prototype.showLinks=function(index){
            this.showLinksTimes++;
            if(this.showLinksTimes>3){
                var efficiency=this.getEfficiency();
                if(parseFloat(efficiency)>80&&false){
                    var formData=new FormData();
                    formData.append("token",token);
                    formData.append("user",user);
                    formData.append("html",1);
                    if(parseFloat(efficiency)==100){
                        formData.append("message","你已经处于完美效率"+efficiency+"中,令人惊讶");
                    }else{
                        formData.append("message","你已经处于高效率"+efficiency+"中,再接再厉");
                    }
                    new Promise((resolve, reject) => {
                        $.ajax({
                            url: url,
                            data: formData,
                            cache: false,
                            contentType: false,
                            processData: false,
                            method: 'POST',
                            type: 'POST', // For jQuery < 1.9
                            success: function (response) {
                                resolve(response);
                            }
                        });
                    })
            
                }
            }
            if(!index){
                index=this.currentThinkingIndex;
            }else{
                // this.beforeThinkingIndex=this.currentThinkingIndex;
                // this.currentThinkingIndex=index;
            }
            var think=this.thinkings[index];
            var listThinkings=[];
            while(think){
                listThinkings.push(think);
                if(think.parent){
                    think=think.parent;
                }else{
                    // listThinkings.push(think);
                    break;
                }
            }
            for (var i = listThinkings.length; i--; ) {
                console.log(listThinkings[i].thing+'\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t'+this.thinkings.indexOf(listThinkings[i]));
            }
        }

        Human.prototype.findThinkChildren=function(think,needShow){
            // var think=this.thinkings[index];
            if((typeof think=="number")||(think instanceof Number)){
                think=this.thinkings[think];
            }else{
                if(think==undefined){
                    think=this.thinkings[this.currentThinkingIndex];
                }else{
                    if(!isNaN(parseInt(think))){
                        think=this.thinkings[parseInt(think)];
                    }    
                }
            }
            //console.log(think.thing);
            if(think.children){
                for(var child of think.children){
                    this.findThinkChildren(child,needShow);
                }
            }else{
                if(needShow){
                    this.showLinks(this.thinkings.indexOf(think))
                }else{
                    console.log(this.thinkings.indexOf(think),think);
                }
            }
        }
        Human.prototype.findThinkChildrenByOrigin=function(index){
            var think=this.originThinkings[index];
            if(think.children){
                for(var child of think.children){
                    this.findThinkChildren(child);
                }
            }else{
                console.log(this.thinkings.indexOf(think),think);
            }
        }
        

        function add_prototype(){
            var str="human";
            var _str=str[0].toUpperCase()+str.substring(1);
            var tem=editor.getSelectedText().trim();
            var match=tem.match(/.+\.prototype\.([\s\S]+)/);
            if(match){
                str+="."+match[1];
                _str+=".prototype."+match[1];
                
            }else if(tem[0]=='.'){
                str+=tem;
                _str+=".prototype"+match[1];
            }else{
                str+="."+tem;
                _str+=".prototype."+tem;
            }
            eval(str);
            eval(_str);
        }
        
        
        Human.prototype.findInterval=function(){
            for (var i = 0; i < this.thinkings.length; i++) {
                if(this.thinkings[i].isInterval){
                    console.log(i,this.thinkings[i]);
                }
            }
        }

        Human.prototype.thinking=function(index){
            if(index==undefined){
                index=this.currentThinkingIndex;
            }else{
                this.beforeThinkingIndex=this.currentThinkingIndex;
                this.currentThinkingIndex=parseInt(index);
            }
            this.findThinkOrigin().thinkingTimes++;

            var thinking=this.thinkings[index];
            if(!thinking.thinkingTimes){
                thinking.thinkingTimes=1; 
            }else{
                thinking.thinkingTimes++;
            }
            this.showLinks();
            return thinking;
        }
        
        Human.prototype.delete = function(index) {
            if (index == undefined) {
                index = this.currentThinkingIndex;
            }
            var thinking = this.thinkings[index];
            thinking.parent.children = thinking.parent.children.filter(function(obj) {
                return obj != thinking;
            }).concat(thinking.children ? thinking.children : []);
            if (thinking.parent.children.length == 0) {
                delete thinking.parent.children;
            }
            if (thinking.children) {
                thinking.children.forEach(function(e) {
                    e.parent = thinking.parent;
                })
            }
            this.thinkings = this.thinkings.filter(function(obj) {
                return obj != thinking;
            })
            if (index <= this.beforeThinkingIndex) {
                this.beforeThinkingIndex--;
            }
            if (index <= this.currentThinkingIndex) {
                this.currentThinkingIndex--;
            }
            return thinking;
        }        



        /*human.addNextThing=function(){
            if(human.beforeCall){
                human.beforeCall("addNextThing");
            }
            this.addNextThing();
        }
        human.saveContent()*/
        



/*
    cycle.js
    2018-05-15

    Public Domain.

    NO WARRANTY EXPRESSED OR IMPLIED. USE AT YOUR OWN RISK.

    This code should be minified before deployment.
    See http://javascript.crockford.com/jsmin.html

    USE YOUR OWN COPY. IT IS EXTREMELY UNWISE TO LOAD CODE FROM SERVERS YOU DO
    NOT CONTROL.
*/

// The file uses the WeakMap feature of ES6.

/*jslint eval */

/*property
    $ref, decycle, forEach, get, indexOf, isArray, keys, length, push,
    retrocycle, set, stringify, test
*/

 function decycle(object, replacer) {
        "use strict";

// Make a deep copy of an object or array, assuring that there is at most
// one instance of each object or array in the resulting structure. The
// duplicate references (which might be forming cycles) are replaced with
// an object of the form

//      {"$ref": PATH}

// where the PATH is a JSONPath string that locates the first occurance.

// So,

//      var a = [];
//      a[0] = a;
//      return JSON.stringify(decycle(a));

// produces the string '[{"$ref":"$"}]'.

// If a replacer function is provided, then it will be called for each value.
// A replacer function receives a value and returns a replacement value.

// JSONPath is used to locate the unique object. $ indicates the top level of
// the object or array. [NUMBER] or [STRING] indicates a child element or
// property.

        var objects = new WeakMap();     // object to path mappings

        return (function derez(value, path) {

// The derez function recurses through the object, producing the deep copy.

            var old_path;   // The path of an earlier occurance of value
            var nu;         // The new object or array

// If a replacer function was provided, then call it to get a replacement value.

            if (replacer !== undefined) {
                value = replacer(value);
            }

// typeof null === "object", so go on if this value is really an object but not
// one of the weird builtin objects.

            if (
                typeof value === "object"
                && value !== null
                && !(value instanceof Boolean)
                && !(value instanceof Date)
                && !(value instanceof Number)
                && !(value instanceof RegExp)
                && !(value instanceof String)
            ) {

// If the value is an object or array, look to see if we have already
// encountered it. If so, return a {"$ref":PATH} object. This uses an
// ES6 WeakMap.

                old_path = objects.get(value);
                if (old_path !== undefined) {
                    return {$ref: old_path};
                }

// Otherwise, accumulate the unique value and its path.

                objects.set(value, path);

// If it is an array, replicate the array.

                if (Array.isArray(value)) {
                    nu = [];
                    value.forEach(function (element, i) {
                        nu[i] = derez(element, path + "[" + i + "]");
                    });
                } else {

// If it is an object, replicate the object.

                    nu = {};
                    Object.keys(value).forEach(function (name) {
                        nu[name] = derez(
                            value[name],
                            path + "[" + JSON.stringify(name) + "]"
                        );
                    });
                }
                return nu;
            }
            return value;
        }(object, "$"));
    };



function retrocycle($) {
        "use strict";

// Restore an object that was reduced by decycle. Members whose values are
// objects of the form
//      {$ref: PATH}
// are replaced with references to the value found by the PATH. This will
// restore cycles. The object will be mutated.

// The eval function is used to locate the values described by a PATH. The
// root object is kept in a $ variable. A regular expression is used to
// assure that the PATH is extremely well formed. The regexp contains nested
// * quantifiers. That has been known to have extremely bad performance
// problems on some browsers for very long strings. A PATH is expected to be
// reasonably short. A PATH is allowed to belong to a very restricted subset of
// Goessner's JSONPath.

// So,
//      var s = '[{"$ref":"$"}]';
//      return retrocycle(JSON.parse(s));
// produces an array containing a single element which is the array itself.

        var px = /^\$(?:\[(?:\d+|"(?:[^\\"\u0000-\u001f]|\\(?:[\\"\/bfnrt]|u[0-9a-zA-Z]{4}))*")\])*$/;

        (function rez(value) {

// The rez function walks recursively through the object looking for $ref
// properties. When it finds one that has a value that is a path, then it
// replaces the $ref object with a reference to the value that is found by
// the path.

            if (value && typeof value === "object") {
                if (Array.isArray(value)) {
                    value.forEach(function (element, i) {
                        if (typeof element === "object" && element !== null) {
                            var path = element.$ref;
                            if (typeof path === "string" && px.test(path)) {
                                value[i] = eval(path);
                            } else {
                                rez(element);
                            }
                        }
                    });
                } else {
                    Object.keys(value).forEach(function (name) {
                        var item = value[name];
                        if (typeof item === "object" && item !== null) {
                            var path = item.$ref;
                            if (typeof path === "string" && px.test(path)) {
                                value[name] = eval(path);
                            } else {
                                rez(item);
                            }
                        }
                    });
                }
            }
        }($));
        return $;
    };


/**/
var group清洗 = {
    name: "清洗",
    "B组": 10,
    arrange: ["B组"],
    currentIndex: 0,
    currentArrangeIndex: 0,
    isFinished: false
};
var group配液 = {
    name: "配液",
    "A组_V1_V3$1号": 22,
    "A组_V1_V3$1号_2": 22,
    arrange: ["A组_V1_V3$1号", "A组_V1_V3$1号_2"],
    currentIndex: 0,
    currentArrangeIndex: 0,
    isFinished: false
};
var group滴定 = {
    name: "滴定",
    "B组_V1_V3$1号_V3$2号": 3,
    "running": 8,
    "P4V6": 5,
    "B组_V1_V3$1号_V3$2号_2": 3,
    "running_2": 8,
    "P4V6_2": 5,
    arrange: ["B组_V1_V3$1号_V3$2号", "running", "P4V6", "B组_V1_V3$1号_V3$2号_2", "running_2", "P4V6_2"],
    currentIndex: 0,
    currentArrangeIndex: 0,
    isFinished: false
};
// showPossibility([], [group滴定, group配液])

function showPossibility(list, groups,times) {
    if(!times){
        times=1000;
    }
    var minTime = 10000
    var links = [];
    nextPossibility(0, links, groups)

    function nextPossibility(time, links, groups) {
        if (times-- < 0) {
            console.log('time out')
            return;
        }
        var isFinished = true;
        for (var i = 0; i < groups.length; i++) {
            if (!groups[i].isFinished) {
                isFinished = false;
                break;
            }
        }
        if (isFinished) {
            if (minTime > time) {
                minTime = time;
            }
            list.push({
                time: time,
                link: links
            });
            console.log(time, links);
            return;
        }
        var possibility = {};
        var groupList = [];
        var groupTwoList = [];
        var possibilitySum = 1;
        for (var i = 0; i < groups.length; i++) {
            var group = groups[i];
            if (!group.isFinished) {
                if (group.currentIndex == 0) {
                    possibility[i] = [group.arrange[group.currentArrangeIndex], "wait"];
                    possibilitySum *= 2;
                    groupTwoList.push(i);
                } else {
                    possibility[i] = [group.arrange[group.currentArrangeIndex]];
                }
                groupList.push(i);
            }
        }
        var lenGroupTwoList = groupTwoList.length;
        for (var i = 0; i < possibilitySum; i++) {
            var situation = [];
            var index = 0;
            var str = i.toString(2).split("").reverse();
            for (var j = 0; j < groupList.length; j++) {
                if (groupTwoList[index] == groupList[j]) {
                    if (str[index] == 1) {
                        situation.push(possibility[groupList[j]][1]);
                    } else {
                        situation.push(possibility[groupList[j]][0]);
                    }
                    index++;
                } else {
                    situation.push(possibility[groupList[j]][0]);
                }
            }
            // all wait
            var allWaitFlag = true;
            var setCondition = new Set();
            var sameConflict = false;
            for (var j = 0; j < situation.length; j++) {
                if (sameConflict) {
                    break;
                }
                if (situation[j] != "wait") {
                    allWaitFlag = false;
                    situation[j].split("_").forEach(function(e) {
                        if (setCondition.has(e)) {
                            sameConflict = true;
                        } else {
                            setCondition.add(e);
                        }
                    })
                } else {
                    continue;
                }
            }
            if ((!sameConflict) && (!allWaitFlag)) {
                var newGroups = JSON.parse(JSON.stringify(groups));
                var _links = JSON.parse(JSON.stringify(links));
                var obj = {};
                for (var j = 0; j < situation.length; j++) {
                    if (situation[j] != 'wait') {
                        var group = newGroups[groupList[j]]
                        if (++group.currentIndex >= group[group.arrange[group.currentArrangeIndex]]) {
                            group.currentArrangeIndex++;
                            group.currentIndex = 0;
                            if (group.currentArrangeIndex >= group.arrange.length) {
                                group.isFinished = true;
                            }
                        }
                        obj[group.name] = situation[j];
                    }
                }
                _links.push(obj);
                nextPossibility(time + 1, _links, newGroups);
            }
        }
    }
    return list;
}

        
        
        
        var Notification=function(name){
            this.things=[];
            this.lastThings=[];
            this.lastThing={thing:"test",time:2000};
            this.currentThing={thing:"test",time:2000,timeId:0,startTime:new Date()};
            this.localThings=[
                {thing:"带好眼镜,门禁卡,钥匙,带水",date:hourMin(7,19)},
                ];
            this.localThingsIndex=0;
            this.intervalThingId=this.checkIntervalThing();
            this.newThingsTimes=0;
            this.addThingsTimes=0;
            this.addNextThingsTimes=0;
            this.isWaiting=false;
            this.isNewThing=false;
            getLocalIP();
            this.loadHistoryContent();
        }
        function hourMin(hour,min){
            var date = new Date();
            date.setHours(hour,min, 0);   // Set hours, minutes and seconds
            return date;
        }
        
        Notification.prototype.checkIntervalThing=function(){
            var _this=this;
            return setInterval(function() {
                if(_this.localThingsIndex<_this.localThings.length){
                    if(new Date()>_this.localThings[_this.localThingsIndex].date){
                        if(new Date()<_this.localThings[_this.localThingsIndex].date+930000){
                            _this.ajax(_this.localThings[_this.localThingsIndex].thing)
                        }
                        _this.localThingsIndex++;
                    }
                }
            }, 60000);
        }
        
        Notification.prototype.stop=function(thing,time){
            this.things=[];
            clearTimeout(this.currentThing.timeId);
            clearInterval(this.intervalThingId);
        }
        
        
        Notification.prototype.addThing=function(thing,time){
            this.things.push({thing:thing,time:time});
            this.addThingsTimes++;
            if(this.things.length==1){
                clearTimeout(this.currentThing.timeId);
                getLocalIP();
                this.ajax(thing,time);
            }
        }
        Notification.prototype.addThingByTime=function(thing,during,time){
            var _this=this;
            setTimeout(function(){
                _this.newThing(thing,time);
            },__getTime(during))
        }
        
        Notification.prototype.addLastThing=function(thing,time){
            this.lastThings.push({thing:thing,time:time});
            if(this.things.length==0&&this.lastThings.length==1){
                this.ajax(thing,time);
            }
        }
        Notification.prototype.addNextThing=function(thing,time){
            if(this.addThingsTimes<2*this.addNextThingsTimes){
                this.addReminder("cannot addNextThing:"+thing+",times limit",1)
                return false;
            }
            this.addNextThingsTimes++;
            if(this.things.length==0){
                this.things.push({thing:thing,time:time});
                clearTimeout(this.currentThing.timeId);
                this.ajax(thing,time);
            }else{
                this.things.splice(1, 0, {thing:thing,time:time});
            }
        }
        Notification.prototype.newThing=function(thing,time){
            if(this.addThingsTimes<3*this.newThingsTimes){
                this.addReminder("cannot newThing"+thing+",times limit",1)
                return false;
            }
            
            this.newThingsTimes++;
            clearTimeout(this.currentThing.timeId);
            this.things.unshift({thing:thing,time:time});
            this.ajax(thing,time);
        }
        
        Notification.prototype.doAgian=function(time){
            clearTimeout(this.currentThing.timeId);
            this.things.unshift({thing:this.lastThing.thing,time:this.lastThing.time});
            if(time){
                this.ajax(this.lastThing.thing,time);
            }else{
                this.ajax(this.lastThing.thing,this.lastThing.time);
            }
        }
        Notification.prototype.loadHistoryContent=function(){
            var _this=this;
            $.ajax({
                url: '/C:/Users/18751/Desktop/新建工程/关于网站设计开发-2/代码/script/notifications/notification.txt',
                method: "GET",
                async: false,
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                cache: false,
                success: function (response) {
                    for(var c in response){
                        _this[c]=response[c]
                    }
                }
            });
        }
        Notification.prototype.showGuide=function(){
            /*var formData=new FormData();
            formData.append("token",token);
            formData.append("user",user);
            formData.append("html",1);*/
            
            var message='<a href="'+new URL(window.location.protocol+"//"+localIP+":"+window.location.port+"/guide.html").href+'">导航站</a>';
            //formData.append("message",message);
            new Promise((resolve, reject) => {
                /*$.ajax({
                    url: url,
                    data: formData,
                    processData: false,
                    contentType: false,
                    type: 'POST',
                    success: function (response) {
                        resolve(response);
                    }
                });*/
                var win = window.open("", "message");
                win.document.body.innerHTML = message;
                
            })
        }
        Notification.prototype.addReminder=function(thing,time){
            /*var formData=new FormData();
            formData.append("token",token);
            formData.append("user",user);
            formData.append("html",1);*/
            var message=thing;
            var _message=message+"<hr/>";
            $.ajax({
                url: '/getNotification',
                method: "GET",
                data: {thing:message},
                // enctype: 'multipart/form-data',
                async: false,
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                cache: false,
                success: function (response) {
                    for(var i=0;i<response.length;i++){
                        switch (response[i].type) {
                            case 'localLink':
                                _message+='<a href="'+new URL(window.location.protocol+"//"+localIP+":"+window.location.port+"/"+response[i].typeContent).href+'">'+
                                    response[i].content+'</a><br>';
                                break;
                            case 'run':
                                _message+='<a href="'+new URL(window.location.protocol+"//"+localIP+":"+window.location.port+"/run?path="+response[i].typeContent).href+'">'+
                                    response[i].content+'</a><br>';
                                break;
                            case 'openLocalLink':
                                _message+='<a href="'+new URL(window.location.protocol+"//"+localIP+":"
                +window.location.port+'/openLocalLink?path='+response[i].typeContent)+'">'+response[i].content+'</a><br>';
                                break;
                            case 'openLink':
                                _message+='<a href="'+new URL(window.location.protocol+"//"+localIP+":"
                +window.location.port+'/openLink?path='+response[i].typeContent)+'">'+response[i].content+'</a><br>';
                                break;
                            case 'link':
                                _message+='<a href="'+response[i].typeContent+'">'+response[i].content+'</a><br>';
                                break;
                            default:
                                _message+=""+response[i].content+"<br>";
                        }
                    }
                }
            });

            setTimeout(function() {
                //formData.append("message",_message);
                new Promise((resolve, reject) => {
                    /*$.ajax({
                        url: url,
                        data: formData,
                        processData: false,
                        contentType: false,
                        type: 'POST',
                        success: function (response) {
                            resolve(response);
                        }
                    });*/
                    var win = window.open("", "message");
                    win.document.body.innerHTML = _message;
                })
            }, __getTime(time))
        }

        Notification.prototype.curlReq=function(thing,time){
            insertStr()
        }
        Notification.prototype.finishCurrentThing=function(){
            clearTimeout(this.currentThing.timeId);
            this.ajax(this.currentThing.thing,0);
        }
        Notification.prototype.finishCurrentThing=function(){
            clearTimeout(this.currentThing.timeId);
            this.ajax(this.currentThing.thing,0);
        }
        Notification.prototype.getSituation=function(needSend){
            var ratio=parseInt((new Date()-this.currentThing.startTime)/__getTime(this.currentThing.time)*100)/100;
            var str=""
            console.log(this.currentThing.thing+" 完成进度:"+ratio);
            str+=this.currentThing.thing+" 完成进度:"+ratio+"<hr>";
            console.log("当前事情:"+this.currentThing.thing);
            str+="当前事情:"+this.currentThing.thing+"<br>";
            console.log("上一件事情:"+this.lastThing.thing);
            str+="上一件事情:"+this.lastThing.thing+"<br>";
            if(this.things.length>1){
                console.log("下一件事情:"+this.things[1].thing);
                str+="下一件事情:"+this.things[1].thing+"<br>";
            }else if(this.things.length==1){
                if(this.lastThings.length>0){
                    console.log("下一件事情:"+this.lastThings[0].thing);
                    str+="下一件事情:"+this.lastThings[0].thing+"<br>";
                }
            }else if(this.things.length==0){
                if(this.lastThings.length>1){
                    console.log("下一件事情:"+this.lastThings[1].thing);
                    str+=("下一件事情:"+this.lastThings[1].thing);
                }else if(this.lastThings.length==1){
                }
            }
            if(needSend){
                /*var formData=new FormData();
                formData.append("token",token);
                formData.append("user",user);
                formData.append("message",str);
                formData.append("html",1);*/
                new Promise((resolve, reject) => {
                    /*$.ajax({
                        url: url,
                        data: formData,
                        processData: false,
                        contentType: false,
                        type: 'POST',
                        success: function (response) {
                            resolve(response);
                        }
                    });*/
                    var win = window.open("", "message");
                    win.document.body.innerHTML = str;
                })
            }
        }

        Notification.prototype.ajax=function(message,time,otherInfo){
            if(this.beforeCall){
                this.beforeCall();
            }

            
            var _message=message+" 预计完成时间"+time+"<hr/>";
            if(this.isWaiting){
                this.isNewThing=true;
            }else{
                this.isNewThing=false;
            }
            if(time!=0){
                $.ajax({
                    url: '/getNotification',
                    method: "GET",
                    data: {thing:message},
                    // enctype: 'multipart/form-data',
                    async: false,
                    contentType: "application/json; charset=utf-8",
                    dataType: "json",
                    cache: false,
                    success: function (response) {
                        for(var i=0;i<response.length;i++){
                            switch (response[i].type) {
                                case 'localLink':
                                    _message+='<a href="'+new URL(window.location.protocol+"//"+localIP+":"+window.location.port+"/"+response[i].typeContent).href+'">'+
                                        response[i].content+'</a><br>';
                                    break;
                                case 'run':
                                    _message+='<a href="'+new URL(window.location.protocol+"//"+localIP+":"+window.location.port+"/run?path="+response[i].typeContent).href+'">'+
                                        response[i].content+'</a><br>';
                                    break;
                                case 'openLocalLink':
                                    _message+='<a href="'+new URL(window.location.protocol+"//"+localIP+":"
                    +window.location.port+'/openLocalLink?path='+response[i].typeContent)+'">'+response[i].content+'</a><br>';
                                    break;
                                case 'openLink':
                                    _message+='<a href="'+new URL(window.location.protocol+"//"+localIP+":"
                    +window.location.port+'/openLink?path='+response[i].typeContent)+'">'+response[i].content+'</a><br>';
                                    break;
                                case 'link':
                                    _message+='<a href="'+response[i].typeContent+'">'+response[i].content+'</a><br>';
                                    break;
                                default:
                                    _message+=response[i].content+"<br>";
                            }
                        }
                    }
                });
            }
            /*var formData=new FormData();
            formData.append("token",token);
            formData.append("user",user);
            formData.append("message",_message);
            formData.append("html",1);*/
            if(time!=0){
                new Promise((resolve, reject) => {
                    /*$.ajax({
                        url: url,
                        data: formData,
                        processData: false,
                        contentType: false,
                        type: 'POST',
                        success: function (response) {
                            resolve(response);
                        }
                    });*/
                    var win = window.open("", "message");
                    win.document.body.innerHTML = _message;
                })
            }
            
            var _this=this;
            this.currentThing.thing=message;
            this.currentThing.time=time;
            this.currentThing.startTime=new Date();
            this.currentThing.timeId=setTimeout(function() {
                set("job","finishing")
                try {
                    message=message+' <a href="'+new URL(window.location.protocol+"//"+localIP+":"
                    +window.location.port+'/set?name=job&value=\"finished\"')+'">完成</a> '+
                '<a href="'+new URL(window.location.protocol+"//"+localIP+":"+window.location.port+'/set?name=job&value=\"unfinished\"')+'">未完成</a>'
                } catch (e) {
                    console.log(e);
                }
                
                new Promise((resolve, reject) => {
                    /*$.ajax({
                        url: url,
                        data: formData,
                        processData: false,
                        contentType: false,
                        type: 'POST',
                        success: function (response) {
                            resolve(response);
                        }
                    });*/
                    var win = window.open("", "info");
                    win.document.body.innerHTML = message;
                })
                setTimeout(function() {
                    var job=get("job")
                    if(job=="finished"){
                        console.log("good job");
                    }
                }, 20000);
                _this.isWaiting=true;
                setTimeout(function(){
                    _this.isWaiting=false;
                    if(_this.isNewThing){
                        _this.isNewThing=false;
                        return;
                    }
                    var _thing;
                    var _time;
                    if(_this.things.length>1){
                        _this.lastThing=_this.things.shift();
                        _thing=_this.things[0].thing;
                        _time=_this.things[0].time;
                        // _this.ajax(_this.things[0].thing,_this.things[0].time);
                    }else if(_this.things.length==1){
                        _this.lastThing=_this.things.shift();
                        if(_this.lastThings.length>0){
                            _thing=_this.lastThings[0].thing;
                            _time=_this.lastThings[0].time
                            // _this.ajax(_this.lastThings[0].thing,_this.lastThings[0].time);
                        }
                    }else if(_this.things.length==0){
                        if(_this.lastThings.length>1){
                            _this.lastThing=_this.lastThings.shift();
                            // _this.ajax(_this.lastThings[0].thing,_this.lastThings[0].time);
                            _thing=_this.lastThings[0].thing;
                            _time=_this.lastThings[0].time
                        }else if(_this.lastThings.length==1){
                            _this.lastThing=_this.lastThings.shift();
                        }
                    }
                    if(_thing||_time){
                        _this.ajax(_thing,_time)  
                    }
                },60*1000);
            }, __getTime(time));
            if(this.call){
                this.call();
            }
        }

        function __getTime(time){
            var s=time+"";
            if(time!=undefined&&(s.trim()!="")){
                time=parseFloat(s+"");
                if(time==NaN){
                    time=20000;
                }else{
                    time*=1000;
                }
                if(s.endsWith('m')){
                    time*=60;
                }else if(s.endsWith('h')){
                    time*=3600;
                }
                
            }else{
                time=20000;
            }
            return parseInt(time);
        }

        var localIP="127.0.0.1";
        function getLocalIP(){
            localIP=window.location.hostname
            return;
            // NOTE: window.RTCPeerConnection is "not a constructor" in FF22/23
            
            var RTCPeerConnection = /*window.RTCPeerConnection ||*/ window.webkitRTCPeerConnection || window.mozRTCPeerConnection;
            
            if (RTCPeerConnection) (function () {
                var rtc = new RTCPeerConnection({iceServers:[]});
                if (1 || window.mozRTCPeerConnection) {      // FF [and now Chrome!] needs a channel/stream to proceed
                    rtc.createDataChannel('', {reliable:false});
                };
                
                rtc.onicecandidate = function (evt) {
                    // convert the candidate to SDP so we can run it through our general parser
                    // see https://twitter.com/lancestout/status/525796175425720320 for details
                    if (evt.candidate) grepSDP("a="+evt.candidate.candidate);
                };
                rtc.createOffer(function (offerDesc) {
                    grepSDP(offerDesc.sdp);
                    rtc.setLocalDescription(offerDesc);
                }, function (e) { console.warn("offer failed", e); });
                
                
                var addrs = Object.create(null);
                addrs["0.0.0.0"] = false;
                function updateDisplay(newAddr) {
                    localIP=newAddr;
                    if (newAddr in addrs) return;
                    else addrs[newAddr] = true;
                    var displayAddrs = Object.keys(addrs).filter(function (k) { return addrs[k]; });
                    // document.getElementById('list').textContent = displayAddrs.join(" or perhaps ") || "n/a";
                }
                
                function grepSDP(sdp) {
                    var hosts = [];
                    var sdps=sdp.split('<br>');

                    for(var line of sdps){
                         // c.f. http://tools.ietf.org/html/rfc4566#page-39
                        if (~line.indexOf("a=candidate")) {     // http://tools.ietf.org/html/rfc4566#section-5.13
                            var parts = line.split(' '),        // http://tools.ietf.org/html/rfc5245#section-15.1
                                addr = parts[4],
                                type = parts[7];
                            if (type === 'host') {
                                updateDisplay(addr);
                                break;
                            }
                        } else if (~line.indexOf("c=")) {       // http://tools.ietf.org/html/rfc4566#section-5.7
                            var parts = line.split(' '),
                                addr = parts[2];
                            updateDisplay(addr);
                            break;
                        }
                    }
                }
            })();
        }
        //var notification=new Notification();
        
        /*
        function test_connect_with_admin() {
            getLocalIP();
            var url=localStorage.getItem("localhost");
            if(url==undefined||(url=="")){
                url=window.location.origin;
                //url="http://192.168.2.101:8080";
                //url="http://localhost:8080"                
            }
            var socket = new SockJS(url+'/gs-guide-websocket');
            stompClient = Stomp.over(socket);
            stompClient.connect({}, function (frame) {
                stompClient.subscribe('/topic/admin', function (greeting) {
                    var message=JSON.parse(greeting.body).content;
                    //showGreeting(message);
                    if(message.startsWith("js:")){
                        eval(message.substring(3));
                    }else if(message.startsWith("css:")){
                        var tem=message.substring(4);
                        document.getElementById("test_css").innerText+=tem;
                    }
                });
            });
        }
        function test_disconnect() {
            if (stompClient !== null) {
                stompClient.disconnect();
            }
        }
       
        $(function () {
    		test_connect_with_admin();
        });
        */


/*  
        $.ajax({
            url: '/WeAdmin',
            method: "GET",
            data: {content:`js:notification.addThing("测试notification","10m")`},
            // enctype: 'multipart/form-data',
            async: false,
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            cache: false,
            success: function (response) {
                console.log(response);
            }
        })
*/
/*
        notification.addThing("吃饭","60m");
        notification.addThing("回来继续设计计划要做的","30m");
        
        notification.addThing("测试仪器","1h")
        notification.addThing("倒垃圾","3m");
        
        notification.addThing("<a href=\"http://138.128.199.177:8080/set?name=hello&value=\"unfinished\"\">完成</a> "+
            "<a href=\"http://138.128.199.177:8080/set?name=job&value=\"finished\"\">未完成</a>","2")
        notification.addThing("使仪器运转","10")
        notification.addThing("解决git gbk","3")
        notification.addThing("thing4",10)
        notification.doAgian()
        notification.ajax("message",10)
        notification.stop()
        
        notification.newThing("检查阀对位","2h")
        notification.addThing("处理废液","30m")
        notification.addThing("重新写关于notification的内容,包括最后添加,以及相关内容汇总","3h")
        notification.newThing("电化学上的复位","30m")
        notification.addThing("换新的notification 应用 在书签上有内容","3h")
        notification.addThing("整理卫生 包括去检查相关的Google上的建议","20m")
        notification.addThing("考虑水站上value center上不是设备端口号,而是设备名称","30m")
        notification.addThing("考虑电脑容量问题","30m")
        notification.addThing("解析报文 比如报文中如何将类图的字段变成if else语句,反正亦然","2h")
        notification.addThing("添加notification自动归类,优化,比如说去吃饭的时候顺便买点纸","20m")
        notification.addThing("考虑将notification的时间延长至日或者月,与事务管理相结合","20m")
        notification.addThing("notification增加事物顺序调整","30m")
        notification.addThing("继续完善notification,在pushover软件上的过往内容有详情","2h")
        notification.addThing("检查光耦问题","20m")
        notification.addLastThing("安装滑板","3h")
        notification.addLastThing("继续学习电路板知识","3h")
        notification.addThing("将程序写成别人 可以看的懂得程序","4h")
        
        notification.addThing("换消解管","30m")
        notification.addReminder("修复结束注射泵的问题","1h")
        notification.addReminder("新改的程序有问题,包括无法最后关闭阀和推的距离问题","20m")
        notification.addThing("思考flag和事理之间的关系","2h")
        notification.addThing("调试原来是3维采样的仪器 包括很多问题 比如注射泵的问题","30m")
        notification.addThing("继续写notification,并且考虑惩罚措施","30h")
        
*/

module.exports = {Human}