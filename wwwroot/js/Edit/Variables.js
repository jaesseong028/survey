
const globalVal = { control : { radio : 'radio', checkbox : 'checkbox', text : 'text', rate : 'rate', comment : 'comment', multiText : 'multiText' }, Up : 'Up', Down : 'Down', question : 'Question', page : 'page', maxCreatePage : 10, emptyString : '' }

options = {
    survey : {
        title : { ko : "제목", type : "LongString" }, 
        //logo_text : { ko : "로고텍스트", type : "String" },
        // logo_background_color : { ko : "로고 바탕색", type : "Color" },
        // logo_font_color : { ko : "로고 바탕색", type : "Color" }
    }, 
    page : {
        name :  { ko : "ID", type : "ReadOnlyString" },
        title : { ko : "제목", type : "LongString" }, 
        description : { ko : "설명", type : "LongString" },
    },
    radio : {
        name :  { ko : "ID", type : "ReadOnlyString" },
        title :  { ko : "제목", type : "LongString" },
        description :  { ko : "설명문구", type : "LongString" },
        is_required :  { ko : "필수", type : "Boolean" },
        choices :  { ko : "선택항목", type : "ChoiesArray" },
        skip : { ko : "건너뛰기", type : "SkipArray" },
        is_other : { ko : "기타선택여부", type : "Boolean", default : false },
        other_text :  { ko : "기타텍스트", type : "String" },
        other_text_width :  { ko : "기타텍스트넓이", type : "Int", min : 1 },
        other_text_len :  { ko : "최대글자수", type : "Int", min : 1, max : 100},
        col_count :  { ko : "열갯수", type : "ShortInt",  min : 1, max : 5 },
    },
    checkbox : {
        name :  { ko : "ID", type : "ReadOnlyString" },
        title :  { ko : "제목", type : "LongString" },
        description :  { ko : "설명문구", type : "LongString" },
        is_required :  { ko : "필수", type : "Boolean" },
        choices :  { ko : "선택항목", type : "ChoiesArray" },
        min_num :  { ko : "최소선택수", type : "Int", min : 0 },
        max_num :  { ko : "최대선택수", type : "Int", min : 1 },
        skip : { ko : "건너뛰기", type : "SkipArray" },
        is_other : { ko : "기타선택여부", type : "Boolean", default : false },
        other_text :  { ko : "기타텍스트", type : "String" },
        other_text_width :  { ko : "기타텍스트넓이", type : "Int", min : 1 },
        other_text_len :  { ko : "글자제한수", type : "Int", min : 1 },
        col_count :  { ko : "열갯수", type : "ShortInt", min : 1, max : 5 },
    },
    rate : {
        name :  { ko : "ID", type : "ReadOnlyString" },
        title :  { ko : "제목", type : "LongString" },
        description :  { ko : "설명문구", type : "LongString" },
        is_required :  { ko : "필수", type : "Boolean" },
        choices :  { ko : "선택항목", type : "ChoiesArray" },
        max_description :  { ko : "높은표시", type : "String", default : "높음" },
        min_description :  { ko : "낮음표시", type : "String", default : "낮음" },
    },
    comment : {
        name :  { ko : "ID", type : "ReadOnlyString" },
        title :  { ko : "제목", type : "LongString" },
        description :  { ko : "설명문구", type : "LongString" },
        is_required :  { ko : "필수", type : "Boolean" },
        rows :  { ko : "입력란 높이", type : "Int", min : 1,  max : 20 },
    },
    text : {
        name :  { ko : "ID", type : "ReadOnlyString"  },
        title :  { ko : "제목", type : "LongString" },
        description :  { ko : "설명문구", type : "LongString" },
        is_required :  { ko : "필수", type : "Boolean" },
        max_len :  { ko : "최대 글자수", type : "Int" , min : 1,  max : 100 },
    },
    multiText : {
        name :  { ko : "ID", type : "ReadOnlyString"  },
        title :  { ko : "제목", type : "LongString" },
        description :  { ko : "설명문구", type : "LongString" },
        is_required :  { ko : "필수", type : "Boolean" },
        items :  { ko : "선택항목", type : "itemsArray" },
        max_len :  { ko : "최대 글자수", type : "Int" , min : 1,  max : 100 },
        text_width :  { ko : "텍스트넓이", type : "Int" , min : 1 },
        col_count :  { ko : "열갯수", type : "ShortInt", min : 1, max : 5 },
    },
    types: {
        itemsArray : "itemsArray",
        String : "String", 
        ReadOnlyString : "ReadOnlyString", 
        LongString : "LongString",
        Boolean : "Boolean", 
        Int : "Int", 
        ChoiesArray : "ChoiesArray", 
        SkipArray : "SkipArray", 
        ShortInt : "ShortInt", 
    }
}

globalVal.install = function() {
    Object.defineProperty(Vue.prototype, 'GlobalValues', {
        get : function () { return globalVal }
    })
}
Vue.use(globalVal);


options.install = function() {
    Object.defineProperty(Vue.prototype, 'Options', {
        get : function () { return options }
    })
}
Vue.use(options);

