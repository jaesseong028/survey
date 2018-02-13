
const globalVal = { control : { radio : 'radio', checkbox : 'checkbox', text : 'text', rate : 'rate', comment : 'comment', multiText : 'multiText' }, Up : 'Up', Down : 'Down', question : 'question', page : 'page', maxCreatePage : 10, emptyString : '' }
  

options = {
    survey : {
        title : { ko : "제목", type : "LongString", 필수 : true }, 
        logo_text : { ko : "로고텍스트", type : "String" },
        // logo_background_color : { ko : "로고 바탕색", type : "Color" },
        // logo_font_color : { ko : "로고 바탕색", type : "Color" }
    }, 
    page : {
        name :  { ko : "페이지명", type : "String", 필수 : true },
        description : { ko : "설명", type : "String" },
    },
    radio : {
        name :  { ko : "이름", type : "String", 필수 : true },
        title :  { ko : "제목", type : "LongString", 필수 : true },
        description :  { ko : "설명문구", type : "LongString" },
        is_required :  { ko : "필수", type : "Boolean", 필수 : true },
        choices :  { ko : "선택항목", type : "ChoiesArray", 필수 : true },
        skip : { ko : "건너뛰기", type : "SkipArray" },
        is_other : { ko : "기타선택여부", type : "Boolean", 필수 : true, default : false },
        other_text :  { ko : "기타텍스트", type : "String" },
        other_text_width :  { ko : "기타텍스트넓이", type : "Int" },
        other_text_len :  { ko : "최대글자수", type : "Int", max : 100},
        col_count :  { ko : "열갯수", type : "ShortInt",  min : 1, max : 5 },
    },
    checkbox : {
        name :  { ko : "이름", type : "String", 필수 : true },
        title :  { ko : "제목", type : "LongString", 필수 : true },
        description :  { ko : "설명문구", type : "LongString" },
        is_required :  { ko : "필수", type : "Boolean" , 필수 : true},
        choices :  { ko : "선택항목", type : "ChoiesArray", 필수 : true },
        min_num :  { ko : "최소선택수", type : "Int", min : 0 },
        max_num :  { ko : "최대선택수", type : "Int", min : 1 },
        skip : { ko : "건너뛰기", type : "SkipArray" },
        is_other : { ko : "기타선택여부", type : "Boolean", 필수 : true, default : false },
        other_text :  { ko : "기타텍스트", type : "String" },
        other_text_width :  { ko : "기타텍스트넓이", type : "Int" },
        other_text_len :  { ko : "글자제한수", type : "Int" },
        col_count :  { ko : "열갯수", type : "ShortInt", min : 1, max : 5 },
    },
    rate : {
        name :  { ko : "이름", type : "String" , 필수 : true},
        title :  { ko : "제목", type : "LongString", 필수 : true },
        description :  { ko : "설명문구", type : "LongString" },
        is_required :  { ko : "필수", type : "Boolean", 필수 : true },
        choices :  { ko : "선택항목", type : "ChoiesArray", 필수 : true },
        max_description :  { ko : "높은표시", type : "String", 필수 : true, default : "높음" },
        min_description :  { ko : "낮음표시", type : "String", 필수 : true, default : "낮음" },
    },
    comment : {
        name :  { ko : "이름", type : "String", 필수 : true },
        title :  { ko : "제목", type : "LongString", 필수 : true },
        description :  { ko : "설명문구", type : "LongString" },
        is_required :  { ko : "필수", type : "Boolean", 필수 : true },
        rows :  { ko : "입력란 높이", type : "Int", 필수 : true, min : 1,  max : 20 },
    },
    text : {
        name :  { ko : "이름", type : "String", 필수 : true  },
        title :  { ko : "제목", type : "LongString", 필수 : true },
        description :  { ko : "설명문구", type : "LongString" },
        is_required :  { ko : "필수", type : "Boolean", 필수 : true },
        max_len :  { ko : "최대 글자수", type : "Int" , 필수 : true, min : 1,  max : 100 },
    },
    multiText : {
        name :  { ko : "이름", type : "String", 필수 : true  },
        title :  { ko : "제목", type : "LongString", 필수 : true },
        description :  { ko : "설명문구", type : "LongString" },
        is_required :  { ko : "필수", type : "Boolean", 필수 : true },
        items :  { ko : "선택항목", type : "itemsArray", 필수 : true },
        max_len :  { ko : "최대 글자수", type : "Int" , 필수 : true, min : 1,  max : 100 },
        text_width :  { ko : "텍스트넓이", type : "Int" , 필수 : true, min : 1 },
        col_count :  { ko : "열갯수", type : "ShortInt", min : 1, max : 5 },
    },
    types: {
        itemsArray : "itemsArray",
        String : "String", 
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

