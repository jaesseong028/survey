Vue.component('radio-com', {
    template: '<fieldset v-on:click="edit(el)" v-bind:class="{setting: el === settings}">\
                    <div class="question">{{el.title}}</div>\
                    <div v-for="(c, index) in el.choices"> \
                        <input type="radio" :name="el.name" :id="el.name + index" :value="c" />\
                        <label :for="el.name + index">{{c}}</label>\
                    </div>\
                    <template v-if="el.other_text !== undefined">\
                        <input type="radio" :name="el.name" :id="el.name" :value="el.other_text" />\
                        <label :for="el.name">{{el.other_text}}</label>\
                        <input type="text" >\
                    </template>\
                </fieldset>',
    data: function () { return { isEdit: false, etc : "etc" } },
    props: { el: { type: Object }, settings : { type: Object }},
    methods :{
        edit :  function (el) {
            EventBus.$emit('edit',  el);
        }
    }
})


Vue.component('check-com', {
    template: '<fieldset v-on:click="edit(el)" v-bind:class="{setting: el === settings}">\
                <div class="question">{{el.title}}</div>\
                    <div v-for="(c, index) in el.choices">\
                        <input type="checkbox" :name="el.name" :value="c" :id="el.name + index" />\
                        <label :for="el.name + index">{{c}}</label>\
                    </div>\
                    <template v-if="el.other_text !== undefined">\
                        <input type="checkbox" :name="el.name" :id="el.name" :value="el.other_text" />\
                        <label :for="el.name">{{el.other_text}}</label>\
                        <input type="text" >\
                    </template>\
                </fieldset>',
    data: function () { return { etc : "etc" } },
    props: { el: { type: Object }, settings : { type: Object }},
    methods :{
        edit :  function (el) {
            EventBus.$emit('edit',  el);
        }
    }
})


Vue.component('textarea-com', {
    template: '<fieldset v-on:click="edit(el)" v-bind:class="{setting: el === settings}">\
                    <div class="question">{{el.title}}</div>\
                    <textarea type="text" :name="el.name" :rows="el.rows" style="width:100%"></textarea>\
                </fieldset>',
    props: { el: { type: Object }, settings : { type: Object }},
    methods :{
        edit :  function (el) {
            EventBus.$emit('edit',  el);
        }
    }
})

Vue.component('text-com', {
    template: '<fieldset v-on:click="edit(el)" v-bind:class="{setting: el === settings}">\
                    <div class="question">{{el.title}}</div> \
                    <input  type="text" :name="el.name" style="width:100%" /> \
                </fieldset>',
    props: { el: { type: Object }, settings : { type: Object }},
    methods :{
        edit :  function (el) {
            EventBus.$emit('edit',  el);
        }
    }
})


Vue.component('rate-com', {
    template: '<fieldset v-on:click="edit(el)" v-bind:class="{setting: el === settings}">\
                    <div class="question">{{el.title}}</div>\
                    <template v-if="el.min_description !== undefined">\
                        <label class="rate_min">{{el.min_description}}</label>\
                    </template>\
                    <div v-for="(c, index) in el.choices" class="rate btn-group">\
                        <input type="radio" :name="el.name" :value="c" :id="el.name + index"/>\
                        <label class="btn btn-default" :for="el.name + index">{{c}}</label>\
                    </div>\
                    <template v-if="el.max_description !== undefined">\
                        <label class="rate_max">{{el.max_description}}</label>\
                    </template>\
                </fieldset>',
    props: { el: { type: Object }, settings : { type: Object }},
    methods :{
        edit :  function (el) {
            EventBus.$emit('edit',  el);
        }
    }
})

