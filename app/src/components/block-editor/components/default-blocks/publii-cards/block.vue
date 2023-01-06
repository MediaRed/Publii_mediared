<template>
 
  <div
    :class="{ 'publii-block-cards-wrapper': true, 'is-empty': isEmpty }"
    @dragover.stop.prevent="dragOver"
    @dragleave.stop.prevent="dragLeave"
    @drop.stop.prevent="drop">
    <draggable
      v-if="content.images.length > 0 && view === 'preview'"
      ref="block"
      v-model="content.images"
      handle="img"
      :data-cols="config.columns"
      :data-count="content.images.length"
      @start="draggingInProgress = true"
      @end="draggingInProgress = false"
      :class="{ 'publii-block-cards': true, 'is-wide': config.imageAlign === 'wide', 'is-full': config.imageAlign === 'full' }">
      <div
        v-for="(image, index) of content.images"
        :key="'card-item-' + index"
        class="publii-block-cards-item"
        :class="[config.isInside === true ? {circular: config.isCircle} : '']"
        :style="[config.isInside === true ? {width: (100/parseInt(config.columns) - config.columns)+'%' , backgroundRepeat: no-repeat, backgroundColor: '${config.bgColor}',backgroundImage: `url(${image.src})` , aspectRatio: config.aspectRatio} : {width: (100/parseInt(config.columns) - config.columns)+'%', aspectRatio: config.aspectRatio}]"
        @click="navigate(image)"
        >
        <img
          v-if="config.isInside === false"
            :key="'card-image-' + index"
            :src="image.src"
            :height="image.height"
            :width="image.width" 
            :class="{circular: config.isCircle}" />
        <h3  v-if="image.title" class="card-title" :style="{color: '${config.titleColor}'}">{{image.title}}</h3>
        <h6  v-if="config.isInside === false || !config.isInside" class="card-subtitle" :style="{color: '${config.titleColor}'}">{{image.subtitle}}</h6>
        <figcaption v-if="image.caption" class="card-caption" :style="{color: '${config.titleColor}'}">{{image.caption}}</figcaption>
        <button
          class="publii-block-cards-item-delete"
          @click.stop.prevent="removeImage(index)">
          <icon name="trash" />
        </button>
      </div>
    </draggable>

    <draggable
      v-if="content.images.length > 0 && view === 'edit'"
      v-model="content.images"
      :data-cols="config.columns"
      :data-count="content.images.length"
      @start="draggingInProgress = true"
      @end="draggingInProgress = false"
      class="publii-block-cards-list">
      <div
        v-for="(image, index) of content.images"
        :key="'card-item-' + index"
        class="publii-block-card" :style="{width: (100/parseInt(config.columns)-parseInt(config.columns))+'%'}">
          <card-link-editor
            ref="card-link-editor"
            v-bind:image="image"
            v-bind:cardConfig="config"
            :config="linkEditorConfig"
            :advancedConfig="configForm" />
      </div>
    </draggable>

    <div
      v-if="content.images.length === 0 && editor.bulkOperationsMode && view === 'preview'"
      class="publii-block-cards-empty-state">
      {{ $t('editor.emptycardBlock') }}
    </div>

    <div
      v-if="(content.images.length === 0 || view === 'edit') && !editor.bulkOperationsMode"
      :class="{ 'publii-block-cards-form': true, 'is-visible': content.images.length === 0 }"
      ref="block">
      <div
        :class="{ 'publii-block-cards-uploader': true, 'is-hovered': isHovered }">
        <div class="publii-block-cards-uploader-inner">
          <icon
            v-if="!imageUploadInProgress"
            name="blank-card"
            height="66"
            width="125" />
          <span v-if="!imageUploadInProgress">
            {{ $t('editor.dropToUploadYourPhotosOr') }}
          </span>
          <button
            v-if="!imageUploadInProgress"
            @click="filePickerCallback">
            {{ $t('editor.selectFiles') }}
          </button>
        </div>
      </div>
    </div>

    <div
      v-if="imageUploadInProgress"
      class="publii-block-cards-uploader-loader-overlay">
      <span class="publii-block-cards-uploader-loader"></span>
    </div>

    <div>isCircle : {{config.isCircle}}</div>
    <div>isLink : {{config.isLink}}</div>
    <div>isInside : {{config.isInside}}</div>
    <div>Aspect ratio : {{config.aspectRatio}}</div>
    <div>Bg color : {{config.bgColor}}</div>
    <div>Title color : {{config.titleColor}}</div>
    <div>Text shadow color : {{config.shadowColor}}</div>
    <top-menu
      ref="top-menu"
      :config="linkEditorConfig"
      :advancedConfig="configForm" />
  </div>
