# Utils Folder

## 📁 Tujuan Folder

Folder `utils/` berisi **utility functions** - helper functions yang bisa digunakan di berbagai tempat dalam aplikasi. Functions di sini bersifat **generic** dan **reusable**.

## 🎯 Apa itu Utility Functions?

Utility functions adalah **"toolbox"** aplikasi - fungsi-fungsi kecil yang melakukan satu tugas spesifik dan bisa dipakai berulang kali.

Think of it as **"Swiss Army Knife"** - tools yang siap pakai kapan saja.

## 📂 Utility Functions yang Akan Dibuat

```
utils/
├── logger.ts           # Logging utilities
├── validator.ts        # Input validation helpers
├── formatter.ts        # Data formatting utilities
├── dateHelper.ts       # Date manipulation
├── fileHandler.ts      # File upload & storage
└── errorUtils.ts       # Error handling utilities
```

## 📄 Contoh Utility Functions

### 1. **logger.ts** - Logging

```typescript
// logger.ts
export const logger = {
  info: (message: string, data?: any) => {
    if (process.env.NODE_ENV !== 'production') {
      console.log(`[INFO] ${message}`, data || '');
    }
  },

  error: (message: string, error?: any) => {
    console.error(`[ERROR] ${message}`, error || '');
  },

  warn: (message: string, data?: any) => {
    console.warn(`[WARN] ${message}`, data || '');
  },

  debug: (message: string, data?: any) => {
    if (process.env.NODE_ENV === 'development') {
      console.debug(`[DEBUG] ${message}`, data || '');
    }
  },
};

// Usage:
logger.info('User created artwork', { artworkId: '123', userId: 'abc' });
logger.error('Failed to save artwork', error);
```

### 2. **validator.ts** - Validation

```typescript
// validator.ts
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePrice = (price: number): boolean => {
  return price >= 0 && Number.isFinite(price);
};

export const validateYear = (year: number): boolean => {
  const currentYear = new Date().getFullYear();
  return year >= 1900 && year <= currentYear;
};

export const sanitizeString = (str: string): string => {
  return str.trim().replace(/[<>]/g, '');
};

export const validatePhone = (phone: string): boolean => {
  // Indonesian phone number format
  const phoneRegex = /^(\+62|62|0)[0-9]{9,12}$/;
  return phoneRegex.test(phone.replace(/[\s-]/g, ''));
};

// Usage:
if (!validateEmail(email)) {
  throw new ApiError(400, 'Invalid email format');
}
```

### 3. **formatter.ts** - Data Formatting

```typescript
// formatter.ts
export const formatCurrency = (amount: number, currency: string = 'IDR'): string => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: currency,
  }).format(amount);
};

export const formatDate = (date: Date, format: string = 'yyyy-MM-dd'): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  
  return format
    .replace('yyyy', String(year))
    .replace('MM', month)
    .replace('dd', day);
};

export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

export const slugify = (text: string): string => {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

// Usage:
const formatted = formatCurrency(150000, 'IDR'); // "Rp150.000,00"
const slug = slugify("My Artwork Title!"); // "my-artwork-title"
```

### 4. **dateHelper.ts** - Date Utilities

```typescript
// dateHelper.ts
export const addDays = (date: Date, days: number): Date => {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
};

export const diffInDays = (date1: Date, date2: Date): number => {
  const diffTime = Math.abs(date2.getTime() - date1.getTime());
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

export const isExpired = (date: Date): boolean => {
  return date < new Date();
};

export const getStartOfMonth = (date: Date): Date => {
  return new Date(date.getFullYear(), date.getMonth(), 1);
};

export const getEndOfMonth = (date: Date): Date => {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0);
};

// Usage:
const deadline = addDays(new Date(), 30); // 30 days from now
const isLate = isExpired(expectedCloseDate);
```

### 5. **fileHandler.ts** - File Handling

