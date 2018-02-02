var Options = {
    survey : {
        title : { ko : "제목", type : "String" }, 
        description : { ko : "설명", type : "String" },
        // background_color : { ko : "바탕색", type : "Color" },
        // font_color : { ko : "글자색", type : "Color" },
        // logo_text : { ko : "로고텍스트", type : "String" },
        // logo_background_color : { ko : "로고 바탕색", type : "Color" },
        // logo_font_color : { ko : "로고 바탕색", type : "Color" }
    }, 
    page : {
        name :  { ko : "페이지명", type : "String" }
    },
    radio : {
        name :  { ko : "질문명", type : "String" },
        title :  { ko : "질문제목", type : "String" },
        description :  { ko : "질문설명", type : "String" },
        is_required :  { ko : "필수여부", type : "Boolean" },
        choices :  { ko : "건너뛰기", type : "ChoiesArray" },
        skip : { ko : "건너뛰기", type : "SkipArray" },
        other_text :  { ko : "기타이름", type : "String" },
        other_text_len :  { ko : "최대글자수", type : "Int" },
        col_count :  { ko : "열갯수", type : "Int" },
    },
    checkbox : {
        name :  { ko : "질문명", type : "String" },
        title :  { ko : "질문제목", type : "String" },
        description :  { ko : "질문설명", type : "String" },
        is_required :  { ko : "필수여부", type : "Boolean" },
        choices :  { ko : "건너뛰기", type : "ChoiesArray" },
        min_num :  { ko : "최소선택수", type : "Int" },
        max_num :  { ko : "최대선택수", type : "Int" },
        skip : { ko : "건너뛰기", type : "SkipArray" },
        other_text :  { ko : "건너뛰기", type : "String" },
        other_text_len :  { ko : "건너뛰기", type : "Int" },
        col_count :  { ko : "열갯수", type : "Int" },
    },
    rate : {
        name :  { ko : "질문명", type : "String" },
        title :  { ko : "질문제목", type : "String" },
        description :  { ko : "질문설명", type : "String" },
        is_required :  { ko : "필수여부", type : "Boolean" },
        choices :  { ko : "건너뛰기", type : "ChoiesArray" },
        max_description :  { ko : "높은표시", type : "String" },
        max_description :  { ko : "낮음표시", type : "String" },
    },
    comment : {
        name :  { ko : "질문명", type : "String" },
        title :  { ko : "질문제목", type : "String" },
        description :  { ko : "질문설명", type : "String" },
        is_required :  { ko : "필수여부", type : "Boolean" },
        rows :  { ko : "높이", type : "Int" },
    },
    text : {
        name :  { ko : "질문명", type : "String" },
        title :  { ko : "질문제목", type : "String" },
        description :  { ko : "질문설명", type : "String" },
        is_required :  { ko : "필수여부", type : "Boolean" },
        max_len :  { ko : "높이", type : "Int" },
    }
}