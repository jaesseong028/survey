
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
            <a class="input-group" href="#">\
                <input class="form-control" v-model="settings[property]">\
                <span v-if="property == \'name\'" class="input-group-addon delete" v-on:click=deleteSetting>X</span><!-- 페이지 또는 설문일 경우 삭제 하기 버튼 활성화 -->\
            </a>\
        </div>\
    </div>\
</span>',
    props: { option : { type : Object }, ko : { type: String, required : true }, property: { type : String}, settings : { type: Object , required : true}},
    methods : {
        deleteSetting : function(){
            this.$root.deleteSetting();
        }
    }
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
            var qty = this.settings[this.property].skipQuestionNames.length;
            if (qty != 0)
                return  'skips:' + qty;
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
        <skip-com v-else-if="opened && type === Options.types.SkipArray" :value=settings[property] :settings=settings></skip-com>\
    </div>\
</div>',
    data: function () { return {  opened : false, settings : null, property : '', type : '', header : '' } },
    props: { },
    computed : {
        style : function() {
            var style = { display : 'none', marginTop: '-1px', marginLeft : '-1px'};
            if (this.opened) {
                style.display = 'block';
                if (this.type == this.Options.types.SkipArray){
                    style.height = '600px';
                }
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
            console.log(val);
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


Vue.component('skip-com', {
    template: '\
<div>\
    <div class="modal-items">\
            <span class="row">\
                <div class="form-group">\
                    <div class="col-md-6">\
                        <div class="dropdown text-left">\
                            <button class="btn btn-primary dropdown-toggle" type="button" data-toggle="dropdown">답변추가\
                            <span class="caret"></span></button>\
                            <ul class="dropdown-menu">\
                                <template v-for="c in settings.choices">\
                                    <li><a href="#" v-on:click="addChoice(c)">{{c}}</a></li>\
                                </template>\
                                <li v-if="settings.is_other">\
                                    <a href="#" v-on:click="addChoice(settings.other_text)">{{settings.other_text}}</a>\
                                </li>\
                            </ul>\
                            <button class="btn btn-danger" v-on:click=deleteChoice>삭제</button>\
                        </div>\
                    </div>\
                    <div class="col-md-6">\
                        <div class="dropdown text-left">\
                            <button class="btn btn-primary dropdown-toggle" type="button" data-toggle="dropdown">질문추가\
                            <span class="caret"></span></button>\
                            <ul class="dropdown-menu">\
                                <template v-for="q in questions">\
                                    <li><a href="#" v-on:click="addQuestion(q)">{{q}}</a></li>\
                                </template>\
                            </ul>\
                            <button class="btn btn-danger" v-on:click=deleteQuestion>삭제</button>\
                        </div>\
                    </div>\
                </div>\
            </span>\
            <span class="row">\
                <div class="form-group">\
                    <div class="col-md-6">\
                        <select name="sometext" multiple="multiple" v-model="choiceSelected" class="chosen-select form-control" size="11">\
                            <option disable v-if="skip.choices.length == 0">답변을 선택하세요.</option>\
                            <template v-for="c in skip.choices">\
                                <option>{{c}}</option>\
                            </template>\
                        </select>\
                    </div>\
                    <div class="col-md-6">\
                        <select name="sometext" multiple="multiple" v-model="questionSelected" class="chosen-select form-control" size="11">\
                            <option disable v-if="skip.skipQuestionNames.length == 0">질문을 선택하세요.</option>\
                            <template v-for="sq in skip.skipQuestionNames">\
                                <option>{{sq}}</option>\
                            </template>\
                        </select>\
                    </div>\
                </div>\
            </span>\
    </div>\
    <div class="modal-bottom">\
        <span class="row">\
             ※ 좌측에 있는 답을 선택 하였을 경우 우측의 질문은 선택 불가능 합니다.\
        </span>\
        <span class="row">\
            <div>\
                <div class="col-sm-12">\
                    <button class="btn btn-info" v-on:click=regist>확인</button>\
                    <button class="btn btn-secondary" v-on:click=cancle>취소</button>\
                </div>\
            </div>\
        </span>\
    </div>\
</div>',
    data: function () { return { skip : this.value, choiceSelected : [], questionSelected : []} },
    props: { value : { type : Object }, settings : { type : Array} },
    //"skip" :{"choices":["예"], "skipQuestionNames":["question3"] },
    computed : {
        questions : function() {
            var survery = this.$root.survey;
            var dropData = [];
            for (var p=0; p < survery.pages.length; p++) {
                for (var e=0; e< survery.pages[p].elements.length; e++) {
                    if(this.settings !== survery.pages[p].elements[e])
                        dropData.push (survery.pages[p].elements[e].name);
                }
            }
            return dropData;
        }
    },
    methods : {
        addQuestion : function(q) {
            if (this.skip.skipQuestionNames.indexOf(q) == -1){
                this.skip.skipQuestionNames.push(q);
            }
        },
        deleteQuestion : function() {
            for(var q = 0; q < this.questionSelected.length; q++) {
                var idx = this.skip.skipQuestionNames.indexOf(q);
                if(idx != -1) {
                    this.skip.skipQuestionNames.splice(idx, 1);
                }
            }
        },
        addChoice : function(q) {
            if (this.skip.choices.indexOf(q) == -1){
                this.skip.choices.push(q);
            }
        },
        deleteChoice : function() {
            for(var q = 0; q < this.choiceSelected.length; q++) {
                var idx = this.skip.choices.indexOf(q);
                if(idx != -1) {
                    this.skip.choices.splice(idx, 1);
                }
            }
        },
        regist : function() {
            EventBus.$emit('layerClose', this.skip);
        }, 
        cancle : function(){
            EventBus.$emit('layerClose', this.value);
        }
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
            console.log(this.copyData);
            var data = _.filter(this.copyData, function(item){ return item !== '' && item != null; });
            this.values.splice(0, this.values.length);
            for (var d in data) {
                if (typeof data[d] == 'string'){
                    this.values.push(data[d]);
                }
            }
            EventBus.$emit('layerClose', this.values);
        }, 
        cancle : function(){
            EventBus.$emit('layerClose', this.values);
        }
    }
})