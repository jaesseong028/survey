
Vue.component('settinglayout-com', {
    template: '\
    <div>\
        <div class="setting-layout">\
             <template v-for="(option, propertyName) in Options[optionType]">\
                    <string-setting-com v-if="option.type === Options.types.String" :option=option :ko=option.ko :settings=settings :property=propertyName></string-setting-com>\
                    <long-string-setting-com v-if="option.type === Options.types.LongString" :option=option :ko=option.ko :settings=settings :property=propertyName></long-string-setting-com>\
                    <checkbox-setting-com v-else-if="option.type === Options.types.Boolean" :option=option :ko=option.ko :settings=settings :property=propertyName></checkbox-setting-com>\
                    <int-setting-com v-else-if="option.type === Options.types.Int" :option=option :ko=option.ko :settings=settings :property=propertyName></int-setting-com>\
                    <drop-setting-com v-else-if="option.type === Options.types.ShortInt" :option=option :ko=option.ko :settings=settings :property=propertyName></drop-setting-com>\
                    <items-setting-com v-else-if="option.type === Options.types.ChoiesArray" :option=option :ko=option.ko :settings=settings :property=propertyName></items-setting-com>\
                    <skip-setting-com v-else-if="option.type === Options.types.SkipArray" :option=option :ko=option.ko :settings=settings :property=propertyName></skip-setting-com >\
                    <template v-else />\
            </template>\
        </div>\
        <!--<div v-for="(value, propertyName) in settings">\
            <div>{{ propertyName }}: {{ value }}</div>\
        </div>-->\
    </div>',
    data: function () { return {} },
    props: { settings : { type: Object }},
    computed : {
        optionType : function() {
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
        <label class="col-sm-6">{{ko}}</label>\
        <div class="col-sm-6">\
            <a class="input-group" href="#" v-on:click=layerOpen>\
                <input type="text" class="form-control" :placeholder=placeholder readonly>\
                <span class="input-group-addon">수정</span>\
            </a>\
        </div>\
    </div>\
</span>',
    props: { option : { type : Object }, ko : { type: String, required : true }, property: { type : String}, settings : { type: Object , required : true}},
    methods : {
        layerOpen : function () {
            EventBus.$emit('layerOpen', this.settings, this.property, this.option.type, this.ko  + ' 수정');
        }
    },
    computed : {
        placeholder : function() { 
            return this.settings[this.property];
        }
    }
})


Vue.component('skip-setting-com', {
    template: '\
<span class="row">\
    <div class="form-group text-left">\
        <label class="col-sm-6">{{ko}}</label>\
        <div class="col-sm-6">\
            <a class="input-group" href="#" v-on:click=layerOpen>\
                <input type="text" class="form-control" :placeholder=placeholder readonly>\
                <span class="input-group-addon">편집</span>\
            </a>\
        </div>\
    </div>\
</span>',
    props: { option : { type : Object }, ko : { type: String, required : true }, property: { type : String}, settings : { type: Object , required : true}},
    methods : {
        layerOpen : function () {
            EventBus.$emit('layerOpen', this.settings, this.property, this.option.type, '건너뛰기 편집');
        }
    },
    computed : {
        placeholder : function() { 
            //return 'items:' + this.settings[this.property].length;
        }
    }
})

Vue.component('items-setting-com', {
    template: '\
<span class="row">\
    <div class="form-group text-left">\
        <label class="col-sm-6">{{ko}}</label>\
        <div class="col-sm-6">\
            <a class="input-group" href="#" v-on:click=layerOpen>\
                <input type="text" class="form-control" :placeholder=placeholder readonly>\
                <span class="input-group-addon">항목</span>\
            </a>\
        </div>\
    </div>\
</span>',
    props: { option : { type : Object }, ko : { type: String, required : true }, property: { type : String}, settings : { type: Object , required : true}},
    methods : {
        layerOpen : function () {
            EventBus.$emit('layerOpen', this.settings, this.property, this.option.type, '아이템 편집');
        }
    },
    computed : {
        placeholder : function() { 
            return 'items:' + this.settings[this.property].length;
        }
    }
})


Vue.component('checkbox-setting-com', {
    template: '\
<span class="row">\
    <div class="form-group text-left">\
        <label class="col-sm-6">{{ko}}</label>\
        <div class="col-sm-6"><input type="checkbox" v-model="settings[property]"></div>\
    </div>\
</span>',
    props: { option : { type : Object }, ko : { type: String, required : true }, property: { type : String}, settings : { type: Object , required : true}}
})


Vue.component('int-setting-com', {
    template: '\
<span class="row">\
    <div class="form-group text-left">\
        <label class="col-sm-6">{{ko}}</label>\
        <div class="col-sm-6"><input class="form-control" v-model.number="settings[property]" :min="option.min" :max="option.max" type="number" /></div>\
    </div>\
</span>',
    props: { option : { type : Object }, ko : { type: String, required : true }, property: { type : String}, settings : { type: Object , required : true}},  
})


Vue.component('drop-setting-com', {
    template: '\
<span class="row">\
    <div class="form-group text-left">\
        <label class="col-sm-6">{{ko}}</label>\
        <div class="col-sm-6">\
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



Vue.component('modallayout-com', {
    template: '\
<div class="modal-mask" v-show="opened">\
    <div id="modal" class="panel panel-primary layer" :style=style>\
        <div class="text-left header">{{header}}<button class="close" type="button" v-on:click=layerClose>×</button></div>\
        <items-com v-if="opened && type === Options.types.ChoiesArray" :values=settings[property]></items-com>\
        <longstring-com v-else-if="opened && type === Options.types.LongString" :value=settings[property]></longstring-com>\
    </div>\
</div>',
    data: function () { return {  opened : false, settings : null, property : '', type : '', header : '' } },
    props: { },
    computed : {
        style : function() {
            var style = { display : 'none', marginTop: '-1px', marginLeft : '-1px'};
            if (this.opened) {
                style.display = 'block';
                style.marginTop = '-' + (($("#modal").outerHeight() / 2) + $(window).scrollTop()) + 'px';
                style.marginLeft = '-' + (($("#modal").outerWidth() / 2) + $(window).scrollTop()) + 'px';
            }
            return style;
        }, 
    }, 
    methods : {
        layerOpen : function (settings, property, type, header) {
            this.opened  = true;
            this.settings  = settings;
            this.property  = property;
            this.type  = type;
            this.header =  header;
        }, 
        layerClose : function (val) {
            this.opened  = false;
            this.settings[this.property] = val;
            //vue.$set(this.settings, this.property, val);
            vue.$forceUpdate(); // 강제 업데이트를 해줘야 함.... 자동으로 observe 하지 않음
        }
    },
    created : function() {
        EventBus.$on('layerOpen', this.layerOpen);
        EventBus.$on('layerClose', this.layerClose);
    }
})



Vue.component('longstring-com', {
    template: '\
<div>\
    <div class="modal-items">\
        <span class="row">\
            <div class="form-group">\
                <div class="col-sm-12">\
                    <textarea type="text" class="form-control" v-model="text" rows="17" />\
                </div>\
            </div>\
        </span>\
    </div>\
    <div class="modal-bottom">\
        <span class="row">\
            <div style="height:40px;">&nbsp;</div>\
            <div class="form-group">\
                <div class="col-sm-12">\
                    <button class="btn btn-info" v-on:click=regist>확인</button>\
                    <button class="btn btn-secondary" v-on:click=cancle>취소</button>\
                </div>\
            </div>\
        </span>\
    </div>\
</div>',
    data: function () { return { text : this.value } },
    props: { value : { type : String } },
    methods : {
        regist : function() {
            EventBus.$emit('layerClose', this.text);
        }, 
        cancle : function(){
            EventBus.$emit('layerClose', this.value);
        }
    }
})


Vue.component('items-com', {
    template: '\
<div>\
    <div class="modal-items">\
        <template v-for="(v, index) in copyData">\
            <span class="row">\
                <div class="form-group">\
                    <div class="col-sm-10">\
                        <input type="text" class="form-control" v-model="copyData[index]" />\
                    </div>\
                    <div class="col-sm-2">\
                        <button class="btn btn-danger" v-on:click=deleteItem(index)>-</button>\
                    </div>\
                </div>\
            </span>\
        </template>\
    </div>\
    <div class="modal-bottom">\
        <span class="row">\
            <div class="form-group">\
                <div class="col-sm-1">\
                    <button class="btn btn-warning" v-on:click=appendItem>+</button>\
                </div>\
            </div>\
            <div class="form-group">\
                <div class="col-sm-12">\
                        <button class="btn btn-info" v-on:click=regist>확인</button>\
                        <button class="btn btn-secondary" v-on:click=cancle>취소</button>\
                </div>\
            </div>\
        </span>\
    </div>\
</div>',
    data: function () { return { copyData : _.toArray(this.values) } },
    props: { values : { type : Array }  },
    methods : {
        appendItem : function(){
            this.copyData.push('');
            var modalItems = $(this.$el).find(".modal-items");
            modalItems.animate({ scrollTop: modalItems.prop("scrollHeight")}, 100);
        }, 
        deleteItem : function (index){
            this.copyData.splice(index, 1);
        },
        regist : function() {
            var data = _.filter(this.copyData, function(item){ return item !== ''; });
            this.values.splice(0, this.values.length);
            for (var d in data) {
                this.values.push(data[d]);
            }
            EventBus.$emit('layerClose', this.values);
        }, 
        cancle : function(){
            EventBus.$emit('layerClose', this.values);
        }
    }
})