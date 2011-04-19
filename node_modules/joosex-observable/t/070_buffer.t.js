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
        
    }, null, { buffer : 200 })


    //======================================================================================================================================================================================================================================================
    t.diag('"Buffered" handlers')
    
    var times = 10
    
    var interval = setInterval(function () {
        
        test.fireEvent('test')
        
        if (!times--) clearInterval(interval)
        
    }, 100)
    
    
    var async1 = t.beginAsync()
    

    setTimeout(function () {
        
        t.ok(listenersCalled == 1, "Listener has been called once")
        
        t.endAsync(async1)
        t.done()
        
    }, 1500)
    
})    
