Role('JooseX.Attribute.Delegate', {
    
    have : {
        handles : null
    },
    
    
    override : {
        
        eachDelegate : function (handles, func, scope) {
            if (typeof handles == 'string') return func.call(scope, handles, handles)
            
            if (handles instanceof Array)
                return Joose.A.each(handles, function (delegateTo) {
                    
                    func.call(scope, delegateTo, delegateTo)
                })
                
            if (handles === Object(handles))
                Joose.O.eachOwn(handles, function (delegateTo, handleAs) {
                    
                    func.call(scope, handleAs, delegateTo)
                })
        },
        
        
        getAccessorsFor : function (targetClass) {
            var targetMeta  = targetClass.meta
            var methods     = this.SUPER(targetClass)
            
            var me      = this
            
            this.eachDelegate(this.handles, function (handleAs, delegateTo) {
                
                if (!targetMeta.hasMethod(handleAs)) {
                    var handler = methods[ handleAs ] = function () {
                        var attrValue = me.getValueFrom(this)
                        
                        return attrValue[ delegateTo ].apply(attrValue, arguments)
                    }
                    
                    handler.ACCESSOR_FROM = me
                }
            })
            
            return methods
        },
        
        
        getAccessorsFrom : function (from) {
            var methods = this.SUPER(from)
            
            var me          = this
            var targetMeta  = from.meta
            
            this.eachDelegate(this.handles, function (handleAs) {
                
                var handler = targetMeta.getMethod(handleAs)
                
                if (handler && handler.value.ACCESSOR_FROM == me) methods.push(handleAs)
            })
            
            return methods
        }
    }
})

/**

Name
====


JooseX.Attribute.Delegate - map a method to the method of the attribute 


SYNOPSIS
========

            Class('Some.Class', { 
                
                has : {
                
                    someAttr1 : {
                        handles : 'commonMethod'
                    },
                    
                    // or
                
                    someAttr2 : {
                        handles : [ 'commonMethod1', 'commonMethod2' ]
                    },
                    
                    // or
                    
                    someAttr3 : {
                        handles : {
                            classMethod : 'attributeMethod'
                        }
                    }
                }
            })
            
            var instance = new Some.Class()
            
            
            var a = instance.classMethod('foo', 'bar')
            var b = instance.commonMethod('bar', 'baz') 
            
            // eqivalent to

            var a = instance.someAttr3.attributeMethod('foo', 'bar')
            var b = instance.someAttr1.commonMethod('bar', 'baz')


WHAT IS DELEGATION?
===================

Delegation is a feature that lets you create "proxy" methods that do nothing more than call some other method on an attribute. 
This is quite handy since it lets you simplify a complex set of "has-a" relationships and present a single unified API from one class.

With delegation, consumers of a class don't need to know about all the objects it contains, reducing the amount of API they need to learn.

Delegations are defined as a mapping between one or more methods provided by the "real" class (the delegatee), and a set of corresponding methods in the delegating class. 
The delegating class can re-use the method names provided by the delegatee or provide its own names.


DEFINING A MAPPING
==================

In the simplest form mapping is a string, which corresponds to the proxy method name.

        has : {
            someAttr : 'method'
        }


Its possible to specify an array with the method names:

        has : {
            someAttr : {
                handles : [ 'method1', 'method2' ]
            }
        }

For each array entry, in the class consuming the attribute, will be created a proxy method. This method will delegate to the method of the attribute with the same name.

Its possible to rename methods during mapping, supplying the mapping value as object:
  
        has : {
            someAttr : {
            
                handles : {
                    proxyMethod : 'methodOfTheAttribute'
                }
            }
        }


SEE ALSO
========

[Main documentation page](../Attribute.html)



AUTHORS
=======

Nickolay Platonov <nplatonov@cpan.org>



COPYRIGHT AND LICENSE
=====================

Copyright (c) 2009, Nickolay Platonov

All rights reserved.

Redistribution and use in source and binary forms, with or without modification, are permitted provided that the following conditions are met:

* Redistributions of source code must retain the above copyright notice, this list of conditions and the following disclaimer.
* Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.
* Neither the name of Nickolay Platonov nor the names of its contributors may be used to endorse or promote products derived from this software without specific prior written permission. 

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE. 


*/;
Role('JooseX.Attribute.Trigger', {
    
    have : {
        trigger        : null
    }, 

    
    after : {
        initialize : function() {
            if (this.trigger) {
                if (!this.writeable) throw new Error("Can't use `trigger` for read-only attributes")
                
                this.hasSetter = true
            }
        }
    },
    
    
    override : {
        
        getSetter : function() {
            var original    = this.SUPER()
            var trigger     = this.trigger
            
            if (!trigger) return original
            
            var me      = this
            var init    = Joose.O.isFunction(me.init) ? null : me.init
            
            return function () {
                var oldValue    = me.hasValue(this) ? me.getValueFrom(this) : init
                
                var res         = original.apply(this, arguments)
                
                trigger.call(this, me.getValueFrom(this), oldValue)
                
                return res
            }
        }
    }
})    


