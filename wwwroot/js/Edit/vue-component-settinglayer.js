
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
                    <choice-setting-com v-else-if="option.type === Options.types.ChoiesArray" :option=option :ko=option.ko :settings=settings :property=propertyName></choice-setting-com>\
                    <items-setting-com v-else-if="option.type === Options.types.itemsArray" :option=option :ko=option.ko :settings=settings :property=propertyName></items-setting-com>\
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
        <label class="col-md-4">{{ko}}</label>\
        <div class="col-md-8">\
            <template v-if="property == \'name\'">\
                <a class="input-group" href="#">\
                    <input class="form-control" v-on:focus=onfocus v-on:blur=onblur v-model="settings[property]">\
                    <span class="input-group-addon delete" v-on:click=deleteSetting>X</span><!-- 페이지 또는 설문일 경우 삭제 하기 버튼 활성화 -->\
                </a>\
            </template>\
            <template v-else="">\
                <input class="form-control" v-model="settings[property]">\
            </template>\
        </div>\
    </div>\
</span>',
    props: { option : { type : Object }, ko : { type: String, required : true }, property: { type : String}, settings : { type: Object , required : true}},
    methods : {
        deleteSetting : function(){
            this.$root.deleteSetting();
        }, 
        onfocus : function() {
            if (this.property == 'name') {
                this.$root.focusedQeustionName = this.settings[this.property];
            }
        }, 
        onblur : function() {
            if (this.property == 'name') {

                var newValue = this.settings[this.property];
                var oldValue = this.$root.focusedQeustionName;

                var survery = this.$root.survey;
                for (var p=0; p < survery.pages.length; p++) {
                    for (var e=0; e< survery.pages[p].elements.length; e++) {
                        /// 동일한 이름 체크 ///
                        if (survery.pages[p].elements[e] != this.settings) {
                            console.log(survery.pages[p].elements[e].name);
                            if (survery.pages[p].elements[e].name == newValue) {
                                newValue = this.$root.emptyName(this.GlobalValues.question);
                                this.settings[this.property] = newValue;
                                vue.$forceUpdate();
                                alert('이미 다른 곳에 사용중인 이름입니다.');
                            }
                        }
                        /// 동일한 이름 체크 ///
                        /// Skip 부분에 설문 이름이 변경 된것을 찾아 바꿔줌
                        if ('skip' in survery.pages[p].elements[e]) {
                            var idx = survery.pages[p].elements[e].skip.skipQuestionNames.indexOf(oldValue);
                            if (idx != -1) {
                                survery.pages[p].elements[e].skip.skipQuestionNames[idx] = newValue;
                            }
                        }
                        /// Skip 부분에 설문 이름이 변경 된것을 찾아 바꿔줌
                    }
                }
            }
        }
    }
})

