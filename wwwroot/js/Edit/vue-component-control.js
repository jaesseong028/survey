Vue.component('controllayout-com', {
    template: '\
    <div>\
            <div v-for="(el, index) in elements">\
                <fieldset v-on:click="edit(el)" v-bind:class="{setting: el === settings}">\
                    <div class="question">{{el.title}}</div>\
                    <choice-list-com v-if="el.type === terms.radio || el.type === terms.checkbox" :el=el :settings=settings></choice-list-com>\
                    <text-com v-else-if="el.type === terms.text" :el=el :settings=settings></text-com>\
                    <comment-com v-else-if="el.type === terms.comment" :el=el :settings=settings></comment-com>\
                    <rate-com v-else-if="el.type === terms.rate" :el=el :settings=settings></rate-com>\
                    <template v-else/>\
                </fieldset>\
            </div>\
    </div>',
    data: function () { return {} },
    props: { elements: { type: Array, required: true }, settings : { type: Object }, terms: {type : Object, required: true}},
    methods :{
        edit :  function (el) {
            EventBus.$emit('edit',  el);
        }
    }
})

Vue.component('choice-com', {
    template: '\
    <div>\
        <input :type=inputType :name=name :id=uid :value=choice />\
        <label :for="uid">{{choice}}</label>\
    </div>',
    data: function () { return {  } },
    props: { choice: { type: String, required: true }, name : { type : String, required: true }, index : { type : Number, required: true }, inputType : { type : String, required: true } },
    computed : {
        uid : function() { 
            return this.name + "_" + this._uid;
        }
    }
})

Vue.component('choice-list-com', {
    template: '\
    <div> <div v-for="(choice, index) in el.choices"> \
        <choice-com :choice=choice :index=index :name=el.name :inputType=el.type></choice-com>\
    </div>\
    <div v-if="el.other_text !== undefined">\
            <input :type=el.type :name="el.name" :id=uid :value="el.other_text" />\
            <label :for="uid">{{el.other_text}}</label>\
            <input type="text" >\
    </div>\
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
    props: { el: { type: Object, required: true }, settings : { type: Object, required: true }},
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
    props: { el: { type: Object, required: true }, settings : { type: Object, required: true }},
    computed : {
        uid : function() { 
            return this.el.name + "_" + this._uid;
        }
    }
})

