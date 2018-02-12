// JQuery의 ready 메서드를 순수 Javascript로 대체
// Mozilla, Opera, Webkit
if (document.addEventListener) { 
    document.addEventListener("DOMContentLoaded", function () { 
        document.removeEventListener("DOMContentLoaded", arguments.callee, false); 
        domReady(); 
    }, false); 
} // Internet Explorer 
else if (document.attachEvent) { 
    document.attachEvent("onreadystatechange", function () { 
        if (document.readyState === "complete") { 
            document.detachEvent("onreadystatechange", arguments.callee); 
            domReady(); 
        } 
    });
} 

var cdom = {
    element: null,

    get: function (o){
        var obj = Object.create(this);
        obj.element = (typeof o == 'object') ? o : document.createElement(o);
        return obj;
    },
    append: function(o){
        var obj = cdom.get(o);
        this.element.appendChild(obj.element);
        return obj;
    },
    text: function(t){
        this.element.appendChild(document.createTextNode(t));
        return this;
    },
    attribute: function(k, v){
        this.element.setAttribute(k,v);
        return this;
    },
    css: function(c){
        this.element.classList.add(c);
        return this;
    },
    event: function(e, f){
        if(this.element.addEventListener){
            console.log('IE8이하');
            this.element.attachEvent('on' + e, f);
        }else{
            console.log('IE9이상');
            this.element.addEventListener(e, f, false);
        }

        return this;
    },
    insertA: function(o){
        var obj = cdom.get(o);
        pelement = this.element.parentNode;
        pelement.insertBefore(obj.element,this.element.nextSibling);
        return obj;
    }
}

// ////////////////////////////////////
// /// Page Set 생성
// ////////////////////////////////////
// <div class='page'>
//     <div class='header'>
//         <p class='title'></p>
//         <p class='description'></p>
//     </div>
// </div>
/////////////////////////////////////// 
function createPageSet()
{
    
}

function createPage()
{
    var elPSet = cdom.get('div').css('page');
    elPSet.append('div')
            .css('header')
            .append('p')
                .css('titile')
            .insertB('p')
                .css('description');
    return elPSet.element;
}
// ////////////////////////////////////
// /// Question Set 생성
// ////////////////////////////////////
// <fieldset class='question'>
//     <div class='header'>
//         <p class='title'></p>
//         <p class='description'></p>
//     </div>
//     <div class='items'>
//     </div>
// </fieldset>
///////////////////////////////////////
function createQuestionSet()
{
    var elQSet = cdom.get('fieldset').css('question');

    elQSet.append('div')
            .css('header')
            .append('p')
                .css('title')
            .insertA('p')
                .css('description');

    elQSet.append('div')
            .css('items');

    return elQSet.element;
}

function createQuestionItems()
{


}


function domReady (){
    try
    {
        var surveyJson = JSON.parse(survey);

        console.log(surveyJson);

        var surveyId = document.getElementById('ubSurvey');



        createQuestionSet();


        // var aaa = document.createElement('div');
        // aaa.setAttribute('class','page');

        // var bbb = document.createElement('div');
        // bbb.setAttribute('class','question');

        // aaa.appendChild(bbb);
        // console.log(aaa);

        // aaa.setAttribute('id','cc');
        // console.log(aaa);
        // console.log(aaa.getElementsByClassName('question')[0]);

        // surveyId.appendChild(aaa.getElementsByClassName('question')[0]);
        
        

    }
    catch(e){
        alert(e);
        console.log(e);
    }
}