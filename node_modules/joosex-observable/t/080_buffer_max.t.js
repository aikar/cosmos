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
    

    // should fire every 500 ms (200 + 300)
    var listener0 = test.on('test', function (e) {
        
        listenersCalled++
        
    }, null, { buffer : 200, bufferMax : 300 })


    //======================================================================================================================================================================================================================================================
    t.diag('"Buffered" handlers')
    
    var times = 15
    
    var interval = setInterval(function () {
        
        test.fireEvent('test')
        
        if (!times--) clearInterval(interval)
        
    }, 100)
    
    
    var async1 = t.beginAsync()
    
    
    setTimeout(function () {
        
        t.ok(listenersCalled == 3, "Listener has been called 3 times")
        
        t.endAsync(async1)
        t.done()
        
    }, 1700)
    
})    
