
Vue.component('settinglayout-com', {
    template: '\
    <div>\
        <div style="border: 1px solid #87B2F1; margin-top: 41px">\
            <div v-for="(option, propertyName) in options[optionType]">\
                <string-setting-com v-if="option.type === options.types.String" :option=option :ko=value.ko :settings=settings :property=propertyName></string-setting-com>\
                <checkbox-setting-com v-if="option.type === options.types.Boolean" :option=option :ko=value.ko :settings=settings :property=propertyName></checkbox-setting-com>\
                <int-setting-com v-if="option.type === options.types.Int" :option=option :ko=value.ko :settings=settings :property=propertyName></int-setting-com>\
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
    {{ko}}\
    <input v-model="settings[property]">\
</div>',
    props: { option : { type : Object }, ko : { type: String, required : true }, property: { type : String}, settings : { type: Object , required : true}},  
    mouted : function(){
        if(settings !== undefined){
            if(settings[property] === undefined){
                settings[property] = '';
            }
        }
    },
})


Vue.component('checkbox-setting-com', {
    template: '\
<div>\
    {{ko}}\
    <input type="checkbox" v-model="settings[property]">\
</div>',
    props: { option : { type : Object }, ko : { type: String, required : true }, property: { type : String}, settings : { type: Object , required : true}},  
    mouted : function(){
        if(settings !== undefined){
            if(settings[property] === undefined){
                settings[property] = '';
            }
        }
    },
})


Vue.component('checkbox-setting-com', {
    template: '\
<div>\
    {{ko}}\
    <input type="checkbox" v-model="settings[property]" />\
</div>',
    props: { option : { type : Object }, ko : { type: String, required : true }, property: { type : String}, settings : { type: Object , required : true}},  
    mouted : function(){
        if(settings !== undefined){
            if(settings[property] === undefined){
                settings[property] = '';
            }
        }
    },
})



Vue.component('int-setting-com', {
    template: '\
<div>\
    {{ko}}\
    <input v-model.number="settings[property]" min="1" max="5" type="number" v-on:keypress="disableDot" />\
</div>',
    props: { option : { type : Object }, ko : { type: String, required : true }, property: { type : String}, settings : { type: Object , required : true}},  
    mouted : function(){
        if(settings !== undefined){
            if(settings[property] === undefined){
                settings[property] = 0;
            }
        }
    },
    methods : {
        disableDot : function (e){
            e.preventDefault();
        }
    }
})