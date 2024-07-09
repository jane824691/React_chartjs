import { element } from 'prop-types'
import React, { useRef } from 'react'

const Scroll = () => {
  const scrollRef = useRef([]);

    // 只有手機板可整區x軸滑動, web版會只有點scorllBar可操作滾動
  const handleScrollToItem  = (index) => {
    if (scrollRef.current[index]) {
      scrollRef.current[index].scrollIntoView({
        // behavior（可选）：定義動畫過渡效果，值為 auto或 smooth 之一。預設 auto。
        // block（可选）：垂直方向的對齊，值為 start, center, end, 或 nearest之一。預設 start。
        // inline（可选）：水平方向的對齊，值為 start, center, end, 或 nearest之一。預設 nearest。
        behavior: 'auto',
        block: 'nearest',
        inline: 'center',
      });
    }
  };

  return (
    <>
      <div className="scroll-container">
      <button onClick={() => handleScrollToItem(9)}>Scroll to Item 10</button>
        {Array.from({ length: 10 }).map((_, index) => (
          // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions
          <div
            key={index}
            className="scroll-item"
            // ref={對接回 scrollRef = useRef([]);}, 用法是 +.current,
            // 通過將 ref 對象的 .current 屬性設置為一個 DOM 節點, 可跳轉該節點
            ref={(element) => (scrollRef.current[index] = element)}
            onClick={() => handleScrollToItem (index)}
          >
            Item {index + 1}
          </div>
        ))}
      </div>
    </>
  );
};

export default Scroll