/**

Name
====


JooseX.Attribute.Trigger - call a function after attribute has been changed via setter call


SYNOPSIS
========

            Class('Some.Class', { 
                has : {
                    someAttribuute : {
                        init : 'foo',
                        
                        trigger : function (newValue, oldValue) {
                            this.triggerCalled = true
                        } 
                    }
                }
            })
            
            var instance = new Some.Class()
            
            instance.triggerCalled == false //trigger wasn't called yet
            
            instance.setSomeAttibute('bar')
            
            instance.triggerCalled == true //trigger was called


DESCRIPTION
===========

`JooseX.Attribute.Trigger` is a role, which triggers a function call, after an attribute was changed via setter call.

It is called as a method (in the scope of the instance), and receives the new value as 1st argument, and old value as 2nd. 

Trigger is also called when an attribute's value is passed to the constructor.

**Note**, that trigger will not be called for the value of attribute's `init` option, as it only translates the value to the prototype of the class 


SEE ALSO
========

[Main documentation page](../Attribute.html)



AUTHORS
=======

Nickolay Platonov <nplatonov@cpan.org>



COPYRIGHT AND LICENSE
=====================

Copyright (c) 2009, Nickolay Platonov

All rights reserved.

Redistribution and use in source and binary forms, with or without modification, are permitted provided that the following conditions are met:

* Redistributions of source code must retain the above copyright notice, this list of conditions and the following disclaimer.
* Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.
* Neither the name of Nickolay Platonov nor the names of its contributors may be used to endorse or promote products derived from this software without specific prior written permission. 

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE. 


*/;
Role('JooseX.Attribute.Lazy', {
    
    
    have : {
        lazy        : null
    }, 
    
    
    before : {
        computeValue : function () {
            if (typeof this.init == 'function' && this.lazy) {
                this.lazy = this.init    
                delete this.init    
            }
        }
    },
    
    
    after : {
        initialize : function () {
            if (this.lazy) this.readable = this.hasGetter = true
        }
    },
    
    
    override : {
        
        getGetter : function () {
            var original    = this.SUPER()
            var lazy        = this.lazy
            
            if (!lazy) return original
            
            var me      = this    
            
            return function () {
                if (!me.hasValue(this)) {
                    var initializer = typeof lazy == 'function' ? lazy : this[ lazy.replace(/^this\./, '') ]
                    
                    me.setValueTo(this, initializer.call(this, me))
                }
                
                return original.call(this)    
            }
        }
    }
})


