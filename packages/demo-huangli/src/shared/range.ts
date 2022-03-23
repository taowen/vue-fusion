export function range<T>(max: number, transform: (i: number) => T) {
    let arr = [];
    for (let i = 0; i < max; i++) {
        arr.push(transform(i));
    }
    return arr;
}
