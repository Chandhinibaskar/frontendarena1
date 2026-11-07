import type { Lang } from '../types'
import { useStore } from '../store/useStore'

export const LANGS: { code: Lang; label: string }[] = [
  { code: 'en', label: 'English' }, { code: 'hi', label: 'हिन्दी' }, { code: 'ta', label: 'தமிழ்' },
  { code: 'es', label: 'Español' }, { code: 'fr', label: 'Français' }, { code: 'ar', label: 'العربية' },
]
const IDX: Record<Lang, number> = { en: 0, hi: 1, ta: 2, es: 3, fr: 4, ar: 5 }

// order: en, hi, ta, es, fr, ar
export const DICT: Record<string, string[]> = {
  tagline: ['Interactive 3D scholarship world', 'इंटरैक्टिव 3D छात्रवृत्ति दुनिया', 'ஊடாடும் 3D உதவித்தொகை உலகம்', 'Mundo 3D interactivo de becas', 'Monde 3D interactif des bourses', 'عالم المنح الدراسية ثلاثي الأبعاد'],
  dashboard: ['Dashboard', 'डैशबोर्ड', 'முகப்பு', 'Panel', 'Tableau de bord', 'لوحة التحكم'],
  discover: ['Discover', 'खोजें', 'கண்டறி', 'Descubrir', 'Découvrir', 'اكتشف'],
  tracker: ['Tracker', 'ट्रैकर', 'கண்காணிப்பு', 'Seguimiento', 'Suivi', 'المتابعة'],
  deadlines: ['Deadlines', 'अंतिम तिथियां', 'கடைசி தேதிகள்', 'Plazos', 'Échéances', 'المواعيد'],
  profile: ['Profile', 'प्रोफ़ाइल', 'சுயவிவரம்', 'Perfil', 'Profil', 'الملف'],
  language: ['Language', 'भाषा', 'மொழி', 'Idioma', 'Langue', 'اللغة'],
  welcome: ['Welcome back', 'वापसी पर स्वागत है', 'மீண்டும் வருக', 'Bienvenido de nuevo', 'Bon retour', 'مرحبًا بعودتك'],
  subtitle: ['Find it. Match it. Apply. Track it.', 'खोजें। मिलाएं। आवेदन करें। ट्रैक करें।', 'கண்டறி. பொருத்து. விண்ணப்பி. கண்காணி.', 'Encuentra. Compara. Postula. Sigue.', 'Trouvez. Comparez. Postulez. Suivez.', 'ابحث. طابق. قدّم. تابع.'],
  saved: ['Saved', 'सहेजे गए', 'சேமித்தவை', 'Guardadas', 'Enregistrées', 'المحفوظة'],
  applied: ['Applied', 'आवेदन किए', 'விண்ணப்பித்தவை', 'Postuladas', 'Postulées', 'المقدَّمة'],
  dueWeek: ['Due this week', 'इस सप्ताह देय', 'இந்த வாரம் முடிவு', 'Vencen esta semana', 'Cette semaine', 'تنتهي هذا الأسبوع'],
  coins: ['Coins', 'सिक्के', 'நாணயங்கள்', 'Monedas', 'Pièces', 'عملات'],
  topMatches: ['Top matches for you', 'आपके लिए सर्वश्रेष्ठ मिलान', 'உங்களுக்கான சிறந்த பொருத்தங்கள்', 'Mejores coincidencias para ti', 'Vos meilleures correspondances', 'أفضل المطابقات لك'],
  upcoming: ['Upcoming deadlines', 'आगामी अंतिम तिथियां', 'வரவிருக்கும் கடைசி தேதிகள்', 'Próximos plazos', 'Prochaines échéances', 'المواعيد القادمة'],
  nudge: ['Deadline nudge', 'अंतिम तिथि अनुस्मारक', 'கடைசி தேதி நினைவூட்டல்', 'Aviso de plazo', 'Rappel d’échéance', 'تذكير بالموعد'],
  inspect: ['Inspect', 'देखें', 'பார்', 'Ver', 'Voir', 'عرض'],
  search: ['Search scholarships…', 'छात्रवृत्ति खोजें…', 'உதவித்தொகை தேடு…', 'Buscar becas…', 'Rechercher des bourses…', 'ابحث عن منحة…'],
  level: ['Level', 'स्तर', 'நிலை', 'Nivel', 'Niveau', 'المستوى'],
  field: ['Field', 'क्षेत्र', 'துறை', 'Campo', 'Domaine', 'المجال'],
  country: ['Country', 'देश', 'நாடு', 'País', 'Pays', 'الدولة'],
  all: ['All', 'सभी', 'அனைத்தும்', 'Todos', 'Tous', 'الكل'],
  sort: ['Sort by', 'क्रमबद्ध करें', 'வரிசைப்படுத்து', 'Ordenar por', 'Trier par', 'ترتيب حسب'],
  sortMatch: ['Best match', 'सर्वश्रेष्ठ मिलान', 'சிறந்த பொருத்தம்', 'Mejor coincidencia', 'Meilleure correspondance', 'أفضل مطابقة'],
  sortAmount: ['Highest amount', 'अधिकतम राशि', 'அதிகத் தொகை', 'Mayor monto', 'Montant le plus élevé', 'الأعلى قيمة'],
  sortDeadline: ['Soonest deadline', 'निकटतम तिथि', 'அருகிலுள்ள தேதி', 'Plazo más próximo', 'Échéance la plus proche', 'أقرب موعد'],
  noResults: ['No scholarships match your filters.', 'कोई छात्रवृत्ति नहीं मिली।', 'வடிப்பான்களுக்கு பொருந்தும் உதவித்தொகை இல்லை.', 'Ninguna beca coincide con tus filtros.', 'Aucune bourse ne correspond à vos filtres.', 'لا توجد منح مطابقة للفلاتر.'],
  eligibility: ['Eligibility check', 'पात्रता जांच', 'தகுதி சோதனை', 'Verificación de elegibilidad', 'Vérification d’éligibilité', 'فحص الأهلية'],
  elig_gpa: ['Minimum GPA', 'न्यूनतम जीपीए', 'குறைந்தபட்ச GPA', 'Promedio mínimo', 'Moyenne minimale', 'الحد الأدنى للمعدل'],
  elig_income: ['Income limit', 'आय सीमा', 'வருமான வரம்பு', 'Límite de ingresos', 'Plafond de revenu', 'حد الدخل'],
  documents: ['Documents needed', 'आवश्यक दस्तावेज़', 'தேவையான ஆவணங்கள்', 'Documentos necesarios', 'Documents requis', 'المستندات المطلوبة'],
  steps: ['How to apply', 'आवेदन कैसे करें', 'விண்ணப்பிப்பது எப்படி', 'Cómo postular', 'Comment postuler', 'كيفية التقديم'],
  save: ['Save', 'सहेजें', 'சேமி', 'Guardar', 'Enregistrer', 'حفظ'],
  unsave: ['Remove', 'हटाएं', 'நீக்கு', 'Quitar', 'Retirer', 'إزالة'],
  start: ['Start application', 'आवेदन शुरू करें', 'விண்ணப்பத்தைத் தொடங்கு', 'Iniciar solicitud', 'Commencer la candidature', 'ابدأ التقديم'],
  back: ['Back', 'वापस', 'பின்', 'Volver', 'Retour', 'رجوع'],
  match: ['match', 'मिलान', 'பொருத்தம்', 'coincidencia', 'correspondance', 'مطابقة'],
  daysLeft: ['days left', 'दिन शेष', 'நாட்கள் உள்ளன', 'días restantes', 'jours restants', 'يومًا متبقيًا'],
  col_saved: ['Saved', 'सहेजे गए', 'சேமித்தவை', 'Guardadas', 'Enregistrées', 'المحفوظة'],
  col_progress: ['In progress', 'प्रगति में', 'செயலில்', 'En curso', 'En cours', 'قيد التنفيذ'],
  col_submitted: ['Submitted', 'जमा किया', 'சமர்ப்பித்தது', 'Enviadas', 'Soumises', 'مُرسلة'],
  col_awarded: ['Awarded', 'प्राप्त', 'வென்றது', 'Concedidas', 'Obtenues', 'تم المنح'],
  col_rejected: ['Rejected', 'अस्वीकृत', 'நிராகரிக்கப்பட்டது', 'Rechazadas', 'Refusées', 'مرفوضة'],
  empty: ['Drop a scholarship here', 'यहां छात्रवृत्ति छोड़ें', 'இங்கே உதவித்தொகையை விடுங்கள்', 'Suelta una beca aquí', 'Déposez une bourse ici', 'أفلت منحة هنا'],
  move: ['Move to', 'यहां ले जाएं', 'நகர்த்து', 'Mover a', 'Déplacer vers', 'انقل إلى'],
  docsReady: ['docs ready', 'दस्तावेज़ तैयार', 'ஆவணங்கள் தயார்', 'docs listos', 'docs prêts', 'مستندات جاهزة'],
  name: ['Name', 'नाम', 'பெயர்', 'Nombre', 'Nom', 'الاسم'],
  gpa: ['GPA (0–4)', 'जीपीए (0–4)', 'GPA (0–4)', 'Promedio (0–4)', 'Moyenne (0–4)', 'المعدل (0–4)'],
  income: ['Family income per year (USD)', 'पारिवारिक आय प्रति वर्ष (USD)', 'குடும்ப ஆண்டு வருமானம் (USD)', 'Ingreso familiar anual (USD)', 'Revenu familial annuel (USD)', 'دخل الأسرة السنوي (دولار)'],
  saveProfile: ['Save profile', 'प्रोफ़ाइल सहेजें', 'சுயவிவரத்தைச் சேமி', 'Guardar perfil', 'Enregistrer le profil', 'حفظ الملف'],
  profileSaved: ['Profile saved', 'प्रोफ़ाइल सहेजी गई', 'சுயவிவரம் சேமிக்கப்பட்டது', 'Perfil guardado', 'Profil enregistré', 'تم حفظ الملف'],
  profileHint: ['Your profile powers every match score.', 'आपकी प्रोफ़ाइल हर मिलान स्कोर तय करती है।', 'உங்கள் சுயவிவரம் ஒவ்வொரு பொருத்த மதிப்பெண்ணையும் தீர்மானிக்கிறது.', 'Tu perfil determina cada puntuación.', 'Votre profil détermine chaque score.', 'ملفك الشخصي يحدد كل درجة مطابقة.'],
  today: ['Today', 'आज', 'இன்று', 'Hoy', 'Aujourd’hui', 'اليوم'],
  yours: ['In your tracker', 'आपके ट्रैकर में', 'உங்கள் கண்காணிப்பில்', 'En tu seguimiento', 'Dans votre suivi', 'في متابعتك'],
  notFound: ['Scholarship not found.', 'छात्रवृत्ति नहीं मिली।', 'உதவித்தொகை கிடைக்கவில்லை.', 'Beca no encontrada.', 'Bourse introuvable.', 'لم يتم العثور على المنحة.'],
  skip: ['Skip to content', 'सामग्री पर जाएं', 'உள்ளடக்கத்திற்குச் செல்', 'Saltar al contenido', 'Aller au contenu', 'تخطَّ إلى المحتوى'],
  met: ['Met', 'पूरा', 'பூர்த்தி', 'Cumple', 'Rempli', 'مستوفى'],
  notMet: ['Not met', 'पूरा नहीं', 'பூர்த்தி இல்லை', 'No cumple', 'Non rempli', 'غير مستوفى'],
  loading: ['Loading…', 'लोड हो रहा है…', 'ஏற்றுகிறது…', 'Cargando…', 'Chargement…', 'جارٍ التحميل…'],
  crash: ['Something went wrong. Please reload the page.', 'कुछ गलत हो गया। कृपया पेज पुनः लोड करें।', 'ஏதோ தவறு நடந்தது. பக்கத்தை மீண்டும் ஏற்றவும்.', 'Algo salió mal. Recarga la página.', 'Une erreur est survenue. Rechargez la page.', 'حدث خطأ ما. أعد تحميل الصفحة.'],
  mainNav: ['Main navigation', 'मुख्य नेविगेशन', 'முதன்மை வழிசெலுத்தல்', 'Navegación principal', 'Navigation principale', 'التنقل الرئيسي'],
  walk: ['Move your mouse to look around the world', 'दुनिया देखने के लिए माउस घुमाएं', 'உலகைப் பார்க்க சுட்டியை நகர்த்தவும்', 'Mueve el ratón para mirar el mundo', 'Bougez la souris pour explorer le monde', 'حرّك الفأرة لاستكشاف العالم'],
}

export function useT() {
  const lang = useStore((s) => s.lang)
  return (k: string) => (DICT[k] ?? [k])[IDX[lang]] ?? DICT[k]?.[0] ?? k
}
