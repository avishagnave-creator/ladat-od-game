# הגדרת הגנת מייל+סיסמה — מדריך שלב-אחר-שלב

המערכת בנויה כך: **Wix** מטפל במכירה, בתשלום ובחשבונית (חשבונית ירוקה, כבר מחובר).
**Firebase** מטפל בזהות האישית של כל לקוח/ה — מי שרכש/ה, ורק הוא/היא, יכול/ה להתחבר למשחק.

כשלקוח משלים רכישה ב-Wix, מתבצעת קריאה אוטומטית (webhook) לפונקציה בענן שיצרתי,
שיוצרת לו חשבון אישי ושולחת לו מייל עם קישור לקביעת סיסמה. מרגע זה הוא יכול
להתחבר למשחק (ולהתקין אותו כאפליקציה) עם המייל והסיסמה שקבע.

---

## שלב 1 — יצירת פרויקט Firebase (חינמי)

1. כנסי ל-https://console.firebase.google.com
2. "Add project" → תני שם (למשל `ladat-od`) → המשיכי עם ברירות המחדל.
3. בתפריט השמאלי: **Build → Authentication → Get started**.
4. בלשונית **Sign-in method**, הפעילי את **Email/Password**.
5. (מומלץ) בלשונית **Templates**, ערכי את תבנית המייל **Password reset** —
   אפשר להוסיף שם את הלוגו והשפה שלכם. זה המייל שהלקוחות יקבלו.

## שלב 2 — חיבור המשחק ל-Firebase

1. בקונסולת Firebase: **Project settings** (גלגל השיניים) → **General** →
   גללי למטה ל-"Your apps" → **Add app** → בחרי בסמל ה-web `</>`.
2. תני שם לאפליקציה (למשל "לדעת עוד — משחק") ולחצי "Register app".
3. יופיע אובייקט `firebaseConfig` — **העתיקי את הערכים** (apiKey, authDomain וכו').
4. פתחי את `ladat-od.html`, חפשי את הבלוק:
   ```js
   const firebaseConfig = {
     apiKey: "REPLACE_ME",
     ...
   };
   ```
   והחליפי את כל הערכים ב-`REPLACE_ME` בערכים שהעתקת.

מרגע זה דף הכניסה יעבוד מול חשבון ה-Firebase שלך.

## שלב 3 — פריסת הפונקציה בענן (Cloud Function)

זו הפונקציה שיוצרת חשבון אוטומטית כשמישהו קונה. יש להריץ את זה פעם אחת
ממחשב עם Node.js מותקן (אפשר לבקש מכל מפתח/ת לעזור בזה תוך כמה דקות אם זה לא נוח לך):

```bash
npm install -g firebase-tools
firebase login
cd firebase-functions
firebase init functions   # בחרי בפרויקט שיצרת בשלב 1, שפה: JavaScript
firebase functions:secrets:set WEBHOOK_SECRET
firebase functions:secrets:set FIREBASE_WEB_API_KEY   # זה ה-apiKey מ-firebaseConfig בשלב 2
firebase deploy --only functions
```

**חשוב:** Cloud Functions מחייב שדרוג לתוכנית Blaze (תשלום לפי שימוש) — אבל
יש נדיבות "Free tier" חודשית שכמעט תמיד מכסה שימוש בהיקף כזה (מוצר דיגיטלי
עם עשרות/מאות רכישות בחודש), כך שבפועל לרוב לא תשלמי כלום.

בסוף התהליך תקבלי כתובת URL של הפונקציה (למשל
`https://us-central1-ladat-od.cloudfunctions.net/createPlayerOnPurchase`) — שמרי אותה, תצטרכי אותה בשלב הבא.

## שלב 4 — חיבור ל-Wix (Automations)

1. בדשבורד Wix: **Automations → Create New Automation**.
2. **Trigger:** "Store – Order Paid" (או "New Order"), מסוננת למוצר "לדעת עוד" בלבד.
3. **Action:** "Send an HTTP request" (Webhook):
   - URL: כתובת הפונקציה משלב 3
   - Method: POST
   - Header: `x-webhook-secret` = הסוד שהגדרת ב-`WEBHOOK_SECRET`
   - Body (JSON): `{ "email": "{{customer.email}}" }` (שם השדה המדויק תלוי בעורך האוטומציות של Wix — יש שם שדה שמפנה לאימייל הלקוח מתוך ה-trigger)
4. שמרי והפעילי את האוטומציה.

## שלב 5 — עמוד "הגישה שלך" ב-Wix

1. צרי עמוד חדש ב-Wix, הגבילי אותו ב-**Permissions → Site Members → Specific members → Members with plan subscriptions / paying customers** (מקושר למוצר "לדעת עוד").
2. על העמוד הזה שימי רק כפתור/קישור שמוביל לכתובת האמיתית של המשחק
   (זו שתעלה ל-GitHub Pages, למשל `https://avishagnave-creator.github.io/ladat-od/ladat-od.html`).
   **חשוב:** אל תטמיעי את המשחק כ-iframe בעמוד הזה — כפתור ההתקנה (PWA) לא יעבוד מתוך iframe.
   הקישור צריך לפתוח את הדף האמיתי בטאב/עמוד עצמאי.

## שלב 6 — בדיקה מקצה לקצה

1. בצעי רכישת בדיקה (או השתמשי בכלי הבדיקה של Wix Automations).
2. ודאי שהגיע מייל מ-Firebase עם קישור לקביעת סיסמה.
3. קבעי סיסמה, ואז כנסי לכתובת המשחק והתחברי.
4. ודאי שכפתור "התקינו את המשחק כאפליקציה" מופיע ועובד.

---

### מה כבר מוכן ולא דורש ממך שום דבר נוסף:
- חיבור חשבונית ירוקה ל-Wix Stores (הפקת חשבונית אוטומטית) — קיים כבר בפלטפורמה.
- קוד הכניסה (מייל+סיסמה), "שכחתי סיסמה", והתנתקות — כבר בנוי בתוך `ladat-od.html`.
- קוד הפונקציה שיוצרת חשבונות — מוכן בתיקיית `firebase-functions/`.

### מה עדיין דורש ממך פעולה (כי אלה החשבונות שלך ואין לי גישה אליהם):
- יצירת פרויקט Firebase + הדבקת ה-config (שלבים 1-2).
- פריסת הפונקציה (שלב 3) — אם זה מרגיש טכני מדי, זה משהו שמפתח/ת יכול/ה
  לעשות במהירות תוך כדי שיחה, ואפשר גם שאני אכתוב הוראות מפורטות עוד יותר.
- חיבור האוטומציה ב-Wix (שלבים 4-5).