</template>

<script>
import Draggable from 'vuedraggable';
import Block from './../../Block.vue';
import ConfigForm from './config-form.json';
import ContentEditableImprovements from './../../helpers/ContentEditableImprovements.vue';
import EditorIcon from './../../elements/EditorIcon.vue';
import TopMenuUI from './../../helpers/TopMenuUI.vue';
import Utils from './../../utils/Utils.js';
import CardLinkEditor from '../../../../CardLinkEditor.vue';

export default {
  name: 'PCards',
  mixins: [
    Block,
    ContentEditableImprovements
  ],
  components: {
    'icon': EditorIcon,
    'top-menu': TopMenuUI,
    'draggable': Draggable,
    'card-link-editor': CardLinkEditor
  },
  watch: {
    '$parent.uiOpened': function (newValue) {
      if (!this.content.images.length) {
        return;
      }

      if (newValue) {
        this.view = 'edit';
      } else {
        this.view = 'preview';
      }
    }
  },
  data () {
    return {
      draggingInProgress: false,
      isHovered: false,
      imageUploadInProgress: false,
      imagesQueue: [],
      imageUploader: null,
      view: 'preview',
      config: {
        imageAlign: 'center',
        columns: 3,
        isCircle: false,
        isInside: false,
        isLink: false,
        aspectRatio: "16/9",
        advanced: {
          cssClasses: this.getAdvancedConfigDefaultValue('cssClasses'),
          id: this.getAdvancedConfigDefaultValue('id')
        }
      },
      content: {
        images: []
      },
      linkEditorConfig: [
        {
          type: 'select',
          label: this.$t('image.columns'),
          configKey: 'columns',
          clearable: false,
          searchable: false,
          cssClasses: 'is-narrow',
          options: [1, 2, 3, 4, 5, 6, 7, 8]
        },
        {
          activeState: function () { return this.config.setColors === this.value; },
          onClick: function () { this.config.setColors === this.value },
          type: 'switch',
          label: this.$t('card.setColors'),
          configKey: 'setColors',
          clearable: false,
          searchable: false,
          cssClasses: 'is-narrow',
        },
        {
          activeState: function () { return this.config.bgColor === this.value; },
          onClick: function () { this.config.bgColor === this.value },
          type: 'color',
          label: this.$t('image.bgColor'),
          configKey: 'bgColor',
          clearable: false,
          searchable: false,
          cssClasses: 'is-narrow',
        },
        {
          activeState: function () { return this.config.titleColor === this.value; },
          onClick: function () { this.config.titleColor === this.value },
          type: 'color',
          label: this.$t('image.titleColor'),
          configKey: 'titleColor',
          clearable: false,
          searchable: false,
          cssClasses: 'is-narrow',
        },
        {
          activeState: function () { return this.config.shadowColor === this.value; },
          onClick: function () { this.config.shadowColor === this.value },
          type: 'color',
          label: this.$t('image.shadowColor'),
          configKey: 'shadowColor',
          clearable: false,
          searchable: false,
          cssClasses: 'is-narrow',
        },
        {
          activeState: function () { return this.config.setImage === this.value; },
          onClick: function () { this.config.setImage === this.value },
          type: 'switch',
          label: this.$t('card.setImages'),
          configKey: 'setImages',
          clearable: false,
          searchable: false,
          cssClasses: 'is-narrow',
        },
       
        
        {
          activeState: function () { return this.config.aspectRatio === this.value; },
          onClick: function () { this.config.aspectRatio === this.value },
          type: 'select',
          label: this.$t('image.aspect-ratio'),
          configKey: 'aspectRatio',
          clearable: false,
          searchable: false,
          cssClasses: 'is-narrow',
          options: [`unset`,'21 / 9', '16 / 9', '4 / 3', 'Square', 'Circle', 'Custom']
        },
        {
          activeState: function () { return this.config.aspectRatio === this.value; },
          onClick: function () { this.config.aspectRatio === this.value },
          type: 'input',
          label: this.$t('image.aspect-ratio'),
          configKey: 'aspectRatio',
          clearable: false,
          searchable: false,
          cssClasses: 'is-narrow',
        },
        {
          activeState: function () { return this.config.isCircle === this.value; },
          onClick: function () { this.config.isCircle === this.value },
          type: 'switch',
          label: this.$t('image.isCircle'),
          configKey: 'isCircle',
          clearable: false,
          searchable: false,
          cssClasses: 'is-narrow',
        },
        {
          activeState: function () { return this.config.isInside === this.value; },
          onClick: function () { this.config.isInside === this.value },
          type: 'switch',
          label: this.$t('image.isInside'),
          configKey: 'isInside',
          clearable: false,
          searchable: false,
          cssClasses: 'is-narrow',
        },
        {
          activeState: function () { return this.config.isLink === this.value; },
          onClick: function () { this.config.isLink === this.value },
          type: 'switch',
          label: this.$t('image.isLink'),
          configKey: 'isLink',
          clearable: false,
          searchable: false,
          cssClasses: 'is-narrow',
          value: this.isLink
        },
        {
          activeState: function () { return this.config.aspectRatio === this.value; },
          onClick: function () { this.config.aspectRatio === this.value },
          type: 'input',
          label: this.$t('image.aspect-ratio'),
          configKey: 'aspectRatio',
          clearable: false,
          searchable: false,
          cssClasses: 'is-narrow',
          value: this.aspectRatio
        },
        {
          activeState: function () { return this.config.imageAlign === 'center'; },
          onClick: function () { this.alignImage('center'); },
          icon: 'center',
          tooltip: this.$t('image.centeredImage')
        },
        {
          activeState: function () { return this.config.imageAlign === 'wide'; },
          onClick: function () { this.alignImage('wide'); },
          icon: 'wide',
          tooltip: this.$t('image.wideImage')
        },
        {
          activeState: function () { return this.config.imageAlign === 'full'; },
          onClick: function () { this.alignImage('full'); },
          icon: 'full',
          tooltip: this.$t('image.fullWidthImage')
        }
      ]
    }
  },
  computed: {
    isInsidePublii () {
      return !!window.process;
    }
  },
  beforeCreate () {
    this.configForm = ConfigForm;
  },
  mounted () {
    this.content = Utils.deepMerge(this.content, this.inputContent);
    this.initFakeFilePicker();
    this.setParentCssClasses(this.config.imageAlign);
  },
  methods: {
    dragOver (e) {
      this.isHovered = true;
    },
    dragLeave (e) {
      this.isHovered = false;
    },
    drop (e) {
      let files = e.dataTransfer.files;

      if (!files[0] || !files[0].path) {
        this.imageUploadInProgress = false;
      } else {
        this.imagesQueue = [];

        for (let i = 0; i < files.length; i++) {
        this.imagesQueue.push(files[i].path);
        }

        this.imageUploadInProgress = true;
        this.$parent.$el.setAttribute('style', 'height: ' + this.$parent.$el.clientHeight + 'px; overflow: hidden;');
        this.uploadImage();
      }

      this.isHovered = false;
    },
    initFakeFilePicker () {
      this.imageUploader = document.getElementById('post-editor-fake-multiple-images-uploader');
      this.imageUploader.addEventListener('change', () => {
        if (!this.imageUploader.value) {
          return;
        }

        setTimeout(() => {
          if (!this.fileSelectionCallback) {
            return;
          }

          if (this.imageUploader.files) {
            this.imagesQueue = [];

            for (let i = 0; i < this.imageUploader.files.length; i++) {
              this.imagesQueue.push(this.imageUploader.files[i].path);
            }
          } else {
            return;
          }

          this.imageUploadInProgress = true;
          this.$parent.$el.setAttribute('style', 'height: ' + this.$parent.$el.clientHeight + 'px; overflow: hidden;');
          this.uploadImage();
        }, 50);
      });
    },
    uploadImage () {
      let filePath = this.imagesQueue.shift();

      // eslint-disable-next-line
      mainProcessAPI.send('app-image-upload', {
        id: this.editor.config.postID,
        site: window.app.getSiteName(),
        path: filePath,
        imageType: 'cardImages'
      });

      // eslint-disable-next-line
      mainProcessAPI.receiveOnce('app-image-uploaded', (data) => {
        let thumbnailSrc = data.thumbnailDimensions ? data.thumbnailPath[0] : data.thumbnailPath;
        let sizeWidth = data.baseImage.size[0] || '';
        let sizeHeight = data.baseImage.size[1] || '';

        this.content.images.push({
          src: data.baseImage.url,
          thumbnailSrc: thumbnailSrc,
          height: data.thumbnailDimensions ? data.thumbnailDimensions.height : sizeHeight,
          width: data.thumbnailDimensions ? data.thumbnailDimensions.width : sizeWidth,
          dimensions: data.baseImage.size.join('x'),
          alt: '',
          caption: ''
        });

        if (this.imagesQueue.length) {
          this.uploadImage();
        } else {
          this.$parent.$el.removeAttribute('style');
          this.fileSelectionCallback = false;
          this.imageUploadInProgress = false;
          this.imageUploader.value = '';
          this.$parent.openPopup();
        }
      });
    },
    filePickerCallback () {
      this.fileSelectionCallback = true;
      document.getElementById('post-editor-fake-multiple-images-uploader').click();
    },
    alignImage (newValue) {
      this.config.imageAlign = newValue;
      this.setParentCssClasses(newValue);
    },
    setParentCssClasses (imageMode) {
      if (imageMode === 'full') {
        this.$parent.addCustomCssClass('contains-full-image');
      } else {
        this.$parent.removeCustomCssClass('contains-full-image');
      }

      if (imageMode === 'wide') {
        this.$parent.addCustomCssClass('contains-wide-image');
      } else {
        this.$parent.removeCustomCssClass('contains-wide-image');
      }
    },
    removeImage (index) {
      this.content.images.splice(index, 1);
    },
    save () {
      this.$bus.$emit('block-editor-save-block', {
        id: this.id,
        config: JSON.parse(JSON.stringify(this.config)),
        content: JSON.parse(JSON.stringify(this.content))
      });
    }
  },
  beforeDestroy () {
    this.$bus.$off('block-editor-save-link-popup', this.setLink);
  }
}
</script>

