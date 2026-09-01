import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

async function generateAllPwaAssets() {
  const publicDir = path.resolve('public');
  const screenshotsDir = path.join(publicDir, 'screenshots');
  if (!fs.existsSync(screenshotsDir)) {
    fs.mkdirSync(screenshotsDir, { recursive: true });
  }

  const svgIconPath = path.join(publicDir, 'icon.svg');
  const svgIcon = fs.readFileSync(svgIconPath);

  // 1. Standard icons
  console.log('Generating standard icons...');
  await sharp(svgIcon).resize(192, 192).png().toFile(path.join(publicDir, 'icon-192.png'));
  await sharp(svgIcon).resize(512, 512).png().toFile(path.join(publicDir, 'icon-512.png'));
  await sharp(svgIcon).resize(180, 180).png().toFile(path.join(publicDir, 'apple-touch-icon.png'));
  await sharp(svgIcon).resize(32, 32).png().toFile(path.join(publicDir, 'favicon-32x32.png'));
  await sharp(svgIcon).resize(16, 16).png().toFile(path.join(publicDir, 'favicon-16x16.png'));

  // 2. Maskable icons (add safe padding so Android mask doesn't clip text)
  console.log('Generating maskable icons...');
  const createMaskable = async (size: number, outFile: string) => {
    const innerSize = Math.round(size * 0.76); // safe zone 76-80%
    const resizedInner = await sharp(svgIcon).resize(innerSize, innerSize).toBuffer();
    
    // Background canvas with amber-500 (#F59E0B)
    await sharp({
      create: {
        width: size,
        height: size,
        channels: 4,
        background: { r: 245, g: 158, b: 11, alpha: 1 }
      }
    })
      .composite([{ input: resizedInner, gravity: 'center' }])
      .png()
      .toFile(outFile);
  };

  await createMaskable(192, path.join(publicDir, 'icon-maskable-192.png'));
  await createMaskable(512, path.join(publicDir, 'icon-maskable-512.png'));

  // 3. Generate High-Quality Screenshots for PWABuilder
  console.log('Generating PWA screenshots...');
  const ogImgPath = path.join(publicDir, 'og-image.png');
  const ogBuffer = fs.readFileSync(ogImgPath);

  // Desktop Screenshot 1: 1280x720 (wide) - Home View with App Header & Cards
  const desktopHeaderSvg = Buffer.from(`
    <svg width="1280" height="720" viewBox="0 0 1280 720" xmlns="http://www.w3.org/2000/svg">
      <!-- Background -->
      <rect width="1280" height="720" fill="#FFFBEB"/>
      
      <!-- Top Navbar -->
      <rect x="0" y="0" width="1280" height="76" fill="#FFFFFF" filter="drop-shadow(0 2px 8px rgba(245,158,11,0.15))"/>
      <circle cx="1210" cy="38" r="24" fill="#F59E0B"/>
      <text x="1170" y="46" font-family="sans-serif" font-size="22" font-weight="900" fill="#78350F" text-anchor="end">عَالَمُ الأَفْعَالِ</text>
      <rect x="700" y="20" width="360" height="38" rx="19" fill="#FEF3C7"/>
      <text x="880" y="44" font-family="sans-serif" font-size="15" font-weight="700" fill="#B45309" text-anchor="middle">السَّنَةُ الثَّانِيَةُ ابْتِدَائِي • التَّعْلِيمُ التَّفَاعُلِي</text>

      <!-- Main Banner Card -->
      <rect x="80" y="100" width="1120" height="230" rx="24" fill="#FFFFFF" stroke="#FDE68A" stroke-width="2"/>
      
      <!-- Action Cards Row -->
      <!-- Card 1: Lessons -->
      <rect x="80" y="360" width="350" height="300" rx="20" fill="#FFFFFF" stroke="#FCD34D" stroke-width="2"/>
      <rect x="100" y="380" width="310" height="110" rx="14" fill="#FEF3C7"/>
      <circle cx="255" cy="435" r="32" fill="#F59E0B"/>
      <text x="255" y="444" font-family="sans-serif" font-size="26" font-weight="900" fill="#FFFFFF" text-anchor="middle">📖</text>
      <text x="255" y="530" font-family="sans-serif" font-size="22" font-weight="800" fill="#78350F" text-anchor="middle">دُرُوسُ الأَفْعَالِ</text>
      <text x="255" y="565" font-family="sans-serif" font-size="14" fill="#92400E" text-anchor="middle">الْمَاضِي • الْمُضَارِعُ • الأَمْرُ</text>
      <rect x="120" y="595" width="270" height="42" rx="21" fill="#F59E0B"/>
      <text x="255" y="622" font-family="sans-serif" font-size="16" font-weight="700" fill="#FFFFFF" text-anchor="middle">اِبْدَأِ التَّعَلُّمَ 🚀</text>

      <!-- Card 2: Interactive Games -->
      <rect x="465" y="360" width="350" height="300" rx="20" fill="#FFFFFF" stroke="#6EE7B7" stroke-width="2"/>
      <rect x="485" y="380" width="310" height="110" rx="14" fill="#D1FAE5"/>
      <circle cx="640" cy="435" r="32" fill="#10B981"/>
      <text x="640" y="444" font-family="sans-serif" font-size="26" font-weight="900" fill="#FFFFFF" text-anchor="middle">🎮</text>
      <text x="640" y="530" font-family="sans-serif" font-size="22" font-weight="800" fill="#065F46" text-anchor="middle">أَلْعَابُ الأَفْعَالِ</text>
      <text x="640" y="565" font-family="sans-serif" font-size="14" fill="#047857" text-anchor="middle">صَائِدُ الأَفْعَالِ • صُنْدُوقُ الأَزْمِنَةِ</text>
      <rect x="505" y="595" width="270" height="42" rx="21" fill="#10B981"/>
      <text x="640" y="622" font-family="sans-serif" font-size="16" font-weight="700" fill="#FFFFFF" text-anchor="middle">اِلْعَبْ وَامْرَحْ 🎯</text>

      <!-- Card 3: Certificate -->
      <rect x="850" y="360" width="350" height="300" rx="20" fill="#FFFFFF" stroke="#FBCFE8" stroke-width="2"/>
      <rect x="870" y="380" width="310" height="110" rx="14" fill="#FCE7F3"/>
      <circle cx="1025" cy="435" r="32" fill="#EC4899"/>
      <text x="1025" y="444" font-family="sans-serif" font-size="26" font-weight="900" fill="#FFFFFF" text-anchor="middle">🏆</text>
      <text x="1025" y="530" font-family="sans-serif" font-size="22" font-weight="800" fill="#831843" text-anchor="middle">شَهَادَةُ التَّفَوُّقِ</text>
      <text x="1025" y="565" font-family="sans-serif" font-size="14" fill="#9D174D" text-anchor="middle">احْصُلْ عَلَى شَهَادَتِكَ الْمُطْبُوعَةِ</text>
      <rect x="890" y="595" width="270" height="42" rx="21" fill="#EC4899"/>
      <text x="1025" y="622" font-family="sans-serif" font-size="16" font-weight="700" fill="#FFFFFF" text-anchor="middle">عَرْضُ الشَّهَادَةِ ⭐</text>
    </svg>
  `);

  // Resize ogBuffer to fit banner inside desktop screenshot
  const ogResizedBanner = await sharp(ogBuffer).resize(1116, 226, { fit: 'cover' }).toBuffer();
  
  await sharp(desktopHeaderSvg)
    .composite([{ input: ogResizedBanner, left: 82, top: 102 }])
    .png()
    .toFile(path.join(screenshotsDir, 'desktop-home.png'));

  // Desktop Screenshot 2: 1280x720 (wide) - Games View
  const desktopGamesSvg = Buffer.from(`
    <svg width="1280" height="720" viewBox="0 0 1280 720" xmlns="http://www.w3.org/2000/svg">
      <rect width="1280" height="720" fill="#F0FDF4"/>
      <!-- Header -->
      <rect x="0" y="0" width="1280" height="76" fill="#FFFFFF"/>
      <text x="640" y="48" font-family="sans-serif" font-size="26" font-weight="900" fill="#065F46" text-anchor="middle">🎯 قَائِمَةُ أَلْعَابِ الأَفْعَالِ التَّفَاعُلِيَّةِ 🎮</text>
      
      <!-- Game 1 -->
      <rect x="80" y="110" width="530" height="250" rx="20" fill="#FFFFFF" stroke="#FDE68A" stroke-width="3"/>
      <text x="570" y="160" font-family="sans-serif" font-size="22" font-weight="800" fill="#B45309" text-anchor="end">🎯 صَائِدُ الْأَفْعَالِ</text>
      <text x="570" y="200" font-family="sans-serif" font-size="15" fill="#78350F" text-anchor="end">اِصْطَدِ الْكَلِمَاتِ الَّتِي تُمَثِّلُ فِعْلًا وَتَجَنَّبِ الْأَسْمَاءَ</text>
      <rect x="110" y="280" width="200" height="50" rx="25" fill="#F59E0B"/>
      <text x="210" y="312" font-family="sans-serif" font-size="16" font-weight="700" fill="#FFFFFF" text-anchor="middle">اِلْعَبِ الآن</text>

      <!-- Game 2 -->
      <rect x="670" y="110" width="530" height="250" rx="20" fill="#FFFFFF" stroke="#99F6E4" stroke-width="3"/>
      <text x="1160" y="160" font-family="sans-serif" font-size="22" font-weight="800" fill="#0F766E" text-anchor="end">⏳ صُنْدُوقُ الْأَزْمِنَةِ</text>
      <text x="1160" y="200" font-family="sans-serif" font-size="15" fill="#115E59" text-anchor="end">صَنِّفِ الْأَفْعَالَ فِي صَنَادِيقِ: الْمَاضِي، الْمُضَارِعِ، وَالأَمْرِ</text>
      <rect x="700" y="280" width="200" height="50" rx="25" fill="#0D9488"/>
      <text x="800" y="312" font-family="sans-serif" font-size="16" font-weight="700" fill="#FFFFFF" text-anchor="middle">اِلْعَبِ الآن</text>

      <!-- Game 3 -->
      <rect x="80" y="390" width="530" height="250" rx="20" fill="#FFFFFF" stroke="#C7D2FE" stroke-width="3"/>
      <text x="570" y="440" font-family="sans-serif" font-size="22" font-weight="800" fill="#4338CA" text-anchor="end">🧩 أَكْمِلِ الْجُمْلَةَ بِالْفِعْلِ</text>
      <text x="570" y="480" font-family="sans-serif" font-size="15" fill="#3730A3" text-anchor="end">اخْتَرِ الْفِعْلَ الْمُنَاسِبَ لِسِيَاقِ الْجُمْلَةِ وَالصُّورَةِ</text>
      <rect x="110" y="560" width="200" height="50" rx="25" fill="#4F46E5"/>
      <text x="210" y="592" font-family="sans-serif" font-size="16" font-weight="700" fill="#FFFFFF" text-anchor="middle">اِلْعَبِ الآن</text>

      <!-- Game 4 -->
      <rect x="670" y="390" width="530" height="250" rx="20" fill="#FFFFFF" stroke="#FECDD3" stroke-width="3"/>
      <text x="1160" y="440" font-family="sans-serif" font-size="22" font-weight="800" fill="#BE123C" text-anchor="end">🪄 عَصَا التَّحْوِيلِ السِّحْرِيَّةِ</text>
      <text x="1160" y="480" font-family="sans-serif" font-size="15" fill="#9F1239" text-anchor="end">حَوِّلِ الْفِعْلَ بَيْنَ الْمَاضِي وَالْمُضَارِعِ وَالْأَمْرِ</text>
      <rect x="700" y="560" width="200" height="50" rx="25" fill="#E11D48"/>
      <text x="800" y="592" font-family="sans-serif" font-size="16" font-weight="700" fill="#FFFFFF" text-anchor="middle">اِلْعَبِ الآن</text>
    </svg>
  `);
  await sharp(desktopGamesSvg).png().toFile(path.join(screenshotsDir, 'desktop-games.png'));

  // Mobile Screenshot 1: 750x1334 (narrow) - Mobile Home View
  const mobileHomeSvg = Buffer.from(`
    <svg width="750" height="1334" viewBox="0 0 750 1334" xmlns="http://www.w3.org/2000/svg">
      <rect width="750" height="1334" fill="#FFFBEB"/>
      <!-- Mobile Top Bar -->
      <rect x="0" y="0" width="750" height="110" fill="#FFFFFF"/>
      <text x="680" y="68" font-family="sans-serif" font-size="32" font-weight="900" fill="#78350F" text-anchor="end">عَالَمُ الأَفْعَالِ 🌟</text>
      <rect x="50" y="40" width="180" height="42" rx="21" fill="#FEF3C7"/>
      <text x="140" y="66" font-family="sans-serif" font-size="18" font-weight="700" fill="#B45309" text-anchor="middle">٢ ابتدائي</text>

      <!-- Banner container -->
      <rect x="40" y="140" width="670" height="320" rx="24" fill="#FFFFFF" stroke="#FDE68A" stroke-width="2"/>
      
      <!-- Action 1: Lessons -->
      <rect x="40" y="490" width="670" height="230" rx="24" fill="#FFFFFF" stroke="#FCD34D" stroke-width="3"/>
      <circle cx="610" cy="580" r="45" fill="#FEF3C7"/>
      <text x="610" y="592" font-family="sans-serif" font-size="36" text-anchor="middle">📚</text>
      <text x="530" y="570" font-family="sans-serif" font-size="28" font-weight="900" fill="#78350F" text-anchor="end">دُرُوسُ الْأَفْعَالِ</text>
      <text x="530" y="610" font-family="sans-serif" font-size="20" fill="#92400E" text-anchor="end">الْمَاضِي • الْمُضَارِعُ • الأَمْرُ</text>
      <rect x="70" y="640" width="220" height="54" rx="27" fill="#F59E0B"/>
      <text x="180" y="675" font-family="sans-serif" font-size="20" font-weight="700" fill="#FFFFFF" text-anchor="middle">تَعَلَّمِ الآن 🚀</text>

      <!-- Action 2: Games -->
      <rect x="40" y="750" width="670" height="230" rx="24" fill="#FFFFFF" stroke="#6EE7B7" stroke-width="3"/>
      <circle cx="610" cy="840" r="45" fill="#D1FAE5"/>
      <text x="610" y="852" font-family="sans-serif" font-size="36" text-anchor="middle">🎮</text>
      <text x="530" y="830" font-family="sans-serif" font-size="28" font-weight="900" fill="#065F46" text-anchor="end">أَلْعَابُ الْأَفْعَالِ</text>
      <text x="530" y="870" font-family="sans-serif" font-size="20" fill="#047857" text-anchor="end">٥ أَلْعَابٍ تَعْلِيمِيَّةٍ شَيِّقَةٍ</text>
      <rect x="70" y="900" width="220" height="54" rx="27" fill="#10B981"/>
      <text x="180" y="935" font-family="sans-serif" font-size="20" font-weight="700" fill="#FFFFFF" text-anchor="middle">اِلْعَبِ الآن 🎯</text>

      <!-- Action 3: Certificate -->
      <rect x="40" y="1010" width="670" height="230" rx="24" fill="#FFFFFF" stroke="#FBCFE8" stroke-width="3"/>
      <circle cx="610" cy="1100" r="45" fill="#FCE7F3"/>
      <text x="610" y="1112" font-family="sans-serif" font-size="36" text-anchor="middle">🏆</text>
      <text x="530" y="1090" font-family="sans-serif" font-size="28" font-weight="900" fill="#831843" text-anchor="end">شَهَادَةُ التَّفَوُّقِ</text>
      <text x="530" y="1130" font-family="sans-serif" font-size="20" fill="#9D174D" text-anchor="end">تَكْرِيمُ الطَّالِبِ الْمُتَمَيِّزِ</text>
      <rect x="70" y="1160" width="220" height="54" rx="27" fill="#EC4899"/>
      <text x="180" y="1195" font-family="sans-serif" font-size="20" font-weight="700" fill="#FFFFFF" text-anchor="middle">الشَّهَادَةُ ⭐</text>
    </svg>
  `);
  
  const ogMobileBanner = await sharp(ogBuffer).resize(666, 316, { fit: 'cover' }).toBuffer();
  await sharp(mobileHomeSvg)
    .composite([{ input: ogMobileBanner, left: 42, top: 142 }])
    .png()
    .toFile(path.join(screenshotsDir, 'mobile-home.png'));

  // Mobile Screenshot 2: 750x1334 (narrow) - Mobile Lessons/Quiz View
  const mobileGamesSvg = Buffer.from(`
    <svg width="750" height="1334" viewBox="0 0 750 1334" xmlns="http://www.w3.org/2000/svg">
      <rect width="750" height="1334" fill="#F0FDF4"/>
      <rect x="0" y="0" width="750" height="110" fill="#FFFFFF"/>
      <text x="375" y="70" font-family="sans-serif" font-size="30" font-weight="900" fill="#065F46" text-anchor="middle">🎮 أَلْعَابُ الْأَفْعَالِ التَّفَاعُلِيَّةِ</text>
      
      <!-- Mobile Game Card 1 -->
      <rect x="40" y="140" width="670" height="260" rx="20" fill="#FFFFFF" stroke="#FDE68A" stroke-width="3"/>
      <text x="670" y="200" font-family="sans-serif" font-size="26" font-weight="900" fill="#B45309" text-anchor="end">🎯 صَائِدُ الْأَفْعَالِ</text>
      <text x="670" y="250" font-family="sans-serif" font-size="20" fill="#78350F" text-anchor="end">تَمْيِيزُ الْفِعْلِ مِنَ الْاسْمِ وَالْحَرْفِ</text>
      <rect x="60" y="310" width="240" height="60" rx="30" fill="#F59E0B"/>
      <text x="180" y="348" font-family="sans-serif" font-size="22" font-weight="700" fill="#FFFFFF" text-anchor="middle">اِلْعَبِ الآن 🚀</text>

      <!-- Mobile Game Card 2 -->
      <rect x="40" y="430" width="670" height="260" rx="20" fill="#FFFFFF" stroke="#99F6E4" stroke-width="3"/>
      <text x="670" y="490" font-family="sans-serif" font-size="26" font-weight="900" fill="#0F766E" text-anchor="end">⏳ صُنْدُوقُ الْأَزْمِنَةِ</text>
      <text x="670" y="540" font-family="sans-serif" font-size="20" fill="#115E59" text-anchor="end">تَصْنِيفُ الْمَاضِي وَالْمُضَارِعِ وَالأَمْرِ</text>
      <rect x="60" y="600" width="240" height="60" rx="30" fill="#0D9488"/>
      <text x="180" y="638" font-family="sans-serif" font-size="22" font-weight="700" fill="#FFFFFF" text-anchor="middle">اِلْعَبِ الآن 🚀</text>

      <!-- Mobile Game Card 3 -->
      <rect x="40" y="720" width="670" height="260" rx="20" fill="#FFFFFF" stroke="#C7D2FE" stroke-width="3"/>
      <text x="670" y="780" font-family="sans-serif" font-size="26" font-weight="900" fill="#4338CA" text-anchor="end">🧩 أَكْمِلِ الْجُمْلَةَ بِالْفِعْلِ</text>
      <text x="670" y="830" font-family="sans-serif" font-size="20" fill="#3730A3" text-anchor="end">اخْتِيَارُ الْفِعْلِ الْمُنَاسِبِ لِلسِّيَاقِ</text>
      <rect x="60" y="890" width="240" height="60" rx="30" fill="#4F46E5"/>
      <text x="180" y="928" font-family="sans-serif" font-size="22" font-weight="700" fill="#FFFFFF" text-anchor="middle">اِلْعَبِ الآن 🚀</text>

      <!-- Mobile Game Card 4 -->
      <rect x="40" y="1010" width="670" height="260" rx="20" fill="#FFFFFF" stroke="#FECDD3" stroke-width="3"/>
      <text x="670" y="1070" font-family="sans-serif" font-size="26" font-weight="900" fill="#BE123C" text-anchor="end">🪄 عَصَا التَّحْوِيلِ السِّحْرِيَّةِ</text>
      <text x="670" y="1120" font-family="sans-serif" font-size="20" fill="#9F1239" text-anchor="end">تَحْوِيلُ الْفِعْلِ بَيْنَ الْأَزْمِنَةِ الْمُخْتَلِفَةِ</text>
      <rect x="60" y="1180" width="240" height="60" rx="30" fill="#E11D48"/>
      <text x="180" y="1218" font-family="sans-serif" font-size="22" font-weight="700" fill="#FFFFFF" text-anchor="middle">اِلْعَبِ الآن 🚀</text>
    </svg>
  `);
  await sharp(mobileGamesSvg).png().toFile(path.join(screenshotsDir, 'mobile-games.png'));

  console.log('All PWA assets generated successfully!');
}

generateAllPwaAssets().catch(console.error);
