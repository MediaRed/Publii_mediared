<template>
    <YoutubeVue
      ref="youtube"
      :videoid="video.video_id"
      :loop="video.loop"
      :width="480"
      :height="320"
      :modestbranding="1"
      :controls="1"
      @ended="onEnded"
      @paused="onPaused"
      @played="onPlayed"
    />
  </template>
  
  <script>
   // require styles
    import YoutubeVue  from 'youtube-vue';

    export default {
      name: "video",
      data() {
        return {
          video:{ video_id: "3eNcwZSoRA0", loop: 1 },
          temp: { video_id: "3P1CnWI62Ik", loop: 1 },
          play: { video_id: "3P1CnWI62Ik", loop: 1 },
        };
      },
      components: {
        YoutubeVue,
      },
      methods: {
        applyConfig() {
          this.play = Object.assign(this.play, this.temp);
        },
        playCurrentVideo() {
          this.$refs.youtube.player.playVideo();
        },
        stopCurrentVideo() {
          this.$refs.youtube.player.stopVideo();
        },
        pauseCurrentVideo() {
          this.$refs.youtube.player.pauseVideo();
        },
        onEnded() {
          console.log("## OnEnded");
          this.$refs.youtube.player.playVideo();
        },
        onPaused() {
          console.log("## OnPaused");
        },
        onPlayed() {
          console.log("## OnPlayed");
        },
      },
    };
  </script>