<style lang="scss">
@import '../../../../../scss/vendor/modularscale';

@import '../../../../../scss/variables.scss';
@import '../../../../../scss/mixins.scss';

.circular {
    aspect-ratio: 1;
    border-radius: 50%;
    max-height: inherit;
    width: fit-content;
}
.placeholder {
  font-size: .5em;
  display: flex;
  width: max-content;
}
.wrapper-ui-top-menu .multiselect__tags {
  min-width: 10rem;
}
.wrapper-ui-top-menu .multiselect__tags > span.multiselect__single {
  display: inline;
  min-width: 10rem;
}
.multiselect__content-wrapper > ul.multiselect__content , .editor > .editor-inner > .wrapper > div ul, .editor > .editor-inner > .wrapper > div ol {
  padding: 0 !important;
}
.publii-block-cards-list {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
}
.publii-block-cards-list-item , .publii-block-card-item {
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  margin: -1rem;
  outline: none;
  position: relative;
  background: var(--color-secondary);
  color: var(--color-headers);
  font-family: var(--font-base);
  font-size: 14px;
  text-align: left;
}
.publii-block-cards-item {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  object-fit: cover;
  height: inherit;
  width: 100%;
}
.publii-block-cards-item h3, .publii-block-card-title, .editor > .editor-inner > .wrapper > div h3 {
    z-index: 100;
    color: #FFF;
    text-align: center;
    width: 100%;
    text-shadow: 0px 11px 10px rgba(81,67,21,0.8);
    text-shadow: 0 1px 2px #75b663,
     1px 3px 1px #5ea04b, 
    2px 5px 1px #5b9c49, 
    4px 7px 1px #518b41, 
    6px 9px 1px #477939,
    '-moz-transform: scaleY(-1)';
}
.publii-block-cards-item figcaption, .publii-block-cards-item-image figcaption, .editor > .editor-inner > .wrapper > div figcaption {
    text-align: center;
    width: 100%;
    z-index: 100;
    color: #FFF;
    text-shadow: 0px 11px 10px rgba(81,67,21,0.8);
    text-shadow: 0 1px 2px #75b663,
     1px 3px 1px #5ea04b, 
    2px 5px 1px #5b9c49, 
    4px 7px 1px #518b41, 
    6px 9px 1px #477939,
    '-moz-transform: scaleY(-1)';
}
.publii-block-card-item-body {
  display: flex;
  flex-wrap: wrap;
  margin: -1rem;
  outline: none;
  position: relative;
  background: var(--input-bg);
  color: var(--text-primary-color);
  font-family: var(--font-base);
  font-size: 14px;
  text-align: left;
}
.publii-block-cards-item-image {
  width: 100%;
  height: auto;
}
.publii-block-card-item-image.circular {
  flex-direction: column;
  width: fit-content;
}
.publii-block-card-item-image > img {
  height: inherit;
  object-fit: cover;
}
.publii-block-card-item-image > img.circular {
  height: inherit;
  aspect-ratio: 1;
}
.publii-block-card {
  box-shadow: 0 4px 8px 0 rgba(0,0,0,0.2);
  transition: 0.3s;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  gap: .75em;
  border-radius: 5px;
  padding-bottom: 3rem;
  margin-bottom: 3rem;
  margin-right: 1em;
}
.publii-block-card > textarea {
  background: var(--input-bg);
  color: var(--text-primary-color);
  font-size: 1.5rem;
  font-family: var(--font-base);
  font-weight: 400;
  padding: 1.2rem 1.8rem;
}
.threecol {
  width: 30%;
}
.twocol {
  width: 47%;
}
.onecol {
  width: 100%;
}
.onecolcol :nth-child(1n) {
// Styling for every third element here.
  margin-right: 0;
}
.twocol :nth-child(2n) {
// Styling for every third element here.
  margin-right: 0;
}
.threecol :nth-child(3n) {
// Styling for every third element here.
  margin-right: 0;
}
              

