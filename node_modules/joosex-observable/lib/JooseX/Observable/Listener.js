Class('JooseX.Observable.Listener', {

    has : {
        channel     : { required : true },
        eventName   : { required : true },
        
        func        : { required : true },
        scope       : null,
        
        single          : false,
        
        buffer          : null,
        bufferMax       : null,
        
        bufferStartedAt : null,
        bufferTimeout   : null,
        
        delay           : null
    },
    
        
    methods : {
        
        activate : function (event, args) {
            var me      = this
            
            if (me.buffer != null) {
                
                if (me.bufferMax != null)
                    if (!me.bufferStartedAt) 
                        me.bufferStartedAt = new Date()
                    else
                        if (new Date - me.bufferStartedAt > me.bufferMax) return
                
                        
                if (me.bufferTimeout) clearTimeout(me.bufferTimeout)
                
                me.bufferTimeout = setTimeout(function () {
                    
                    delete me.bufferStartedAt
                    delete me.bufferTimeout
                    
                    me.doActivate(event, args)
                    
                }, me.buffer)
                
                return
            }
            
            if (me.delay != null) {
                
                setTimeout(function () {
                    
                    me.doActivate(event, args)
                }, me.delay)
                
                return
            }
            
            return me.doActivate(event, args)
        },
        
        
        doActivate : function (event, args) {
            if (this.single) this.remove()
            
            return this.func.apply(this.scope || event.source, [ event ].concat(args) ) !== false
        },
        
        
        cancel  : function () {
            if (this.buffer) {
                clearTimeout(this.bufferTimeout)
                
                delete this.bufferTimeout
                delete this.bufferStartedAt
            }
            
            if (this.delay) clearTimeout(this.delayTimeout)
        },
        
        
        remove : function () {
            this.channel.removeListener(this)
        }
    }
})


