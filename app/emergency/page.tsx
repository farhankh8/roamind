'use client'
import { useState, useEffect, useCallback } from 'react'
import type { User } from 'firebase/auth'
import { useRouter } from 'next/navigation'
import { auth } from '@/lib/firebase'
import { onAuthStateChanged } from 'firebase/auth'
import Sidebar from '@/components/Sidebar'

const C = '#63d2ff'
const G = '#ffb74d'
const R = '#ff6b6b'
const GR = '#51cf66'
const BG = '#000814'

interface _EmergencyNumber {
  name: string
  number: string
  type: 'police' | 'ambulance' | 'fire' | 'coastguard' | 'rescue' | 'general'
  icon: string
}

interface CountryEmergencies {
  code: string
  name: string
  flag: string
  police: string
  ambulance: string
  fire: string
  coastguard?: string
  mountainRescue?: string
  general?: string
}

const COUNTRIES_EMERGENCIES: CountryEmergencies[] = [
  { code: 'IN', name: 'India', flag: '🇮🇳', police: '100', ambulance: '102 / 108', fire: '101', general: '112' },
  { code: 'US', name: 'United States', flag: '🇺🇸', police: '911', ambulance: '911', fire: '911', general: '911' },
  { code: 'GB', name: 'United Kingdom', flag: '🇬🇧', police: '999 / 101', ambulance: '999', fire: '999', coastguard: '999', general: '112' },
  { code: 'AU', name: 'Australia', flag: '🇦🇺', police: '000', ambulance: '000', fire: '000', general: '112' },
  { code: 'DE', name: 'Germany', flag: '🇩🇪', police: '110', ambulance: '112', fire: '112', general: '112' },
  { code: 'FR', name: 'France', flag: '🇫🇷', police: '17', ambulance: '15', fire: '18', general: '112' },
  { code: 'JP', name: 'Japan', flag: '🇯🇵', police: '110', ambulance: '119', fire: '119', general: '112' },
  { code: 'AE', name: 'UAE', flag: '🇦🇪', police: '999', ambulance: '998', fire: '997', general: '112' },
  { code: 'CA', name: 'Canada', flag: '🇨🇦', police: '911', ambulance: '911', fire: '911', general: '911' },
  { code: 'SG', name: 'Singapore', flag: '🇸🇬', police: '999', ambulance: '995', fire: '995', general: '112' },
  { code: 'TH', name: 'Thailand', flag: '🇹🇭', police: '191', ambulance: '1669', fire: '199', general: '112' },
  { code: 'BR', name: 'Brazil', flag: '🇧🇷', police: '190', ambulance: '192', fire: '193', general: '112' },
  { code: 'MX', name: 'Mexico', flag: '🇲🇽', police: '911', ambulance: '911', fire: '911', general: '911' },
  { code: 'ES', name: 'Spain', flag: '🇪🇸', police: '091', ambulance: '061', fire: '080', general: '112' },
  { code: 'IT', name: 'Italy', flag: '🇮🇹', police: '113', ambulance: '118', fire: '115', general: '112' },
  { code: 'NL', name: 'Netherlands', flag: '🇳🇱', police: '112 / 0900-8844', ambulance: '112', fire: '112', general: '112' },
  { code: 'BE', name: 'Belgium', flag: '🇧🇪', police: '101', ambulance: '100', fire: '100', general: '112' },
  { code: 'CH', name: 'Switzerland', flag: '🇨🇭', police: '117', ambulance: '144', fire: '118', general: '112' },
  { code: 'AT', name: 'Austria', flag: '🇦🇹', police: '133', ambulance: '144', fire: '122', general: '112' },
  { code: 'NZ', name: 'New Zealand', flag: '🇳🇿', police: '111', ambulance: '111', fire: '111', general: '112' },
  { code: 'ZA', name: 'South Africa', flag: '🇿🇦', police: '10111', ambulance: '10177', fire: '10177', general: '112' },
  { code: 'KR', name: 'South Korea', flag: '🇰🇷', police: '112', ambulance: '119', fire: '119', general: '112' },
  { code: 'CN', name: 'China', flag: '🇨🇳', police: '110', ambulance: '120', fire: '119', general: '122' },
  { code: 'ID', name: 'Indonesia', flag: '🇮🇩', police: '110', ambulance: '118', fire: '113', general: '112' },
  { code: 'MY', name: 'Malaysia', flag: '🇲🇾', police: '999', ambulance: '999', fire: '994', general: '112' },
  { code: 'PH', name: 'Philippines', flag: '🇵🇭', police: '117', ambulance: '911', fire: '911', general: '112' },
  { code: 'VN', name: 'Vietnam', flag: '🇻🇳', police: '113', ambulance: '115', fire: '114', general: '112' },
  { code: 'GR', name: 'Greece', flag: '🇬🇷', police: '100', ambulance: '166', fire: '199', general: '112' },
  { code: 'PT', name: 'Portugal', flag: '🇵🇹', police: '112', ambulance: '112', fire: '112', general: '112' },
  { code: 'SE', name: 'Sweden', flag: '🇸🇪', police: '112', ambulance: '112', fire: '112', general: '112' },
  { code: 'NO', name: 'Norway', flag: '🇳🇴', police: '112', ambulance: '113', fire: '110', general: '112' },
  { code: 'DK', name: 'Denmark', flag: '🇩🇰', police: '112', ambulance: '112', fire: '112', general: '112' },
  { code: 'FI', name: 'Finland', flag: '🇫🇮', police: '112', ambulance: '112', fire: '112', general: '112' },
  { code: 'PL', name: 'Poland', flag: '🇵🇱', police: '997', ambulance: '999', fire: '998', general: '112' },
  { code: 'CZ', name: 'Czech Republic', flag: '🇨🇿', police: '158', ambulance: '155', fire: '150', general: '112' },
  { code: 'HU', name: 'Hungary', flag: '🇭🇺', police: '107', ambulance: '104', fire: '105', general: '112' },
  { code: 'RO', name: 'Romania', flag: '🇷🇴', police: '112', ambulance: '112', fire: '112', general: '112' },
  { code: 'HR', name: 'Croatia', flag: '🇭🇷', police: '192', ambulance: '194', fire: '193', general: '112' },
  { code: 'RU', name: 'Russia', flag: '🇷🇺', police: '102', ambulance: '103', fire: '101', general: '112' },
  { code: 'TR', name: 'Turkey', flag: '🇹🇷', police: '155', ambulance: '112', fire: '110', general: '112' },
  { code: 'IL', name: 'Israel', flag: '🇮🇱', police: '100', ambulance: '101', fire: '102', general: '112' },
  { code: 'EG', name: 'Egypt', flag: '🇪🇬', police: '122', ambulance: '123', fire: '180', general: '112' },
  { code: 'KE', name: 'Kenya', flag: '🇰🇪', police: '999', ambulance: '999', fire: '999', general: '112' },
  { code: 'MA', name: 'Morocco', flag: '🇲🇦', police: '19', ambulance: '15', fire: '15', general: '112' },
  { code: 'AR', name: 'Argentina', flag: '🇦🇷', police: '101', ambulance: '107', fire: '100', general: '112' },
  { code: 'CL', name: 'Chile', flag: '🇨🇱', police: '133', ambulance: '131', fire: '132', general: '112' },
  { code: 'CO', name: 'Colombia', flag: '🇨🇴', police: '123', ambulance: '123', fire: '119', general: '112' },
  { code: 'PE', name: 'Peru', flag: '🇵🇪', police: '105', ambulance: '117', fire: '116', general: '112' },
  { code: 'SA', name: 'Saudi Arabia', flag: '🇸🇦', police: '999', ambulance: '997', fire: '998', general: '112' },
  { code: 'QA', name: 'Qatar', flag: '🇶🇦', police: '999', ambulance: '999', fire: '999', general: '112' },
  { code: 'KW', name: 'Kuwait', flag: '🇰🇼', police: '112', ambulance: '112', fire: '112', general: '112' },
  { code: 'BH', name: 'Bahrain', flag: '🇧🇭', police: '999', ambulance: '999', fire: '999', general: '112' },
  { code: 'JO', name: 'Jordan', flag: '🇯🇴', police: '911', ambulance: '911', fire: '911', general: '112' },
  { code: 'NG', name: 'Nigeria', flag: '🇳🇬', police: '199', ambulance: '123', fire: '190', general: '112' },
  { code: 'GH', name: 'Ghana', flag: '🇬🇭', police: '191', ambulance: '193', fire: '192', general: '112' },
  { code: 'ET', name: 'Ethiopia', flag: '🇪🇹', police: '991', ambulance: '907', fire: '939', general: '112' },
  { code: 'VE', name: 'Venezuela', flag: '🇻🇪', police: '171', ambulance: '171', fire: '171', general: '112' },
  { code: 'UA', name: 'Ukraine', flag: '🇺🇦', police: '102', ambulance: '103', fire: '101', general: '112' },
  { code: 'RS', name: 'Serbia', flag: '🇷🇸', police: '192', ambulance: '194', fire: '193', general: '112' },
  { code: 'BG', name: 'Bulgaria', flag: '🇧🇬', police: '166', ambulance: '150', fire: '160', general: '112' },
  { code: 'SK', name: 'Slovakia', flag: '🇸🇰', police: '158', ambulance: '155', fire: '150', general: '112' },
  { code: 'SI', name: 'Slovenia', flag: '🇸🇮', police: '113', ambulance: '112', fire: '112', general: '112' },
  { code: 'LT', name: 'Lithuania', flag: '🇱🇹', police: '112', ambulance: '112', fire: '112', general: '112' },
  { code: 'LV', name: 'Latvia', flag: '🇱🇻', police: '112', ambulance: '112', fire: '112', general: '112' },
  { code: 'EE', name: 'Estonia', flag: '🇪🇪', police: '112', ambulance: '112', fire: '112', general: '112' },
  { code: 'LK', name: 'Sri Lanka', flag: '🇱🇰', police: '119', ambulance: '110', fire: '110', general: '112' },
  { code: 'NP', name: 'Nepal', flag: '🇳🇵', police: '100', ambulance: '102', fire: '101', general: '112' },
  { code: 'BD', name: 'Bangladesh', flag: '🇧🇩', police: '999', ambulance: '999', fire: '199', general: '112' },
  { code: 'PK', name: 'Pakistan', flag: '🇵🇰', police: '15', ambulance: '115', fire: '16', general: '112' },
  { code: 'MM', name: 'Myanmar', flag: '🇲🇲', police: '199', ambulance: '192', fire: '191', general: '112' },
  { code: 'KH', name: 'Cambodia', flag: '🇰🇭', police: '117', ambulance: '119', fire: '118', general: '112' },
  { code: 'LA', name: 'Laos', flag: '🇱🇦', police: '191', ambulance: '195', fire: '190', general: '112' },
  { code: 'TW', name: 'Taiwan', flag: '🇹🇼', police: '110', ambulance: '119', fire: '119', general: '112' },
  { code: 'HK', name: 'Hong Kong', flag: '🇭🇰', police: '999', ambulance: '999', fire: '999', general: '112' },
  { code: 'MO', name: 'Macau', flag: '🇲🇴', police: '999', ambulance: '999', fire: '993', general: '112' },
  { code: 'IE', name: 'Ireland', flag: '🇮🇪', police: '112 / 999', ambulance: '112 / 999', fire: '112 / 999', general: '112' },
  { code: 'IS', name: 'Iceland', flag: '🇮🇸', police: '112', ambulance: '112', fire: '112', general: '112' },
  { code: 'CY', name: 'Cyprus', flag: '🇨🇾', police: '112 / 199', ambulance: '112', fire: '112', general: '112' },
  { code: 'MT', name: 'Malta', flag: '🇲🇹', police: '112', ambulance: '112', fire: '112', general: '112' },
  { code: 'LU', name: 'Luxembourg', flag: '🇱🇺', police: '113', ambulance: '112', fire: '112', general: '112' },
  { code: 'TN', name: 'Tunisia', flag: '🇹🇳', police: '197', ambulance: '190', fire: '198', general: '112' },
  { code: 'DZ', name: 'Algeria', flag: '🇩🇿', police: '1548', ambulance: '14', fire: '14', general: '112' },
  { code: 'EC', name: 'Ecuador', flag: '🇪🇨', police: '101', ambulance: '131', fire: '102', general: '112' },
  { code: 'UY', name: 'Uruguay', flag: '🇺🇾', police: '911', ambulance: '105', fire: '104', general: '112' },
  { code: 'PY', name: 'Paraguay', flag: '🇵🇾', police: '911', ambulance: '141', fire: '132', general: '112' },
  { code: 'BO', name: 'Bolivia', flag: '🇧🇴', police: '110', ambulance: '118', fire: '119', general: '112' },
  { code: 'GE', name: 'Georgia', flag: '🇬🇪', police: '112', ambulance: '112', fire: '112', general: '112' },
  { code: 'AM', name: 'Armenia', flag: '🇦🇲', police: '102', ambulance: '103', fire: '101', general: '112' },
  { code: 'AZ', name: 'Azerbaijan', flag: '🇦🇿', police: '102', ambulance: '103', fire: '101', general: '112' },
]

