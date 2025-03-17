# Documentation Technique du Formateur de Numéros de Téléphone Libanais

## 🇫🇷 Français

### Vue d'ensemble
Cette application est conçue pour formater et valider les numéros de téléphone libanais. Elle se compose de deux parties principales :
- Un utilitaire de formatage (`phoneFormatter.ts`)
- Une interface utilisateur React (`App.tsx`)

### Analyse Détaillée du Code (`phoneFormatter.ts`)

#### 1. Constantes et Types
```typescript
const LEBANESE_PREFIXES = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '70', '71', '76', '78', '79', '81', '82', '83', '84', '85', '86', '87', '88', '89'];
const SINGLE_DIGIT_PREFIXES = ['1', '2', '3', '4', '5', '6', '8', '9'];
```
- `LEBANESE_PREFIXES` : Définit tous les préfixes valides pour les numéros libanais
- `SINGLE_DIGIT_PREFIXES` : Liste des préfixes qui peuvent apparaître sans zéro initial

#### 2. Fonction Principale
```typescript
export function formatLebaneseMobile(input: string, startId: number, inputId: number): PhoneNumber[]
```
- **Paramètres** :
  - `input` : Chaîne de caractères contenant un ou plusieurs numéros
  - `startId` : ID de départ pour la numérotation des résultats
  - `inputId` : ID de la ligne d'entrée
- **Retour** : Tableau d'objets `PhoneNumber`

#### 3. Extraction des Numéros
```typescript
function splitNumbersByNonNumeric(input: string): string[]
```
- **Fonctionnement** :
  - Utilise une boucle caractère par caractère
  - Accumule les chiffres et le symbole '+'
  - Détecte les séparateurs en vérifiant :
    - Le nombre de chiffres avant le séparateur (7-13 chiffres)
    - Le nombre de chiffres après le séparateur (7-13 chiffres)
  - Gère les cas spéciaux comme les préfixes internationaux

#### 4. Traitement des Numéros
```typescript
function processNumber(cleaned: string, id: number, inputId: number, rawInput: string, originalNumber: string): PhoneNumber
```
- **Étapes de traitement** :
  1. Nettoyage initial des caractères non numériques
  2. Détection du format international :
     - `96` ou `961`
     - `00961`
     - `+961`
     - `00X961` (X étant un chiffre quelconque)
  3. Extraction du numéro local
  4. Formatage selon les règles libanaises

#### 5. Formatage Local
```typescript
function formatLocalNumber(number: string, id: number, inputId: number, rawInput: string, originalNumber: string): PhoneNumber
```
- **Règles de formatage** :
  1. Traitement spécial pour les préfixes `7x` et `8x`
  2. Vérification des préfixes à deux chiffres
  3. Ajout du zéro initial si nécessaire
  4. Validation de la longueur et du format

#### 6. Validation Finale
```typescript
function validateAndFormatNumber(number: string, id: number, inputId: number, rawInput: string, originalNumber: string): PhoneNumber
```
- **Critères de validation** :
  - Longueur totale de 8 chiffres
  - Préfixe valide (2 chiffres)
  - Numéro local de 6 chiffres
- **Format de sortie** :
  ```typescript
  {
    id: number,
    inputId: number,
    rawInput: string,
    input: string,
    output: {
      ext: string,    // '00961' pour les numéros valides
      prefix: string, // Préfixe à 2 chiffres
      number: string  // 6 chiffres restants
    },
    isValid: boolean,
    note?: string     // Message d'erreur si invalide
  }
  ```

### Interface Utilisateur (`App.tsx`)

#### Fonctionnalités
- Upload de fichiers CSV
- Affichage des résultats dans un tableau
- Statistiques de validation
- Export des résultats en CSV

#### Composants
- Zone de dépôt de fichier
- Tableau de résultats
- Barre de progression
- Bouton d'export

---

## 🇬🇧 English

### Overview
This application is designed to format and validate Lebanese phone numbers. It consists of two main parts:
- A formatting utility (`phoneFormatter.ts`)
- A React user interface (`App.tsx`)

### Detailed Code Analysis (`phoneFormatter.ts`)

#### 1. Constants and Types
```typescript
const LEBANESE_PREFIXES = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '70', '71', '76', '78', '79', '81', '82', '83', '84', '85', '86', '87', '88', '89'];
const SINGLE_DIGIT_PREFIXES = ['1', '2', '3', '4', '5', '6', '8', '9'];
```
- `LEBANESE_PREFIXES`: Defines all valid Lebanese number prefixes
- `SINGLE_DIGIT_PREFIXES`: List of prefixes that can appear without leading zero

#### 2. Main Function
```typescript
export function formatLebaneseMobile(input: string, startId: number, inputId: number): PhoneNumber[]
```
- **Parameters**:
  - `input`: String containing one or more numbers
  - `startId`: Starting ID for result numbering
  - `inputId`: Input line ID
- **Returns**: Array of `PhoneNumber` objects

#### 3. Number Extraction
```typescript
function splitNumbersByNonNumeric(input: string): string[]
```
- **Operation**:
  - Uses character-by-character loop
  - Accumulates digits and '+' symbol
  - Detects separators by checking:
    - Number of digits before separator (7-13 digits)
    - Number of digits after separator (7-13 digits)
  - Handles special cases like international prefixes

