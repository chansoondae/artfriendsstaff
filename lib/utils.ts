const adjectives = [
  '신나는',
  '행복한',
  '즐거운',
  '차분한',
  '열정적인',
  '우아한',
  '따뜻한',
  '빛나는',
  '영감받은',
  '창의적인',
  '사색하는',
  '몽환적인',
  '활기찬',
  '평화로운',
  '감성적인',
  '잠든',
  '달리는',
  '삐진',
  '화난',
  '묵직한',
  '수줍은',
  '고독한',
];

const artists = [
  '모네',
  '르누아르',
  '드가',
  '피사로',
  '시슬리',
  '고흐',
  '세잔',
  '고갱',
  '피카소',
  '달리',
  '마티스',
  '칸딘스키',
  '몬드리안',
  '클림트',
  '샤갈',
  '뭉크',
  '마그리트',
  '라파엘로',
  '보티첼리',
  '카라바조',
  '벨라스케스',
  '김환기',
  '이우환',
  '천경자',
  '박서보',
  '로스코',
  '앤디워홀',
  '마네',
  '티치아노',
  '루벤스',
  '고야',
  '베르메르',
  '미칼란젤로',
];

const badWords = [
  '시발',
  '씨발',
  '개새',
  '병신',
  '지랄',
  '좆',
  'ㅅㅂ',
  'ㅂㅅ',
];

export function generateNickname(): string {
  const adjective = adjectives[Math.floor(Math.random() * adjectives.length)];
  const artist = artists[Math.floor(Math.random() * artists.length)];
  return `${adjective} ${artist}`;
}

export function generateTempUserId(): string {
  return `user_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
}

export function getTempUserId(): string {
  if (typeof window === 'undefined') return '';

  let userId = localStorage.getItem('temp_user_id');
  if (!userId) {
    userId = generateTempUserId();
    localStorage.setItem('temp_user_id', userId);
  }
  return userId;
}

export function formatTimeAgo(dateString: string): string {
  const now = new Date();
  const past = new Date(dateString);
  const diffMs = now.getTime() - past.getTime();
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHour = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHour / 24);

  if (diffSec < 60) {
    return '방금';
  } else if (diffMin < 60) {
    return `${diffMin}분 전`;
  } else if (diffHour < 24) {
    return `${diffHour}시간 전`;
  } else if (diffDay === 1) {
    return '어제';
  } else {
    return `${diffDay}일 전`;
  }
}

export function hasBadWords(text: string): boolean {
  const lowerText = text.toLowerCase();
  return badWords.some((word) => lowerText.includes(word));
}

export function checkRateLimit(
  userId: string,
  limitMinutes: number = 1
): boolean {
  if (typeof window === 'undefined') return true;

  const lastSubmit = localStorage.getItem(`last_submit_${userId}`);
  if (!lastSubmit) return true;

  const lastSubmitTime = new Date(lastSubmit);
  const now = new Date();
  const diffMs = now.getTime() - lastSubmitTime.getTime();
  const diffMin = Math.floor(diffMs / 1000 / 60);

  return diffMin >= limitMinutes;
}

export function setLastSubmitTime(userId: string): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(`last_submit_${userId}`, new Date().toISOString());
}

export function getLikedOpinions(): Set<string> {
  if (typeof window === 'undefined') return new Set();

  const liked = localStorage.getItem('liked_opinions');
  if (!liked) return new Set();

  try {
    return new Set(JSON.parse(liked));
  } catch {
    return new Set();
  }
}

export function toggleLikedOpinion(opinionId: string): boolean {
  if (typeof window === 'undefined') return false;

  const liked = getLikedOpinions();
  const isLiked = liked.has(opinionId);

  if (isLiked) {
    liked.delete(opinionId);
  } else {
    liked.add(opinionId);
  }

  localStorage.setItem('liked_opinions', JSON.stringify([...liked]));
  return !isLiked;
}
