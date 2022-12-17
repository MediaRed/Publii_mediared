<template>
    <div
        :key="'card-item-view-' + id"
        class="options-sidebar-container">
        <div class="options-sidebar">
            <h2>
                <template v-if="cardItemID !== ''">{{ $t('card.editCardItem') }}</template>
                <template v-if="cardItemID === ''">{{ $t('card.addNewCardItem') }}</template>
            </h2>

            <span
                class="options-sidebar-close"
                name="sidebar-close"
                @click.prevent="hide()">
                &times;
            </span>

            <label
                :class="{ 'is-invalid': errors.indexOf('label') > -1 }"
                key="card-item-editor-field-label">
                <span>{{ $t('card.label') }}</span>
                <input
                    v-model="label"
                    :spellcheck="$store.state.currentSite.config.spellchecking"
                    @keyup="cleanError('label')"
                    type="text">
            </label>

            <label
                :class="{ 'is-invalid': errors.indexOf('type') > -1 }"
                key="card-item-editor-field-type">
                <span>{{ $t('card.type') }}</span>
                <v-select
                    v-model="type"
                    @click.native="cleanError('type')"
                    :options="linkTypes"
                    :searchable="false"
                    :custom-label="customTypeLabels"
                    :show-labels="false"
                    :placeholder="$t('card.selectItemType')"></v-select>
            </label>

            <label
                v-if="type === 'internal'"
                :class="{ 'is-invalid': errors.indexOf('internalLink') > -1 }"
                key="card-item-editor-field-internal">
                <span>{{ $t('card.internalLink') }}</span>
                <input
                    v-model="internalLink"
                    @keyup="cleanError('internalLink')"
                    spellcheck="false"
                    type="text" />
            </label>

            <label
                v-if="type === 'external'"
                :class="{ 'is-invalid': errors.indexOf('externalLink') > -1 }"
                key="card-item-editor-field-external">
                <span>{{ $t('card.externalURL') }}</span>
                <input
                    v-model="externalLink"
                    @keyup="cleanError('externalLink')"
                    spellcheck="false"
                    type="text" />
            </label>

            <label
                v-if="type === 'tag'"
                :class="{ 'is-invalid': errors.indexOf('tagPage') > -1 }"
                key="card-item-editor-field-tag">
                <span>{{ $t('tag.tagPage') }}</span>
                <v-select
                    ref="tagPagesSelect"
                    :options="tagPages"
                    @click.native="cleanError('tagPage')"
                    v-model="tagPage"
                    :custom-label="customTagLabels"
                    :close-on-select="true"
                    :show-labels="false"
                    @select="closeDropdown('tagPagesSelect')"
                    :placeholder="$t('tag.selectTagPage')"></v-select>
            </label>

            <label
                v-if="type === 'author'"
                :class="{ 'is-invalid': errors.indexOf('authorPage') > -1 }"
                key="card-item-editor-field-author">
                <span>{{ $t('author.authorPage') }}</span>
                <v-select
                    ref="authorPagesSelect"
                    :options="authorPages"
                    @click.native="cleanError('authorPage')"
                    v-model="authorPage"
                    :custom-label="customAuthorsLabels"
                    :close-on-select="true"
                    :show-labels="false"
                    @select="closeDropdown('authorPagesSelect')"
                    :placeholder="$t('author.selectAuthorPage')"></v-select>
            </label>

            <label
                v-if="type === 'post'"
                :class="{ 'is-invalid': errors.indexOf('postPage') > -1 }"
                key="card-item-editor-field-post">
                <span>{{ $t('post.postPage') }}</span>
                <v-select
                    ref="postPagesSelect"
                    :options="postPages"
                    @click.native="cleanError('postPage')"
                    v-model="postPage"
                    :custom-label="customPostLabels"
                    :close-on-select="true"
                    :show-labels="false"
                    @select="closeDropdown('postPagesSelect')"
                    :placeholder="$t('post.selectPostPage')"></v-select>
            </label>

            <label key="card-item-editor-field-title">
                <span>{{ $t('link.linkTitleAttribute') }}</span>
                <input
                    v-model="title"
                    :spellcheck="$store.state.currentSite.config.spellchecking"
                    type="text" />
            </label>

            <label key="card-item-editor-field-cssclass">
                <span>{{ $t('card.classCSS') }}</span>
                <input
                    v-model="cssClass"
                    spellcheck="false"
                    type="text" />
            </label>

            <label key="card-item-editor-field-target">
                <span>{{ $t('ui.linkTarget') }}:</span>
                <v-select
                    v-model="target"
                    :options="linkTargets"
                    :searchable="false"
                    :custom-label="customTargetLabels"
                    :show-labels="false"
                    :placeholder="$t('card.selectLinkTarget')"></v-select>
            </label>

            <label key="card-item-editor-field-rel">
                <span>{{ $t('link.linkRelAttribute') }}:</span>
                <input
                    v-model="rel"
                    spellcheck="false"
                    type="text" />
            </label>

            <div class="options-sidebar-buttons">
                <p-button
                    v-if="cardItemID !== ''"
                    type="primary"
                    @click.native="editCardItem">
                    {{ $t('ui.saveChanges') }}
                </p-button>

                <p-button
                    v-if="cardItemID === ''"
                    type="primary"
                    @click.native="addCardItem">
                    {{ $t('card.addCardItem') }}
                </p-button>

                <p-button
                    @click.native="hide()"
                    type="outline">
                    {{ $t('ui.cancel') }}
                </p-button>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'card-item-editor',
    data () {
        return {
            isVisible: false,
            id: '',
            cardItemID: '',
            parentID: '',
            cardID: '',
            label: '',
            title: '',
            type: '',
            target: '_self',
            rel: '',
            cssClass: '',
            isHidden: false,
            internalLink: '',
            externalLink: '',
            tagPage: '',
            authorPage: '',
            postPage: '',
            errors: []
        };
    },
    computed: {
        linkTypes () {
            return [
                'post',
                'tag',
                'tags',
                'author',
                'frontpage',
                'internal',
                'external',
                'separator'
            ];
        },
        tagPages () {
            return this.$store.state.currentSite.tags.filter(tag => tag.additionalData.indexOf('"isHidden":true') === -1).map(tag => tag.id);
        },
        linkTargets () {
            return [ '_self', '_blank' ];
        },
        authorPages () {
            return this.$store.state.currentSite.authors.map(author => author.username).sort((a, b) => {
                if (a.toLowerCase() < b.toLowerCase()) {
                    return -1;
                }

                if (a.toLowerCase() > b.toLowerCase()) {
                    return 1;
                }

                return 0;
            });
        },
        postPages () {
            return this.$store.state.currentSite.posts.filter(post => post.status.indexOf('published') > -1).map(post => post.id);
        }
    },
    mounted () {
        this.$bus.$on('show-card-item-editor', params => {
            console.log(params);
            this.reset();
            this.cardItemID = params.cardItemID || '';
            this.parentID = params.parentID || '';

            if(params.cardID || params.cardID === 0) {
                this.cardID = params.cardID;
            } else {
                this.cardID = '';
            }

            this.label = params.label || '';
            this.title = params.title || '';
            this.cssClass = params.cssClass || '';
            this.target = params.target || '_self';
            this.rel = params.rel || '';
            this.isHidden = params.isHidden || false;

            setTimeout(() => {
                this.type = params.type || '';
                this.setLinkValue(params.link);
            }, 0);
        });
    },
    methods: {
        customTypeLabels (value) {
            switch (value) {
                case 'post': return this.$t('post.postLink');
                case 'tag': return this.$t('tag.tagLink');
                case 'tags': return this.$t('tag.tagsListLink');
                case 'author': return this.$t('author.authorLink');
                case 'frontpage': return this.$t('ui.frontpageLink');
                case 'internal': return this.$t('card.internalLink');
                case 'external': return this.$t('card.externalLink');
                case 'separator': return this.$t('card.textSeparator');
            }
        },
        customTagLabels (value) {
            return this.$store.state.currentSite.tags.filter(tag => tag.additionalData.indexOf('"isHidden":true') === -1 && tag.id === value).map(tag => tag.name)[0];
        },
        customAuthorsLabels (value) {
            return this.$store.state.currentSite.authors.filter(author => author.username === value).map(author => author.name)[0];
        },
        customPostLabels (value) {
            return this.$store.state.currentSite.posts.filter(post => post.id === value).map(post => post.title)[0];
        },
        customTargetLabels (value) {
            switch (value) {
                case '_self': return this.$t('ui.sameWindow');
                case '_blank': return this.$t('ui.newWindow');
            }
        },
        closeDropdown (refID) {
            this.$refs[refID].isOpen = false;
        },
        reset () {
            this.cardItemID = Date.now();
            this.parentID = '';
            this.cardID = '';
            this.label = '';
            this.title = '';
            this.type = '';
            this.target = '_self';
            this.rel = '';
            this.cssClass = '';
            this.isHidden = false;
            this.internalLink = '';
            this.externalLink = '';
            this.tagPage = '';
            this.authorPage = '';
            this.postPage = '';
            this.errors = [];
        },
        hide () {
            this.reset();
            this.$bus.$emit('hide-card-item-editor');
        },
        validate() {
            this.errors = [];

            if(this.label === '') {
                this.errors.push('label');
            }

            if(!this.type) {
                this.errors.push('type');
            }

            if(this.type === 'post' && !(!!this.postPage)) {
                this.errors.push('postPage');
            }

            if(this.type === 'tag' && !(!!this.tagPage)) {
                this.errors.push('tagPage');
            }

            if(this.type === 'author' && !(!!this.authorPage)) {
                this.errors.push('authorPage');
            }

            if(this.type === 'external' && !(!!this.externalLink)) {
                this.errors.push('externalLink')
            }

            if(this.type === 'internal' && !(!!this.internalLink)) {
                this.errors.push('internalLink');
            }

            if(this.errors.length) {
                this.$bus.$emit('message-display', {
                    message: this.$t('ui.pleaseFillAllRequiredFields'),
                    type: 'warning',
                    lifeTime: 3
                });
            }

            return this.errors.length === 0;
        },
        cleanError (field) {
            let pos = this.errors.indexOf(field);

            if (pos !== -1) {
                this.errors.splice(pos, 1);
            }
        },
        addCardItem () {
            if (!this.validate()) {
                return;
            }

            let cardItem = {
                id: new Date().getTime(),
                label: this.label,
                title: this.title,
                type: this.type,
                target: this.target,
                rel: this.rel,
                link: this.getLinkValue(),
                cssClass: this.cssClass,
                isHidden: this.isHidden,
                items: []
            };

            if(this.parentID === '') {
                this.$store.commit('addNewCardItem', {
                    cardItem: cardItem,
                    cardID: this.cardID
                });
            } else {
                this.$store.commit('addNewSubcardItem', {
                    cardItem: cardItem,
                    cardID: this.cardID,
                    parentID: this.parentID
                });
            }

            this.hide();
            this.$bus.$emit('save-new-card-structure');
        },
        editCardItem () {
            if (!this.validate()) {
                return;
            }

            let cardItem = {
                id: this.cardItemID,
                label: this.label,
                title: this.title,
                type: this.type,
                target: this.target,
                rel: this.rel,
                link: this.getLinkValue(),
                cssClass: this.cssClass,
                isHidden: this.isHidden
            };

            this.$store.commit('editCardItem', {
                cardItem: cardItem,
                cardID: this.cardID
            });

            this.hide();
            this.$bus.$emit('save-new-card-structure');
        },
        getLinkValue () {
            let type = this.type;

            switch (type) {
                case 'post':      return parseInt(this.postPage, 10);
                case 'tag':       return parseInt(this.tagPage, 10);
                case 'tags':      return 'empty';
                case 'author':    return this.authorPage;
                case 'frontpage': return 'empty';
                case 'internal':  return this.internalLink;
                case 'external':  return this.externalLink;
                case 'separator': return '';
            }
        },
        setLinkValue (value) {
            this.internalLink = this.type === 'internal' ? value : '';
            this.externalLink = this.type === 'external' ? value : '';
            this.tagPage = this.type === 'tag' ? parseInt(value, 10) : '';
            this.authorPage = this.type === 'author' ? value : '';
            this.postPage = this.type === 'post' ? parseInt(value, 10) : '';
        }
    },
    beforeDestroy () {
        this.$bus.$off('show-card-item-editor');
    }
}
</script>

<style lang="scss" scoped>
@import '../scss/variables.scss';
@import '../scss/options-sidebar.scss';

.options-sidebar {

    h2 {
        margin-bottom: 1.2rem;
    }

    &-buttons {
        border: none;
        padding-top: 1.8rem;
    }
}
</style>
