Class('TestClass', {
    
    does        : JooseX.Observable,
    
    events      : [ 'add', 'remove', '/mutation/class/**' ],
    
    methods     : {
        
        select : function () {
            
            this.fireEvent('/mutation/class/create/JooseX.Observable/yo', this, 1, 2)
        },
        
        
        subscribe : function () {
            
            this.on('/mutation/class/create/JooseX.Observable/*', this.onMutataion, this, { single : true })
            
            this.on('/mutation/class/create/**', this.onMutataion2, this, { single : true })
        },
        
        
        onMutataion : function (e, self, p1, p2) {
            e.stopPropagation()
            
            e.splat // == 'yo'
        },
        

        onMutataion2 : function (e, self, p1, p2) {
            e.stopPropagation()
            
            e.splat // == [ 'JooseX.Observable', 'yo' ]
            
            e.args // ~~ [ self, p1, p2 ]
            
            e.source // source bubbling
        },
        
        
        getBubbleTarget : function () {
            return this.parent
        }
    }
})

