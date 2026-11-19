export type TowerType = 'guyed' | 'self_supporting_3' | 'self_supporting_4';

export interface AssemblyStage {
  id: number;
  code: string;
  start: number;
  end: number;
  title: string;
  shortTitle: string;
  subtitle: string;
  description: string;
  keyCheck: string;
}

export const COMPANY_NAME = 'زرین دکل سازان سلمانی';
export const COMPANY_PHONE = '0914730091';
export const COMPANY_PHONE_HREF = 'tel:0914730091';

export const ASSEMBLY_STAGES: readonly AssemblyStage[] = [
  {
    id: 1,
    code: 'STG-01',
    start: 0.0,
    end: 0.16,
    title: 'فونداسیون، بیس‌پلیت و سیستم ارتینگ',
    shortTitle: 'فونداسیون و ارت',
    subtitle: 'پی بتنی مرکزی، بلوک‌های مهار ۱۲۰ درجه و شبکه زمین مسی',
    description:
      'فونداسیون بتنی مرکزی و بیس‌پلیت گالوانیزه گرم با پین محوری در تراز صفر مستقر می‌شوند؛ سه بلوک مهار بتنی در زاویه دقیق ۱۲۰ درجه قفل شده و در برش زیرسطحی، میله و شبکه ارتینگ مسی با مقاومت زیر ۲ اهم فعال می‌گردد.',
    keyCheck: 'بتن مسلح عیار ۴۰۰ و مقاومت سیستم ارتینگ کمتر از ۲ اهم',
  },
  {
    id: 2,
    code: 'STG-02',
    start: 0.16,
    end: 0.34,
    title: 'مونتاژ سکشن‌های مشبک پایه',
    shortTitle: 'سکشن‌های پایه',
    subtitle: 'اتصال سکشن‌های مثلثی گالوانیزه گرم با مهاربندی زیگزاگ',
    description:
      'سکشن‌های مدولار مثلثی تمام‌گالوانیزه گرم به صورت عمودی روی بیس‌پلیت فرود آمده و با فلنج‌های پیچ‌ومهره‌ای گرید بالا به یکدیگر قفل می‌شوند. اسکن حلقوی هولوگرافیک در هر مفصل، هم‌محوری دقیق اتصالات را تایید می‌کند.',
    keyCheck: 'پوشش گالوانیزه گرم ASTM A123 و پیچ‌ومهره‌های گالوانیزه گرید ۸.۸',
  },
  {
    id: 3,
    code: 'STG-03',
    start: 0.34,
    end: 0.52,
    title: 'مهاربندی اولیه، رگلاژ و شاقول‌سازی لیزری',
    shortTitle: 'مهاربندی و لیزر',
    subtitle: 'کشش سیم مهار طبقه اول، مهارکش‌های کهربایی و پرتو لیزر شاقول',
    description:
      'سه رشته سیم بکسل فولادی از براکت مهار میانی به مهارکش‌های روی بلوک‌های ۱۲۰ درجه متصل می‌شوند. هم‌زمان با تنظیم کشش مهارکش‌ها، پرتو لیزر فیروزه‌ای امتداد ستون فقرات دکل را اسکن کرده و انحراف محوری را به ۰.۰۰ درجه می‌رساند.',
    keyCheck: 'هم‌راستایی لیزری ۰.۰۰ درجه و کشش کالیبره‌شده سیم مهار',
  },
  {
    id: 4,
    code: 'STG-04',
    start: 0.52,
    end: 0.72,
    title: 'افزایش ارتفاع و رنگ‌آمیزی استاندارد هوانوردی (ICAO)',
    shortTitle: 'ارتفاع و رنگ ICAO',
    subtitle: 'نصب سکشن‌های قرمز و سفید و مهاربندی طبقات دوم و سوم',
    description:
      'سکشن‌های فوقانی با پوشش اپوکسی براق در باندهای متناوب قرمز سیگنال و سفید هوانوردی تا ارتفاع ۴۸ متر مونتاژ شده و ردیف‌های دوم و سوم سیم مهار برای مقاومت کامل در برابر بادهای شدید قفل می‌شوند.',
    keyCheck: 'رنگ‌آمیزی ۷ باند استاندارد مطابق ضمیمه ۱۴ ایکائو',
  },
  {
    id: 5,
    code: 'STG-05',
    start: 0.72,
    end: 0.88,
    title: 'نصب تجهیزات مخابراتی و دیش‌های مایکروویو',
    shortTitle: 'تجهیزات RF',
    subtitle: 'دیش‌های پارابولیک کاوردار، آنتن‌های ۳ سکتوره و نردبان کابل',
    description:
      'دیش‌های مایکروویو با رادوم استوانه‌ای، آرایه سه آنتن سکتور مخابراتی روی براکت‌های گالوانیزه، نردبان دسترسی عمودی و مسیر فیدرهای کواکسیال در ترازهای فوقانی نصب و هم‌راستاسازی می‌شوند.',
    keyCheck: 'تحمل کامل سطح بادگیر تجهیزات RF تا سرعت ۱۶۰ کیلومتر بر ساعت',
  },
  {
    id: 6,
    code: 'STG-06',
    start: 0.88,
    end: 1.0,
    title: 'صاعقه‌گیر، چراغ هوانوردی و بهره‌برداری زنده',
    shortTitle: 'بهره‌برداری زنده',
    subtitle: 'چشمک‌زن هوانوردی LED، انتشار امواج RF و تست جریان باد',
    description:
      'میله صاعقه‌گیر در رأس سازه و چراغ چشمک‌زن قرمز LED هوانوردی با هاله نورانی فعال شده و دکل آماده انتشار پایدار امواج مخابراتی در برابر جریان‌های شدید باد با ایستایی ۱۰۰٪ است.',
    keyCheck: 'ایستایی سازه‌ای ۱۰۰٪، حفاظت صاعقه IEC 62305 و بهره‌برداری ۲۴ ساعته',
  },
];

