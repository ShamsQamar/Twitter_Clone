import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { initReactI18next } from 'react-i18next';

i18n.use(LanguageDetector).use(initReactI18next).init({
    debug: true,
    fallbackLng: "en",
    returnObjects: true,
    resources: {
        en: {
            translation: {
                greeting: "Welcome",
                tweet: "tweet",
                sidebar: {
                    home: "Home",
                    explore: "Explore",
                    notifications: "Notifications",
                    messages: "Messages",
                    bookmarks: "Bookmarks",
                    lists: "Lists",
                    profile: "Profile",
                    more: "More",
                    change: "Change language",
                    logout: "Log out",
                },
                users: {
                    name1: 'Shams Qamar',
                    name2: 'Sarah John',
                    name3: 'Bhola Kumar',
                    name4: 'Tabish Qamar'
                },
                happening: "What's happening?",
                search: "Search Twitter",
                uimg: "Uploading image",
                img: "Image uploaded",
                post: {
                    view: "View Profile",
                    unmute: "Unmute",
                    delete: "Delete this post",
                    noc : "No comments yet",
                    wtc: "Write a comment..."
                },
                profile: {
                    tweets: "Tweets",
                    edit: "Edit profile",
                    editp: "Edit Profile",
                    save: "Save",
                    birth: "Birth Date",
                    switchh: "Switch to professional",
                    edob: "Edit date of birth?",
                    desc: `This can only be changed a few times.
                    Make sure you enter the age of the 
                    person using the account. `,
                    close: "CLOSE",
                    e: "Edit",
                    adob: 'Add your date of birth',
                },
                notification: {
                    nothing: "Nothing to show",
                    dont: "You don't have any notification",
                    liked: "liked",
                    disliked: "disliked",
                    likey: "liked your post",
                    dislikey: "disliked your post",
                    last: `'s post`,
                    comy: "commented on your post",
                    com: "commented on",
                    co: "commented on own post",
                    lk: "liked own post",
                    dk: "disliked own post",
                    newn: "new notifications",
                },
                toasting: {
                    tweeted: "has tweeted",
                    cover: "has changed the cover photo",
                    dp: "has changed the profile picture"
                },
                changemodal: {
                    verify: "Verify to change the language",
                    selecto: 'Select the language from options',
                    enter: "Enter your OTP",
                    vo: "Verify OTP",
                    enterp: "Enter your phone number",
                    sendo: "Send OTP",
                    morelng: "More languages coming soon...",
                    ch: "Change"
                },
                soon: "Coming Soon..."
            }
        },
        fr: {
            translation: {
                greeting: "Bienvenue",
                tweet: "tweeter",
                sidebar: {
                    home: "maison",
                    explore: "explorer",
                    notifications: "la notification",
                    messages: "messages",
                    bookmarks: "Signets",
                    lists: "Listes",
                    profile: "Profil",
                    more: "Plus",
                    change: "Changer de langue",
                    logout: "Déconnexion",
                },
                users: {
                    name1: 'Shams Qamar',
                    name2: 'Sarah John',
                    name3: 'Bhola Kumar',
                    name4: 'Tabish Qamar'
                },
                happening: "Que se passe-t-il ?",
                search: "Rechercher sur Twitter",
                uimg: "Téléchargement de l'image",
                img: "Image téléchargée",
                post: {
                    view: "Afficher le profil",
                    unmute: "Réactiver le son",
                    delete: "Supprimer ce message",
                    noc : "Aucun commentaire pour l'instant",
                    wtc: "Écrivez un commentaire..."
                },
                profile: {
                    tweets: "Tweets",
                    edit: "Modifier le profil",
                    editp: "Editer le profil",
                    save: "enregistrer",
                    birth: "Date de naissance",
                    switchh: "Passer en professionnel",
                    edob: "Modifier la date de naissance",
                    desc: `Cela ne peut être modifié que quelques fois.
                    Assurez-vous d'indiquer l'âge du
                    personne utilisant le compte.`,
                    close: "Arrête ça",
                    e: "modifier",
                    adob: 'Ajoutez votre date de naissance',
                },
                notification: {
                    nothing: "Rien à montrer",
                    dont: "Vous n'avez aucune notification",
                    liked: "aimé",
                    disliked: "je n'ai pas aimé",
                    likey: `j'ai aimé votre message`,
                    dislikey: `je n'ai pas aimé votre message`,
                    last: "le post",
                    comy: "a commenté ton post",
                    com: "commenté",
                    co: "a commenté son propre message",
                    lk : `j'ai aimé mon propre message`,
                    dk: `je n'ai pas aimé mon propre message`,
                    newn: "nouvelles notifications"
                },
                toasting: {
                    tweeted: "a tweeté",
                    cover: "a changé sa photo de couverture",
                    dp: "a changé la photo de profil"
                },
                changemodal: {
                    verify: "Vérifier pour changer la langue",
                    selecto: 'Sélectionnez la langue parmi les options',
                    enter: "Entrez votre OTP",
                    vo: "Vérifier OTP",
                    enterp: "Entrez votre numéro de téléphone",
                    sendo: "Envoyer OTP",
                    morelng: "Plus de langues à venir...",
                    ch: "Changement"
                },
                soon: "À venir"
            }
        },
        hi: {
            translation: {
                greeting: "स्वागत",
                tweet: "ट्वीट करें",
                sidebar: {
                    home: "घर",
                    explore: "अन्वेषण",
                    notifications: "सूचनाएं",
                    messages: "संदेशें",
                    bookmarks: "बुकमार्क",
                    lists: "सूचियाँ",
                    profile: "प्रोफ़ाइल",
                    more: "कुछ और",
                    change: "भाषा बदलें",
                    logout: "लॉग आउट",
                },
                users: {
                    name1: 'शम्स कमर',
                    name2: 'सारा जॉन',
                    name3: 'भोला कुमार',
                    name4: 'ताबिश कमर'
                },
                happening: "क्या हो रहा है?",
                search: "ट्विटर खोजें",
                uimg: "छवि अपलोड हो रही है",
                img: "छवि अपलोड की गई",
                post: {
                    view: "प्रोफ़ाइल देखें",
                    unmute: "अनम्यूट",
                    delete: "इस पोस्ट को डीलीट करें",
                    noc : "अभी तक कोई टिप्पणी नहीं हुई है",
                    wtc: "कोई एक टिप्पणी लिखें..."
                },
                profile: {
                    tweets: "ट्वीट्स",
                    edit: "संपादित करें",
                    editp: "प्रोफ़ाइल संपादित करें",
                    save: "सेव करें",
                    birth: "जन्म तिथि",
                    switchh: "पेशेवर पर स्विच करें",
                    edob: "जन्म तिथि संपादित करें?",
                    desc: `इसे केवल कुछ ही बार बदला जा सकता है.
                    सुनिश्चित करें कि आपने आयु दर्ज की है
                    खाते का उपयोग करके`,
                    close: "बंद करें",
                    e: "संपादन करें",
                    adob: 'अपनी जन्मतिथि जोड़ें',
                },
                notification: {
                    nothing: "दिखाने के लिए कुछ नहीं",
                    dont: "आपके पास कोई सूचना नहीं है",
                    liked: "ने पसंद किया",
                    disliked: "ने नापसंद किया",
                    likey: "ने आपके पोस्ट को पसंद किया",
                    dislikey: "ने आपके पोस्ट को नापसंद किया",
                    last: "के पोस्ट पर",
                    comy: "ने आपकी पोस्ट पर टिप्पणी की",
                    com: "ने टिप्पणी की",
                    co:  "ने अपनी पोस्ट पर टिप्पणी की",
                    lk: "ने अपनी पोस्ट पसंद की",
                    dk: "ने अपनी ही पोस्ट नापसंद की",
                    newn: "नई सूचनाएं"
                },
                toasting: {
                    tweeted: "ने ट्वीट किया है",
                    cover: "ने अपना कवर चित्र बदल दिया",
                    dp: "ने प्रोफ़ाइल चित्र बदल दिया"
                },
                changemodal: {
                    verify: "भाषा बदलने के लिए सत्यापित करें",
                    selecto: 'विकल्पों में से भाषा चुनें',
                    enter: "अपना ओटीपी दर्ज करें",
                    vo: "ओटीपी सत्यापित करें",
                    enterp: "अपना फ़ोन नंबर दर्ज करें",
                    sendo: "ओटीपी भेजें",
                    morelng: "जल्द ही और भाषाएँ आ रही हैं...",
                    ch: "परिवर्तन करें"
                },
                soon: "जल्द आ रहा है"
            }
        }

    }
})
