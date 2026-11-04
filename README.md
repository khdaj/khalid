# إعلان نينجا — Remotion

إعلان عمودي 1080×1920، 15 ثانية، 30 إطار/ث (شخصية نينجا + شيبس وآيس كريم + مؤثرات صوتية).

```bash
npm install
npm run dev      # معاينة في Remotion Studio
npm run render   # يطلع out/ninja-ad.mp4
```

- `src/NinjaAd.tsx` المشاهد والحركة (GSAP timeline يتحرك مع إطارات Remotion)
- `public/` الشعار والشخصية والخطوط والمؤثرات
- `sfx.py` يولّد المؤثرات الصوتية
- `ninja-ad.mp4` النسخة الجاهزة (بدون تعليق صوتي)
