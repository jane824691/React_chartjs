import cloneArray from "./cloneArray";

test('properly clones array', () => {
    const firstSample = [2, 3, 4]

    // 因為是return [...array], 看起來values是相同的, 對記憶體來說是不同, 故toBe會失敗
    // expect(cloneArray(firstSample)).toBe(firstSample) // Failure

    expect(cloneArray(firstSample)).toEqual(firstSample)
    expect(cloneArray(firstSample)).not.toBe(firstSample)
})