#### 4. Number Processing
```typescript
function processNumber(cleaned: string, id: number, inputId: number, rawInput: string, originalNumber: string): PhoneNumber
```
- **Processing Steps**:
  1. Initial cleaning of non-numeric characters
  2. International format detection:
     - `96` or `961`
     - `00961`
     - `+961`
     - `00X961` (X being any digit)
  3. Local number extraction
  4. Formatting according to Lebanese rules

#### 5. Local Formatting
```typescript
function formatLocalNumber(number: string, id: number, inputId: number, rawInput: string, originalNumber: string): PhoneNumber
```
- **Formatting Rules**:
  1. Special handling for `7x` and `8x` prefixes
  2. Two-digit prefix verification
  3. Leading zero addition if necessary
  4. Length and format validation

#### 6. Final Validation
```typescript
function validateAndFormatNumber(number: string, id: number, inputId: number, rawInput: string, originalNumber: string): PhoneNumber
```
- **Validation Criteria**:
  - Total length of 8 digits
  - Valid prefix (2 digits)
  - Local number of 6 digits
- **Output Format**:
  ```typescript
  {
    id: number,
    inputId: number,
    rawInput: string,
    input: string,
    output: {
      ext: string,    // '00961' for valid numbers
      prefix: string, // 2-digit prefix
      number: string  // remaining 6 digits
    },
    isValid: boolean,
    note?: string     // Error message if invalid
  }
  ```

### User Interface (`App.tsx`)

#### Features
- CSV file upload
- Results display in table format
- Validation statistics
- CSV export of results

#### Components
- File drop zone
- Results table
- Progress bar
- Export button

---

## 🇱🇧 عربي

### نظرة عامة
هذا التطبيق مصمم لتنسيق وتحقق من أرقام الهواتف اللبنانية. يتكون من جزئين رئيسيين:
- أداة التنسيق (`phoneFormatter.ts`)
- واجهة مستخدم React (`App.tsx`)

### تحليل مفصل للكود (`phoneFormatter.ts`)

#### ١. الثوابت والأنواع
```typescript
const LEBANESE_PREFIXES = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '70', '71', '76', '78', '79', '81', '82', '83', '84', '85', '86', '87', '88', '89'];
const SINGLE_DIGIT_PREFIXES = ['1', '2', '3', '4', '5', '6', '8', '9'];
```
- `LEBANESE_PREFIXES`: يحدد جميع بدايات الأرقام اللبنانية الصالحة
- `SINGLE_DIGIT_PREFIXES`: قائمة البدايات التي يمكن أن تظهر بدون صفر في المقدمة

#### ٢. الدالة الرئيسية
```typescript
export function formatLebaneseMobile(input: string, startId: number, inputId: number): PhoneNumber[]
```
- **المعاملات**:
  - `input`: سلسلة تحتوي على رقم أو أكثر
  - `startId`: معرف البداية لترقيم النتائج
  - `inputId`: معرف سطر الإدخال
- **الإرجاع**: مصفوفة من كائنات `PhoneNumber`

#### ٣. استخراج الأرقام
```typescript
function splitNumbersByNonNumeric(input: string): string[]
```
- **آلية العمل**:
  - يستخدم حلقة حرف بحرف
  - يجمع الأرقام ورمز '+'
  - يكتشف الفواصل عن طريق التحقق من:
    - عدد الأرقام قبل الفاصل (7-13 رقم)
    - عدد الأرقام بعد الفاصل (7-13 رقم)
  - يعالج الحالات الخاصة مثل البدايات الدولية

#### ٤. معالجة الأرقام
```typescript
function processNumber(cleaned: string, id: number, inputId: number, rawInput: string, originalNumber: string): PhoneNumber
```
- **خطوات المعالجة**:
  1. التنظيف الأولي للأحرف غير الرقمية
  2. اكتشاف التنسيق الدولي:
     - `96` أو `961`
     - `00961`
     - `+961`
     - `00X961` (X أي رقم)
  3. استخراج الرقم المحلي
  4. التنسيق وفقاً للقواعد اللبنانية

#### ٥. التنسيق المحلي
```typescript
function formatLocalNumber(number: string, id: number, inputId: number, rawInput: string, originalNumber: string): PhoneNumber
```
- **قواعد التنسيق**:
  1. معالجة خاصة للبدايات `7x` و `8x`
  2. التحقق من البدايات ذات الرقمين
  3. إضافة الصفر في المقدمة إذا لزم الأمر
  4. التحقق من الطول والتنسيق

#### ٦. التحقق النهائي
```typescript
function validateAndFormatNumber(number: string, id: number, inputId: number, rawInput: string, originalNumber: string): PhoneNumber
```
- **معايير التحقق**:
  - الطول الإجمالي 8 أرقام
  - بداية صالحة (رقمان)
  - رقم محلي من 6 أرقام
- **تنسيق الإخراج**:
  ```typescript
  {
    id: number,
    inputId: number,
    rawInput: string,
    input: string,
    output: {
      ext: string,    // '00961' للأرقام الصالحة
      prefix: string, // بداية من رقمين
      number: string  // 6 أرقام متبقية
    },
    isValid: boolean,
    note?: string     // رسالة خطأ إذا كان غير صالح
  }
  ```

### واجهة المستخدم (`App.tsx`)

#### الميزات
- تحميل ملفات CSV
- عرض النتائج في جدول
- إحصائيات التحقق
- تصدير النتائج بتنسيق CSV

#### المكونات
- منطقة إسقاط الملفات
- جدول النتائج
- شريط التقدم
- زر التصدير