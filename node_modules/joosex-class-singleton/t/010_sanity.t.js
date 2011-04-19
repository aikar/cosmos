StartTest(function(t) {
    
	t.plan(15)
    
    var async0 = t.beginAsync()
    
    use('JooseX.Class.Singleton', function () {
        
        //======================================================================================================================================================================================================================================================
        t.diag('Sanity')
        
        t.ok(JooseX.Class.Singleton, "JooseX.Class.Singleton is here")
        
        
        //======================================================================================================================================================================================================================================================
        t.diag('Various ways to receive the singleton instance')
        
        
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
        
        
        var instance1 = new Some.Class({
            init    : 'yo'
        })
        
        t.ok(instance1.init == 'yo', 'Instance was created with correct arguments')
        
        
        var instance2 = new Some.Class()
        
        var instance3 = Some.Class()
        
        t.ok(instance1 == instance2 && instance2 == instance3, 'All ways ok')
        
        t.ok(instance1 instanceof Some.Class, 'its an instance of Some.Class, really #1')
        t.ok(instance1.attr == 'value', 'its an instance of Some.Class, really #2')
        t.ok(instance1.process() == 'result', 'its an instance of Some.Class, really #3')
        
        t.ok(instance1.init == 'yo', 'Instance was not reconfigured')
        
        
        //======================================================================================================================================================================================================================================================
        t.diag('Various ways to receive the singleton instance #2 + Singleton helper')

        
        Singleton("Some.Class1", {
            has : {
                init    : null,
                attr    : 'value1'
            },
            
            methods : {
                process : function () {
                    return 'result1'
                },
                
                configure : function (arg) {
                    this.init = arg
                }                
            }
        })
        
        //now instance3 goes first
        var instance3 = Some.Class1({
            init : 'yo1'
        })
        
        t.ok(instance3.init == 'yo1', 'Instance was created with correct arguments')
        
        
        var instance1 = new Some.Class1(11)
        
        t.ok(instance3.init == 11, 'Instance was reconfigured #1')
        
        
        var instance2 = new Some.Class1('yo2')
        
        t.ok(instance3.init == 'yo2', 'Instance was reconfigured #2')
        

        //======================================================================================================================================================================================================================================================
        t.diag('Various ways to receive the singleton instance #2 + Singleton helper')
        
        
        t.ok(instance1 == instance2 && instance2 == instance3, 'All ways ok #2')
        
        t.ok(instance1 instanceof Some.Class1, 'its an instance of Some.Class1, really #1')
        t.ok(instance1.attr == 'value1', 'its an instance of Some.Class1, really #2')
        t.ok(instance1.process() == 'result1', 'its an instance of Some.Class1, really #3')
        
        
        //======================================================================================================================================================================================================================================================
        t.diag('Inheritance')
        
        Class("Some.Class2", {
            isa : Some.Class
        })
        
        var instance1 = Some.Class2()
        var instance2 = new Some.Class2()
        var instance3 = new Some.Class2()
        
        
        t.ok(instance1 == instance2 && instance2 == instance3, "'Singleton-nessment' was inherited along with metaclass")
        
        
        t.endAsync(async0)
    })
})    