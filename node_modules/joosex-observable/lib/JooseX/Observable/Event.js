Class('JooseX.Observable.Event', {
    
    has : {
        name        : { required : true },
        args        : { required : true },
        
        source      : { required : true },
        
        splat       : null,
        current     : null,
        
        bubbling    : true
    },
    
        
    methods : {
        
        stopPropagation : function () {
            this.bubbling = false
        }
    }
})