/**

Name
====


JooseX.Attribute.Lazy - a role, deferring the attribute initialization untill first call to getter


SYNOPSIS
========

            Class('Some.Class', { 
                has : {
                    lazyAttribute : {
                        init : function () {
                            return this.someCostlyComputation()
                        },
                        
                        lazy : true
                    },
                    
                    // -or-
                    
                    lazyAttribute : {
                        lazy : function () {
                            return this.someCostlyComputation()
                        }
                    },
                    
                    // -or-
                    
                    lazyAttribute : {
                        lazy : 'this.someCostlyComputation'
                    },
                    
                    // -or-
                    
                    lazyAttribute : {
                        lazy : 'someCostlyComputation'
                    }
                },
                
                
                methods : {
                    someCostlyComputation : function () {
                        ...
                    }
                }
            })
            
            var instance = new Some.Class()
            
            instance.lazyAttribute == undefined // true, initializer of lazy attribute wasn't called yet
            
            var lazy = instance.getLazyAttibute()
            
            instance.lazyAttribute != undefined // true, initializer of lazy attribute was called


DESCRIPTION
===========

Joose lets you defer attribute population by making an attribute lazy (see the [Synopsis][] for syntax) 

When `lazy` flag is set, the default is not generated until the getter method is called, rather than at object construction time. 
There are several reasons you might choose to do this.

First, if the default value for this attribute depends on some other attributes, then the attribute must be lazy. 
During object construction, defaults are not generated in a predictable order, so you cannot count on some other attribute being populated when generating a default.

Second, there's often no reason to calculate a default before it's needed. Making an attribute lazy lets you defer the cost until the attribute is needed. 
If the attribute is never needed, you save some CPU time.


SEE ALSO
========

[Main documentation page](../Attribute.html)



AUTHORS
=======

Nickolay Platonov <nplatonov@cpan.org>



COPYRIGHT AND LICENSE
=====================

Copyright (c) 2009, Nickolay Platonov

All rights reserved.

Redistribution and use in source and binary forms, with or without modification, are permitted provided that the following conditions are met:

* Redistributions of source code must retain the above copyright notice, this list of conditions and the following disclaimer.
* Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.
* Neither the name of Nickolay Platonov nor the names of its contributors may be used to endorse or promote products derived from this software without specific prior written permission. 

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE. 


*/
;
Role('JooseX.Attribute.Accessor.Combined', {
    
    
    have : {
        isCombined        : false
    }, 
    
    
    after : {
        initialize : function() {
            this.isCombined = this.isCombined || /..c/i.test(this.is)
            
            if (this.isCombined) {
                this.slot = '$$' + this.name
                
                this.hasGetter = true
                this.hasSetter = false
                
                this.setterName = this.getterName = this.publicName
            }
        }
    },
    
    
    override : {
        
        getGetter : function() {
            var getter    = this.SUPER()
            
            if (!this.isCombined) return getter
            
            var setter    = this.getSetter()
            
            var me = this
            
            return function () {
                
                if (!arguments.length) {
                    if (me.readable) return getter.call(this)
                    throw new Error("Call to getter of unreadable attribute: [" + me.name + "]")
                }
                
                if (me.writeable) return setter.apply(this, arguments)
                
                throw new Error("Call to setter of read-only attribute: [" + me.name + "]")    
            }
        }
    }
    
})


