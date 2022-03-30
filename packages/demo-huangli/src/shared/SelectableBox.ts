import * as fusion from 'vue-fusion';

export default fusion.styled('view').withProps<{selected?: boolean}>()`
padding: 0.5rem;
border-radius: 4px;
${props => {
    return props.selected ? `
    border: 1px solid red;
    background-color: var(--color-3);
    ` : `border: 1px solid white;`
}}
`