Vue.component('controllayout-com', {
    template: '\
    <div>\
            <div v-for="(el, index) in elements">\
                <fieldset v-on:click="edit(el)" v-bind:class="{setting: el === settings}">\
                    <div class="question">{{el.title}}</div>\
                    <choice-list-com v-if="el.type === control.radio || el.type === control.checkbox" :el=el></choice-list-com>\
                    <text-com v-else-if="el.type === control.text" :el=el></text-com>\
                    <comment-com v-else-if="el.type === control.comment" :el=el></comment-com>\
                    <rate-com v-else-if="el.type === control.rate" :el=el></rate-com>\
                    <template v-else/>\
                </fieldset>\
            </div>\
    </div>',
    data: function () { return {} },
    props: { elements: { type: Array, required: true }, settings : { type: Object }, control: {type : Object, required: true}},
    methods :{
        edit :  function (el) {
            EventBus.$emit('edit',  el);
        }
    }
})

Vue.component('choice-com', {
    template: '\
    <span style="display:inline-block; width:50%;">\
        <input :type=inputType :name=name :id=uid :value=choice />\
        <label :for="uid">{{choice}}</label>\
    </span>',
    data: function () { return {  } },
    props: { choice: { type: String, required: true }, name : { type : String, required: true }, index : { type : Number, required: true }, inputType : { type : String, required: true } },
    computed : {
        uid : function() { 
            return this.name + "_" + this._uid;
        }
    }
})

Vue.component('choice-list-com', {
    template: '<div>\
        <span v-for="(choice, index) in el.choices">\
            <choice-com :choice=choice :index=index :name=el.name :inputType=el.type></choice-com>\
        </span>\
        <span>\
                <span v-if="el.other_text !== undefined" style="display:inline-block; width:50%;">\
                    <input :type=el.type :name=el.name :id=uid :value=el.other_text />\
                    <label :for="uid">{{el.other_text}}</label>\
                    <!--<input type="text" />-->\
                </span>\
        </span>\
    </div>',
    data: function () { return {  } },
    props: { el: { type: Object, required: true }},
    computed : {
        uid : function() { 
            return this.el.name + "_" + this._uid;
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

