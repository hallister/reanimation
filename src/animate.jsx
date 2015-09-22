import React from 'react';
import { bezier, spring } from './curves';
import easings from './easings';
import raf from 'raf';

let noop = function() {};

export function Animate(ComposedComponent) {
    return class animate extends React.Component {
        static displayName = ComposedComponent.displayName || ComposedComponent.name;

        static proptypes = {
            animate: React.PropTypes.bool,
            cancel: React.PropTypes.bool,
            cancelDuration: React.PropTypes.number,
            component: React.PropTypes.oneOfType([
                React.PropTypes.element,
                React.PropTypes.string
            ]),
            enter: React.PropTypes.object,
            leave: React.PropTypes.leave,
            startState: React.PropTypes.object,
            endState: React.PropTypes.object,
            onComplete: React.PropTypes.func
        };

        static defaultProps = Object.assign({}, ComposedComponent.propTypes, {
            cancelDuration: 200,
            duration: 500,
            ease: 'ease',
            onComplete: noop
        });

        constructor(props) {
            super(props);

            this.animation = null;
            this.callback = noop;
            this.start = props.startState;
            this.end = props.endState;
            this.animatingDOM = false;
            this.state = {
                animating: false,
                canceling: false,
                style: props.startState || {}
            };
        }

        componentWillReceiveProps(props) {
            if (!this.state.animating && props.animate && props.startState && props.endState) {
                this.start = props.startState;
                this.end = props.endState;
                this.duration = props.duration;
                this.ease = props.ease;

                this.animate()
            }
        }

        componentWillEnter(callback) {
            if (this.props.enter) {
                this.start = this.props.enter.from;
                this.end = this.props.enter.to;
                this.duration = this.props.enter.duration;
                this.ease = this.props.enter.ease;
                this.callback = callback;
                this.animatingDOM = true;

                this.animate();
            }
        }

        componentWillLeave(callback) {
            if (this.props.leave) {
                this.start = this.props.leave.from;
                this.end = this.props.leave.to;
                this.duration = this.props.leave.duration;
                this.ease = this.props.leave.ease;
                this.callback = callback;
                this.animatingDOM = true;

                this.animate();
            }
        }

        onComplete() {
            this.setState({
                animating: false,
                canceling: false
            });

            this.props.onComplete();
            this.callback();
        }

        render() {
            let { component, duration, startState, endState, ease, onComplete, ...other } = this.props;

            return <ComposedComponent {...other} style={this.state.style} />;
        }

        animate() {
            this.setState({
                animating: true
            });

            this.startTime = (new Date).getTime();
            this.animation = raf(this.animator.bind(this));
        }

        animator() {
            let time = (new Date).getTime();
            let delta = (time - this.startTime) / (this.duration || this.props.duration);
            let deltaState = {};

            let ease = bezier.apply(this, easings[this.ease]);

            delta = delta > 1 ? 1 : delta;

            Object.keys(this.start).forEach(prop => {
                deltaState[prop] = this.start[prop] + (this.end[prop] - this.start[prop]) * ease(delta);
            });

            this.setState(
                {
                    style: deltaState
                }
            );

            // we can only cancel if we aren't already
            if (this.props.cancel && !this.state.canceling && !this.animatingDOM) {
                raf.cancel(this.animation);

                // animate from the state we canceled at, back to the start
                this.end = this.start;
                this.start = deltaState;
                this.duration = this.props.cancelDuration;

                // prevent canceling from doing anything
                this.setState(
                    {
                        canceling: true
                    }
                );

                this.animate();
            } else if (delta >= 1) {
                raf.cancel(this.animation);

                this.onComplete();
            } else {
                this.animation = raf(this.animator.bind(this));
            }
        }
    };
}