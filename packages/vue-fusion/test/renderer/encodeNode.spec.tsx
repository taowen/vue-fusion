import * as fusion from '../../src';
import { createApp, encodeNode, nodeOps, resetFragmentId, resetNodeId } from '../../src/renderer';

beforeEach(() => {
    resetNodeId();
    resetFragmentId();
})

test('single child', () => {
    const app = createApp(fusion.defineComponent({
        render() {
            return 'hello'
        }
    }));
    const root = nodeOps.createElement('div');
    app.mount(root);
    expect(encodeNode(root)).toEqual({
        tag: 'div',
        id: 'elem1',
        children: [{
            tag: 'fragment',
            id: 'fragment1',
            children: ['hello']
        }]
    })
})

test('2 layers', () => {
    const app = createApp(fusion.defineComponent({
        render() {
            return <span>hello</span>
        }
    }));
    const root = nodeOps.createElement('div');
    app.mount(root);
    expect(encodeNode(root)).toEqual({
        tag: 'div',
        id: 'elem1',
        children: [{
            tag: 'fragment',
            id: 'fragment1',
            children: [{
                tag: 'span',
                id: 'elem2',
                children: ['hello']
            }]
        }]
    })
})

test('9 layers', () => {
    const app = createApp(fusion.defineComponent({
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
        id: 'elem1',
        children: [{
            tag: 'fragment',
            id: 'fragment1',
            children: [{
                tag: 'div',
                id: 'elem2',
                children: [{
                    tag: 'div',
                    id: 'elem3',
                    children: [{
                        tag: 'div',
                        id: 'elem4',
                        children: [{
                            tag: 'div',
                            id: 'elem5',
                            children: [{
                                tag: 'fragment',
                                id: 'fragment2',
                                children: [{
                                    tag: 'div',
                                    id: 'elem6',
                                    children: [{
                                        tag: 'div',
                                        id: 'elem7',
                                        children: [{
                                            tag: 'div',
                                            id: 'elem8',
                                            children: [{
                                                tag: 'div',
                                                id: 'elem9',
                                                children: [{
                                                    tag: 'fragment',
                                                    id: 'fragment3',
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
    const app = createApp(fusion.defineComponent({
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
        id: 'elem1',
        children: [{
            tag: 'fragment',
            id: 'fragment1',
            children: [
                '',
                {
                    tag: 'span',
                    id: 'elem2',
                    children: ['1']
                },
                {
                    tag: 'span',
                    id: 'elem3',
                    children: ['2']
                },
                {
                    tag: 'span',
                    id: 'elem4',
                    children: ['3']
                },
                {
                    tag: 'span',
                    id: 'elem5',
                    children: ['4']
                },
                {
                    tag: 'span',
                    id: 'elem6',
                    children: ['5']
                },
                {
                    tag: 'span',
                    id: 'elem7',
                    children: ['6']
                },
                {
                    tag: 'span',
                    id: 'elem8',
                    children: ['7']
                },
                {
                    tag: 'span',
                    id: 'elem9',
                    children: ['8']
                }],
        }, {

            tag: 'fragment',
            id: 'fragment2',
            children: [
                {
                    tag: 'span',
                    id: 'elem10',
                    children: ['9']
                },
                ''
            ]
        }]
    })
})