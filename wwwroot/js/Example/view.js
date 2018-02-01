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


//줄 바꿈 엘리먼트 생성
function createBRtag(){
    var elBrtag = document.createElement('br');
    return elBrtag;
}

function createPtag(){
    var elPtag = document.createElement('p');
    return elPtag;
}

// 질문 텍스트 엘리먼트 생성
function createQT(data){

    // Question DIV
    var elDiv = document.createElement('div');
    elDiv.setAttribute('class','question');

    // Title Label
    var elLabel = document.createElement('label');
    elLabel.setAttribute('class','title');

    // 필수 확인
    if('is_required' in data)
    {
        var elRequired = document.createElement('strong');
        elRequired.innerText = '*';
        elDiv.appendChild(elRequired);
    }

    elLabel.innerText = data.title;
    
    elDiv.appendChild(elLabel);
    elDiv.appendChild(createBRtag());

    //Description 
    if('description' in data)
    {
        var elDescription = document.createElement('label');
        elDescription.innerText = data.description;
        elDescription.setAttribute('class','description');
        elDiv.appendChild(elDescription);
    }

    return elDiv;
}

// 질문 보기 텍스트 엘리먼트 생성
function createQA(data , name)
{
    var elLbl = document.createElement('label');
    elLbl.setAttribute('for', name);
    
    var nodeText = document.createTextNode(data);
    elLbl.appendChild(nodeText);

    return elLbl;
}


// 라디오, 체크 박스 엘리먼트 생성 생성
function createCheckRadio ( data, type){
    var type = data.type == 'radio' ? data.type : 'checkbox';
    
    var elDiv = document.createElement('div');
    
    for(var choice in data.choices)
    {
        if(data.choices.hasOwnProperty(choice))
        {
            var elCR = document.createElement('input');
            elCR.setAttribute('type', type);
            elCR.setAttribute('id', data.name + choice);
            elCR.setAttribute('value', data.choices[choice]);

            if(type === 'radio')
                elCR.setAttribute('name', data.name);

            elDiv.appendChild(elCR);
            elDiv.appendChild(createQA(data.choices[choice], data.name + choice));
        }
    }
    return elDiv;
}

//텍스트 엘리먼트 생성
function createText( data ){
    var elDiv = document.createElement('div');

    if(data.type === 'text')    // 단일 텍스트
    {
        var elText = document.createElement('input');
        elText.setAttribute('type', 'text');
        elText.setAttribute('id', data.name);
        
        if('max_len' in data )
            elText.setAttribute('maxLength',data.max_len);

        elDiv.appendChild(elText);

    }else  // 멀티 텍스트
    {
        var elMText = document.createElement('textarea');
        elMText.setAttribute('id', data.name);
        elMText.setAttribute('rows',5);
        elMText.setAttribute('cols',30);
        elMText.setAttribute('maxLength',30);
        elDiv.appendChild(elMText);
    }
    
    return elDiv;
}

//등급 엘리먼트 생성
function createRate( data ){
    var elDiv = document.createElement('div');
    elDiv.setAttribute('class','rate');

    if('min_description' in data)
    {
        var elMinlbl = document.createElement('label');
        elMinlbl.setAttribute('class','rate_min');
        elMinlbl.innerText = data.min_description;
        elDiv.appendChild(elMinlbl);
    }
        
    for(var choice in data.choices)
    {
        if(data.choices.hasOwnProperty(choice))
        {
            var elRate = document.createElement('input');
            elRate.setAttribute('type', 'radio');
            elRate.setAttribute('id', data.name + choice);
            elRate.setAttribute('value', data.choices[choice]);
            elRate.setAttribute('name', data.name);
            
            elDiv.appendChild(elRate);
            elDiv.appendChild(createQA(data.choices[choice], data.name + choice));
        }
    }

    if('max_description' in data)
    {
        var elMaxlbl = document.createElement('label');
        elMaxlbl.setAttribute('class','rate_max');
        elMaxlbl.innerText = data.max_description;
        elDiv.appendChild(elMaxlbl);
    }
        
    return elDiv;
}

//질문 별 문제 생성
function createQuestion( elements, elDivPage){
    for(var element in elements)
    {
        if(elements.hasOwnProperty(element))
        {
            var elFieldset = document.createElement('fieldset');

            var surveyElement = elements[element];
            elFieldset.appendChild(createQT(surveyElement));

            // 라디오, 체크 박스
            if(surveyElement.type === 'radio' || surveyElement.type === 'checkbox')
                elFieldset.appendChild(createCheckRadio(surveyElement));
            // 단일텍스트, 멀티 텍스트
            else if(surveyElement.type === 'text' || surveyElement.type === 'comment')
                elFieldset.appendChild(createText(surveyElement));
            // 등급
            else if(surveyElement.type === 'rate')
                elFieldset.appendChild(createRate(surveyElement));

            elDivPage.appendChild(elFieldset);
        }
    }

    

    return elDivPage;
}

// 페이지 보이기
function isVisiblePage(elDivPage, isShow)
{
    elDivPage.setAttribute('class',isShow == true ? 'pageshow': 'pagehide');
}


// 페이지 이동 및 완료 버튼
function createPageBtn(elDivPage, totalPage, currPage )
{
    // 페이지 별 이전, 다음 버튼 추가
    if(totalPage == 1) // 페이지가 존재하지 않음 
    {
        addBtnEvent(elDivPage,'Complete');
    }
    else if(totalPage - 1 == currPage)  // 마지막 페이지 일 경우 이전 버튼과 완료 버튼
    {
        addBtnEvent(elDivPage,'Pre');
        addBtnEvent(elDivPage,'Complete');
    }
    else if(totalPage > 1 && currPage == 0) // 페이지가 있으며 첫번째 페이지
    {
        addBtnEvent(elDivPage,'After');
    }
    else if(totalPage > 1 && currPage > 0) // 페이지가 있으며 중간 페이지
    {
        addBtnEvent(elDivPage,'Pre');
        addBtnEvent(elDivPage,'After');
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

function pageMove(){
    //이동
    
}

function domReady (){
    try
    {
        console.log(survey);
        var surveyJson = JSON.parse(survey);
        console.log(surveyJson);

        var surveyId = document.getElementById('ubSurvey');

        if( ('survey' in surveyJson) && ('pages' in surveyJson.survey[0]) && ('title' in surveyJson.survey[0]))
        {
            
            var surveyTitle = surveyJson.title;
            var pages  = surveyJson.survey[0].pages;
            console.log(pages);

            for(var page in pages)
            {
                console.log('elements',pages[page].elements);
                if(pages.hasOwnProperty(page))
                {
                    var elements = pages[page].elements;
                    
                    console.log(elements);
                    // // 페이지 별 DIV ID 생성
                    var elDivPage = document.createElement('div');
                    elDivPage.setAttribute('id',pages[page].name);
                    
                    if(page == 0)   // 첫페이지는 무조건 보이기
                        isVisiblePage(elDivPage,true);
                    else
                        isVisiblePage(elDivPage,false);

                    surveyId.appendChild(createQuestion(elements, elDivPage ));

                    createPageBtn(elDivPage, pages.length, page);
                    
                }
            }
        }

    }catch(e){

        alert(e);
        console.log(e);

    }
}

    
//})();