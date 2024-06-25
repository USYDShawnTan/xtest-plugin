import fsPromises from "fs/promises";

class Tools {
  constructor() {
    this.initHungerIncrease();
  }
  // 获取当前日期
  async date_time() {
    const today = new Date();
    return `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`;
  }

  // 获取当前金币总数
  async getCoins(userId) {
    let totalCoins = await redis.get(`Yunz:coin:${userId}`);
    return totalCoins ? parseInt(totalCoins) : 0;
  }

  // 增加金币
  async addCoins(userId, coins) {
    let totalCoins = await this.getCoins(userId);
    totalCoins += coins;
    await redis.set(`Yunz:coin:${userId}`, totalCoins.toString());
    return totalCoins;
  }

  // 消费金币
  async consumeCoins(userId, coins) {
    let totalCoins = await this.getCoins(userId);
    if (totalCoins >= coins) {
      totalCoins -= coins;
      await redis.set(`Yunz:coin:${userId}`, totalCoins.toString());
      return { success: true, totalCoins };
    }
    return { success: false, totalCoins };
  }

  // 读取文件内容
  async readFile(filePath) {
    try {
      const data = await fsPromises.readFile(filePath, "utf8");
      return data;
    } catch (err) {
      console.error("Error reading file:", err);
      throw err; // or handle the error as needed
    }
  }

  // 获取用户金箍棒的长度
  async getStickLength(userId) {
    let length = await redis.get(`Yunz:Stick:${userId}`);
    return length ? parseFloat(length) : null; // 如果没有值返回null，并将其转换为浮点数
  }

  // 设置金箍棒的初始长度
  async initStickLength(userId, length = null) {
    const initialLength =
      length !== null ? length : Math.floor(Math.random() * 18) + 3; // 设置3到20之间的随机长度
    await redis.set(`Yunz:Stick:${userId}`, initialLength.toString());
    return initialLength;
  }

  // 增加或减少金箍棒的长度
  async addStickLength(userId, length) {
    let currentLength = await this.getStickLength(userId);
    if (currentLength === null) {
      throw new Error("用户还没有领养金箍棒");
    }
    currentLength += length;
    await redis.set(`Yunz:Stick:${userId}`, currentLength.toString());
    return currentLength;
  }
  // 获取所有用户ID
  async getAllUserIds() {
    const keys = await redis.keys("Yunz:Game:*");
    return keys.map((key) => key.replace("Yunz:Game:", ""));
  }

  // 初始化定时器，每分钟增加一次饥饿值
  initHungerIncrease() {
    setInterval(() => {
      this.increaseHungerForAllUsers().catch(console.error);
    }, 60 * 1000); // 每分钟
  }

  // 每分钟增加所有用户的饥饿值
  async increaseHungerForAllUsers() {
    const userIds = await this.getAllUserIds();
    for (const userId of userIds) {
      await this.addHunger(userId, 1);
    }
  }

  // 获取游戏数据
  async getGameData(userId) {
    const data = await redis.get(`Yunz:Game:${userId}`);
    return data ? JSON.parse(data) : { hunger: 20, stones: 0, area: 0 };
  }

  // 设置游戏数据
  async setGameData(userId, data) {
    await redis.set(`Yunz:Game:${userId}`, JSON.stringify(data));
  }

  // 获取当前饥饿值
  async getHunger(userId) {
    const data = await this.getGameData(userId);
    return data.hunger;
  }

  // 增加或减少饥饿值
  async addHunger(userId, value) {
    const data = await this.getGameData(userId);
    data.hunger += value;
    if (data.hunger > 20) data.hunger = 20;
    if (data.hunger < 0) data.hunger = 0;
    await this.setGameData(userId, data);
    return data.hunger;
  }

  // 获取用户石头数量
  async getStones(userId) {
    const data = await this.getGameData(userId);
    return data.stones;
  }

  // 增加或减少用户的石头数量
  async addStones(userId, stones) {
    const data = await this.getGameData(userId);
    data.stones += stones;
    if (data.stones < 0) data.stones = 0;
    await this.setGameData(userId, data);
    return data.stones;
  }

  // 获取用户面积
  async getArea(userId) {
    const data = await this.getGameData(userId);
    return data.area;
  }

  // 增加或减少用户的面积
  async addArea(userId, area) {
    const data = await this.getGameData(userId);
    data.area += area;
    await this.setGameData(userId, data);
    return data.area;
  }

}


export default new Tools();
