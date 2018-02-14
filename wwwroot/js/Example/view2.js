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
        this.element.appendChild(obj.element);
        return obj;
    },
    insert: function(o){
        var obj = cdom.get(o);
        pelement = this.element.parentNode;
        pelement.insertBefore(obj.element,this.element.nextSibling);
        return obj;
    },
    text: function(t){
        this.element.appendChild(document.createTextNode(t));
        return this;
    },
    inhtml: function(t){
        this.element.innerHTML = t;
        return this;
    },
    attr: function(k, v){
        this.element.setAttribute(k,v);
        return this;
    },
    css: function(c){
        this.element.classList.add(c);
        return this;
    },
    event: function(e, f){
        if(this.element.attachEvent){
            console.log('IE8이하');
            this.element.attachEvent('on' + e, f);
        }else{
            console.log('IE9이상');
            this.element.addEventListener(e, f, false);
        }
        return this;
    }
}

// ////////////////////////////////////
// /// Survey Set 생성
// ////////////////////////////////////
// <div class='survey'>
//     <div class='header'>
//         <p class='title'></p>
//         <p class='description'></p>
//     </div>
//     <div class='page-set'>
//     </div>
// </div>
///////////////////////////////////////
function createSurveySet()
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
function createPageSet()
{
    var elPage = cdom.get('div').css('page');
    elPage.append('div')
            .css('header')
            .append('p')
                .css('title')
            .insert('p')
                .css('description');
    elPage.append('div')
            .css('questions');

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

// check radio event
function e_change_checkradio( items )
{
    var itemList = document.querySelectorAll('input[name='+ items.name +']');

    //Check Items
    var checkedItem = [].filter.call(itemList, function( el ) {
        return el.checked;
    });

    //unCheck Items
    var unCheckedItem = [].filter.call(itemList, function( el ) {
        return !el.checked;
    });

    if(items.type === 'checkbox')
    {
        
        for(var i = 0; i < unCheckedItem.length; i++)
        {
            if(checkedItem.length >= items.max_num)
                unCheckedItem[i].disabled = true;
            else
                unCheckedItem[i].disabled = false;

            if(unCheckedItem[i].id === items.name + '_other')
            {
                var itemText = document.querySelector('input[id='+ items.name +'_othertext]');
                itemText.value = '';
            }
        }

    } else if(items.type === 'radio')
    {
        var itemText = document.querySelector('input[id='+ items.name +'_othertext]');
        itemText.value = '';
    }
}

//Check_Box Radio_Box Create
function createCheckRadio( elItems, items )
{
    // col_count 체크
    var width_percent = items.col_count <= 1 ? '100' : 100 / items.col_count;
    var col_style = 'display: inline-block; width: ' + width_percent + '%;';

    for(var p in items.choices)
    {
        if(items.choices.hasOwnProperty(p))
        {
            var elItem = cdom.get('div').attr('style',col_style).css(items.type + '_set');
            elItem.append('input')
                        .attr('type',items.type == 'radio' ? items.type : 'checkbox')
                        .attr('id',items.name + '_' + p)
                        .attr('value',items.choices[p])
                        .attr('name', items.name)
                        .css('i_' + items.type)
                    .insert('label')
                        .css('lbl_' + items.type)
                        .attr('for', items.name + '_' + p)
                        .inhtml(items.choices[p]);

            cdom.getcss(elItems,'items',0).append(elItem.element);
        }
    }

    if(('is_other' in items) && (items.is_other == true))
    {
        var elOtherItem = cdom.get('div').attr('style',col_style).css(items.type + '_other');
        elOtherItem.append('input')
                        .attr('type',items.type == 'radio' ? items.type : 'checkbox')
                        .attr('id',items.name + '_other')
                        .attr('value',items.other_text)
                        .attr('name', items.name)
                        .css('i_' + items.type + '_other')
                    .insert('label')
                        .css('lbl_' + items.type + '_other')
                        .attr('for', items.name + '_other')
                        .inhtml(items.other_text)
                    .insert('input')
                        .attr('type','text')
                        .attr('id',items.name + '_othertext')
                        .attr('maxLength',items.other_text_len)
                        .attr('size',items.other_text_width)
                        .css('txt_' + items.type + '_other');

        cdom.getcss(elItems,'items',0).append(elOtherItem.element);
    }

    // add event 
    var elinputs = elItems.querySelectorAll('input[name='+ items.name +']');
    for(p in elinputs)
    {
        if(elinputs.hasOwnProperty(p))
            cdom.get(elinputs[p]).event('change', function(){ e_change_checkradio( items ); });
    }
}

//Text Box Create
function createTextBox( elItems, items )
{
    var elItem = cdom.get('div').css(items.type + '_set');
        
    if(items.type === 'text')
    {
        elItem.append('input')
                .attr('type', items.type)
                .css('i_' + items.type);
    }
    else if(items.type === 'comment')
    {    
        elItem.append('textarea')
            .css('i_' + items.type)
            .attr('rows',items.rows);
    }   

    cdom.getcss(elItem.element,'i_' + items.type, 0)
                .attr('id',items.name)
                
                .attr('maxLength',items.max_len)
                .attr('style','width:100%');
    
    cdom.getcss(elItems,'items',0).append(elItem.element);
}


//Rate Box Create
function createRate( elItems, items )
{   
    var elItem = cdom.get('div').css(items.type + '_set');

    if('min_description' in items)
    {
        elItem.append('spen')
                .css('min_description')
                .inhtml(items.min_description);
    }

    for(var p in items.choices)
    {
        if(items.choices.hasOwnProperty(p))
        {
            elItem.append('input')
                        .attr('type', 'radio')
                        .attr('id', items.name + '_' + p)
                        .attr('value', items.choices[p])
                        .attr('name', items.name)
                        .css('i_' + items.type)
                    .insert('label')
                        .css('lbl_' + items.type)
                        .attr('for', items.name + '_' + p)
                        .inhtml(items.choices[p]);
            
        }
    }

    if('max_description' in items)
    {
        elItem.append('spen')
                .css('max_description')
                .inhtml(items.max_description);
    }

    cdom.getcss(elItems,'items',0).append(elItem.element);

}

function createQuestion(elPage, questions)
{
    //Question Create
    for(var p in questions)
    {
        if(questions.hasOwnProperty(p))
        {
            var elQuestion = createQuestionSet();
            
            // Page iD
            cdom.get(elQuestion).attr('id',questions[p].name);
            // Page Required
            if(('is_required' in questions[p]) && (questions[p].is_required == true))
                cdom.getcss(elQuestion,'title',0).append('strong').text('*');
            // Page title
            cdom.getcss(elQuestion,'title',0).text(questions[p].title);            
            // Page description
            cdom.getcss(elQuestion,'description',0).inhtml(questions[p].description.replace(/(?:\r\n|\r|\n)/g,'<br />'));

            // items Setting
            // radio, check box
            if(questions[p].type === 'radio' || questions[p].type === 'checkbox')
                createCheckRadio(elQuestion, questions[p]);
            // text, multi text
            else if(questions[p].type === 'text' || questions[p].type === 'comment')
                createTextBox(elQuestion, questions[p]);
            // rate
            else if(questions[p].type === 'rate')
                createRate(elQuestion, questions[p]);

            cdom.getcss(elPage,'questions',0).append(elQuestion);
        }
    }
}


function addBtnEvent(elDivPage, btnType)
{
    var elBtn = document.createElement('button');
    var nodeText = document.createTextNode(btnType);
    //elBtn.setAttribute('id', 'btn' + btnType)
    elBtn.appendChild(nodeText);
    elBtn.addEventListener('click', function(){
        var obj = this;
        var pObj = obj.parentNode;
        
        // console.log('obj',obj);
        // console.log('pObj',pObj);
        
        if(btnType == 'After')
        {
            isVisiblePage(pObj, false);

            var nextPObj = pObj.nextSibling;
            isVisiblePage(nextPObj, true);
            

        }else if (btnType == 'Pre')
        {
            isVisiblePage(pObj, false);

            var prePObj = pObj.previousSibling;
            isVisiblePage(prePObj, true);
        }else if (btnType == 'Complete')
        {
            alert('완료');
        }
    });


    elDivPage.appendChild(elBtn);
}

// 페이지 이동 및 완료 버튼
function createPageBtn(elPage, totalPage, currPage )
{
    // 페이지 별 이전, 다음 버튼 추가
    if(totalPage == 1) // 페이지가 존재하지 않음
    {
        addBtnEvent(elPage,'Complete');
    }
    else if(totalPage - 1 == currPage)  // 마지막 페이지 일 경우 이전 버튼과 완료 버튼
    {
        addBtnEvent(elPage,'Pre');
        addBtnEvent(elPage,'Complete');
    }
    else if(totalPage > 1 && currPage == 0) // 페이지가 있으며 첫번째 페이지
    {
        addBtnEvent(elPage,'Next');
    }
    else if(totalPage > 1 && currPage > 0) // 페이지가 있으며 중간 페이지
    {
        addBtnEvent(elPage,'Pre');
        addBtnEvent(elPage,'Next');
    }
}



function domReady (){
    try
    {
        var surveyId = document.getElementById('ubSurvey');
        var surveyJson = JSON.parse(survey);
        console.log(surveyJson);

        if( ('survey' in surveyJson) && ('pages' in surveyJson.survey) && ('title' in surveyJson.survey))
        {
            // Create Survey 
            var elSurvey = createSurveySet();

            // Survey Title
            cdom.getcss(elSurvey,'title',0).text(surveyJson.survey.title);
            
            // Survey Page
            var pages  = surveyJson.survey.pages;
            
            for(var p in pages)
            {
                if(pages.hasOwnProperty(p))
                {
                    // Page element 
                    var elPage = createPageSet();

                    // Page iD
                    cdom.get(elPage).attr('id',pages[p].name);
                    // Page title
                    cdom.getcss(elPage,'title',0).text(pages[p].title);
                    // Page description
                    cdom.getcss(elPage,'description',0).inhtml(pages[p].description.replace(/(?:\r\n|\r|\n)/g,'<br />'));

                    // Page Question
                    if(('elements') in pages[p])
                        createQuestion(elPage, pages[p].elements);
                    
                    //first page Visible
                    if(p == 0)   // 첫페이지는 무조건 보이기
                        cdom.get(elPage).css('show');
                    else
                        cdom.get(elPage).css('hide');

                    // Btn 생성     
                    createPageBtn(elPage, pages.length, p);
                    
                    
                    cdom.getcss(elSurvey,'page-set',0).append(elPage);                    
                }
            }

            surveyId.appendChild(elSurvey);

            //Page Set 생성
        }
    }
    catch(e){
        alert(e);
        console.log(e);
    }
}


