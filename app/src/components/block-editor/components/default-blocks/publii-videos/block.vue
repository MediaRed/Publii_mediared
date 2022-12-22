<template>
  <div
    :class="{ 'publii-block-videos-wrapper': true, 'is-empty': isEmpty }"
    @dragover.stop.prevent="dragOver"
    @dragleave.stop.prevent="dragLeave"
    @drop.stop.prevent="drop">
    <draggable
      v-if="content.videos.length > 0 && view === 'preview'"
      ref="block"
      v-model="content.videos"
      handle="img"
      :data-cols="config.columns"
      :data-count="content.videos.length"
      @start="draggingInProgress = true"
      @end="draggingInProgress = false"
      :class="{ 'publii-block-videos': true, 'is-wide': config.imageAlign === 'wide', 'is-full': config.imageAlign === 'full' }">
      <div
        v-for="(video, index) of content.videos"
        :key="'video-item-' + index"
        class="publii-block-videos-item"
        @click="navigate(video)"
        >
        <h3 class="video-title">{{video.title}}</h3>
        <figcaption class="video-caption">{{video.caption}}</figcaption>
        <button
          class="publii-block-videos-item-delete"
          @click.stop.prevent="removeVideo(index)">
          <icon name="trash" />
        </button>
      </div>
    </draggable>

    <draggable
      v-if="content.videos.length > 0 && view === 'edit'"
      v-model="content.videos"
      :data-cols="config.columns"
      :data-count="content.videos.length"
      @start="draggingInProgress = true"
      @end="draggingInProgress = false"
      class="publii-block-videos-list">
      <div
        v-for="(video, index) of content.videos"
        :key="'video-item-' + index"
        class="publii-block-video" >
         ${video.url}
      </div>
    </draggable>

    <div
      v-if="content.videos.length === 0 && editor.bulkOperationsMode && view === 'preview'"
      class="publii-block-videos-empty-state">
      {{ $t('editor.emptyvideoBlock') }}
    </div>

    <div
      v-if="(content.videos.length === 0 || view === 'edit') && !editor.bulkOperationsMode"
      :class="{ 'publii-block-videos-form': true, 'is-visible': content.videos.length === 0 }"
      ref="block">
      <div
        :class="{ 'publii-block-videos-uploader': true, 'is-hovered': isHovered }">
        <div class="publii-block-videos-uploader-inner">
          <icon
            v-if="!imageUploadInProgress"
            name="blank-video"
            height="66"
            width="125" />
          <label key="video-item-editor-field-url">
                <span>{{ $t('link.linkRelAttribute') }}:</span>
                <input
                    v-model="video.url"
                    spellcheck="false"
                    type="text" />
            </label>
          <span v-if="!imageUploadInProgress">
            {{ $t('editor.dropToUploadYourVideosOr') }}
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
      class="publii-block-videos-uploader-loader-overlay">
      <span class="publii-block-videos-uploader-loader"></span>
    </div>

    <top-menu
      ref="top-menu"
      :config="topMenuConfig"
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

