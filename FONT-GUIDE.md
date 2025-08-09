# Font Guide for Wedding Landing Page

## Font Hierarchy

Your wedding landing page now has a comprehensive font system with three font categories:

### 1. Heading Fonts (Serif, elegant, festlich)
- **Primary**: Playfair Display
- **Alternative**: Cormorant Garamond
- **Use for**: Main headings (h1, h2), dates, locations, special quotes

### 2. Body Fonts (Sans-Serif, modern, klar)
- **Primary**: Inter
- **Alternative**: Nunito
- **Use for**: Body text, descriptions, buttons, navigation

### 3. Accent Fonts (Script/Handwritten)
- **Primary**: Great Vibes
- **Alternative**: Dancing Script
- **Use for**: Couple names, decorative elements, section dividers

## CSS Classes Available

### Font Family Classes
```css
.font-heading     /* Playfair Display (primary serif) */
.font-heading-alt /* Cormorant Garamond (alternative serif) */
.font-body        /* Inter (primary sans-serif) */
.font-body-alt    /* Nunito (alternative sans-serif) */
.font-script      /* Great Vibes (primary script) */
.font-script-alt  /* Dancing Script (alternative script) */
```

### Tailwind Font Classes
```css
.font-serif       /* Primary serif font */
.font-serif-alt   /* Alternative serif font */
.font-sans        /* Primary sans-serif font */
.font-body        /* Body text font */
.font-body-alt    /* Alternative body font */
.font-accent      /* Primary script font */
.font-accent-alt  /* Alternative script font */
```

### Typography Utility Classes
```css
.text-hero          /* Large hero text (responsive) */
.text-display       /* Display text (responsive) */
.text-section-title /* Section titles (responsive) */
.text-elegant       /* Elegant styling with letter spacing */
.text-festive       /* Festive styling (uppercase, spaced) */
```

### Special Purpose Classes
```css
.wedding-date     /* Styling for dates */
.wedding-location /* Styling for locations */
```

## Usage Examples

### Hero Section
```tsx
<h1 className="font-script text-hero text-purple">
  {c('name1')} & {c('name2')}
</h1>
<p className="font-heading text-display mt-4">
  {t('title')}
</p>
<p className="font-body text-xl mt-2">
  {t('subtitle')}
</p>
```

### Section Headings
```tsx
<h2 className="font-heading text-section-title text-elegant">
  {t('sectionTitle')}
</h2>
```

### Dates and Locations
```tsx
<p className="wedding-date text-2xl">
  15. Juni 2025
</p>
<p className="wedding-location text-lg">
  Mallorca, Spanien
</p>
```

### Body Text
```tsx
<p className="font-body text-lg leading-relaxed">
  {t('description')}
</p>
```

### Decorative Elements
```tsx
<span className="font-script text-3xl text-sage-green">
  ❦
</span>
```

### Buttons and Navigation
```tsx
<button className="font-body font-medium px-6 py-3">
  {t('rsvp')}
</button>
```

## Responsive Behavior

The typography system is fully responsive:

- **Mobile (< 640px)**: Smaller font sizes, tighter spacing
- **Tablet (768px - 1023px)**: Medium font sizes
- **Desktop (≥ 1024px)**: Full font sizes with optimal spacing

## Performance Notes

- All fonts use `font-display: swap` for better loading performance
- Fonts are loaded from Google Fonts CDN
- Fallback fonts are provided for each category
- The system is GDPR/DSGVO friendly when self-hosted

## Component Updates Needed

You may want to update your existing components to use the new font classes:

1. Replace `font-script` with `font-accent` for script fonts
2. Replace `font-heading` with `font-serif` for headings
3. Use `font-body` for all body text
4. Use utility classes like `text-hero`, `text-display` for better responsive typography

## Custom Font Combinations

You can also create custom combinations:
```tsx
<h1 className="font-serif-alt text-hero text-elegant">
  Elegant Title
</h1>
```
