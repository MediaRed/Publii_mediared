<template>
  <div
    class="wrapper-ui-top-menu"
    v-if="isVisible"
    @click="resetDeleteConfirmation">
    <span
      v-if="conversions.length"
      class="wrapper-ui-top-menu-title wrapper-ui-top-menu-conversions">
      {{ $t('editor.convertTo') }}
      <span
        v-for="(conversion, index) of conversions"
        :key="'conversion-' + index"
        class="wrapper-ui-top-menu-conversion has-tooltip"
        @click="makeConversion(conversion.type, conversion.convert); resetDeleteConfirmation();">
        <icon :name="conversion.icon" />
        <span class="ui-top-menu-tooltip">
          {{ $t(conversion.name) }}
        </span>
      </span>
    </span>
    <div
      @click.stop
      class="wrapper-ui-top-menu-options">
      <template v-for="(uiElement, index) of filteredConfig">
        <template v-if="!uiElement.type || uiElement.type === 'button'">
          <button
            :key="'top-menu-element-' + index"
            :class="{ 'wrapper-ui-top-menu-button': true, 'is-active': uiElement.activeState.bind($parent)(), 'has-tooltip': true }"
            tabindex="-1"
            @click="uiElement.onClick.bind($parent)(); resetDeleteConfirmation();">
            <icon :name="uiElement.icon" />
            <span class="ui-top-menu-tooltip has-bigger-space">
              {{ uiElement.tooltip }}
            </span>
          </button>
        </template>
        <template v-if="uiElement.type === 'switch'">
          <div 
           v-if="$parent.config.setImages === true || ['isLink', 'isInside', 'setImages','setColors'].some(key => key === uiElement.configKey)"
           class="switch-container"
          >
            <label
                  class="switch"
                  :key="'top-menu-element-label-' + index"
                  >
                  <input
                      :key="'top-menu-element-label-input-checkbox' + index"
                      class="checkbox"
                      :class="{'checked': $parent.config[uiElement.configKey]}"
                      v-model="$parent.config[uiElement.configKey]"
                      v-on:change="updateConfig(uiElement.configKey,$event.target.value)"
                      type="checkbox" />
                  <span class="slider"></span>
                  <span class="placeholder">{{ uiElement.label }} {{ $parent.config[uiElement.configKey]  }}</span>
              </label>
          </div>
        </template>
        <template v-else-if="uiElement.type === 'select'">
          <div 
          class="label-container"
           v-if="$parent.config.setImages === true || uiElement.configKey === 'columns' || uiElement.configKey === 'display'" 
          >
            <label :key="'top-menu-element-label-' + index">
              {{ uiElement.label }}
            </label>
            <vue-select
              :key="'top-menu-element-' + index"
              :class="uiElement.cssClasses"
              :options="uiElement.options"
              :clearable="uiElement.clearable"
              :searchable="uiElement.searchable"
              @input="updateConfig(uiElement.configKey,$event)" 
              v-model="$parent.config[uiElement.configKey]" />
            </div>
        </template>
        <template v-else-if="uiElement.type === 'color'">
          <div 
          class="color-label"
           v-if="$parent.config.setColors === true"
          >
          <label :key="'top-menu-element-label-' + index">
            {{ uiElement.label }}
          </label>
          <color-picker
            class="color cards-colorpicker"
            type="colorpicker"
            :key="'top-menu-element-' + index"
            :class="uiElement.cssClasses"
            :options="uiElement.options"
            :clearable="uiElement.clearable"
            :searchable="uiElement.searchable"
            @input="updateConfig(uiElement.configKey,$event)" 
            v-model="$parent.config[uiElement.configKey]" />
          </div>
          
        </template>
        <template v-else-if="uiElement.type === 'input' && $parent.config[uiElement.configKey] && $parent.config[uiElement.configKey] === 'Custom' ">
          <div 
           v-if="$parent.config.setImages === true" 
          >
          <input
            :key="'top-menu-element-' + index"
            :class="uiElement.cssClasses"
            :options="uiElement.options"
            :clearable="uiElement.clearable"
            :searchable="uiElement.searchable"
            v-model="$parent.config['aspectRatioCustom']" />
          </div>
        </template>

      </template>
      <button
        v-if="$parent.$parent.blockType !== 'publii-readmore'"
        :class="{ 'wrapper-ui-top-menu-button': true, 'is-active': settingsAreChanged, 'has-tooltip': true }"
        tabindex="-1"
        @click.stop="showAdvancedConfig(); resetDeleteConfirmation();">
        <icon name="gear" />
        <span class="ui-top-menu-tooltip has-bigger-space">
          {{ $t('settings.advancedOptions') }}
        </span>
      </button>
      <button
        v-if="!confirmDelete"
        class="wrapper-ui-top-menu-button has-tooltip"
        tabindex="-1"
        @click.stop="deleteBlock">
        <icon name="trash" />
        <span class="ui-top-menu-tooltip has-bigger-space">
          {{ $t('editor.deleteBlock') }}
        </span>
      </button>
      <button
        v-if="confirmDelete"
        class="wrapper-ui-top-menu-button top-menu-button-trash is-active has-tooltip"
        tabindex="-1"
        @click.stop="deleteBlock">
        <icon name="open-trash" />
        <span class="ui-top-menu-tooltip has-bigger-space">
          {{ $t('editor.clickToConfirm') }}
        </span>
      </button>
    </div>
  </div>
