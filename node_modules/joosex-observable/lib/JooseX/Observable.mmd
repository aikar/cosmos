Name
====

JooseX.Observable - cross-plaform implementation of the Observable pattern


SYNOPSIS
========

        // Simple events

        Class('My.Class', {
            does    : JooseX.Observable
        })
        
        
        var instance = new My.Class()
        
        var handler     = function (event, param1, param2) {
            // event.source == instance
            // param1       == 'foo'
            // param2       == 'bar'
        }
        
        
        instance.on('event', handler, scope, { single : true, delay : 100 }) 
        
        instance.fireEvent('event', 'foo', 'bar')
        

        // Hierarchical events #1
        
        var handler     = function (event, param1, param2) {
            // event.source == instance
            // event.splat  == 'event'
            
            // param1       == 'foo'
            // param2       == 'bar'
        }
        

        instance.on('/some/*', handler, scope, { single : true, buffer : 100 }) 
        
        instance.emit('/some/event', 'foo', 'bar')
        
        
        // Hierarchical events #2
        
        var handler     = function (event, param1, param2) {
            // event.source == instance
            // event.splat  == [ 'long', 'event' ]
            
            // param1       == 'foo'
            // param2       == 'bar'
        }
        

        instance.on('/some/**', handler, scope, { single : true, buffer : 100 }) 
        
        instance.fireEvent('/some/long/event', 'foo', 'bar')
        
        
        // Bubbling
        
        Class('Container', {
            does    : JooseX.Observable
        })
        

        Class('Component', {
            does    : JooseX.Observable,
            
            has     : {
                parentContainer : { required : true }
            },
            
            methods : {
                
                getBubbleTarget : function () {
                    return this.parentContainer
                }
            }
        })
        
        var container   = new Container()
        
        var component   = new Component({
            parentContainer : container
        })

        
        
        var handler     = function (event, param1, param2) {
            // event.source     == component
            // event.current    == container
            
            event.stopPropagation() // stop further bubbling
        }
        

        container.on('/some/**', handler, scope, { single : true, buffer : 100 }) 
        
        component.fireEvent('/some/long/event', 'foo', 'bar')
        


INSTALLATION
============

From `npm`:
    
    > [sudo] npm install joosex-observable         

Tarballs are available for downloading at: <http://search.npmjs.org/#/joosex-observable>


SETUP
=====

In NodeJS:

    require('task-joose-nodejs')
    require('joosex-observable')
    
    
