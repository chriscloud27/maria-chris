# Wedding Landing Page

## Overview

This project is a wedding landing page built using modern web technologies. It is designed to provide an elegant and responsive interface for wedding-related information, including features like multilingual support and a WhatsApp contact button.

## Tech Stack

### Frontend

- **React**: A JavaScript library for building user interfaces.
- **Next.js**: A React framework for server-side rendering, static site generation, and routing.
- **TypeScript**: A strongly typed programming language that builds on JavaScript.
- **Tailwind CSS**: A utility-first CSS framework for styling.
- **next-intl**: A library for internationalization (i18n) in Next.js applications, configured with support for `es` (Spanish), `de` (German), and `en` (English).
- **Google Fonts**: Custom fonts integrated using `next/font` and `@fontsource`.

### Backend

- **Next.js API Routes**: Used for server-side logic and API endpoints.

### Additional Tools

- **WhatsApp Button**: A custom React component for quick WhatsApp contact.
- **ESLint & Prettier**: For code linting and formatting.
- **GitHub**: Version control and collaboration.

## Project Structure

```
/src
  /app
    /[locale]
      layout.tsx       # Layout component with locale-based rendering
  /components
    WhatsAppButton.tsx # Custom WhatsApp button component
  /styles
    globals.css        # Global styles
```

### Key Files

- **`layout.tsx`**: Handles the layout for the application, including font imports, locale-based rendering, and the integration of the WhatsApp button.
- **`WhatsAppButton.tsx`**: A reusable component for adding a WhatsApp contact button.

## Features

- **Multilingual Support**: Powered by `next-intl` for seamless internationalization.
- **Custom Fonts**: Integrated using Google Fonts and `@fontsource`.
- **Responsive Design**: Styled with Tailwind CSS for mobile-first responsiveness.
- **WhatsApp Integration**: A button for direct communication via WhatsApp.

## How to Run

1.  Clone the repository:

    ```bash
    git clone https://github.com/your-username/wedding-landing-page.git
    ```

2.  Install dependencies:

    ```bash
    npm install
    ```

3.  Run the development server:

    ```bash
    npm run dev
    ```

4.  Open the application in your browser at `http://localhost:3000`.

## Deployment

This project can be deployed on platforms like Vercel for seamless hosting and CI/CD integration.

## Contributing

Contributions are welcome! Please fork the repository and submit a pull request.

## License

This project is licensed under the MIT License.