</template>

<script>
import EditorIcon from './../elements/EditorIcon.vue';
import vSelect from 'vue-multiselect/dist/vue-multiselect.min.js';

export default {
  name: 'top-menu-ui',
  props: {
    'config': {
      type: Array,
      default: () => ([])
    },
    'advancedConfig': {
      type: [Array, Boolean],
      default: false
    },
    'conversions': {
      type: Array,
      default: () => ([])
    }
  },
  components: {
    'icon': EditorIcon,
    'vue-select': vSelect
  },
  computed: {
    filteredConfig () {
      return this.config.filter(uiElement => typeof uiElement.isVisible === 'undefined' || uiElement.isVisible());
    },
    isVisible () {
      return this.$parent.$parent.uiOpened;
    },
    toggleSetColors () {
      return this.$parent.config.setColors = (this.$parent.config.setColors === true) ? false : true;
    },
    settingsAreChanged () {
      if (!this.advancedConfig) {
        return false;
      }

      let settingsKeys = Object.keys(this.$parent.config.advanced);

      for (let i = 0; i < settingsKeys.length; i++) {
        let key = settingsKeys[i];

        if (this.advancedConfig.length && this.settingIsDisabled(key)) {
          return false;
        }

        if (this.$parent.config.advanced[key] !== this.getSettingDefaultValue(key)) {
          return true;
        }
      }

      return false;
    }
  },
  watch: {
    isVisible (newValue) {
      if (newValue) {
        this.confirmDelete = false;
      }
    }
  },
  data () {
    return {
      confirmDelete: false
    };
  },
  methods: {
    makeConversion (outputType, convertCallback) {
      let transformedData = convertCallback(this.$parent.config, this.$parent.content, this.$parent.editor, this.$parent.$refs['block']);
      this.$bus.$emit('block-editor-convert-block', this.$parent.id, outputType, transformedData);
    },
    deleteBlock () {
      if (!this.confirmDelete) {
        this.confirmDelete = true;
      } else {
        this.$bus.$emit('block-editor-delete-block', this.$parent.id);
      }
    },
    showAdvancedConfig () {
      this.$bus.$emit('block-editor-trigger-advanced-config', this.$parent.id);
    },
    resetDeleteConfirmation () {
      this.confirmDelete = false;
    },
    settingIsDisabled (fieldName) {
      let fieldDisabledRules = this.getSetting(fieldName).disabled;

      if (typeof fieldDisabledRules === 'undefined') {
        return false;
      }

      for (let rule of fieldDisabledRules) {
        if (this.$parent.config.advanced[rule.field] === rule.value) {
          return true;
        }
      }

      return false;
    },
    updateConfig (field, value) {
      // check aspect ratio if isCircle
        // set aspect ratio to 1
      if (field === "isIcon") {
        const isIcon = (this.$parent.config[field] && this.$parent.config[field] === true) ? false : true;
        console.log("##   old value", this.$parent.config[field]);
        console.log("##   isIcon", isIcon);
        if (isIcon) {
          this.$parent.config.isInside = false;
          this.$parent.config.isCircle = false;
          this.$parent.config.aspectRatio = `unset`;
        }
        //this.$parent.config[field] = isIcon;
        console.log("isIcon saved", this.$parent.config[field] )
      }
      if (field === "isCircle") {
        console.log("config", this.$parent.config);
        const active = (this.$parent.config[field] && this.$parent.config[field] === false);
        const aspectRatio = active ? 'Circle' : `unset`;
        const isCircle = active ? true : false;
        this.$parent.config["aspectRatio"] = aspectRatio;
        this.$parent.config[field] = isCircle;
        
        console.log("isCircle stored value",this.$parent.config[field] );
        console.log("aspect ratio stored value",this.$parent.config.aspectRatio )
      } 
      // check isCircle if aspet-ratio is circle
      if ( field === "aspectRatio") {
        this.$parent.config.isCircle = (value === "Circle") ? true : false;
        this.$parent.config[field] = (this.$parent.config.isCircle ) ? 'Circle' : value;
      }
      if ( field === "isLink") {
        console.log("is link");
        this.$parent.config.isLink = (this.$parent.config[field] && this.$parent.config[field] === true) ? false : true;
      }
      if ( field === "isInside") {
        this.$parent.config.isInside = (this.$parent.config[field] && this.$parent.config[field] === true) ? false : true;
      }
      if ( field === "setImages") {
        const active = (this.$parent.config[field] || this.$parent.config[field] === false);
        this.$parent.config.setImages = (active) ? true : false;
        this.$parent.config.setColors = (active) ? false : this.$parent.config.setColors;
      }
      if ( field === "setColors") {
        const active = (this.$parent.config[field] || this.$parent.config[field] === false);
        this.$parent.config.setColors = (active) ? true : false;
        this.$parent.config.setImages = (active) ? false : this.$parent.config.setImages;
      }
      console.log("field", field);
      console.log("value", value);
    },
    getSetting (fieldName) {
      let index = this.advancedConfig.findIndex(field => field.name === fieldName);
      return this.advancedConfig[index];
    },
    getSettingDefaultValue (fieldName) {
      let index = this.advancedConfig.findIndex(field => field.name === fieldName);
      return this.advancedConfig[index].defaultValue;
    }
  }
}
</script>

