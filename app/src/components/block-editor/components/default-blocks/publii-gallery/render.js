function render (blockData) {
  let id = blockData.config.advanced.id ? ' id="' + blockData.config.advanced.id + '"' : '';
  let cssClasses = ['gallery-wrapper', blockData.config.advanced.cssClasses, 'gallery-wrapper--' + blockData.config.imageAlign].filter(item => item && item.trim() !== '' && item !== 'gallery-wrapper--center');
  console.log('class',cssClasses );
  cssClasses = cssClasses.length ? ' class="' + cssClasses.join(' ') + '"' : '';
  let images = "";
  console.log('css', cssClasses);
  console.log('blockData.content', blockData.content);
  console.log("display:",blockData.config.display );
  console.log('img',blockData.content.images[0]);
  if(blockData.config.display === 'slide') {
    images += `<div class="slider glide">
                  <div class="glide__track" data-glide-el="track">
                    <ul class="glide__slides">`;
  }

  for (let i = 0; i < blockData.content.images.length; i++) {
      let img = blockData.content.images[i];
      let caption = '';

      if (img.caption.trim() !== '') {
          caption = `<figcaption>${img.caption}</figcaption>`
      }

      if (blockData.config.display !== 'slide') {
        images += `<figure class="gallery__item">
                        <a href="${img.src}" data-size="${img.dimensions}">
                          <img src="${img.thumbnailSrc}" height="${img.height}" width="${img.width}" alt="${img.alt}">
                        </a>
                        ${caption}
                        </figure>`; 
      } else if(blockData.config.display === 'slide') { 
        images += `<li class="publii-block-gallery-item glide__slide">
                        <a href="void(0)" data-size="${img.dimensions}">
                          <img src="${img.src}" height="${img.height}" width="${img.width}" alt="${img.alt}">
                        </a>
                  </li>`;
      } 
  } 
  if(blockData.config.display === 'slide') { 
    let script = `<script>new Glide('.glide').mount();</script>`; 

      images += `</ul>
                </div>
                <div class="glide__arrows" data-glide-el="controls">
                  <button class="glide__arrow glide__arrow--left circle" data-glide-dir="<"> < </button>
                  <button class="glide__arrow glide__arrow--right circle" data-glide-dir=">"> > </button>
                </div>
              </div>`; 
      images += script; 

  } 
  console.log('images in render', images); 
  let html = `<div${id} ${cssClasses}>
                <div class="gallery" data-columns="${blockData.config.columns}">
                  ${images}
                </div>
              </div>`;
  return html;
};
module.exports = render;

// function render (blockData) {
//   let id = blockData.config.advanced.id ? ' id="' + blockData.config.advanced.id + '"' : '';
//   let cssClasses = ['gallery-wrapper', blockData.config.advanced.cssClasses, 'gallery-wrapper--' + blockData.config.imageAlign].filter(item => item && item.trim() !== '' && item !== 'gallery-wrapper--center');
//   console.log('class',cssClasses );
//   cssClasses = cssClasses.length ? ' class="' + cssClasses.join(' ') + '"' : '';
//   let images = "";
//   console.log('css', cssClasses);
//   console.log('blockData.content', blockData.content);
//   console.log("display:",blockData.config.display );
//   if(blockData.config.display === 'slide') {
//     images += `<div class="slider glide">
//                   <div class="glide__track" data-glide-el="track">
//                     <ul class="glide__slides">`;
//   }
  

//   for (let i = 0; i < blockData.content.images.length; i++) {
//       let img = blockData.content.images[i];
//       let caption = '';

//       if (img.caption.trim() !== '') {
//           caption = `<figcaption>${img.caption}</figcaption>`
//       }

//       if (blockData.config.display !== 'slide') {
//         images += `<figure class="gallery__item">
//                         <a href="${img.src}" data-size="${img.dimensions}">
//                           <img src="${img.thumbnailSrc}" height="${img.height}" width="${img.width}" alt="${img.alt}">
//                         </a>
//                         ${caption}
//                    </figure>`;
//       } else {
//         images += `<li class="publii-block-gallery-item glide__slide">
//                       <a href="${img.src}" data-size="${img.dimensions}">
//                         <img src="${img.thumbnailSrc}" height="${img.height}" width="${img.width}" alt="${img.alt}">
//                       </a>
//                   </li>`;
//       }
//     }
// if(blockData.config.display === 'slide') {
//   images += `</ul>
//           </div>
//           <div class="glide__arrows" data-glide-el="controls">
//             <button class="glide__arrow glide__arrow--left circle" data-glide-dir="<"> < </button>
//             <button class="glide__arrow glide__arrow--right circle" data-glide-dir=">"> > </button>
//           </div>
//         </div>`;
//   images += `<script>new Glide('.glide').mount();</script>`;
// }
// console.log('images in render', images);
// let html = `
//   <div${id} ${cssClasses}>
//     <div class="gallery" data-columns="${blockData.config.columns}">
//       ${images}
//     </div>
//   </div>
// `;
// return html;
// };

// module.exports = render;