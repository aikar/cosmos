Role('JooseX.Observable.Meta', {
    
    
    has : {
        events          : null
    },
    
    
    methods : {
        
        hasEvent : function (name) {
            return this.events[ name ] != null
        },
        
        
        hasOwnEvent : function (name) {
            return this.events.hasOwnProperty(name)
        },
        
        
        supportEvent : function (name) {
        }
    },
    
    
    before : {
        
        processStem : function () {
            var superMeta = this.superClass.meta
            
            this.events = Joose.O.getMutableCopy(superMeta.events || {})
        }
    },
    
    
    stem : {
        
        has     : {
            events          : null
        },
        
        
        
        before : {
            
            reCompose : function () {
                var events          = this.events
                
                Joose.A.each(this.composedFrom, function (arg) {
                    var role = (arg.meta instanceof Joose.Managed.Class) ? arg : arg.role
                    
                    if (role.meta.meta.does(JooseX.Observable.Meta)) Joose.O.each(role.meta.events, function (event, name) {
                        
                        if (!events[ name ]) events[ name ] = event
                    })
                })
            }
        },
            
            
        after : {
            
            initialize : function () {
                if (!this.events) this.events = this.targetMeta.events || {}
            },
            
            
            deCompose : function () {
                var targetMeta      = this.targetMeta
                var events          = this.events
                
                Joose.O.eachOwn(events, function (event, name) {
                    if (event.definedIn != targetMeta) delete events[ name ]
                })
            }
            
        }
    },
    
    
    builder : {
        
        methods : {
            
            events : function (meta, info) {
                var events  = meta.events
                
                Joose.A.each(Joose.O.wantArray(info), function (name) {
                    
                    events[ name ] = { 
                        definedIn   : meta, 
                        path        : name.split('/') 
                    }
                })
            }
        }
    }
})