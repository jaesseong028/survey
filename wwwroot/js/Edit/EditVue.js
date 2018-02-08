var EventBus = new Vue();
var vue = new Vue({
    template : '\
<div class="container-fluid text-center">\
    <div class="row logo-container" style="margin-top:-10px;">\
        <h2><label class="col-md-3 text-right">{{survey.logo_text}}</label></h2>\
        <h4><div class="col-md-9 text-left">{{survey.title}}</div></h4>\
    </div>\
    <div class="row content">\
        <div class="col-sm-2 sidenav leftnav">\
            <leftnav-com></leftnav-com>\
        </div>\
        <div class="col-sm-7 text-left">\
            <tab-page-com :survey=survey :settings=settings :select-page=selectPage></tab-page-com>\
        </div>\
        <div class="col-sm-3 sidenav">\
            <settinglayout-com :settings=settings></settinglayout-com>\
            {{$data|pretty}}\
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
        survey: {
            //title: "",
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
        keywatch : function(evt) {
            var canAction = function () { return ("type" in this.settings) && this.selectPage != null; };
            if (evt.key == 'Delete' || evt.key == 'Del') {
                if (canAction) {
                    var idx = _.findIndex(this.selectPage.elements, this.settings);
                    if(idx != -1) {
                        this.selectPage.elements.splice(idx, 1);
                        if (idx == this.selectPage.elements.length) {
                            --idx;
                        }
                        this.settings = this.selectPage.elements[idx];
                    }
                }
            }
        },
        addsurvey: function (type) {
            var questionName = this.emptyName(this.GlobalValues.question);
            var item = { name: questionName, type: type, title: questionName, description: "", is_required : true, value : null};
            if (type == this.GlobalValues.control.checkbox || type == this.GlobalValues.control.radio) {
                item.choices = ["item1", "item2", "item3"];
            }

            if (type == this.GlobalValues.control.checkbox) {
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
        window.addEventListener('keyup', this.keywatch);
    }, 
    watch : {
        
    }
});