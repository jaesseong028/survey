var EventBus = new Vue();
var vue = new Vue({
    template : '\
<div class="container-fluid text-center">\
    <div class="row logo-container">\
        <h2><label class="col-sm-2 text-right">{{survey.logo_text}}</label></h2>\
        <h4><div class="col-sm-7 text-left">{{survey.title}}</div></h4>\
        <div style="padding-top:20px; padding-left:-20px" class="col-sm-3 text-left">\
            <label class="btn btn-success"> 저장 </label>\
            <label class="btn btn-info">미리보기</label>\
        </div>\
    </div>\
    <div class="row content">\
        <div class="col-sm-1 sidenav leftnav">\
            <leftnav-com></leftnav-com>\
        </div>\
        <div class="col-sm-9 text-left">\
            <tab-page-com :survey=survey :skipQuestions=skipQuestions :settings=settings :select-page=selectPage></tab-page-com>\
        </div>\
        <div class="col-sm-2 sidenav">\
            <settinglayout-com :settings=settings></settinglayout-com>\
            <!--{{survey|pretty}}-->\
        </div>\
    </div>\
    <modallayout-com></modallayout-com>\
</div>',
    el: '#container',
    data: {
        template: '',
        selectPage : null,
        settings : null,
        layerPopupOpened : false,
        layerPostObj : null,
        focusedQeustionName : '', // 
        survey: {
            description : "",
            background_color: "",
            font_color: "",
            logo_text: "",
            logo_background_color: "",
            logo_font_color: "",
            pages: [ 
                { name: "page1", elements: [] }
            ]
        },
    },
    methods: {
        changedPage : function (index) {
            this.selectPage = this.survey.pages[index];
            this.settings = this.survey.pages[index];
        },
        surveyinfo : function(survey) {
            this.settings = survey;
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
                item.skip = {"choices":[], "skipQuestionNames":[] };
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
        emptyName : function(subOtType) {
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
                if (subOtType == this.GlobalValues.question) {
                    for (var e=0; e<this.survey.pages[p].elements.length; e++) {
                        putInArray(arr, this.survey.pages[p].elements[e].name, subOtType);
                    }
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
        if (('localStorage' in window) && window['localStorage'] != null){
            localStorage.setItem('survey', JSON.stringify(this.survey));
        }
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
                                if (s.pages[p].elements[e].skip.choices.indexOf(s.pages[p].elements[e].value[i]) > -1) {
                                    //"skip" :[{"choice" : "예", "skipQuestionNames":["question3"]}, {"choice" : "아니오", "skipQuestionNames":["question4", "question5"]}],



                                    // for(var sm = 0; sm < s.pages[p].elements[e].skip.skipQuestionNames.length; sm++){
                                    //     if(skip_Questions.indexOf(s.pages[p].elements[e].skip.skipQuestionNames[sm]) == -1){
                                    //         skip_Questions.push(s.pages[p].elements[e].skip.skipQuestionNames[sm]);
                                    //     }
                                    // }
                                }
                            }
                        } else {
                            if (s.pages[p].elements[e].skip.choices.indexOf(s.pages[p].elements[e].value) > -1) {
                                // for(var sm = 0; sm < s.pages[p].elements[e].skip.skipQuestionNames.length; sm++){
                                //     if(skip_Questions.indexOf(s.pages[p].elements[e].skip.skipQuestionNames[sm]) == -1){
                                //         skip_Questions.push(s.pages[p].elements[e].skip.skipQuestionNames[sm]);
                                //     }
                                // }
                            }
                        }
                    }
                }
            }
            return skip_Questions;
        }
    },
    mounted  : function() {
        if (('localStorage' in window) && window['localStorage'] != null) {
            var data = JSON.parse(localStorage.getItem('survey'));
            if(data != null)
                this.survey = JSON.parse(localStorage.getItem('survey'));
        }
        
        this.selectPage = this.survey.pages[0];
        this.settings = this.survey.pages[0];
        $("#container").show();
    },
    created : function() {
        EventBus.$on('edit', this.edit);
    }, 
    watch : {
        
    }
});