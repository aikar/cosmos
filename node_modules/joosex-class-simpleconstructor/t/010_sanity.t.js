StartTest(function(t) {
    
	t.plan(6)
    
    var async0 = t.beginAsync()
    
    use('JooseX.Class.SimpleConstructor', function () {
        
        //======================================================================================================================================================================================================================================================
        t.diag('Sanity')
        
        t.ok(JooseX.Class.SimpleConstructor, "JooseX.Class.SimpleConstructor is here")
        
        
        Class('Some.Class', {
            
            trait : JooseX.Class.SimpleConstructor,
            
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
        
        
        var instance1 = Some.Class({
            init    : 'yo'
        })
        
        t.ok(instance1 instanceof Some.Class, 'InstanceOf for simplified constructors is correct')
        
        t.ok(instance1.init == 'yo', 'Instance was created with correct arguments')
        
        
        
        var instance2 = new Some.Class()
        
        t.ok(instance2 instanceof Some.Class, 'Simplified constructor can be used as usual')
        
        t.ok(instance1 != instance2, 'Instances are different')
        
        
        
        //======================================================================================================================================================================================================================================================
        t.diag('Inheritance')
        
        Class("Some.Class2", {
            isa : Some.Class
        })
        
        var instance3 = Some.Class2()
        
        
        t.ok(instance3 instanceof Some.Class2, "'Simple-constructor-ness' was inherited along with metaclass")
        
        
        t.endAsync(async0)
    })
})    