
Options = {
    survey : {
        title : { ko : "제목", type : "String", 필수 : true }, 
        // background_color : { ko : "바탕색", type : "Color" },
        // font_color : { ko : "글자색", type : "Color" },
        // logo_text : { ko : "로고텍스트", type : "String" },
        // logo_background_color : { ko : "로고 바탕색", type : "Color" },
        // logo_font_color : { ko : "로고 바탕색", type : "Color" }
    }, 
    page : {
        name :  { ko : "페이지명", type : "String", 필수 : true },
        description : { ko : "설명", type : "String" },
    },
    radio : {
        name :  { ko : "질문명", type : "String", 필수 : true },
        title :  { ko : "질문제목", type : "String", 필수 : true },
        description :  { ko : "질문설명", type : "String" },
        is_required :  { ko : "필수여부", type : "Boolean", 필수 : true },
        choices :  { ko : "건너뛰기", type : "ChoiesArray", 필수 : true },
        skip : { ko : "건너뛰기", type : "SkipArray" },
        other_text :  { ko : "기타이름", type : "String" },
        other_text_len :  { ko : "최대글자수", type : "Int", max : 100},
        col_count :  { ko : "열갯수", type : "Int",  min : 1, max : 5 },
    },
    checkbox : {
        name :  { ko : "질문명", type : "String", 필수 : true },
        title :  { ko : "질문제목", type : "String", 필수 : true },
        description :  { ko : "질문설명", type : "String" },
        is_required :  { ko : "필수여부", type : "Boolean" , 필수 : true},
        choices :  { ko : "건너뛰기", type : "ChoiesArray", 필수 : true },
        min_num :  { ko : "최소선택수", type : "Int" },
        max_num :  { ko : "최대선택수", type : "Int" },
        skip : { ko : "건너뛰기", type : "SkipArray" },
        other_text :  { ko : "기타", type : "String" },
        other_text_len :  { ko : "글자제한수", type : "Int" },
        col_count :  { ko : "열갯수", type : "Int", min : 1, max : 5 },
    },
    rate : {
        name :  { ko : "질문명", type : "String" , 필수 : true},
        title :  { ko : "질문제목", type : "String" , 필수 : true},
        description :  { ko : "질문설명", type : "String" },
        is_required :  { ko : "필수여부", type : "Boolean", 필수 : true },
        choices :  { ko : "건너뛰기", type : "ChoiesArray", 필수 : true },
        max_description :  { ko : "높은표시", type : "String", 필수 : true, default : "높음" },
        min_description :  { ko : "낮음표시", type : "String", 필수 : true, default : "낮음" },
    },
    comment : {
        name :  { ko : "질문명", type : "String", 필수 : true },
        title :  { ko : "질문제목", type : "String" , 필수 : true },
        description :  { ko : "질문설명", type : "String" },
        is_required :  { ko : "필수여부", type : "Boolean", 필수 : true },
        rows :  { ko : "높이", type : "Int", 필수 : true, min : 1,  max : 20 },
    },
    text : {
        name :  { ko : "질문명", type : "String", 필수 : true  },
        title :  { ko : "질문제목", type : "String", 필수 : true  },
        description :  { ko : "질문설명", type : "String" },
        is_required :  { ko : "필수여부", type : "Boolean", 필수 : true },
        max_len :  { ko : "글자제한수", type : "Int" , 필수 : true, min : 1,  max : 100 },
    },
    types: {
        String : "String", 
        Boolean : "Boolean", 
        Int : "Int", 
        ChoiesArray : "ChoiesArray", 
        SkipArray : "SkipArray", 
    }
}