export interface AssemblyTelemetry {
  progress: number;
  stageIndex: number;
  stage: AssemblyStage;
  assembledHeightM: number;
  guyTensionKn: number;
  windResistanceKmh: number;
  groundingResistanceOhm: number;
  plumbErrorDeg: number;
  activeGuyTiers: number;
  stabilityPercent: number;
  laserScanActive: boolean;
  rfActive: boolean;
  windFlowActive: boolean;
}

export function clamp01(value: number): number {
  if (!Number.isFinite(value)) return 0;
  return Math.max(0, Math.min(1, value));
}

export function remap(value: number, inMin: number, inMax: number): number {
  if (inMax <= inMin) return 0;
  return clamp01((value - inMin) / (inMax - inMin));
}

export function smoothstep01(t: number): number {
  const c = clamp01(t);
  return c * c * (3 - 2 * c);
}

export function getStageIndexForProgress(progress: number): number {
  const p = clamp01(progress);
  for (let i = ASSEMBLY_STAGES.length - 1; i >= 0; i--) {
    if (p >= ASSEMBLY_STAGES[i].start) {
      return i;
    }
  }
  return 0;
}

export function computeAssemblyTelemetry(rawProgress: number): AssemblyTelemetry {
  const p = clamp01(rawProgress);
  const stageIndex = getStageIndexForProgress(p);
  const stage = ASSEMBLY_STAGES[stageIndex];

  const lowerClimb = smoothstep01(remap(p, 0.16, 0.34));
  const upperClimb = smoothstep01(remap(p, 0.52, 0.72));
  const assembledHeightM = Number((lowerClimb * 18 + upperClimb * 30).toFixed(1));

  const tier1Tension = smoothstep01(remap(p, 0.36, 0.51)) * 12.4;
  const upperTension = smoothstep01(remap(p, 0.58, 0.72)) * 22.1;
  const guyTensionKn = Number((tier1Tension + upperTension).toFixed(1));

  let activeGuyTiers = 0;
  if (p >= 0.36) activeGuyTiers = 1;
  if (p >= 0.58) activeGuyTiers = 2;
  if (p >= 0.66) activeGuyTiers = 3;

  const earthingDone = smoothstep01(remap(p, 0.04, 0.15));
  const groundingResistanceOhm = Number((4.8 - earthingDone * 3.4).toFixed(2));

  const leanBuild = smoothstep01(remap(p, 0.18, 0.33));
  const tensionStraighten = smoothstep01(remap(p, 0.38, 0.50));
  const plumbErrorDeg = Number((leanBuild * (1 - tensionStraighten) * 1.45).toFixed(2));

  const windResistanceKmh = Math.round(70 + smoothstep01(remap(p, 0.34, 0.72)) * 90);
  const stabilityPercent = Math.round(28 + smoothstep01(remap(p, 0.05, 0.92)) * 72);

  return {
    progress: p,
    stageIndex,
    stage,
    assembledHeightM,
    guyTensionKn,
    windResistanceKmh,
    groundingResistanceOhm,
    plumbErrorDeg,
    activeGuyTiers,
    stabilityPercent,
    laserScanActive: p >= 0.34 && p <= 0.54,
    rfActive: p >= 0.89,
    windFlowActive: p >= 0.90,
  };
}