.publii-block-cards , .cards-wrapper{
  display: flex;
  margin: -1rem;
  outline: none;
  position: relative;
  gap: .75em;
  flex-wrap: wrap;

  &-empty-state {
    color: var(--gray-3);
    font-family: var(--font-base);
    font-size: 14px;
    text-align: center;
  }

  &-item {
    cursor: move;
    padding: 1rem;
    position: relative;
    width: calc(100% / 3);

    & > img {
      display: block;
      height: auto;
      max-width: 100%;
      object-fit: cover;
      width: 100%;
    }

    &-delete {
      align-items: center;
      background: var(--warning);
      border: none;
      border-radius: var(--border-radius);
      cursor: pointer;
      display: flex;
      height: 34px;
      justify-content: center;
      left: 20px;
      opacity: 0;
      pointer-events: none;
      position: absolute;
      top: 20px;
      transition: var(--transition);
      width: 34px;
      z-index: 2;

      svg {
        fill: var(--white);
      }

      &:active,
      &:focus,
      &:hover {
        transform: scale(1.1);
      }
    }

    &:hover {
      .publii-block-cards-item-delete {
        opacity: 1;
        pointer-events: auto;
      }
    }
  }

  &-uploader {
    border: 2px dashed var(--input-border-color);
    border-radius: var(--border-radius);
    height: 250px;
    margin: 0 0 16px 0;
    padding: 6px;
    position: relative;
    width: 100%;

    &.is-hovered {
      border-color: var(--color-primary);
    }

    &-loader {
      animation: loader 1s linear infinite;
      border: 3px solid var(--color-primary);
      border-left-color: transparent;
      border-radius: 50%;
      display: block;
      height: 32px;
      left: 50%;
      position: absolute;
      top: 50%;
      transform: translateX(-50%) translateY(-50%);
      width: 32px!important;

      &-overlay {
        background: var(--bg-primary);
        border: 2px dashed var(--input-border-color);
        border-radius: var(--border-radius);
        bottom: 0;
        padding: 6px;
        position: absolute;
        left: auto;
        right: auto;
        top: 0;
        width: var(--editor-width);
        z-index: 1;

        &::after {
          content: "";
          background: var(--gray-1);
          display: block;
          height: 100%;
          width: 100%;
        }
      }
    }

   &-inner {
      align-items: center;
      display: flex;
      flex-wrap: wrap;
      font-family: var(--font-base);
      justify-content: center;
      height: 234px;
      padding: 2rem;
      width: 100%;

      svg {
        fill: var(--icon-quaternary-color);
      }

      span {
        display: block;
        font-size: $app-font-base;
        text-align: center;
        width: 100%;
      }

      button {
        background: var(--button-secondary-bg);
        border: 1px solid var(--button-secondary-bg);
        border-radius: var(--border-radius);
        color: var(--button-secondary-color);
        cursor: pointer;
        font-weight: var(--font-weight-semibold);
        font-size: 15px;
        padding: .5rem 2rem;
        text-align: center;
        outline: none;

        &:active,
        &:focus,
        &:hover {
          background: var(--button-secondary-bg-hover);
          border-color: var(--button-secondary-bg-hover);
          color: var(--button-secondary-color-hover);
        }
      }
    }
  }

  &-list {
    &-item {
      align-items: center;
      display: flex;
      margin: 2rem 0 2.5rem;

      &-image {
        height: 112px;
        margin: 0 20px 0 0;
        overflow: hidden;
        position: relative;
        width: 120px;

        img {
          height: auto;
          left: 50%;
          width: 100%;
          position: absolute;
          top: 50%;
          transform: translateX(-50%) translateY(-50%);
        }
      }

      &-config {
        width: calc(100% - 140px);
        textarea {
          display: block;
          width: inherit;
          margin: 5px;
          background: var(--input-bg);
          color: var(--text-primary-color);
          border-color: var(--grey-3);
          padding: 5px;
        };
        input {
          display: block;
          width: 100%;       

          & + input {
             margin-top: 16px;
          }
        }
      }
    }
  }
}

@for $i from 1 through 8 {
  .publii-block-cards[data-cols="#{$i}"] .publii-block-cards-item {
    flex-grow: 1;
    width: calc(100% / #{$i});
    min-height: 25vh;
  }
}

@keyframes loader {
  from {
    transform: translateX(-50%) translateY(-50%) rotate(0deg);
  }

  to {
    transform: translateX(-50%) translateY(-50%) rotate(360deg);
  }
}
</style>