/**

Name
====


JooseX.Attribute.Accessor.Combined - a role, combining setter and getter methods into one, ala perl


SYNOPSIS
========

            Class('Some.Class', { 
                has : {
                    attr : {
                        is : 'rwc',
                        
                        init : 'some init value'
                    }
                }
            })
            
            var instance = new Some.Class()
            
            instance.attr() == 'some init value'  // call to combined accessor as getter
            
            instance.attr('some other value')     // call to combined accessor as setter
            
            instance.attr() == 'some other value' // attribute was changed


DESCRIPTION
===========

This role combines the getter and setter methods into one, having the same name as attribute itself.

Call this method without arguments will be directed to the actual getter call.

Call with some arguments provided will be directed to setter call.

Its safe to combine this role with Lazy and Trigger, but it should be applied after them.


USAGE
=====

To enable this role provide the trailing `c` character in attribute's `is` option: 

            has : {
                attr : {
                    is : 'rwc',
                    
                    init : 'some init value'
                }
            }
            
Alternatively, explicitly specify `isCombined` option with some `true` value:

            has : {
                attr : {
                    is : 'rw',
                    
                    isCombined : true,
                    
                    init : 'some init value'
                }
            }
            

SEE ALSO
========

[Main documentation page](../../Attribute.html)



AUTHORS
=======

Nickolay Platonov <nplatonov@cpan.org>



COPYRIGHT AND LICENSE
=====================

Copyright (c) 2009, Nickolay Platonov

All rights reserved.

Redistribution and use in source and binary forms, with or without modification, are permitted provided that the following conditions are met:

* Redistributions of source code must retain the above copyright notice, this list of conditions and the following disclaimer.
* Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.
* Neither the name of Nickolay Platonov nor the names of its contributors may be used to endorse or promote products derived from this software without specific prior written permission. 

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE. 


*/
;
Joose.Managed.Attribute.meta.extend({
    does : [ JooseX.Attribute.Delegate, JooseX.Attribute.Trigger, JooseX.Attribute.Lazy, JooseX.Attribute.Accessor.Combined ]
})            


/**

Name
====


JooseX.Attribute - Additional features for Joose attributes


SYNOPSIS
========

Setup for browsers:

        <!-- Joose  -->
        <script type="text/javascript" src="/jsan/Task/Joose/Core.js"></script>
        
        <!-- Bootstraping Joose attributes with additional features -->
        <script type="text/javascript" src="/jsan/Task/JooseX/Attribute/Bootstrap.js"></script>

Setup for NodeJS:

            // this extension is bundled into the following package
            require('task-joose-nodejs')


INSTALLATION
============

From `npm`:
    
    > [sudo] npm install joosex-attribute         


DESCRIPTION
===========

`JooseX.Attribute` is a collection of meta-roles for Joose attributes, which enhance them with advanced features.

To use the new features, add the bootstraping source file as in Synopsis.

If the followin links in this document aren't work correctly, [open it from here](http://samuraijack.github.com/JooseX-Attribute)


Please refer to documentation of each role for details:

> - [JooseX.Attribute.Delegate](Attribute/Delegate.html)

> - [JooseX.Attribute.Trigger](Attribute/Trigger.html)

> - [JooseX.Attribute.Lazy](Attribute/Lazy.html)

> - [JooseX.Attribute.Accessor.Combined](Attribute/Accessor/Combined.html)


GETTING HELP
============

This extension is supported via github issues tracker: <http://github.com/SamuraiJack/JooseX-Attribute/issues>

You can also ask questions at IRC channel : [#joose](http://webchat.freenode.net/?randomnick=1&channels=joose&prompt=1)
 
Or the mailing list: <http://groups.google.com/group/joose-js>
 


SEE ALSO
========

Web page of this module: <http://github.com/SamuraiJack/JooseX-Attribute/>

General documentation for Joose: <http://joose.github.com/Joose>


BUGS
====

All complex software has bugs lurking in it, and this module is no exception.

Please report any bugs through the web interface at <http://github.com/SamuraiJack/JooseX-Attribute/issues>



AUTHORS
=======

Nickolay Platonov <nplatonov@cpan.org>



COPYRIGHT AND LICENSE
=====================

Copyright (c) 2009, Nickolay Platonov

All rights reserved.

Redistribution and use in source and binary forms, with or without modification, are permitted provided that the following conditions are met:

* Redistributions of source code must retain the above copyright notice, this list of conditions and the following disclaimer.
* Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.
* Neither the name of Nickolay Platonov nor the names of its contributors may be used to endorse or promote products derived from this software without specific prior written permission. 

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE. 


*/
;
