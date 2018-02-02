
Vue.component('settinglayout-com', {
    template: '\
    </div>\
        <div style="border: 1px solid #87B2F1; margin-top: 41px">{{settings}}</div>\
    </div>',
    data: function () { return {} },
    props: { settings : { type: Object }},
})

Vue.component('control-setting-com', {
    template: ' <div style="border: 1px solid #87B2F1; margin-top: 41px">셋팅\</div>',
})