# Perubahan Desain: Neo-Brutalism / Asymmetric Design

## Overview
Admin panel telah diubah dari desain modern/minimalis menjadi gaya **Neo-Brutalism** dengan elemen **Asimetris** yang bold dan ekspresif.

## Karakteristik Desain Baru

### 1. **Border & Shadow**
- Border tebal (4px-8px) hitam di semua elemen
- Box shadow offset (4px-16px) untuk efek 3D
- Tidak ada rounded corners (sharp edges)

### 2. **Warna**
- Palet warna cerah dan berani:
  - Blue: `bg-blue-400`
  - Emerald: `bg-emerald-400`
  - Orange: `bg-orange-400`
  - Yellow: `bg-yellow-300`
  - Pink: `bg-pink-300/400`
  - Red: `bg-red-500`
- Background gradient: `from-yellow-200 via-pink-200 to-blue-200`

### 3. **Typography**
- Font weight: `font-black` (900) untuk heading
- Font weight: `font-bold` (700) untuk body text
- Text transform: `uppercase` untuk emphasis
- Stroke width: `strokeWidth={3}` untuk icons

### 4. **Asymmetric Elements**
- Rotasi acak: `-rotate-1`, `rotate-1`, `-rotate-2`, `rotate-2`, dll
- Posisi tidak simetris pada cards dan elements
- Hover effects dengan translate dan shadow changes

### 5. **Interactive States**
```css
/* Hover */
hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]
hover:translate-x-[-2px] hover:translate-y-[-2px]

/* Active */
active:translate-x-0 active:translate-y-0
active:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]
```

## Komponen yang Diubah

### Layout Components
- ✅ `Layout.jsx` - Background gradient, container styling
- ✅ `Navbar.jsx` - Border tebal, gradient header, neo-brutal dropdown
- ✅ `Sidebar.jsx` - Asymmetric menu items dengan rotasi berbeda
- ✅ `PageHeader.jsx` - Bold typography, thick borders

### UI Components
- ✅ `Card.jsx` - Variants dengan warna berbeda, thick borders
- ✅ `Button.jsx` - Shadow offset, hover effects, uppercase text
- ✅ `Input.jsx` - Thick borders, bold labels, shadow on focus
- ✅ `Select.jsx` - Consistent dengan Input styling
- ✅ `Textarea.jsx` - Consistent dengan Input styling
- ✅ `Badge.jsx` - Thick borders, bold colors
- ✅ `Modal.jsx` - Large borders, gradient header, asymmetric rotation

### Feature Components
- ✅ `NotificationBell.jsx` - Neo-brutal dropdown, bold styling
- ✅ `DarkModeToggle.jsx` - Border box dengan rotation

### Pages
- ✅ `HomePage.jsx` - Full neo-brutal landing page
- ✅ `LoginPage.jsx` - Asymmetric layout, bold forms
- ✅ `StoklabelDashboard.jsx` - Example dashboard dengan neo-brutal cards

## Design Principles

1. **Bold & Expressive**: Semua elemen harus terlihat jelas dan berani
2. **High Contrast**: Gunakan hitam untuk borders dan contrast tinggi
3. **Playful Asymmetry**: Rotasi dan posisi yang tidak simetris
4. **Tactile Interaction**: Shadow dan translate untuk feedback visual
5. **No Subtlety**: Hindari efek halus, semua harus terlihat jelas

## Color Palette per App

### Material App
- Primary: `bg-blue-400`
- Secondary: `bg-yellow-300`

### Stoklabel App
- Primary: `bg-emerald-400`
- Secondary: `bg-pink-300`

### LPS App
- Primary: `bg-orange-400`
- Secondary: `bg-purple-300`

## Implementation Notes

- Semua komponen menggunakan Tailwind CSS
- Dark mode support dengan `dark:` prefix
- Responsive design tetap dipertahankan
- Accessibility tetap menjadi prioritas (contrast, focus states)

## Browser Compatibility

Desain ini menggunakan CSS modern yang didukung oleh:
- Chrome/Edge 90+
- Firefox 88+
- Safari 14+

## Future Enhancements

- [ ] Animasi micro-interactions lebih banyak
- [ ] Sound effects untuk interactions (optional)
- [ ] Custom cursor styles
- [ ] More asymmetric layouts untuk halaman lain
