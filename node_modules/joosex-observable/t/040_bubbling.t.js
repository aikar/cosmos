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
    
    var target2     = new TestClass()
    
    var target1     = new TestClass({
        bubbleTarget    : target2    
    })
    
    var source      = new TestClass({
        bubbleTarget    : target1
    })
    
    var sourceListenersCalled 
    var sourceSplats          
    
    var target1ListenersCalled 
    var target1Splats
    
    var target2ListenersCalled 
    var target2Splats
    
    
    var reset = function () {
        sourceListenersCalled = [ 0, 0 ]
        sourceSplats          = [ null, null ]
        
        target1ListenersCalled = [ 0, 0 ]
        target1Splats          = [ null, null ]
        
        target2ListenersCalled = [ 0, 0 ]
        target2Splats          = [ null, null ]
    }

    
    source.on('/test/*', function (e) {
        sourceListenersCalled[ 0 ]++
        
        sourceSplats[ 0 ] = e.splat
    })

    source.on('/test/**', function (e) {
        sourceListenersCalled[ 1 ]++
        
        sourceSplats[ 1 ] = e.splat
    })
    

    
    target1.on('/test/*', function (e) {
        target1ListenersCalled[ 0 ]++
        
        target1Splats[ 0 ] = e.splat
        
        t.ok(this == source, 'Correct scope for event')
        t.ok(e.source == source, 'Correct source for event')
        t.ok(e.current == target1, 'Correct source for event')
    })

    target1.on('/test/foo', function (e) {
        target1ListenersCalled[ 1 ]++
        
        target1Splats[ 1 ] = e.splat
        
        t.ok(this == source, 'Correct scope for event')
        t.ok(e.source == source, 'Correct source for event')
        t.ok(e.current == target1, 'Correct source for event')
        
        e.stopPropagation()
    })
    
    
    
    target2.on('/**', function (e) {
        target2ListenersCalled[ 0 ]++
        
        target2Splats[ 0 ] = e.splat
        
        t.ok(this == source, 'Correct scope for event')
        t.ok(e.source == source, 'Correct source for event')
        t.ok(e.current == target2, 'Correct source for event')
        
        return false
    })

    target2.on('/test/foo', function (e) {
        target2ListenersCalled[ 2 ]++
        
        target2Splats[ 2 ] = e.splat
        
        t.ok(this == source, 'Correct scope for event')
        t.ok(e.source == source, 'Correct source for event')
        t.ok(e.current == target2, 'Correct source for event')
        
        return false
    })
    
    

    //======================================================================================================================================================================================================================================================
    t.diag('Hierarchical events')
    
    reset()
    var res = source.fireEvent('/test/bar')
    
    t.is_deeply(sourceListenersCalled, [ 1, 1 ], 'Correct listeners fired')
    t.is_deeply(sourceSplats, [ 'bar', [ 'bar' ] ], 'Correct splats received')

    t.is_deeply(target1ListenersCalled, [ 1, 0 ], 'Correct listeners fired')
    t.is_deeply(target1Splats, [ 'bar', null ], 'Correct splats received')

    
    t.is_deeply(target2ListenersCalled, [ 1, 0 ], 'Correct listeners fired')
    t.is_deeply(target2Splats, [ [ 'test', 'bar' ], null ], 'Correct splats received')
    
    t.ok(res === false, 'False returned from `target2` listener')


    //======================================================================================================================================================================================================================================================
    t.diag('Hierarchical events with `stopPropagation`')
    
    reset()
    var res = source.fireEvent('/test/foo')
    
    t.is_deeply(sourceListenersCalled, [ 1, 1 ], 'Correct listeners fired')
    t.is_deeply(sourceSplats, [ 'foo', [ 'foo' ] ], 'Correct splats received')

    t.is_deeply(target1ListenersCalled, [ 1, 1 ], 'Correct listeners fired')
    t.is_deeply(target1Splats, [ 'foo', null ], 'Correct splats received')

    
    t.is_deeply(target2ListenersCalled, [ 0, 0 ], 'Correct listeners fired')
    t.is_deeply(target2Splats, [ null, null ], 'Correct splats received')
    
    t.ok(res !== false, 'False has not been returned from `target2` listener')
    

    //======================================================================================================================================================================================================================================================
    t.diag('Hierarchical events with no listeners in the middle target')
    
    reset()
    var res = source.fireEvent('/test/baz/quix')
    
    t.is_deeply(sourceListenersCalled, [ 0, 1 ], 'Correct listeners fired')
    t.is_deeply(sourceSplats, [ null, [ 'baz', 'quix' ] ], 'Correct splats received')

    t.is_deeply(target1ListenersCalled, [ 0, 0 ], 'Correct listeners fired')
    t.is_deeply(target1Splats, [ null, null ], 'Correct splats received')

    
    t.is_deeply(target2ListenersCalled, [ 1, 0 ], 'Correct listeners fired')
    t.is_deeply(target2Splats, [ [ 'test', 'baz', 'quix' ], null ], 'Correct splats received')
    
    t.ok(res === false, 'False returned from `target2` listener')

    
    
    //======================================================================================================================================================================================================================================================
    t.diag('Removing listeners')
    
    target1.purgeListeners()
    
    
    reset()
    var res = source.fireEvent('/test/quix')
    
    t.is_deeply(sourceListenersCalled, [ 1, 1 ], 'Correct listeners fired')
    t.is_deeply(sourceSplats, [ 'quix', [ 'quix' ] ], 'Correct splats received')

    t.is_deeply(target1ListenersCalled, [ 0, 0 ], 'Correct listeners fired')
    t.is_deeply(target1Splats, [ null, null ], 'Correct splats received')

    
    t.is_deeply(target2ListenersCalled, [ 1, 0 ], 'Correct listeners fired')
    t.is_deeply(target2Splats, [ [ 'test', 'quix' ], null ], 'Correct splats received')
    
    t.ok(res === false, 'False has been returned from `target2` listener')
    
    
    t.done()
})    
