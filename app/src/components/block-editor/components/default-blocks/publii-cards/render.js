const pourcent = (columns) => parseFloat(100/columns).toFixed(2);

function render (blockData) {
  let id = blockData.config.advanced.id ? ' id="' + blockData.config.advanced.id + '"' : '';
  let cssClasses = ['cards-wrapper', blockData.config.advanced.cssClasses, 'cards-wrapper--' + blockData.config.imageAlign].filter(item => item && item.trim() !== '' && item !== 'cards-wrapper--center');
  cssClasses = cssClasses.length ? ' class="' + cssClasses.join(' ') + '"' : '';
  let p = pourcent(parseInt(blockData.config.columns));
  let images = ``;
  
  for (let i = 0; i < blockData.content.images.length; i++) {
    let img = blockData.content.images[i];

    images += `<figure class="cards__item" :style="{width: ${p}%}" >
      <a class="card_link" href="${img.target}" data-size="${img.dimensions}">
        <img 
          class="card_image" 
          {{#if @config.site.responsiveImages}}
              {{responsiveImageAttributes 'tagImage' srcset.cards sizes.cards}}
          {{/if}}
          {{ lazyload "eager" }}
          src="${img.thumbnailSrc}" 
          height="${img.height}" 
          width="${img.width}" 
          alt="${img.alt}" />
        <h3 class="card-title">${img.title}</h3>
        <figcaption class="card-caption">{{${img.caption}}}</figcaption>
        <p>Type: {{${img.type}}}</p>
        <p>internalLink: {{${img.internalLink}}}</p>
        <p>externalLink: {{${img.externalLink}}}</p>
        <p>postPage: {{${img.postPage}}}</p>
        <p>tagPage: {{${img.tagPage}}}</p>
        <p>authorPage: {{${img.authorPage}}}</p>
        <p>target: {{${img.target}}}</p>
      </a>
    </figure>`;
  }

  let html = `
  <div ${id}${cssClasses}>
    <div class="cards" data-columns="${blockData.config.columns}">
      ${images}
    </div>
  </div>`;

  return html;
};

module.exports = render;
