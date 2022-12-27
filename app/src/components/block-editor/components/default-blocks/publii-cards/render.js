// Default config
const defaultAstCurrentSiteConfig = require('../../../../../../config/AST.currentSite.config');
const { advanced } = require('../../../../../../config/AST.currentSite.config');
const UtilsHelper = require('../../../../../../back-end/helpers/utils');
const URLHelper = require('../../../../../../back-end/modules/render-html/helpers/url');
const path = require('path');
const fs = require('fs');
const pourcent = (columns) => parseFloat(100/columns).toFixed(2);
let defaultSiteConfig = JSON.parse(JSON.stringify(defaultAstCurrentSiteConfig));
// Site config
let inputDir = "";
let configPath = path.join(inputDir, 'site.config.json');
let siteConfig = JSON.parse(fs.readFileSync(configPath));
const previewURL = siteConfig.advanced.preview;
siteConfig = UtilsHelper.mergeObjects(defaultSiteConfig, siteConfig);
let preview = (render.previewMode === true) ? true: false;
const getHrefFromLink = (img) => {
  let href='';
  siteConfig.domain = (preview) ? previewURL : siteConfig.domain; 
  let endUrl = (preview) ? "/index.html" :"";
  //console.log("menuURLHelper", new menuURLHelper({type: img.type}))
  //let test = URLHelper.createPaginationPermalink(siteConfig.domain, siteConfig.advanced.urls, nextPage, 'home', false, addIndexHtml);
  switch(img.type) {
    case 'post':
    return URLHelper.createPaginationPermalink(siteConfig.domain, img.postPage);
    break;
    //case 'tags':
    //href=URLHelper.createTagPermalink(siteConfig.domain, img.internalLink);
    //break;
    case 'tag':
    return siteConfig.domain+"/"+img.internalLink+endUrl;
    break;
    case 'internal':
    return siteConfig.domain+"/"+img.internalLink+endUrl;
    break;
    case 'external':
    return img.externalLink;
    break;
    case 'frontpage':
    href='/';
    break;
    default:
    href='/';
    break;
  }
  return href;
}
function render (blockData) {
  let id = blockData.config.advanced.id ? ' id="' + blockData.config.advanced.id + '"' : '';
  let cssClasses = ['cards-wrapper', blockData.config.advanced.cssClasses, 'cards-wrapper--' + blockData.config.imageAlign].filter(item => item && item.trim() !== '' && item !== 'cards-wrapper--center');
  cssClasses = cssClasses.length ? ' class="' + cssClasses.join(' ') + '"' : '';
  let p = pourcent(parseInt(blockData.config.columns));
  let images = ``;
  
  for (let i = 0; i < blockData.content.images.length; i++) {
    let img = blockData.content.images[i];
    const href = getHrefFromLink(img);
    images += `<figure class="cards__item" :style="{width: ${p}%}" >
      <a class="card_link" href="${href}" data-size="${img.dimensions}">
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