<style lang="scss">
@import '../../../../scss/variables.scss';



.wrapper-ui-top-menu {
  font-family: var(--font-base);
  
  svg {
    fill: var(--icon-tertiary-color);
  }

  &-conversions {
    align-items: center;
    display: flex;
  }

  &-conversion {
    display: inline-flex;
    justify-content: center;
    padding: 0;
    position: relative;
    width: 38px;

    // hover effect
    &::before {
       content: "";
       background: var(--gray-6);
       border-radius: 3px;
       display: block;
       left: 50%;
       opacity: 0;
       position: absolute;
       height: 34px;
       top: 50%;
       transition: all .15s cubic-bezier(.4,0,.2,1);
       transform: scale(.5) translate(-50%, -50%);
       transform-origin: left top;
       width: 34px;
       z-index: -1;
    }

    &:hover {
      cursor: pointer;

      &::before {
         opacity: 1;
         transform: scale(1) translate(-50%, -50%);
      }

      & > svg {
         fill: var(--icon-tertiary-color);
      }
    }
  }

  &-options {
    align-items: center;
    display: flex;

    label {
      font-size: 15px;
      padding-right: 10px;
    }
  }

  .top-menu-button-trash {
      &::before {
         background: var(--warning);
      }
         svg {
         fill: var(--white);
      }
  }
  .cards-colorpicker {
    width: 6em;
  }
  .color-input[type=colorpicker]s {
    margin: 0;
    padding: 0;
    font-size: .8em;
  }
  .switch-container , .select-container , .color-label {
    margin: 0;
    padding: 1em;
  }
  .color-label {
    padding: 0;
  }
  .switch input
  {
    display: none;
  }
  .label-container {
    padding: 0;
    margin: 0;
    display: inline-flex;
    justify-content: center;
    align-items: center;
    flex-wrap: wrap;
    
  }
  .switch 
  {
    display: inline-flex;
    width: 10rem; /*=w*/
    height: 2.5rem; /*=h*/
    margin: 0;
    margin-left: 1rem;
    margin-right: 1rem;
    position: relative;
    transform: translateY(0%); /*translateX(-(w-h))*/
    background: var(--bg-secondary);
  }
  .placeholder {
      position: inherit;
      margin-left: 1em;
      font-size: .8em;
      align-items: center;
  }
  .slider
  {
    position: relative;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    border-radius: 30px;
    width: 100%;
    box-shadow: 0 0 0 1px var(--input-border-color), 0 0 4px var(--input-border-color);
    cursor: pointer;
    border: 1px solid transparent;
    overflow: hidden;
    transition: 0.2s;
  }
  .slider:before
  {
    position: relative;
    content: "";
    width: 100%;
    height: 100%;
    background-color: var(--input-border-color);
    border-radius: 30px;
    transform: translateX(-30px); /*translateX(-(w-h))*/
    transition: 0.2s;
  }
    input:checked + .slider {
      background-color: #2196F3;
    }

    input:focus + .slider {
      box-shadow: 0 0 1px #2196F3;
    }

    input:checked + .slider:before {
      -webkit-transform: translateX(26px);
      -ms-transform: translateX(26px);
      transform: translateX(26px);
    }
  .wrapper-ui-top-menu .slider input:checked + .slider:before
  {
    transform: translateX(30px); /*translateX(w-h)*/
    background-color: limeGreen;
  }
  .wrapper-ui-top-menu .slider input:checked + .slider
  {
    box-shadow: 0 0 0 2px limeGreen, 0 0 8px limeGreen;
  }
  
  .multiselect {
    font-size: 13px;
    min-height: auto;
    margin-left: auto;
    margin-right: 6px;
    position: relative;
    top: 0;
    width: auto;

    &__tags {
      background: var(--bg-secondary);
      border: 2px solid var(--input-border-color);
      color: var(--text-primary-color);
      height: 34px;
      min-height: 100%;
      padding: 4px 40px 5px 14px;
      min-width: 34px;
    }

    &__placeholder {
      color: var(--text-light-color);
      display: block;
      font-size: $app-font-base;
      margin-bottom: 0;
      padding-top: 1px;
    }

    &__single {
      background: transparent;
      color: var(--text-primary-color);
      min-height: 20px;
      line-height: 20px;
      margin-bottom: 0;
      padding: 1px 0 0 0;
    }

    &__select {
      height: 28px;
      top: 3px;
      width: 34px;

      &::before {
          border-color: var(--gray-3) transparent transparent;
      }
    }

    &__content {
      margin-left: 0!important;
    }

    &__element {
      padding-left: 0!important;
    }

    &__content-wrapper {
      background: var(--bg-secondary);
      border: 2px solid var(--input-border-color);
      border-top: none;
      color: var(--text-primary-color);
      margin-top: -1px;
    }

    &__option {
        font-size: 14px;
        padding: 8px 15px;
        min-height: 30px;

      &--highlight {
        background: var(--input-bg-light);
        color: var(--text-primary-color);

        &:after {
          display: none;
        }
      }

      &.multiselect__option--selected {
        background: var(--gray-1);
        color: var(--text-primary-color);

        &:after {
          display: none;
        }
      }
    }

    &__input {
      background: none !important;
      color: var(--text-primary-color);
      font-size: 14px;
      height: 21px;

      &::placeholder {
        color: var(--gray-4);
      }
    }

    &.is-narrow {
      .multiselect__select {
        display: none;
      }

      .multiselect__tags {
        padding: 4px 0 6px 0;
        text-align: center;
      }

      .multiselect__option {
        min-height: 30px;
        padding: 8px 0;
        text-align: center;
      }
    }
  }
}

