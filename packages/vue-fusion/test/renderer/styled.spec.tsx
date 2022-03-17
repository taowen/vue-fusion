import * as fusion from '../../src/renderer';

test('inject style', () => {
    const SomeComp = (options: { msg: string }, ctx: { slots: Record<string, Function>}) => {
        return <div>{ options.msg }{ ctx.slots.default() }</div>
    }
    const StyledComp = fusion.styled(SomeComp)`
        color: red;
    `
    const app = fusion.createApp(() => {
        return <StyledComp msg="hello">{() => 'abc'}</StyledComp>;
    });
    const root = fusion.nodeOps.createElement('div');
    app.mount(root);
    const result = JSON.stringify(fusion.encodeNode(root).children);
    expect(result).toContain('hello');
    expect(result).toContain('abc');
    expect(result).toContain('color:red;');
})