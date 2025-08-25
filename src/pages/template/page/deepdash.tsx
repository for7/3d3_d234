import React, { useState } from "react";
import _ from "lodash-es"; // deepdash 基于 lodash
import addDeepdash from "deepdash-es";

// 将 deepdash 方法添加到 lodash
const lodash = addDeepdash(_);

// 测试用的嵌套对象
const testData = {
  id: 1,
  name: "root",
  children: [
    {
      id: 2,
      name: "child1",
      children: [{ id: 3, name: "grandchild1" }],
    },
    { id: 4, name: "child2" },
  ],
};

export default function DeepdashDemo() {
  const [output, setOutput] = useState<any>(null);

  // 按钮演示方法
  const demos = [
    {
      label: "keysDeep - 获取所有键路径",
      run: () => setOutput(lodash.keysDeep(testData)),
    },
    {
      label: "paths - 获取所有路径数组",
      run: () => setOutput(lodash.paths(testData)),
    },
    {
      label: "findDeep - 查找 name=child2",
      run: () =>
        setOutput(
          lodash.findDeep(testData, (val, key) => {
            return key === "name" && val === "child2"
          }).parent
        ),
    },
    {
      label: "findPathDeep - 查找值=3 的路径",
      run: () => setOutput(lodash.findPathDeep(testData, (val) => val === 3)),
    },
    {
      label: "mapDeep - 遍历修改 name 属性",
      run: () =>
        setOutput(
          lodash.mapDeep(
            testData,
            (val, key) => (key === "name" ? val.toUpperCase() : val),
            { leavesOnly: false }
          )
        ),
    },
    {
      label: "filterDeep - 过滤掉 id 小于 3 的节点",
      run: () =>
        setOutput(
          lodash.filterDeep(testData, (val) => !(val.id && val.id < 3), {
            childrenPath: "children",
          })
        ),
    },
    {
      label: "pickDeep - 只保留 id 和 name",
      run: () => setOutput(lodash.pickDeep(testData, ["id", "name"])),
    },
    {
      label: "omitDeep - 移除所有 id",
      run: () => setOutput(lodash.omitDeep(testData, ["id"])),
    },
    {
      label: "reduceDeep - 聚合所有 id 的和",
      run: () =>
        setOutput(
          lodash.reduceDeep(
            testData,
            (acc, val, key) => (key === "id" ? acc + val : acc),
            0
          )
        ),
    },
    {
      label: "exists - 检查路径是否存在",
      run: () => setOutput(lodash.exists(testData, "children[0].children[0].name")),
    },
    {
      label: "someDeep - 是否有 name=child1",
      run: () =>
        setOutput(
          lodash.someDeep(testData, (val, key) => key === "name" && val === "child1")
        ),
    },
  ];

  return (
    <div style={{ padding: 20 }}>
      <h2>Deepdash API 演示</h2>
      <pre style={{ background: "#f4f4f4", padding: 10, marginTop: 20 }}>
        {JSON.stringify(testData, null, 2)}
      </pre>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
        {demos.map((d, i) => (
          <button
            key={i}
            onClick={d.run}
            style={{ padding: "6px 10px", cursor: "pointer" }}
          >
            {d.label}
          </button>
        ))}
      </div>
      <pre style={{ background: "#f4f4f4", padding: 10, marginTop: 20 }}>
        {JSON.stringify(output, null, 2)}
      </pre>
    </div>
  );
}