export default {
  name: 'Pvideos',
  mixins: [
    Block,
    ContentEditableImprovements
  ],
  components: {
    'icon': EditorIcon,
    'top-menu': TopMenuUI,
    'draggable': Draggable
  },
  watch: {
    '$parent.uiOpened': function (newValue) {
      if (!this.content.videos.length) {
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
      video: {
        url: "https://youtube.com/"
      },
      draggingInProgress: false,
      isHovered: false,
      imageUploadInProgress: false,
      videosQueue: [],
      imageUploader: null,
      view: 'preview',
      config: {
        imageAlign: 'center',
        columns: 3,
        advanced: {
          cssClasses: this.getAdvancedConfigDefaultValue('cssClasses'),
          id: this.getAdvancedConfigDefaultValue('id')
        }
      },
      content: {
        videos: []
      },
      linkEditorConfig: [
        {
          type: 'select',
          label: this.$t('video.columns'),
          configKey: 'columns',
          clearable: false,
          searchable: false,
          cssClasses: 'is-narrow',
          options: [1, 2, 3, 4, 5, 6, 7, 8]
        },
        {
          activeState: function () { return this.config.imageAlign === 'center'; },
          onClick: function () { this.alignVideo('center'); },
          icon: 'center',
          tooltip: this.$t('video.centeredVideo')
        },
        {
          activeState: function () { return this.config.imageAlign === 'wide'; },
          onClick: function () { this.alignVideo('wide'); },
          icon: 'wide',
          tooltip: this.$t('video.wideVideo')
        },
        {
          activeState: function () { return this.config.imageAlign === 'full'; },
          onClick: function () { this.alignVideo('full'); },
          icon: 'full',
          tooltip: this.$t('video.fullWidthVideo')
        }
      ],
      topMenuConfig: [
        {
          type: 'select',
          label: this.$t('video.columns'),
          configKey: 'columns',
          clearable: false,
          searchable: false,
          cssClasses: 'is-narrow',
          options: [1, 2, 3, 4, 5, 6, 7, 8]
        },
        {
          activeState: function () { return this.config.imageAlign === 'center'; },
          onClick: function () { this.alignVideo('center'); },
          icon: 'center',
          tooltip: this.$t('video.centeredVideo')
        },
        {
          activeState: function () { return this.config.imageAlign === 'wide'; },
          onClick: function () { this.alignVideo('wide'); },
          icon: 'wide',
          tooltip: this.$t('video.wideVideo')
        },
        {
          activeState: function () { return this.config.imageAlign === 'full'; },
          onClick: function () { this.alignVideo('full'); },
          icon: 'full',
          tooltip: this.$t('video.fullWidthVideo')
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
        this.videosQueue = [];

        for (let i = 0; i < files.length; i++) {
        this.videosQueue.push(files[i].path);
        }

        this.imageUploadInProgress = true;
        this.$parent.$el.setAttribute('style', 'height: ' + this.$parent.$el.clientHeight + 'px; overflow: hidden;');
        this.uploadVideo();
      }

      this.isHovered = false;
    },
    initFakeFilePicker () {
      this.imageUploader = document.getElementById('post-editor-fake-multiple-videos-uploader');
      this.imageUploader.addEventListener('change', () => {
        if (!this.imageUploader.value) {
          return;
        }

        setTimeout(() => {
          if (!this.fileSelectionCallback) {
            return;
          }

          if (this.imageUploader.files) {
            this.videosQueue = [];

            for (let i = 0; i < this.imageUploader.files.length; i++) {
              this.videosQueue.push(this.imageUploader.files[i].path);
            }
          } else {
            return;
          }

          this.imageUploadInProgress = true;
          this.$parent.$el.setAttribute('style', 'height: ' + this.$parent.$el.clientHeight + 'px; overflow: hidden;');
          this.uploadVideo();
        }, 50);
      });
    },
    uploadVideo () {
      let filePath = this.videosQueue.shift();

      // eslint-disable-next-line
      mainProcessAPI.send('app-Video-upload', {
        id: this.editor.config.postID,
        site: window.app.getSiteName(),
        path: filePath,
        VideoType: 'cardvideos'
      });

      // eslint-disable-next-line
      mainProcessAPI.receiveOnce('app-Video-uploaded', (data) => {
        let thumbnailSrc = data.thumbnailDimensions ? data.thumbnailPath[0] : data.thumbnailPath;
        let sizeWidth = data.baseVideo.size[0] || '';
        let sizeHeight = data.baseVideo.size[1] || '';

        this.content.videos.push({
          src: data.baseVideo.url,
          thumbnailSrc: thumbnailSrc,
          height: data.thumbnailDimensions ? data.thumbnailDimensions.height : sizeHeight,
          width: data.thumbnailDimensions ? data.thumbnailDimensions.width : sizeWidth,
          dimensions: data.baseVideo.size.join('x'),
          alt: '',
          caption: ''
        });

        if (this.videosQueue.length) {
          this.uploadVideo();
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
      document.getElementById('post-editor-fake-multiple-videos-uploader').click();
    },
    alignVideo (newValue) {
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
    removeVideo (index) {
      this.content.videos.splice(index, 1);
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


.publii-block-videos-list {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
}
.publii-block-videos-list-item , .publii-block-video-item {
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
.publii-block-videos-item {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  object-fit: cover;
  height: 30vh;
  width: 100%;
}
.publii-block-videos-item h3, .publii-block-video-title, .editor > .editor-inner > .wrapper > div h3 {
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
.publii-block-videos-item figcaption, .publii-block-videos-item-image figcaption, .editor > .editor-inner > .wrapper > div figcaption {
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
.publii-block-video-item-body {
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
.publii-block-videos-item-image {
  width: 100%;
  height: auto;
}
.publii-block-video-item-image > img {
  width: 100%;
  aspect-ratio: 16 / 9;
  height: inherit;
  object-fit: cover;
}
.publii-block-video {
  box-shadow: 0 4px 8px 0 rgba(0,0,0,0.2);
  transition: 0.3s;
  display: flex;
  flex-direction: column;
  gap: .75em;
  border-radius: 5px;
  margin-right: 1em;
  width: 100%;
}
.publii-block-video > textarea {
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
              

.publii-block-videos , .videos-wrapper{
  display: flex;
  margin: -1rem;
  outline: none;
  position: relative;
  gap: .75em;

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
      height: 30vh;
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
      .publii-block-videos-item-delete {
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
  .publii-block-videos[data-cols="#{$i}"] .publii-block-videos-item {
    flex-grow: 1;
    width: calc(100% / #{$i});
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
