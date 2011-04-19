StartTest(function(t) {
    
    //======================================================================================================================================================================================================================================================
    t.diag('Sanity')
    
    t.ok(JooseX.Observable, "JooseX.Observable is here")
    
    
    Class('TestClass', {
        
        does        : JooseX.Observable,
        
        has : {
            bubbleTarget    : { is : 'rw' }
        }
    })
    
    
    t.ok(TestClass, "TestClass has been created")
    
    
    //======================================================================================================================================================================================================================================================
    t.diag('Events')
    
    var test    = new TestClass()
    
    var listenersCalled     = 0 
    
    
    var listener0 = test.on('test', function (e) {
        
        listenersCalled++
        
    }, null, { delay : 250 })


    //======================================================================================================================================================================================================================================================
    t.diag('"Delayed" handlers')
    
    test.fireEvent('test')
    test.fireEvent('test')
    
    t.ok(!listenersCalled, "Listener hasn't been called immediately")
    
    var async1 = t.beginAsync()
    
    
    setTimeout(function () {
        
        test.fireEvent('test')
        
        t.ok(!listenersCalled, "Listener hasn't been called after 50ms")
        
    }, 50)
    

    setTimeout(function () {
        
        t.ok(listenersCalled == 3, "Listener has been called 3 times")
        
        t.endAsync(async1)
        t.done()
        
    }, 500)
    
})    
