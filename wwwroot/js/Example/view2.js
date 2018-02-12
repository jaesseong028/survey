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
    getcss: function(o,c,i){
        var obj = cdom.get(o);
        var objcss = Object.create(this);
        objcss.element =  obj.element.getElementsByClassName(c)[i];
        return objcss;
    },
    append: function(o){
        var obj = cdom.get(o);
        console.log(1234,obj);
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
    insert: function(o){
        var obj = cdom.get(o);
        pelement = this.element.parentNode;
        pelement.insertBefore(obj.element,this.element.nextSibling);
        return obj;
    }
}


function createSurvey()
{
    var elSurvey = cdom.get('div').css('survey');
    elSurvey.append('div')
                .css('header')
                .append('p').css('title');
    elSurvey.append('div').css('page-set');

    return elSurvey.element;
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
function createPage()
{
    var elPage = cdom.get('div').css('page');
    elPage.append('div')
            .css('header')
            .append('p')
                .css('titile')
            .insert('p')
                .css('description');
    return elPage.element;
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
            .insert('p')
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
        var surveyId = document.getElementById('ubSurvey');
        var surveyJson = JSON.parse(survey);
        console.log(surveyJson);

        if( ('survey' in surveyJson) && ('pages' in surveyJson.survey) && ('title' in surveyJson.survey))
        {
            //Create Survey 
            var elSurvey = createSurvey();

            //Survey Title
            cdom.getcss(elSurvey,'title',0).text(surveyJson.survey.title);
            
            //SUrvey Page
            var pages  = surveyJson.survey.pages;

            for(var page in pages)
            {
                if(pages.hasOwnProperty(page))
                {
                    //pages[page].element;
                    var elPage = createPage();
                    




                }
            }




            surveyId.appendChild(elSurvey);



            
            //Page Set 생성

            
















        }


        
        //createQuestionSet();




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