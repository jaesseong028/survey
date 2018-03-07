var methods = {
    col_style : function() {
        var style = { width : '', display : '' };
        if (this.el.col_count !== undefined && this.el.col_count !== 1) {
            style.width = (100 / this.el.col_count) + '%';
            style.display = 'inline-block';
        }
        return style;
    }, disabled : function () {
        if (this.el.value instanceof Array) {
            if (this.el.max_num < this.el.min_num) {
                return false;
            }else {
                var v = this.choice || this.el.other_text;
                return this.el.value.length >= this.el.max_num && this.el.value.length >= this.el.min_num && this.el.value.indexOf(v) === -1;
            }
        }
        return false;
    },
    uid : function() { 
        return this.el.name + "_" + this._uid;
    }, 
    readonly : function() {
        var is_readonly = false;
        if (this.el.value instanceof Array) {
            is_readonly = this.el.value.indexOf(this.el.other_text) === -1;
        }else{
            is_readonly =  this.el.value !== this.el.other_text;
        }
        if(is_readonly) {
            this.el.other_text_value = '';
        }
        return is_readonly;  
    },
    textWidth : function() {
        if (this.el.other_text_width) {
            return this.el.other_text_width;
        } 
        else if (this.el.text_width) {
            return this.el.text_width;
        } 
    }, 
    convertHtml : function(desc){            
        if(desc)
            return desc.replace(/(?:\r\n|\r|\n)/g, "<br>");
        return '';
    }
}

Vue.component('tab-page-com', {
    template : '{{radioGroup}}\
    <div class="tabs">\
        <div>\
            <div class="tab">\
                <input type="radio" id="surveyID" name="tabgroup" class="tabgroup" v-on:click="surveyinfo" :checked="survey === settings" />\
                <label class="labelfor cur" v-bind:class="{setting: survey === settings}" for="surveyID">설문설정<span v-bind:class="{sel: survey === settings}"  class="glyphicon glyphicon-cog icon"></span> </label>\
                <div class="tab-container"></div>\
            </div>\
        </div>\
        <div v-for="(page, index) in survey.pages">\
            <div class="tab">\
                <input type="radio" :id="getPageID(page.name, index)" name="tabgroup" class="tabgroup" v-on:click="changedPage(index)" :checked="page === selectPage" />\
                <label class="labelfor cur" v-bind:class="{setting: page === selectPage}" :for="getPageID(page.name, index)">{{page.name}}<span v-bind:class="{sel: page === selectPage}" class="glyphicon glyphicon-cog icon"></span> </label>\
                <label class="plus cur" v-if="index == survey.pages.length - 1" v-on:click="appendPage(index + 1)">+</label>\
                <div class="tab-container">\
                    <div class="row" v-if="page.title || page.description">\
                        <label v-if="page.title" class="col-sm-12 text-left page-title">{{page.title}}</label>\
                        <label v-if="page.description" class="col-sm-12 text-left page-desc" v-html="convertHtml(page.description)"></label>\
                    </div>\
                    <controllayout-com  :skipQuestions=skipQuestions :elements=page.elements :settings=settings></controllayout-com>\
                </div>\
            </div>\
        </div>\
    </div>',
    data: function () { return { } },
    props: { survey: { type: Object }, settings : { type: Object }, selectPage : {type : Object }, skipQuestions: {type : Array}},
    methods : {
        changedPage : function (index) {
            this.$parent.changedPage(index);
        },
        surveyinfo : function() {
            this.$parent.changedPage(-1);
            this.$parent.surveyinfo(this.survey);
        },
        appendPage : function(index) {
            if(this.survey.pages.length + 1 > this.GlobalValues.maxCreatePage){
                alert('최대 ' + this.GlobalValues.maxCreatePage + '개까지 가능합니다.');
                return;
            }
            var papgName = this.$parent.emptyName(this.GlobalValues.page);

            this.survey.pages.push({ name: papgName, elements: [] });
            this.changedPage(index);
        }, 
        getPageID : function(name, index){
            return name + '_' + index;
        },
        convertHtml : this.methods.convertHtml,
    }
});


Vue.component('leftnav-com', {
    template : '\
    <span>\
        <p><label class="cur" v-on:click=addsurvey(GlobalValues.control.checkbox)><span class="glyphicon glyphicon-check left-icon"></span>체크박스</label></p>\
        <p><label class="cur" v-on:click=addsurvey(GlobalValues.control.radio)><span class="glyphicon glyphicon-record left-icon"></span> 라디오박스 </label></p>\
        <p><label class="cur" v-on:click=addsurvey(GlobalValues.control.text)><span class="glyphicon glyphicon-text-background left-icon"></span> 텍스트</label></p>\
        <p><label class="cur" v-on:click=addsurvey(GlobalValues.control.comment)><span class="glyphicon glyphicon-superscript left-icon"></span> 코멘트</label></p>\
        <p><label class="cur" v-on:click=addsurvey(GlobalValues.control.rate)><span class="glyphicon glyphicon-indent-left left-icon"></span> 등급</label></p>\
        <p><label class="cur" v-on:click=addsurvey(GlobalValues.control.multiText)><span class="glyphicon glyphicon-th-list left-icon"></span> 멀티텍스트</label></p>\
    </span>',
    methods : {
        addsurvey : function (type) {
            this.$parent.addsurvey(type);
        }
    }
});

