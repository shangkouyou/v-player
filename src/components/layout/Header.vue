<template>
  <v-app-bar
    app
    fixed
    dense
    flat
    class="app_header"
  >
    <drawer-toggle class="ml-0"/>
    <v-spacer />
    <default-input
      v-model="keywords"
      :holder="$t('common.search_type_2')"
      :icon="icon.mdiMagnify"
      class="search_input"
      @enter="goSearch"
    />
  </v-app-bar>
</template>

<script>
import { get } from 'vuex-pathify'
import DefaultInput from '@components/default/Input'
import { mdiMagnify } from '@mdi/js'
import DrawerToggle from '@components/layout/DrawerToggle'
export default {
  name: 'DefaultHeader',
  components: {
    DrawerToggle,
    DefaultInput,
  },
  inject: ['theme'],
  data: () => ({
    icon: {mdiMagnify},
    keywords: '',
  }),
  computed: {
    account: get('settings/account'),
  },
  methods: {
    goSearch() {
      const {name, params} = this.$route;
      if (!this.keywords) return;
      if (name === 'search' && params.keywords === this.keywords) return;
      this.$router.push({
        name: 'search',
        params: { keywords: this.keywords },
      });
    },
  },
}
</script>
<style scoped lang="scss">
.app_header {
  -webkit-app-region: drag;
  .search_input {
    max-width: 15vw;
  }
}
</style>
