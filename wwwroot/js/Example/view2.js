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
                    if(skipList[p].skipQuestionNames.hasOwnProperty(n) && skipList[p].choice == obj.value && obj.checked)
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

    } else if(items.type === 'radio' )
    {
        var itemText = document.querySelector('input[id='+ items.name +'_othertext]');
        itemText.value = '';
    }
}

//Check_Box Radio_Box Create
function createCheckRadio( elItems, items )
{
    if(items.type === 'checkbox')
    { 
        if ('max_num' in items)
            cdom.getcss(elItems,'items',0).attr('max',items.max_num);
        if ('min_num' in items)
            cdom.getcss(elItems,'items',0).attr('min',items.min_num);
    }

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
                        .addcss('txt_' + items.type + '_other');

        if('other_text_len' in items)
        {
            cdom.getcss(elOtherItem.element,'txt_' + items.type + '_other',0).attr('maxLength',items.other_text_len);
        }

        if('other_text_width' in items)
        {
            cdom.getcss(elOtherItem.element,'txt_' + items.type + '_other',0).attr('size',items.other_text_width);
        }

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
            .attr('rows',items.rows)
            .addcss('i_' + items.type);
            
    }   

    cdom.getcss(elItem.element,'i_' + items.type, 0)
                .attr('id',items.name)
                .attr('style','width:100%');

    if('max_len' in items)
        cdom.getcss(elItem.element,'i_' + items.type, 0).attr('maxLength',items.max_len)
    
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
                      .addcss('i_' + txtItems.type);

                if('is_required' in txtItems.items[p] && txtItems.items[p].is_required == true)
                {
                    cdom.getcss(elItem.element,'lbl_' + txtItems.type, 0)
                            .append('strong')
                            .addcss('required');
                }

                if('text_width' in txtItems)
                {
                    cdom.getcss(elItem.element,'i_' + txtItems.type,0).attr('size', txtItems.text_width);
                }
                
                if('max_len' in txtItems)
                    cdom.getcss(elItem.element,'i_' + txtItems.type,0).attr('maxLength', txtItems.max_len);
                
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
                cdom.getcss(elQuestion,'title',0).append('strong').addcss('required').text('*');
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
        e_click_btn(obj, btnType);
    });

    cdom.getcss(elPage,'btn-set',0).append(elbtn.element)
    //cdom.get(elPage).append(elbtn.element);
}

function validQuestion ( pageNode )
{
    var questionNodes = pageNode.getElementsByClassName('question');

    for(p in questionNodes)
    {
        
        if(questionNodes.hasOwnProperty(p) && questionNodes[p].getElementsByClassName('required').length > 0)
        {
            var itemNodes = questionNodes[p].getElementsByClassName('items')[0];
            var alertMsg;

            var itemSet = itemNodes.childNodes[0];

            switch(itemSet.className)
            {
                case 'text_set':
                    var elText = cdom.getcss(itemSet,'i_text',0);
                    if(elText.element.value == '')
                        alertMsg = '필수값 이지만 입력되지 않았습니다.';
                    break;

                case 'comment_set':    
                    var elComment = cdom.getcss(itemSet,'i_comment',0);
                    if(elComment.element.value == '')
                        alertMsg = '필수값 이지만 입력되지 않았습니다.';
                    break;
                case 'radio_set':
                    var elRadio = itemNodes.getElementsByTagName('input');
                    
                    var checkedItem = [].filter.call(elRadio, function( el ) {
                        return el.checked;
                    });

                    if(checkedItem.length == 0)
                        alertMsg = '필수값 이지만 입력되지 않았습니다.';
                    else if(checkedItem.length > 0 && checkedItem[0].className == 'i_radio_other')
                    {   
                        var txtOther = cdom.getcss(itemNodes,'txt_radio_other',0);
                        if(txtOther.element.value == '')
                            alertMsg = '기타 내용이 입력되지 않았습니다.';
                    }   
                    
                    break;
                case 'checkbox_set':
                    
                    var elCheck = itemNodes.getElementsByTagName('input');
                        
                    var checkedItem = [].filter.call(elCheck, function( el ) {
                        return el.checked;
                    });

                    var max_num = itemNodes.getAttribute('max');
                    var min_num = itemNodes.getAttribute('min');

                    max_num = max_num == undefined ? elCheck.length : max_num;
                    min_num = min_num == undefined ? 0 : min_num;

                    var checkedOther = [].filter.call(checkedItem, function( el ) {
                        return el.className == 'i_checkbox_other';
                    });

                    if(checkedItem.length == 0)
                        alertMsg = '필수값 이지만 입력되지 않았습니다.';
                    else if(checkedItem.length < min_num || checkedItem.length > max_num)
                        alertMsg = '최소 체크 수에 해당 하지 않습니다.';
                    else if(checkedOther.length > 0)
                    {
                        var txtOther = cdom.getcss(itemNodes,'txt_checkbox_other',0);
                        if(txtOther.element.value == '')
                            alertMsg = '기타 내용이 입력되지 않았습니다.';
                    }

                    break;
                case 'rate_set':
                    var elRate = itemNodes.getElementsByTagName('input');    
                    
                    var checkedItem = [].filter.call(elRate, function( el ) {
                        return el.checked;
                    });

                    if(checkedItem.length == 0)
                        alertMsg = '필수값 이지만 입력되지 않았습니다.';

                    break;
                case 'multiText_set':
                    var elRequireds = itemNodes.getElementsByClassName('required');    
                    
                    for(n in elRequireds)
                    {
                        if(elRequireds.hasOwnProperty(n))
                        {   
                            var multiText_set = elRequireds[n].parentNode.parentNode;
                            
                            if(multiText_set.getElementsByTagName('input')[0].value == '')    
                            {    
                                alertMsg = '필수값 이지만 입력되지 않았습니다.';
                                break;
                            }   
                        }
                    }
                    break;
            }

            if(alertMsg != undefined)
            {
                var title = questionNodes[p].getElementsByClassName('title')[0].innerText
                alert( title + '\n' + alertMsg);
                return false;
            }
        }
    }

    return true;
}

