import React from 'react'
import { useMemo } from 'react'

const Test = () => {
    const obj1 = { id: '1', name: 'yellow' }
    const obj2 = { id: '2', name: 'kimi', age: 18 }
    const memoizedValue = useMemo(()=> Object.assign(obj1, obj2),[obj1, obj2])

    return (
<div>{memoizedValue.age}</div>
    )
    }

    export default Test