```typescript
// fileHandler.ts
import path from 'path';

export const getAllowedFileTypes = (): string[] => {
  return ['.jpg', '.jpeg', '.png', '.gif', '.webp'];
};

export const getFileExtension = (filename: string): string => {
  return path.extname(filename).toLowerCase();
};

export const isImageFile = (filename: string): boolean => {
  const ext = getFileExtension(filename);
  return getAllowedFileTypes().includes(ext);
};

export const generateUniqueFilename = (originalFilename: string): string => {
  const ext = getFileExtension(originalFilename);
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(7);
  return `${timestamp}-${random}${ext}`;
};

export const validateFileSize = (sizeInBytes: number, maxSizeMB: number = 5): boolean => {
  const maxSizeBytes = maxSizeMB * 1024 * 1024;
  return sizeInBytes <= maxSizeBytes;
};

// Usage:
if (!isImageFile(file.name)) {
  throw new ApiError(400, 'Only image files allowed');
}
const newFilename = generateUniqueFilename(file.name);
```

### 6. **errorUtils.ts** - Error Handling

```typescript
// errorUtils.ts
export const isPrismaError = (error: any): boolean => {
  return error.code && error.code.startsWith('P');
};

export const handlePrismaError = (error: any): string => {
  // P2002: Unique constraint violation
  if (error.code === 'P2002') {
    const field = error.meta?.target?.[0] || 'field';
    return `This ${field} already exists`;
  }

  // P2025: Record not found
  if (error.code === 'P2025') {
    return 'Record not found';
  }

  return 'Database error occurred';
};

export const isValidationError = (error: any): boolean => {
  return error.name === 'ValidationError';
};

// Usage in service:
try {
  await prisma.user.create({ data });
} catch (error) {
  if (isPrismaError(error)) {
    throw new ApiError(400, handlePrismaError(error));
  }
  throw error;
}
```

## 🔑 Prinsip Utility Functions

### 1. **Single Responsibility**
Setiap function hanya melakukan SATU tugas.

✅ **GOOD:**
```typescript
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};
```

❌ **BAD:**
```typescript
export const validateAndSaveEmail = (email: string) => {
  // DON'T do multiple things!
  if (!validateEmail(email)) throw new Error();
  await saveToDatabase(email);
};
```

### 2. **Pure Functions**
Function yang sama input akan menghasilkan sama output, tanpa side effects.

✅ **GOOD:**
```typescript
export const addDays = (date: Date, days: number): Date => {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result; // Return new date, don't modify original
};
```

❌ **BAD:**
```typescript
export const addDays = (date: Date, days: number): Date => {
  date.setDate(date.getDate() + days); // Modifies original!
  return date;
};
```

### 3. **Well-Named & Documented**

```typescript
/**
 * Calculate difference between two dates in days
 * @param date1 - First date
 * @param date2 - Second date
 * @returns Number of days between dates (absolute value)
 */
export const diffInDays = (date1: Date, date2: Date): number => {
  const diffTime = Math.abs(date2.getTime() - date1.getTime());
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};
```

### 4. **Testable**
Utility functions should be easy to test.

```typescript
// Easy to test
describe('validateEmail', () => {
  it('should return true for valid email', () => {
    expect(validateEmail('test@example.com')).toBe(true);
  });

  it('should return false for invalid email', () => {
    expect(validateEmail('invalid-email')).toBe(false);
  });
});
```

## 🎯 Kapan Menggunakan Utils?

**Gunakan utils ketika:**
- Function dipakai di lebih dari 2 tempat
- Logic bersifat generic (tidak spesifik ke domain bisnis)
- Function bisa di-reuse untuk future features

**JANGAN taruh di utils jika:**
- Logic spesifik ke business domain → masuk ke **services**
- Terkait database operations → masuk ke **services**
- Terkait HTTP handling → masuk ke **controllers/middlewares**

## 📋 Utils vs Services

| Utils | Services |
|-------|----------|
| Generic helpers | Business logic |
| No database access | Database operations |
| Reusable across projects | Domain-specific |
| Pure functions | Can have side effects |
| Example: formatDate() | Example: createArtwork() |

## 🎯 Kesimpulan

Utils folder adalah **"toolbox"** aplikasi. Utils:
- Generic helper functions
- Reusable across application
- Single responsibility
- Easy to test
- No side effects (mostly)

**Remember:** Utils = Generic Tools, Services = Business Logic!
