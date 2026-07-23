# לדעת עוד — משחק קלפים זוגי

משחק קלפים דיגיטלי לזוגות, בשיטת טנדו (אבישג נווה).

## מבנה הפרויקט

```
ladat-od.html          קובץ המשחק המלא (HTML+CSS+JS, ללא תלויות חיצוניות)
dice-test.html         גרסת בדיקה עצמאית של הקוביה התלת-ממדית

past.jpg, present.jpg, future.jpg, task.jpg,
joker.jpg, free_choice.jpg                       תמונות הקלפים (חזית החפיסות)

past_dice.jpg, present_dice.jpg, future_dice.jpg,
task_dice.jpg, joker_dice.jpg, free_choice_dice.jpg   תמונות פאות הקוביה

tando-logo.png         לוגו טנדו (בשימוש בתוך המשחק)
ladat-od.jpg           לוגו "לדעת עוד" (בשימוש בתוך המשחק)

marketing/             חומרי שיווק (עיצוב קופסה וכו') - לא בשימוש בתוך המשחק עצמו
legacy/                נכסים מגרסאות קודמות שהוחלפו, נשמרים לצורך היסטוריה
```

## הרצה

קובץ HTML יחיד, ללא build step. יש לפתוח את `ladat-od.html` בדפדפן,
או להעלות את כל התיקייה (כולל כל קבצי התמונה) יחד ל-GitHub Pages / Wix /
כל אחסון סטטי אחר. כל קבצי התמונה חייבים לשבת באותה תיקייה כמו קובץ ה-HTML.

## פיתוח

כל שינוי משמעותי מתועד כ-commit נפרד. ראו `git log` להיסטוריה המלאה.