In browsers (assuming you've completed the 3.1 item from this [document](http://joose.github.com/Joose/doc/html/Joose/Manual/Installation.html)):

    <script type="text/javascript" src="/jsan/Task/Joose/Core.js"></script>
    <script type="text/javascript" src="/jsan/Task/JooseX/Observable/Core.js"></script>


DESCRIPTION
===========

`JooseX.Observable` is a Joose role, implementing the Observable pattern. To use it, just add it to your class declaration:

        Class('My.Class', {
            does    : JooseX.Observable
        })
        

In Observable pattern, class instances may notify the world about the changes in its state with "events". 
One can say instance "fire" or "emit" the events. Other instances may "observe" such notifications ("listen to events").

To fire (emit) the event use `fireEvent` or `emit` methods (both are identical): 
        
        var instance = new My.Class()
        
        instance.fireEvent('event', 'foo', 'bar')

The first argument to this method is the event name, all other arguments becomes the arguments of the event and will be available in the listeners.

To listen the event, use the method `on`:

        var handler     = function (event, param1, param2) {
            // event.source == instance
            // param1       == 'foo'
            // param2       == 'bar'
        }
        
        var listener = instance.on('event', handler, scope, { single : true, delay : 100 }) 

This method accept the event name, handler function, optional scope and optional options (see below for details). It returns the "listener" instance.

Each time the event being fired, all listeners with matching name will be activated. Their handler functions will always receive the instance of event as the 1st argument
(see above) and then other arguments from `fireEvent`. The object, which fired the event is available as the `source` property of the event. 

To remove the listener you can either pass it to the method `un`:

        instance.un(listener)
        
or call its `remove` method:

        listener.remove()

or still use the `un` specifying the same handler and scope as during `on`:

        instance.un('event', handler, scope)


EVENTS HIERARCHY
================

If the event name will contain slash(es) `/`, then it will be considered hierarchical. Hierarchical events behaves pretty much the same as usual events, with couple of additional features.

The very last segment of the event name will be treated as the "event name". Other segments will be treated as the "event channel". For example:

    // fires the event "foo" in the channel "/"
    instance.fireEvent('/foo')


    // fires the event "bar" in the channel "/foo"
    instance.fireEvent('/foo/bar')


    // fires the event "" (empty string) in the channel "/foo/bar"
    instance.fireEvent('/foo/bar/')

The same rules applies for the listeners, plus you can use the `*` and `**` wildcards:

    // will be activated by "/foo" only
    instance.on('/foo')


    // will be activated by "/foo/bar" only
    instance.on('/foo/bar')


    // will be activated by "/foo/bar", "/foo/baz", "/foo/" (empty string)
    // but not by "/foo/bar/baz" or "/bar"
    instance.on('/foo/*')

    
    // will be activated by "/foo/bar", "/foo/baz", "/foo/" (empty string), "/foo/bar/baz", "/foo/bar/baz/quix" etc
    // but not by "/bar"
    instance.on('/foo/**')
    
Hierarchical events are useful, when instance may emit *a lot* of different events, which can be categorized in groups, and listeners
need the ability to listen on the whole group of events.

See also [JooseX.Observable.Event](Observable/Event.html) documentation to know how to introspect the `event` instance.


EVENTS BUBBLING
===============

Additionally, all events bubbles (a-la DOM). This is useful, when the instance participate in the nested "part/whole" relationships and 
the "whole" needs to listen the events from the inner "parts". 

To use this feature, provide the implementation of the `getBubbleTarget` method in the consuming class:

        Class('Component', {
            does    : JooseX.Observable,
            
            methods : {
                
                getBubbleTarget : function () {
                }
            }
        })

In the handler, you may call the `stopPropagation` method of the event, to stop bubbling:

        var handler     = function (event, param1, param2) {
            // event.source     == component
            // event.current    == container
            
            event.stopPropagation() // stop further bubbling
        }
        
See also [JooseX.Observable.Event](Observable/Event.html) documentation.


ATTRIBUTES
==========

### suspendCounter

> `Number suspendCounter`

> Initially set to 0. When this attribute is bigger than 0 the instance won't emit any events.



METHODS
=======

### on

> `on(eventName, func, scope?, options?)`

> This method creates a new listener for the event `eventName`. Listener will activate the function `func` using either provided `scope` or the
event source as the scope. Optional `options` parameter should contain object with properties, corresponding to attributes of [JooseX.Observable.Listener](Observable/Listener.html) 

> Returns an instance of [JooseX.Observable.Listener](Observable/Listener.html)

### un

> `un(eventName, func, scope)`

> `un(listener)`

> This method will remove the listener from this instance. Either accept an instance of [JooseX.Observable.Listener](Observable/Listener.html) or the same arguments as
were used for `on`


### emit
### fireEvent

> `emit(eventName, param1, param2, ...)`

> `fireEvent(eventName, param1, param2, ...)`

> These methods are identical and both "fires" the event (activates all listeners with names matching to `eventName`). The handlers of the listeners will receive the
instance of [JooseX.Observable.Event](Observable/Event.html) as the 1st argument and the remaining parameters as other arguments 


### hasListenerFor

> `hasListenerFor(eventName)`

> Returns boolean value, indicating whether this instance has listeners for the `eventName`. `eventName` may contain `*` and `**` wildcards.  


### purgeListeners

> `purgeListeners()`

> Removes all listeners  
        

### suspendEvents

> `suspendEvents()`

> This method increase the [suspendCounter] attribute and prevents any events from being emitted  


### resumeEvents

> `resumeEvents()`

> This method decrease the [suspendCounter] attribute. As soon as it becomes 0 again, instance can emit events.  




GETTING HELP
============

This extension is supported via github issues tracker: <http://github.com/SamuraiJack/JooseX-Observable/issues>

For general Joose questions you can also visit [#joose](http://webchat.freenode.net/?randomnick=1&channels=joose&prompt=1) 
on irc.freenode.org or mailing list at: <http://groups.google.com/group/joose-js>
 


SEE ALSO
========

[JooseX.Observable.Listener](Observable/Listener.html)

[JooseX.Observable.Event](Observable/Event.html)

Web page of this module: <http://github.com/SamuraiJack/JooseX-Observable/>

General documentation for Joose: <http://joose.github.com/Joose/>


BUGS
====

All complex software has bugs lurking in it, and this module is no exception.

Please report any bugs through the web interface at <http://github.com/SamuraiJack/JooseX-Observable/issues>



AUTHORS
=======

Nickolay Platonov <nplatonov@cpan.org>





COPYRIGHT AND LICENSE
=====================

This software is Copyright (c) 2010 by Nickolay Platonov.

This is free software, licensed under:

  The GNU Lesser General Public License, Version 3, June 2007
