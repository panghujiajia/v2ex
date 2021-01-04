export interface TagData {
	key: TagDataKey;
	value: any;
}
export enum TagDataKey {
	'top' = 'top',
	'all' = 'all',
	'tech' = 'tech',
	'creative' = 'creative',
	'play' = 'play',
	'apple' = 'apple',
	'qna' = 'qna',
	'hot' = 'hot',
	'r2' = 'r2',
}

export interface TagTime {
	key: TagTimeKey;
	value: any;
}
export enum TagTimeKey {
	'top' = 'top_time',
	'all' = 'all_time',
	'tech' = 'tech_time',
	'creative' = 'creative_time',
	'play' = 'play_time',
	'apple' = 'apple_time',
	'qna' = 'qna_time',
	'hot' = 'hot_time',
	'r2' = 'r2_time',
}
