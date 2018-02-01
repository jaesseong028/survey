
Vue.component('choice-com', {
    template: ' <div>\
                    <input :type=inputType :name=name :id=uid :value=choice />\
                    <label :for="uid">{{choice}}</label>\
               </div>',
                data: function () { return {  } },
                props: { choice: { type: String }, name : { type : String }, index : { type : Number }, inputType : { type : String } },
                computed : {
                    uid : function() { 
                        return this.name + "_" + this._uid;
                    }
                }
})