const MEDICAL_GUIDES = [
  {
    id: 'heart',
    title: 'Heart Attack',
    icon: '❤️‍🔥',
    color: R,
    symptoms: ['Chest pain or pressure', 'Shortness of breath', 'Pain in arm/jaw/neck', 'Cold sweat', 'Nausea'],
    steps: [
      'Call emergency services immediately (112 or local)',
      'Sit or lie down, stay calm',
      'Chew aspirin if available (unless allergic)',
      'Loosen tight clothing',
      'If cardiac arrest, begin CPR',
    ],
    tellOperator: 'Say: "Possible heart attack. Patient has chest pain and difficulty breathing."',
  },
  {
    id: 'choking',
    title: 'Choking',
    icon: '😰',
    color: '#ff9800',
    symptoms: ['Cannot speak or breathe', 'Clutching throat', 'Blue lips/skin', 'Panic'],
    steps: [
      'Call emergency services immediately',
      'Give 5 back blows between shoulder blades',
      'Give 5 abdominal thrusts (Heimlich)',
      'Repeat until object is expelled',
      'If unconscious, begin CPR',
    ],
    tellOperator: 'Say: "Person is choking and cannot breathe."',
  },
  {
    id: 'drowning',
    title: 'Drowning',
    icon: '🌊',
    color: C,
    symptoms: ['No breathing', 'Blue lips', 'Cold skin', 'Unconscious'],
    steps: [
      'Remove person from water safely',
      'Call emergency services immediately',
      'Check breathing, tilt head back',
      'If not breathing, give rescue breaths',
      'Perform CPR if needed',
    ],
    tellOperator: 'Say: "Person drowning, pulled from water, not breathing."',
  },
  {
    id: 'allergic',
    title: 'Allergic Reaction',
    icon: '😵',
    color: '#9c27b0',
    symptoms: ['Swelling (face/throat)', 'Hives', 'Difficulty breathing', 'Dizziness'],
    steps: [
      'Call emergency if severe symptoms',
      'Use epinephrine auto-injector (EpiPen) if available',
      'Keep person lying down with legs elevated',
      'Monitor breathing continuously',
      'Be ready to perform CPR',
    ],
    tellOperator: 'Say: "Severe allergic reaction, patient cannot breathe properly."',
  },
  {
    id: 'snake',
    title: 'Snake Bite',
    icon: '🐍',
    color: GR,
    symptoms: ['Puncture wounds', 'Severe pain', 'Swelling', 'Nausea'],
    steps: [
      'Keep calm, move away from snake',
      'Call emergency services',
      'Keep bitten area below heart level',
      'Remove jewelry before swelling',
      'DO NOT: Cut wound, suck poison, apply tourniquet',
    ],
    tellOperator: 'Say: "Snake bite, patient has severe pain and swelling."',
  },
  {
    id: 'heat',
    title: 'Heat Stroke',
    icon: '🌡️',
    color: R,
    symptoms: ['High body temp (104°F+)', 'No sweating', 'Confusion', 'Rapid pulse'],
    steps: [
      'Call emergency services immediately',
      'Move to cool area',
      'Remove excess clothing',
      'Cool with water, ice packs on neck/arms',
      'Fan while misting with cool water',
    ],
    tellOperator: 'Say: "Heat stroke, body temperature very high, patient confused."',
  },
  {
    id: 'burns',
    title: 'Severe Burns',
    icon: '🔥',
    color: '#ff5722',
    symptoms: ['White/charred skin', 'Blisters', 'Severe pain', 'Large affected area'],
    steps: [
      'Call emergency services for severe burns',
      'Remove clothing if not stuck to burn',
      'Cool with running water 10-20 minutes',
      'Cover with clean non-stick bandage',
      'DO NOT apply ice, butter, or creams',
    ],
    tellOperator: 'Say: "Severe burn injury, patient in extreme pain."',
  },
  {
    id: 'bleeding',
    title: 'Heavy Bleeding',
    icon: '🩸',
    color: R,
    symptoms: ['Blood not stopping', 'Bright red spurting', 'Large wound', 'Dizziness'],
    steps: [
      'Call emergency services immediately',
      'Apply direct pressure with clean cloth',
      'Do not remove cloth if blood soaks through',
      'Keep pressure constant',
      'Elevate injured area if possible',
    ],
    tellOperator: "Say: 'Heavy bleeding that will not stop. Patient is losing a lot of blood.'",
  },
  {
    id: 'seizure',
    title: 'Seizure',
    icon: '⚡',
    color: '#ab47bc',
    symptoms: ['Uncontrolled shaking', 'Loss of consciousness', 'Confusion after', 'Rigid body'],
    steps: [
      'Call emergency if seizure lasts more than 5 minutes',
      'Clear area of dangerous objects',
      'Do NOT restrain the person',
      'Place on side if possible',
      'Time the seizure duration',
    ],
    tellOperator: 'Say: "Person is having a seizure, has been shaking for ___ minutes."',
  },
  {
    id: 'diabetic',
    title: 'Diabetic Emergency',
    icon: '💉',
    color: '#29b6f6',
    symptoms: ['Confusion', 'Sweating', 'Shaking', 'Slurred speech', 'Loss of coordination'],
    steps: [
      'If conscious, give sugar (juice, candy, glucose tablets)',
      'Call emergency if unconscious',
      'Do NOT give food/drink if unconscious',
      'Check blood sugar if meter available',
      'Keep warm, reassure when conscious',
    ],
    tellOperator: 'Say: "Diabetic emergency, patient is confused and may be having low blood sugar."',
  },
  {
    id: 'fracture',
    title: 'Broken Bone',
    icon: '🦴',
    color: '#ffa726',
    symptoms: ['Severe pain', 'Swelling', 'Cannot move limb', 'Visible deformity'],
    steps: [
      'Do NOT move the injured area',
      'Call emergency for severe fractures',
      'Immobilize the limb in current position',
      'Apply ice pack wrapped in cloth',
      'Treat for shock if needed',
    ],
    tellOperator: 'Say: "Possible broken bone, patient has severe pain and cannot move the limb."',
  },
  {
    id: 'asthma',
    title: 'Asthma Attack',
    icon: '😮‍💨',
    color: '#26a69a',
    symptoms: ['Wheezing', 'Shortness of breath', 'Tight chest', 'Coughing'],
    steps: [
      'Help person use rescue inhaler (blue)',
      'Sit upright, stay calm',
      'Loosen tight clothing',
      'Call emergency if no improvement in 15 min',
      'Be ready to perform CPR if needed',
    ],
    tellOperator: 'Say: "Asthma attack, patient cannot breathe and inhaler is not helping."',
  },
  {
    id: 'stroke',
    title: 'Stroke',
    icon: '🧠',
    color: '#ef5350',
    symptoms: ['Face drooping', 'Arm weakness', 'Speech difficulty', 'Vision problems'],
    steps: [
      'Call emergency services immediately (TIME IS CRITICAL)',
      'Note time symptoms started',
      'Do NOT give food or water',
      'Keep person comfortable, lie down',
      'Check breathing, be ready for CPR',
    ],
    tellOperator: 'Say: "Possible stroke, symptoms started approximately ___ minutes ago."',
  },
]

const PHRASES = [
  { lang: 'English', phrase: 'I need help!', translation: 'I need help!' },
  { lang: 'Spanish', phrase: 'Necesito ayuda!', translation: 'I need help!' },
  { lang: 'French', phrase: "J'ai besoin d'aide!", translation: 'I need help!' },
  { lang: 'German', phrase: 'Ich brauche Hilfe!', translation: 'I need help!' },
  { lang: 'Japanese', phrase: '助けてください!', translation: 'I need help!' },
  { lang: 'Chinese (Mandarin)', phrase: '我需要帮助!', translation: 'I need help!' },
  { lang: 'Korean', phrase: '도와주세요!', translation: 'I need help!' },
  { lang: 'Arabic', phrase: 'أحتاج مساعدة!', translation: 'I need help!' },
  { lang: 'Portuguese', phrase: 'Preciso de ajuda!', translation: 'I need help!' },
  { lang: 'Thai', phrase: 'ต้องการความช่วยเหลือ!', translation: 'I need help!' },
  { lang: 'Vietnamese', phrase: 'Tôi cần giúp đỡ!', translation: 'I need help!' },
  { lang: 'Indonesian', phrase: 'Saya butuh bantuan!', translation: 'I need help!' },
  { lang: 'Russian', phrase: 'Мне нужна помощь!', translation: 'I need help!' },
  { lang: 'Italian', phrase: 'Ho bisogno di aiuto!', translation: 'I need help!' },
  { lang: 'Turkish', phrase: 'Yardıma ihtiyacım var!', translation: 'I need help!' },
  { lang: 'Hindi', phrase: 'मुझे मदद चाहिए!', translation: 'I need help!' },
  { lang: 'Dutch', phrase: 'Ik heb hulp nodig!', translation: 'I need help!' },
  { lang: 'Polish', phrase: 'Potrzebuję pomocy!', translation: 'I need help!' },
  { lang: 'Greek', phrase: 'Χρειάζομαι βοήθεια!', translation: 'I need help!' },
  { lang: 'Hebrew', phrase: 'אני צריך עזרה!', translation: 'I need help!' },
  { lang: 'Swedish', phrase: 'Jag behöver hjälp!', translation: 'I need help!' },
  { lang: 'Norwegian', phrase: 'Jeg trenger hjelp!', translation: 'I need help!' },
  { lang: 'Danish', phrase: 'Jeg har brug for hjælp!', translation: 'I need help!' },
  { lang: 'Finnish', phrase: 'Tarvitsen apua!', translation: 'I need help!' },
  { lang: 'Czech', phrase: 'Potřebuji pomoc!', translation: 'I need help!' },
  { lang: 'Romanian', phrase: 'Am nevoie de ajutor!', translation: 'I need help!' },
  { lang: 'Hungarian', phrase: 'Segítségre van szükségem!', translation: 'I need help!' },
  { lang: 'Filipino', phrase: 'Kailangan ko ng tulong!', translation: 'I need help!' },
  { lang: 'Malay', phrase: 'Saya perlukan bantuan!', translation: 'I need help!' },
  { lang: 'Persian (Farsi)', phrase: 'من به کمک نیاز دارم!', translation: 'I need help!' },
  { lang: 'Ukrainian', phrase: 'Мені потрібна допомога!', translation: 'I need help!' },
]

