// tag列表
export const tags = [{
  name: '全部',
  value: 'all',
}, {
  name: '技术',
  value: 'tech',
}, {
  name: '创意',
  value: 'creative',
}, {
  name: '好玩',
  value: 'play',
}, {
  name: 'Apple',
  value: 'apple',
}, {
  name: '问与答',
  value: 'qna',
}, {
  name: '最热',
  value: 'hot',
}, {
  name: 'R2',
  value: 'r2',
}]

export const rules = {
  // 所有的主题信息
  item_reg: /<div class="cell item"><table cellpadding="0" cellspacing="0" border="0" width="100%"><tr>(.*?)<\/td><\/tr><\/table><\/div>/g,

  // 主题信息 id 回复数 标题
  title_reg: /<span class="item_title"><a href="\/t\/(.*?)#reply(.*?)" class="topic-link">(.*?)<\/a><\/span><div class="sep5"><\/div>/g,

  // 作者信息 名 头像
  avatar_reg: /<a href="\/member\/(.*?)"><img src="(.*?)" class="avatar"/g,

  // 节点信息 名 地址
  node_reg: /<a class="node" href="\/go\/(.*?)">(.*?)<\/a>/g,

  // 主题回复信息（有人回复） 最后回复时间 最后回复人
  repay_reg_1: /<span class="small fade">(.*?)<strong><a href="\/member\/(.*?)"/,

  // 主题回复信息（没人回复） 最后回复时间
  repay_reg_0: /<span class="small fade">(.*?)<\/span>/

}