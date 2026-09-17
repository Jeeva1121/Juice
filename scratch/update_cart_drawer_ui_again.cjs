const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'src', 'components', 'CartDrawer.jsx');
let content = fs.readFileSync(filePath, 'utf8');

// 1. Add back the Promo Banner
const promoBanner = `              {/* Promotional Banner Area (Mimicking the image) */}
              <div className="mt-auto pt-12 pb-4 flex items-center justify-between">
                <div className="flex -space-x-3 items-end translate-y-2">
                   <img src="/assets/orange-can-hero.png" className="w-14 h-24 object-contain drop-shadow-md relative z-10" alt="can" onError={(e) => e.target.style.display='none'} />
                   <img src="/assets/straw-can-hero.png" className="w-14 h-24 object-contain drop-shadow-md relative z-20 scale-105" alt="can" onError={(e) => e.target.style.display='none'} />
                   <img src="/assets/cherry-can-hero.png" className="w-14 h-24 object-contain drop-shadow-md relative z-10" alt="can" onError={(e) => e.target.style.display='none'} />
                   <img src="/assets/lemon-can-hero.png" className="w-14 h-24 object-contain drop-shadow-md relative z-0 scale-95" alt="can" onError={(e) => e.target.style.display='none'} />
                </div>
                <div className="text-right">
                  <p className="font-black text-xl text-[#0F763F] leading-[1.1] tracking-tight">Good<br/>Juice<br/>Brighter<br/>Days</p>
                  <div className="w-8 h-[3px] bg-[#0F763F] ml-auto mt-2"></div>
                </div>
              </div>`;

// Insert promo banner before the closing div of the left column
content = content.replace(
  /<\/div>\s*<\/div>\s*{\/\* Right Column: Payment & Checkout \*\//s,
  `\n${promoBanner}\n            </div>\n          </div>\n\n          {/* Right Column: Payment & Checkout */}`
);

// 2. Fix the broken UPI images and increase card width horizontally
const brokenUpiArrayRegex = /\{\[\s*\{\s*id:\s*'gpay'[\s\S]*?\]\.map\(\(app\)/;
const newUpiArray = `                            {[
                              { id: 'gpay', name: 'GPay', icon: <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center font-bold text-[#1a73e8] border border-[#1a73e8] tracking-tighter shadow-sm text-sm">G</div> },
                              { id: 'phonepe', name: 'PhonePe', icon: <div className="w-8 h-8 rounded-full bg-[#5f259f] flex items-center justify-center text-white font-bold shadow-sm">पे</div> },
                              { id: 'paytm', name: 'Paytm', icon: <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-[#00b9f1] font-black border border-[#00b9f1] shadow-sm text-xs tracking-tighter">Pay</div> },
                              { id: 'bhim', name: 'BHIM', icon: <div className="w-8 h-8 flex flex-col items-center justify-center bg-[#FF8C00] rounded-sm text-white font-black text-[10px] leading-none shadow-sm"><span className="text-white">BH</span><span className="text-[#008000]">IM</span></div> },
                              { id: 'cred', name: 'CRED', icon: <div className="w-8 h-8 rounded-full bg-black flex items-center justify-center text-white font-bold shadow-sm text-xs">C</div> },
                            ].map((app)`;

content = content.replace(brokenUpiArrayRegex, newUpiArray);

// Increase the width of the QR card container
content = content.replace(/md:w-\[280px\]/g, 'md:w-[320px] xl:w-[360px]');
content = content.replace(/w-48 h-48/g, 'w-56 h-56 xl:w-64 xl:h-64');

// Adjust the button wrapper for UPI apps to fill horizontal space more evenly
content = content.replace(/w-14 h-16 sm:w-16 sm:h-20/g, 'flex-1 min-w-[70px] h-20 sm:h-24');
content = content.replace(/gap-2 sm:gap-3 flex-wrap/g, 'gap-2 sm:gap-4 flex-wrap w-full justify-between');

// Also widen the main checkout container to give it more breathing room since we expanded the right card
content = content.replace(/max-w-7xl/, 'max-w-[1400px]');
content = content.replace(/lg:w-\[420px\] xl:w-\[460px\]/, 'lg:w-[420px]');

fs.writeFileSync(filePath, content, 'utf8');
console.log("Successfully applied fixes to CartDrawer.jsx");
