const fs = require('fs');
const path = 'src/sections/Hero.jsx';
let content = fs.readFileSync(path, 'utf8');

// 1. Remove drop-shadow-lg from fruit pieces
content = content.replace(/className="w-full h-auto object-contain drop-shadow-lg"/g, 'className="w-full h-auto object-contain"');

// 2. Remove will-change-transform
content = content.replace(/ will-change-transform/g, '');

// 3. Add force3D: true to scroll triggers for hardware acceleration
content = content.replace(/ease: 'power2\.out', duration: 1/g, "ease: 'power2.out', duration: 1, force3D: true");
content = content.replace(/ease: 'power2\.out', duration: 0\.8/g, "ease: 'power2.out', duration: 0.8, force3D: true");

// 4. Remove CSS floating animations from the pieces themselves, they shouldn't float constantly while scrolling
content = content.replace(/className="animate-fruit-float-a"/g, 'className=""');
content = content.replace(/className="animate-fruit-float-b"/g, 'className=""');
content = content.replace(/className="animate-fruit-float-c"/g, 'className=""');

fs.writeFileSync(path, content);
console.log('Performance optimizations applied to Hero.jsx');
