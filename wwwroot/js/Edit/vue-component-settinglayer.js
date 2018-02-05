
Vue.component('settinglayout-com', {
    template: '\
    <div>\
        <div style="border: 1px solid #87B2F1; margin-top: 41px">\
            <div v-for="(option, propertyName) in options[optionType]">\
                <string-setting-com v-if="option.type === options.types.String" :option=option :ko=option.ko :settings=settings :property=propertyName></string-setting-com>\
                <checkbox-setting-com v-else-if="option.type === options.types.Boolean" :option=option :ko=option.ko :settings=settings :property=propertyName></checkbox-setting-com>\
                <int-setting-com v-else-if="option.type === options.types.Int" :option=option :ko=option.ko :settings=settings :property=propertyName></int-setting-com>\
            </div>\
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
<div>\
    <div class="option_name">\
    {{ko}}\
    </div>\
    <div class="option_name">\
    <input v-model="settings[property]">\
    </div>\
</div>',
    props: { option : { type : Object }, ko : { type: String, required : true }, property: { type : String}, settings : { type: Object , required : true}}
})


Vue.component('checkbox-setting-com', {
    template: '\
<div>\
    {{ko}}\
    <input type="checkbox" v-model="settings[property]">\
</div>',
    props: { option : { type : Object }, ko : { type: String, required : true }, property: { type : String}, settings : { type: Object , required : true}}
})


Vue.component('int-setting-com', {
    template: '\
<div>\
    {{ko}}\
    <input v-model.number="settings[property]" :min="option.min" :max="option.max" type="number" v-on:keypress="disableDot" />\
</div>',
    props: { option : { type : Object }, ko : { type: String, required : true }, property: { type : String}, settings : { type: Object , required : true}},  
   
    methods : {
        disableDot : function (e) {
            e.preventDefault();
        }
    }
})