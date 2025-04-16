import React from 'react';

export default function ClearButton({ setMyDate }) {
    return <button onClick={() => setMyDate(0)}>清空</button>;
}