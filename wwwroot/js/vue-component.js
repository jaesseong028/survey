Vue.component('radio-com', {
    template: '<div>\
                        <div>{{el.title}}</div>\
                        <div v-for="(s, index) in el.choices"> \
                                <input type="radio" :name="el.name" :id="el.name + index" :value="s.item" /> <label :for="el.name + index" v-show="!isEdit">{{s.item}}</label> <input  v-model="s.item" v-show="isEdit">\
                        </div>\
                      </div>',
    data: function () { return { isEdit: false } },
    props: { el: { type: Object } },
    methods :{
        item_add: function (el) {
            el.choices.push({ item: "item"});
        }, 
        edit: function () {
            console.log(this.isEdit);
            this.isEdit = !this.isEdit;
        }
    }
})

Vue.component('radio-com', {
    template: '<div>\
                        <div>{{el.title}}</div>\
                        <div v-for="(s, index) in el.choices"> \
                                <input type="radio" :name="el.name" :id="el.name + index" :value="s.item" /> <label :for="el.name + index" v-show="!isEdit">{{s.item}}</label> <input  v-model="s.item" v-show="isEdit">\
                        </div>\
                      </div>',
    data: function () { return { isEdit: false } },
    props: { el: { type: Object } },
    methods :{
        item_add: function (el) {
            el.choices.push({ item: "item"});
        }, 
        edit: function () {
            console.log(this.isEdit);
            this.isEdit = !this.isEdit;
        }
    }
})

Vue.component('check-com', {
    template: '<div>\
                            <div>{{el.title}}</div>\
                            <div v-for="(s, index) in el.choices">\
                                <input type="checkbox" :name="el.name" :value="s.item" :id="el.name + index" />\
                                <label :for="el.name + index">{{s.item}}</label>\
                            </div>\
                     </div>',
    props: { el: { type: Object } }
})


Vue.component('textarea-com', {
    template: '<div><div>{{el.title}}</div><textarea type="text" :name="el.name" :rows="el.rows" style="width:100%"></textarea></div>',
    props: { el: { type: Object } }
})

Vue.component('text-com', {
    template: '<div><div>{{el.title}}</div> 답변 : <input  type="text" :name="el.name" style="width:100%" /></div>',
    props: { el: { type: Object } }
})
