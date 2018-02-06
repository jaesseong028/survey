Vue.component('controllayout-com', {
    template: '\
    <div>\
            <div v-for="(el, index) in elements">\
                <fieldset v-on:click="edit(el)" v-bind:class="{setting: el === settings}">\
                    <label class="required" v-if="el.is_required">*</label>.<label class="question">{{el.title}}</label>\
                    <choice-list-com v-if="el.type === control.radio || el.type === control.checkbox" :el=el></choice-list-com>\
                    <text-com v-else-if="el.type === control.text" :el=el></text-com>\
                    <comment-com v-else-if="el.type === control.comment" :el=el></comment-com>\
                    <rate-com v-else-if="el.type === control.rate" :el=el></rate-com>\
                    <template v-else/>\
                </fieldset>\
            </div>\
    </div>',
    data: function () { return { counter : 1 } },
    props: { elements: { type: Array, required: true }, settings : { type: Object }, control: {type : Object, required: true}},
    methods :{
        edit :  function (el) {
            EventBus.$emit('edit',  el);
        }
    }
})

Vue.component('choice-com', {
    template: '\
    <div :style="col_style">\
        <input :type=el.type :name=el.name :id=uid :value=choice />\
        <label :for="uid">{{choice}}</label>\
    </div>',
    data: function () { return {  row_per : '' } },
    props: { el: { type: Object, required: true }, choice: { type: String, required: true }, index : { type : Number, required: true },},
    computed : {
        uid : function() { 
            return this.name + "_" + this._uid;
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
            <choice-com :choice=choice :index=index :el=el></choice-com>\
        </template>\<template>\<div v-if="el.is_other" :style="col_style">\
                <input :type=el.type :name=el.name :id=uid :value=el.other_text />\
                <label :for="uid">{{el.other_text}}</label>\
                <input type="text" />\
            </div>\
        </template>\
    </div>',
    data: function () { return { } },
    props: { el: { type: Object, required: true }},
    computed : {
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
        <textarea type="text" :name="el.name" :rows="el.rows" :id="uid" style="width:100%" />\
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
        <input type="text" :name="el.name" style="width:100%" :id="uid" /></template>\
    </div>',
    data: function () { return {   } },
    props: { el: { type: Object, required: true }},
    computed : {
        uid : function() { 
            return this.el.name + "_" + this._uid;
        }
    }
})


Vue.component('rate-com', {
    template: '\
    <div>\
        <template v-if="el.min_description !== undefined">\
            <label class="rate_min">{{el.min_description}}</label>\
        </template>\
        <div v-for="(c, index) in el.choices" class="rate btn-group">\
            <input type="radio" :name="el.name" :value="c" :id="uid"/>\
            <label class="btn btn-default" :for="uid">{{c}}</label>\
        </div>\
        <template v-if="el.max_description !== undefined">\
        <label class="rate_max">{{el.max_description}}</label>\
        </template>\
    </div>',
    data: function () { return { } },
    props: { el: { type: Object, required: true }},
    computed : {
        uid : function() { 
            return this.el.name + "_" + this._uid;
        }
    }
})

