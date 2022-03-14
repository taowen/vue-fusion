import * as vue from '@vue/runtime-core';
import { createApp, nodeOps, encodeNode } from '../../src/renderer';

test('single child', () => {
    const app = createApp(vue.defineComponent({
        render() {
            return 'hello'
        }
    }));
    const root = nodeOps.createElement('div');
    app.mount(root);
    expect(encodeNode(root)).toEqual({
        tag: 'div',
        props: { id: 'elem0' },
        children: [{
            tag: 'fragment',
            children: ['hello']
        }]
    })
})

test('2 layers', () => {
    const app = createApp(vue.defineComponent({
        render() {
            return <span>hello</span>
        }
    }));
    const root = nodeOps.createElement('div');
    app.mount(root);
    expect(encodeNode(root)).toEqual({
        tag: 'div',
        props: { id: 'elem1' },
        children: [{
            tag: 'fragment',
            children: [{
                tag: 'span',
                props: { id: 'elem2' },
                children: ['hello']
            }]
        }]
    })
})

test('9 layers', () => {
    const app = createApp(vue.defineComponent({
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
    const root = nodeOps.createElement('div');
    app.mount(root);
    expect(encodeNode(root)).toEqual({
        tag: 'div',
        props: { id: 'elem3' },
        children: [{
            tag: 'fragment',
            children: [{
                tag: 'div',
                props: { id: 'elem4' },
                children: [{
                    tag: 'div',
                    props: { id: 'elem5' },
                    children: [{
                        tag: 'div',
                        props: { id: 'elem6' },
                        children: [{
                            tag: 'div',
                            props: { id: 'elem7' },
                            children: [{
                                tag: 'fragment',
                                children: [{
                                    tag: 'div',
                                    props: { id: 'elem8' },
                                    children: [{
                                        tag: 'div',
                                        props: { id: 'elem9' },
                                        children: [{
                                            tag: 'div',
                                            props: { id: 'elem10' },
                                            children: [{
                                                tag: 'div',
                                                props: { id: 'elem11' },
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
    const app = createApp(vue.defineComponent({
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
    const root = nodeOps.createElement('div');
    app.mount(root);
    expect(encodeNode(root)).toEqual({
        tag: 'div',
        props: { id: 'elem12' },
        children: [{
            tag: 'fragment',
            children: [
                '',
                {
                    tag: 'span',
                    props: { id: 'elem13' },
                    children: ['1']
                },
                {
                    tag: 'span',
                    props: { id: 'elem14' },
                    children: ['2']
                },
                {
                    tag: 'span',
                    props: { id: 'elem15' },
                    children: ['3']
                },
                {
                    tag: 'span',
                    props: { id: 'elem16' },
                    children: ['4']
                },
                {
                    tag: 'span',
                    props: { id: 'elem17' },
                    children: ['5']
                },
                {
                    tag: 'span',
                    props: { id: 'elem18' },
                    children: ['6']
                },
                {
                    tag: 'span',
                    props: { id: 'elem19' },
                    children: ['7']
                },
                {
                    tag: 'span',
                    props: { id: 'elem20' },
                    children: ['8']
                }],
        }, {

            tag: 'fragment',
            children: [
                {
                    tag: 'span',
                    props: { id: 'elem21' },
                    children: ['9']
                },
                ''
            ]
        }]
    })
})