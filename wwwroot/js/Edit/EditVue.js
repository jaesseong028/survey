Vue.directive('sortable', {
    inserted: function (el, binding) {
        new Sortable(el, binding.value || {})
    }
})

var EventBus = new Vue();
var vue = new Vue({
    template : '\
    <div class="container-fluid text-center">\
        <template v-if="NotiMessage != GlobalValues.emptyString">\
            <div>{{NotiMessage}}</div>\
        </template>\
        <template v-else-if="NotiMessage == GlobalValues.emptyString">\
            <div class="row logo-container">\
                <div class="col-sm-10 text-left survey-title">\
                    <span>{{survey.title}}</span>\
                </div>\
                <div class="col-xs-2">\
                    <label class="btn btn-success" v-on:click=save> 저장 </label>\
                    <label class="btn btn-info" v-on:click=prev>미리보기</label>\
                </div>\
            </div>\
            <div class="row">\
                <div class="col-sm-12" style="background-color:#4EB6F6; height:40px">\
                </div>\
            </div>\
            <form id="myform" name="myform" method="post" action="/edit/prev" target="popup_window">\
                <input type="hidden" id="surveyJson" name="survey" value="" />\
            </form>\
            <form id="saveform" name="myform" method="post">\
                <input type="hidden" id="saveSurveyJson" name="survey" value="" />\
            </form>\
            <div class="content">\
                <div class="col-sm-2 leftnav">\
                    <leftnav-com></leftnav-com>\
                </div>\
                <div class="col-sm-8 controlContainer text-left">\
                    <tab-page-com :survey=survey :skipQuestions=skipQuestions :settings=settings :select-page=selectPage></tab-page-com>\
                </div>\
                <div class="col-sm-2 rightnav">\
                    <settinglayout-com :settings=settings></settinglayout-com>\
                    <!--{{survey|pretty}}-->\
                </div>\
            </div>\
            <modallayout-com></modallayout-com>\
        </template>\
    </div>',
    el: '#container',
    data: {
        template: '',
        selectPage : null,
        settings : null,
        layerPopupOpened : false,
        layerPostObj : null,
        NotiMessage : '',
        qustionLastNameIndex : 1,
        focusedQeustionName : '', // 
        survey: {
            title : '',
            pages: [ 
                { name: "page1", elements: [] }
            ]
        } ,
    },
    methods: {
        prev : function(){
            window.open("", "popup_window", "width=800, height=900, scrollbars=no");
            var s = this.getCleanSurveyValue();    
            $("#surveyJson").val(JSON.stringify(s));
            $("#myform").submit();
        },
        getCleanSurveyValue : function(){
            var copySurvey = JSON.parse(JSON.stringify(this.survey));
            for (var p=0; p < copySurvey.pages.length; p++) {
                for (var e=0; e <copySurvey.pages[p].elements.length; e++) {
                    if (copySurvey.pages[p].elements[e].type == this.GlobalValues.control.checkbox || copySurvey.pages[p].elements[e].type == this.GlobalValues.control.multiText) {
                        copySurvey.pages[p].elements[e].value = [];
                    }
                    else {
                        copySurvey.pages[p].elements[e].value = null;
                    }
                }
            }
            var s = { survey : copySurvey };
            return s;
        },
        save : function(){
            var s = this.getCleanSurveyValue();    
            $("#saveSurveyJson").val(JSON.stringify(s));
            $("#saveform").submit();
        },
        getQueryString : function(key){
            return decodeURIComponent(window.location.search.replace(new RegExp("^(?:.*[&\\?]" + encodeURIComponent(key).replace(/[\.\+\*]/g, "\\$&") + "(?:\\=([^&]*))?)?.*$", "i"), "$1"));  
        },
        getSurvey : function(){
            var self = this;
            var surveryID = this.getQueryString('surveyid');
            var channelID = this.getQueryString('channelid');
            var retUrl = this.getQueryString('retUrl');
            if (retUrl) {
                $("#saveform").attr('action', retUrl);
            }else{
                self.NotiMessage = '잘못된 데이터 입니다. : retUrl 파라미터가 존재 하지 않습니다.';
                return;
            }

            if (surveryID && channelID) {
                $.ajax({
                    type : 'POST',
                    url : '/api/survey/GetSurvey',
                    //data : JSON.stringify({'channelID' : channelID}),
                    data : JSON.stringify({'channelID' : channelID, 'surveyID' : surveryID}),
                    contentType: 'application/json',
                    success : function (res) {
                        if (!res.success) {
                            self.NotiMessage = res.message;
                        } else {
                            vue.$nextTick(function() {
                                if (res.data.survey != null) {
                                    self.survey = res.data.survey;
                                    self.qustionLastNameIndex = self.getMaxQustions();
                                    self.selectPage = self.survey.pages[0];
                                    self.settings = self.survey.pages[0];
                                }
                            });
                        }           
                    }, 
                    error: function(XMLHttpRequest, textStatus, errorThrown) { 
                        alert("Status: " + textStatus); alert("Error: " + errorThrown); 
                    }   
                });
                
            }
        },
        changedPage : function (index) {
            this.selectPage = this.survey.pages[index];
            this.settings = this.survey.pages[index];
        },
        surveyinfo : function(survey) {
            this.settings = survey;
            //vue.$set(this, 'settings', survey);
        },
        deleteSetting : function() {
            var pageDeleteAction = "elements" in this.settings && this.selectPage != null;
            var surveyDeleteAction = "type" in this.settings && this.selectPage != null;
            var confirmFuc = function (type) { 
                return confirm('해당 ' + type + ' 삭제 하시겠습니까?');
            }
            if (pageDeleteAction) {
                if(this.survey.pages.length == 1) {
                    alert('최소 한개의 페이지는 존재해야 합니다.');
                    return;
                }
                if (!confirmFuc('페이지를')){
                    return;
                }
                var idx = _.findIndex(this.survey.pages, this.settings);
                if(idx != -1) {
                    this.survey.pages.splice(idx, 1);
                    if (idx == this.survey.pages.length) {
                        --idx;
                    }

                    this.selectPage = this.survey.pages[idx];
                    this.settings = this.survey.pages[idx];
                }
            }

            if (surveyDeleteAction){
                if (!confirmFuc('설문을')){
                    return;
                }
                var idx = _.findIndex(this.selectPage.elements, this.settings);
                if(idx != -1) {
                    this.selectPage.elements.splice(idx, 1);
                    if (idx == this.selectPage.elements.length) {
                        --idx;
                    }
                    this.settings = this.selectPage.elements[idx];
                }
            }
        },
        addsurvey: function (type) {
            var questionName = this.emptyName(this.GlobalValues.question);
            var item = { name: questionName, type: type, title: questionName, description: "", is_required : true, value : null};
            if (type == this.GlobalValues.control.checkbox || type == this.GlobalValues.control.radio) {
                item.choices = ["item1", "item2", "item3"];
                item.skip = [];
            }

            if (type == this.GlobalValues.control.checkbox) {
                item.value = [];
            }

            if (type == this.GlobalValues.control.multiText) {
                item.items = [{item : 'item1', is_required : true}, {item : 'item2', is_required : true}, {item : 'item3', is_required : true}];
                item.value = [];
            }

            if (type == this.GlobalValues.control.rate) {
                item.choices = [1, 2, 3, 4, 5];
                item.max_description = "높음";
                item.min_description = "낮음";
            }

            if (type == this.GlobalValues.control.comment) { 
                item.rows = 5;
            }

            this.selectPage.elements.push(item);
            this.settings = item;
            
            var activetab = $(this.$el).find(".tabs input:radio:checked").siblings(".tab-container");    
            activetab.animate({ scrollTop: activetab.prop("scrollHeight")}, 100);
        }, 
        edit : function (el) {
            this.settings = el;
        },
        getMaxQustions : function(){
            var arr = [];
            for (var p=0; p < this.survey.pages.length; p++) {
                for (var e=0; e<this.survey.pages[p].elements.length; e++) {
                    var i = parseInt(this.survey.pages[p].elements[e].name.toLowerCase().replace(this.GlobalValues.question.toLowerCase(), ""));
                    arr.push(i);
                }
            }

            if (arr.length == 0) {
                return 1;
            }

            return  Math.max.apply(null, arr) + 1;
        },
        emptyName : function(subOtType) {

            if (subOtType == this.GlobalValues.question) {
                return this.GlobalValues.question + (this.qustionLastNameIndex++);
            }
            var arr = [];
            var inc = 0;

            var putInArray = function(ar, n, t) {
                var i = parseInt(n.replace(t, ""));
                if (!isNaN(i)) {
                    ar.push(i);
                }
            }
            
            for (var p=0; p < this.survey.pages.length; p++) {
                if (subOtType == this.GlobalValues.page) {
                    putInArray(arr, this.survey.pages[p].name, subOtType);
                }
            }

            if (arr.length == 0)
                return subOtType + "1";

            Array.prototype.diff = function(a) {
                return this.filter(function(i) {return a.indexOf(i) < 0;});
            };
            var last = Math.max.apply(null, arr) + 1;
            
            var arr1 = _.range(1, last + 1);
            var diff = arr1.diff(arr);
            var value = Math.min.apply(null, diff);

            return subOtType + value; 
        }
    }, filters: {
        pretty: function (value) {
            return JSON.stringify(value, null, 2);
        }
    }, 
    updated  : function() {
        // if (('localStorage' in window) && window['localStorage'] != null){
        //     localStorage.setItem('survey', JSON.stringify(this.survey));
        // }
    },
    computed : {
        skipQuestions : function (){ 
            var s = this.$root.survey;
            var containVal = false;
            var skip_Questions = [];
            for (var p=0; p < s.pages.length; p++) {
                for (var e=0; e <s.pages[p].elements.length; e++) {
                    if ('skip' in s.pages[p].elements[e]) {
                        if (s.pages[p].elements[e].value instanceof Array) {
                            for (var i = 0; i < s.pages[p].elements[e].value.length; i++) {
                                var skipQues = _.find(s.pages[p].elements[e].skip, function(sq){ return sq.choice == s.pages[p].elements[e].value[i]}); 
                                if (skipQues != undefined) {
                                    for(var sm = 0; sm < skipQues.skipQuestionNames.length; sm++){
                                        skip_Questions.push(skipQues.skipQuestionNames[sm]);
                                    }
                                }
                            }
                        } else {
                            var skipQues = _.find(s.pages[p].elements[e].skip, function(sq){ return sq.choice == s.pages[p].elements[e].value}); 
                            if (skipQues != undefined) {
                                for(var sm = 0; sm < skipQues.skipQuestionNames.length; sm++){
                                        skip_Questions.push(skipQues.skipQuestionNames[sm]);
                                    }
                                }
                            }
                    }
                }
            }
            return skip_Questions;
        }
    },
    mounted  : function() {
        this.$nextTick(function() {
            this.getSurvey();
            // if (('localStorage' in window) && window['localStorage'] != null) {
            //     var data = JSON.parse(localStorage.getItem('survey'));
            //     if(data != null)
            //         this.survey = JSON.parse(localStorage.getItem('survey'));
            // }
            
            this.qustionLastNameIndex = this.getMaxQustions();
            this.selectPage = this.survey.pages[0];
            this.settings = this.survey.pages[0];
            
            $("#container").show();
        });

    },
    created : function() {
        EventBus.$on('edit', this.edit);
    }, 
    watch : {
        
    }
});