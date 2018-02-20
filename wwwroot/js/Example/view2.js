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
    addcss: function(c){
        this.element.classList.add(c);
        return this;
    },
    removecss: function(c){
        this.element.classList.remove(c);
        return this;
    },
    changecss: function (b,f){
        this.element.classList.remove(b);
        this.element.classList.add(f);
        return this;
    },
    event: function(e, f){
        if(this.element.attachEvent){
            this.element.attachEvent('on' + e, f);
        }else{
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
    var elSurvey = cdom.get('div').addcss('survey');
    elSurvey.append('div')
                .addcss('header')
                .append('p').addcss('title');
    elSurvey.append('div').addcss('page-set');

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
    var elPage = cdom.get('div').addcss('page');
    elPage.append('div')
            .addcss('header')
            .append('p')
                .addcss('title')
            .insert('p')
                .addcss('description');
    elPage.append('div')
            .addcss('questions');

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
    var elQSet = cdom.get('fieldset').addcss('question');

    elQSet.append('div')
            .addcss('header')
            .append('p')
                .addcss('title')
            .insert('p')
                .addcss('description');

    elQSet.append('div')
            .addcss('items');

    return elQSet.element;
}

// Check radio event
function e_change_checkradio( obj, items )
{
    var itemList = document.querySelectorAll('input[name='+ items.name +']');

    if('skip'in items)
    {
        var skipList = items.skip;
        for(p in skipList)
        {
            if(skipList.hasOwnProperty(p))
            {
                for(n in skipList[p].skipQuestionNames)
                {
                    if(skipList[p].skipQuestionNames.hasOwnProperty(n))
                    {
                        if(skipList[p].choice == obj.value && obj.checked)
                        {
                            var elskip = document.getElementById(skipList[p].skipQuestionNames[n]);
                            cdom.get(elskip).changecss('show','hide');

                        }else
                        {
                            var elskip = document.getElementById(skipList[p].skipQuestionNames[n]);
                            cdom.get(elskip).changecss('hide','show');
                        }
                    }
                }
            }             
        }
    }

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

    } else if(items.type === 'radio' && obj.name === items.name + '_othertext')
    {
        var itemText = document.querySelector('input[id='+ items.name +'_othertext]');
        itemText.value = '';
    }
}

//Check_Box Radio_Box Create
function createCheckRadio( elItems, items )
{
    var width_percent = '100';
    if( 'col_count' in items )
        width_percent = items.col_count <= 1 ? '100' : 100 / items.col_count;
    var col_style = 'display: inline-block; width: ' + width_percent + '%;';

    for(var p in items.choices)
    {
        if(items.choices.hasOwnProperty(p))
        {
            var elItem = cdom.get('div').attr('style',col_style).addcss(items.type + '_set');
            elItem.append('input')
                        .attr('type',items.type == 'radio' ? items.type : 'checkbox')
                        .attr('id',items.name + '_' + p)
                        .attr('value',items.choices[p])
                        .attr('name', items.name)
                        .addcss('i_' + items.type)
                    .insert('label')
                        .addcss('lbl_' + items.type)
                        .attr('for', items.name + '_' + p)
                        .inhtml(items.choices[p]);

            cdom.getcss(elItems,'items',0).append(elItem.element);
        }
    }

    if(('is_other' in items) && (items.is_other == true))
    {
        var elOtherItem = cdom.get('div').attr('style',col_style).addcss(items.type + '_other');
        elOtherItem.append('input')
                        .attr('type',items.type == 'radio' ? items.type : 'checkbox')
                        .attr('id',items.name + '_other')
                        .attr('value',items.other_text)
                        .attr('name', items.name)
                        .addcss('i_' + items.type + '_other')
                    .insert('label')
                        .addcss('lbl_' + items.type + '_other')
                        .attr('for', items.name + '_other')
                        .inhtml(items.other_text)
                    .insert('input')
                        .attr('type','text')
                        .attr('id',items.name + '_othertext')
                        .attr('maxLength',items.other_text_len)
                        .attr('size',items.other_text_width)
                        .addcss('txt_' + items.type + '_other');

        cdom.getcss(elItems,'items',0).append(elOtherItem.element);
    }

    // add event 
    var elinputs = elItems.querySelectorAll('input[name='+ items.name +']');
    for(p in elinputs)
    {
        if(elinputs.hasOwnProperty(p))
            cdom.get(elinputs[p]).event('change', function(){ var obj = this; e_change_checkradio( obj, items ); });
    }
}

//Text Box Create
function createTextBox( elItems, items )
{
    var elItem = cdom.get('div').addcss(items.type + '_set');
        
    if(items.type === 'text')
    {
        elItem.append('input')
                .attr('type', items.type)
                .addcss('i_' + items.type);
    }
    else if(items.type === 'comment')
    {    
        elItem.append('textarea')
            .addcss('i_' + items.type)
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
    var elItem = cdom.get('div').addcss(items.type + '_set');

    if('min_description' in items)
    {
        elItem.append('spen')
                .addcss('min_description')
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
                        .addcss('i_' + items.type)
                    .insert('label')
                        .addcss('lbl_' + items.type)
                        .attr('for', items.name + '_' + p)
                        .inhtml(items.choices[p]);
            
        }
    }

    if('max_description' in items)
    {
        elItem.append('spen')
                .addcss('max_description')
                .inhtml(items.max_description);
    }

    cdom.getcss(elItems,'items',0).append(elItem.element);

}

