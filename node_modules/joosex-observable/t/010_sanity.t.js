StartTest(function(t) {
    
    var async0 = t.beginAsync()
    
    use('JooseX.Observable', function () {
        
        //======================================================================================================================================================================================================================================================
        t.diag('Sanity')
        
        t.ok(JooseX.Observable, "JooseX.Observable is here")
        
        t.endAsync(async0)
        
        t.done()
    })
})    
