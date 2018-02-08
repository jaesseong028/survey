
Vue.component('tab-page-com', {
    template : '\
    <div class="tabs">\
        <div v-for="(page, index) in survey.pages">\
            <div class="tab">\
                <label class="labelfor survey" v-if="index == 0" v-bind:class="{setting: survey === settings}"  v-on:click="surveyinfo">설문설정 <span v-bind:class="{sel: survey === settings}" class="glyphicon glyphicon-cog"></span></label>\
                <input type="radio" :id="getPageID(page.name, index)" name="tabgroup" class="tabgroup" :checked="page == selectPage"  v-on:click="changedPage(index)">\
                <label class="labelfor" v-bind:class="{setting: page === settings}" :for="getPageID(page.name, index)">{{page.name}} <span v-bind:class="{sel: page === settings}"  class="glyphicon glyphicon-cog"></span> </label>\
                <label class="plus" v-if="index == survey.pages.length - 1" v-on:click="appendPage(index + 1)">+</label>\
                <div class="tab-container">\
                    <controllayout-com :elements=page.elements :settings=settings></controllayout-com>\
                </div>\
            </div>\
        </div>\
    </div>',
    data: function () { return {  } },
    props: { survey: { type: Object }, settings : { type: Object }, selectPage : {type : Object}},
    methods : {
        changedPage : function (index) {
            this.$parent.changedPage(index);
            //EventBus.$emit('changedPage', index);
        },
        surveyinfo : function() {
            this.$parent.surveyinfo(this.survey);
            //EventBus.$emit('surveyinfo', this.survey);
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
        }
    }
});


Vue.component('leftnav-com', {
    template : '\
    <div>\
        <p><label href="#" v-on:click=addsurvey(GlobalValues.control.checkbox)><span class="glyphicon glyphicon-check"></span> 체크박스</label></p>\
        <p><label href="#" v-on:click=addsurvey(GlobalValues.control.radio)><span class="glyphicon glyphicon-record"></span> 라디오박스 </label></p>\
        <p><label href="#" v-on:click=addsurvey(GlobalValues.control.text)><span class="glyphicon glyphicon-text-background"></span> 텍스트</label></p>\
        <p><label href="#" v-on:click=addsurvey(GlobalValues.control.comment)><span class="glyphicon glyphicon-text-background"></span> 코멘트</label></p>\
        <p><label href="#" v-on:click=addsurvey(GlobalValues.control.rate)><span class="glyphicon glyphicon-indent-left"></span> 등급</label></p>\
    </div>',
    methods : {
        addsurvey : function (type) {
            this.$parent.addsurvey(type);
            //EventBus.$emit('addsurvey', type);
        }
    }
});

Vue.component('controllayout-com', {
    template: '\
    <div>\
            <div v-for="(el, index) in elements">\
                <fieldset v-on:click="edit(el)" v-bind:class="{setting: el === settings}">\
                    <label class="required" v-if="el.is_required">* </label><label class="question">{{el.title}}</label>\
                    <div class="desc" v-show="el.description" v-html="convertHtml(el.description)"></div>\
                    <choice-list-com v-if="el.type === GlobalValues.control.radio || el.type === GlobalValues.control.checkbox" :el=el></choice-list-com>\
                    <text-com v-else-if="el.type === GlobalValues.control.text" :el=el></text-com>\
                    <comment-com v-else-if="el.type === GlobalValues.control.comment" :el=el></comment-com>\
                    <rate-list-com v-else-if="el.type === GlobalValues.control.rate" :el=el></rate-list-com>\
                    <template v-else/>\
                </fieldset>\
            </div>\
    </div>',
    data: function () { return { } },
    props: { elements: { type: Array, required: true }, settings : { type: Object }},
    methods :{
        edit :  function (el) {
            EventBus.$emit('edit', el);
        }, 
        convertHtml : function(desc){            
            return desc.replace(/(?:\r\n|\r|\n)/g, "<br>");
            
        }
    }
})

Vue.component('choice-com', {
    template: '\
    <div :style="col_style">\
        <input :value=choice :type=el.type :name=el.name :id=uid :disabled=disabled v-model=el.value />\
        <label :for="uid">{{choice}}</label>\
    </div>',
    data: function () { return {  row_per : ''} },
    props: { el: { type: Object, required: true }, choice: { type: String, required: true }, index : { type : Number, required: true }},
    computed : {
        
        disabled : function () {
            if (this.el.value instanceof Array) {
                if (this.el.max_num < this.el.min_num) {
                    return false;
                }else {
                    return this.el.value.length >= this.el.max_num && this.el.value.length >= this.el.min_num && this.el.value.indexOf(this.choice) === -1;
                }
            }
            return false;
        },
        uid : function() { 
            return this.el.name + "_" + this._uid;
        },
        col_style : function() {
            var style = { width : '', display : '' };
            if (this.el.col_count !== undefined && this.el.col_count !== 1) {
                style.width = (100 / this.el.col_count) + '%';
                style.display = 'inline-block';
            }
            return style;
        }
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
                <input type="text" style="width:100px" :maxlength="el.other_text_len" v-model=el.other_text_value :readonly=readonly />\
            </div>\
        </template>\
    </div>',
    data: function () { return { } },
    props: { el: { type: Object, required: true }},
    computed : {
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
        disabled : function () {
            if (this.el.value instanceof Array) {
                if (this.el.max_num < this.el.min_num) {
                    return false;
                }else {
                    return this.el.value.length >= this.el.max_num && this.el.value.length >= this.el.min_num && this.el.value.indexOf(this.el.other_text) === -1;
                }
            }
            return false;
        },
        uid : function() { 
            return this.el.name + "_" + this._uid;
        },
        col_style : function() {
            var style = { width : '', display : '' };
            if (this.el.col_count !== undefined && this.el.col_count !== 1) {
                style.width = (100 / this.el.col_count) + '%';
                style.display = 'inline-block';
            }
            return style;
        }
    }
})

Vue.component('comment-com', {
    template: '\
    <div>\
        <textarea type="text" :name="el.name" :rows="el.rows" :id="uid" style="width:100%" v-model=el.value />\
    </div>',
    data: function () { return {  } },
    props: { el: { type: Object, required: true }},
    computed : {
        uid : function() { 
            return this.el.name + "_" + this._uid;
        }
    }
})

Vue.component('text-com', {
    template: '\
    <div>\
        <input type="text" :name="el.name" style="width:100%" :id="uid" :maxlength="el.max_len" v-model=el.value /></template>\
    </div>',
    data: function () { return {   } },
    props: { el: { type: Object, required: true }},
    computed : {
        uid : function() { 
            return this.el.name + "_" + this._uid;
        }
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
    data: function () { return { } },
    props: { el: { type: Object, required: true }}
})



Vue.component('rate-com', {
    template: '\
<div class="rate btn-group">\
    <input :value=choice type="radio" :name=el.name :id=uid v-model=el.value />\
    <label class="btn btn-default" :for=uid>{{choice}}</label>\
</div>',
    data: function () { return { } },
    props: { el: { type: Object, required: true }, choice : { type :  Number}},
    computed : {
        uid : function() { 
            return this.el.name + "_" + this._uid;
        }
    }
})






