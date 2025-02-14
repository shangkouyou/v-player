<template>
  <v-hover v-slot="{ hover }">
    <v-list-item
      :value="song.id"
      :data-id="song.id"
      @click="noop"
      @dblclick="play"
      @contextmenu.prevent="openMenu"
      class="song-bar-wrapper"
      :class="{ 'v-list-item--active': active }"
    >
      <v-card class="mr-4" flat>
        <v-overlay :value="hover || active" absolute>
          <v-btn icon @click="play">
            <v-icon v-text="mdiPlay" />
          </v-btn>
        </v-overlay>
        <v-img
          :src="$ochain(album, 'picUrl') | sizeOfImage(64)"
          max-height="40"
          max-width="40"
          class="rounded"
          lazy-src="@assets/default-cover.svg"
        />
      </v-card>
      <v-list-item-content>
        <v-list-item-title v-text="song.name" />
        <v-list-item-subtitle>
          <span v-for="(artist, index) in artists" :key="index">
            <router-link :to="`/artist/${artist.id}`" class="artist-name">
              {{ artist.name }}
            </router-link>
            <span v-if="index !== artists.length - 1"> · </span>
          </span>
        </v-list-item-subtitle>
      </v-list-item-content>
      <v-list-item-action class="d-flex flex-row align-center song-btns">
        <v-btn v-show="hover" icon color="primary" @click.prevent="openMenu">
          <v-icon>
            {{ mdiDotsHorizontal }}
          </v-icon>
        </v-btn>
        <v-list-item-action-text v-show="!hover">
          {{ song.dt || song.duration | formatDuring }}
        </v-list-item-action-text>
      </v-list-item-action>
    </v-list-item>
  </v-hover>
</template>
<script>
import { mdiDotsHorizontal, mdiPlay } from '@mdi/js';
import { dispatch, get } from 'vuex-pathify';

export default {
  name: 'SongBar',
  props: {
    song: {
      type: Object,
      default: () => ({}),
    },
  },
  data: () => ({
    mdiDotsHorizontal,
    mdiPlay,
  }),
  computed: {
    current: get('music/track@id'),
    active() {
      return this.song.id === this.current;
    },
    menuItems() {
      const metadata = {
        id: this.song.id,
        type: 'track',
        fileName: `${this.song.name}`,
      };
      const items = [
        { title: '播放', action: 'play', metadata },
        { title: '收藏到歌单', action: 'add', metadata },
        { title: '下载', action: 'download', metadata },
      ];
      if (this.song?.al.id) {
        items.unshift({
          title: '前往专辑页',
          action: 'goto',
          metadata: { type: 'album', id: this.song?.al?.id },
        });
      }
      if (!this.$store.getters['music/liked'](this.song.id)) {
        items.push({ title: '添加到喜欢', action: 'sub', metadata });
      }
      return items;
    },
    artists() {
      const { ar, artists } = this.song;
      const art = ar ?? artists ?? [];
      return art.map((i) => ({ id: i.id, name: i.name }));
    },
    album() {
      const { al, album } = this.song;
      return al ?? album;
    },
  },
  methods: {
    play() {
      if (this.song?.id) {
        this.$player.updatePlayerTrack(this.song?.id);
        this.$emit('played', this.song.id);
      }
    },
    more() {},
    noop() {},
    openMenu(e) {
      const { clientX: x, clientY: y } = e;
      dispatch('contextmenu/show', { x, y, items: this.menuItems });
    },
  },
};
</script>
<style scoped lang="scss">
.song-bar-wrapper {
  color: var(--v-primary-base);
  &::before {
    border-radius: $border-radius-root * 4;
  }
}
.artist-name {
  text-decoration: none;
  &:hover {
    text-decoration: underline;
  }
}
</style>
