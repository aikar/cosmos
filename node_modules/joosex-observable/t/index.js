var Harness
var isNode        = typeof process != 'undefined' && process.pid

if (isNode) {
    require('Task/Test/Run/NodeJSBundle')
    
    Harness = Test.Run.Harness.NodeJS
} else 
    Harness = Test.Run.Harness.Browser.ExtJS
        
    
var INC = (isNode ? require.paths : []).concat('../lib', '/jsan')


Harness.configure({
    title     : 'JooseX.Observable Test Suite',
    
    preload : [
        "jsan:Task.Joose.Core",
        "jsan:Task.JooseX.Namespace.Depended.Auto",
        {
            text : "use.paths = " + Harness.prepareINC(INC)
        },
        
        "Task.JooseX.Observable.Core"
    ]
})


Harness.start(
    '010_sanity.t.js',
    '020_basic.t.js',
    '030_hierarchical.t.js',
    '040_bubbling.t.js',
    '050_single.t.js',
    '060_delay.t.js',
    '070_buffer.t.js',
    '071_buffer_cancel.t.js',
    '080_buffer_max.t.js',
    '081_buffer_max.t.js'
)

