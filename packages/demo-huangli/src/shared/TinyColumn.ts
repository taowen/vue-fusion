import * as fusion from 'vue-fusion';

export default fusion.styled('view').withProps<{charsCount: number}>({ class: 'flex-col font-thin'})`
${props => {
    return props.charsCount === 2 ? `font-size: 10px;` : `font-size: 8px;`
}}
`