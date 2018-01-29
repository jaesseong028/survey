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

// 질문 텍스트 엘리먼트 생성
function createQT(data){
    var elDiv = document.createElement('div');
    var elLabel = document.createElement('label');
    elLabel.innerHTML = data.title;
    elDiv.appendChild(elLabel);
    return elDiv;
}

// 질문 보기 텍스트 엘리먼트 생성
function createQA(data , name ,type)
{
    var elLbl = document.createElement('label');
    elLbl.setAttribute('for', name);
    
    var nodeText = document.createTextNode(data);
    elLbl.appendChild(nodeText);

    return elLbl;
}


// 라디오, 체크 박스 엘리먼트 생성 생성
function createCheckRadio ( data, type){
    var type = data.type == 'radiogroup' ? 'radio'  : 'checkbox';
    
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
            elDiv.appendChild(createQA(data.choices[choice], data.name + choice, type));
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
        elDiv.appendChild(elText);
    }else  // 멀티 텍스트
    {
        var elMText = document.createElement('textarea');
        elMText.setAttribute('id', data.name);
        elDiv.appendChild(elMText);
    }

    return elDiv;
}

//질문 별 문제 생성
function createQuestion( elements, elDivPage){
    for(var element in elements)
    {
        if(elements.hasOwnProperty(element))
        {
            var surveyElement = elements[element];
            elDivPage.appendChild(createQT(surveyElement));

            // 라디오, 체크 박스
            if(surveyElement.type === 'radiogroup' || surveyElement.type === 'checkbox')
                elDivPage.appendChild(createCheckRadio(surveyElement));
            
            // 단일텍스트, 멀티 텍스트
            else if(surveyElement.type === 'text' || surveyElement.type === 'textarea')
                elDivPage.appendChild(createText(surveyElement));
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
        var pages  = surveyJson.pages;

        for(var page in pages)
        {
            if(pages.hasOwnProperty(page))
            {
                var elements = surveyJson.pages[page].elements;
                
                // 페이지 별 DIV ID 생성
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


    }catch(e){

        alert(e);
        console.log(e);

    }
}

    
//})();