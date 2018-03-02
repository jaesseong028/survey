
Vue.component('settinglayout-com', {
    template: '\
    <div>\
        <div class="setting-layout">\
            <template v-for="(option, propertyName) in Options[optionType]">\
                <span class="row">\
                    <div class="form-group text-left">\
                        <label class="col-md-5">{{option.ko}}</label>\
                        <div class="col-md-7">\
                            <string-setting-com v-if="option.type === Options.types.String" :option=option :settings=settings :property=propertyName></string-setting-com>\
                            <long-string-setting-com v-if="option.type === Options.types.LongString" :option=option :settings=settings :property=propertyName></long-string-setting-com>\
                            <checkbox-setting-com v-else-if="option.type === Options.types.Boolean" :option=option :settings=settings :property=propertyName></checkbox-setting-com>\
                            <int-setting-com v-else-if="option.type === Options.types.Int" :option=option :settings=settings :property=propertyName></int-setting-com>\
                            <drop-setting-com v-else-if="option.type === Options.types.ShortInt" :option=option :settings=settings :property=propertyName></drop-setting-com>\
                            <choice-setting-com v-else-if="option.type === Options.types.ChoiesArray" :option=option :settings=settings :property=propertyName></choice-setting-com>\
                            <items-setting-com v-else-if="option.type === Options.types.itemsArray" :option=option :settings=settings :property=propertyName></items-setting-com>\
                            <skip-setting-com v-else-if="option.type === Options.types.SkipArray" :option=option :settings=settings :property=propertyName></skip-setting-com >\
                            <readonly-string-setting-com v-else-if="option.type === Options.types.ReadOnlyString" :option=option :settings=settings :property=propertyName></readonly-string-setting-com >\
                            <template v-else />\
                        </div>\
                    </div>\
                </span>\
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

Vue.component('readonly-string-setting-com', {
    template: '\
    <div>\
        <a class="input-group" href="#">\
            <input class="form-control" v-model="settings[property]" readonly>\
            <span class="input-group-addon delete" v-on:click=deleteSetting>X</span><!-- 페이지 또는 설문일 경우 삭제 하기 버튼 활성화 -->\
        </a>\
    </div>', 
    props: { option : { type : Object }, property: { type : String}, settings : { type: Object , required : true}},
    methods : {
        deleteSetting : function(){
            this.$root.deleteSetting();
        }, 
        // onfocus : function() {
        //     if (this.property == 'name') {
        //         this.$root.focusedQeustionName = this.settings[this.property];
        //     }
        // }, 
        // onblur : function() {
        //     if (this.property == 'name') {
        //         var newValue = this.settings[this.property];
        //         var oldValue = this.$root.focusedQeustionName;
        //         var survery = this.$root.survey;
        //         for (var p=0; p < survery.pages.length; p++) {
        //             for (var e=0; e< survery.pages[p].elements.length; e++) {
        //                 /// 동일한 이름 체크 ///
        //                 if (survery.pages[p].elements[e] != this.settings) {
        //                     if (survery.pages[p].elements[e].name == newValue) {
        //                         newValue = this.$root.emptyName(this.GlobalValues.question);
        //                         this.settings[this.property] = newValue;
        //                         vue.$forceUpdate();
        //                         alert('이미 다른 곳에 사용중인 이름입니다.');
        //                     }
        //                 }
        //                 /// 동일한 이름 체크 ///
        //                 /// Skip 부분에 설문 이름이 변경 된것을 찾아 바꿔줌
        //                 if ('skip' in survery.pages[p].elements[e]) {
        //                     var idx = survery.pages[p].elements[e].skip.skipQuestionNames.indexOf(oldValue);
        //                     if (idx != -1) {
        //                         survery.pages[p].elements[e].skip.skipQuestionNames[idx] = newValue;
        //                     }
        //                 }
        //                 /// Skip 부분에 설문 이름이 변경 된것을 찾아 바꿔줌
        //             }
        //         }
        //     }
        //}
    }
});

Vue.component('string-setting-com', {
    template: '\
    <div>\
        <input class="form-control" v-model="settings[property]">\
    </div>',
    props: { option : { type : Object }, property: { type : String}, settings : { type: Object , required : true}},
})

Vue.component('long-string-setting-com', {
    template: '\
    <div>\
        <a class="input-group" href="#" v-on:click=layerOpen>\
            <input type="text" class="form-control cur" :placeholder=placeholder readonly>\
            <span class="input-group-addon">수정</span>\
        </a>\
    </div>',
    props: { option : { type : Object }, property: { type : String}, settings : { type: Object , required : true}},
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
    <div>\
        <a class="input-group" href="#" v-on:click=layerOpen>\
            <input type="text" class="form-control cur" :placeholder=placeholder readonly>\
            <span class="input-group-addon">편집</span>\
        </a>\
    </div>',
    props: { option : { type : Object }, property: { type : String}, settings : { type: Object , required : true}},
    methods : {
        layerOpen : function () {
            EventBus.$emit('layerOpen', this.settings, this.property, this.option.type, '건너뛰기 편집');
        }
    },
    computed : {
        placeholder : function() { 
            var qty = this.settings[this.property].length;
            if (qty != 0)
                return  'skips:' + qty;
        }
    }
})

Vue.component('choice-setting-com', {
    template: '\
    <div>\
        <a class="input-group" href="#" v-on:click=layerOpen>\
            <input type="text" class="form-control cur" :placeholder=placeholder readonly>\
            <span class="input-group-addon">항목</span>\
        </a>\
    </div>',
    props: { option : { type : Object }, property: { type : String}, settings : { type: Object , required : true}},
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
    <div>\
        <a class="input-group" href="#" v-on:click=layerOpen>\
            <input type="text" class="form-control cur" :placeholder=placeholder readonly>\
            <span class="input-group-addon">항목</span>\
        </a>\
    </div>',
    props: { option : { type : Object }, property: { type : String}, settings : { type: Object , required : true}},
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
    <div>\
        <div class="col-sm-8"><input type="checkbox" v-model="settings[property]"></div>\
    </div>',
    props: { option : { type : Object }, property: { type : String}, settings : { type: Object , required : true}}
})

Vue.component('int-setting-com', {
    template: '\
    <div>\
        <input class="form-control" v-model.number="settings[property]" :min="option.min" :max="option.max" type="number" />\
    </div>',
    props: { option : { type : Object }, property: { type : String}, settings : { type: Object , required : true}},  
})

Vue.component('drop-setting-com', {
    template: '\
    <div>\
        <select class="form-control cur" v-model="settings[property]">\
            <option v-for="o in selectOptions" v-bind:value="o.value">\
                {{ o.text }}\
            </option>\
        </select>\
    </div>',
    props: { option : { type : Object }, property: { type : String}, settings : { type: Object , required : true}},  
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
            <div class="col-md-12">\
                <div class="text-left">\
                    <div class="form-horizontal" v-for="c in settings.choices">\
                        <div class="form-group">\
                            <label for="input1" class="col-lg-1 control-label">{{c}}</label>\
                            <div class="col-lg-11">\
                                <select class="col-md-8" class="form-control" v-on:change="onChange($event, c)">\
                                    <option selected disabled>---선택---</option>\
                                    <option v-for="q in questions" :value=q.name>{{q.title}}</option>\
                                </select>\
                            </div>\
                            <div class="quesion-nowarp">\
                                <template v-for="s in skip" v-if="s.choice == c">\
                                    <span class="skip-question" v-for="(q, index) in s.skipQuestionNames">\
                                        {{getTitle(q)}} <span class="btn btn-default btn-xs" v-on:click="deleteQuestion(s, index)">x</span>\
                                    </span>\
                                </template>\
                            </div>\
                        </div>\
                    </div>\
                    <div class="form-horizontal" v-if="settings.is_other">\
                        <div class="form-group">\
                            <label for="input1" class="col-lg-1 control-label">{{settings.other_text}}</label>\
                            <div class="col-lg-11">\
                                <select class="col-md-8" class="form-control" v-on:change="onChange($event, settings.other_text)">\
                                    <option selected disabled>---선택---</option>\
                                    <option v-for="q in questions" :value=q.name>{{q.title}}</option>\
                                </select>\
                            </div>\
                            <div class="quesion-nowarp">\
                                <template v-for="s in skip" v-if="s.choice == settings.other_text">\
                                    <span class="skip-question" v-for="(q, index) in s.skipQuestionNames">\
                                        {{getTitle(q)}} <span class="btn btn-default btn-xs" v-on:click="deleteQuestion(s, index)">x</span>\
                                    </span>\
                                </template>\
                            </div>\
                        </div>\
                    </div>\
                </div>\
            </div>\
        </span>\
    </div>\
    <span class="row">\
    <div>\
        <div class="col-sm-12">\
            <button class="btn btn-info" v-on:click=regist>확인</button>\
            <button class="btn btn-secondary" v-on:click=layerClose>취소</button>\
        </div>\
    </div>\
    </span>\
</div>',
    data: function () { return { skip : JSON.parse(JSON.stringify(this.settingInfo)), choiceSelected : [], questionSelected : []} },
    props: { settingInfo : { type : Object }, settings : { type : Array} },
    computed : {
        questions : function() {
            var surveryPage = this.$root.selectPage;
            var dropData = [];
            for (var e=0; e< surveryPage.elements.length; e++) {
                if(surveryPage.elements[e] != this.$root.settings){
                    dropData.push ({name : surveryPage.elements[e].name, title : surveryPage.elements[e].title});
                }
            }
            return dropData;
        }
    },
    methods : {
        getTitle(qustionName){
            var surveryPage = this.$root.selectPage;
            var qEle = _.find(surveryPage.elements, function(ele){ return ele.name == qustionName}); 
            if(qEle != undefined)
                return qEle.title;
        },
        onChange : function(obj, item){
            var ctl = $(obj.target);
            var q = ctl.val();
            ctl.val('---선택---').attr("selected", "selected");
            var skipData = _.find(this.skip, function(sq){ return sq.choice == item}); 
            //[{"choice" : "의사랑", "skipQuestionNames":["question4"]}]
            if (skipData == undefined) {
                this.skip.push({choice : item, skipQuestionNames : [q]});
            }else{
                if(skipData.skipQuestionNames.indexOf(q) == -1){
                    skipData.skipQuestionNames.push(q);
                }
            }
        },
        deleteQuestion : function(skipInfo, index) {
            skipInfo.skipQuestionNames.splice(index, 1);
            if(skipInfo.skipQuestionNames.length == 0){
                this.skip.splice(this.skip.indexOf(skipInfo), 1);
            }

        },
        regist : function() {
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