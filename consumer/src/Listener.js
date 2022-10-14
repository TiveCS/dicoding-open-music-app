class Listener {
  constructor(playlistsService, mailSender) {
    this._playlistsService = playlistsService;
    this._mailSender = mailSender;

    this.listen = this.listen.bind(this);
  }

  async listen(message) {
    try {
      const { targetEmail, playlistId } = JSON.parse(
        message.content.toString()
      );

      const playlist = await this._playlistsService.getPlaylistById(playlistId);
      const songs = await this._playlistsService.getSongsFromPlaylist(
        playlistId
      );

      const playlistMessage = {
        ...playlist,
        songs,
      };

      const result = await this._mailSender.sendMail(
        targetEmail,
        JSON.stringify(playlistMessage)
      );

      console.log({
        result,
      });
    } catch (error) {
      console.error(error);
    }
  }
}

module.exports = Listener;