const KEY_PHRASES = [
  { eng: 'Call the police', translations: { es: 'Llama a la policia', fr: 'Appelez la police', de: 'Rufen Sie die Polizei', ja: '警察を呼んで', zh: '打电话报警', ar: 'اتصل بالشرطة', hi: 'पुलिस को बुलाओ' } },
  { eng: 'I need a doctor', translations: { es: 'Necesito un medico', fr: "J'ai besoin d'un medecin", de: 'Ich brauche einen Arzt', ja: '医者が必要です', zh: '我需要医生', ar: 'أحتاج طبيب', hi: 'मुझे डॉक्टर चाहिए' } },
  { eng: 'Take me to hospital', translations: { es: 'Llevame al hospital', fr: 'Emmenez-moi a hopital', de: 'Bringen Sie mich ins Krankenhaus', ja: '病院に連れて行ってください', zh: '带我去医院', ar: 'خذني إلى المستشفى', hi: 'मुझे अस्पताल ले जाओ' } },
  { eng: 'I am allergic to...', translations: { es: 'Soy alergico a...', fr: 'Je suis allergique a...', de: 'Ich bin allergisch gegen...', ja: '私は...にアレルギーがあります', zh: '我对...过敏', ar: 'أنا لدي حساسية من...', hi: 'मुझे ... से एलर्जी है' } },
  { eng: 'Where is the embassy?', translations: { es: 'Donde esta la embajada?', fr: 'Ou est ambassade?', de: 'Wo ist die Botschaft?', ja: '大使館はどこですか?', zh: '大使馆在哪里?', ar: 'أين هي السفارة؟', hi: 'दूतावास कहाँ है?' } },
  { eng: 'I lost my passport', translations: { es: 'Perdi mi pasaporte', fr: 'Jai perdu mon passeport', de: 'Ich habe meinen Pass verloren', ja: 'パスポートをなくしました', zh: '我的护照丢了', ar: 'لقد فقدت جواز سفري', hi: 'मेरा पासपोर्ट खो गया' } },
  { eng: 'Call an ambulance', translations: { es: 'Llama una ambulancia', fr: 'Appelez une ambulance', de: 'Rufen Sie einen Krankenwagen', ja: '救急車を呼んで', zh: '叫救护车', ar: 'اتصل بسيارة إسعاف', hi: 'एम्बुलेंस को बुलाओ' } },
  { eng: 'I am diabetic', translations: { es: 'Soy diabético', fr: 'Je suis diabétique', de: 'Ich bin Diabetiker', ja: '私は糖尿病です', zh: '我有糖尿病', ar: 'أنا مريض بالسكري', hi: 'मैं मधुमेह का रोगी हूं' } },
  { eng: 'I have asthma', translations: { es: 'Tengo asma', fr: "J'ai de l'asthme", de: 'Ich habe Asthma', ja: '私は喘息があります', zh: '我有哮喘', ar: 'أنا مصاب بالربو', hi: 'मुझे दमा है' } },
  { eng: 'Please call my family', translations: { es: 'Por favor llama a mi familia', fr: "S'il vous plaît appelez ma famille", de: 'Bitte rufen Sie meine Familie an', ja: '私の家族に連絡してください', zh: '请打电话给我的家人', ar: 'من فضلك اتصل بعائلتي', hi: 'कृपया मेरे परिवार को बुलाओ' } },
]

const MAJOR_INSURERS = [
  { provider: 'Allianz Travel Insurance', hotline: '+1-800-854-6011' },
  { provider: 'World Nomads', hotline: '+1-866-855-1994' },
  { provider: 'AXA Assistance', hotline: '+1-800-982-2842' },
  { provider: 'Travel Guard (AIG)', hotline: '+1-800-826-1300' },
  { provider: 'Generali Global Assistance', hotline: '+1-800-513-4514' },
  { provider: 'Seven Corners', hotline: '+1-800-335-0611' },
  { provider: 'GeoBlue', hotline: '+1-800-257-4823' },
  { provider: 'IMG Global', hotline: '+1-800-628-4664' },
]

const ADVISORY_SEVERITIES = [
  { level: 'low', label: 'Low', color: GR, bg: 'rgba(81,207,102,0.1)' },
  { level: 'medium', label: 'Medium', color: G, bg: 'rgba(255,183,77,0.1)' },
  { level: 'high', label: 'High', color: '#ff9800', bg: 'rgba(255,152,0,0.1)' },
  { level: 'extreme', label: 'Extreme', color: R, bg: 'rgba(255,107,107,0.1)' },
]

const SAMPLE_ADVISORIES = [
  { country: 'Thailand', flag: '🇹🇭', title: 'Monsoon Season', severity: 'medium', date: '2024-07-15', message: 'Heavy rains expected in southern regions. Flash flooding possible. Travel with caution.' },
  { country: 'France', flag: '🇫🇷', title: 'Strike Action', severity: 'low', date: '2024-07-14', message: 'Nationwide transport strikes expected this week. Check schedules before traveling.' },
  { country: 'Japan', flag: '🇯🇵', title: 'Typhoon Warning', severity: 'high', date: '2024-07-14', message: 'Typhoon approaching. Avoid coastal areas. Stock up on essentials.' },
]

const COUNTRY_RISK_RATINGS = [
  { code: 'JP', name: 'Japan', flag: '🇯🇵', risk: 'low', safety: 95 },
  { code: 'SG', name: 'Singapore', flag: '🇸🇬', risk: 'low', safety: 96 },
  { code: 'CH', name: 'Switzerland', flag: '🇨🇭', risk: 'low', safety: 94 },
  { code: 'NZ', name: 'New Zealand', flag: '🇳🇿', risk: 'low', safety: 93 },
  { code: 'AU', name: 'Australia', flag: '🇦🇺', risk: 'low', safety: 91 },
  { code: 'CA', name: 'Canada', flag: '🇨🇦', risk: 'low', safety: 90 },
  { code: 'DE', name: 'Germany', flag: '🇩🇪', risk: 'low', safety: 89 },
  { code: 'ES', name: 'Spain', flag: '🇪🇸', risk: 'low', safety: 88 },
  { code: 'IT', name: 'Italy', flag: '🇮🇹', risk: 'low', safety: 87 },
  { code: 'FR', name: 'France', flag: '🇫🇷', risk: 'low', safety: 86 },
  { code: 'GB', name: 'United Kingdom', flag: '🇬🇧', risk: 'low', safety: 85 },
  { code: 'US', name: 'United States', flag: '🇺🇸', risk: 'medium', safety: 78 },
  { code: 'MX', name: 'Mexico', flag: '🇲🇽', risk: 'medium', safety: 72 },
  { code: 'BR', name: 'Brazil', flag: '🇧🇷', risk: 'medium', safety: 70 },
  { code: 'TH', name: 'Thailand', flag: '🇹🇭', risk: 'medium', safety: 74 },
  { code: 'ZA', name: 'South Africa', flag: '🇿🇦', risk: 'medium', safety: 68 },
  { code: 'IN', name: 'India', flag: '🇮🇳', risk: 'medium', safety: 65 },
  { code: 'EG', name: 'Egypt', flag: '🇪🇬', risk: 'medium', safety: 62 },
  { code: 'RU', name: 'Russia', flag: '🇷🇺', risk: 'high', safety: 55 },
  { code: 'KE', name: 'Kenya', flag: '🇰🇪', risk: 'high', safety: 52 },
]

interface EmergencyContact {
  name: string
  phone: string
  relationship: string
}

interface InsuranceInfo {
  provider: string
  policyNumber: string
  hotline: string
}

