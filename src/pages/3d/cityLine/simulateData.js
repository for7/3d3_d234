// simulateData.js
export const generateCityData = () => {
  const cities = [];
  const connections = [];

  // 生成100个城市
  for (let i = 0; i < 100; i++) {
    cities.push({
      id: i,
      name: `城市 ${i + 1}`,
      position: [
        Math.random() * 1000 - 500, // x坐标
        Math.random() * 1000 - 500, // y坐标
        Math.random() * 1000 - 500, // z坐标
      ],
    });
  }

  // 随机生成一些城市之间的连接（并给每条连接分配一个强度和颜色）
  for (let i = 0; i < 100; i++) {
    const numConnections = Math.floor(Math.random() * 10) + 2; // 每个城市最多与10个城市连接
    for (let j = 0; j < numConnections; j++) {
      const targetCity = Math.floor(Math.random() * 100);
      if (targetCity !== i) {
        const strength = Math.random() * 10 + 1; // 连接强度，1-10
        const color = `hsl(${Math.random() * 360}, 100%, 50%)`; // 随机颜色
        connections.push({
          sourceId: i,
          targetId: targetCity,
          strength,
          color,
        });
      }
    }
  }

  return { cities, connections };
};
