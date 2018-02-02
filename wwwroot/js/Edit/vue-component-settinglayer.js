Vue.component('settinglayout-com', {
    template: '\
    <div>\
        <div style="border: 1px solid #87B2F1; margin-top: 41px">\
            <div>{{optionType}}</div>\
        </div>\
        <div v-for="(value, propertyName) in settings">\
            <div>{{ propertyName }}: {{ value }}</div>\
        </div>\
    </div>',
    data: function () { return {} },
    props: { settings : { type: Object }},
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
    template: ' <div style="border: 1px solid #87B2F1; margin-top: 41px">셋팅\</div>',
})