StartTest(function(t) {
    
	t.plan(6)
    
    var async0 = t.beginAsync()
    
    use('JooseX.Class.Singleton', function () {
        
        //======================================================================================================================================================================================================================================================
        t.diag('Sanity')
        
        t.ok(JooseX.Class.Singleton, "JooseX.Class.Singleton is here")
        
        
        //======================================================================================================================================================================================================================================================
        t.diag('Creating singletons with applied traits')
        
        Role('Some.Role', {
            has : {
                anotherAttr : 'anotherValue'
            },
        
            methods : {
                anotherProcess : function () {
                    return 'anotherResult'
                }
            }
        })
        
        
        Class("Some.Class", {
            trait : JooseX.Class.Singleton,
            
            has : {
                init    : null,
                attr    : 'value'
            },
            
            methods : {
                process : function () {
                    return 'result'
                }
            }
        })
        
        
        var instance = new Some.Class({
            trait : Some.Role,
            
            init            : 'yo',
            anotherAttr     : 'yo1'
        })
        
        t.ok(instance.init == 'yo', 'Instance was created with correct arguments')
        
        t.ok(instance.anotherAttr == 'yo1', 'Attribute from trait was initialized correctly')
        t.ok(instance.attr == 'value', 'Own attribute was initialized correctly')
        
        t.ok(instance.process() == 'result', 'Own method works correctly')
        t.ok(instance.anotherProcess() == 'anotherResult', 'Method from trait works correctly')
        

        t.endAsync(async0)
    })
})    