# Churchill Home Value Calculator

This project is ready to deploy on Vercel.

## Important

Do not upload `node_modules` to GitHub.

## Correct structure

app/
  page.js
  layout.js
  globals.css

package.json
next.config.js
postcss.config.js
tailwind.config.js

## Email setup

Open `app/page.js` and replace:

https://formspree.io/f/YOUR_FORM_ID

with your real Formspree form endpoint.

Formspree will notify the email address connected to your Formspree account. To notify Trey, use trey.brotzki@churchillmortgage.com as the notification email in Formspree settings.
