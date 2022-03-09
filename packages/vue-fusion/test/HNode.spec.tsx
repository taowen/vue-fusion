import * as vue from '@vue/runtime-core';
import * as renderer from '../src';

test('single child', () => {
    const app = renderer.createApp(vue.defineComponent({
        render() {
            return 'hello'
        }
    }));
    const root = renderer.nodeOps.createElement('div');
    app.mount(root);
    expect(renderer.toMpData(root)).toEqual({
        tag: 'div',
        children: [{
            tag: 'fragment',
            children: ['hello']
        }]
    })
})

test('2 layers', () => {
    const app = renderer.createApp(vue.defineComponent({
        render() {
            return <span>hello</span>
        }
    }));
    const root = renderer.nodeOps.createElement('div');
    app.mount(root);
    expect(renderer.toMpData(root)).toEqual({
        tag: 'div',
        children: [{
            tag: 'fragment',
            children: [{
                tag: 'span',
                children: ['hello']
            }]
        }]
    })
})

test('9 layers', () => {
    const app = renderer.createApp(vue.defineComponent({
        render() {
            return <div>
                <div>
                    <div>
                        <div>
                            <div>
                                <div>
                                    <div>
                                        <div>
                                            hello
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        }
    }));
    const root = renderer.nodeOps.createElement('div');
    app.mount(root);
    expect(renderer.toMpData(root)).toEqual({
        tag: 'div',
        children: [{
            tag: 'fragment',
            children: [{
                tag: 'div',
                children: [{
                    tag: 'div',
                    children: [{
                        tag: 'div',
                        children: [{
                            tag: 'div',
                            children: [{
                                tag: 'fragment',
                                children: [{
                                    tag: 'div',
                                    children: [{
                                        tag: 'div',
                                        children: [{
                                            tag: 'div',
                                            children: [{
                                                tag: 'div',
                                                children: [{
                                                    tag: 'fragment',
                                                    children: ['hello']
                                                }]
                                            }]
                                        }]
                                    }]
                                }]
                            }]
                        }]
                    }]
                }]
            }]
        }]
    })
})

test('9 children', () => {
    const app = renderer.createApp(vue.defineComponent({
        render() {
            return <>
                <span>1</span>
                <span>2</span>
                <span>3</span>
                <span>4</span>
                <span>5</span>
                <span>6</span>
                <span>7</span>
                <span>8</span>
                <span>9</span>
            </>
        }
    }));
    const root = renderer.nodeOps.createElement('div');
    app.mount(root);
    expect(renderer.toMpData(root)).toEqual({
        tag: 'div',
        children: [{
            tag: 'fragment',
            children: [
                '',
                {
                    tag: 'span',
                    children: ['1']
                },
                {
                    tag: 'span',
                    children: ['2']
                },
                {
                    tag: 'span',
                    children: ['3']
                },
                {
                    tag: 'span',
                    children: ['4']
                },
                {
                    tag: 'span',
                    children: ['5']
                },
                {
                    tag: 'span',
                    children: ['6']
                },
                {
                    tag: 'span',
                    children: ['7']
                },
                {
                    tag: 'span',
                    children: ['8']
                }],
        }, {

            tag: 'fragment',
            children: [
                {
                    tag: 'span',
                    children: ['9']
                },
                ''
            ]
        }]
    })
})