//
Vue.component('controllayout-com', {
    template: '\
    <div v-sortable="{onUpdate : onUpdate, animation : 200 }">\
        <div v-for="(el, index) in elements" :key="el.name">\
            <fieldset v-on:click="edit(el)" v-bind:class="{setting: el === settings}">\
                <div class="q-contain" style="" :style="skipStyle(el)">\
                    <label class="question">{{el.title}}</label><span class="required" v-if="el.is_required"> *</span>\
                    <div class="desc" v-show="el.description" v-html="convertHtml(el.description)"></div>\
                    <choice-list-com v-if="el.type === GlobalValues.control.radio || el.type === GlobalValues.control.checkbox" :el=el></choice-list-com>\
                    <text-com v-else-if="el.type === GlobalValues.control.text" :el=el></text-com>\
                    <comment-com v-else-if="el.type === GlobalValues.control.comment" :el=el></comment-com>\
                    <rate-list-com v-else-if="el.type === GlobalValues.control.rate" :el=el></rate-list-com>\
                    <multi-text-com v-else-if="el.type === GlobalValues.control.multiText" :el=el></multi-text-com>\
                    <template v-else/>\
                </div>\
            </fieldset>\
        </div>\
    </div>',
    data : function () { return { dragedHeight : 0, from : 0,  els : [] } },
    props: { elements: { type: Array, required: true }, settings : { type: Object }, skipQuestions : {type : Array}},
    methods :{
        onUpdate: function (e) {
            this.elements.splice(e.newIndex, 0, this.elements.splice(e.oldIndex, 1)[0]);
        },
        skipStyle : function (el) {
            var style = { "opacity": 1, "pointer-events": ''};
            if (this.skipQuestions.indexOf(el.name) > -1){
                style.opacity = 0.3;
                style.pointerEvents = 'none';
            }
            return style;
        },
        edit :  function (el) {
            EventBus.$emit('edit', el);
        }, 
        convertHtml : this.methods.convertHtml,
    }
})

Vue.component('choice-list-com', {
    template: '\
    <div>\
        <template v-for="(choice, index) in el.choices">\
            <choice-com :choice=choice :index=index :el=el></check-com>\
        </template>\<template>\<div v-if="el.is_other" :style="col_style">\
                <input :type=el.type :name=el.name :id=uid :value=el.other_text :disabled=disabled v-model=el.value />\
                <label :for="uid">{{el.other_text}}</label>\
                <input type="text" :maxlength="el.other_text_len" :size="textWidth" v-model=el.other_text_value :readonly=readonly class="form-control non-width"  />\
            </div>\
        </template>\
    </div>',
    data: function () { return { } },
    props: { el: { type: Object, required: true }},
    computed : {
        disabled : this.methods.disabled,
        uid : this.methods.uid,
        col_style : this.methods.col_style,
        readonly  : this.methods.readonly,
        textWidth : this.methods.textWidth,
    }
})

Vue.component('rate-list-com', {
    template: '\
    <div>\
        <template v-if="el.min_description !== undefined">\
            <label class="rate_min">{{el.min_description}}</label>\
        </template>\
        <template v-for="(choice, index) in el.choices">\
            <rate-com :el=el :choice=choice></rate-com>\
        </template>\
        <template v-if="el.max_description !== undefined">\
        <label class="rate_max">{{el.max_description}}</label>\
        </template>\
    </div>',
    props: { el: { type: Object, required: true }},
})



Vue.component('rate-com', {
    template: '\
<div class="rate">\
    <input :value=choice type="radio" :name=el.name :id=uid v-model=el.value />\
    <button class="btn btn-default" :for=uid>{{choice}}</button>\
</div>',
    //gs : [mixin],
    props: { el: { type: Object, required: true }, choice : { type :  Number}},
    computed : {
        uid : this.methods.uid,
    }
})


Vue.component('choice-com', {
    template: '\
    <div :style="col_style">\
        <input :value=choice :disabled=disabled :type=el.type :name=el.name :id=uid v-model=el.value />\
        <label :for="uid">{{choice}}</label>\
    </div>',
    props: { el: { type: Object, required: true }, choice: { type: String, required: true }, index : { type : Number, required: true }},
    computed : {
        disabled : this.methods.disabled,
        uid : this.methods.uid,
        col_style : this.methods.col_style,
    }
})

Vue.component('comment-com', {
    template: '\
    <div>\
        <textarea type=text :name=el.name :rows=el.rows :id=uid v-model=el.value class="form-control"></textarea>\
    </div>',
    props: { el: { type: Object, required: true }},
    computed : {
        uid : this.methods.uid,
    }
})

Vue.component('text-com', {
    template: '\
    <div>\
        <input type="text" :name=el.name :id="uid" :maxlength="el.max_len" v-model=el.value class="form-control"/></template>\
    </div>',    
    props: { el: { type: Object, required: true }},
    computed :{
        uid : this.methods.uid,
    }
})


Vue.component('multi-text-com', {
    template: '\
    <div>\
        <template v-for="(item, i) in el.items">\
            <div :style="col_style">\
                <label>{{item.item}}</label>\
                <input type="text" :name=el.name :maxlength="el.max_len" :id="uid" :size="textWidth" v-model="el.value[i]" class="form-control non-width" />\
            </div>\
        </template>\
    </div>',
    props: { el: { type: Object, required: true }},
    computed : {
        textWidth : this.methods.textWidth,
        col_style : this.methods.col_style,
        uid : this.methods.uid,
    }
})