Vue.component('long-string-setting-com', {
    template: '\
<span class="row">\
    <div class="form-group text-left">\
        <label class="col-sm-4">{{ko}}</label>\
        <div class="col-sm-8">\
            <a class="input-group" href="#" v-on:click=layerOpen>\
                <input type="text" class="form-control cur" :placeholder=placeholder readonly>\
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
        <label class="col-sm-4">{{ko}}</label>\
        <div class="col-sm-8">\
            <a class="input-group" href="#" v-on:click=layerOpen>\
                <input type="text" class="form-control cur" :placeholder=placeholder readonly>\
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

Vue.component('choice-setting-com', {
    template: '\
<span class="row">\
    <div class="form-group text-left">\
        <label class="col-sm-4">{{ko}}</label>\
        <div class="col-sm-8">\
            <a class="input-group" href="#" v-on:click=layerOpen>\
                <input type="text" class="form-control cur" :placeholder=placeholder readonly>\
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


Vue.component('items-setting-com', {
    template: '\
<span class="row">\
    <div class="form-group text-left">\
        <label class="col-sm-4">{{ko}}</label>\
        <div class="col-sm-8">\
            <a class="input-group" href="#" v-on:click=layerOpen>\
                <input type="text" class="form-control cur" :placeholder=placeholder readonly>\
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
        <label class="col-sm-4">{{ko}}</label>\
        <div class="col-sm-8"><input type="checkbox" v-model="settings[property]"></div>\
    </div>\
</span>',
    props: { option : { type : Object }, ko : { type: String, required : true }, property: { type : String}, settings : { type: Object , required : true}}
})


Vue.component('int-setting-com', {
    template: '\
<span class="row">\
    <div class="form-group text-left">\
        <label class="col-sm-4">{{ko}}</label>\
        <div class="col-sm-8"><input class="form-control" v-model.number="settings[property]" :min="option.min" :max="option.max" type="number" /></div>\
    </div>\
</span>',
    props: { option : { type : Object }, ko : { type: String, required : true }, property: { type : String}, settings : { type: Object , required : true}},  
})


Vue.component('drop-setting-com', {
    template: '\
<span class="row">\
    <div class="form-group text-left">\
        <label class="col-sm-4">{{ko}}</label>\
        <div class="col-sm-8">\
            <select class="form-control cur" v-model="settings[property]">\
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
        <div class="text-left header">{{header}}<button class="close" type="button" v-on:click=closedHeaderClick>×</button></div>\
        <choices-com v-if="opened && type === Options.types.ChoiesArray" :values=settings[property]></choices-com>\
        <items-com v-if="opened && type === Options.types.itemsArray" :values=settings[property]></items-com>\
        <longstring-com v-else-if="opened && type === Options.types.LongString" :settingInfo=settings[property]></longstring-com>\
        <skip-com v-else-if="opened && type === Options.types.SkipArray" :settingInfo=settings[property] :settings=settings></skip-com>\
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
        closedHeaderClick : function(){
            this.opened  = false;
        },
        layerClose : function (val) {
            this.opened  = false;
            if (val != null){
                this.settings[this.property] = val;
                //vue.$set(this.settings, this.property, val);
                vue.$forceUpdate(); // 강제 업데이트를 해줘야 함.... 자동으로 observe 하지 않음
            }
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
                        <select name="sometext" multiple="multiple" v-model="choiceSelected" class="chosen-select form-control" size="12">\
                            <option disable v-if="skip.choices.length == 0">답변을 선택하세요.</option>\
                            <template v-for="c in skip.choices">\
                                <option>{{c}}</option>\
                            </template>\
                        </select>\
                    </div>\
                    <div class="col-md-6">\
                        <select name="sometext" multiple="multiple" v-model="questionSelected" class="chosen-select form-control" size="12">\
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
                    <button class="btn btn-secondary" v-on:click=layerClose>취소</button>\
                </div>\
            </div>\
        </span>\
    </div>\
</div>',
    data: function () { return { skip : JSON.parse(JSON.stringify(this.settingInfo)), choiceSelected : [], questionSelected : []} },
    props: { settingInfo : { type : Object }, settings : { type : Array} },
    created : function(){
        // for(s in this.settingInfo){
        //     console.log(s);
        //     console.log(this.settingInfo[s]);
        // }
    },
    computed : {
        questions : function() {
            var survery = this.$root.survey;
            var dropData = [];
            for (var p=0; p < survery.pages.length; p++) {
                for (var e=0; e< survery.pages[p].elements.length; e++) {
                    if(this.settings !== survery.pages[p].elements[e]){
                        dropData.push (survery.pages[p].elements[e].name);
                    }
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
                var idx = this.skip.skipQuestionNames.indexOf(this.questionSelected[q]);
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
                var idx = this.skip.choices.indexOf(this.choiceSelected[q]);
                if(idx != -1) {
                    this.skip.choices.splice(idx, 1);
                }
            }
        },
        regist : function() {

            if (this.skip.skipQuestionNames.length == 0 || this.skip.choices.length == 0){
                this.skip.skipQuestionNames = [];
                this.skip.choices = [];
            }
            
            EventBus.$emit('layerClose', this.skip);
        }, 
        layerClose : function () {
            EventBus.$emit('layerClose', null);
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
                    <button class="btn btn-secondary" v-on:click=layerClose>취소</button>\
                </div>\
            </div>\
        </span>\
    </div>\
</div>',
    data: function () { return { text : this.settingInfo } },
    props: { settingInfo : { type : String } },
    methods : {
        regist : function() {
            EventBus.$emit('layerClose', this.text);
        }, 
        layerClose : function(){
            EventBus.$emit('layerClose', null);
        }
    }
})



Vue.component('items-com', {
    template: '\
<div>\
    <div class="modal-items">\
        <span class="row">\
            <div class="col-sm-2">필수입력</div>\
            <div class="col-sm-9">항목</div>\
        </span>\
        <template v-for="(v, index) in copyData">\
            <span class="row">\
                <div class="form-group">\
                    <div class="col-sm-2">\
                        <input type="checkbox" v-model="v.is_required" />\
                    </div>\
                    <div class="col-sm-9">\
                        <input type="text" class="form-control" v-model="v.item" />\
                    </div>\
                    <div class="col-sm-1">\
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
                        <button class="btn btn-secondary" v-on:click=layerClose>취소</button>\
                </div>\
            </div>\
        </span>\
    </div>\
</div>',
    data: function () { return { copyData : JSON.parse(JSON.stringify(this.values)) }},
    props: { values : { type : Array }  },
    methods : {
        appendItem : function(){
            this.copyData.push({item : '', is_required : true});
            var modalItems = $(this.$el).find(".modal-items");
            modalItems.animate({ scrollTop: modalItems.prop("scrollHeight")}, 100);
        }, 
        deleteItem : function (index){
            this.copyData.splice(index, 1);
        },
        regist : function() {
            var data = _.filter(this.copyData, function(item){ return item.item !== '' && item.item != null; });
            EventBus.$emit('layerClose', data);
        }, 
        layerClose : function(){
            EventBus.$emit('layerClose', null);
        }
    }
})


Vue.component('choices-com', {
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
                        <button class="btn btn-secondary" v-on:click=layerClose>취소</button>\
                </div>\
            </div>\
        </span>\
    </div>\
</div>',
    data: function () { return { copyData : JSON.parse(JSON.stringify(this.values)) } },
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
            var data = _.filter(this.copyData, function(item){ return item !== '' && item != null; });
            EventBus.$emit('layerClose', data);
        }, 
        layerClose : function(){
            EventBus.$emit('layerClose', null);
        }
    }
})