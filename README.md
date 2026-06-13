# The Golden Fork - Restaurant Website

A beautiful, professional restaurant website built with HTML, CSS, and JavaScript.

## Features

✨ **Modern & Responsive Design**
- Works perfectly on desktop, tablet, and mobile devices
- Smooth animations and transitions
- Professional color scheme with golden accents

🍽️ **Key Sections**

1. **Navigation Bar** - Sticky navigation with smooth scrolling
2. **Hero Section** - Eye-catching banner with call-to-action
3. **About Us** - Restaurant information and features
4. **Menu** - Organized menu with appetizers, mains, and desserts
5. **Gallery** - Photo showcase of the restaurant
6. **Reservations** - Functional reservation form
7. **Contact** - Location, hours, and contact information
8. **Footer** - Copyright and credits

## Sections Breakdown

### Home
- Large hero image/banner
- Welcome message
- Quick reservation button

### About
- Restaurant description
- Three key features (Quality, Expertise, Excellence)
- Hover animations on feature cards

### Menu
- Three menu categories
- Appetizers, Main Courses, and Desserts
- Price information for each dish

### Gallery
- 6 image placeholders (ready for real photos)
- Hover zoom effect
- Clean grid layout

### Reservations
- Complete reservation form
- Fields: Name, Email, Phone, Date, Time, Guests, Occasion, Special Requests
- Form validation
- Success/Error messages

### Contact
- Address, Phone, Email
- Operating hours
- Contact information grid

## How to Use

1. **Host the website**: Upload the files to your web server or use GitHub Pages
2. **Customize the content**:
   - Replace "The Golden Fork" with your restaurant name
   - Update menu items, prices, and descriptions
   - Add your restaurant's contact information
   - Replace opening hours with your actual hours

3. **Add real images**: Replace the emoji placeholders in the gallery with actual photos

4. **Connect to a backend** (Optional):
   - The reservation form currently just shows a success message
   - To save reservations, connect it to a backend service or email service

## Customization Guide

### Colors
Edit the CSS color variables in `styles.css`:
```css
:root {
    --primary-color: #d4af37;      /* Gold */
    --secondary-color: #2c2c2c;    /* Dark */
    --text-color: #333;             /* Text */
    --light-bg: #f9f7f4;            /* Light background */
}
```

### Content
- Update restaurant name in `index.html`
- Edit menu items in the Menu section
- Update contact information in the Contact section
- Modify opening hours to match your restaurant

### Images
Replace the emoji placeholders with real images:
```html
<!-- Replace emoji with actual image -->
<img src="path/to/your/image.jpg" alt="Description">
```

## Form Integration

The reservation form currently displays a success message. To actually save reservations:

1. **Email Integration**: Use a service like Formspree or EmailJS
2. **Backend Database**: Connect to your own server/database
3. **Third-party Services**: Use Airtable, Google Sheets, or similar

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers

## Performance

- Lightweight and fast loading
- Optimized CSS and JavaScript
- No external dependencies required
- Responsive images

## Future Enhancements

- Add real photo gallery with lightbox
- Integrate with a reservation system (OpenTable, etc.)
- Add online ordering system
- Implement reviews/testimonials section
- Add live availability/wait times
- Social media integration

## License

Free to use and customize for your restaurant!

## Support

For questions or customizations, feel free to modify the code as needed.

---

Made with ❤️ for restaurants everywhere! 🍽️