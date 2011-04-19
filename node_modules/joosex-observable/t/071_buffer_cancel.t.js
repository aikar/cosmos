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
        
    }, null, { buffer : 1000 })


    //======================================================================================================================================================================================================================================================
    t.diag('"Buffered" handlers')
    
    var times = 10
    
    var interval = setInterval(function () {
        
        test.fireEvent('test')
        
        if (!times--) clearInterval(interval)
        
    }, 100)

    
    setTimeout(function () {
        
        t.ok(!listenersCalled, "Listener hasn't been called yet")
        
        listener0.cancel()
        
    }, 1500)
    
    
    var async1 = t.beginAsync()
    

    setTimeout(function () {
        
        t.ok(!listenersCalled, "Listener hasn't been called at all")
        
        t.endAsync(async1)
        t.done()
        
    }, 2500)
    
})    