function createMultiTextBox( elItems, txtItems )
{
    var width_percent = '100';
    if( 'col_count' in txtItems )
        width_percent = txtItems.col_count <= 1 ? '100' : 100 / txtItems.col_count;
    var col_style = 'display: inline-block; width: ' + width_percent + '%;';

    if('items' in txtItems)
    {
        for(p in txtItems.items)
        {
            var elItem = cdom.get('div').addcss(txtItems.type + '_set').attr('style',col_style);

            if(txtItems.items.hasOwnProperty(p))
            {
                elItem.append('label')
                        .addcss('lbl_' + txtItems.type)
                        .text(txtItems.items[p].item)
                      .insert('input')
                      .attr('id',txtItems.name + '_' + p)
                      .attr('type', 'text')
                      .attr('size', txtItems.text_width)
                      .attr('maxLength',txtItems.max_len)
                      .addcss('i_' + txtItems.type);
                
                cdom.getcss(elItems,'items',0).append(elItem.element);
            }
        }
    }
}


function createQuestion(elPage, questions, questionNumber)
{
    //Question Create
    for(var p in questions)
    {
        if(questions.hasOwnProperty(p))
        {
            var elQuestion = createQuestionSet();
            
            // Questions iD
            cdom.get(elQuestion).attr('id',questions[p].name);
            // Questions Required
            if(('is_required' in questions[p]) && (questions[p].is_required == true))
                cdom.getcss(elQuestion,'title',0).append('strong').text('*');
            // Questions title
            if('title' in questions[p])
                cdom.getcss(elQuestion,'title',0).text(questionNumber++ + '. ').text(questions[p].title);            
            // Questions description
            if('description' in questions[p] && questions[p].description != '' )
                cdom.getcss(elQuestion,'description',0).inhtml(questions[p].description.replace(/(?:\r\n|\r|\n)/g,'<br />'));
            else
                cdom.getcss(elQuestion,'description',0).removecss('description');

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
            // multiText
            else if(questions[p].type === 'multiText')
                createMultiTextBox(elQuestion, questions[p]);

            cdom.getcss(elPage,'questions',0).append(elQuestion);
        }
    }
}

// 페이지 보이기
function isVisiblePage(elPage, isShow)
{
    cdom.get(elPage)
            .changecss(isShow ? 'hide' : 'show', isShow ? 'show' : 'hide');
}

function addBtnEvent(elPage, btnType)
{
    var elbtn = cdom.get('button').addcss('btn' + btnType).inhtml(btnType);

    elbtn.event('click', function(){
        var obj = this;
        var pObj = obj.parentNode; //page
        
        if(btnType == 'Next')
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

    cdom.get(elPage).append(elbtn.element);
    
}

// 페이지 이동 및 완료 버튼
function createPageBtn(elPage, totalPage, currPage )
{
    cdom.get(elPage).append('div').addcss('btn-set');
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
        console.log(survey);
        //var surveyJson = JSON.parse(survey);

        var surveyJson = survey;
        console.log(surveyJson);

        if( ('survey' in surveyJson) && ('pages' in surveyJson.survey) && ('title' in surveyJson.survey))
        {
            // Create Survey 
            var elSurvey = createSurveySet();

            // Survey Title
            if('title' in surveyJson.survey)
                cdom.getcss(elSurvey,'title',0).text(surveyJson.survey.title);

            // if('description' in surveyJson.survey)
            //     cdom.getcss(elSurvey,'description',0).inhtml(surveyJson.survey.description.replace(/(?:\r\n|\r|\n)/g,'<br />')).addcss('line');

            // Survey Page
            var pages  = surveyJson.survey.pages;
            var questionNumber = 1;

            for(var p in pages)
            {
                if(pages.hasOwnProperty(p))
                {
                    // Page element 
                    var elPage = createPageSet();

                    // Page iD
                    cdom.get(elPage).attr('id',pages[p].name);
                    
                    // Page title
                    if('title' in pages[p])
                        cdom.getcss(elPage,'title',0).text(pages[p].title);

                    // Page description
                    if('description' in pages[p] && questions[p].description != '' )
                        cdom.getcss(elPage,'description',0).inhtml(pages[p].description.replace(/(?:\r\n|\r|\n)/g,'<br />'));
                    else
                        cdom.getcss(elPage,'description',0).removecss('description');

                    //first page Visible
                    if(p == 0)   // 첫페이지는 무조건 보이기
                        cdom.get(elPage).addcss('show');
                    else
                        cdom.get(elPage).addcss('hide');

                    // Page Question
                    if(('elements') in pages[p])
                        createQuestion(elPage, pages[p].elements,questionNumber);

                    // Question Number
                    questionNumber += pages[p].elements.length;
                    
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
