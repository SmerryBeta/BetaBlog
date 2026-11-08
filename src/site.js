export default {
  name: '纸杯の小站',
  owner: 'SmerryBeta',
  intro: '一本手工装订的小册子：写字、记事、放小玩意儿',
}

// 拼接 public 资源路径，适配 GitHub Pages 项目站子路径（如 /BetaBlog/）
export const asset = (path) => import.meta.env.BASE_URL + path.replace(/^\//, '')
