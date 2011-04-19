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
    
    var listenersCalled 
    var splats          
    
    
    var reset = function () {
        listenersCalled = [ 0, 0, 0, 0 ]
        splats          = [ null, null, null, null]
    }

    
    var listener0 = test.on('/test', function (e) {
        
        listenersCalled[ 0 ]++
        
        splats[ 0 ] = e.splat
    })


    var listener1 = test.on('/test/*', function (e) {
        
        listenersCalled[ 1 ]++
        
        splats[ 1 ] = e.splat
    })
    
    
    var listener2 = test.on('/test/**', function (e) {
        
        listenersCalled[ 2 ]++
        
        splats[ 2 ] = e.splat
    })
    
    
    var listener3 = test.on('/**', function (e) {
        
        listenersCalled[ 3 ]++
        
        splats[ 3 ] = e.splat
    })
    
    
    
    //======================================================================================================================================================================================================================================================
    t.diag('hasListenerFor')
    
    t.ok(test.hasListenerFor('/test'), 'Test has listeners for `test` event #1')
    t.ok(test.hasListenerFor('/test/foo'), 'Test has listeners for `test` event #2')
    t.ok(test.hasListenerFor('/test/foo/bar'), 'Test has listeners for `test` event #3')
    

    //======================================================================================================================================================================================================================================================
    t.diag('Hierarchical events')
    
    reset()
    test.fireEvent('/test')
    
    t.is_deeply(listenersCalled, [ 1, 0, 0, 1 ], 'Correct listeners fired')
    t.is_deeply(splats, [ null, null, null, [ 'test' ] ], 'Correct splats received')

    
    reset()
    test.fireEvent('/test/')
    
    t.is_deeply(listenersCalled, [ 0, 1, 1, 1 ], 'Correct listeners fired')
    t.is_deeply(splats, [ null, '', [ '' ], [ 'test', ''] ], 'Correct splats received')
    

    reset()
    test.fireEvent('/test/foo')
    
    t.is_deeply(listenersCalled, [ 0, 1, 1, 1 ], 'Correct listeners fired')
    t.is_deeply(splats, [ null, 'foo', [ 'foo' ], [ 'test', 'foo'] ], 'Correct splats received')
    

    reset()
    test.fireEvent('/test/foo/bar')
    
    t.is_deeply(listenersCalled, [ 0, 0, 1, 1 ], 'Correct listeners fired')
    t.is_deeply(splats, [ null, null, [ 'foo', 'bar' ], [ 'test', 'foo', 'bar' ] ], 'Correct splats received')
    
    
    //======================================================================================================================================================================================================================================================
    t.diag('Removing listener')
    
    test.un('/test/**', listener2.func, listener2.scope)
    test.un(listener3)

    
    reset()
    test.fireEvent('/test/baz')
    
    t.is_deeply(listenersCalled, [ 0, 1, 0, 0 ], 'Correct listeners fired')
    t.is_deeply(splats, [ null, 'baz', null, null ], 'Correct splats received')
    
    
    //======================================================================================================================================================================================================================================================
    t.diag('Purging listeners')
    
    test.purgeListeners()
    
    reset()
    test.fireEvent('/test/baz')
    
    t.is_deeply(listenersCalled, [ 0, 0, 0, 0 ], 'Correct listeners fired')
    t.is_deeply(splats, [ null, null, null, null ], 'Correct splats received')
    
    
    t.done()
})    