.ui-top-menu-tooltip {
  background: var(--input-bg-light);
  border-radius: var(--border-radius);
  box-shadow: 0 2px 6px rgba(0, 0, 0, .16);
  color: var(--text-primary-color);
  display: flex;
  flex-wrap: wrap;
  font-family: var(--font-base);
  font-size: 13px;
  font-weight: normal;
  justify-content: center;
  height: auto;
  left: 50%;
  min-width: 64px;
  opacity: 0;
  padding: 5px 8px;
  pointer-events: none;
  position: absolute;
  text-transform: none;
  top: 34px;
  white-space: nowrap;
  z-index: 10;

  &.has-bigger-space {
    top: 42px;
  }

  &:after {
    border: 6px solid var(--input-bg-light);
    border-left-color: transparent;
    border-right-color: transparent;
    border-top-color: transparent;
    content: "";
    filter: drop-shadow(0 -1px 1px rgba(0, 0, 0, .08));
    height: 12px;
    left: 50%;
    position: absolute;
    top: -12px;
    transform: scale(.5) translateX(-50%);
    transform-origin: center center;
    width: 12px;
  }
}

.has-tooltip {
  position: relative;

  &:hover {
    .ui-top-menu-tooltip {
      opacity: 1;
      transform: scale(1) translateX(-50%);
    }
  }
}
</style>
