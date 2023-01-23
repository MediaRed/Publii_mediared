function render (blockData) {
  let id = blockData.config.advanced.id ? ' id="' + blockData.config.advanced.id + '"' : '';
  let cssClasses = ['gallery-wrapper', blockData.config.advanced.cssClasses, 'gallery-wrapper--' + blockData.config.imageAlign].filter(item => item && item.trim() !== '' && item !== 'gallery-wrapper--center');
  cssClasses = cssClasses.length ? ' class="' + cssClasses.join(' ') + '"' : '';
  let images = "";

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
    } else {
      images += `<li class="publii-block-gallery-item glide__slide">
                    <a href="${img.src}" data-size="${img.dimensions}">
                      <img src="${img.thumbnailSrc}" height="${img.height}" width="${img.width}" alt="${img.alt}">
                    </a>
                </li>`;
    }
}
if(blockData.config.display === 'slide') {
  images += `</ul>
          </div>

          <div class="glide__arrows" data-glide-el="controls">
            <button class="glide__arrow glide__arrow--left" data-glide-dir="<">prev</button>
            <button class="glide__arrow glide__arrow--right" data-glide-dir=">">next</button>
          </div>
        </div>`;
  images += `<script>
      new Glide('.glide').mount();
    </script>`;
}
let html = `
  <div${id} class="${cssClasses}">
    <div class="gallery" data-columns="${blockData.config.columns}">
      ${images}
    </div>
  </div>
`;
return html;
};

module.exports = render;