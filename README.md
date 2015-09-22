# reanimation

### An animation library for React

---

### Why?

*reanimation* was developed specifically to solve a few problems:

* Composition over Mixins
* Support state-based animations
* Support enter/leave animations
* Avoid the DOM

There are a number of other libraries that solve similar problems in similar ways (including 
[react.animate](https://github.com/pleasetrythisathome/react.animate), which much of this library was based on). 

### Examples

*reanimation* works two ways: state-based animations and leave/enter animations. Both cases will use `TestComponent` as 
the component we would liketo animate:


```javascript
import { Animate } from 'reanimation';

@Animate
export default class TestComponent extends React.Component {
	render() {
    	return (
        	<div style={this.props.style}>{this.props.children}</div>
        )
    }
}
```

#### State-Based

The first example is state-based animations. We use these animations when we want animations to respond to some change 
in state. Animations will animate when the `animate` prop is true ***and*** an existing animation isn't running.

```javascript
import TestComponent from './test';

export default class App extends React.Component {     
    onComplete() {
        this.setState({
            doAnimation: false
        });
    }
    
    render() {
    	return(
        	<TestComponent 
                animate={this.state.doAnimation} 
            	startState={this.start} 
                endState={this.end} 
                duration={this.duration}
                easing={this.easing}
                onComplete={this.onComplete.bind(this)}
            >
				I can animate!
            </TestComponent>
		);
    }
}
```

The `startState` and `endState` prop is an object of *style* properties for javascript. For example, a fade-in would 
look like: 

```javascript
...
constructor(props) {
	super(props);
    
    this.start = {
    	opacity: 0
    }
    
    this.end = {
    	opacity: 1
    }

}
...

```

Not that you may want to change `this.start` and `this.end` to reflect the next animation, in addition to setting 
`this.state.doAnimation` to false.

### DOM-based

DOM-based animations function based on `ReactTransitionGroup`, allowing us to animate when the component is prepared to 
leave the DOM (without it leaving first).

```javascript
import TestComponent from './test';
import Animations from 'reanimation';

export default class App extends React.Component {     
    onComplete() {
        this.setState({
            doAnimation: false
        });
    }
    
    onAddItem() {
    	let items = this.state.items;
        
        items.push(
        	<TestComponent key={this.state.items.length} />
        );
        
        this.setState({
        	items: items
        });
    }
    
    render() {
    	return(
            <Animations 
            	enter={this.enter} 
            	leave={this.leave}
            >
            	{this.state.items}
            </Animations>
		);
    }
}
```

In our enter/leave animation, the Animations take two properties: `enter` and `leave`. Both are objects with the 
following shape:

```javascript
{
	duration: Number,
    ease: Easing,
    from: {
    	styleProperty: Number
    },
    to: {
    	styleProperty: Number
    }
}
```

Neither property is required, allowing you to dictate which DOM modification requires animation. In order for 
enter/leave animations to function, they **must** be a child of the `Animations` component and they **must** have a 
unique key.

### Easings

Currently, the library supports the `in` `out` and `in/out` variations of the `circ`, `cubic`, `expo`, `sine`, `quad`, 
`quart` and `quint` bezier curve functions. Easings use the following format:

`(in-)?(out-)?-function` (for example `in-quint`, `out-quint`, `in-out-quint` are valid).

Additionally the library supports the CSS `ease` transitions as `ease`, `in-ease`, `out-ease` and`in-out-ease`.

Finally, added support is available for `linear`, `swing` and `spring` functions, as well as an `ios-scroll` animation.

The bezier curve functions are generated using Gaetan Renaudeau amazing 
[bezier function generator](https://github.com/gre/bezier-easing).
Additional animations will be made available via Koen Bok's spring function generator in 
[Framer.js](http://framerjs.com/).


### Dependencies:

 * [raf](https://github.com/chrisdickinson/raf) requestAnimationFrame polyfill.
 * [ReactTransitionGroup](https://www.npmjs.com/package/react-addons-transition-group) the core library 
 ReactCSSTransitionGroup is based on and the reason enter/leave animations work.

### Thanks

* [react.animate](https://github.com/pleasetrythisathome/react.animate) A nifty mixin for easy animations which spawned 
the initial idea for this library.
* [Velocity.js](http://julian.com/research/velocity/) A performant javascript-based animation library that made 
libraries like this one possible.
* [Higher-order functions](https://gist.github.com/sebmarkbage/ef0bf1f338a7182b6775) A simple example of Higher Order
 Components by Sebastian Markbåge.