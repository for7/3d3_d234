import React, { useEffect } from "react";

export default ({ addProvider, appContext, addWrapper, useConfig }) => {
  console.log(11, appContext);
  // 整个应用外套 Provider
  function Provider({ children }) {
    return (
      <div style={{ color: 'red' }}>{children}</div>
    )
  }
  const StoreProvider = ({ children }) => {
    return <Provider>{children}</Provider>;
  };
  addProvider(StoreProvider);

  // 页面外套 Wrapper
  const PageWrapper = ({ children }) => {
    const pageConfig = useConfig();
    console.log(66, pageConfig);
    return <div style={{ color: 'blue' }}>{children}</div>
  }
  addWrapper(PageWrapper);

  // 如果希望同样为 layout 组件添加可以添加第二个参数
  addWrapper(PageWrapper, true);
};