function e_click_btn( obj, btnType )
{
    var pageNode = obj.parentNode.parentNode;   //page
    
    if(btnType == 'Next' && validQuestion(pageNode))
    {
        isVisiblePage(pageNode, false);

        var nextPObj = pageNode.nextSibling;
        isVisiblePage(nextPObj, true);
    }else if (btnType == 'Pre')
    {
        isVisiblePage(pageNode, false);

        var prePObj = pageNode.previousSibling;
        isVisiblePage(prePObj, true);
    }else if (btnType == 'Complete' && validQuestion(pageNode))
    {
        // 결과를 넣자..
        var pageSetNode = pageNode.parentNode;
        makeResultJson(pageSetNode);

        console.log('완료');
    }
}

function makeResultJson( pageSetNode ){
    var questions = pageSetNode.getElementsByClassName('question');
    var resultJson = {};
    var answer = [];

    for(p in questions)
    {
        if(questions.hasOwnProperty(p))
        {
            var itemNodes = questions[p].getElementsByClassName('items')[0];
            var itemSet = itemNodes.childNodes[0];
            var questionId = questions[p].getAttribute('id');

            switch(itemSet.className)
            {
                case 'text_set':
                case 'comment_set':
                    var textCss = itemSet.className == 'text_set' ? 'i_text' : 'i_comment';
                    var elText = cdom.getcss(itemSet, textCss ,0);
                    if(elText.element.value != '')
                    {
                        var textResult = {};
                        textResult[questionId] = elText.element.value;
                        answer.push(textResult);
                    }    
                break;
                case 'radio_set':
                    var elRadio = itemNodes.getElementsByTagName('input');
                            
                    var checkedItem = [].filter.call(elRadio, function( el ) {
                        return el.checked;
                    });

                    if(checkedItem.length == 1)
                    {
                        var radioResult = {};
                        radioResult[questionId] = checkedItem[0].value;
                        
                        if(checkedItem[0].id == questionId + '_other' )
                        {
                            var otherTextValue = itemNodes.getElementsByClassName('txt_radio_other')[0].value;
                            radioResult[checkedItem[0].value] = otherTextValue;
                        }
                        answer.push(radioResult);
                    }
                break;

                case 'checkbox_set':
                    var elCheck = itemNodes.getElementsByTagName('input');
                    var checkedItem = [].filter.call(elCheck, function( el ) {
                        return el.checked;
                    });
                    
                    var checkResult = {};
                    var checkValue = [];
                    for(var i = 0; checkedItem.length > i; i++ )
                    {
                        checkValue.push(checkedItem[i].value);
                    }
                    checkResult[questionId] = checkValue;

                    var checkedOther = [].filter.call(checkedItem, function( el ) {
                        return el.id == questionId + '_other';
                    });

                    if(checkedOther.length > 0)
                    {
                        var otherText = itemNodes.getElementsByClassName('txt_checkbox_other')[0];
                        checkResult[checkedOther[0].value] = otherText.value;
                    }

                    answer.push(checkResult);
                break;

                case 'rate_set':
                    var elRate = itemNodes.getElementsByTagName('input');
                    var checkedItem = [].filter.call(elRate, function( el ) {
                        return el.checked;
                    });

                    if(checkedItem.length > 0)
                    {
                        var rateResult = {};
                        rateResult[questionId] = checkedItem[0].value;
                        answer.push(rateResult);
                    }
                break;

                case 'multiText_set':
                    var elmultiText = itemNodes.getElementsByTagName('input');
                    var textItem = [].filter.call(elmultiText, function( el ) {
                        return el.value != '';
                    });

                    if(textItem.length > 0)
                    {
                        var multiTextResult = {};
                        var textValue = {};
                        for(var i = 0; textItem.length > i; i ++)
                        {
                            textValue[textItem[i].getAttribute('id')] = textItem[i].value;
                        }
                        multiTextResult[questionId] = textValue;
                        answer.push(multiTextResult);
                    }
                break;
            }
        }
    }
    
    resultJson.answer = answer;
    var link = document.location.pathname; 

    if(link == '/survey/Progress')
    {
        
        surveyInfo.sendReuslt(resultJson);
        alert("Save");
    }else
    {
        alert(JSON.stringify(resultJson));
    }

    
    
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
        
        parseSurvey = JSON.parse(surveyInfo.strSurvey);

        console.log(surveyInfo);

        var surveyJson = parseSurvey.survey == undefined ? parseSurvey : parseSurvey.survey;

        if(('pages' in surveyJson) && ('title' in surveyJson))
        {
            // Create Survey 
            var elSurvey = createSurveySet();

            // Survey Title
            if('title' in surveyJson)
                cdom.getcss(elSurvey,'title',0).text(surveyJson.title);

            // if('description' in surveyJson.survey)
            //     cdom.getcss(elSurvey,'description',0).inhtml(surveyJson.survey.description.replace(/(?:\r\n|\r|\n)/g,'<br />')).addcss('line');

            // Survey Page
            var pages  = surveyJson.pages;
            var questionNumber = 1;
            console.log(pages);
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
                    if('description' in pages[p] && pages[p].description != '' )
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