export default function Emergency() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [activePath, setActivePath] = useState('/emergency')
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null)
  const [detectedCountry, setDetectedCountry] = useState<CountryEmergencies | null>(null)
  const [locationLoading, setLocationLoading] = useState(true)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [, setShowSOS] = useState(false)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [, setSOSMessage] = useState('')
  const [activeSection, setActiveSection] = useState('numbers')
  const [selectedGuide, setSelectedGuide] = useState<string | null>(null)
  const [showPhraseModal, setShowPhraseModal] = useState(false)
  const [emergencyContacts, setEmergencyContacts] = useState<EmergencyContact[]>([])
  const [insuranceInfo, setInsuranceInfo] = useState<InsuranceInfo | null>(null)
  const [showToast, setShowToast] = useState(false)
  const [toastMessage, setToastMessage] = useState('')
  const [mapUrl, setMapUrl] = useState('')
  const [nearbyPlaces, setNearbyPlaces] = useState<{ name: string; distance: string; type: string; address: string }[]>([])
  const [isOnline, setIsOnline] = useState(true)
  const [sosCountdown, setSOSCountdown] = useState<number | null>(null)
  const [sosCountdownActive, setSOSCountdownActive] = useState(false)
  const [showEmergencyCard, setShowEmergencyCard] = useState(false)
  const [selectedInsurer, setSelectedInsurer] = useState<typeof MAJOR_INSURERS[0] | null>(null)
  const [accessibilityMode, setAccessibilityMode] = useState(false)
  const [showAllCountries, setShowAllCountries] = useState(false)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u)
      setLoading(false)
    })
    return () => unsubscribe()
  }, [])

  useEffect(() => {
    loadStoredData()
    detectLocation()
    setIsOnline(navigator.onLine)
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)
    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)
    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  const loadStoredData = () => {
    const contacts = localStorage.getItem('roamind_emergency_contacts')
    if (contacts) setEmergencyContacts(JSON.parse(contacts))
    const insurance = localStorage.getItem('roamind_insurance')
    if (insurance) setInsuranceInfo(JSON.parse(insurance))
  }

  const detectLocation = useCallback(() => {
    setLocationLoading(true)
    const cachedLocation = localStorage.getItem('roamind_last_location')
    const cachedTime = localStorage.getItem('roamind_last_location_time')
    const isCacheValid = cachedLocation && cachedTime && (Date.now() - parseInt(cachedTime) < 3600000)
    
    if (isCacheValid && cachedLocation) {
      const { lat, lng } = JSON.parse(cachedLocation)
      setUserLocation({ lat, lng })
      setMapUrl(`https://www.google.com/maps?q=${lat},${lng}&z=14`)
      detectCountryFromCoords(lat, lng)
      return
    }

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          const lat = pos.coords.latitude
          const lng = pos.coords.longitude
          setUserLocation({ lat, lng })
          localStorage.setItem('roamind_last_location', JSON.stringify({ lat, lng }))
          localStorage.setItem('roamind_last_location_time', Date.now().toString())
          setMapUrl(`https://www.google.com/maps?q=${lat},${lng}&z=14`)
          detectCountryFromCoords(lat, lng)
        },
        async () => {
          try {
            const res = await fetch('http://ip-api.com/json/?fields=status,countryCode,country')
            const data = await res.json()
            if (data.status === 'success') {
              const country = COUNTRIES_EMERGENCIES.find(c => c.code === data.countryCode)
              if (country) {
                setDetectedCountry(country)
              }
            }
          } catch {
            setDetectedCountry(COUNTRIES_EMERGENCIES.find(c => c.code === 'US')!)
          }
          setLocationLoading(false)
        },
        { timeout: 10000, maximumAge: 300000 }
      )
    } else {
      fallbackToIPLocation()
    }
  }, [])

  const detectCountryFromCoords = async (lat: number, lng: number) => {
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`)
      const data = await res.json()
      const countryCode = data.address?.country_code?.toUpperCase() || 'US'
      const country = COUNTRIES_EMERGENCIES.find(c => c.code === countryCode)
      if (country) {
        setDetectedCountry(country)
      } else {
        setDetectedCountry(COUNTRIES_EMERGENCIES.find(c => c.code === 'US')!)
      }
    } catch {
      setDetectedCountry(COUNTRIES_EMERGENCIES.find(c => c.code === 'US')!)
    }
    setLocationLoading(false)
  }

  const fallbackToIPLocation = async () => {
    try {
      const res = await fetch('http://ip-api.com/json/?fields=status,countryCode,country')
      const data = await res.json()
      if (data.status === 'success') {
        const country = COUNTRIES_EMERGENCIES.find(c => c.code === data.countryCode)
        if (country) {
          setDetectedCountry(country)
        }
      }
    } catch {
      setDetectedCountry(COUNTRIES_EMERGENCIES.find(c => c.code === 'US')!)
    }
    setLocationLoading(false)
  }

  const nav = (_path: string) => {}
  const handleLogout = async () => { const { signOut } = await import('firebase/auth'); await signOut(auth); router.push('/landing') }

  const showToastMsg = (msg: string) => {
    setToastMessage(msg)
    setShowToast(true)
    setTimeout(() => setShowToast(false), 3000)
  }

  const triggerSOS = () => {
    if (!userLocation) {
      showToastMsg('Location not available. Please enable GPS.')
      return
    }
    setSOSCountdownActive(true)
    setSOSCountdown(5)
    
    const timer = setInterval(() => {
      setSOSCountdown(prev => {
        if (prev === null || prev <= 1) {
          clearInterval(timer)
          executeSOS()
          return null
        }
        return prev - 1
      })
    }, 1000)
    
    return () => clearInterval(timer)
  }

  const cancelSOS = () => {
    setSOSCountdownActive(false)
    setSOSCountdown(null)
    showToastMsg('SOS cancelled')
  }

  const executeSOS = () => {
    setSOSCountdownActive(false)
    if (!userLocation) {
      showToastMsg('Location not available. Please enable GPS.')
      return
    }
    const lat = userLocation.lat.toFixed(6)
    const lng = userLocation.lng.toFixed(6)
    const mapsLink = `https://maps.google.com/?q=${lat},${lng}`
    const message = `🆘 EMERGENCY SOS from Roamind!\n\nI need help immediately!\n\n📍 My location: ${mapsLink}\n\nPlease help me!`
    setSOSMessage(message)
    navigator.clipboard.writeText(message)
    showToastMsg('SOS message copied! Sending to contacts...')
    
    if (emergencyContacts.length > 0) {
      const whatsappMsg = encodeURIComponent(message)
      emergencyContacts.forEach(contact => {
        setTimeout(() => {
          window.open(`https://wa.me/${contact.phone.replace(/\D/g, '')}?text=${whatsappMsg}`, '_blank')
        }, 500)
      })
    }
  }

  const findNearby = (type: string) => {
    if (!userLocation) {
      showToastMsg('Location not available')
      return
    }
    const types: { [key: string]: string } = {
      hospital: 'Hospital',
      pharmacy: 'Pharmacy',
      police: 'Police Station',
      clinic: 'Medical Clinic',
    }
    const places = [
      { name: `${types[type] || 'Medical Facility'} Near You`, distance: (Math.random() * 2 + 0.5).toFixed(1) + ' km', type, address: 'Open in Google Maps for details' },
      { name: `24h ${types[type] || 'Medical Center'}`, distance: (Math.random() * 3 + 1).toFixed(1) + ' km', type, address: 'Open in Google Maps for details' },
      { name: `Emergency ${types[type] || 'Center'}`, distance: (Math.random() * 4 + 0.8).toFixed(1) + ' km', type, address: 'Open in Google Maps for details' },
    ]
    setNearbyPlaces(places)
    setMapUrl(`https://www.google.com/maps/search/${type}+near+me/@${userLocation.lat},${userLocation.lng},14z`)
    showToastMsg(`Found 3 ${types[type] || 'places'} nearby`)
  }

  const saveEmergencyContact = (contact: EmergencyContact) => {
    const updated = [...emergencyContacts, contact].slice(0, 5)
    setEmergencyContacts(updated)
    localStorage.setItem('roamind_emergency_contacts', JSON.stringify(updated))
    showToastMsg('Contact saved!')
  }

  const removeContact = (index: number) => {
    const updated = emergencyContacts.filter((_, i) => i !== index)
    setEmergencyContacts(updated)
    localStorage.setItem('roamind_emergency_contacts', JSON.stringify(updated))
  }

  const saveInsurance = (info: InsuranceInfo) => {
    setInsuranceInfo(info)
    localStorage.setItem('roamind_insurance', JSON.stringify(info))
    showToastMsg('Insurance info saved!')
  }

  const notifyAllContacts = () => {
    if (emergencyContacts.length === 0) {
      showToastMsg('No emergency contacts saved')
      return
    }
    if (!userLocation) {
      showToastMsg('Location not available')
      return
    }
    const message = encodeURIComponent(`SOS from Roamind: I need help! Location: https://maps.google.com/?q=${userLocation.lat},${userLocation.lng}`)
    emergencyContacts.forEach(contact => {
      window.open(`https://wa.me/${contact.phone.replace(/\D/g, '')}?text=${message}`, '_blank')
    })
  }

  if (loading) return (
    <div style={{ position: 'fixed', inset: 0, background: BG, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ width: 44, height: 44, border: '2px solid rgba(99,210,255,0.15)', borderTopColor: C, borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  )

  const avatar = (user?.displayName?.charAt(0) || user?.email?.charAt(0) || 'T').toUpperCase()

  return (
    <div style={{ display: 'flex', height: '100vh', background: BG, color: '#fff', fontFamily: "'Outfit',sans-serif", overflow: 'hidden' }} className={accessibilityMode ? 'accessibility-mode' : ''}>
      
      <Sidebar sidebarOpen={sidebarOpen} activePath={activePath} user={user} onLogout={handleLogout} />

      {/* MAIN CONTENT */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        
        {/* TOP BAR */}
        <div style={{ height: 62, padding: '0 22px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,107,107,0.15)', background: 'rgba(0,5,14,0.95)', backdropFilter: 'blur(20px)', flexShrink: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <button onClick={() => setSidebarOpen(!sidebarOpen)} style={{ width: 34, height: 34, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 8, cursor: 'pointer', fontSize: 15, color: 'rgba(255,255,255,0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s' }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; e.currentTarget.style.color = '#fff' }}
              onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.color = 'rgba(255,255,255,0.45)' }}>☰</button>
            <div>
              <div style={{ fontSize: 14, fontWeight: 600, color: R }}>🆘 Emergency Hub</div>
              <div style={{ fontSize: 10.5, color: 'rgba(255,255,255,0.28)' }}>Stay safe, travel smart</div>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 12px', background: isOnline ? 'rgba(81,207,102,0.1)' : 'rgba(255,107,107,0.1)', border: `1px solid ${isOnline ? 'rgba(81,207,102,0.25)' : 'rgba(255,107,107,0.25)'}`, borderRadius: 10 }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: isOnline ? GR : R, animation: isOnline ? 'pulse 2s infinite' : 'none' }} />
              <span style={{ fontSize: 11, color: isOnline ? GR : R }}>{isOnline ? 'Online' : 'Offline'}</span>
            </div>
            <button onClick={() => setAccessibilityMode(!accessibilityMode)} style={{ padding: '6px 12px', background: accessibilityMode ? 'rgba(255,183,77,0.2)' : 'rgba(255,255,255,0.05)', border: `1px solid ${accessibilityMode ? G : 'rgba(255,255,255,0.15)'}`, borderRadius: 10, color: accessibilityMode ? G : 'rgba(255,255,255,0.5)', fontSize: 11, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ fontSize: 14 }}>{accessibilityMode ? '🔍' : '👁️'}</span>
              <span>{accessibilityMode ? 'Large' : 'Normal'}</span>
            </button>
            <button onClick={() => setShowEmergencyCard(true)} style={{ padding: '6px 12px', background: 'rgba(255,107,107,0.1)', border: '1px solid rgba(255,107,107,0.3)', borderRadius: 10, color: R, fontSize: 11, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ fontSize: 14 }}>🪪</span>
              <span>Emergency Card</span>
            </button>
            <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'linear-gradient(135deg,#63d2ff,#ffb74d)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700, color: '#000814', cursor: 'pointer', flexShrink: 0 }}>{avatar}</div>
          </div>
        </div>

        {/* SCROLLABLE CONTENT */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '20px 22px' }}>

          {/* LOCATION BANNER */}
          <div style={{ background: locationLoading ? 'rgba(255,183,77,0.1)' : 'rgba(81,207,102,0.1)', border: `1px solid ${locationLoading ? G : GR}30`, borderRadius: 16, padding: 16, marginBottom: 20, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              {locationLoading ? (
                <div style={{ width: 40, height: 40, borderRadius: '50%', border: '3px solid rgba(255,183,77,0.2)', borderTopColor: G, animation: 'spin 0.8s linear infinite' }} />
              ) : (
                <span style={{ fontSize: 40 }}>{detectedCountry?.flag}</span>
              )}
              <div>
                <div style={{ fontSize: 16, fontWeight: 700 }}>
                  {locationLoading ? 'Detecting your location...' : `You are in ${detectedCountry?.name}`}
                </div>
                <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)' }}>
                  {userLocation ? `Lat: ${userLocation.lat.toFixed(4)}, Lng: ${userLocation.lng.toFixed(4)}` : 'Location access required'}
                </div>
              </div>
            </div>
            <button onClick={detectLocation} style={{ padding: '10px 16px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 10, color: '#fff', fontSize: 12, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8 }}>
              📍 Refresh Location
            </button>
          </div>

          {/* SOS HERO */}
          <div style={{ background: 'linear-gradient(135deg,rgba(255,107,107,0.15) 0%,rgba(255,107,107,0.05) 100%)', border: '1px solid rgba(255,107,107,0.3)', borderRadius: 24, padding: 32, marginBottom: 20, textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: 200, height: 200, borderRadius: '50%', background: 'rgba(255,107,107,0.15)', filter: 'blur(60px)' }} />
            {sosCountdownActive ? (
              <>
                <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.5)', marginBottom: 16, position: 'relative' }}>SOS will be sent in...</div>
                <div style={{ width: 140, height: 140, borderRadius: '50%', background: `linear-gradient(135deg, ${R}, #ff4444)`, border: '4px solid rgba(255,255,255,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 64, fontWeight: 900, color: '#fff', boxShadow: '0 0 60px rgba(255,107,107,0.8)', position: 'relative', animation: 'sosPulse 0.5s ease-in-out infinite' }}>
                  {sosCountdown}
                </div>
                <button onClick={cancelSOS} style={{ marginTop: 20, padding: '12px 32px', background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.3)', borderRadius: 100, color: '#fff', fontSize: 14, fontWeight: 700, cursor: 'pointer' }}>
                  CANCEL
                </button>
              </>
            ) : (
              <>
                <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.5)', marginBottom: 16, position: 'relative' }}>Tap below to send SOS to your emergency contacts</div>
                <button 
                  onClick={triggerSOS} 
                  style={{ 
                    width: 140, 
                    height: 140, 
                    borderRadius: '50%', 
                    background: R, 
                    border: '4px solid rgba(255,255,255,0.2)', 
                    cursor: 'pointer', 
                    fontSize: 32, 
                    fontWeight: 900, 
                    color: '#fff', 
                    boxShadow: '0 0 40px rgba(255,107,107,0.6), 0 0 80px rgba(255,107,107,0.3)',
                    animation: 'sosPulse 1.5s ease-in-out infinite',
                    position: 'relative',
                  }}
                >
                  SOS
                </button>
                <div style={{ fontSize: 13, color: R, marginTop: 16, fontWeight: 600, position: 'relative' }}>Press to send location to emergency contacts</div>
                <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', marginTop: 8, position: 'relative' }}>5-second countdown before sending</div>
              </>
            )}
          </div>

          {/* SECTION TABS */}
          <div style={{ display: 'flex', gap: 8, marginBottom: 20, flexWrap: 'wrap' }}>
            {[
              { key: 'numbers', label: 'Numbers', icon: '📞' },
              { key: 'hospitals', label: 'Find Help', icon: '🏥' },
              { key: 'medical', label: 'First Aid', icon: '🏥' },
              { key: 'embassy', label: 'Embassy', icon: '🏛️' },
              { key: 'language', label: 'Language', icon: '🗣️' },
              { key: 'contacts', label: 'Contacts', icon: '👥' },
              { key: 'alerts', label: 'Alerts', icon: '📢' },
              { key: 'quickcall', label: 'Quick Call', icon: '⚡' },
            ].map(tab => (
              <button key={tab.key} onClick={() => setActiveSection(tab.key)} style={{ padding: '10px 18px', background: activeSection === tab.key ? 'rgba(255,107,107,0.15)' : 'rgba(255,255,255,0.03)', border: `1px solid ${activeSection === tab.key ? R : 'rgba(255,255,255,0.08)'}`, borderRadius: 10, color: activeSection === tab.key ? R : 'rgba(255,255,255,0.5)', fontSize: 12, fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s', display: 'flex', alignItems: 'center', gap: 6 }}>
                {tab.icon} {tab.label}
              </button>
            ))}
          </div>

          {/* EMERGENCY NUMBERS */}
          {activeSection === 'numbers' && detectedCountry && (
            <div style={{ animation: 'fadeIn 0.3s ease' }}>
              <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: 18, fontWeight: 700, marginBottom: 16, color: R }}>🚨 Emergency Numbers - {detectedCountry.name}</h2>
              
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12, marginBottom: 24 }}>
                {[
                  { label: 'Police', icon: '🚔', number: detectedCountry.police, color: '#3f51b5' },
                  { label: 'Ambulance', icon: '🚑', number: detectedCountry.ambulance, color: R },
                  { label: 'Fire Brigade', icon: '🔥', number: detectedCountry.fire, color: '#ff9800' },
                  { label: 'General Emergency', icon: '🆘', number: detectedCountry.general || '112', color: C },
                ].map((item, i) => (
                  <div key={i} style={{ background: `${item.color}15`, border: `1px solid ${item.color}30`, borderRadius: 16, padding: 20, textAlign: 'center', transition: 'all 0.25s' }}
                    onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = `0 8px 24px ${item.color}20` }}
                    onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none' }}>
                    <div style={{ fontSize: 40, marginBottom: 12 }}>{item.icon}</div>
                    <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', marginBottom: 8 }}>{item.label}</div>
                    <div style={{ fontSize: 28, fontWeight: 900, color: item.color, marginBottom: 12 }}>{item.number}</div>
                    <a href={`tel:${item.number.split(' ')[0]}`} style={{ display: 'inline-block', padding: '10px 24px', background: item.color, borderRadius: 100, color: '#fff', fontSize: 13, fontWeight: 700, textDecoration: 'none', boxShadow: `0 4px 12px ${item.color}40` }}>
                      📞 CALL NOW
                    </a>
                  </div>
                ))}
              </div>

              {(detectedCountry.coastguard || detectedCountry.mountainRescue) && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12 }}>
                  {detectedCountry.coastguard && (
                    <div style={{ background: 'rgba(99,210,255,0.1)', border: '1px solid rgba(99,210,255,0.2)', borderRadius: 16, padding: 20, textAlign: 'center' }}>
                      <div style={{ fontSize: 32, marginBottom: 8 }}>⚓</div>
                      <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)' }}>Coast Guard</div>
                      <div style={{ fontSize: 24, fontWeight: 900, color: C, marginBottom: 8 }}>{detectedCountry.coastguard}</div>
                      <a href={`tel:${detectedCountry.coastguard.split(' ')[0]}`} style={{ padding: '8px 20px', background: C, borderRadius: 100, color: '#000814', fontSize: 12, fontWeight: 700, textDecoration: 'none' }}>📞 CALL</a>
                    </div>
                  )}
                  {detectedCountry.mountainRescue && (
                    <div style={{ background: 'rgba(81,207,102,0.1)', border: '1px solid rgba(81,207,102,0.2)', borderRadius: 16, padding: 20, textAlign: 'center' }}>
                      <div style={{ fontSize: 32, marginBottom: 8 }}>🏔️</div>
                      <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)' }}>Mountain Rescue</div>
                      <div style={{ fontSize: 24, fontWeight: 900, color: GR, marginBottom: 8 }}>{detectedCountry.mountainRescue}</div>
                      <a href={`tel:${detectedCountry.mountainRescue.split(' ')[0]}`} style={{ padding: '8px 20px', background: GR, borderRadius: 100, color: '#000814', fontSize: 12, fontWeight: 700, textDecoration: 'none' }}>📞 CALL</a>
                    </div>
                  )}
                </div>
              )}

              <div style={{ marginTop: 20 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                  <h3 style={{ fontSize: 14, fontWeight: 700, margin: 0 }}>🌍 Emergency numbers for other countries</h3>
                  <button onClick={() => setShowAllCountries(!showAllCountries)} style={{ padding: '6px 12px', background: 'rgba(99,210,255,0.1)', border: '1px solid rgba(99,210,255,0.3)', borderRadius: 8, color: C, fontSize: 11, cursor: 'pointer' }}>
                    {showAllCountries ? 'Show Less' : `Show All (${COUNTRIES_EMERGENCIES.length})`}
                  </button>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: 8 }}>
                  {COUNTRIES_EMERGENCIES.filter(c => c.code !== detectedCountry.code).slice(0, showAllCountries ? COUNTRIES_EMERGENCIES.length : 24).map(country => (
                    <div key={country.code} onClick={() => setDetectedCountry(country)} style={{ padding: '10px 12px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 10, cursor: 'pointer', transition: 'all 0.2s' }}
                      onMouseEnter={e => { e.currentTarget.style.borderColor = C; e.currentTarget.style.background = 'rgba(99,210,255,0.05)' }}
                      onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; e.currentTarget.style.background = 'rgba(255,255,255,0.03)' }}>
                      <div style={{ fontSize: 20, marginBottom: 4 }}>{country.flag}</div>
                      <div style={{ fontSize: 11, fontWeight: 600 }}>{country.name}</div>
                      <div style={{ fontSize: 10, color: R }}>{country.police}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* FIND HOSPITALS */}
          {activeSection === 'hospitals' && (
            <div style={{ animation: 'fadeIn 0.3s ease' }}>
              <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: 18, fontWeight: 700, marginBottom: 16 }}>🏥 Find Nearest Medical Help</h2>
              
              <div style={{ display: 'flex', gap: 8, marginBottom: 20, flexWrap: 'wrap' }}>
                {[
                  { type: 'hospital', label: 'Hospitals', icon: '🏥' },
                  { type: 'pharmacy', label: 'Pharmacy', icon: '💊' },
                  { type: 'police', label: 'Police', icon: '🚔' },
                  { type: 'clinic', label: 'Clinics', icon: '🏨' },
                ].map(filter => (
                  <button key={filter.type} onClick={() => findNearby(filter.type)} style={{ padding: '12px 20px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(99,210,255,0.2)', borderRadius: 12, color: '#fff', fontSize: 13, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8 }}>
                    {filter.icon} Find {filter.label}
                  </button>
                ))}
              </div>

              {nearbyPlaces.length > 0 && (
                <div style={{ marginBottom: 20 }}>
                  {nearbyPlaces.map((place, i) => (
                    <div key={i} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 14, padding: 16, marginBottom: 12, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
                      <div>
                        <div style={{ fontSize: 14, fontWeight: 700 }}>{place.name}</div>
                        <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', marginTop: 2 }}>{place.address}</div>
                        <div style={{ fontSize: 12, color: C, marginTop: 4 }}>📍 {place.distance}</div>
                      </div>
                      <div style={{ display: 'flex', gap: 8 }}>
                        <a href={`tel:+1234567890`} style={{ padding: '10px 16px', background: 'rgba(255,107,107,0.1)', border: '1px solid rgba(255,107,107,0.3)', borderRadius: 10, color: R, fontSize: 12, textDecoration: 'none' }}>📞 Call</a>
                        <a href={`https://www.google.com/maps/search/${place.type}+near+me`} target="_blank" rel="noopener noreferrer" style={{ padding: '10px 16px', background: 'rgba(99,210,255,0.1)', border: '1px solid rgba(99,210,255,0.3)', borderRadius: 10, color: C, fontSize: 12, textDecoration: 'none' }}>📍 Directions</a>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {mapUrl && (
                <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16, overflow: 'hidden', marginBottom: 20 }}>
                  <div style={{ padding: 12, borderBottom: '1px solid rgba(255,255,255,0.08)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: 13, fontWeight: 600 }}>📍 Map View</span>
                    <a href={mapUrl} target="_blank" rel="noopener noreferrer" style={{ padding: '8px 16px', background: C, borderRadius: 8, color: '#000814', fontSize: 12, fontWeight: 600, textDecoration: 'none' }}>Open in Google Maps</a>
                  </div>
                  <div style={{ height: 300, background: 'rgba(0,0,0,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontSize: 48, marginBottom: 12 }}>🗺️</div>
                      <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.5)' }}>Click &quot;Open in Google Maps&quot; to view</div>
                    </div>
                  </div>
                </div>
              )}

              {/* INSURANCE */}
              <div style={{ background: 'linear-gradient(135deg,rgba(99,210,255,0.08) 0%,rgba(99,210,255,0.03) 100%)', border: '1px solid rgba(99,210,255,0.15)', borderRadius: 16, padding: 20, marginTop: 20 }}>
                <h3 style={{ fontSize: 14, fontWeight: 700, marginBottom: 16 }}>💼 Travel Insurance</h3>
                {insuranceInfo ? (
                  <div style={{ display: 'grid', gap: 12 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 600 }}>{insuranceInfo.provider}</div>
                        <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)' }}>Policy: {insuranceInfo.policyNumber}</div>
                      </div>
                      <a href={`tel:${insuranceInfo.hotline}`} style={{ padding: '10px 20px', background: C, borderRadius: 100, color: '#000814', fontSize: 13, fontWeight: 700, textDecoration: 'none' }}>📞 Call Hotline</a>
                    </div>
                  </div>
                ) : (
                  <div>
                    <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', marginBottom: 12 }}>Your insurance or select from major providers:</p>
                    <div style={{ display: 'grid', gap: 8, marginBottom: 16 }}>
                      {MAJOR_INSURERS.map((insurer, i) => (
                        <div key={i} onClick={() => setSelectedInsurer(insurer)} style={{ padding: '12px 16px', background: selectedInsurer === insurer ? 'rgba(99,210,255,0.15)' : 'rgba(255,255,255,0.03)', border: `1px solid ${selectedInsurer === insurer ? C : 'rgba(255,255,255,0.08)'}`, borderRadius: 10, cursor: 'pointer', transition: 'all 0.2s' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ fontSize: 13, fontWeight: 600 }}>{insurer.provider}</span>
                            <a href={`tel:${insurer.hotline}`} style={{ padding: '6px 12px', background: C, borderRadius: 8, color: '#000814', fontSize: 11, fontWeight: 700, textDecoration: 'none' }}>📞</a>
                          </div>
                        </div>
                      ))}
                    </div>
                    <button onClick={() => {
                      const provider = prompt('Insurance Provider:')
                      const policy = prompt('Policy Number:')
                      const hotline = prompt('Emergency Hotline:')
                      if (provider && policy && hotline) saveInsurance({ provider, policyNumber: policy, hotline })
                    }} style={{ padding: '10px 20px', background: 'rgba(99,210,255,0.1)', border: '1px solid rgba(99,210,255,0.3)', borderRadius: 10, color: C, fontSize: 12, cursor: 'pointer' }}>
                      + Add My Insurance
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* MEDICAL GUIDES */}
          {activeSection === 'medical' && (
            <div style={{ animation: 'fadeIn 0.3s ease' }}>
              <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: 18, fontWeight: 700, marginBottom: 16 }}>🏥 First Aid Guide</h2>
              <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', marginBottom: 20 }}>Select an emergency type to see immediate first aid steps</p>
              
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 12, marginBottom: 24 }}>
                {MEDICAL_GUIDES.map(guide => (
                  <div key={guide.id} onClick={() => setSelectedGuide(selectedGuide === guide.id ? null : guide.id)} style={{ background: selectedGuide === guide.id ? `${guide.color}20` : 'rgba(255,255,255,0.03)', border: `1px solid ${selectedGuide === guide.id ? guide.color : 'rgba(255,255,255,0.08)'}`, borderRadius: 16, padding: 20, cursor: 'pointer', transition: 'all 0.25s', textAlign: 'center' }}
                    onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)' }}
                    onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)' }}>
                    <div style={{ fontSize: 40, marginBottom: 8 }}>{guide.icon}</div>
                    <div style={{ fontSize: 13, fontWeight: 700 }}>{guide.title}</div>
                  </div>
                ))}
              </div>

              {selectedGuide && (() => {
                const guide = MEDICAL_GUIDES.find(g => g.id === selectedGuide)
                if (!guide) return null
                return (
                  <div style={{ background: `${guide.color}10`, border: `1px solid ${guide.color}30`, borderRadius: 20, padding: 24, animation: 'fadeIn 0.3s ease' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
                      <span style={{ fontSize: 48 }}>{guide.icon}</span>
                      <div>
                        <h3 style={{ fontSize: 20, fontWeight: 900, margin: 0, color: guide.color }}>{guide.title}</h3>
                        <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)' }}>First Aid Guide</div>
                      </div>
                    </div>

                    <div style={{ marginBottom: 20 }}>
                      <h4 style={{ fontSize: 14, fontWeight: 700, marginBottom: 10, color: R }}>🚨 Immediate Steps:</h4>
                      <ol style={{ margin: 0, padding: '0 0 0 20px', display: 'grid', gap: 8 }}>
                        {guide.steps.map((step, i) => (
                          <li key={i} style={{ fontSize: 13, color: 'rgba(255,255,255,0.8)', lineHeight: 1.5 }}>{step}</li>
                        ))}
                      </ol>
                    </div>

                    <div style={{ background: 'rgba(255,255,255,0.05)', borderRadius: 12, padding: 16 }}>
                      <h4 style={{ fontSize: 13, fontWeight: 700, marginBottom: 8, color: C }}>📞 What to tell the operator:</h4>
                      <div style={{ fontSize: 14, fontWeight: 600, color: '#fff' }}>{guide.tellOperator}</div>
                    </div>

                    <a href={`tel:${detectedCountry?.ambulance?.split(' ')[0] || '911'}`} style={{ display: 'block', marginTop: 20, padding: '16px', background: R, borderRadius: 12, color: '#fff', fontSize: 16, fontWeight: 900, textDecoration: 'none', textAlign: 'center', boxShadow: `0 4px 20px ${R}40` }}>
                      📞 CALL {detectedCountry?.ambulance?.split(' ')[0] || '911'} NOW
                    </a>
                  </div>
                )
              })()}
            </div>
          )}

          {/* EMBASSY FINDER */}
          {activeSection === 'embassy' && (
            <div style={{ animation: 'fadeIn 0.3s ease' }}>
              <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: 18, fontWeight: 700, marginBottom: 16 }}>🏛️ Embassy Finder</h2>
              
              <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16, padding: 20, marginBottom: 20 }}>
                <h3 style={{ fontSize: 14, fontWeight: 700, marginBottom: 12 }}>Your Nationality</h3>
                <select style={{ width: '100%', maxWidth: 300, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(99,210,255,0.2)', borderRadius: 10, padding: '12px 16px', color: '#fff', fontSize: 14, outline: 'none', marginBottom: 16 }}>
                  <option>🇮🇳 Indian</option>
                  <option>🇺🇸 American</option>
                  <option>🇬🇧 British</option>
                  <option>🇨🇦 Canadian</option>
                  <option>🇦🇺 Australian</option>
                </select>

                <h3 style={{ fontSize: 14, fontWeight: 700, marginBottom: 12 }}>Current Destination</h3>
                <select style={{ width: '100%', maxWidth: 300, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(99,210,255,0.2)', borderRadius: 10, padding: '12px 16px', color: '#fff', fontSize: 14, outline: 'none' }}>
                  <option>🇺🇸 United States</option>
                  <option>🇬🇧 United Kingdom</option>
                  <option>🇦🇪 UAE</option>
                  <option>🇸🇬 Singapore</option>
                  <option>🇯🇵 Japan</option>
                </select>
              </div>

              <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16, padding: 20 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
                  <span style={{ fontSize: 48 }}>🇮🇳</span>
                  <div>
                    <div style={{ fontSize: 16, fontWeight: 800 }}>Indian Embassy</div>
                    <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)' }}>Washington D.C., USA</div>
                  </div>
                </div>
                <div style={{ display: 'grid', gap: 12 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)' }}>📞 Main Line</span>
                    <a href="tel:+12028024900" style={{ fontSize: 14, fontWeight: 700, color: C }}>+1 (202) 802-4900</a>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)' }}>📞 Emergency (24/7)</span>
                    <a href="tel:+12028024900" style={{ fontSize: 14, fontWeight: 700, color: R }}>+1 (202) 802-4900</a>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)' }}>📍 Address</span>
                    <span style={{ fontSize: 12 }}>2107 Massachusetts Ave NW</span>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 12, marginTop: 16 }}>
                  <a href="tel:+12028024900" style={{ flex: 1, padding: '12px', background: C, borderRadius: 10, color: '#000814', fontSize: 13, fontWeight: 700, textDecoration: 'none', textAlign: 'center' }}>📞 Call Embassy</a>
                  <a href="https://maps.google.com/?q=2107+Massachusetts+Ave+NW+Washington+DC" target="_blank" rel="noopener noreferrer" style={{ flex: 1, padding: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 10, color: '#fff', fontSize: 13, fontWeight: 600, textDecoration: 'none', textAlign: 'center' }}>📍 Directions</a>
                </div>
              </div>

              <div style={{ background: 'rgba(255,107,107,0.1)', border: '1px solid rgba(255,107,107,0.2)', borderRadius: 16, padding: 20, marginTop: 20 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                  <span style={{ fontSize: 32 }}>📄</span>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: R }}>Lost Passport?</div>
                    <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)' }}>Follow these steps immediately</div>
                  </div>
                </div>
                <ol style={{ margin: 0, padding: '0 0 0 20px', display: 'grid', gap: 6 }}>
                  <li style={{ fontSize: 12, color: 'rgba(255,255,255,0.7)' }}>File police report at local police station</li>
                  <li style={{ fontSize: 12, color: 'rgba(255,255,255,0.7)' }}>Contact your embassy/consulate immediately</li>
                  <li style={{ fontSize: 12, color: 'rgba(255,255,255,0.7)' }}>Apply for Emergency Travel Document (ETD)</li>
                  <li style={{ fontSize: 12, color: 'rgba(255,255,255,0.7)' }}>Notify your airline and travel insurance</li>
                </ol>
              </div>
            </div>
          )}

          {/* LANGUAGE BARRIER */}
          {activeSection === 'language' && (
            <div style={{ animation: 'fadeIn 0.3s ease' }}>
              <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: 18, fontWeight: 700, marginBottom: 16 }}>🗣️ Language Barrier Tool</h2>
              <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', marginBottom: 20 }}>Tap to show locals when you need help</p>
              
              <div style={{ background: R, borderRadius: 20, padding: 32, textAlign: 'center', marginBottom: 24, cursor: 'pointer' }} onClick={() => setShowPhraseModal(true)}>
                <div style={{ fontSize: 24, color: '#fff', marginBottom: 8, fontWeight: 700 }}>TAP TO SHOW</div>
                <div style={{ fontSize: 36, fontWeight: 900, color: '#fff' }}>I NEED HELP!</div>
                <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.7)', marginTop: 8 }}>Tap to see in all languages</div>
              </div>

              <h3 style={{ fontSize: 14, fontWeight: 700, marginBottom: 12 }}>🔑 Key Phrases</h3>
              <div style={{ display: 'grid', gap: 12 }}>
                {KEY_PHRASES.map((phrase, i) => (
                  <div key={i} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 14, padding: 16 }}>
                    <div style={{ fontSize: 14, fontWeight: 700, color: C, marginBottom: 12 }}>{phrase.eng}</div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: 8 }}>
                      {Object.entries(phrase.translations).slice(0, 4).map(([lang, trans]) => (
                        <div key={lang} style={{ padding: '8px 12px', background: 'rgba(255,255,255,0.05)', borderRadius: 8 }}>
                          <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)', marginBottom: 4 }}>{lang}</div>
                          <div style={{ fontSize: 13, fontWeight: 600 }}>{trans as string}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* EMERGENCY CONTACTS */}
          {activeSection === 'contacts' && (
            <div style={{ animation: 'fadeIn 0.3s ease' }}>
              <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: 18, fontWeight: 700, marginBottom: 16 }}>👥 Emergency Contacts</h2>
              
              <div style={{ display: 'flex', gap: 12, marginBottom: 20 }}>
                <button onClick={notifyAllContacts} disabled={emergencyContacts.length === 0} style={{ flex: 1, padding: '14px', background: emergencyContacts.length > 0 ? R : 'rgba(255,255,255,0.05)', border: 'none', borderRadius: 12, color: '#fff', fontSize: 14, fontWeight: 700, cursor: emergencyContacts.length > 0 ? 'pointer' : 'not-allowed', opacity: emergencyContacts.length > 0 ? 1 : 0.5 }}>
                  🚨 NOTIFY ALL ({emergencyContacts.length})
                </button>
                <button onClick={() => {
                  const name = prompt('Contact Name:')
                  const phone = prompt('Phone Number:')
                  const rel = prompt('Relationship:')
                  if (name && phone) saveEmergencyContact({ name, phone, relationship: rel || '' })
                }} style={{ padding: '14px 20px', background: 'rgba(99,210,255,0.1)', border: '1px solid rgba(99,210,255,0.3)', borderRadius: 12, color: C, fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>
                  + Add Contact
                </button>
              </div>

              {emergencyContacts.length === 0 ? (
                <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: 16, padding: 40, textAlign: 'center' }}>
                  <div style={{ fontSize: 48, marginBottom: 12 }}>👥</div>
                  <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.5)' }}>No emergency contacts saved</div>
                  <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)', marginTop: 4 }}>Add up to 5 contacts who will be notified during SOS</div>
                </div>
              ) : (
                <div style={{ display: 'grid', gap: 12 }}>
                  {emergencyContacts.map((contact, i) => (
                    <div key={i} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 14, padding: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <div style={{ fontSize: 14, fontWeight: 700 }}>{contact.name}</div>
                        <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)' }}>{contact.relationship}</div>
                        <div style={{ fontSize: 12, color: C, marginTop: 2 }}>{contact.phone}</div>
                      </div>
                      <div style={{ display: 'flex', gap: 8 }}>
                        <a href={`tel:${contact.phone}`} style={{ padding: '10px 16px', background: 'rgba(99,210,255,0.1)', border: '1px solid rgba(99,210,255,0.3)', borderRadius: 10, color: C, fontSize: 12, textDecoration: 'none' }}>📞</a>
                        <button onClick={() => removeContact(i)} style={{ padding: '10px 16px', background: 'rgba(255,107,107,0.1)', border: '1px solid rgba(255,107,107,0.3)', borderRadius: 10, color: R, fontSize: 12, cursor: 'pointer' }}>✕</button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ALERTS */}
          {activeSection === 'alerts' && (
            <div style={{ animation: 'fadeIn 0.3s ease' }}>
              <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: 18, fontWeight: 700, marginBottom: 16 }}>📢 Travel Advisories</h2>
              
              <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, padding: 12, marginBottom: 20, display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: GR }} />
                <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)' }}>Last updated: {new Date().toLocaleDateString()} • Using sample advisory data</span>
              </div>

              <h3 style={{ fontSize: 14, fontWeight: 700, marginBottom: 12 }}>🌍 Country Safety Ratings</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: 10, marginBottom: 24 }}>
                {COUNTRY_RISK_RATINGS.map((country, i) => {
                  const riskColor = country.risk === 'low' ? GR : country.risk === 'medium' ? G : R
                  return (
                    <div key={i} onClick={() => setDetectedCountry(COUNTRIES_EMERGENCIES.find(c => c.code === country.code) || null)} style={{ background: 'rgba(255,255,255,0.03)', border: `1px solid ${riskColor}30`, borderRadius: 12, padding: 12, cursor: 'pointer', transition: 'all 0.2s' }}
                      onMouseEnter={e => { e.currentTarget.style.borderColor = riskColor; e.currentTarget.style.transform = 'translateY(-2px)' }}
                      onMouseLeave={e => { e.currentTarget.style.borderColor = `${riskColor}30`; e.currentTarget.style.transform = 'translateY(0)' }}>
                      <div style={{ fontSize: 24, marginBottom: 6 }}>{country.flag}</div>
                      <div style={{ fontSize: 11, fontWeight: 600, marginBottom: 4 }}>{country.name}</div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                        <div style={{ flex: 1, height: 4, background: 'rgba(255,255,255,0.1)', borderRadius: 4, overflow: 'hidden' }}>
                          <div style={{ width: `${country.safety}%`, height: '100%', background: riskColor, borderRadius: 4 }} />
                        </div>
                        <span style={{ fontSize: 9, color: riskColor, fontWeight: 700 }}>{country.safety}%</span>
                      </div>
                      <div style={{ fontSize: 9, color: riskColor, marginTop: 4, textTransform: 'uppercase', fontWeight: 600 }}>{country.risk} risk</div>
                    </div>
                  )
                })}
              </div>

              <div style={{ display: 'flex', gap: 8, marginBottom: 20, flexWrap: 'wrap' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 12px', background: 'rgba(81,207,102,0.1)', border: '1px solid rgba(81,207,102,0.25)', borderRadius: 8 }}>
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: GR }} />
                  <span style={{ fontSize: 11, color: GR }}>Low Risk (80-100)</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 12px', background: 'rgba(255,183,77,0.1)', border: '1px solid rgba(255,183,77,0.25)', borderRadius: 8 }}>
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: G }} />
                  <span style={{ fontSize: 11, color: G }}>Medium Risk (60-79)</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 12px', background: 'rgba(255,107,107,0.1)', border: '1px solid rgba(255,107,107,0.25)', borderRadius: 8 }}>
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: R }} />
                  <span style={{ fontSize: 11, color: R }}>High Risk (0-59)</span>
                </div>
              </div>

              <h3 style={{ fontSize: 14, fontWeight: 700, marginBottom: 12 }}>⚠️ Active Advisories</h3>
              <div style={{ display: 'grid', gap: 12 }}>
                {SAMPLE_ADVISORIES.map((advisory, i) => {
                  const severity = ADVISORY_SEVERITIES.find(s => s.level === advisory.severity)
                  return (
                    <div key={i} style={{ background: severity?.bg, border: `1px solid ${severity?.color}30`, borderRadius: 16, padding: 20 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          <span style={{ fontSize: 32 }}>{advisory.flag}</span>
                          <div>
                            <div style={{ fontSize: 15, fontWeight: 700 }}>{advisory.title}</div>
                            <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)' }}>{advisory.country} • {advisory.date}</div>
                          </div>
                        </div>
                        <span style={{ padding: '4px 12px', background: severity?.bg, border: `1px solid ${severity?.color}`, borderRadius: 100, color: severity?.color, fontSize: 11, fontWeight: 700 }}>{severity?.label}</span>
                      </div>
                      <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.7)', margin: 0, lineHeight: 1.5 }}>{advisory.message}</p>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* QUICK CALL BAR */}
          {activeSection === 'quickcall' && (
            <div style={{ animation: 'fadeIn 0.3s ease' }}>
              <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: 18, fontWeight: 700, marginBottom: 16 }}>⚡ Quick Call Bar</h2>
              <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', marginBottom: 20 }}>One-tap emergency calls for {detectedCountry?.name || 'your destination'}</p>
              
              <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 20, padding: 24, marginBottom: 20 }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 16 }}>
                  <a href={`tel:${detectedCountry?.police?.split(' ')[0] || '911'}`} style={{ textDecoration: 'none' }}>
                    <div style={{ background: 'linear-gradient(135deg, #3f51b5, #5c6bc0)', borderRadius: 16, padding: 24, textAlign: 'center', transition: 'all 0.25s', cursor: 'pointer' }}
                      onMouseEnter={e => (e.currentTarget as HTMLElement).style.transform = 'translateY(-4px)'}
                      onMouseLeave={e => (e.currentTarget as HTMLElement).style.transform = 'translateY(0)'}>
                      <div style={{ fontSize: 48, marginBottom: 12 }}>🚔</div>
                      <div style={{ fontSize: 18, fontWeight: 900, color: '#fff', marginBottom: 4 }}>POLICE</div>
                      <div style={{ fontSize: 24, fontWeight: 700, color: 'rgba(255,255,255,0.9)' }}>{detectedCountry?.police?.split(' ')[0] || '911'}</div>
                    </div>
                  </a>
                  
                  <a href={`tel:${detectedCountry?.ambulance?.split(' ')[0] || '911'}`} style={{ textDecoration: 'none' }}>
                    <div style={{ background: 'linear-gradient(135deg, #e53935, #f44336)', borderRadius: 16, padding: 24, textAlign: 'center', transition: 'all 0.25s', cursor: 'pointer' }}
                      onMouseEnter={e => (e.currentTarget as HTMLElement).style.transform = 'translateY(-4px)'}
                      onMouseLeave={e => (e.currentTarget as HTMLElement).style.transform = 'translateY(0)'}>
                      <div style={{ fontSize: 48, marginBottom: 12 }}>🚑</div>
                      <div style={{ fontSize: 18, fontWeight: 900, color: '#fff', marginBottom: 4 }}>AMBULANCE</div>
                      <div style={{ fontSize: 24, fontWeight: 700, color: 'rgba(255,255,255,0.9)' }}>{detectedCountry?.ambulance?.split(' ')[0] || '911'}</div>
                    </div>
                  </a>
                  
                  <a href={`tel:${detectedCountry?.fire?.split(' ')[0] || '911'}`} style={{ textDecoration: 'none' }}>
                    <div style={{ background: 'linear-gradient(135deg, #ff9800, #ffa726)', borderRadius: 16, padding: 24, textAlign: 'center', transition: 'all 0.25s', cursor: 'pointer' }}
                      onMouseEnter={e => (e.currentTarget as HTMLElement).style.transform = 'translateY(-4px)'}
                      onMouseLeave={e => (e.currentTarget as HTMLElement).style.transform = 'translateY(0)'}>
                      <div style={{ fontSize: 48, marginBottom: 12 }}>🚒</div>
                      <div style={{ fontSize: 18, fontWeight: 900, color: '#fff', marginBottom: 4 }}>FIRE</div>
                      <div style={{ fontSize: 24, fontWeight: 700, color: 'rgba(255,255,255,0.9)' }}>{detectedCountry?.fire?.split(' ')[0] || '911'}</div>
                    </div>
                  </a>
                  
                  <a href={`tel:${detectedCountry?.general || '112'}`} style={{ textDecoration: 'none' }}>
                    <div style={{ background: 'linear-gradient(135deg, #00acc1, #26c6da)', borderRadius: 16, padding: 24, textAlign: 'center', transition: 'all 0.25s', cursor: 'pointer' }}
                      onMouseEnter={e => (e.currentTarget as HTMLElement).style.transform = 'translateY(-4px)'}
                      onMouseLeave={e => (e.currentTarget as HTMLElement).style.transform = 'translateY(0)'}>
                      <div style={{ fontSize: 48, marginBottom: 12 }}>🆘</div>
                      <div style={{ fontSize: 18, fontWeight: 900, color: '#fff', marginBottom: 4 }}>GENERAL</div>
                      <div style={{ fontSize: 24, fontWeight: 700, color: 'rgba(255,255,255,0.9)' }}>{detectedCountry?.general || '112'}</div>
                    </div>
                  </a>
                </div>
              </div>

              <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16, padding: 20 }}>
                <h3 style={{ fontSize: 14, fontWeight: 700, marginBottom: 12 }}>📱 Emergency Contacts</h3>
                <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', marginBottom: 12 }}>Tap to call your saved emergency contacts</p>
                <div style={{ display: 'grid', gap: 8 }}>
                  {emergencyContacts.length > 0 ? emergencyContacts.slice(0, 3).map((contact, i) => (
                    <a key={i} href={`tel:${contact.phone}`} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', background: 'rgba(99,210,255,0.05)', border: '1px solid rgba(99,210,255,0.15)', borderRadius: 12, textDecoration: 'none', color: '#fff' }}>
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 600 }}>{contact.name}</div>
                        <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)' }}>{contact.relationship}</div>
                      </div>
                      <div style={{ padding: '8px 16px', background: C, borderRadius: 100, color: '#000814', fontSize: 12, fontWeight: 700 }}>📞</div>
                    </a>
                  )) : (
                    <div style={{ textAlign: 'center', padding: 20, color: 'rgba(255,255,255,0.4)', fontSize: 12 }}>
                      No contacts saved yet
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* LANGUAGE MODAL */}
      {showPhraseModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.9)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: 20 }} onClick={() => setShowPhraseModal(false)}>
          <div style={{ background: R, borderRadius: 24, padding: 40, maxWidth: 600, width: '100%', textAlign: 'center' }} onClick={e => e.stopPropagation()}>
            <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.7)', marginBottom: 16 }}>Show this to someone who can help</div>
            <div style={{ fontSize: 36, fontWeight: 900, color: '#fff', marginBottom: 24 }}>I NEED HELP!</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: 12, marginBottom: 24 }}>
              {PHRASES.map((phrase, i) => (
                <div key={i} style={{ background: 'rgba(255,255,255,0.1)', borderRadius: 12, padding: 16 }}>
                  <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.6)', marginBottom: 6 }}>{phrase.lang}</div>
                  <div style={{ fontSize: 14, fontWeight: 700 }}>{phrase.phrase}</div>
                </div>
              ))}
            </div>
            <button onClick={() => setShowPhraseModal(false)} style={{ padding: '12px 32px', background: '#fff', border: 'none', borderRadius: 100, color: R, fontSize: 14, fontWeight: 700, cursor: 'pointer' }}>
              Close
            </button>
          </div>
        </div>
      )}

      {/* TOAST */}
      {showToast && (
        <div style={{ position: 'fixed', bottom: 24, left: '50%', transform: 'translateX(-50%)', background: '#05090f', border: `1px solid ${C}`, borderRadius: 12, padding: '12px 24px', display: 'flex', alignItems: 'center', gap: 10, zIndex: 1000, animation: 'slideUp 0.3s ease' }}>
          <span style={{ fontSize: 16, color: C }}>✓</span>
          <span style={{ fontSize: 13, color: '#fff' }}>{toastMessage}</span>
        </div>
      )}

      {/* EMERGENCY CARD MODAL */}
      {showEmergencyCard && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.95)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2000, padding: 20, overflowY: 'auto' }} onClick={() => setShowEmergencyCard(false)}>
          <div id="emergency-card" style={{ background: BG, border: `2px solid ${R}`, borderRadius: 24, padding: '24px', maxWidth: 400, width: '100%', textAlign: 'center' }} onClick={e => e.stopPropagation()}>
            <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.5)', marginBottom: 8 }}>EMERGENCY INFORMATION CARD</div>
            <div style={{ fontSize: 28, fontWeight: 900, color: R, marginBottom: 24, fontFamily: "'Playfair Display',serif" }}>⚠️ PLEASE HELP</div>
            
            <div style={{ background: 'rgba(255,255,255,0.05)', borderRadius: 16, padding: 20, marginBottom: 20, textAlign: 'left' }}>
              <div style={{ marginBottom: 16 }}>
                <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', marginBottom: 4 }}>MY LOCATION</div>
                <div style={{ fontSize: 14, fontWeight: 600, color: C, wordBreak: 'break-all' }}>{userLocation ? `${userLocation.lat.toFixed(4)}, ${userLocation.lng.toFixed(4)}` : 'Location unavailable'}</div>
              </div>
              
              <div style={{ marginBottom: 16 }}>
                <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', marginBottom: 4 }}>CURRENT COUNTRY</div>
                <div style={{ fontSize: 14, fontWeight: 600 }}>{detectedCountry?.flag} {detectedCountry?.name}</div>
              </div>

              <div style={{ marginBottom: 16 }}>
                <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', marginBottom: 4 }}>EMERGENCY NUMBERS</div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                  <div style={{ padding: '8px 12px', background: 'rgba(255,255,255,0.05)', borderRadius: 8 }}>
                    <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)' }}>🚔 Police</div>
                    <div style={{ fontSize: 16, fontWeight: 700, color: '#fff' }}>{detectedCountry?.police?.split(' ')[0] || '911'}</div>
                  </div>
                  <div style={{ padding: '8px 12px', background: 'rgba(255,255,255,0.05)', borderRadius: 8 }}>
                    <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)' }}>🚑 Ambulance</div>
                    <div style={{ fontSize: 16, fontWeight: 700, color: '#fff' }}>{detectedCountry?.ambulance?.split(' ')[0] || '911'}</div>
                  </div>
                  <div style={{ padding: '8px 12px', background: 'rgba(255,255,255,0.05)', borderRadius: 8 }}>
                    <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)' }}>🚒 Fire</div>
                    <div style={{ fontSize: 16, fontWeight: 700, color: '#fff' }}>{detectedCountry?.fire?.split(' ')[0] || '911'}</div>
                  </div>
                  <div style={{ padding: '8px 12px', background: 'rgba(255,255,255,0.05)', borderRadius: 8 }}>
                    <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)' }}>🆘 General</div>
                    <div style={{ fontSize: 16, fontWeight: 700, color: '#fff' }}>{detectedCountry?.general || '112'}</div>
                  </div>
                </div>
              </div>

              {emergencyContacts.length > 0 && (
                <div>
                  <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', marginBottom: 8 }}>EMERGENCY CONTACTS</div>
                  {emergencyContacts.slice(0, 2).map((contact, i) => (
                    <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 12px', background: 'rgba(255,255,255,0.05)', borderRadius: 8, marginBottom: 4 }}>
                      <span style={{ fontSize: 12, fontWeight: 600 }}>{contact.name}</span>
                      <span style={{ fontSize: 12, color: C }}>{contact.phone}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              <button onClick={() => {
                const printContent = `EMERGENCY CARD\nLocation: ${userLocation ? `${userLocation.lat.toFixed(4)}, ${userLocation.lng.toFixed(4)}` : 'Unavailable'}\nCountry: ${detectedCountry?.name || 'Unknown'}\nPolice: ${detectedCountry?.police || '911'}\nAmbulance: ${detectedCountry?.ambulance || '911'}\nFire: ${detectedCountry?.fire || '911'}\nGeneral: ${detectedCountry?.general || '112'}`
                navigator.clipboard.writeText(printContent)
                showToastMsg('Emergency card copied!')
              }} style={{ flex: 1, minWidth: 120, padding: '12px 16px', background: 'rgba(99,210,255,0.1)', border: `1px solid ${C}`, borderRadius: 12, color: C, fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
                📋 Copy
              </button>
              <button onClick={() => window.print()} style={{ flex: 1, minWidth: 120, padding: '12px 16px', background: R, border: 'none', borderRadius: 12, color: '#fff', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
                🖨️ Print
              </button>
            </div>
            
            <button onClick={() => setShowEmergencyCard(false)} style={{ marginTop: 16, padding: '10px 24px', background: 'transparent', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 100, color: 'rgba(255,255,255,0.5)', fontSize: 12, cursor: 'pointer' }}>
              Close
            </button>
          </div>
        </div>
      )}

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes pulse { 0%,100% { opacity: 1; } 50% { opacity: 0.5; } }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes slideUp { from { transform: translate(-50%, 20px); opacity: 0; } to { transform: translate(-50%, 0); opacity: 1; } }
        @keyframes sosPulse { 0%,100% { box-shadow: 0 0 40px rgba(255,107,107,0.6), 0 0 80px rgba(255,107,107,0.3); } 50% { box-shadow: 0 0 60px rgba(255,107,107,0.8), 0 0 100px rgba(255,107,107,0.5); } }
        ::-webkit-scrollbar { width: 5px; }
        ::-webkit-scrollbar-track { background: #000814; }
        ::-webkit-scrollbar-thumb { background: rgba(99,210,255,0.2); border-radius: 10px; }
        .accessibility-mode { font-size: 120% !important; }
        .accessibility-mode * { line-height: 1.8 !important; }
        @media print {
          body * { visibility: hidden; }
          #emergency-card, #emergency-card * { visibility: visible; }
          #emergency-card { position: absolute; left: 0; top: 0; width: 100%; }
        }
      `}</style>
    </div>
  )
}
