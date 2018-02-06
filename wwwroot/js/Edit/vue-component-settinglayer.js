
Vue.component('settinglayout-com', {
    template: '\
    <div>\
        <div style="margin-top: 41px">\
             <template v-for="(option, propertyName) in options[optionType]">\
                    <string-setting-com v-if="option.type === options.types.String" :option=option :ko=option.ko :settings=settings :property=propertyName></string-setting-com>\
                    <long-string-setting-com v-if="option.type === options.types.LongString" :option=option :ko=option.ko :settings=settings :property=propertyName></long-string-setting-com>\
                    <checkbox-setting-com v-else-if="option.type === options.types.Boolean" :option=option :ko=option.ko :settings=settings :property=propertyName></checkbox-setting-com>\
                    <int-setting-com v-else-if="option.type === options.types.Int" :option=option :ko=option.ko :settings=settings :property=propertyName></int-setting-com>\
                    <drop-setting-com v-else-if="option.type === options.types.ShortInt" :option=option :ko=option.ko :settings=settings :property=propertyName></drop-setting-com>\
                    <items-setting-com v-else-if="option.type === options.types.ChoiesArray" :option=option :ko=option.ko :settings=settings :property=propertyName></items-setting-com>\
                    <template v-else />\
            </template>\
        </div>\
        <div v-for="(value, propertyName) in settings">\
            <div>{{ propertyName }}: {{ value }}</div>\
        </div>\
    </div>',
    data: function () { return {} },
    props: { settings : { type: Object }, options : {type:Object}},
    computed : {
        optionType : function() {
            //console.log(this.settings);
            if (this.settings == null)
                return "";
            if ('pages' in this.settings)
                return 'survey';
            else if ('elements' in this.settings)
                return 'page';
            else if('type' in this.settings) {
                return this.settings.type;
            }
            else {
                console.log("asfasdf");
                return "";
            }
        }
    }
})

Vue.component('string-setting-com', {
    template: '\
<span class="row">\
    <div class="form-group text-left">\
        <label class="col-md-6">{{ko}}</label>\
        <div class="col-md-6">\
            <input class="form-control" v-model="settings[property]">\
        </div>\
    </div>\
</span>',
    props: { option : { type : Object }, ko : { type: String, required : true }, property: { type : String}, settings : { type: Object , required : true}},
    
})

Vue.component('long-string-setting-com', {
    template: '\
<span class="row">\
    <div class="form-group text-left">\
        <label class="col-md-6">{{ko}}</label>\
        <div class="col-md-6">\
            <a class="input-group" href="#">\
                <input type="text" class="form-control" :placeholder=placeholder>\
                <span class="input-group-addon">수정</span>\
            </a>\
        </div>\
    </div>\
</span>',
    props: { option : { type : Object }, ko : { type: String, required : true }, property: { type : String}, settings : { type: Object , required : true}},
    computed : {
        placeholder : function() { 
            return this.settings[this.property];
        }
    }
})

Vue.component('items-setting-com', {
    template: '\
<span class="row">\
    <div class="form-group text-left">\
        <label class="col-md-6">{{ko}}</label>\
        <div class="col-md-6">\
            <a class="input-group" href="#">\
                <input type="text" class="form-control" :placeholder=placeholder>\
                <span class="input-group-addon">Items</span>\
            </a>\
        </div>\
    </div>\
</span>',
    props: { option : { type : Object }, ko : { type: String, required : true }, property: { type : String}, settings : { type: Object , required : true}},
    computed : {
        placeholder : function() { 
            //console.log(this.settings[this.property]);
            return 'items:' + this.settings[this.property].length;
        }
    }
})


Vue.component('checkbox-setting-com', {
    template: '\
<span class="row">\
    <div class="form-group text-left">\
        <label class="col-md-6">{{ko}}</label>\
        <div class="col-md-6"><input type="checkbox" v-model="settings[property]"></div>\
    </div>\
</span>',
    props: { option : { type : Object }, ko : { type: String, required : true }, property: { type : String}, settings : { type: Object , required : true}}
})


Vue.component('int-setting-com', {
    template: '\
<span class="row">\
    <div class="form-group text-left">\
        <label class="col-md-6">{{ko}}</label>\
        <div class="col-md-6"><input class="form-control" v-model.number="settings[property]" :min="option.min" :max="option.max" type="number" v-on:keypress="disableDot" /></div>\
    </div>\
</span>',
    props: { option : { type : Object }, ko : { type: String, required : true }, property: { type : String}, settings : { type: Object , required : true}},  
    methods : {
        disableDot : function (e) {
            e.preventDefault();
        }
    }
})


Vue.component('drop-setting-com', {
    template: '\
<span class="row">\
    <div class="form-group text-left">\
        <label class="col-md-6">{{ko}}</label>\
        <div class="col-md-6">\
            <select class="form-control" v-model="settings[property]">\
                <option v-for="o in selectOptions" v-bind:value="o.value">\
                    {{ o.text }}\
                </option>\
            </select>\
        </div>\
    </div>\
</span>',
    props: { option : { type : Object }, ko : { type: String, required : true }, property: { type : String}, settings : { type: Object , required : true}},  
    computed : {
        selectOptions : function() { 
            var data = [];
            for (var i = this.option.min; i <= this.option.max; i++) {
                data.push({ text: i, value: i })
            }
            return data;
          
        }
    }
})