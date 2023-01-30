// Default config
const defaultAstCurrentSiteConfig = require('../../../../../../config/AST.currentSite.config');
const { advanced } = require('../../../../../../config/AST.currentSite.config');
const UtilsHelper = require('../../../../../../back-end/helpers/utils');
const URLHelper = require('../../../../../../back-end/modules/render-html/helpers/url');
const path = require('path');
const fs = require('fs');
const pourcent = (columns, max) =>  (max < columns) ? parseFloat(100/max).toFixed(2) : parseFloat(100/columns).toFixed(2) ;
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
  const col = (blockData.content.images.length < parseInt(blockData.config.columns)) ? blockData.content.images.length : parseInt(blockData.config.columns);
  let p = pourcent(parseInt(blockData.config.columns), blockData.content.images.length);
  let images = ``;
  
  for (let i = 0; i < blockData.content.images.length; i++) {
    let img = blockData.content.images[i];
    const href = (blockData.config.isLink) ? `href="${getHrefFromLink(img)}"` : ``;
    console.log('isLink',blockData.config.isLink);
    console.log('href', href);
    const circular = (blockData.config.isCircle) ? " circular" : "";
    const inside = (blockData.config.isInside) ? "internal" : "external";
    const inline = (blockData.config.isCircle) ? {height: img.height} : "";
    const icon = (blockData.config.isIcon) ? "icon" : "";
    const bg = {backgroundColor: blockData.config.bgColor};
    const sub = (img.subtitle && img.subtitle !== "") ? `<h6  class="card-subtitle ${inside}" style="color: ${blockData.config.titleColor}">${img.subtitle}</h6>` : ``;
    console.log("bg", bg);
    const aspectRatio = (blockData.config.aspectRatio && (blockData.config.aspectRatio === 'Circle' || blockData.config.aspectRatio === 'Square')) ? 1 : blockData.config.aspectRatio;
    images += `<figure class="cards__item ${inside} col${col}" >
      <a class="card_link ${inside}" :class="${inline}" ${href} data-size="${img.dimensions}" style="background-color: ${blockData.config.bgColor}">
        <div class="card_wrapper ${circular} ${icon}" :style="{ height: ${img.height}, overflow: 'hidden', aspectRatio: ${aspectRatio}}">
          <img 
            class="card_image ${inside} ${circular} ${icon}"
            {{#if @config.site.responsiveImages && !blockData.config.isIcon }}
                {{responsiveImageAttributes 'tagImage' srcset.cards sizes.cards}}
            {{/if}}
            {{ lazyload "eager" }}
            src="${img.thumbnailSrc}" 
            height="${img.height}" 
            width="${img.width}" 
            alt="${img.alt}" />
        </div>
        <h3 class="card-title ${inside}" style="color: ${blockData.config.titleColor}">${img.title}</h3>
        ${sub}
        <figcaption class="card-caption ${inside}" style="color: ${blockData.config.titleColor}">${img.caption}</figcaption>
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
